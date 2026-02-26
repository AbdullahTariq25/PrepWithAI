import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import UserProgress from "@/models/UserProgress";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();
    const interviewSession = await Session.findById(id);
    if (!interviewSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (interviewSession.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Build transcript from messages
    const transcript = interviewSession.messages
      .map(
        (m: { role: string; content: string }) => `${m.role}: ${m.content}`
      )
      .join("\n");

    // Generate comprehensive feedback with Groq
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert interview evaluator. Analyze the interview transcript and provide detailed, actionable feedback. Be specific about what was done well and what needs improvement. Return valid JSON only.`,
        },
        {
          role: "user",
          content: `Analyze this ${interviewSession.type.replace("_", " ")} interview transcript (${interviewSession.difficulty} level, targeting ${interviewSession.company}).

Transcript:
${transcript.slice(0, 6000)}

Return exactly this JSON structure (no markdown, no explanation):
{
  "overallScore": <number 0-100>,
  "scores": {
    "problemSolving": <number 0-10>,
    "communication": <number 0-10>,
    "codeQuality": <number 0-10>,
    "edgeCases": <number 0-10>,
    "timeManagement": <number 0-10>
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "summary": "2-3 sentence overall assessment of the candidate's performance",
  "recommendedTopics": ["topic1", "topic2"],
  "seniorTip": "One advanced tip a senior engineer would give"
}`,
        },
      ],
      max_tokens: 1200,
      temperature: 0.3,
    });

    let feedback;
    try {
      const text = response.choices[0]?.message?.content ?? "{}";
      const match = text.match(/\{[\s\S]*\}/);
      feedback = match ? JSON.parse(match[0]) : {};
    } catch {
      feedback = {
        overallScore: 60,
        scores: {
          problemSolving: 6,
          communication: 6,
          codeQuality: 6,
          edgeCases: 5,
          timeManagement: 6,
        },
        strengths: ["Attempted the problem"],
        improvements: ["Could improve explanation clarity"],
        summary: "The candidate showed basic understanding but could benefit from more practice.",
      };
    }

    // Calculate duration
    const duration = interviewSession.messages.length > 0
      ? Math.floor(
          (new Date().getTime() -
            new Date(interviewSession.createdAt).getTime()) /
            1000
        )
      : 0;

    // Save feedback to session
    await Session.findByIdAndUpdate(id, {
      overallScore: feedback.overallScore || 60,
      duration,
      completed: true,
    });

    // Update user progress
    await UserProgress.findOneAndUpdate(
      { userId: session.user.id },
      {
        $push: {
          dailyScores: {
            date: new Date(),
            score: feedback.overallScore || 60,
          },
        },
        $inc: { totalSessions: 1, totalTime: duration },
        $set: {
          [`skillScores.problemSolving`]: feedback.scores?.problemSolving
            ? feedback.scores.problemSolving * 10
            : undefined,
          [`skillScores.communication`]: feedback.scores?.communication
            ? feedback.scores.communication * 10
            : undefined,
          [`skillScores.codeQuality`]: feedback.scores?.codeQuality
            ? feedback.scores.codeQuality * 10
            : undefined,
          [`skillScores.edgeCases`]: feedback.scores?.edgeCases
            ? feedback.scores.edgeCases * 10
            : undefined,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Feedback generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
