import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";

export async function GET() {
  try {
    const userSession = await auth();
    if (!userSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(userSession.user.id);
    const sessions = await Session.find({
      userId: userSession.user.id,
      completed: true,
    })
      .sort({ createdAt: -1 })
      .select("overallScore duration createdAt")
      .lean();

    const totalSessions = sessions.length;
    const avgScore =
      totalSessions > 0
        ? Math.round(
            sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) /
              totalSessions
          )
        : 0;
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    const dailyScores = sessions.slice(0, 30).map((s) => ({
      date: s.createdAt?.toISOString() || new Date().toISOString(),
      score: s.overallScore || 0,
    }));

    return NextResponse.json({
      totalSessions,
      avgScore,
      streak: user?.streak || 0,
      totalTime,
      skills: {
        problemSolving: 0,
        codeQuality: 0,
        communication: 0,
        systemDesign: 0,
        edgeCases: 0,
        optimization: 0,
      },
      dailyScores,
    });
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json(
      { error: "Failed to get progress" },
      { status: 500 }
    );
  }
}
