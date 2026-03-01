// ===========================================
// PrepWithAI — Email System
// Powered by Resend
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "PrepWithAI <noreply@prepwithai.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── Welcome Email ────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
  const firstName = name.split(" ")[0];

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to PrepWithAI, ${firstName}! 🚀`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#080808;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#7c3aed,#3b82f6);border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:20px;font-weight:bold;">P</span>
        </div>
        <span style="color:#F5F5F5;font-size:24px;font-weight:700;">PrepWithAI</span>
      </div>
    </div>

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.15));border:1px solid rgba(124,58,237,0.3);border-radius:16px;padding:32px;margin-bottom:24px;">
      <h1 style="color:#F5F5F5;font-size:28px;font-weight:700;margin:0 0 12px;">
        Welcome aboard, ${firstName}! 🎉
      </h1>
      <p style="color:#A3A3A3;font-size:16px;line-height:1.6;margin:0;">
        You just joined the smartest way to prepare for technical interviews. 
        Your 14-day Pro trial is active — every feature is unlocked.
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/interview" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:white;text-decoration:none;font-size:16px;font-weight:600;padding:14px 32px;border-radius:10px;">
        Start Your First Interview →
      </a>
    </div>

    <!-- What you get -->
    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#F5F5F5;font-size:18px;font-weight:600;margin:0 0 16px;">
        What's included in your Pro trial:
      </h2>
      <div style="color:#A3A3A3;font-size:14px;line-height:2;">
        ✅ AI mock interviews with real-time feedback<br>
        ✅ Voice mode — practice speaking your answers<br>
        ✅ 500+ questions across DSA, System Design, Behavioral<br>
        ✅ Company-specific prep packs (Google, Meta, Amazon...)<br>
        ✅ Progress analytics and skill tracking<br>
        ✅ Daily challenges to build your streak
      </div>
    </div>

    <!-- Tip -->
    <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px;margin-bottom:32px;">
      <p style="color:#10b981;font-size:14px;font-weight:600;margin:0 0 4px;">💡 Pro tip</p>
      <p style="color:#A3A3A3;font-size:14px;margin:0;">
        Start with a DSA interview to calibrate your skill level. The AI adapts to your performance 
        and gives you progressively harder questions.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid #222;padding-top:24px;">
      <p style="color:#666;font-size:12px;margin:0;">
        Built with ❤️ in Lahore, Pakistan by Abdullah Tariq<br>
        <a href="${APP_URL}" style="color:#7c3aed;text-decoration:none;">prepwithai.com</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
}

// ─── Session Completion Email ─────────────────────

export async function sendSessionCompletionEmail(
  to: string,
  _name: string,
  score: number,
  type: string,
  company: string,
  sessionId: string
) {
  const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const scoreEmoji = score >= 80 ? "🏆" : score >= 60 ? "💪" : "📈";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${scoreEmoji} You scored ${score}/100 on your ${type} interview!`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#7c3aed,#3b82f6);border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:20px;font-weight:bold;">P</span>
        </div>
        <span style="color:#F5F5F5;font-size:24px;font-weight:700;">PrepWithAI</span>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,${scoreColor}22,${scoreColor}11);border:3px solid ${scoreColor};display:flex;align-items:center;justify-content:center;">
        <span style="color:${scoreColor};font-size:42px;font-weight:800;line-height:120px;">${score}</span>
      </div>
      <h1 style="color:#F5F5F5;font-size:24px;font-weight:700;margin:16px 0 4px;">
        ${score >= 80 ? "Outstanding performance!" : score >= 60 ? "Good job, keep improving!" : "Keep practicing, you're getting better!"}
      </h1>
      <p style="color:#A3A3A3;font-size:14px;margin:0;">
        ${type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} Interview${company !== "general" ? ` • ${company.charAt(0).toUpperCase() + company.slice(1)} Prep` : ""}
      </p>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${APP_URL}/interview/${sessionId}/report" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:white;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:10px;">
        View Full Report →
      </a>
    </div>

    <div style="text-align:center;margin-top:16px;">
      <a href="https://twitter.com/intent/tweet?text=I%20just%20scored%20${score}%2F100%20on%20a%20${encodeURIComponent(type)}%20mock%20interview%20on%20PrepWithAI!%20%F0%9F%9A%80&url=${APP_URL}" 
         style="color:#7c3aed;font-size:13px;text-decoration:none;">
        Share on Twitter/X
      </a>
      <span style="color:#333;margin:0 8px;">•</span>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${APP_URL}" 
         style="color:#3b82f6;font-size:13px;text-decoration:none;">
        Share on LinkedIn
      </a>
    </div>

    <div style="text-align:center;border-top:1px solid #222;padding-top:24px;margin-top:32px;">
      <p style="color:#666;font-size:12px;margin:0;">
        PrepWithAI • <a href="${APP_URL}/settings" style="color:#666;text-decoration:none;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send session completion email:", error);
    return { success: false, error };
  }
}

// ─── Daily Reminder Email ─────────────────────────

