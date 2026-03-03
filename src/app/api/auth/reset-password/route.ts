// ===========================================
// PrepWithAI — Reset Password API
// Validates token and resets password
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { validateBody, resetPasswordSchema } from "@/lib/validation";
import { success, badRequest, serverError } from "@/lib/response";
import { rateLimitAuth } from "@/lib/rateLimit";
import { tooManyRequests } from "@/lib/response";
import User from "@/models/User";
import crypto from "crypto";

// ─── POST Reset Password ────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimitAuth(ip);
    if (!rl.allowed) {
      return tooManyRequests(
        "Too many attempts. Please try again later.",
        Math.ceil((rl.resetAt - Date.now()) / 1000)
      );
    }

    const validated = await validateBody(req, resetPasswordSchema);
    if (validated.error || !validated.data) return badRequest(validated.error || "Invalid input");

    const { token, password } = validated.data;

    await dbConnect();

    // Hash the provided token and look it up
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires +password");

    if (!user) {
      return badRequest("Invalid or expired reset token");
    }

    // Set new password (pre-save hook will hash it)
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return success({ message: "Password has been reset successfully" });
  } catch (error) {
    return serverError("Failed to reset password", error);
  }
}
