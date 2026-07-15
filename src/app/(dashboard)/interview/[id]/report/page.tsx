"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Code2,
  FileSearch,
  Gauge,
  Lightbulb,
  MessageSquare,
  Quote,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatDuration,
  getEloLevel,
  getScoreColor,
  getScoreLabel,
} from "@/lib/utils";

interface Grades {
  problemSolving: number;
  communication: number;
  codeQuality: number;
  edgeCases: number;
  timeManagement: number;
}

interface EvidenceItem {
  dimension: keyof Grades;
  quote: string;
  reason: string;
}

interface SessionReport {
  _id: string;
  type: string;
  company: string;
  difficulty: string;
  overallScore: number;
  duration: number;
  hintsUsed: number;
  messages: { role: string; content: string; timestamp: string }[];
  codeSubmissions?: { language: string; code: string; output?: string }[];
  grades?: Grades;
  eloChange?: number;
  eloAfter?: number;
  completed: boolean;
  reportGenerated: boolean;
  strengths?: string[];
  improvements?: string[];
  summary?: string;
  seniorTip?: string;
  recommendedTopics?: string[];
  feedbackEvidence?: EvidenceItem[];
  evaluationConfidence?: number;
  nextPracticeFocus?: string;
  hiringSignal?: "strong_no" | "no" | "mixed" | "yes" | "strong_yes";
  rubricVersion?: string;
  createdAt: string;
}

const gradeMeta: Array<{
  key: keyof Grades;
  label: string;
  icon: typeof Brain;
  description: string;
}> = [
  {
    key: "problemSolving",
    label: "Problem solving",
    icon: Brain,
    description: "Decomposition, correctness, and decision quality",
  },
  {
    key: "communication",
    label: "Communication",
    icon: MessageSquare,
    description: "Clarity, structure, and explicit reasoning",
  },
  {
    key: "codeQuality",
    label: "Technical quality",
    icon: Code2,
    description: "Implementation quality and maintainability",
  },
  {
    key: "edgeCases",
    label: "Edge cases",
    icon: ShieldCheck,
    description: "Failure modes, validation, and completeness",
  },
  {
    key: "timeManagement",
    label: "Time management",
    icon: Clock3,
    description: "Prioritization and interview pacing",
  },
];

const signalCopy: Record<
  NonNullable<SessionReport["hiringSignal"]>,
  { label: string; detail: string }
