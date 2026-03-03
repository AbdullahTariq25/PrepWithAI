// ===========================================
// PrepWithAI — Progress Route
// GET /api/progress
// Returns comprehensive progress analytics
// including ELO history, skills, categories,
// heatmap, and performance insights
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { success, serverError } from "@/lib/response";
import Session from "@/models/Session";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";

async function handler(_req: NextRequest, { user }: AuthContext) {
  try {
    const [dbUser, progress, sessions] = await Promise.all([
      User.findById(user.id).lean(),
      UserProgress.findOne({ userId: user.id }).lean(),
      Session.find({ userId: user.id, completed: true })
        .sort({ createdAt: -1 })
        .select(
          "overallScore duration createdAt type company difficulty grades"
        )
        .limit(100)
        .lean(),
    ]);

    // Calculate stats from sessions
    const totalSessions = sessions.length;
    const avgScore =
      totalSessions > 0
        ? Math.round(
            sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) /
              totalSessions
          )
        : 0;
    const totalTime = sessions.reduce(
      (sum, s) => sum + (s.duration || 0),
      0
    );

    // Daily scores for charts
    const dailyScores = sessions.slice(0, 30).map((s) => ({
      date:
        (s.createdAt as Date)?.toISOString() || new Date().toISOString(),
      score: s.overallScore || 0,
    }));

    // Category breakdown from sessions
    const categoryBreakdown: Record<
      string,
      { total: number; count: number }
    > = {};
    for (const s of sessions) {
      const cat = s.type || "dsa";
      if (!categoryBreakdown[cat])
        categoryBreakdown[cat] = { total: 0, count: 0 };
      categoryBreakdown[cat].total += s.overallScore || 0;
      categoryBreakdown[cat].count++;
    }
    const computedCategoryScores: Record<string, number> = {};
    for (const [key, val] of Object.entries(categoryBreakdown)) {
      computedCategoryScores[key] =
        val.count > 0 ? Math.round(val.total / val.count) : 0;
    }

    // Difficulty breakdown
    const difficultyBreakdown: Record<
      string,
      { total: number; count: number }
    > = {};
    for (const s of sessions) {
      const diff = s.difficulty || "mid";
      if (!difficultyBreakdown[diff])
        difficultyBreakdown[diff] = { total: 0, count: 0 };
      difficultyBreakdown[diff].total += s.overallScore || 0;
      difficultyBreakdown[diff].count++;
    }
    const performanceByDifficulty: Record<string, number> = {};
    for (const [key, val] of Object.entries(difficultyBreakdown)) {
      performanceByDifficulty[key] =
        val.count > 0 ? Math.round(val.total / val.count) : 0;
    }

    // ELO history from progress
    const eloHistory = progress?.eloHistory || [];

    // Build skill breakdown array from skillScores
    const rawSkills = progress?.skillScores || {
      problemSolving: 0,
      communication: 0,
      codeQuality: 0,
      edgeCases: 0,
      timeManagement: 0,
    };
    const skillBreakdown = Object.entries(
      rawSkills as Record<string, number>
    ).map(([skill, score]) => ({
      skill,
      score: typeof score === "number" ? score : 0,
    }));

    // Build activity heatmap from sessions
    const heatmapArr: { date: string; count: number }[] = [];
    const heatmapMap = new Map<string, number>();
    for (const s of sessions) {
      const dateKey = new Date(s.createdAt as Date)
        .toISOString()
        .split("T")[0];
      heatmapMap.set(dateKey, (heatmapMap.get(dateKey) || 0) + 1);
    }
    heatmapMap.forEach((count, date) =>
      heatmapArr.push({ date, count })
    );

    // Best score
    const bestScore =
      sessions.length > 0
        ? Math.max(...sessions.map((s) => s.overallScore || 0))
        : 0;

    // Recent scores
    const recentScores = sessions
      .slice(0, 10)
      .map((s) => s.overallScore || 0);

    return success({
      // Core stats (used by dashboard page)
      totalSessions,
      avgScore,
      streak: dbUser?.currentStreak || 0,
      maxStreak: dbUser?.maxStreak || 0,
      totalTime,
      eloRating: dbUser?.eloRating || 1200,

      // Aliases for progress page
      averageScore: avgScore,
      currentStreak: dbUser?.currentStreak || 0,
      totalPracticeTime: totalTime,
      bestScore,

      // Skills (both formats)
      skillScores: rawSkills,
      skillBreakdown,

      // Categories
      categoryScores:
        progress?.categoryScores || computedCategoryScores,

      // Charts (both formats)
      dailyScores,
      scoreHistory: dailyScores,
      eloHistory,
      recentScores,

      // Goals (both formats)
      weeklyGoal: progress?.weeklyGoal || 5,
      sessionsThisWeek: progress?.sessionsThisWeek || 0,
      weeklyCompleted: progress?.sessionsThisWeek || 0,

      // Topics
      weakTopics: progress?.weakTopics || [],
      strongTopics: progress?.strongTopics || [],

      // Activity heatmap
      activityHeatmap: heatmapArr,

      // Extras
      performanceByDifficulty,
    });
  } catch (error) {
    return serverError("Failed to get progress", error);
  }
}

export const GET = withAuth(handler);
