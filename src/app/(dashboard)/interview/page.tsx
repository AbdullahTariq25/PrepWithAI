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
  Monitor,
  Layers,
  Cloud,
  Smartphone,
  Target,
  Crown,
  Users,
  Lock,
  Video,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INTERVIEW_TYPES, COMPANY_PACKS } from "@/lib/constants";
import { useSession } from "next-auth/react";

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
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
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
  const { data: session } = useSession();
  const userPlan =
    ((session?.user as Record<string, unknown>)?.plan as string) || "free";
  const preselectedType = searchParams?.get("type") ?? null;
  const preselectedCompany = searchParams?.get("company") ?? null;
  const preselectedMode = searchParams?.get("mode") ?? null;

  const [step, setStep] = useState(preselectedType ? 1 : 0);
  const [type, setType] = useState(preselectedType ?? "");
  const [company, setCompany] = useState(preselectedCompany ?? "general");
  const [difficulty, setDifficulty] = useState("mid");
  const [interviewMode, setInterviewMode] = useState<
    "text" | "voice" | "video"
  >((preselectedMode as "text" | "voice" | "video") ?? "text");
  const [loading, setLoading] = useState(false);

  const steps = ["Type", "Company", "Difficulty", "Start"];

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          company,
          difficulty,
          voiceMode: interviewMode !== "text",
        }),
      });
      const data = await res.json();
      if (data.sessionId) {
        if (interviewMode === "video") {
          router.push(`/interview/${data.sessionId}/video`);
        } else {
          router.push(`/interview/${data.sessionId}`);
        }
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setLoading(false);
    }
  };

  const modeCards = [
    {
      id: "text" as const,
      name: "Text Chat",
      desc: "Type your answers in a chat interface",
      icon: Keyboard,
      gradient: "from-gray-500 to-zinc-600",
      border: "border-white/[0.08]",
      activeBorder: "border-indigo-500",
    },
    {
      id: "voice" as const,
      name: "Voice Mode",
      desc: "Speak your answers naturally with AI voice",
      icon: Mic,
      gradient: "from-violet-500 to-purple-600",
      border: "border-white/[0.08]",
      activeBorder: "border-violet-500",
    },
    {
      id: "video" as const,
      name: "Video Interview",
      desc: "Webcam + AI avatar with real-time feedback",
      icon: Video,
      gradient: "from-indigo-500 to-cyan-500",
      border: "border-white/[0.08]",
      activeBorder: "border-indigo-500",
      isNew: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto page-enter bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Start New Interview
        </h1>
        <p className="text-[#888]">
          Choose your interview type, target company, and difficulty
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                i <= step
                  ? "bg-indigo-600 text-white"
                  : "bg-[#1A1A1A] text-[#555]"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm hidden sm:block ${i <= step ? "text-white" : "text-[#555]"}`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 ${i < step ? "bg-indigo-600" : "bg-[#1A1A1A]"}`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Interview Type */}
        {step === 0 && (
          <motion.div
            key="type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger"
          >
            {INTERVIEW_TYPES.map((t) => {
              const Icon = iconMap[t.icon] || Code2;
              const isLocked = !t.free && userPlan === "free";
              return (
                <div
                  key={t.id}
                  className={`card-3d bg-[#111] border rounded-2xl p-5 cursor-pointer transition-all ${
                    type === t.id
                      ? "border-indigo-500 shadow-lg shadow-indigo-500/10"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                  } ${isLocked ? "opacity-60" : ""}`}
                  onClick={() => {
                    if (!isLocked) setType(t.id);
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center mb-3`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{t.name}</h3>
                    {isLocked && <Lock className="w-3 h-3 text-[#555]" />}
                    {t.free && (
                      <Badge className="text-[10px] bg-white/[0.06] text-[#888] border-white/[0.08]">
                        Free
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#666]">{t.description}</p>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Step 1: Company */}
        {step === 1 && (
          <motion.div
            key="company"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 stagger">
              <div
                className={`card-3d bg-[#111] border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                  company === "general"
                    ? "border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : "border-white/[0.08] hover:border-white/[0.15]"
                }`}
                onClick={() => setCompany("general")}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-zinc-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-medium text-sm">General</span>
                  <p className="text-[10px] text-[#666]">No specific company</p>
                </div>
                {company === "general" && (
                  <Badge className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                    Selected
                  </Badge>
                )}
              </div>

              {COMPANY_PACKS.map((c) => (
                <div
                  key={c.id}
                  className={`card-3d bg-[#111] border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                    company === c.id
                      ? "border-indigo-500 shadow-lg shadow-indigo-500/10"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                  onClick={() => setCompany(c.id)}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm truncate block">
                      {c.name}
                    </span>
                    <p className="text-[10px] text-[#666] capitalize">
                      {c.region.replace("_", " ")}
                    </p>
                  </div>
                  {company === c.id && (
                    <Badge className="ml-auto text-[10px] shrink-0 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Difficulty */}
        {step === 2 && (
          <motion.div
            key="difficulty"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto stagger"
          >
            {difficulties.map((d) => (
              <div
                key={d.id}
                className={`card-3d bg-[#111] border rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  difficulty === d.id
                    ? "border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : "border-white/[0.08] hover:border-white/[0.15]"
                }`}
                onClick={() => setDifficulty(d.id)}
              >
                <div className="text-3xl mb-2">{d.emoji}</div>
                <h3 className="font-semibold">{d.name}</h3>
                <p className="text-sm text-[#666]">{d.desc}</p>
              </div>
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
            <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-8 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold">Ready to Start!</h2>
              </div>

              <div className="space-y-3 bg-[#0A0A0A] rounded-xl p-4 border border-white/[0.06]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Type</span>
                  <span className="font-medium capitalize">
                    {type.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Company</span>
                  <span className="font-medium capitalize">{company}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Difficulty</span>
                  <span className="font-medium capitalize">{difficulty}</span>
                </div>
              </div>

              {/* Interview mode selection */}
              <div>
                <p className="text-xs text-[#666] uppercase tracking-wider mb-3 font-medium">
                  Interview Mode
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {modeCards.map((m) => (
                    <div
                      key={m.id}
                      className={`relative p-3 rounded-xl border cursor-pointer transition-all text-center ${
                        interviewMode === m.id
                          ? `${m.activeBorder} bg-white/[0.03]`
                          : `${m.border} hover:border-white/[0.15]`
                      }`}
                      onClick={() => setInterviewMode(m.id)}
                    >
                      {m.isNew && (
                        <Badge className="absolute -top-2 -right-2 bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[9px] px-1.5">
                          NEW
                        </Badge>
                      )}
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.gradient} flex items-center justify-center mx-auto mb-2`}
                      >
                        <m.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-xs font-medium">{m.name}</div>
                    </div>
                  ))}
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
                {interviewMode === "video"
                  ? "Start Video Interview"
                  : interviewMode === "voice"
                    ? "Start Voice Interview"
                    : "Start Interview"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="gap-2 text-[#888]"
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
