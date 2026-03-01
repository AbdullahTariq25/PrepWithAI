// ===========================================
// PrepWithAI — Groq API Usage Tracker
// Tracks usage and provides graceful degradation
// ===========================================

import connectDB from "./mongodb";
import ApiUsage from "@/models/ApiUsage";

const DAILY_LIMIT = parseInt(process.env.GROQ_DAILY_LIMIT || "1000", 10);

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export async function trackApiCall(tokens: number = 0, isError: boolean = false) {
  try {
    await connectDB();
    const today = getTodayDate();

    await ApiUsage.findOneAndUpdate(
      { date: today, provider: "groq" },
      {
        $inc: {
          totalCalls: 1,
          totalTokens: tokens,
          ...(isError ? { errorCount: 1 } : {}),
        },
        $set: { lastCalledAt: new Date() },
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    // Don't let tracking failures break the main flow
    console.error("API usage tracking error:", error);
  }
}

export async function checkApiLimit(): Promise<{
  allowed: boolean;
  remaining: number;
  total: number;
  limit: number;
}> {
  try {
    await connectDB();
    const today = getTodayDate();

    const usage = await ApiUsage.findOne({ date: today, provider: "groq" });
    const totalCalls = usage?.totalCalls || 0;

    return {
      allowed: totalCalls < DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - totalCalls),
      total: totalCalls,
      limit: DAILY_LIMIT,
    };
  } catch {
    // If we can't check, allow the call (fail open)
    return { allowed: true, remaining: DAILY_LIMIT, total: 0, limit: DAILY_LIMIT };
  }
}

export async function getUsageStats(days: number = 7) {
  try {
    await connectDB();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().split("T")[0];

    const stats = await ApiUsage.find({
      provider: "groq",
      date: { $gte: startStr },
    }).sort({ date: -1 });

    return stats;
  } catch {
    return [];
  }
}
