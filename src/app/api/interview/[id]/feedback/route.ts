import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";
import Groq from "groq-sdk";
import { calculateNewElo } from "@/lib/utils";

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

    const transcript = interviewSession.messages
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert interview evaluator. Analyze the interview transcript and provide detailed, actionable feedback. Return valid JSON only.",
        },
        {
          role: "user",
          content: `Analyze this ${interviewSession.type.replace(/_/g, " ")} interview (${interviewSession.difficulty} level, ${interviewSession.company}).

Transcript:
${transcript.slice(0, 6000)}

Return exactly this JSON (no markdown):
{
  "overallScore": <0-100>,
  "grades": {
    "problemSolving": <0-100>,
    "communication": <0-100>,
    "codeQuality": <0-100>,
    "edgeCases": <0-100>,
    "timeManagement": <0-100>
  },
  "strengths": ["str1", "str2", "str3"],
  "improvements": ["imp1", "imp2", "imp3"],
  "summary": "2-3 sentence assessment",
  "recommendedTopics": ["topic1", "topic2"],
  "seniorTip": "one advanced tip"
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
        grades: { problemSolving: 60, communication: 60, codeQuality: 60, edgeCases: 50, timeManagement: 60 },
        strengths: ["Attempted the problem"],
        improvements: ["Could improve clarity"],
        summary: "Basic understanding shown. More practice recommended.",
        seniorTip: "Focus on articulating your thought process clearly.",
      };
    }

    const duration = interviewSession.messages.length > 0
      ? Math.floor((Date.now() - new Date(interviewSession.createdAt).getTime()) / 1000)
      : 0;

    const grades = feedback.grades || { problemSolving: 0, communication: 0, codeQuality: 0, edgeCases: 0, timeManagement: 0 };
    const overallScore = feedback.overallScore || 60;

    // ELO calculation
    const user = await User.findById(session.user.id);
    const currentElo = user?.eloRating || 1200;
    const difficultyElo: Record<string, number> = { easy: 1000, medium: 1300, hard: 1600, expert: 1900 };
    const expectedDifficulty = difficultyElo[interviewSession.difficulty] || 1300;
    const newElo = calculateNewElo(currentElo, expectedDifficulty, overallScore, 100);
    const eloChange = newElo - currentElo;

    // Update session
    await Session.findByIdAndUpdate(id, {
      overallScore,
      grades,
      duration,
      completed: true,
      reportGenerated: true,
    });

    // Update user ELO + streak
    const streakUpdate = overallScore >= 60
      ? { $inc: { currentStreak: 1 }, $max: { maxStreak: (user?.currentStreak || 0) + 1 } }
      : { $set: { currentStreak: 0 } };

    await User.findByIdAndUpdate(session.user.id, {
      eloRating: newElo,
      $inc: { totalSessions: 1 },
      ...streakUpdate,
    });

    // Update user progress
    const categoryMap: Record<string, string> = {
      dsa: "dsa", system_design: "systemDesign", behavioral: "behavioral",
      frontend: "frontend", backend: "backend", full_stack: "backend",
      full_loop: "dsa", machine_learning: "backend", mobile: "frontend",
      devops: "backend", data_engineering: "backend", security: "backend",
    };
    const category = categoryMap[interviewSession.type] || "dsa";

    await UserProgress.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          eloRating: newElo,
          [`categoryScores.${category}`]: overallScore,
          [`skillScores.problemSolving`]: grades.problemSolving,
          [`skillScores.communication`]: grades.communication,
          [`skillScores.codeQuality`]: grades.codeQuality,
        },
        $push: { dailyScores: { date: new Date(), score: overallScore } },
        $inc: { totalSessions: 1, totalTime: duration },
      },
      { upsert: true }
    );

    return NextResponse.json({
      feedback: { ...feedback, eloChange, newElo, grades },
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
  }
}
