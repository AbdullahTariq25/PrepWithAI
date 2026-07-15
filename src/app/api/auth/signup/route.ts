// ===========================================
// PrepWithAI — Signup Route
// POST /api/auth/signup
// Creates user with hashed password + welcome email
// ===========================================

import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import UserProgress from "@/models/UserProgress";
import { signupSchema, validateBody } from "@/lib/validation";
import { badRequest, conflict, created, serverError, tooManyRequests } from "@/lib/response";
import { rateLimitAuth } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const rateCheck = await rateLimitAuth(ip);

    if (!rateCheck.allowed) {
      return tooManyRequests(
        "Too many signup attempts. Please try again later.",
        Math.max(1, Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
      );
    }

    const { data, error } = await validateBody(req, signupSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    await dbConnect();

    const email = data.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return conflict("An account with this email already exists");
    }

    const user = await User.create({
      name: data.name.trim(),
      email,
      password: data.password,
      plan: "free",
    });

    await UserProgress.create({
      userId: user._id,
    });

    try {
      const { sendWelcomeEmail } = await import("@/lib/email");
      void sendWelcomeEmail(email, data.name).catch(console.error);
    } catch {
      // Email is optional and must not block account creation.
    }

    return created({
      message: "Account created successfully",
      userId: user._id.toString(),
    });
  } catch (error) {
    return serverError("Failed to create account", error);
  }
}
