"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Trophy,
  Clock,
  Lightbulb,
  ArrowLeft,
  MessageSquare,
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Code2,
  TrendingUp,
  TrendingDown,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getScoreColor,
  getScoreLabel,
  formatDuration,
  getEloLevel,
} from "@/lib/utils";

interface QuestionFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  seniorTip: string;
  sampleAnswer: string;
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
  questions: {
    title: string;
    userAnswer: string;
    feedback: QuestionFeedback;
  }[];
  grades?: {
    problemSolving: number;
    communication: number;
    codeQuality: number;
    edgeCases: number;
    timeManagement: number;
  };
  codeSubmissions?: {
    language: string;
    code: string;
    result?: { stdout: string; stderr: string; exitCode: number };
    submittedAt: string;
  }[];
  eloChange?: number;
  newElo?: number;
  createdAt: string;
}

const GRADE_LABELS = [
  {
    key: "problemSolving",
    label: "Problem Solving",
    icon: Brain,
    color: "text-indigo-400",
  },
  {
    key: "communication",
    label: "Communication",
    icon: MessageSquare,
    color: "text-blue-400",
  },
  {
    key: "codeQuality",
    label: "Code Quality",
    icon: Code2,
    color: "text-emerald-400",
  },
  {
    key: "edgeCases",
    label: "Edge Cases",
    icon: Target,
    color: "text-amber-400",
  },
  {
    key: "timeManagement",
    label: "Time Management",
    icon: Clock,
    color: "text-rose-400",
  },
];

