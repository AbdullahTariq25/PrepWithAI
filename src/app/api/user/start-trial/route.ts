import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { BILLING, trialDaysRemaining } from "@/lib/billing";

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

    if (user.plan !== "free") {
      return NextResponse.json(
        { error: "A paid plan is already active on this account." },
        { status: 400 },
      );
    }

    if (user.proTrialStartedAt) {
      const daysRemaining = trialDaysRemaining(user.proTrialEndsAt);
      if (daysRemaining > 0) {
        return NextResponse.json({
          message: "Your Pro trial is already active.",
          proTrialEndsAt: user.proTrialEndsAt,
          daysRemaining,
        });
      }

      return NextResponse.json(
        { error: "Your free trial has already been used. Upgrade to Pro to continue with Pro features." },
        { status: 400 },
      );
    }

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + BILLING.pro.trialDays);

    user.proTrialStartedAt = now;
    user.proTrialEndsAt = trialEnd;
    await user.save();

    return NextResponse.json({
      message: `Your ${BILLING.pro.trialDays}-day Pro trial has started.`,
      proTrialStartedAt: now.toISOString(),
      proTrialEndsAt: trialEnd.toISOString(),
      daysRemaining: BILLING.pro.trialDays,
    });
  } catch (error) {
    console.error("Start trial error:", error);
    return NextResponse.json(
      { error: "Unable to start the trial right now." },
      { status: 500 },
    );
  }
}
