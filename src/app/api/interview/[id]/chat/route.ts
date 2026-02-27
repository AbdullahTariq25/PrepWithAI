import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import { COMPANY_PACKS } from "@/lib/constants";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function getSystemPrompt(type: string, company: string, difficulty: string): string {
  const companyConfig = COMPANY_PACKS.find((c) => c.id === company);
  const companyPersonality = companyConfig?.personality || "";
  const companyContext = companyConfig
    ? `\n\nCOMPANY CONTEXT: You are interviewing for ${companyConfig.name}. ${companyPersonality}\nCulture: ${companyConfig.culture || ""}`
    : "";

  const difficultyMap: Record<string, string> = {
    easy: "entry-level/new grad. Ask straightforward questions, be encouraging.",
    medium: "mid-level (2-5 years). Ask moderately challenging questions with follow-ups.",
    hard: "senior-level (5+ years). Ask complex questions, expect optimal solutions and trade-off discussions.",
    expert: "staff+ level (10+ years). Ask system-level questions, expect deep architectural thinking.",
  };

  const typePrompts: Record<string, string> = {
    dsa: "You are conducting a Data Structures & Algorithms interview. Present coding problems one at a time. Ask the candidate to explain their approach before coding. Push for optimal time/space complexity. Ask about edge cases. Give follow-up questions.",
    system_design: "You are conducting a System Design interview. Present a system to design. Guide through: requirements gathering, high-level design, detailed component design, scalability, and trade-offs. Ask probing questions about design choices.",
    behavioral: "You are conducting a Behavioral interview. Ask STAR-method questions about past experiences. Probe for specific examples, metrics, and outcomes. Focus on leadership, conflict resolution, and impact.",
    frontend: "You are conducting a Frontend Engineering interview. Ask about React/Vue concepts, CSS layout, JavaScript fundamentals, performance optimization, accessibility, and state management. Mix conceptual with practical.",
    backend: "You are conducting a Backend Engineering interview. Ask about API design, database modeling, caching, microservices, message queues, authentication, and system reliability.",
    full_stack: "You are conducting a Full Stack interview. Cover both frontend and backend topics. Ask about end-to-end feature implementation, API integration, database design, and deployment strategies.",
    full_loop: "You are conducting a full interview loop. Cycle through: 1) A coding/DSA question, 2) System design discussion, 3) Behavioral questions. Transition naturally between sections like a real on-site.",
    machine_learning: "You are conducting a Machine Learning interview. Ask about model selection, feature engineering, training/evaluation, MLOps, and deploying ML models to production. Test both theory and practical application.",
    mobile: "You are conducting a Mobile Development interview. Ask about iOS/Android development, React Native/Flutter, mobile architecture patterns, performance optimization, offline-first design, and app lifecycle.",
    devops: "You are conducting a DevOps/SRE interview. Ask about CI/CD pipelines, containerization, Kubernetes, monitoring/observability, incident response, infrastructure as code, and reliability engineering.",
    data_engineering: "You are conducting a Data Engineering interview. Ask about ETL pipelines, data warehousing, streaming vs batch processing, data modeling, Spark/Kafka, and data quality.",
    security: "You are conducting a Security Engineering interview. Ask about OWASP top 10, authentication/authorization, encryption, security architecture, threat modeling, and incident response.",
  };

  return `You are PrepWithAI, an expert technical interviewer.${companyContext}

${typePrompts[type] || typePrompts.dsa}

Difficulty level: ${difficultyMap[difficulty] || difficultyMap.medium}

RULES:
- Ask ONE question at a time
- Wait for the candidate's response before proceeding
- Provide brief, constructive feedback after each answer
- If the candidate is stuck, offer gentle guidance (but note it as a hint)
- Be professional but friendly
- After receiving an answer, internally evaluate it and move to the next question or follow-up
- Keep responses concise (under 200 words unless explaining a complex concept)
- Use markdown formatting for code blocks
- Do NOT reveal the full solution unless the candidate has attempted first`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userSession = await auth();
    if (!userSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { action, content } = await req.json();

    await connectDB();
    const session = await Session.findOne({ _id: id, userId: userSession.user.id });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const systemPrompt = getSystemPrompt(session.type, session.company, session.difficulty);
    const conversationHistory: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    for (const msg of session.messages) {
      conversationHistory.push({
        role: msg.role === "interviewer" ? "assistant" : "user",
        content: msg.content,
      });
    }

    let userMessage = "";
    let newQuestion = false;

    switch (action) {
      case "start":
        conversationHistory.push({ role: "user", content: "Please start the interview. Introduce yourself briefly and ask the first question." });
        break;
      case "message":
        userMessage = content;
        conversationHistory.push({ role: "user", content });
        break;
      case "hint":
        conversationHistory.push({ role: "user", content: "I'm stuck. Can you give me a small hint without revealing the full solution?" });
        session.hintsUsed = (session.hintsUsed || 0) + 1;
        break;
      case "skip":
        conversationHistory.push({ role: "user", content: "I'd like to skip this question. Please briefly explain the optimal approach, then move to the next question." });
        newQuestion = true;
        break;
      case "end": {
        conversationHistory.push({
          role: "user",
          content: `The interview is over. Provide a final assessment as JSON:
{
  "score": <0-100>,
  "grades": { "problemSolving": <0-100>, "communication": <0-100>, "codeQuality": <0-100>, "edgeCases": <0-100>, "timeManagement": <0-100> },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "tip": "one senior-level tip"
}`,
        });

        const endCompletion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: conversationHistory,
          temperature: 0.4,
          max_tokens: 800,
        });

        const endMessage = endCompletion.choices[0]?.message?.content || "";
        let overallScore = 0;
        let grades = { problemSolving: 0, communication: 0, codeQuality: 0, edgeCases: 0, timeManagement: 0 };
        try {
          const jsonMatch = endMessage.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            overallScore = parsed.score || 0;
            if (parsed.grades) grades = { ...grades, ...parsed.grades };
          }
        } catch { /* parsing failed */ }

        session.completed = true;
        session.overallScore = overallScore;
        session.grades = grades;
        session.messages.push({ id: `msg-${Date.now()}`, role: "interviewer", content: endMessage, timestamp: new Date(), isVoice: false });
        await session.save();

        return NextResponse.json({ message: endMessage, completed: true, score: overallScore, grades });
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiMessage = completion.choices[0]?.message?.content || "I apologize, I encountered an issue. Could you repeat that?";

    if (action === "message" && userMessage) {
      session.messages.push({ id: `msg-${Date.now()}-user`, role: "candidate", content: userMessage, timestamp: new Date(), isVoice: false });
    }
    session.messages.push({ id: `msg-${Date.now()}-ai`, role: "interviewer", content: aiMessage, timestamp: new Date(), isVoice: false });
    await session.save();

    return NextResponse.json({ message: aiMessage, newQuestion });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
