"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Brain,
  Mic,
  Video,
  Building2,
  BookOpen,
  BarChart3,
  Layers,
  Zap,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const allFeatures = [
  { icon: Brain, label: "All 12 Interview Types", desc: "DSA, System Design, Behavioral, Frontend, Backend, API Design, Cloud & more" },
  { icon: Mic, label: "Voice Mode", desc: "Practice speaking your answers naturally with real-time AI voice" },
  { icon: Video, label: "Video Interviews", desc: "Webcam + AI avatar with real-time visual feedback" },
  { icon: Building2, label: "20+ Company Packs", desc: "Google, Meta, Amazon, Apple, Microsoft, Netflix & more" },
  { icon: BookOpen, label: "500+ Question Bank", desc: "Curated questions across all categories and difficulty levels" },
  { icon: Layers, label: "Flashcards & Daily Challenges", desc: "Spaced repetition and daily practice to build consistency" },
  { icon: BarChart3, label: "Full Analytics & Progress", desc: "Detailed performance metrics, skill radar charts & streak tracking" },
  { icon: Zap, label: "ELO Rating System", desc: "Competitive rating that adapts to your skill level over time" },
  { icon: Trophy, label: "Leaderboard & Study Groups", desc: "Compete with others and study collaboratively" },
  { icon: Sparkles, label: "AI-Powered Feedback", desc: "Detailed feedback with scores, grades, and actionable improvement tips" },
];

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 page-enter bg-[#080808]">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Badge className="mb-4 gap-1.5 bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
          <Sparkles className="w-3 h-3" /> Beta
        </Badge>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          Everything is{" "}
          <span className="bg-linear-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            completely free
          </span>
        </h1>
        <p className="text-lg text-[#888] max-w-2xl mx-auto">
          During the beta period, all features are unlocked for everyone.
          No credit card needed. No trial period. No limits.
        </p>
      </motion.div>

      {/* Big Free Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative bg-[var(--bg-surface)] border border-emerald-500/30 rounded-2xl p-8 premium-card"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-emerald-600 text-white px-4 py-1 gap-1.5 text-sm">
            <Sparkles className="w-3.5 h-3.5" /> Beta  All Features Free
          </Badge>
        </div>

        <div className="text-center mb-8 mt-4">
          <div className="text-6xl font-bold tabular-nums mb-1">$0</div>
          <div className="text-[#888]">Forever during beta</div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {allFeatures.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <f.icon className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-medium flex items-center gap-2">
                  {f.label}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-xs text-[#666] mt-0.5">{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h2 className="text-2xl font-bold text-center mb-6 tracking-tight">
          Frequently Asked Questions
        </h2>
        {[
          {
            q: "Why is everything free?",
            a: "We are in beta and want as many people as possible to use the platform so we can improve it. All features are completely free during this period.",
          },
          {
            q: "Will it always be free?",
            a: "We plan to keep a generous free tier forever. When we introduce paid plans, existing beta users will be grandfathered in with special pricing.",
          },
          {
            q: "What AI model powers the interviews?",
            a: "We use Groq LLama 3.3 70B for fast, high-quality interview simulations with sub-second response times.",
          },
          {
            q: "Do I need to enter a credit card?",
            a: "No. Never. Just sign up with your email and start practicing immediately.",
          },
        ].map((faq) => (
          <div
            key={faq.q}
            className="bg-[var(--bg-surface)] border border-white/8 rounded-xl p-5 hover:border-white/12 transition-colors"
          >
            <h3 className="font-medium text-sm mb-1">{faq.q}</h3>
            <p className="text-sm text-[#888]">{faq.a}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
