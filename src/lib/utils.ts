// ===========================================
// PrepWithAI — Utility Functions
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ELO_CONFIG, FILLER_WORDS, FREE_TRIAL_DAYS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Pro Trial Helpers ───────────────────────────

/**
 * Check if a user is currently on an active Pro trial.
 * Works on both server (IUser) and client (session.user) shapes.
 */
export function isOnProTrial(
  user: { plan: string; proTrialEndsAt?: Date | string | null } | null | undefined
): boolean {
  if (!user || user.plan !== "free") return false;
  if (!user.proTrialEndsAt) return false;
  return new Date(user.proTrialEndsAt) > new Date();
}

/**
 * How many days remain in the Pro trial (0 if expired or no trial).
 */
export function proTrialDaysRemaining(
  proTrialEndsAt: Date | string | null | undefined
): number {
  if (!proTrialEndsAt) return 0;
  const ms = new Date(proTrialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Returns the effective plan for a user:
 * - "pro_trial" if they are on an active trial
 * - their actual plan otherwise
 */
export function effectivePlan(
  user: { plan: string; proTrialEndsAt?: Date | string | null } | null | undefined
): string {
  if (!user) return "free";
  if (isOnProTrial(user)) return "pro_trial";
  return user.plan;
}

/**
 * Calculate the trial end date from a start date.
 */
export function calculateTrialEndDate(startDate?: Date): Date {
  const start = startDate ?? new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + FREE_TRIAL_DAYS);
  return end;
}

/**
 * Whether a feature is accessible given the user's plan + trial status.
 * Pro trial unlocks all pro features.
 */
export function canAccessProFeature(
  user: { plan: string; proTrialEndsAt?: Date | string | null } | null | undefined
): boolean {
  if (!user) return false;
  const ep = effectivePlan(user);
  return ep === "pro" || ep === "pro_trial" || ep === "team" || ep === "enterprise";
}


// ─── Formatting ─────────────────────────────────

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(date);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDurationLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  if (currency === "PKR") {
    return `PKR ${amount.toLocaleString()}`;
  }
  if (currency === "USD/hr") {
    return `$${amount}/hr`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Score Helpers ──────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 80) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  if (score >= 60) return "text-orange-400";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 80) return "bg-green-500/10 border-green-500/20";
  if (score >= 70) return "bg-yellow-500/10 border-yellow-500/20";
  if (score >= 60) return "bg-orange-500/10 border-orange-500/20";
  return "bg-red-500/10 border-red-500/20";
}

export function getScoreLabel(score: number): string {
  if (score >= 95) return "Exceptional";
  if (score >= 90) return "Outstanding";
  if (score >= 85) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 75) return "Good";
  if (score >= 70) return "Above Average";
  if (score >= 65) return "Average";
  if (score >= 60) return "Below Average";
  if (score >= 50) return "Needs Work";
  return "Needs Improvement";
}

export function getScoreGrade(score: number): string {
  if (score >= 93) return "A+";
  if (score >= 90) return "A";
  if (score >= 87) return "A-";
  if (score >= 83) return "B+";
  if (score >= 80) return "B";
  if (score >= 77) return "B-";
  if (score >= 73) return "C+";
  if (score >= 70) return "C";
  if (score >= 67) return "C-";
  if (score >= 60) return "D";
  return "F";
}

export function getPercentile(score: number): number {
  // Simplified percentile calculation based on score distribution
  if (score >= 95) return 99;
  if (score >= 90) return 95;
  if (score >= 85) return 88;
  if (score >= 80) return 78;
  if (score >= 75) return 65;
  if (score >= 70) return 50;
  if (score >= 65) return 38;
  if (score >= 60) return 25;
  if (score >= 50) return 12;
  return 5;
}

// ─── ELO Rating System ──────────────────────────

export function calculateNewElo(
  currentRating: number,
  questionDifficulty: number,
  score: number,
  maxScore: number = 100
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (questionDifficulty - currentRating) / 400));
  const actualScore = score / maxScore;
  const newRating = currentRating + ELO_CONFIG.kFactor * (actualScore - expectedScore);
  return Math.max(
    ELO_CONFIG.minRating,
    Math.min(ELO_CONFIG.maxRating, Math.round(newRating))
  );
}

export function getEloLevel(rating: number): { name: string; color: string } {
  const level = ELO_CONFIG.levels.find(
    (l) => rating >= l.min && rating < l.max
  );
  return level || { name: "Beginner", color: "#6b7280" };
}

export function getEloDifficultyForRating(rating: number): number {
  // Returns the difficulty rating that would challenge this player
  return rating + Math.floor(Math.random() * 200) - 50;
}

// ─── Voice Analysis ─────────────────────────────

export function countFillerWords(text: string): Record<string, number> {
  const lower = text.toLowerCase();
  const counts: Record<string, number> = {};
  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      counts[filler] = matches.length;
    }
  }
  return counts;
}

export function calculateWPM(text: string, durationSeconds: number): number {
  if (durationSeconds === 0) return 0;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.round((wordCount / durationSeconds) * 60);
}

export function getSpeakingFeedback(wpm: number): string {
  if (wpm < 100) return "Too slow — try to speak a bit faster for clarity";
  if (wpm < 120) return "Slightly slow — good for complex explanations, pick up pace for simple ones";
  if (wpm <= 160) return "Perfect pace — clear and easy to follow";
  if (wpm <= 180) return "Slightly fast — slow down a bit for complex topics";
  return "Too fast — slow down, your interviewer may struggle to follow";
}

// ─── String Helpers ─────────────────────────────

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatInterviewType(type: string): string {
  return type
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .split(" ")
    .map(capitalize)
    .join(" ");
}

// ─── ID Generation ──────────────────────────────

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// ─── Async ──────────────────────────────────────

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Streak ─────────────────────────────────────

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sorted = dates
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDate = new Date(sorted[0]);
  firstDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If last activity is more than 1 day ago, streak is 0
  if (diffDays > 1) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const curr = new Date(sorted[i]);
    const prev = new Date(sorted[i - 1]);
    curr.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);

    const diff = Math.floor(
      (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
    // diff === 0 means same day, continue
  }

  return streak;
}

// ─── Heatmap ────────────────────────────────────

export function generateHeatmapData(
  dailyScores: { date: string; sessions: number }[],
  days: number = 365
): { date: string; count: number; level: number }[] {
  const map = new Map<string, number>();
  for (const d of dailyScores) {
    const key = new Date(d.date).toISOString().split("T")[0];
    map.set(key, (map.get(key) || 0) + d.sessions);
  }

  const result: { date: string; count: number; level: number }[] = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split("T")[0];
    const count = map.get(key) || 0;
    const level = count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
    result.push({ date: key, count, level });
  }

  return result;
}

// ─── Chart Colors ───────────────────────────────

export const CHART_COLORS = [
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
];

// ─── Validation ─────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}