> = {
  strong_no: {
    label: "Significant gap",
    detail: "The current evidence is materially below the requested practice level.",
  },
  no: {
    label: "Below target",
    detail: "Important gaps remain before this would look consistently interview-ready.",
  },
  mixed: {
    label: "Mixed signal",
    detail: "There is promising evidence, but the result is not yet consistent.",
  },
  yes: {
    label: "Positive signal",
    detail: "The evidence is strong with a limited number of important gaps.",
  },
  strong_yes: {
    label: "Strong positive signal",
    detail: "The evidence is consistently strong for the requested practice level.",
  },
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function InterviewReportPage() {
  const params = useParams();
  const sessionParam = params?.id;
  const sessionId = Array.isArray(sessionParam)
    ? sessionParam[0]
    : (sessionParam ?? "");
  const [report, setReport] = useState<SessionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadReport() {
      setLoading(true);
      setError("");

      try {
        let response = await fetch(`/api/interview/${sessionId}`, {
          cache: "no-store",
        });
        let payload = await response.json();

        if (!response.ok || !payload.session) {
          throw new Error(payload.error || "Session not found");
        }

        if (!payload.session.reportGenerated) {
          const feedbackResponse = await fetch(
            `/api/interview/${sessionId}/feedback`,
            { method: "POST" },
          );
          const feedbackPayload = await feedbackResponse.json();
          if (!feedbackResponse.ok) {
            throw new Error(
              feedbackPayload.error || "Could not generate the interview report",
            );
          }

          response = await fetch(`/api/interview/${sessionId}`, {
            cache: "no-store",
          });
          payload = await response.json();
        }

        if (active) setReport(payload.session);
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load the interview report",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadReport();
    return () => {
      active = false;
    };
  }, [sessionId]);

  const sortedGrades = useMemo(() => {
    if (!report?.grades) return [];
    return gradeMeta.map((item) => ({
      ...item,
      value: report.grades?.[item.key] || 0,
    }));
  }, [report?.grades]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
            <FileSearch className="h-6 w-6 animate-pulse text-indigo-300" />
          </div>
          <h1 className="mt-5 text-xl font-semibold">Evaluating the evidence</h1>
          <p className="mt-2 text-sm leading-6 text-[#7f7f91]">
            Calibrating the score, checking consistency across dimensions, and building one focused next step.
          </p>
        </div>
      </div>
    );
  }

  if (!report || error) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <AlertTriangle className="mx-auto h-9 w-9 text-amber-400" />
        <h1 className="mt-4 text-xl font-semibold">Report unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-[#858596]">
          {error || "This interview session could not be found."}
        </p>
        <Link href="/history" className="mt-6 inline-flex">
          <Button variant="outline">Back to history</Button>
        </Link>
      </div>
    );
  }

  const scoreColor = getScoreColor(report.overallScore);
  const scoreLabel = getScoreLabel(report.overallScore);
  const confidence = report.evaluationConfidence || 0;
  const signal = signalCopy[report.hiringSignal || "mixed"];
  const eloLevel = report.eloAfter ? getEloLevel(report.eloAfter) : null;
  const evidence = report.feedbackEvidence || [];
  const strengths = report.strengths || [];
  const improvements = report.improvements || [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12 page-enter">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-sm text-[#858596] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to history
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.025] px-3 py-1.5 text-xs text-[#777789]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Rubric {report.rubricVersion || "1.0"} · {confidence}% evaluation confidence
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/10 via-[#111116] to-[#0b0b10] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="text-center lg:text-left">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
              {formatLabel(report.type)} · {formatLabel(report.difficulty)}
            </div>
            <div className="mt-5 flex items-end justify-center gap-3 lg:justify-start">
              <span className={`text-7xl font-bold tracking-[-0.06em] ${scoreColor}`}>
                {report.overallScore}
              </span>
              <span className="pb-2 text-sm text-[#68687a]">/100</span>
            </div>
            <div className="mt-2 text-lg font-semibold">{scoreLabel}</div>
            <p className="mt-3 text-sm leading-6 text-[#8d8d9d]">
              This score is a coaching estimate based on the evidence in this session, not a guarantee of an employer decision.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#676779]">
                <Gauge className="h-4 w-4 text-indigo-300" /> Practice signal
              </div>
              <div className="mt-4 text-xl font-semibold">{signal.label}</div>
              <p className="mt-2 text-sm leading-6 text-[#8d8d9c]">{signal.detail}</p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#676779]">
                <Clock3 className="h-4 w-4 text-blue-300" /> Session
              </div>
              <div className="mt-4 text-xl font-semibold">
                {formatDuration(report.duration)}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#8d8d9c]">
                {report.messages.length} transcript messages · {report.hintsUsed || 0} hints used
              </p>
            </div>

            {report.eloChange !== undefined && report.eloAfter !== undefined && (
              <div className="rounded-2xl border border-white/8 bg-black/20 p-5 sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#676779]">
                      Skill rating movement
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {report.eloChange >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-400" />
                      )}
                      <span className="text-2xl font-bold tabular-nums">
                        {report.eloChange >= 0 ? "+" : ""}
                        {report.eloChange}
                      </span>
                    </div>
                  </div>
                  {eloLevel && (
                    <div className="text-right">
                      <div className="text-sm font-semibold" style={{ color: eloLevel.color }}>
                        {eloLevel.name}
                      </div>
                      <div className="mt-1 font-mono text-2xl font-bold">{report.eloAfter}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.045] p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
              <Target className="h-4 w-4" /> Highest-leverage next practice
            </div>
            <h2 className="mt-3 text-xl font-semibold sm:text-2xl">
              {report.nextPracticeFocus || improvements[0] || "Repeat one focused session and make your reasoning explicit."}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#91a199]">
              The goal is not to repeat the entire interview. Practice this one skill until it becomes consistent, then reassess.
            </p>
          </div>
          <Link
            href={`/interview?type=${encodeURIComponent(report.type)}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#07120b] transition hover:bg-emerald-300"
          >
            Practice again <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-300" />
            <h2 className="text-lg font-semibold">Calibrated skill breakdown</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#777789]">
            The overall score is normalized against these dimensions so one optimistic number cannot contradict the detailed assessment.
          </p>

          <div className="mt-6 space-y-5">
            {sortedGrades.map((grade) => {
              const Icon = grade.icon;
              return (
                <div key={grade.key}>
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/8">
                        <Icon className="h-4 w-4 text-indigo-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{grade.label}</div>
                        <div className="mt-0.5 text-xs text-[#666678]">{grade.description}</div>
                      </div>
                    </div>
                    <div className="font-mono text-sm font-semibold tabular-nums text-[#a9a9b7]">
                      {grade.value}
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                      style={{ width: `${grade.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-300" />
            <h2 className="text-lg font-semibold">Evaluator summary</h2>
          </div>
          <p className="mt-5 text-sm leading-7 text-[#a0a0ae]">
            {report.summary || "Complete another session to build a stronger evidence base."}
          </p>

          <div className="mt-6 rounded-2xl border border-amber-400/12 bg-amber-400/[0.045] p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-300">
              Senior coaching tip
            </div>
            <p className="mt-2 text-sm leading-6 text-[#a9a398]">
              {report.seniorTip || "Make assumptions and trade-offs explicit before committing to an answer."}
            </p>
          </div>

          {report.recommendedTopics && report.recommendedTopics.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666678]">
                Recommended topics
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {report.recommendedTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-[#aaaaba]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {evidence.length > 0 && (
        <section className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Quote className="h-5 w-5 text-violet-300" />
                <h2 className="text-lg font-semibold">Evidence behind the evaluation</h2>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#777789]">
                Short quotes are taken from the candidate transcript so the feedback can be inspected instead of treated as a black-box score.
              </p>
            </div>
            <div className="rounded-full border border-white/8 bg-white/[0.025] px-3 py-1.5 text-xs text-[#777789]">
              {evidence.length} evidence points
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {evidence.map((item, index) => (
              <article
                key={`${item.dimension}-${index}`}
                className="rounded-2xl border border-white/7 bg-black/20 p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-300">
                  {formatLabel(item.dimension)}
                </div>
                <blockquote className="mt-3 border-l-2 border-violet-400/40 pl-4 text-sm italic leading-6 text-[#c3c3ce]">
                  “{item.quote}”
                </blockquote>
                <p className="mt-4 text-sm leading-6 text-[#858596]">{item.reason}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/12 bg-emerald-400/[0.035] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            <h2 className="font-semibold">What worked</h2>
          </div>
          <div className="mt-5 space-y-3">
            {strengths.length > 0 ? (
              strengths.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-[#a7b5ac]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {item}
                </div>
              ))
            ) : (
              <p className="text-sm text-[#777789]">More session evidence is needed to identify reliable strengths.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/12 bg-amber-400/[0.035] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-amber-300">
            <RefreshCw className="h-5 w-5" />
            <h2 className="font-semibold">What to change</h2>
          </div>
          <div className="mt-5 space-y-3">
            {improvements.length > 0 ? (
              improvements.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-[#b5ad9f]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {item}
                </div>
              ))
            ) : (
              <p className="text-sm text-[#777789]">No specific improvement was recorded for this session.</p>
            )}
          </div>
        </div>
      </section>

      {report.codeSubmissions && report.codeSubmissions.length > 0 && (
        <details className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <summary className="cursor-pointer list-none font-semibold">
            Code submitted during the interview ({report.codeSubmissions.length})
          </summary>
          <div className="mt-5 space-y-4">
            {report.codeSubmissions.map((submission, index) => (
              <div key={`${submission.language}-${index}`} className="overflow-hidden rounded-xl border border-white/7">
                <div className="border-b border-white/7 bg-white/[0.025] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#777789]">
                  {submission.language}
                </div>
                <pre className="overflow-x-auto bg-black/25 p-4 text-xs leading-6 text-[#c8c8d2]">
                  <code>{submission.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </details>
      )}

      <details className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
        <summary className="cursor-pointer list-none font-semibold">
          Review interview transcript ({report.messages.length} messages)
        </summary>
        <div className="mt-5 space-y-3">
          {report.messages.map((message, index) => (
            <div
              key={`${message.timestamp}-${index}`}
              className={`rounded-xl border p-4 text-sm leading-6 ${
                message.role === "candidate"
                  ? "border-indigo-400/12 bg-indigo-400/[0.035]"
                  : "border-white/7 bg-black/20"
              }`}
            >
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#666678]">
                {message.role === "candidate" ? "Candidate" : "Interviewer"}
              </div>
              <div className="whitespace-pre-wrap text-[#b7b7c2]">{message.content}</div>
            </div>
          ))}
        </div>
      </details>

      <div className="flex flex-col gap-3 border-t border-white/7 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs leading-5 text-[#5f5f70]">
          AI coaching is an estimate. Use repeated sessions and real interview outcomes to validate progress.
        </div>
        <div className="flex gap-3">
          <Link href="/progress">
            <Button variant="outline">View progress</Button>
          </Link>
          <Link href="/interview">
            <Button className="gap-2">
              New interview <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
