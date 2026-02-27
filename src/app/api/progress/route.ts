import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";

export async function GET() {
  try {
    const userSession = await auth();
    if (!userSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [user, progress, sessions] = await Promise.all([
      User.findById(userSession.user.id),
      UserProgress.findOne({ userId: userSession.user.id }),
      Session.find({ userId: userSession.user.id, completed: true })
        .sort({ createdAt: -1 })
        .select("overallScore duration createdAt type company difficulty grades")
        .limit(100)
        .lean(),
    ]);

    const totalSessions = sessions.length;
    const avgScore = totalSessions > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / totalSessions)
      : 0;
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    const dailyScores = sessions.slice(0, 30).map((s) => ({
      date: (s.createdAt as Date)?.toISOString() || new Date().toISOString(),
      score: s.overallScore || 0,
    }));

    const categoryBreakdown: Record<string, { total: number; count: number }> = {};
    for (const s of sessions) {
      const cat = s.type || "dsa";
      if (!categoryBreakdown[cat]) categoryBreakdown[cat] = { total: 0, count: 0 };
      categoryBreakdown[cat].total += s.overallScore || 0;
      categoryBreakdown[cat].count++;
    }
    const categoryScores: Record<string, number> = {};
    for (const [key, val] of Object.entries(categoryBreakdown)) {
      categoryScores[key] = val.count > 0 ? Math.round(val.total / val.count) : 0;
    }

    return NextResponse.json({
      totalSessions,
      avgScore,
      streak: user?.currentStreak || 0,
      maxStreak: user?.maxStreak || 0,
      totalTime,
      eloRating: user?.eloRating || 1200,
      skillScores: progress?.skillScores || {
        problemSolving: 0, communication: 0, codeQuality: 0, edgeCases: 0, timeManagement: 0,
      },
      categoryScores: progress?.categoryScores || categoryScores,
      dailyScores,
      weeklyGoal: progress?.weeklyGoal || 5,
      sessionsThisWeek: progress?.sessionsThisWeek || 0,
      weakTopics: progress?.weakTopics || [],
      strongTopics: progress?.strongTopics || [],
    });
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json({ error: "Failed to get progress" }, { status: 500 });
  }
}
