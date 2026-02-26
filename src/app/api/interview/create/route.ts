import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, company, difficulty, voiceMode } = await req.json();

    const sessionType = (type || "dsa").replace("-", "_");

    await connectDB();

    const newSession = await Session.create({
      userId: session.user.id,
      type: sessionType,
      company: company || "general",
      difficulty: difficulty || "mid",
      voiceMode: voiceMode || false,
      messages: [],
      questions: [],
      completed: false,
    });

    return NextResponse.json({ sessionId: newSession._id.toString() });
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
