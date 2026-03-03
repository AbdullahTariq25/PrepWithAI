// ===========================================
// PrepWithAI — Feedback Route
// POST /api/interview/[id]/feedback
// Generates comprehensive AI feedback, updates
// ELO, streak, progress, and user stats
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { notFound, forbidden, serverError } from "@/lib/response";
import { generateFeedback } from "@/lib/groq";
import { calculateNewElo } from "@/lib/utils";
import Session from "@/models/Session";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";

async function handler(_req: NextRequest, { user, params }: AuthContext) {
  try {
    const { id } = params;

    const interviewSession = await Session.findById(id);
    if (!interviewSession) {
      return notFound("Session not found");
    }
    if (interviewSession.userId.toString() !== user.id) {
      return forbidden("You do not have access to this session");
    }

    // Build transcript from messages
    const transcript = interviewSession.messages
      .map(
        (m: { role: string; content: string }) =>
          `${m.role === "interviewer" ? "Interviewer" : "Candidate"}: ${m.content}`
      )
      .join("\n");

    // Generate AI feedback
    const feedback = await generateFeedback(
      transcript,
      interviewSession.type,
      interviewSession.difficulty,
      interviewSession.company,
      user.id
    );

    // Calculate duration
    const duration =
      interviewSession.messages.length > 0
        ? Math.floor(
            (Date.now() -
              new Date(interviewSession.createdAt).getTime()) /
              1000
          )
        : 0;

    // ─── ELO Calculation ────────────────────────────

    const dbUser = await User.findById(user.id);
    const currentElo = dbUser?.eloRating || 1200;
    const difficultyElo: Record<string, number> = {
      easy: 1000,
      mid: 1300,
      hard: 1600,
      expert: 1900,
    };
    const expectedDifficulty =
      difficultyElo[interviewSession.difficulty] || 1300;
    const newElo = calculateNewElo(
      currentElo,
      expectedDifficulty,
      feedback.overallScore,
      100
    );
    const eloChange = newElo - currentElo;

    // ─── Update Session ─────────────────────────────

    await Session.findByIdAndUpdate(id, {
      overallScore: feedback.overallScore,
      grades: feedback.grades,
      duration,
      completed: true,
      reportGenerated: true,
      eloChange,
      eloAfter: newElo,
      strengths: feedback.strengths,
      improvements: feedback.improvements,
      summary: feedback.summary,
      seniorTip: feedback.seniorTip,
      recommendedTopics: feedback.recommendedTopics,
    });

    // ─── Update User Stats ──────────────────────────

    if (dbUser) {
      // Update streak
      await dbUser.updateStreak();

      // Update aggregate stats
      const allSessions = await Session.find({
        userId: user.id,
        completed: true,
      })
        .select("overallScore")
        .lean();

      const totalSessions = allSessions.length;
      const avgScore =
        totalSessions > 0
          ? Math.round(
              allSessions.reduce(
                (sum, s) => sum + (s.overallScore || 0),
                0
              ) / totalSessions
            )
          : 0;

      await User.findByIdAndUpdate(user.id, {
        eloRating: newElo,
        totalSessions,
        avgScore,
        lastActiveDate: new Date(),
      });
    }

    // ─── Update UserProgress ────────────────────────

    const categoryMap: Record<string, string> = {
      dsa: "dsa",
      system_design: "systemDesign",
      behavioral: "behavioral",
      frontend: "frontend",
      backend: "backend",
      full_stack: "backend",
      full_loop: "dsa",
      machine_learning: "backend",
      mobile: "frontend",
      devops: "backend",
      data_engineering: "backend",
      security: "backend",
    };
    const category = categoryMap[interviewSession.type] || "dsa";

    const today = new Date().toISOString().split("T")[0];

    await UserProgress.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          eloRating: newElo,
          [`categoryScores.${category}`]: feedback.overallScore,
          "skillScores.problemSolving":
            feedback.grades.problemSolving,
          "skillScores.communication":
            feedback.grades.communication,
          "skillScores.codeQuality": feedback.grades.codeQuality,
          "skillScores.edgeCases": feedback.grades.edgeCases,
          "skillScores.timeManagement":
            feedback.grades.timeManagement,
          weakTopics: feedback.recommendedTopics,
        },
        $push: {
          dailyScores: {
            date: new Date(),
            score: feedback.overallScore,
            sessions: 1,
          },
          eloHistory: {
            date: new Date(),
            rating: newElo,
            change: eloChange,
          },
        },
        $inc: {
          totalSessions: 1,
          totalTime: duration,
          [`heatmap.${today}`]: 1,
        },
      },
      { upsert: true }
    );

    // ─── Send completion email (non-blocking) ───────

    try {
      const { sendSessionCompletionEmail } = await import("@/lib/email");
      sendSessionCompletionEmail(
        dbUser?.email || "",
        dbUser?.name || "",
        feedback.overallScore,
        interviewSession.type,
        interviewSession.company,
        id
      ).catch(console.error);
    } catch {
      // Email not configured
    }

    return Response.json({
      feedback: {
        ...feedback,
        eloChange,
        newElo,
        duration,
      },
    });
  } catch (error) {
    return serverError("Failed to generate feedback", error);
  }
}

export const POST = withAuth(handler);
