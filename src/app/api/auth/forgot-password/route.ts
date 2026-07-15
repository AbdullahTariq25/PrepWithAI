// ===========================================
// PrepWithAI — Forgot Password API
// Sends password reset email with token
// ===========================================

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { validateBody, forgotPasswordSchema } from "@/lib/validation";
import { badRequest, serverError, tooManyRequests } from "@/lib/response";
import { rateLimitAuth } from "@/lib/rateLimit";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

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

    const validated = await validateBody(req, forgotPasswordSchema);
    if (validated.error || !validated.data) {
      return badRequest(validated.error || "Invalid input");
    }

    await dbConnect();

    // Always return the same response to prevent account enumeration.
    const successResponse = NextResponse.json(
      { message: "If an account exists with this email, a reset link has been sent." },
      { status: 200 },
    );

    const user = await User.findOne({ email: validated.data.email }).select("+password");
    if (!user?.password) return successResponse;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
    }

    return successResponse;
  } catch (error) {
    return serverError("Failed to process request", error);
  }
}
