import { generateFeedback } from "@/lib/groq";
import { calculateNewElo } from "@/lib/utils";
import Session from "@/models/Session";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";

const DIFFICULTY_ELO: Record<string, number> = {
  junior: 1000,
  mid: 1300,
  senior: 1600,
  staff: 1900,
};

const CATEGORY_MAP: Record<string, string> = {
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

function dateKey(value: Date | string): string {
  return new Date(value).toISOString().split("T")[0];
}

function startOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

function blendScore(previous: unknown, next: number): number {
  const current = Number(previous || 0);
  if (!Number.isFinite(current) || current <= 0) return next;
  return Math.round(current * 0.7 + next * 0.3);
}

function persistedFeedback(session: InstanceType<typeof Session>) {
  return {
    overallScore: session.overallScore,
    grades: session.grades,
    strengths: session.strengths || [],
    improvements: session.improvements || [],
    summary: session.summary || "",
    seniorTip: session.seniorTip || "",
    recommendedTopics: session.recommendedTopics || [],
    evidence: session.feedbackEvidence || [],
    evaluationConfidence: session.evaluationConfidence || 0,
    nextPracticeFocus: session.nextPracticeFocus || "",
    hiringSignal: session.hiringSignal || "mixed",
    rubricVersion: session.rubricVersion || "1.0",
    eloChange: session.eloChange || 0,
    newElo: session.eloAfter || 1200,
    duration: session.duration || 0,
    cached: true,
  };
}

export async function finalizeInterview(sessionId: string, userId: string) {
  const existing = await Session.findOne({ _id: sessionId, userId });
  if (!existing) {
    throw new Error("Session not found");
  }

  if (existing.reportGenerated) {
    return persistedFeedback(existing);
  }

  const session = await Session.findOneAndUpdate(
    {
      _id: sessionId,
      userId,
      reportGenerated: { $ne: true },
      feedbackProcessing: { $ne: true },
    },
    { $set: { feedbackProcessing: true } },
    { new: true },
  );

  if (!session) {
    const latest = await Session.findOne({ _id: sessionId, userId });
    if (latest?.reportGenerated) return persistedFeedback(latest);
    throw new Error("Interview feedback is already being generated");
  }

  try {
    const transcript = session.messages
      .map(
        (message: { role: string; content: string }) =>
          `${message.role === "interviewer" ? "Interviewer" : "Candidate"}: ${message.content}`,
      )
      .join("\n");

    const feedback = await generateFeedback(
      transcript,
      session.type,
      session.difficulty,
      session.company,
      userId,
    );

    const duration = Math.max(
      session.duration || 0,
      session.messages.length > 0
        ? Math.floor((Date.now() - new Date(session.createdAt).getTime()) / 1000)
        : 0,
    );

    const dbUser = await User.findById(userId);
    const currentElo = dbUser?.eloRating || 1200;
    const expectedDifficulty = DIFFICULTY_ELO[session.difficulty] || 1300;
    const newElo = calculateNewElo(
      currentElo,
      expectedDifficulty,
      feedback.overallScore,
      100,
    );
    const eloChange = newElo - currentElo;

    await Session.findByIdAndUpdate(sessionId, {
      $set: {
        overallScore: feedback.overallScore,
        grades: feedback.grades,
        duration,
        completed: true,
        reportGenerated: true,
        feedbackProcessing: false,
        eloChange,
        eloAfter: newElo,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        summary: feedback.summary,
        seniorTip: feedback.seniorTip,
        recommendedTopics: feedback.recommendedTopics,
        feedbackEvidence: feedback.evidence,
        evaluationConfidence: feedback.evaluationConfidence,
        nextPracticeFocus: feedback.nextPracticeFocus,
        hiringSignal: feedback.hiringSignal,
        rubricVersion: feedback.rubricVersion,
        feedbackGeneratedAt: new Date(),
      },
    });

    if (dbUser) {
      await dbUser.updateStreak();

      const allSessions = await Session.find({
        userId,
        completed: true,
        reportGenerated: true,
      })
        .select("overallScore")
        .lean();

      const totalSessions = allSessions.length;
      const avgScore =
        totalSessions > 0
          ? Math.round(
              allSessions.reduce(
                (sum, item) => sum + (item.overallScore || 0),
                0,
              ) / totalSessions,
            )
          : 0;

      await User.findByIdAndUpdate(userId, {
        $set: {
          eloRating: newElo,
          totalSessions,
          avgScore,
          lastActiveDate: new Date(),
        },
      });
    }

    let progress = await UserProgress.findOne({ userId });
    if (!progress) progress = new UserProgress({ userId });

    const category = CATEGORY_MAP[session.type] || "dsa";
    progress.set(
      `categoryScores.${category}`,
      blendScore(progress.get(`categoryScores.${category}`), feedback.overallScore),
    );

    for (const [skill, score] of Object.entries(feedback.grades)) {
      progress.set(
        `skillScores.${skill}`,
        blendScore(progress.get(`skillScores.${skill}`), score),
      );
    }

    progress.eloRating = newElo;
    progress.eloHistory.push({
      date: new Date(),
      rating: newElo,
      change: eloChange,
    });
    progress.eloHistory = progress.eloHistory.slice(-200);

    const today = dateKey(new Date());
    const todayEntry = progress.dailyScores.find(
      (entry) => dateKey(entry.date) === today,
    );

    if (todayEntry) {
      const previousSessions = Math.max(todayEntry.sessions || 0, 1);
      todayEntry.score = Math.round(
        (todayEntry.score * previousSessions + feedback.overallScore) /
          (previousSessions + 1),
      );
      todayEntry.sessions = previousSessions + 1;
    } else {
      progress.dailyScores.push({
        date: new Date(),
        score: feedback.overallScore,
        sessions: 1,
      });
    }
    progress.dailyScores = progress.dailyScores.slice(-90);

    progress.heatmap.set(today, (progress.heatmap.get(today) || 0) + 1);
    progress.totalTime = (progress.totalTime || 0) + duration;
    progress.totalSessions = await Session.countDocuments({
      userId,
      completed: true,
      reportGenerated: true,
    });
    progress.sessionsThisWeek = await Session.countDocuments({
      userId,
      completed: true,
      reportGenerated: true,
      createdAt: { $gte: startOfCurrentWeek() },
    });
    progress.streak = dbUser?.currentStreak || progress.streak || 0;
    progress.maxStreak = Math.max(
      progress.maxStreak || 0,
      dbUser?.maxStreak || 0,
      progress.streak || 0,
    );
    progress.weakTopics = Array.from(
      new Set([...(feedback.recommendedTopics || []), ...(progress.weakTopics || [])]),
    ).slice(0, 12);

    if (session.company && session.company !== "general") {
      progress.companiesReadiness.set(
        session.company,
        blendScore(
          progress.companiesReadiness.get(session.company),
          feedback.overallScore,
        ),
      );
    }

    progress.performanceByDifficulty.set(
      session.difficulty,
      blendScore(
        progress.performanceByDifficulty.get(session.difficulty),
        feedback.overallScore,
      ),
    );

    await progress.save();

    if (dbUser?.email) {
      try {
        const { sendSessionCompletionEmail } = await import("@/lib/email");
        sendSessionCompletionEmail(
          dbUser.email,
          dbUser.name || "",
          feedback.overallScore,
          session.type,
          session.company,
          sessionId,
        ).catch(console.error);
      } catch {
        // Email is optional and must never block report generation.
      }
    }

    return {
      ...feedback,
      eloChange,
      newElo,
      duration,
      cached: false,
    };
  } catch (error) {
    await Session.findByIdAndUpdate(sessionId, {
      $set: { feedbackProcessing: false },
    }).catch(() => {});
    throw error;
  }
}