export async function sendDailyReminderEmail(
  to: string,
  name: string,
  currentStreak: number
) {
  const firstName = name.split(" ")[0];

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: currentStreak > 0
        ? `🔥 Your ${currentStreak}-day streak ends tonight — keep it going!`
        : "👋 Time for today's practice session",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#7c3aed,#3b82f6);border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:20px;font-weight:bold;">P</span>
        </div>
        <span style="color:#F5F5F5;font-size:24px;font-weight:700;">PrepWithAI</span>
      </div>
    </div>

    <div style="background:linear-gradient(135deg,rgba(245,158,11,0.15),rgba(239,68,68,0.15));border:1px solid rgba(245,158,11,0.3);border-radius:16px;padding:32px;text-align:center;">
      ${currentStreak > 0 ? `
      <div style="font-size:48px;margin-bottom:8px;">🔥</div>
      <h1 style="color:#F5F5F5;font-size:24px;font-weight:700;margin:0 0 8px;">
        ${currentStreak}-day streak!
      </h1>
      <p style="color:#A3A3A3;font-size:15px;margin:0;">
        Don't break it, ${firstName}. One quick session keeps you sharp.
      </p>
      ` : `
      <div style="font-size:48px;margin-bottom:8px;">💪</div>
      <h1 style="color:#F5F5F5;font-size:24px;font-weight:700;margin:0 0 8px;">
        Ready to practice?
      </h1>
      <p style="color:#A3A3A3;font-size:15px;margin:0;">
        Start a streak today, ${firstName}. Consistency beats intensity.
      </p>
      `}
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${APP_URL}/daily" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);color:white;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:10px;">
        Start Daily Challenge →
      </a>
    </div>

    <div style="text-align:center;border-top:1px solid #222;padding-top:24px;margin-top:32px;">
      <p style="color:#666;font-size:12px;margin:0;">
        <a href="${APP_URL}/settings" style="color:#666;text-decoration:none;">Manage notification preferences</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send daily reminder:", error);
    return { success: false, error };
  }
}

// ─── Weekly Progress Report Email ─────────────────

export async function sendWeeklyReportEmail(
  to: string,
  _name: string,
  stats: {
    sessionsThisWeek: number;
    sessionsLastWeek: number;
    avgScoreThisWeek: number;
    avgScoreLastWeek: number;
    currentStreak: number;
    topCategory: string;
    weakestCategory: string;
    totalSessions: number;
  }
) {
  const scoreDiff = stats.avgScoreThisWeek - stats.avgScoreLastWeek;
  const sessionsDiff = stats.sessionsThisWeek - stats.sessionsLastWeek;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `📊 Your weekly progress report — ${scoreDiff >= 0 ? "+" : ""}${scoreDiff} points`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#7c3aed,#3b82f6);border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:20px;font-weight:bold;">P</span>
        </div>
        <span style="color:#F5F5F5;font-size:24px;font-weight:700;">PrepWithAI</span>
      </div>
    </div>

    <h1 style="color:#F5F5F5;font-size:22px;font-weight:700;margin:0 0 24px;text-align:center;">
      Weekly Progress Report
    </h1>

    <!-- Stats Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
      <div style="background:#111;border:1px solid #222;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#A3A3A3;font-size:12px;margin-bottom:4px;">Sessions</div>
        <div style="color:#F5F5F5;font-size:24px;font-weight:700;">${stats.sessionsThisWeek}</div>
        <div style="color:${sessionsDiff >= 0 ? "#10b981" : "#ef4444"};font-size:12px;">${sessionsDiff >= 0 ? "+" : ""}${sessionsDiff} vs last week</div>
      </div>
      <div style="background:#111;border:1px solid #222;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#A3A3A3;font-size:12px;margin-bottom:4px;">Avg Score</div>
        <div style="color:#F5F5F5;font-size:24px;font-weight:700;">${stats.avgScoreThisWeek}</div>
        <div style="color:${scoreDiff >= 0 ? "#10b981" : "#ef4444"};font-size:12px;">${scoreDiff >= 0 ? "+" : ""}${scoreDiff} points</div>
      </div>
      <div style="background:#111;border:1px solid #222;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#A3A3A3;font-size:12px;margin-bottom:4px;">Streak</div>
        <div style="color:#f59e0b;font-size:24px;font-weight:700;">🔥 ${stats.currentStreak}</div>
      </div>
      <div style="background:#111;border:1px solid #222;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#A3A3A3;font-size:12px;margin-bottom:4px;">All Time</div>
        <div style="color:#F5F5F5;font-size:24px;font-weight:700;">${stats.totalSessions}</div>
        <div style="color:#A3A3A3;font-size:12px;">sessions</div>
      </div>
    </div>

    <!-- Insights -->
    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:20px;margin-bottom:24px;">
      <h3 style="color:#F5F5F5;font-size:15px;font-weight:600;margin:0 0 12px;">📌 This Week's Insights</h3>
      <div style="color:#A3A3A3;font-size:14px;line-height:1.8;">
        ${stats.topCategory ? `✅ Strongest area: <strong style="color:#10b981">${stats.topCategory}</strong>` : ""}<br>
        ${stats.weakestCategory ? `⚠️ Needs work: <strong style="color:#f59e0b">${stats.weakestCategory}</strong>` : ""}<br>
        ${scoreDiff > 0 ? `📈 Your scores are trending up — great momentum!` : scoreDiff < 0 ? `📉 Scores dipped this week — focus on your weak areas.` : `➡️ Scores are steady — try harder problems to push your limits.`}
      </div>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${APP_URL}/progress" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:white;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:10px;">
        View Full Progress →
      </a>
    </div>

    <div style="text-align:center;border-top:1px solid #222;padding-top:24px;margin-top:32px;">
      <p style="color:#666;font-size:12px;margin:0;">
        <a href="${APP_URL}/settings" style="color:#666;text-decoration:none;">Manage notification preferences</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send weekly report:", error);
    return { success: false, error };
  }
}
