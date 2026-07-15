// ===========================================
// PrepWithAI — Feedback Route
// POST /api/interview/[id]/feedback
// Generates or returns a cached calibrated report
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { notFound, forbidden, serverError } from "@/lib/response";
import { finalizeInterview } from "@/lib/finalizeInterview";
import Session from "@/models/Session";

async function handler(_req: NextRequest, { user, params }: AuthContext) {
  try {
    const { id } = params;
    const interviewSession = await Session.findById(id).select(
      "userId reportGenerated",
    );

    if (!interviewSession) {
      return notFound("Session not found");
    }

    if (interviewSession.userId.toString() !== user.id) {
      return forbidden("You do not have access to this session");
    }

    const feedback = await finalizeInterview(id, user.id);
    return Response.json({ feedback });
  } catch (error) {
    return serverError("Failed to generate feedback", error);
  }
}

export const POST = withAuth(handler);
