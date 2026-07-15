"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Building2,
  Cloud,
  Code2,
  Crown,
  Keyboard,
  Layers,
  Layout,
  Loader2,
  LockKeyhole,
  MessageSquare,
  Mic,
  Monitor,
  Network,
  Server,
  Smartphone,
  Sparkles,
  Target,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COMPANY_PACKS, INTERVIEW_TYPES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Network,
  Users,
  Monitor,
  Server,
  Layers,
  Cloud,
  Smartphone,
  Brain,
  Target,
  Crown,
  Trophy,
  MessageSquare,
  Layout,
};

const difficulties = [
  { id: "junior", name: "Junior", desc: "New grad / 0-2 years", emoji: "🌱" },
  { id: "mid", name: "Mid-Level", desc: "Independent contributor / 2-5 years", emoji: "🚀" },
  { id: "senior", name: "Senior", desc: "Senior ownership / 5+ years", emoji: "⭐" },
  { id: "staff", name: "Staff+", desc: "Cross-team technical leadership", emoji: "👑" },
] as const;

const modeCards = [
  {
    id: "text" as const,
    name: "Text",
    desc: "Type answers and use the coding workspace.",
    icon: Keyboard,
    gradient: "from-zinc-500 to-zinc-700",
    pro: false,
  },
  {
    id: "voice" as const,
    name: "Voice",
    desc: "Practice speaking answers naturally.",
    icon: Mic,
    gradient: "from-violet-500 to-purple-600",
    pro: true,
  },
  {
    id: "video" as const,
    name: "Video",
    desc: "Add camera presence to the interview simulation.",
    icon: Video,
    gradient: "from-indigo-500 to-cyan-500",
    pro: true,
  },
];

type InterviewMode = (typeof modeCards)[number]["id"];

export default function InterviewSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <InterviewSetupContent />
    </Suspense>
  );
}

function InterviewSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: authSession } = useSession();

  const preselectedType = searchParams?.get("type")?.replace(/-/g, "_") ?? null;
  const preselectedCompany = searchParams?.get("company") ?? null;
  const preselectedMode = searchParams?.get("mode") as InterviewMode | null;

  const [step, setStep] = useState(preselectedType ? 1 : 0);
  const [type, setType] = useState(preselectedType ?? "");
  const [company, setCompany] = useState(preselectedCompany ?? "general");
  const [difficulty, setDifficulty] = useState("mid");
  const [interviewMode, setInterviewMode] = useState<InterviewMode>(
    preselectedMode && modeCards.some((mode) => mode.id === preselectedMode)
      ? preselectedMode
      : "text",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasProAccess = Boolean(
    authSession?.user &&
      (authSession.user.plan === "pro" ||
        authSession.user.plan === "team" ||
        authSession.user.plan === "enterprise" ||
        authSession.user.isOnProTrial),
  );

  const selectedTrack = useMemo(
    () => INTERVIEW_TYPES.find((item) => item.id === type),
    [type],
  );
  const selectedCompany = useMemo(
    () => COMPANY_PACKS.find((item) => item.id === company),
    [company],
  );
  const trackRequiresPro = type !== "dsa";
  const selectedModeRequiresPro = interviewMode !== "text";
  const requiresUpgrade = !hasProAccess && (trackRequiresPro || selectedModeRequiresPro);

  const steps = ["Track", "Company", "Level", "Start"];

  function chooseMode(mode: InterviewMode) {
    setError("");
    setInterviewMode(mode);
  }

  async function startInterview() {
    setError("");

    if (requiresUpgrade) {
      router.push("/pricing");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          company,
          difficulty,
          voiceMode: interviewMode === "voice",
          videoMode: interviewMode === "video",
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.sessionId) {
        throw new Error(data.error || "Unable to create the interview session");
      }

      if (interviewMode === "video") {
        router.push(`/interview/${data.sessionId}/video`);
      } else if (interviewMode === "voice") {
        router.push(`/interview/${data.sessionId}/voice`);
      } else {
        router.push(`/interview/${data.sessionId}`);
      }
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to create the interview session",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 page-enter">
      <header className="text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-3 py-1.5 text-xs font-medium text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" /> Calibrated interview simulation
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Build the session you actually need.</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#8b8b9b] sm:text-base">
          Choose one interview signal, a preparation context, and the level you want the evaluator to hold you against.
        </p>
      </header>

      <div className="flex items-center justify-center gap-2">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`grid h-8 w-8 place-items-center rounded-full text-sm font-medium transition ${
                index <= step ? "bg-indigo-600 text-white" : "bg-[#16161d] text-[#626274]"
              }`}
            >
              {index + 1}
            </div>
            <span className={`hidden text-sm sm:block ${index <= step ? "text-white" : "text-[#626274]"}`}>
              {label}
            </span>
            {index < steps.length - 1 && (
              <div className={`h-px w-7 sm:w-10 ${index < step ? "bg-indigo-500" : "bg-white/8"}`} />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {INTERVIEW_TYPES.map((track) => {
            const Icon = iconMap[track.icon] || Code2;
            const isFreeTrack = track.id === "dsa";
            const selected = type === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => {
                  setType(track.id);
                  setError("");
                }}
                className={`relative rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 ${
                  selected
                    ? "border-indigo-500 bg-indigo-500/[0.06] shadow-lg shadow-indigo-950/30"
                    : "border-white/8 bg-[#111116] hover:border-white/15"
                }`}
              >
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${track.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">{track.name}</h2>
                  <Badge
                    className={`text-[10px] ${
                      isFreeTrack
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        : "border-violet-500/20 bg-violet-500/10 text-violet-300"
                    }`}
                  >
                    {isFreeTrack ? "Free" : "Pro"}
                  </Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#737384]">{track.description}</p>
              </button>
            );
          })}
        </section>
      )}

      {step === 1 && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => setCompany("general")}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
              company === "general"
                ? "border-indigo-500 bg-indigo-500/[0.06]"
                : "border-white/8 bg-[#111116] hover:border-white/15"
            }`}
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-700">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium">General</div>
              <div className="text-xs text-[#6f6f80]">No company-specific lens</div>
            </div>
          </button>

          {COMPANY_PACKS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCompany(item.id)}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                company === item.id
                  ? "border-indigo-500 bg-indigo-500/[0.06]"
                  : "border-white/8 bg-[#111116] hover:border-white/15"
              }`}
            >
              <div
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{item.name}</div>
                <div className="text-xs capitalize text-[#6f6f80]">{item.region.replace("_", " ")}</div>
              </div>
            </button>
          ))}
        </section>
      )}

      {step === 2 && (
        <section className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {difficulties.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => setDifficulty(level.id)}
              className={`rounded-2xl border p-6 text-left transition ${
                difficulty === level.id
                  ? "border-indigo-500 bg-indigo-500/[0.06]"
                  : "border-white/8 bg-[#111116] hover:border-white/15"
              }`}
            >
              <div className="text-3xl">{level.emoji}</div>
              <h2 className="mt-4 font-semibold">{level.name}</h2>
              <p className="mt-1 text-sm text-[#737384]">{level.desc}</p>
            </button>
          ))}
        </section>
      )}

      {step === 3 && (
        <section className="mx-auto max-w-3xl rounded-3xl border border-white/8 bg-[#111116] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-white/7 bg-black/20 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666678]">Session calibration</div>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-[#6f6f80]">Track</dt>
                  <dd className="mt-1 font-medium">{selectedTrack?.label || type.replace(/_/g, " ")}</dd>
                </div>
                <div>
                  <dt className="text-[#6f6f80]">Preparation context</dt>
                  <dd className="mt-1 font-medium">{selectedCompany?.name || "General"}</dd>
                </div>
                <div>
                  <dt className="text-[#6f6f80]">Requested level</dt>
                  <dd className="mt-1 font-medium capitalize">{difficulty}</dd>
                </div>
              </dl>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Choose interview mode</h2>
                  <p className="mt-1 text-sm text-[#777789]">The same final evidence-based evaluator is used across modes.</p>
                </div>
                <Brain className="h-6 w-6 text-indigo-300" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {modeCards.map((mode) => {
                  const ModeIcon = mode.icon;
                  const locked = mode.pro && !hasProAccess;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => chooseMode(mode.id)}
                      className={`relative rounded-2xl border p-4 text-left transition ${
                        interviewMode === mode.id
                          ? "border-indigo-500 bg-indigo-500/[0.06]"
                          : "border-white/8 bg-black/15 hover:border-white/15"
                      }`}
                    >
                      {mode.pro && (
                        <Badge className="absolute right-2 top-2 border-violet-500/20 bg-violet-500/10 text-[9px] text-violet-300">
                          {locked ? "PRO" : "INCLUDED"}
                        </Badge>
                      )}
                      <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${mode.gradient}`}>
                        <ModeIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="mt-4 text-sm font-medium">{mode.name}</div>
                      <p className="mt-1 text-xs leading-5 text-[#717182]">{mode.desc}</p>
                    </button>
                  );
                })}
              </div>

              {requiresUpgrade && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-4 text-sm text-violet-100/80">
                  <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                  This track or interview mode requires Pro or an active Pro trial. The button below will take you to plans instead of creating a blocked session.
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              <Button
                onClick={startInterview}
                variant="glow"
                size="lg"
                className="mt-6 w-full gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : requiresUpgrade ? <LockKeyhole className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                {requiresUpgrade
                  ? "View Pro access"
                  : interviewMode === "video"
                    ? "Start video interview"
                    : interviewMode === "voice"
                      ? "Start voice interview"
                      : "Start interview"}
              </Button>
            </div>
          </div>
        </section>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="gap-2 text-[#888]"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        {step < 3 && (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && !type}
            className="gap-2"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
