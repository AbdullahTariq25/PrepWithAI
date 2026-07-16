"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  CalendarCheck2,
  Clock3,
  FileSearch,
  Flame,
  Layers3,
  MessageSquare,
  ShieldCheck,
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

const workflowActions = [
  {
    eyebrow: "Before practice",
    title: "Check interview readiness",
    description: "Validate authentication, AI, microphone, camera, and browser support before a timed session.",
    href: "/readiness",
    icon: ShieldCheck,
    accent: "from-cyan-400/18 to-indigo-500/5",
    iconClass: "text-cyan-300",
  },
  {
    eyebrow: "Retain weak concepts",
    title: "Review due flashcards",
    description: "Use persistent Again, Hard, Good, and Easy ratings to schedule the next review automatically.",
    href: "/flashcards",
    icon: Layers3,
    accent: "from-violet-400/18 to-indigo-500/5",
    iconClass: "text-violet-300",
  },
  {
    eyebrow: "Target the right role",
    title: "Match resume to a job",
    description: "Compare a real PDF resume with the role description and identify truthful coverage gaps.",
    href: "/resume",
    icon: FileSearch,
    accent: "from-indigo-400/18 to-fuchsia-500/5",
    iconClass: "text-indigo-300",
  },
  {
    eyebrow: "Carry preparation forward",
    title: "Update application pipeline",
    description: "Keep actual opportunities, follow-up dates, next actions, and interview stages in one place.",
    href: "/jobs",
    icon: BriefcaseBusiness,
    accent: "from-fuchsia-400/18 to-rose-500/5",
    iconClass: "text-fuchsia-300",
  },
];

