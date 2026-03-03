// ===========================================
// PrepWithAI — Public Share API
// View shared interview sessions (no auth)
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Session from "@/models/Session";

// ─── GET Shared Session ─────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await dbConnect();
    const { token } = await params;

    if (!token || token.length < 8) {
      return NextResponse.json(
        { error: "Invalid share token" },
        { status: 400 }
      );
    }

    const session = await Session.findOne({
      shareToken: token,
      isPublic: true,
    })
      .select(
        "type company difficulty messages score feedback createdAt completedAt voiceMode"
      )
      .lean();

    if (!session) {
      return NextResponse.json(
        { error: "Session not found or sharing disabled" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      session: {
        ...(session as unknown as Record<string, unknown>),
        id: String((session as unknown as Record<string, unknown>)._id),
      },
    });
  } catch (error) {
    console.error("[Share] Error:", error);
    return NextResponse.json(
      { error: "Failed to load shared session" },
      { status: 500 }
    );
  }
}
