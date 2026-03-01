import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // All users get pro plan — everything is free
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      plan: "pro",
    });

    // Try sending welcome email (non-blocking, won't fail signup)
    try {
      const { sendWelcomeEmail } = await import("@/lib/email");
      sendWelcomeEmail(email, name).catch(console.error);
    } catch {
      // Email service not configured — that's fine
    }

    return NextResponse.json(
      {
        message: "Account created successfully — all features unlocked!",
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
