"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  CalendarDays,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  { title: "Experience level", subtitle: "Calibrate the difficulty to your current level." },
  { title: "Practice focus", subtitle: "Choose the interview signals you need to improve." },
  { title: "Target company", subtitle: "Use a company context or stay general." },
  { title: "Your preparation goal", subtitle: "Turn practice into a concrete weekly plan." },
];

const levels = [
  { id: "junior", title: "Junior", desc: "0-2 years", icon: "🌱" },
  { id: "mid", title: "Mid-level", desc: "2-5 years", icon: "🚀" },
  { id: "senior", title: "Senior", desc: "5-10 years", icon: "⭐" },
  { id: "staff", title: "Staff+", desc: "10+ years", icon: "👑" },
];

const interviewTypes = [
  { id: "dsa", name: "DSA", icon: Code2, color: "bg-blue-500" },
  { id: "system_design", name: "System Design", icon: Network, color: "bg-purple-500" },
  { id: "behavioral", name: "Behavioral", icon: MessageSquare, color: "bg-green-500" },
  { id: "frontend", name: "Frontend", icon: Layout, color: "bg-orange-500" },
  { id: "backend", name: "Backend", icon: Server, color: "bg-red-500" },
  { id: "full_loop", name: "Full Loop", icon: Trophy, color: "bg-indigo-500" },
];

const companies = [
  { id: "google", name: "Google", style: "Algorithms, clarity, structured reasoning" },
  { id: "meta", name: "Meta", style: "Speed, product thinking, system depth" },
  { id: "amazon", name: "Amazon", style: "Ownership, leadership, measurable impact" },
  { id: "apple", name: "Apple", style: "Technical depth and product judgment" },
  { id: "microsoft", name: "Microsoft", style: "Practical problem solving and collaboration" },
  { id: "stripe", name: "Stripe", style: "APIs, reliability, engineering judgment" },
  { id: "general", name: "No preference", style: "General software interview preparation" },
];

const roleSuggestions = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Mobile Engineer",
  "DevOps / SRE",
  "Machine Learning Engineer",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleType = (id: string) => {
    setSelectedTypes((previous) =>
      previous.includes(id)
        ? previous.filter((type) => type !== id)
        : [...previous, id],
    );
  };

  const canProceed = () => {
    if (step === 0) return Boolean(experienceLevel);
    if (step === 1) return selectedTypes.length > 0;
    if (step === 2) return Boolean(targetCompany);
    if (step === 3) return targetRole.trim().length >= 2;
    return false;
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceLevel,
          interviewTypes: selectedTypes,
          targetCompany,
          targetRole: targetRole.trim(),
          targetDate: targetDate
            ? new Date(`${targetDate}T12:00:00`).toISOString()
            : "",
          weeklyGoal,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Could not save your preparation plan");
      }

      await update();
      router.push("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not save your preparation plan",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808] px-4 py-10 text-white sm:py-14">
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-violet-500/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/6 blur-3xl" />

      <motion.div
        className="relative mx-auto w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_35px_rgba(99,102,241,0.25)]">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Personalize your preparation
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {steps[step].title}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#8d8d9c] sm:text-base">
            {steps[step].subtitle}
          </p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((item, index) => (
            <div
              key={item.title}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= step ? "w-12 bg-indigo-500" : "w-8 bg-[#1A1A1A]"
              }`}
            />
          ))}
        </div>

        <div className="rounded-3xl border border-white/8 bg-[#101014]/90 p-4 shadow-2xl sm:p-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="level"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {levels.map((level) => (
                  <Card
                    key={level.id}
                    className={`cursor-pointer border-white/8 bg-white/[0.025] transition hover:border-white/15 ${
                      experienceLevel === level.id
                        ? "border-indigo-500/70 bg-indigo-500/8 shadow-lg shadow-indigo-500/10"
                        : ""
                    }`}
                    onClick={() => setExperienceLevel(level.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-3 text-3xl">{level.icon}</div>
                      <h3 className="font-semibold">{level.title}</h3>
                      <p className="mt-1 text-sm text-[#888]">{level.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="focus"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {interviewTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer border-white/8 bg-white/[0.025] transition hover:border-white/15 ${
                      selectedTypes.includes(type.id)
                        ? "border-indigo-500/70 bg-indigo-500/8"
                        : ""
                    }`}
                    onClick={() => toggleType(type.id)}
                  >
                    <CardContent className="flex items-center gap-3 p-5">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${type.color}`}>
                        <type.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium">{type.name}</span>
                      {selectedTypes.includes(type.id) && (
                        <Badge className="ml-auto">✓</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {companies.map((company) => (
                  <Card
                    key={company.id}
                    className={`cursor-pointer border-white/8 bg-white/[0.025] transition hover:border-white/15 ${
                      targetCompany === company.id
                        ? "border-indigo-500/70 bg-indigo-500/8"
                        : ""
                    }`}
                    onClick={() => setTargetCompany(company.id)}
                  >
                    <CardContent className="p-5">
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="mt-1 text-sm leading-5 text-[#888]">
                        {company.style}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                className="space-y-6"
              >
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#c8c8d2]">
                    <Target className="h-4 w-4 text-indigo-300" /> Target role
                  </label>
                  <input
                    value={targetRole}
                    onChange={(event) => setTargetRole(event.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    maxLength={100}
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#555566] focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/15"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roleSuggestions.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setTargetRole(role)}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-[#9b9baa] transition hover:border-indigo-400/30 hover:text-white"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#c8c8d2]">
                      <CalendarDays className="h-4 w-4 text-indigo-300" /> Interview date
                      <span className="text-xs font-normal text-[#666678]">optional</span>
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(event) => setTargetDate(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/15"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#c8c8d2]">
                      Weekly practice goal
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 5, 7, 10].map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => setWeeklyGoal(goal)}
                          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                            weeklyGoal === goal
                              ? "border-indigo-400/60 bg-indigo-500/12 text-indigo-200"
                              : "border-white/8 bg-black/20 text-[#8d8d9c] hover:border-white/15"
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4 text-sm leading-6 text-[#a8b8ae]">
                  Your plan starts with a baseline interview, then uses your report evidence and weak topics to focus the next session instead of repeating random questions.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-7 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((current) => current - 1)}
            disabled={step === 0 || loading}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep((current) => current + 1)}
              disabled={!canProceed()}
              className="gap-2"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!canProceed() || loading}
              variant="glow"
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Build my practice plan
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
