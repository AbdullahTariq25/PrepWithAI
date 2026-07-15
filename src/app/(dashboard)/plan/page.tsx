"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flag,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

interface PrepPlan {
  targetRole: string;
  targetCompany: string;
  targetDate: string | null;
  daysUntilTarget: number | null;
  experienceLevel: string;
  preferredTypes: string[];
  focusType: string;
  focusLabel: string;
  nextPracticeFocus: string;
  weeklyGoal: number;
  sessionsThisWeek: number;
  remainingThisWeek: number;
  cadence: string;
  baselineEstablished: boolean;
  averageScore: number;
  recentSessions: Array<{
    id: string;
    type: string;
    typeLabel: string;
    score: number;
    nextPracticeFocus: string;
    evaluationConfidence: number;
    createdAt: string;
  }>;
}

function formatCompany(value: string) {
  if (!value || value === "general") return "General preparation";
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function PreparationPlanPage() {
  const [plan, setPlan] = useState<PrepPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlan = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/prep-plan", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.plan) {
        throw new Error(payload.error || "Could not build your preparation plan");
      }
      setPlan(payload.plan);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not build your preparation plan",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-indigo-300" />
          <p className="mt-4 text-sm text-[#777789]">Building your preparation plan…</p>
        </div>
      </div>
    );
  }

  if (!plan || error) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <Target className="mx-auto h-9 w-9 text-amber-300" />
        <h1 className="mt-4 text-xl font-semibold">Preparation plan unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-[#7f7f91]">{error}</p>
        <button
          type="button"
          onClick={loadPlan}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950"
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  const progress = Math.min(
    100,
    Math.round((plan.sessionsThisWeek / Math.max(plan.weeklyGoal, 1)) * 100),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 page-enter">
      <section className="overflow-hidden rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/12 via-[#111116] to-[#0b0b10] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/8 px-3 py-1.5 text-xs font-medium text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" /> Personalized preparation plan
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
              Prepare for {plan.targetRole} with one measurable improvement at a time.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9292a3] sm:text-base">
              Your plan uses your selected tracks, recent report evidence, weekly cadence, and target date to choose the next useful practice step.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666678]">
              Current target
            </div>
            <div className="mt-3 text-xl font-semibold">{formatCompany(plan.targetCompany)}</div>
            <div className="mt-2 text-sm capitalize text-[#858596]">
              {plan.experienceLevel} practice level
            </div>
            {plan.daysUntilTarget !== null && (
              <div className="mt-4 flex items-center gap-2 text-sm text-indigo-300">
                <CalendarDays className="h-4 w-4" />
                {plan.daysUntilTarget === 0
                  ? "Target date is today"
                  : `${plan.daysUntilTarget} days until target date`}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.045] p-6 sm:p-7">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
            <Target className="h-4 w-4" /> Next best session
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">{plan.focusLabel}</h2>
          <p className="mt-4 text-base leading-7 text-[#a6b4ac]">{plan.nextPracticeFocus}</p>
          <Link
            href={`/interview?type=${encodeURIComponent(plan.focusType)}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#07120b] transition hover:bg-emerald-300"
          >
            Start focused practice <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-3xl border border-white/7 bg-[#111116] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666678]">
                Weekly cadence
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {plan.sessionsThisWeek} / {plan.weeklyGoal}
              </div>
            </div>
            {progress >= 100 ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            ) : (
              <Clock3 className="h-6 w-6 text-indigo-300" />
            )}
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-5 text-sm leading-6 text-[#858596]">{plan.cadence}</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/7 bg-[#111116] p-5">
          <Flag className="h-5 w-5 text-indigo-300" />
          <div className="mt-4 text-xs uppercase tracking-[0.12em] text-[#666678]">Baseline</div>
          <div className="mt-2 font-semibold">
            {plan.baselineEstablished ? "Established" : "Not established yet"}
          </div>
        </div>
        <div className="rounded-2xl border border-white/7 bg-[#111116] p-5">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <div className="mt-4 text-xs uppercase tracking-[0.12em] text-[#666678]">Average score</div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">
            {plan.baselineEstablished ? `${plan.averageScore}%` : "—"}
          </div>
        </div>
        <div className="rounded-2xl border border-white/7 bg-[#111116] p-5">
          <Target className="h-5 w-5 text-violet-300" />
          <div className="mt-4 text-xs uppercase tracking-[0.12em] text-[#666678]">Sessions remaining</div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">{plan.remainingThisWeek}</div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/7 bg-[#111116] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Recent evidence loop</h2>
            <p className="mt-1 text-sm text-[#777789]">
              Review what the last sessions said before adding more practice volume.
            </p>
          </div>
          <Link href="/history" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
            Full history
          </Link>
        </div>

        {plan.recentSessions.length > 0 ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {plan.recentSessions.map((session) => (
              <Link
                key={session.id}
                href={`/interview/${session.id}/report`}
                className="rounded-2xl border border-white/7 bg-black/20 p-5 transition hover:border-indigo-400/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{session.typeLabel}</div>
                  <div className="font-mono text-lg font-bold">{session.score}</div>
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#858596]">
                  {session.nextPracticeFocus || "Review the report and select one improvement to repeat."}
                </p>
                <div className="mt-4 text-xs text-[#606071]">
                  {session.evaluationConfidence}% evaluation confidence
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-white/8 bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-[#858596]">
              Complete your first calibrated interview to start the evidence loop.
            </p>
            <Link
              href={`/interview?type=${encodeURIComponent(plan.focusType)}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-300"
            >
              Start baseline <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
