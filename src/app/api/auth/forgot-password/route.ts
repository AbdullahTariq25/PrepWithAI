// ===========================================
// PrepWithAI — Forgot Password API
// Sends password reset email with token
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { validateBody, forgotPasswordSchema } from "@/lib/validation";
import { badRequest, serverError } from "@/lib/response";
import { rateLimitAuth } from "@/lib/rateLimit";
import { tooManyRequests } from "@/lib/response";
import User from "@/models/User";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

// ─── POST Forgot Password ──────────────────────────

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

    const validated = await validateBody(req, forgotPasswordSchema);
    if (validated.error || !validated.data) return badRequest(validated.error || "Invalid input");

    await dbConnect();

    // Always return success to prevent email enumeration
    const successResponse = NextResponse.json(
      { message: "If an account exists with this email, a reset link has been sent." },
      { status: 200 }
    );

    const user = await User.findOne({ email: validated.data.email });
    if (!user) return successResponse;

    // Don't send reset for OAuth-only users (no password set)
    if (!user.password) return successResponse;

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store hashed token with 1-hour expiry
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // Send email with raw token (user will send it back, we'll hash and compare)
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Still return success to avoid leaking info
    }

    return successResponse;
  } catch (error) {
    return serverError("Failed to process request", error);
  }
}
