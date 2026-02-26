"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Code2,
  Network,
  MessageSquare,
  Layout,
  Server,
  Trophy,
  Building2,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const interviewTypes = [
  {
    id: "dsa",
    name: "DSA",
    icon: Code2,
    desc: "Data structures, algorithms, problem solving",
    color: "bg-blue-500",
  },
  {
    id: "system-design",
    name: "System Design",
    icon: Network,
    desc: "Architecture, scalability, trade-offs",
    color: "bg-purple-500",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    icon: MessageSquare,
    desc: "STAR method, leadership, teamwork",
    color: "bg-green-500",
  },
  {
    id: "frontend",
    name: "Frontend",
    icon: Layout,
    desc: "React, CSS, JavaScript concepts",
    color: "bg-orange-500",
  },
  {
    id: "backend",
    name: "Backend",
    icon: Server,
    desc: "APIs, databases, architecture",
    color: "bg-red-500",
  },
  {
    id: "full-loop",
    name: "Full Loop",
    icon: Trophy,
    desc: "Complete interview simulation",
    color: "bg-indigo-500",
  },
];

const companies = [
  { id: "google", name: "Google" },
  { id: "meta", name: "Meta" },
  { id: "amazon", name: "Amazon" },
  { id: "apple", name: "Apple" },
  { id: "microsoft", name: "Microsoft" },
  { id: "stripe", name: "Stripe" },
  { id: "general", name: "General" },
];

const difficulties = [
  { id: "junior", name: "Junior", desc: "New grad / 0-2 years", emoji: "🌱" },
  { id: "mid", name: "Mid-Level", desc: "Mid-level / 2-5 years", emoji: "🚀" },
  { id: "senior", name: "Senior", desc: "Senior / 5+ years", emoji: "⭐" },
  {
    id: "staff",
    name: "Staff+",
    desc: "Staff engineer / 10+ years",
    emoji: "👑",
  },
];

export default function InterviewSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
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
  const preselectedType = searchParams.get("type");

  const [step, setStep] = useState(preselectedType ? 1 : 0);
  const [type, setType] = useState(preselectedType ?? "");
  const [company, setCompany] = useState("general");
  const [difficulty, setDifficulty] = useState("mid");
  const [voiceMode, setVoiceMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = ["Type", "Company", "Difficulty", "Start"];

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, company, difficulty, voiceMode }),
      });
      const data = await res.json();
      if (data.sessionId) {
        router.push(`/interview/${data.sessionId}`);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Start New Interview</h1>
        <p className="text-muted-foreground">Configure your practice session</p>
      </motion.div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                i <= step
                  ? "bg-violet-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm hidden sm:block ${
                i <= step ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  i < step ? "bg-violet-600" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Type */}
        {step === 0 && (
          <motion.div
            key="type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {interviewTypes.map((t) => (
              <Card
                key={t.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  type === t.id
                    ? "border-violet-500 shadow-lg shadow-violet-500/10"
                    : ""
                }`}
                onClick={() => setType(t.id)}
              >
                <CardContent className="p-5">
                  <div
                    className={`w-10 h-10 rounded-lg ${t.color} flex items-center justify-center mb-3`}
                  >
                    <t.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Step 1: Company */}
        {step === 1 && (
          <motion.div
            key="company"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {companies.map((c) => (
              <Card
                key={c.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  company === c.id
                    ? "border-violet-500 shadow-lg shadow-violet-500/10"
                    : ""
                }`}
                onClick={() => setCompany(c.id)}
              >
                <CardContent className="p-5 flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{c.name}</span>
                  {company === c.id && (
                    <Badge className="ml-auto">Selected</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Step 2: Difficulty */}
        {step === 2 && (
          <motion.div
            key="difficulty"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            {difficulties.map((d) => (
              <Card
                key={d.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  difficulty === d.id
                    ? "border-violet-500 shadow-lg shadow-violet-500/10"
                    : ""
                }`}
                onClick={() => setDifficulty(d.id)}
              >
                <CardContent className="p-5 text-center">
                  <div className="text-3xl mb-2">{d.emoji}</div>
                  <h3 className="font-semibold">{d.name}</h3>
                  <p className="text-sm text-muted-foreground">{d.desc}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Step 3: Summary & Start */}
        {step === 3 && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-lg mx-auto"
          >
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">Ready to Start!</h2>
                </div>

                <div className="space-y-3 bg-muted/50 rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">
                      {type.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium capitalize">{company}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className="font-medium capitalize">{difficulty}</span>
                  </div>
                </div>

                {/* Voice mode toggle */}
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    voiceMode
                      ? "border-violet-500 bg-violet-500/5"
                      : "border-border"
                  }`}
                  onClick={() => setVoiceMode(!voiceMode)}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      voiceMode
                        ? "bg-violet-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Voice Mode</div>
                    <div className="text-xs text-muted-foreground">
                      Speak your answers naturally
                    </div>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      voiceMode ? "bg-violet-600" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${
                        voiceMode ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>

                <Button
                  onClick={startInterview}
                  variant="glow"
                  className="w-full gap-2"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  Start Interview
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        {step < 3 && (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && !type}
            className="gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
