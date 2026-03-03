// ===========================================
// PrepWithAI — Settings API
// PATCH /api/settings
// Update user preferences and settings
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { settingsSchema, validateBody } from "@/lib/validation";
import { success, badRequest, serverError } from "@/lib/response";
import User from "@/models/User";

// ─── GET Settings ───────────────────────────────────

async function getHandler(_req: NextRequest, { user }: AuthContext) {
  try {
    const dbUser = await User.findById(user.id)
      .select(
        "emailNotifications weeklyReport voiceEnabled preferredLanguage timezone theme weeklyGoal"
      )
      .lean();

    if (!dbUser) {
      return badRequest("User not found");
    }

    return success({
      settings: {
        emailNotifications: dbUser.emailNotifications ?? true,
        weeklyReport: dbUser.weeklyReport ?? true,
        voiceEnabled: dbUser.voiceEnabled ?? false,
        preferredLanguage: dbUser.preferredLanguage ?? "javascript",
        timezone: dbUser.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
        theme: dbUser.theme ?? "dark",
        weeklyGoal: (dbUser as unknown as Record<string, unknown>).weeklyGoal ?? 5,
      },
    });
  } catch (error) {
    return serverError("Failed to fetch settings", error);
  }
}

// ─── PATCH Settings ─────────────────────────────────

async function patchHandler(req: NextRequest, { user }: AuthContext) {
  try {
    const { data, error } = await validateBody(req, settingsSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    // Build safe update object — only include fields that were provided
    const updateFields: Record<string, unknown> = {};

    if (data.emailNotifications !== undefined) updateFields.emailNotifications = data.emailNotifications;
    if (data.weeklyReport !== undefined) updateFields.weeklyReport = data.weeklyReport;
    if (data.voiceEnabled !== undefined) updateFields.voiceEnabled = data.voiceEnabled;
    if (data.preferredLanguage !== undefined) updateFields.preferredLanguage = data.preferredLanguage;
    if (data.timezone !== undefined) updateFields.timezone = data.timezone;
    if (data.theme !== undefined) updateFields.theme = data.theme;
    if (data.weeklyGoal !== undefined) updateFields.weeklyGoal = data.weeklyGoal;

    if (Object.keys(updateFields).length === 0) {
      return badRequest("No valid fields to update");
    }

    const updated = await User.findByIdAndUpdate(
      user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select(
      "emailNotifications weeklyReport voiceEnabled preferredLanguage timezone theme weeklyGoal"
    );

    if (!updated) {
      return badRequest("User not found");
    }

    return success({
      message: "Settings updated successfully",
      settings: {
        emailNotifications: updated.emailNotifications,
        weeklyReport: updated.weeklyReport,
        voiceEnabled: updated.voiceEnabled,
        preferredLanguage: updated.preferredLanguage,
        timezone: updated.timezone,
        theme: updated.theme,
        weeklyGoal: (updated as unknown as Record<string, unknown>).weeklyGoal,
      },
    });
  } catch (error) {
    return serverError("Failed to update settings", error);
  }
}

// ─── Exports ────────────────────────────────────────

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
