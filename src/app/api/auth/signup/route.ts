// ===========================================
// PrepWithAI — Signup Route
// POST /api/auth/signup
// Creates user with hashed password + welcome email
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";
import { signupSchema, validateBody } from "@/lib/validation";
import { created, badRequest, conflict, serverError } from "@/lib/response";
import { rateLimitAuth } from "@/lib/rateLimit";
import { tooManyRequests } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateCheck = rateLimitAuth(ip);
    if (!rateCheck.allowed) {
      return tooManyRequests("Too many signup attempts. Please try again later.", 900);
    }

    // Validate input
    const { data, error } = await validateBody(req, signupSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    await dbConnect();

    // Check existing user
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return conflict("An account with this email already exists");
    }

    // Create user (password hashing is handled by pre-save middleware)
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      plan: "pro",
    });

    // Create progress record
    await UserProgress.create({
      userId: user._id,
    });

    // Send welcome email (non-blocking)
    try {
      const { sendWelcomeEmail } = await import("@/lib/email");
      sendWelcomeEmail(data.email, data.name).catch(console.error);
    } catch {
      // Email service not configured — that's fine
    }

    return created({
      message: "Account created successfully — all features unlocked!",
      userId: user._id.toString(),
    });
  } catch (error) {
    return serverError("Failed to create account", error);
  }
}
