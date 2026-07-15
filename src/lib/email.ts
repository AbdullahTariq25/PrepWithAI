import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || "PrepWithAI <noreply@prepwithai.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailShell(title: string, body: string) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#08080c;color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:620px;margin:0 auto;padding:40px 22px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
      <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:800;color:white">P</div>
      <div style="font-size:20px;font-weight:700">PrepWithAI</div>
    </div>
    <div style="background:#111116;border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:28px">
      <h1 style="font-size:24px;line-height:1.25;margin:0 0 14px">${title}</h1>
      ${body}
    </div>
    <p style="margin:22px 0 0;text-align:center;color:#666679;font-size:12px">PrepWithAI · Practice deliberately. Measure improvement.</p>
  </div>
</body>
</html>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) return { success: false, error: "Email not configured" };
  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    return { success: true };
  } catch (error) {
    console.error(`[Email] Failed to send "${subject}":`, error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  const firstName = escapeHtml(name.split(" ")[0] || "there");
  return sendEmail(
    to,
    `Welcome to PrepWithAI, ${firstName}`,
    emailShell(
      `Welcome, ${firstName}.`,
      `<p style="color:#a3a3b2;font-size:15px;line-height:1.7;margin:0 0 20px">Your account is ready. Start with the Free plan and build a consistent interview-practice habit. You can activate a 14-day Pro trial when you want unlimited sessions, premium interview tracks, and voice or video practice.</p>
       <a href="${APP_URL}/interview" style="display:inline-block;background:#6366f1;color:white;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px">Start your first interview →</a>
       <div style="margin-top:24px;padding:18px;border-radius:12px;background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.18)">
         <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:#c7d2fe">A strong first session</div>
         <div style="font-size:13px;line-height:1.7;color:#9494a5">Choose a DSA interview, explain your reasoning out loud even in text mode, and use the feedback to pick one thing to improve in your next attempt.</div>
       </div>`,
    ),
  );
}

export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const firstName = escapeHtml(name.split(" ")[0] || "there");
  const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;
  return sendEmail(
    to,
    "Reset your PrepWithAI password",
    emailShell(
      "Reset your password",
      `<p style="color:#a3a3b2;font-size:15px;line-height:1.7;margin:0 0 20px">Hi ${firstName}, we received a request to reset your password. This link expires in one hour.</p>
       <a href="${resetUrl}" style="display:inline-block;background:#6366f1;color:white;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px">Reset password →</a>
       <p style="color:#6f6f80;font-size:12px;line-height:1.6;margin:20px 0 0">If you did not request this change, you can ignore this email.</p>`,
    ),
  );
}

export async function sendSessionCompletionEmail(
  to: string,
  _name: string,
  score: number,
  type: string,
  company: string,
  sessionId: string,
) {
  const safeType = escapeHtml(type.replace(/_/g, " "));
  const safeCompany = escapeHtml(company);
  return sendEmail(
    to,
    `Your ${safeType} interview score: ${score}/100`,
    emailShell(
      `Session complete: ${score}/100`,
      `<p style="color:#a3a3b2;font-size:15px;line-height:1.7;margin:0 0 8px">Interview: <strong style="color:#ededf3">${safeType}</strong>${company !== "general" ? ` · ${safeCompany}` : ""}</p>
       <p style="color:#a3a3b2;font-size:15px;line-height:1.7;margin:0 0 20px">Review the report while the session is still fresh and choose one improvement target for your next practice attempt.</p>
       <a href="${APP_URL}/interview/${encodeURIComponent(sessionId)}/report" style="display:inline-block;background:#6366f1;color:white;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px">View full report →</a>`,
    ),
  );
}

export async function sendDailyReminderEmail(to: string, name: string, currentStreak: number) {
  const firstName = escapeHtml(name.split(" ")[0] || "there");
  return sendEmail(
    to,
    `Keep your ${currentStreak}-day PrepWithAI streak going`,
    emailShell(
      `Keep the momentum, ${firstName}.`,
      `<p style="color:#a3a3b2;font-size:15px;line-height:1.7;margin:0 0 20px">You are on a ${currentStreak}-day practice streak. One focused session today is enough to keep building interview confidence.</p>
       <a href="${APP_URL}/interview" style="display:inline-block;background:#6366f1;color:white;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px">Practice now →</a>`,
    ),
  );
}

export async function sendWeeklyReportEmail(
  to: string,
  name: string,
  report: {
    sessionsThisWeek: number;
    sessionsLastWeek: number;
    avgScoreThisWeek: number;
    avgScoreLastWeek: number;
    currentStreak: number;
    topCategory: string;
    weakestCategory: string;
    totalSessions: number;
  },
) {
  const firstName = escapeHtml(name.split(" ")[0] || "there");
  const topCategory = escapeHtml(report.topCategory || "Not enough data yet");
  const weakestCategory = escapeHtml(report.weakestCategory || "Not enough data yet");
  return sendEmail(
    to,
    "Your weekly PrepWithAI progress report",
    emailShell(
      `${firstName}, here is your week in review.`,
      `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0">
         <div style="padding:14px;border-radius:12px;background:#0c0c11;border:1px solid rgba(255,255,255,.07)"><div style="font-size:12px;color:#777789">Sessions</div><div style="font-size:24px;font-weight:700;margin-top:4px">${report.sessionsThisWeek}</div></div>
         <div style="padding:14px;border-radius:12px;background:#0c0c11;border:1px solid rgba(255,255,255,.07)"><div style="font-size:12px;color:#777789">Average score</div><div style="font-size:24px;font-weight:700;margin-top:4px">${report.avgScoreThisWeek}</div></div>
       </div>
       <p style="color:#a3a3b2;font-size:14px;line-height:1.8;margin:0 0 20px">Strongest area: <strong style="color:#ededf3">${topCategory}</strong><br>Focus next: <strong style="color:#ededf3">${weakestCategory}</strong><br>Current streak: <strong style="color:#ededf3">${report.currentStreak} days</strong><br>Total sessions: <strong style="color:#ededf3">${report.totalSessions}</strong></p>
       <a href="${APP_URL}/progress" style="display:inline-block;background:#6366f1;color:white;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px">Review progress →</a>`,
    ),
  );
}
