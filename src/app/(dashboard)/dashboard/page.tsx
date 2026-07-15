"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Clock3,
  Flame,
  MessageSquare,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDuration, getEloLevel, getPercentile } from "@/lib/utils";

interface ProgressData {
  totalSessions: number;
  avgScore: number;
  streak: number;
  maxStreak: number;
  totalTime: number;
  eloRating: number;
  dailyScores: { date: string; score: number }[];
  weeklyGoal: number;
  sessionsThisWeek: number;
}

interface SessionItem {
  _id: string;
  type: string;
  company: string;
  overallScore: number;
  duration: number;
  completed: boolean;
  createdAt: string;
}

const practicePaths = [
  {
    title: "Technical interview",
    description: "Practice problem solving and explain your reasoning clearly.",
    href: "/interview?type=dsa",
    icon: Brain,
  },
  {
    title: "Behavioral interview",
    description: "Build concise STAR stories and stronger leadership examples.",
    href: "/interview?type=behavioral",
    icon: MessageSquare,
  },
  {
    title: "System design",
    description: "Practice architecture, tradeoffs, scale, and communication.",
    href: "/interview?type=system_design",
    icon: Target,
  },
];

function formatInterviewType(value: string) {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [recentSessions, setRecentSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [progressResponse, sessionsResponse] = await Promise.all([
          fetch("/api/progress", { cache: "no-store" }),
          fetch("/api/sessions", { cache: "no-store" }),
        ]);

        const [progressData, sessionsData] = await Promise.all([
          progressResponse.json(),
          sessionsResponse.json(),
        ]);

        if (!active) return;
        if (progressResponse.ok && !progressData.error) setProgress(progressData);
        if (sessionsResponse.ok && Array.isArray(sessionsData.sessions)) {
          setRecentSessions(sessionsData.sessions.slice(0, 5));
        }
      } catch {
        // The dashboard still renders useful empty states when optional data fails.
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const totalSessions = progress?.totalSessions || 0;
  const avgScore = progress?.avgScore || 0;
  const streak = progress?.streak || 0;
  const totalTime = progress?.totalTime || 0;
  const eloRating = progress?.eloRating || session?.user?.eloRating || 1200;
  const eloLevel = getEloLevel(eloRating);
  const weeklyGoal = Math.max(progress?.weeklyGoal || 5, 1);
  const sessionsThisWeek = progress?.sessionsThisWeek || 0;
  const weeklyProgress = Math.min(100, Math.round((sessionsThisWeek / weeklyGoal) * 100));
  const percentile = getPercentile(avgScore);

  const chartData = useMemo(
    () =>
      (progress?.dailyScores || []).slice(-30).map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: item.score,
      })),
    [progress?.dailyScores],
  );

  const stats = [
    { label: "Completed sessions", value: loading ? "—" : totalSessions.toString(), icon: MessageSquare },
    { label: "Average score", value: loading ? "—" : `${avgScore}%`, icon: BarChart3 },
    { label: "Current streak", value: loading ? "—" : `${streak}d`, icon: Flame },
    { label: "Practice time", value: loading ? "—" : formatDuration(totalTime), icon: Clock3 },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7 page-enter">
      <section className="overflow-hidden rounded-3xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/12 via-[#111116] to-[#0b0b10] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" /> Your interview workspace
            </div>
            <h1 className="max-w-3xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Welcome back, {firstName}. Build confidence through deliberate practice.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9a9aaa] sm:text-base">
              Choose a focused interview session, explain your thinking, review the feedback, and repeat with one clear improvement target.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Start interview <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/progress"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[#d4d4dd] transition hover:bg-white/8"
              >
                Review progress
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-[#6f6f82]">Current rating</div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-bold tabular-nums">{eloRating}</span>
                  <span className="pb-1 text-sm" style={{ color: eloLevel.color }}>{eloLevel.name}</span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
                <Zap className="h-5 w-5 text-indigo-300" />
              </div>
            </div>
            <div className="mt-5 border-t border-white/8 pt-4 text-sm text-[#9292a3]">
              {avgScore > 0 ? `Current score percentile estimate: top ${100 - percentile}%` : "Complete sessions to establish your performance baseline."}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-white/7 bg-[#111116] p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#858596]">{stat.label}</div>
                <Icon className="h-4 w-4 text-indigo-300" />
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight tabular-nums">{stat.value}</div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Score trend</h2>
              <p className="mt-1 text-sm text-[#7f7f91]">Your recent completed-session performance.</p>
            </div>
            <Link href="/progress" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">Detailed analytics</Link>
          </div>

          <div className="mt-6 h-64">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: "#686879", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#686879", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#111116", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={2} fill="url(#dashboardScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/8 bg-white/[0.02] text-center">
                <div className="max-w-sm px-6">
                  <BarChart3 className="mx-auto h-7 w-7 text-[#5d5d70]" />
                  <p className="mt-3 text-sm font-medium text-[#b4b4c0]">Your trend will appear after a few completed sessions.</p>
                  <p className="mt-1 text-xs leading-5 text-[#6d6d7e]">Consistent practice creates a more useful signal than one isolated score.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Weekly goal</h2>
              <p className="mt-1 text-sm text-[#7f7f91]">{sessionsThisWeek} of {weeklyGoal} sessions</p>
            </div>
            <Target className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/6">
            <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${weeklyProgress}%` }} />
          </div>
          <div className="mt-3 text-xs text-[#6f6f80]">{weeklyProgress}% complete</div>

          <div className="mt-7 border-t border-white/7 pt-5">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5f5f72]">Recommended next step</div>
            <p className="mt-3 text-sm leading-6 text-[#a0a0ae]">
              {recentSessions.length === 0
                ? "Start with a DSA session to establish a baseline and practice explaining your reasoning."
                : "Review your latest report, pick one weakness, and practice that exact skill again."}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Choose your next practice focus</h2>
            <p className="mt-1 text-sm text-[#777789]">Do not practice everything at once. Pick one interview skill.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {practicePaths.map((path) => {
            const Icon = path.icon;
            return (
              <Link key={path.title} href={path.href} className="group rounded-2xl border border-white/7 bg-[#111116] p-5 transition hover:-translate-y-1 hover:border-indigo-500/25">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                  <Icon className="h-5 w-5 text-indigo-300" />
                </div>
                <h3 className="mt-5 font-semibold">{path.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#858596]">{path.description}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-indigo-300">Practice now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/7 bg-[#111116]">
        <div className="flex items-center justify-between border-b border-white/7 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold">Recent sessions</h2>
            <p className="mt-1 text-xs text-[#6f6f80]">Continue learning from your latest practice.</p>
          </div>
          <Link href="/history" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">View history</Link>
        </div>

        {recentSessions.length > 0 ? (
          <div className="divide-y divide-white/7">
            {recentSessions.map((item) => (
              <Link key={item._id} href={`/interview/${item._id}/report`} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <div className="font-medium text-[#e8e8ee]">{formatInterviewType(item.type)}</div>
                  <div className="mt-1 text-xs text-[#717183]">
                    {item.company && item.company !== "general" ? `${formatInterviewType(item.company)} · ` : ""}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-5 text-sm">
                  <span className="text-[#777789]">{formatDuration(item.duration || 0)}</span>
                  <span className="font-semibold tabular-nums text-indigo-300">{item.completed ? `${item.overallScore || 0}%` : "In progress"}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-[#777789]">No sessions yet. Start your first interview to build a history.</div>
        )}
      </section>
    </div>
  );
}
