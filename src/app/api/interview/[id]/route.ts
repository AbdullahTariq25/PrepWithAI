// ===========================================
// PrepWithAI — Get Interview Session
// GET /api/interview/[id]
// Returns full session data for the owner
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { notFound, forbidden, serverError } from "@/lib/response";
import Session from "@/models/Session";

async function handler(_req: NextRequest, { user, params }: AuthContext) {
  try {
    const { id } = params;

    const session = await Session.findById(id).lean();
    if (!session) {
      return notFound("Session not found");
    }

    // Ownership check
    if (session.userId.toString() !== user.id) {
      return forbidden("You do not have access to this session");
    }

    return Response.json({ session });
  } catch (error) {
    return serverError("Failed to get session", error);
  }
}

export const GET = withAuth(handler);
