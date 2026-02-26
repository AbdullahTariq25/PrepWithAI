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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreColor, getScoreLabel, formatDuration } from "@/lib/utils";

interface SessionReport {
  _id: string;
  type: string;
  company: string;
  difficulty: string;
  overallScore: number;
  duration: number;
  hintsUsed: number;
  messages: {
    role: string;
    content: string;
    timestamp: string;
  }[];
  questions: {
    title: string;
    userAnswer: string;
    feedback: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      seniorTip: string;
      sampleAnswer: string;
    };
  }[];
  createdAt: string;
}

export default function InterviewReportPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [report, setReport] = useState<SessionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await fetch(`/api/interview/${sessionId}`);
        const data = await res.json();
        if (data.session) {
          setReport(data.session);
        }
      } catch (error) {
        console.error("Failed to load report:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Brain className="w-12 h-12 text-violet-500 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Generating your report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Session not found</p>
        <Link href="/history">
          <Button variant="outline" className="mt-4">
            View History
          </Button>
        </Link>
      </div>
    );
  }

  const scoreColor = getScoreColor(report.overallScore);
  const scoreLabel = getScoreLabel(report.overallScore, report.difficulty);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Link
        href="/history"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
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
        <p className="text-muted-foreground capitalize">
          {report.type.replace("_", " ")} • {report.company} •{" "}
          {report.difficulty}
        </p>
      </motion.div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Score circle */}
              <div className="relative">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(report.overallScore / 100) * 314} 314`}
                    strokeLinecap="round"
                    className={scoreColor}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {report.overallScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Target className="w-4 h-4" /> Rating
                  </div>
                  <div className="font-semibold">{scoreLabel}</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" /> Duration
                  </div>
                  <div className="font-semibold">
                    {formatDuration(report.duration)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MessageSquare className="w-4 h-4" /> Messages
                  </div>
                  <div className="font-semibold">{report.messages.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Lightbulb className="w-4 h-4" /> Hints Used
                  </div>
                  <div className="font-semibold">{report.hintsUsed}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Question Feedback */}
      {report.questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Question Breakdown</h2>
          {report.questions.map((q, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <button
                  className="w-full p-5 flex items-center justify-between text-left"
                  onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        (q.feedback?.score || 0) >= 70
                          ? "bg-green-500"
                          : (q.feedback?.score || 0) >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {q.feedback?.score || 0}
                    </div>
                    <div>
                      <div className="font-medium">
                        {q.title || `Question ${i + 1}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Score: {q.feedback?.score || 0}/100
                      </div>
                    </div>
                  </div>
                  {expandedQ === i ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {expandedQ === i && q.feedback && (
                  <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                    {q.feedback.strengths?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-green-500 mb-2">
                          <CheckCircle2 className="w-4 h-4" /> Strengths
                        </div>
                        <ul className="space-y-1">
                          {q.feedback.strengths.map((s, j) => (
                            <li
                              key={j}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-green-500 mt-1">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {q.feedback.weaknesses?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-red-500 mb-2">
                          <AlertCircle className="w-4 h-4" /> Areas to Improve
                        </div>
                        <ul className="space-y-1">
                          {q.feedback.weaknesses.map((w, j) => (
                            <li
                              key={j}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-red-500 mt-1">•</span> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {q.feedback.seniorTip && (
                      <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <div className="flex items-center gap-2 text-sm font-medium text-violet-500 mb-1">
                          <Sparkles className="w-4 h-4" /> Senior Tip
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {q.feedback.seniorTip}
                        </p>
                      </div>
                    )}
                    {q.feedback.sampleAnswer && (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-500 mb-1">
                          <CheckCircle2 className="w-4 h-4" /> Sample Strong
                          Answer
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {q.feedback.sampleAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Conversation transcript */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-500" />
              Full Transcript
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {report.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "candidate" ? "justify-end" : ""}`}
                >
                  {msg.role === "interviewer" && (
                    <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl p-3 text-sm ${
                      msg.role === "candidate"
                        ? "bg-violet-600 text-white"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="border-violet-500/20 bg-violet-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-500" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.overallScore < 50 && (
              <div className="flex items-start gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                <span>
                  Focus on fundamentals. Try the same interview type at a lower
                  difficulty to build confidence.
                </span>
              </div>
            )}
            {report.overallScore >= 50 && report.overallScore < 80 && (
              <div className="flex items-start gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                <span>
                  Good progress! Review the areas to improve above and
                  re-practice this format.
                </span>
              </div>
            )}
            {report.overallScore >= 80 && (
              <div className="flex items-start gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  Excellent! Consider increasing difficulty or trying a
                  different interview type.
                </span>
              </div>
            )}
            <div className="flex items-start gap-3 text-sm">
              <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span>
                Practice a{" "}
                <Link
                  href="/interview?type=system-design"
                  className="text-violet-400 underline underline-offset-2"
                >
                  System Design
                </Link>{" "}
                interview to diversify your skills.
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <span>
                Check the{" "}
                <Link
                  href="/questions"
                  className="text-violet-400 underline underline-offset-2"
                >
                  Question Bank
                </Link>{" "}
                for curated practice problems.
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 pb-8">
        <Link href="/interview">
          <Button variant="glow" className="gap-2">
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
