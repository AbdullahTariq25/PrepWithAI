import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { FREE_TRIAL_DAYS } from "@/lib/constants";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't allow trial if user is already on a paid plan
    if (user.plan !== "free") {
      return NextResponse.json(
        { error: "You already have an active paid plan" },
        { status: 400 }
      );
    }

    // Don't allow restarting a trial that already ended
    if (user.proTrialEndsAt && new Date(user.proTrialEndsAt) < new Date()) {
      return NextResponse.json(
        { error: "Your free trial has already been used. Upgrade to Pro to unlock all features." },
        { status: 400 }
      );
    }

    // Don't allow if trial is already active
    if (user.proTrialEndsAt && new Date(user.proTrialEndsAt) > new Date()) {
      const daysLeft = Math.ceil(
        (new Date(user.proTrialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return NextResponse.json({
        message: "Trial already active",
        proTrialEndsAt: user.proTrialEndsAt,
        daysRemaining: daysLeft,
      });
    }

    // Start the 14-day Pro trial
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + FREE_TRIAL_DAYS);

    user.proTrialStartedAt = now;
    user.proTrialEndsAt = trialEnd;
    await user.save();

    return NextResponse.json({
      message: `🎉 Your ${FREE_TRIAL_DAYS}-day Pro trial has started! All Pro features are now unlocked.`,
      proTrialStartedAt: now.toISOString(),
      proTrialEndsAt: trialEnd.toISOString(),
      daysRemaining: FREE_TRIAL_DAYS,
    });
  } catch (error) {
    console.error("Start trial error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
