import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

export async function GET() {
  try {
    const userSession = await auth();
    if (!userSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const sessions = await Session.find({ userId: userSession.user.id })
      .sort({ createdAt: -1 })
      .select("type company difficulty overallScore duration hintsUsed completed createdAt")
      .limit(50)
      .lean();

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json({ error: "Failed to get sessions" }, { status: 500 });
  }
}
