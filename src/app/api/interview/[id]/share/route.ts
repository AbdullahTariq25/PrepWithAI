// ===========================================
// PrepWithAI — Interview Share API
// Generate/toggle share token for sessions
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { success, notFound, badRequest, serverError } from "@/lib/response";
import Session from "@/models/Session";
import { Types } from "mongoose";

// ─── POST Toggle Share ──────────────────────────────

async function handler(req: NextRequest, ctx: AuthContext) {
  try {
    const { id } = ctx.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return badRequest("Invalid session ID");
    }

    const session = await Session.findOne({
      _id: id,
      userId: ctx.user.id,
    });

    if (!session) return notFound("Session not found");

    const body = await req.json().catch(() => ({}));
    const enabled = typeof body.enabled === "boolean" ? body.enabled : !session.isPublic;

    session.isPublic = enabled;

    // Generate share token if enabling and none exists
    if (enabled && !session.shareToken) {
      session.generateShareToken();
    }

    await session.save();

    return success({
      shareEnabled: session.isPublic,
      shareToken: session.isPublic ? session.shareToken : null,
      shareUrl: session.isPublic
        ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/share/${session.shareToken}`
        : null,
    });
  } catch (error) {
    return serverError("Failed to update sharing", error);
  }
}

// ─── Export ─────────────────────────────────────────

export const POST = withAuth(handler);
