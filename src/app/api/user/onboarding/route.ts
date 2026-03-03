// ===========================================
// PrepWithAI — Onboarding
// POST /api/user/onboarding
// Marks user as onboarded with initial prefs
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { onboardingSchema, validateBody } from "@/lib/validation";
import { success, badRequest, serverError } from "@/lib/response";
import User from "@/models/User";

async function handler(req: NextRequest, { user }: AuthContext) {
  try {
    const { data, error } = await validateBody(req, onboardingSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    const updateFields: Record<string, unknown> = {
      onboarded: true,
    };

    if (data.experienceLevel) updateFields.experienceLevel = data.experienceLevel;
    if (data.targetCompany) updateFields.targetCompanies = [data.targetCompany];
    if (data.targetRole) updateFields.targetRole = data.targetRole;

    await User.findByIdAndUpdate(user.id, { $set: updateFields });

    return success({ message: "Onboarding completed" });
  } catch (error) {
    return serverError("Failed to complete onboarding", error);
  }
}

export const POST = withAuth(handler);
