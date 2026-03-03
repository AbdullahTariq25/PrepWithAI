// ===========================================
// PrepWithAI — Change Password
// PATCH /api/user/password
// Validates current password, sets new one
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { changePasswordSchema, validateBody } from "@/lib/validation";
import { success, badRequest, serverError } from "@/lib/response";
import User from "@/models/User";

async function handler(req: NextRequest, { user }: AuthContext) {
  try {
    const { data, error } = await validateBody(req, changePasswordSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    const dbUser = await User.findById(user.id).select("+password");
    if (!dbUser?.password) {
      return badRequest(
        "Password change not available for OAuth accounts. You signed in with Google or GitHub."
      );
    }

    // Verify current password
    const isValid = await dbUser.comparePassword(data.currentPassword);
    if (!isValid) {
      return badRequest("Current password is incorrect");
    }

    // Prevent setting same password
    const isSame = await dbUser.comparePassword(data.newPassword);
    if (isSame) {
      return badRequest("New password must be different from current password");
    }

    // Update password (pre-save middleware handles hashing)
    dbUser.password = data.newPassword;
    await dbUser.save();

    return success({ message: "Password updated successfully" });
  } catch (error) {
    return serverError("Failed to update password", error);
  }
}

export const PATCH = withAuth(handler);
