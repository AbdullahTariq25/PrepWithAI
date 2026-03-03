// ===========================================
// PrepWithAI — Update User Profile
// PATCH /api/user/update
// Handles all profile field updates with
// Zod validation
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { updateProfileSchema, validateBody } from "@/lib/validation";
import { success, badRequest, serverError } from "@/lib/response";
import User from "@/models/User";

async function handler(req: NextRequest, { user }: AuthContext) {
  try {
    const { data, error } = await validateBody(req, updateProfileSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    // Build update object — only include fields that were provided
    const updateFields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateFields[key] = value;
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return badRequest("No fields to update");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password -passwordResetToken -passwordResetExpires");

    if (!updatedUser) {
      return badRequest("User not found");
    }

    return success({ user: updatedUser });
  } catch (error) {
    return serverError("Failed to update profile", error);
  }
}

export const PATCH = withAuth(handler);
