// ===========================================
// PrepWithAI — Delete Account
// DELETE /api/user/delete
// Permanently removes user and all their data
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { success, serverError } from "@/lib/response";
import User from "@/models/User";
import Session from "@/models/Session";
import UserProgress from "@/models/UserProgress";

async function handler(_req: NextRequest, { user }: AuthContext) {
  try {
    // Delete all user data in parallel
    await Promise.all([
      User.findByIdAndDelete(user.id),
      Session.deleteMany({ userId: user.id }),
      UserProgress.deleteMany({ userId: user.id }),
    ]);

    return success({ message: "Account and all data permanently deleted" });
  } catch (error) {
    return serverError("Failed to delete account", error);
  }
}

export const DELETE = withAuth(handler);