export default function InterviewReportPage() {
  const params = useParams();
  const sessionParam = params?.id;
  const sessionId = Array.isArray(sessionParam)
    ? sessionParam[0]
    : (sessionParam ?? "");
  const [report, setReport] = useState<SessionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    const loadReport = async () => {
      try {
        const res = await fetch(`/api/interview/${sessionId}`);
        const data = await res.json();
        if (data.session) setReport(data.session);
      } catch (error) {
        console.error("Failed to load report:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [sessionId]);

  // Score count-up animation
  useEffect(() => {
    if (!report) return;
    const target = report.overallScore;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [report]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-[#080808]">
        <div className="text-center">
          <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
          <p className="text-[#888]">Generating your report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20 bg-[#080808]">
        <p className="text-[#888]">Session not found</p>
        <Link href="/history">
          <Button variant="outline" className="mt-4">
            View History
          </Button>
        </Link>
      </div>
    );
  }

  const scoreColor = getScoreColor(report.overallScore);
  const scoreLabel = getScoreLabel(report.overallScore);
  const eloLevel = report.newElo ? getEloLevel(report.newElo) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter bg-[#080808]">
      <Link
        href="/history"
        className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to History
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Interview Complete!</h1>
        <p className="text-[#888] capitalize">
          {report.type.replace(/_/g, " ")} &bull; {report.company} &bull;{" "}
          {report.difficulty}
        </p>
        {report.eloChange !== undefined && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {report.eloChange >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <span
              className={`font-bold text-lg ${report.eloChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {report.eloChange >= 0 ? "+" : ""}
              {report.eloChange} ELO
            </span>
            {eloLevel && (
              <Badge variant="outline" className={eloLevel.color}>
                {eloLevel.name} ({report.newElo})
              </Badge>
            )}
          </div>
        )}
      </motion.div>

      {/* Score + Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-[#111] border border-white/8 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(displayScore / 100) * 314} 314`}
                  strokeLinecap="round"
                  className={scoreColor}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tabular-nums">
                  {displayScore}
                </span>
                <span className="text-xs text-[#555]">/100</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
              {[
                {
                  icon: Star,
                  label: "Rating",
                  value: scoreLabel,
                  color: "text-amber-400",
                },
                {
                  icon: Clock,
                  label: "Duration",
                  value: formatDuration(report.duration),
                  color: "text-blue-400",
                },
                {
                  icon: MessageSquare,
                  label: "Messages",
                  value: report.messages.length,
                  color: "text-indigo-400",
                },
                {
                  icon: Lightbulb,
                  label: "Hints Used",
                  value: report.hintsUsed,
                  color: "text-emerald-400",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl bg-white/4 border border-white/4"
                >
                  <div className="flex items-center gap-2 text-xs text-[#555] mb-1">
                    <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />{" "}
                    {stat.label}
                  </div>
                  <div className="font-semibold">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grades breakdown */}
      {report.grades && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-[#111] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-sm">Performance Grades</h3>
            </div>
            <div className="space-y-4">
              {GRADE_LABELS.map((g) => {
                const val =
                  report.grades?.[g.key as keyof typeof report.grades] || 0;
                return (
                  <div key={g.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <g.icon className={`w-4 h-4 ${g.color}`} />
                        <span className="text-[#ccc]">{g.label}</span>
                      </div>
                      <span className="text-sm font-mono font-medium tabular-nums text-[#888]">
                        {val}/100
                      </span>
                    </div>
                    <Progress value={val} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Code Submissions */}
      {report.codeSubmissions && report.codeSubmissions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-[#111] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-sm">
                Code Submissions ({report.codeSubmissions.length})
              </h3>
            </div>
            <div className="space-y-4">
              {report.codeSubmissions.map((sub, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/6 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-3 py-2 bg-white/4">
                    <Badge variant="secondary" className="text-xs">
                      {sub.language}
                    </Badge>
                    {sub.result && (
                      <Badge
                        variant={
                          sub.result.exitCode === 0 ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {sub.result.exitCode === 0 ? "Passed" : "Error"}
                      </Badge>
                    )}
                  </div>
                  <pre className="p-3 text-xs font-mono overflow-x-auto max-h-48 bg-[#0A0A0A] text-[#ccc]">
                    {sub.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Question Feedback */}
      {report.questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold">Question Breakdown</h2>
          {report.questions.map((q, i) => (
            <div
              key={i}
              className="bg-[#111] border border-white/8 rounded-xl overflow-hidden"
            >
              <button
                className="w-full p-5 flex items-center justify-between text-left hover:bg-white/2 transition-colors"
                onClick={() => setExpandedQ(expandedQ === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${(q.feedback?.score || 0) >= 70 ? "bg-green-500" : (q.feedback?.score || 0) >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                  >
                    {q.feedback?.score || 0}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {q.title || `Question ${i + 1}`}
                    </div>
                    <div className="text-xs text-[#555]">
                      Score: {q.feedback?.score || 0}/100
                    </div>
                  </div>
                </div>
                {expandedQ === i ? (
                  <ChevronUp className="w-5 h-5 text-[#555]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#555]" />
                )}
              </button>
              {expandedQ === i && q.feedback && (
                <div className="px-5 pb-5 space-y-4 border-t border-white/6 pt-4">
                  {q.feedback.strengths?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-green-400 mb-2">
                        <CheckCircle2 className="w-4 h-4" /> Strengths
                      </div>
                      <ul className="space-y-1">
                        {q.feedback.strengths.map((s, j) => (
                          <li
                            key={j}
                            className="text-sm text-[#888] flex items-start gap-2"
                          >
                            <span className="text-green-500 mt-1">&bull;</span>{" "}
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {q.feedback.weaknesses?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-red-400 mb-2">
                        <AlertCircle className="w-4 h-4" /> Areas to Improve
                      </div>
                      <ul className="space-y-1">
                        {q.feedback.weaknesses.map((w, j) => (
                          <li
                            key={j}
                            className="text-sm text-[#888] flex items-start gap-2"
                          >
                            <span className="text-red-500 mt-1">&bull;</span>{" "}
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {q.feedback.seniorTip && (
                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                      <div className="flex items-center gap-2 text-sm font-medium text-indigo-400 mb-1">
                        <Sparkles className="w-4 h-4" /> Senior Tip
                      </div>
                      <p className="text-sm text-[#888]">
                        {q.feedback.seniorTip}
                      </p>
                    </div>
                  )}
                  {q.feedback.sampleAnswer && (
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-1">
                        <CheckCircle2 className="w-4 h-4" /> Sample Answer
                      </div>
                      <p className="text-sm text-[#888] whitespace-pre-wrap">
                        {q.feedback.sampleAnswer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* Transcript */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <button
            className="flex items-center justify-between w-full p-5 hover:bg-white/2 transition-colors"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-sm">Full Transcript</h3>
            </div>
            {showTranscript ? (
              <ChevronUp className="w-5 h-5 text-[#555]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#555]" />
            )}
          </button>
          {showTranscript && (
            <div className="px-5 pb-5 border-t border-white/6 pt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {report.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "candidate" || msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {(msg.role === "interviewer" ||
                      msg.role === "assistant") && (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <Brain className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.role === "candidate" || msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white/4"}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="border border-indigo-500/20 bg-indigo-500/5 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-sm">Recommended Next Steps</h3>
          </div>
          <div className="space-y-3">
            {report.overallScore < 50 && (
              <div className="flex items-start gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-[#ccc]">
                  Focus on fundamentals. Try the same type at a lower difficulty
                  to build confidence.
                </span>
              </div>
            )}
            {report.overallScore >= 50 && report.overallScore < 80 && (
              <div className="flex items-start gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-[#ccc]">
                  Good progress! Review your weak areas and practice more in
                  those categories.
                </span>
              </div>
            )}
            {report.overallScore >= 80 && (
              <div className="flex items-start gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <span className="text-[#ccc]">
                  Excellent work! Consider increasing difficulty or trying a
                  different interview type.
                </span>
              </div>
            )}
            <div className="flex items-start gap-3 text-sm">
              <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <span className="text-[#ccc]">
                Check the{" "}
                <Link
                  href="/questions"
                  className="text-indigo-400 underline underline-offset-2"
                >
                  Question Bank
                </Link>{" "}
                for targeted practice.
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 pb-8">
        <Link href="/interview">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Sparkles className="w-4 h-4" /> Practice Again
          </Button>
        </Link>
        <Link href="/history">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> View History
          </Button>
        </Link>
      </div>
    </div>
  );
}
