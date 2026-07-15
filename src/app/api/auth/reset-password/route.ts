// ===========================================
// PrepWithAI — Reset Password API
// Validates token and resets password
// ===========================================

import crypto from "crypto";
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { validateBody, resetPasswordSchema } from "@/lib/validation";
import { success, badRequest, serverError, tooManyRequests } from "@/lib/response";
import { rateLimitAuth } from "@/lib/rateLimit";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const rateCheck = await rateLimitAuth(ip);
    if (!rateCheck.allowed) {
      return tooManyRequests(
        "Too many attempts. Please try again later.",
        Math.max(1, Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
      );
    }

    const validated = await validateBody(req, resetPasswordSchema);
    if (validated.error || !validated.data) {
      return badRequest(validated.error || "Invalid input");
    }

    const { token, password } = validated.data;
    await dbConnect();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires +password");

    if (!user) {
      return badRequest("Invalid or expired reset token");
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return success({ message: "Password has been reset successfully" });
  } catch (error) {
    return serverError("Failed to reset password", error);
  }
}
