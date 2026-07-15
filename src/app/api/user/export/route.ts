import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { serverError } from "@/lib/response";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";
import Session from "@/models/Session";
import StudyGroup from "@/models/StudyGroup";
import FlashcardProgress from "@/models/FlashcardProgress";
import ApiUsage from "@/models/ApiUsage";

async function handler(_req: NextRequest, ctx: AuthContext) {
  try {
    const [account, progress, sessions, studyGroups, flashcards, apiUsage] =
      await Promise.all([
        User.findById(ctx.user.id)
          .select("-password -passwordResetToken -passwordResetExpires")
          .lean(),
        UserProgress.findOne({ userId: ctx.user.id }).lean(),
        Session.find({ userId: ctx.user.id }).sort({ createdAt: 1 }).lean(),
        StudyGroup.find({
          $or: [{ ownerId: ctx.user.id }, { memberIds: ctx.user.id }],
        })
          .select("name description category tags maxMembers isPublic ownerId memberIds nextSessionAt createdAt updatedAt")
          .sort({ createdAt: 1 })
          .lean(),
        FlashcardProgress.find({ userId: ctx.user.id })
          .sort({ createdAt: 1 })
          .lean(),
        ApiUsage.find({ userId: ctx.user.id }).sort({ date: 1 }).lean(),
      ]);

    const exportedAt = new Date();
    const payload = {
      export: {
        product: "PrepWithAI",
        schemaVersion: "1.0",
        exportedAt: exportedAt.toISOString(),
        note: "This archive contains the core account and practice data associated with your PrepWithAI user id.",
      },
      account,
      progress,
      sessions,
      studyGroups,
      flashcardProgress: flashcards,
      aiUsage: apiUsage,
    };

    const date = exportedAt.toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="prepwithai-data-${date}.json"`,
        "Cache-Control": "no-store, private",
      },
    });
  } catch (error) {
    return serverError("Failed to export account data", error);
  }
}

export const GET = withAuth(handler);
