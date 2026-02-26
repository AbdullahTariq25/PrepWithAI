import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { experienceLevel, targetCompany } = await req.json();
    await connectDB();
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        experienceLevel,
        targetCompany,
        onboarded: true,
      }
    );
    return NextResponse.json({ message: "Onboarding completed" });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