const practicePaths = [
  {
    title: "Technical interview",
    description: "Practice problem solving and make your reasoning easy to follow.",
    href: "/interview?type=dsa",
    icon: Brain,
  },
  {
    title: "Behavioral interview",
    description: "Build concise STAR stories with ownership, decisions, and measurable results.",
    href: "/interview?type=behavioral",
    icon: MessageSquare,
  },
  {
    title: "System design",
    description: "Explain architecture, constraints, tradeoffs, scale, and failure modes.",
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
        // Useful empty states remain available if optional dashboard data fails.
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
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        score: item.score,
      })),
    [progress?.dailyScores],
  );

  const stats = [
    {
      label: "Completed sessions",
      value: loading ? "—" : totalSessions.toString(),
      detail: totalSessions > 0 ? "Reports available in history" : "Start with one focused baseline",
      icon: MessageSquare,
    },
    {
      label: "Average score",
      value: loading ? "—" : `${avgScore}%`,
      detail: avgScore > 0 ? `Estimated top ${100 - percentile}%` : "Build a reliable multi-session signal",
      icon: BarChart3,
    },
    {
      label: "Current streak",
      value: loading ? "—" : `${streak}d`,
      detail: streak > 0 ? `Best streak ${progress?.maxStreak || streak} days` : "Consistency beats one long session",
      icon: Flame,
    },
    {
      label: "Practice time",
      value: loading ? "—" : formatDuration(totalTime),
      detail: `${sessionsThisWeek} of ${weeklyGoal} weekly sessions`,
      icon: Clock3,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7 page-enter">
      <section className="relative overflow-hidden rounded-[30px] border border-indigo-400/15 bg-[#0d0d13] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:p-8">
        <div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-indigo-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 top-8 h-64 w-64 rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/8 px-3 py-1.5 text-xs font-medium text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" /> Preparation command center
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
              Welcome back, {firstName}. Make the next practice session count.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9a9aaa] sm:text-base">
              Check your setup, choose one interview skill, inspect the evidence, and carry the improvement into the role you are targeting.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/interview"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 shadow-[0_10px_35px_rgba(255,255,255,0.1)] transition hover:-translate-y-0.5 hover:bg-zinc-100"
              >
                Start focused interview <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/plan"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-[#d4d4dd] transition hover:border-white/18 hover:bg-white/[0.07]"
              >
                Open prep plan
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/20 p-5 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-[#707083]">Current interview rating</div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-bold tabular-nums sm:text-5xl">{eloRating}</span>
                  <span className="pb-1 text-sm font-medium" style={{ color: eloLevel.color }}>
                    {eloLevel.name}
                  </span>
                </div>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-indigo-400/15 bg-indigo-500/10">
                <Zap className="h-5 w-5 text-indigo-300" />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-[#777789]">
                <span>Weekly practice target</span>
                <span className="font-mono text-[#aaaaba]">{sessionsThisWeek}/{weeklyGoal}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/6">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-[#777789]">
                {weeklyProgress >= 100
                  ? "Weekly target complete. Review evidence before adding more volume."
                  : `${weeklyProgress}% complete. A focused session is more valuable than unfocused repetition.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300">
              <CalendarCheck2 className="h-3.5 w-3.5" /> Today&apos;s preparation loop
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] sm:text-2xl">Move one meaningful step forward.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#777789]">Each tool is connected to a real user workflow—not a placeholder dashboard card.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflowActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl border border-white/7 bg-[#111116] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/14"
              >
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${action.accent}`} />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-black/20">
                      <Icon className={`h-5 w-5 ${action.iconClass}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#565668] transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#69697b]">{action.eyebrow}</p>
                  <h3 className="mt-2 font-semibold text-[#ededf3]">{action.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#858596]">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-white/7 bg-[#111116] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-[#858596]">{stat.label}</div>
                <Icon className="h-4 w-4 text-indigo-300" />
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight tabular-nums">{stat.value}</div>
              <p className="mt-2 text-xs leading-5 text-[#666678]">{stat.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Performance signal</h2>
              <p className="mt-1 text-sm text-[#7f7f91]">Completed-session scores across your recent practice.</p>
            </div>
            <Link href="/progress" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
              Detailed analytics
            </Link>
          </div>

          <div className="mt-6 h-64">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.34} />
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
                  <p className="mt-3 text-sm font-medium text-[#b4b4c0]">A useful trend needs more than one completed session.</p>
                  <p className="mt-1 text-xs leading-5 text-[#6d6d7e]">Start a baseline interview, review the report, then repeat one targeted skill.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Recommended next step</h2>
              <p className="mt-1 text-sm text-[#7f7f91]">Keep the loop specific and measurable.</p>
            </div>
            <Target className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/12 bg-emerald-400/[0.045] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">One focused action</p>
            <p className="mt-3 text-sm leading-6 text-[#aaaab7]">
              {recentSessions.length === 0
                ? "Complete a technical baseline and explain each decision aloud instead of optimizing only for the final answer."
                : "Open your latest evidence report, choose one improvement, and practice the same skill again before changing tracks."}
            </p>
          </div>

          <div className="mt-5 grid gap-2">
            <Link href="/plan" className="flex items-center justify-between rounded-xl border border-white/7 bg-white/[0.025] px-4 py-3 text-sm text-[#b7b7c3] transition hover:bg-white/[0.05] hover:text-white">
              Personalized prep plan <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/history" className="flex items-center justify-between rounded-xl border border-white/7 bg-white/[0.025] px-4 py-3 text-sm text-[#b7b7c3] transition hover:bg-white/[0.05] hover:text-white">
              Review interview evidence <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Choose the next interview skill</h2>
          <p className="mt-1 text-sm text-[#777789]">Avoid broad, unfocused practice. Pick one track and one improvement target.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {practicePaths.map((path) => {
            const Icon = path.icon;
            return (
              <Link
                key={path.title}
                href={path.href}
                className="group rounded-2xl border border-white/7 bg-[#111116] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/25"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/12 bg-indigo-500/10">
                  <Icon className="h-5 w-5 text-indigo-300" />
                </div>
                <h3 className="mt-5 font-semibold">{path.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#858596]">{path.description}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-indigo-300">
                  Practice now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/7 bg-[#111116]">
        <div className="flex items-center justify-between border-b border-white/7 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold">Recent sessions</h2>
            <p className="mt-1 text-xs text-[#6f6f80]">Continue learning from the actual evidence in your latest practice.</p>
          </div>
          <Link href="/history" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
            View history
          </Link>
        </div>

        {recentSessions.length > 0 ? (
          <div className="divide-y divide-white/7">
            {recentSessions.map((item) => (
              <Link
                key={item._id}
                href={`/interview/${item._id}/report`}
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div>
                  <div className="font-medium text-[#e8e8ee]">{formatInterviewType(item.type)}</div>
                  <div className="mt-1 text-xs text-[#717183]">
                    {item.company && item.company !== "general" ? `${formatInterviewType(item.company)} · ` : ""}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-5 text-sm">
                  <span className="text-[#777789]">{formatDuration(item.duration || 0)}</span>
                  <span className="font-semibold tabular-nums text-indigo-300">
                    {item.completed ? `${item.overallScore || 0}%` : "In progress"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <MessageSquare className="mx-auto h-7 w-7 text-[#5b5b6d]" />
            <p className="mt-3 text-sm font-medium text-[#aaaab7]">No interview history yet.</p>
            <p className="mt-1 text-xs leading-5 text-[#6f6f80]">Start one focused baseline to unlock evidence reports and progress trends.</p>
            <Link href="/interview" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200">
              Start first interview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
