import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { serverError } from "@/lib/response";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";
import Session from "@/models/Session";

const TYPE_LABELS: Record<string, string> = {
  dsa: "DSA",
  system_design: "System Design",
  behavioral: "Behavioral",
  frontend: "Frontend",
  backend: "Backend",
  full_stack: "Full Stack",
  full_loop: "Full Interview Loop",
  machine_learning: "Machine Learning",
  mobile: "Mobile",
  devops: "DevOps / SRE",
  data_engineering: "Data Engineering",
  security: "Security Engineering",
};

function daysUntil(value?: Date | null): number | null {
  if (!value) return null;
  const diff = new Date(value).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function chooseFocusType(
  preferredTypes: string[],
  categoryScores: Record<string, number>,
  latestType?: string,
): string {
  const categoryToType: Record<string, string> = {
    dsa: "dsa",
    systemDesign: "system_design",
    behavioral: "behavioral",
    frontend: "frontend",
    backend: "backend",
  };

  const scoredPreferences = preferredTypes
    .map((type) => {
      const category = Object.entries(categoryToType).find(([, value]) => value === type)?.[0];
      const score = category ? Number(categoryScores[category] || 0) : 0;
      return { type, score };
    })
    .sort((a, b) => a.score - b.score);

  const weakestMeasured = scoredPreferences.find((item) => item.score > 0);
  if (weakestMeasured) return weakestMeasured.type;

  const differentFromLatest = preferredTypes.find((type) => type !== latestType);
  return differentFromLatest || preferredTypes[0] || "dsa";
}

async function handler(_req: NextRequest, { user }: AuthContext) {
  try {
    const [dbUser, progress, recentSessions] = await Promise.all([
      User.findById(user.id)
        .select(
          "targetRole targetCompanies targetDate experienceLevel preferredInterviewTypes totalSessions avgScore",
        )
        .lean(),
      UserProgress.findOne({ userId: user.id }).lean(),
      Session.find({
        userId: user.id,
        completed: true,
        reportGenerated: true,
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .select(
          "type overallScore nextPracticeFocus recommendedTopics evaluationConfidence createdAt",
        )
        .lean(),
    ]);

    const preferredTypes = dbUser?.preferredInterviewTypes?.length
      ? dbUser.preferredInterviewTypes
      : ["dsa"];
    const latest = recentSessions[0];
    const categoryScores = (progress?.categoryScores || {}) as unknown as Record<
      string,
      number
    >;
    const focusType = chooseFocusType(
      preferredTypes,
      categoryScores,
      latest?.type,
    );

    const weeklyGoal = progress?.weeklyGoal || 5;
    const sessionsThisWeek = progress?.sessionsThisWeek || 0;
    const remainingThisWeek = Math.max(0, weeklyGoal - sessionsThisWeek);
    const targetDays = daysUntil(dbUser?.targetDate || null);

    const nextPracticeFocus =
      latest?.nextPracticeFocus ||
      (progress?.weakTopics?.[0]
        ? `Build a stronger response around ${progress.weakTopics[0]}.`
        : `Establish a baseline in ${TYPE_LABELS[focusType] || "your selected interview track"}.`);

    const cadence =
      targetDays !== null && targetDays <= 14
        ? "Interview date is close. Prioritize shorter, evidence-rich sessions and review each report before repeating."
        : remainingThisWeek > 0
          ? `Complete ${remainingThisWeek} more focused ${remainingThisWeek === 1 ? "session" : "sessions"} this week to stay on plan.`
          : "Weekly goal complete. Review your weakest signal before adding extra volume.";

    return Response.json({
      plan: {
        targetRole: dbUser?.targetRole || "Software Engineer",
        targetCompany: dbUser?.targetCompanies?.[0] || "general",
        targetDate: dbUser?.targetDate || null,
        daysUntilTarget: targetDays,
        experienceLevel: dbUser?.experienceLevel || "mid",
        preferredTypes,
        focusType,
        focusLabel: TYPE_LABELS[focusType] || focusType,
        nextPracticeFocus,
        weeklyGoal,
        sessionsThisWeek,
        remainingThisWeek,
        cadence,
        baselineEstablished: Boolean(dbUser?.totalSessions),
        averageScore: dbUser?.avgScore || 0,
        recentSessions: recentSessions.map((session) => ({
          id: session._id.toString(),
          type: session.type,
          typeLabel: TYPE_LABELS[session.type] || session.type,
          score: session.overallScore,
          nextPracticeFocus: session.nextPracticeFocus || "",
          evaluationConfidence: session.evaluationConfidence || 0,
          createdAt: session.createdAt,
        })),
      },
    });
  } catch (error) {
    return serverError("Failed to build preparation plan", error);
  }
}

export const GET = withAuth(handler);
