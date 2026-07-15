// ===========================================
// PrepWithAI — Onboarding
// POST /api/user/onboarding
// Persists preparation goals and initial preferences
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { onboardingSchema, validateBody } from "@/lib/validation";
import { success, badRequest, serverError } from "@/lib/response";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";

async function handler(req: NextRequest, { user }: AuthContext) {
  try {
    const { data, error } = await validateBody(req, onboardingSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    const updateFields: Record<string, unknown> = {
      onboarded: true,
    };

    if (data.experienceLevel) {
      updateFields.experienceLevel = data.experienceLevel;
    }
    if (data.targetCompany) {
      updateFields.targetCompanies = [data.targetCompany.toLowerCase()];
    }
    if (data.targetRole) {
      updateFields.targetRole = data.targetRole;
    }
    if (data.interviewTypes?.length) {
      updateFields.preferredInterviewTypes = Array.from(
        new Set(data.interviewTypes),
      );
    }
    if (data.targetDate) {
      updateFields.targetDate = new Date(data.targetDate);
    }

    await User.findByIdAndUpdate(user.id, { $set: updateFields });

    if (data.weeklyGoal) {
      await UserProgress.findOneAndUpdate(
        { userId: user.id },
        { $set: { weeklyGoal: data.weeklyGoal } },
        { upsert: true, new: true },
      );
    }

    return success({
      message: "Onboarding completed",
      preferences: {
        experienceLevel: data.experienceLevel,
        interviewTypes: data.interviewTypes || [],
        targetCompany: data.targetCompany,
        targetRole: data.targetRole,
        targetDate: data.targetDate || null,
        weeklyGoal: data.weeklyGoal || null,
      },
    });
  } catch (error) {
    return serverError("Failed to complete onboarding", error);
  }
}

export const POST = withAuth(handler);
