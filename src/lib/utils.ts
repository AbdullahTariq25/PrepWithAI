import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ELO_CONFIG, FILLER_WORDS } from "./constants";
import {
  BILLING,
  effectivePlan as resolveEffectivePlan,
  hasProAccess,
  isTrialActive,
  trialDaysRemaining,
} from "./billing";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isOnProTrial(
  user: { plan: string; proTrialEndsAt?: Date | string | null } | null | undefined,
): boolean {
  return user?.plan === "free" && isTrialActive(user.proTrialEndsAt);
}

export function proTrialDaysRemaining(
  proTrialEndsAt: Date | string | null | undefined,
): number {
  return trialDaysRemaining(proTrialEndsAt);
}

export function effectivePlan(
  user: { plan: string; proTrialEndsAt?: Date | string | null } | null | undefined,
): string {
  return resolveEffectivePlan(user);
}

export function calculateTrialEndDate(startDate?: Date): Date {
  const end = new Date(startDate ?? new Date());
  end.setDate(end.getDate() + BILLING.pro.trialDays);
  return end;
}

export function canAccessProFeature(
  user: { plan: string; proTrialEndsAt?: Date | string | null } | null | undefined,
): boolean {
  return hasProAccess(user);
}

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
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
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
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  if (currency === "PKR") return `PKR ${amount.toLocaleString()}`;
  if (currency === "USD/hr") return `$${amount}/hr`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

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

export function calculateNewElo(
  currentRating: number,
  questionDifficulty: number,
  score: number,
  maxScore: number = 100,
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (questionDifficulty - currentRating) / 400));
  const actualScore = score / maxScore;
  const newRating = currentRating + ELO_CONFIG.kFactor * (actualScore - expectedScore);
  return Math.max(ELO_CONFIG.minRating, Math.min(ELO_CONFIG.maxRating, Math.round(newRating)));
}

export function getEloLevel(rating: number): { name: string; color: string } {
  const level = ELO_CONFIG.levels.find((item) => rating >= item.min && rating < item.max);
  return level || { name: "Beginner", color: "#6b7280" };
}

export function getEloDifficultyForRating(rating: number): number {
  return rating + Math.floor(Math.random() * 200) - 50;
}

export function countFillerWords(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const filler of FILLER_WORDS) {
    const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = text.match(new RegExp(`\\b${escaped}\\b`, "gi"));
    if (matches?.length) counts[filler] = matches.length;
  }
  return counts;
}

export function calculateWPM(text: string, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
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

export function truncate(str: string, length: number): string {
  return str.length <= length ? str : `${str.slice(0, length)}...`;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatInterviewType(type: string): string {
  return type.replace(/_/g, " ").replace(/-/g, " ").split(" ").map(capitalize).join(" ");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sorted = dates.map((date) => new Date(date)).sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDate = new Date(sorted[0]);
  firstDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - firstDate.getTime()) / 86_400_000);
  if (diffDays > 1) return 0;

  let streak = 1;
  for (let index = 1; index < sorted.length; index++) {
    const current = new Date(sorted[index]);
    const previous = new Date(sorted[index - 1]);
    current.setHours(0, 0, 0, 0);
    previous.setHours(0, 0, 0, 0);
    const diff = Math.floor((previous.getTime() - current.getTime()) / 86_400_000);
    if (diff === 1) streak++;
    else if (diff > 1) break;
  }
  return streak;
}

export function generateHeatmapData(
  dailyScores: { date: string; sessions: number }[],
  days: number = 365,
): { date: string; count: number; level: number }[] {
  const map = new Map<string, number>();
  for (const item of dailyScores) {
    const key = new Date(item.date).toISOString().split("T")[0];
    map.set(key, (map.get(key) || 0) + item.sessions);
  }

  const result: { date: string; count: number; level: number }[] = [];
  const today = new Date();
  for (let offset = days; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);
    const key = date.toISOString().split("T")[0];
    const count = map.get(key) || 0;
    const level = count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
    result.push({ date: key, count, level });
  }
  return result;
}

export const CHART_COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}
