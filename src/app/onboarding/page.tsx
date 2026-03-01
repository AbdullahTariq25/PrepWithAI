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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  { title: "Experience Level", subtitle: "Where are you in your career?" },
  { title: "Interview Types", subtitle: "What do you want to practice?" },
  { title: "Target Company", subtitle: "Where do you want to work?" },
];

const levels = [
  { id: "junior", title: "Junior", desc: "0-2 years", icon: "🌱" },
  { id: "mid", title: "Mid-Level", desc: "2-5 years", icon: "🚀" },
  { id: "senior", title: "Senior", desc: "5-10 years", icon: "⭐" },
  { id: "staff", title: "Staff+", desc: "10+ years", icon: "👑" },
];

const interviewTypes = [
  { id: "dsa", name: "DSA", icon: Code2, color: "bg-blue-500" },
  {
    id: "system-design",
    name: "System Design",
    icon: Network,
    color: "bg-purple-500",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    icon: MessageSquare,
    color: "bg-green-500",
  },
  { id: "frontend", name: "Frontend", icon: Layout, color: "bg-orange-500" },
  { id: "backend", name: "Backend", icon: Server, color: "bg-red-500" },
  { id: "full-loop", name: "Full Loop", icon: Trophy, color: "bg-indigo-500" },
];

const companies = [
  { id: "google", name: "Google", style: "Structured, algo-heavy" },
  { id: "meta", name: "Meta", style: "Move fast, system design" },
  { id: "amazon", name: "Amazon", style: "Leadership principles" },
  { id: "apple", name: "Apple", style: "Deep technical + creativity" },
  { id: "microsoft", name: "Microsoft", style: "Practical problem-solving" },
  { id: "stripe", name: "Stripe", style: "Backend + API design" },
  { id: "general", name: "No preference", style: "General interview prep" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [targetCompany, setTargetCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const canProceed = () => {
    if (step === 0) return !!experienceLevel;
    if (step === 1) return selectedTypes.length > 0;
    if (step === 2) return !!targetCompany;
    return false;
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceLevel,
          interviewTypes: selectedTypes,
          targetCompany,
        }),
      });
      await update();
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-4 py-12">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />

      <motion.div
        className="w-full max-w-2xl relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">{steps[step].title}</h1>
          <p className="text-[#888] mt-1">{steps[step].subtitle}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= step ? "w-12 bg-indigo-600" : "w-8 bg-[#1A1A1A]"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {levels.map((level) => (
                <Card
                  key={level.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    experienceLevel === level.id
                      ? "border-violet-500 shadow-lg shadow-violet-500/10"
                      : ""
                  }`}
                  onClick={() => setExperienceLevel(level.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{level.icon}</div>
                    <h3 className="font-semibold">{level.title}</h3>
                    <p className="text-sm text-[#888]">{level.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {interviewTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedTypes.includes(type.id)
                      ? "border-violet-500 shadow-lg shadow-violet-500/10"
                      : ""
                  }`}
                  onClick={() => toggleType(type.id)}
                >
                  <CardContent className="p-6 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center`}
                    >
                      <type.icon className="w-5 h-5 text-white" />
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
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {companies.map((company) => (
                <Card
                  key={company.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    targetCompany === company.id
                      ? "border-violet-500 shadow-lg shadow-violet-500/10"
                      : ""
                  }`}
                  onClick={() => setTargetCompany(company.id)}
                >
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-sm text-[#888]">{company.style}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          {step < 2 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!canProceed() || loading}
              variant="glow"
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Start Practicing
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
