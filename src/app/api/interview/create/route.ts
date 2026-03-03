// ===========================================
// PrepWithAI — Create Interview Session
// POST /api/interview/create
// Creates a new session with type, company,
// difficulty, and mode configuration
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { createInterviewSchema, validateBody } from "@/lib/validation";
import { created, badRequest, serverError } from "@/lib/response";
import Session from "@/models/Session";

async function handler(req: NextRequest, { user }: AuthContext) {
  try {
    const { data, error } = await validateBody(req, createInterviewSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    const sessionType = data.type.replace(/-/g, "_");

    const newSession = await Session.create({
      userId: user.id,
      type: sessionType,
      company: (data.company || "general").toLowerCase(),
      difficulty: data.difficulty || "mid",
      voiceMode: data.voiceMode || false,
      videoMode: data.videoMode || false,
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
