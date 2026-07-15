import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { createInterviewSchema, validateBody } from "@/lib/validation";
import { created, badRequest, forbidden, serverError } from "@/lib/response";
import { BILLING, hasProAccess } from "@/lib/billing";
import Session from "@/models/Session";

async function handler(req: NextRequest, { user }: AuthContext) {
  try {
    const { data, error } = await validateBody(req, createInterviewSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    const sessionType = data.type.replace(/-/g, "_");
    const proAccess = hasProAccess(user);

    if (!proAccess) {
      if (sessionType !== "dsa") {
        return forbidden("This interview track requires Pro. Start your free trial or upgrade to continue.");
      }

      if (data.voiceMode || data.videoMode) {
        return forbidden("Voice and video interview modes require Pro.");
      }

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const sessionsToday = await Session.countDocuments({
        userId: user.id,
        createdAt: { $gte: startOfDay },
      });

      if (sessionsToday >= BILLING.free.sessionsPerDay) {
        return forbidden(
          `The Free plan includes ${BILLING.free.sessionsPerDay} interview sessions per day. Upgrade to Pro for unlimited practice.`,
        );
      }
    }

    const newSession = await Session.create({
      userId: user.id,
      type: sessionType,
      company: (data.company || "general").toLowerCase(),
      difficulty: data.difficulty || "mid",
      voiceMode: proAccess ? Boolean(data.voiceMode) : false,
      videoMode: proAccess ? Boolean(data.videoMode) : false,
      messages: [],
      questions: [],
      completed: false,
    });

    return created({
      sessionId: newSession._id.toString(),
      type: sessionType,
      company: newSession.company,
      difficulty: newSession.difficulty,
      voiceMode: newSession.voiceMode,
      videoMode: newSession.videoMode,
    });
  } catch (error) {
    return serverError("Failed to create interview session", error);
  }
}

export const POST = withAuth(handler);
