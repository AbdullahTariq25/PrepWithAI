// ===========================================
// PrepWithAI — Cron Jobs API
// POST /api/cron
// Streak maintenance, weekly emails, analytics
// Protected by CRON_SECRET header
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";

// ─── Verify Cron Secret ─────────────────────────────

function verifyCronSecret(req: NextRequest): boolean {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn("[Cron] CRON_SECRET not configured");
    return false;
  }

  return secret === cronSecret;
}

// ─── POST /api/cron ─────────────────────────────────

export async function POST(req: NextRequest) {
  // Verify authorization
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const job = searchParams.get("job") || "all";

  await connectDB();

  const results: Record<string, { success: boolean; message: string; affected?: number }> = {};

  try {
    // ─── Job 1: Streak Maintenance ────────────────────
    if (job === "all" || job === "streaks") {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find users who have a streak but didn't complete a session yesterday
        const usersWithStreak = await User.find({
          currentStreak: { $gt: 0 },
        }).select("_id currentStreak lastActiveDate").lean();

        let streaksBroken = 0;

        for (const user of usersWithStreak) {
          const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

          // If last active was before yesterday, break the streak
          if (!lastActive || lastActive < yesterday) {
            await User.findByIdAndUpdate(user._id, {
              $set: { currentStreak: 0 },
            });
            streaksBroken++;
          }
        }

        results.streaks = {
          success: true,
          message: `Checked ${usersWithStreak.length} users, reset ${streaksBroken} broken streaks`,
          affected: streaksBroken,
        };
      } catch (error) {
        console.error("[Cron] Streak maintenance failed:", error);
        results.streaks = { success: false, message: "Streak maintenance failed" };
      }
    }

    // ─── Job 2: Weekly Progress Emails ────────────────
    if (job === "all" || job === "weekly-emails") {
      try {
        // Only run on Mondays
        const today = new Date();
        const isMonday = today.getDay() === 1;

        if (!isMonday && job !== "weekly-emails") {
          results.weeklyEmails = { success: true, message: "Skipped — not Monday" };
        } else {
          const usersWithReports = await User.find({
            weeklyReport: true,
            email: { $exists: true, $ne: "" },
          })
            .select("_id email name currentStreak totalSessions avgScore")
            .lean();

          let emailsSent = 0;
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

          for (const user of usersWithReports) {
            try {
              // Get this week's sessions
              const thisWeekSessions = await Session.find({
                userId: user._id,
                completed: true,
                createdAt: { $gte: oneWeekAgo },
              })
                .select("overallScore type")
                .lean();

              // Get last week's sessions
              const lastWeekSessions = await Session.find({
                userId: user._id,
                completed: true,
                createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
              })
                .select("overallScore type")
                .lean();

              const sessionsThisWeek = thisWeekSessions.length;
              const sessionsLastWeek = lastWeekSessions.length;
              const avgScoreThisWeek =
                sessionsThisWeek > 0
                  ? Math.round(
                      thisWeekSessions.reduce((s, sess) => s + (sess.overallScore || 0), 0) /
                        sessionsThisWeek
                    )
                  : 0;
              const avgScoreLastWeek =
                sessionsLastWeek > 0
                  ? Math.round(
                      lastWeekSessions.reduce((s, sess) => s + (sess.overallScore || 0), 0) /
                        sessionsLastWeek
                    )
                  : 0;

              // Determine strongest/weakest categories
              const categoryScores: Record<string, number[]> = {};
              for (const s of thisWeekSessions) {
                const cat = s.type || "dsa";
                if (!categoryScores[cat]) categoryScores[cat] = [];
                categoryScores[cat].push(s.overallScore || 0);
              }

              let topCategory = "";
              let weakestCategory = "";
              let topAvg = -1;
              let weakAvg = 101;

              for (const [cat, scores] of Object.entries(categoryScores)) {
                const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                if (avg > topAvg) {
                  topAvg = avg;
                  topCategory = cat.replace(/_/g, " ");
                }
                if (avg < weakAvg) {
                  weakAvg = avg;
                  weakestCategory = cat.replace(/_/g, " ");
                }
              }

              const { sendWeeklyReportEmail } = await import("@/lib/email");
              await sendWeeklyReportEmail(user.email, user.name, {
                sessionsThisWeek,
                sessionsLastWeek,
                avgScoreThisWeek,
                avgScoreLastWeek,
                currentStreak: user.currentStreak || 0,
                topCategory,
                weakestCategory,
                totalSessions: user.totalSessions || 0,
              });
              emailsSent++;
            } catch {
              // Skip individual user email failures
            }
          }

          results.weeklyEmails = {
            success: true,
            message: `Sent ${emailsSent}/${usersWithReports.length} weekly reports`,
            affected: emailsSent,
          };
        }
      } catch (error) {
        console.error("[Cron] Weekly emails failed:", error);
        results.weeklyEmails = { success: false, message: "Weekly emails failed" };
      }
    }

    // ─── Job 3: Analytics Aggregation ─────────────────
    if (job === "all" || job === "analytics") {
      try {
        // Clean up old API usage records (keep 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const cutoffDate = ninetyDaysAgo.toISOString().split("T")[0];

        const { default: ApiUsage } = await import("@/models/ApiUsage");
        const deleteResult = await ApiUsage.deleteMany({
          date: { $lt: cutoffDate },
        });

        // Count active users in last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const activeUsers = await User.countDocuments({
          lastActiveDate: { $gte: weekAgo },
        });

        // Count total completed sessions
        const totalCompleted = await Session.countDocuments({ completed: true });

        results.analytics = {
          success: true,
          message: `Cleaned ${deleteResult.deletedCount} old records. Active users (7d): ${activeUsers}. Total sessions: ${totalCompleted}`,
          affected: deleteResult.deletedCount,
        };
      } catch (error) {
        console.error("[Cron] Analytics aggregation failed:", error);
        results.analytics = { success: false, message: "Analytics aggregation failed" };
      }
    }

    // ─── Job 4: Daily Streak Reminders ────────────────
    if (job === "daily-reminders") {
      try {
        const usersToRemind = await User.find({
          emailNotifications: true,
          currentStreak: { $gt: 0 },
          email: { $exists: true, $ne: "" },
        })
          .select("_id email name currentStreak lastActiveDate")
          .lean();

        let remindersSent = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const user of usersToRemind) {
          const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

          // Only remind if they haven't been active today
          if (!lastActive || lastActive < today) {
            try {
              const { sendDailyReminderEmail } = await import("@/lib/email");
              await sendDailyReminderEmail(
                user.email,
                user.name,
                user.currentStreak || 0
              );
              remindersSent++;
            } catch {
              // Skip individual failures
            }
          }
        }

        results.dailyReminders = {
          success: true,
          message: `Sent ${remindersSent}/${usersToRemind.length} streak reminders`,
          affected: remindersSent,
        };
      } catch (error) {
        console.error("[Cron] Daily reminders failed:", error);
        results.dailyReminders = { success: false, message: "Daily reminders failed" };
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      job,
      results,
    });
  } catch (error) {
    console.error("[Cron] Job failed:", error);
    return NextResponse.json(
      { error: "Cron job failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
