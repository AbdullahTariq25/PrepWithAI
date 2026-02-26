import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function getSystemPrompt(type: string, company: string, difficulty: string): string {
  const companyContext =
    company !== "general"
      ? `You are simulating a ${company} interview style. Tailor your questions and expectations to ${company}'s known interview patterns.`
      : "";

  const difficultyMap: Record<string, string> = {
    easy: "entry-level/new grad. Ask straightforward questions, be encouraging.",
    medium: "mid-level (2-5 years). Ask moderately challenging questions with follow-ups.",
    hard: "senior-level (5+ years). Ask complex questions, expect optimal solutions and trade-off discussions.",
    expert: "staff+ level (10+ years). Ask system-level questions, expect deep architectural thinking.",
  };

  const typePrompts: Record<string, string> = {
    dsa: `You are conducting a Data Structures & Algorithms interview. Present coding problems one at a time. Ask the candidate to explain their approach before coding. Push for optimal time/space complexity. Ask about edge cases. Give follow-up questions to test deeper understanding.`,
    system_design: `You are conducting a System Design interview. Present a system to design (e.g., "Design Twitter", "Design a URL shortener"). Guide the conversation through: requirements gathering, high-level design, detailed component design, scalability, and trade-offs. Ask probing questions about their design choices.`,
    behavioral: `You are conducting a Behavioral interview. Ask STAR-method questions about past experiences. Probe for specific examples, metrics, and outcomes. Ask follow-ups like "What would you do differently?" and "What did you learn?". Focus on leadership, conflict resolution, and impact.`,
    frontend: `You are conducting a Frontend Engineering interview. Ask about React concepts, CSS layout challenges, JavaScript fundamentals, performance optimization, accessibility, and state management. Mix conceptual questions with practical scenarios.`,
    backend: `You are conducting a Backend Engineering interview. Ask about API design, database modeling, caching strategies, microservices, message queues, authentication, and system reliability. Test both theoretical knowledge and practical problem-solving.`,
    full_loop: `You are conducting a full interview loop simulation. Cycle through: 1) A coding/DSA question, 2) A system design discussion, 3) Behavioral questions. Transition naturally between sections. This simulates a real on-site interview day.`,
  };

  return `You are PrepWithAI, an expert technical interviewer. ${companyContext}

${typePrompts[type] || typePrompts.dsa}

Difficulty level: ${difficultyMap[difficulty] || difficultyMap.medium}

RULES:
- Ask ONE question at a time
- Wait for the candidate's response before proceeding
- Provide brief, constructive feedback after each answer
- If the candidate is stuck, offer gentle guidance (but note it as a hint)
- Be professional but friendly
- After receiving an answer, score it internally and move to the next question or follow-up
- Keep responses concise (under 200 words unless explaining a complex concept)
- Use markdown formatting for code blocks and emphasis
- Do NOT reveal the full solution unless the candidate has attempted an answer first`;
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

    const session = await Session.findOne({
      _id: id,
      userId: userSession.user.id,
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const systemPrompt = getSystemPrompt(
      session.type,
      session.company,
      session.difficulty
    );

    // Build conversation history for Groq
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
        userMessage = "";
        conversationHistory.push({
          role: "user",
          content:
            "Please start the interview. Introduce yourself briefly and ask the first question.",
        });
        break;

      case "message":
        userMessage = content;
        conversationHistory.push({ role: "user", content });
        break;

      case "hint":
        conversationHistory.push({
          role: "user",
          content:
            "I'm stuck. Can you give me a small hint without revealing the full solution?",
        });
        session.hintsUsed = (session.hintsUsed || 0) + 1;
        break;

      case "skip":
        conversationHistory.push({
          role: "user",
          content:
            "I'd like to skip this question. Please briefly explain the optimal approach, then move to the next question.",
        });
        newQuestion = true;
        break;

      case "end":
        // Generate final summary
        conversationHistory.push({
          role: "user",
          content:
            "The interview is over. Please provide a brief overall assessment with: 1) Overall score (0-100), 2) Key strengths, 3) Areas to improve, 4) One senior-level tip. Format as JSON: {score, strengths: [], weaknesses: [], tip}",
        });

        const endCompletion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: conversationHistory,
          temperature: 0.4,
          max_tokens: 500,
        });

        const endMessage = endCompletion.choices[0]?.message?.content || "";

        // Try to parse the score
        let overallScore = 0;
        try {
          const jsonMatch = endMessage.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            overallScore = parsed.score || 0;
          }
        } catch {
          // Score parsing failed, use 0
        }

        session.completed = true;
        session.overallScore = overallScore;
        session.messages.push({
          id: `msg-${Date.now()}`,
          role: "interviewer",
          content: endMessage,
          timestamp: new Date(),
          isVoice: false,
        });
        await session.save();

        return NextResponse.json({
          message: endMessage,
          completed: true,
          score: overallScore,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get AI response from Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiMessage = completion.choices[0]?.message?.content || "I apologize, I encountered an issue. Could you repeat that?";

    // Save messages to session
    if (action === "message" && userMessage) {
      session.messages.push({
        id: `msg-${Date.now()}-user`,
        role: "candidate",
        content: userMessage,
        timestamp: new Date(),
        isVoice: false,
      });
    }

    session.messages.push({
      id: `msg-${Date.now()}-ai`,
      role: "interviewer",
      content: aiMessage,
      timestamp: new Date(),
      isVoice: false,
    });

    await session.save();

    return NextResponse.json({
      message: aiMessage,
      newQuestion,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
