"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Mic,
  BarChart3,
  Building2,
  FileText,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Code2,
  Network,
  MessageSquare,
  Trophy,
  Sparkles,
  Play,
  ChevronRight,
  Menu,
  X,
  Server,
  Layout,
  Globe,
  Shield,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/constants";

/* ---- animation presets ---- */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
};

const childFade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ---- data ---- */
const features = [
  {
    icon: Brain,
    title: "AI Interviewer",
    description:
      "A professional interviewer that asks follow-ups, pushes back on weak answers, and gives hints — just like a real senior engineer.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Mic,
    title: "Voice Mode",
    description:
      "Speak your answers naturally. Real-time transcription and waveform so you practice actual interview speaking skills.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Skill radar charts, streak tracking, score trends, and weak area identification to focus your prep where it matters.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Building2,
    title: "Company Prep Packs",
    description:
      "Curated preparation paths for Google, Meta, Amazon, Stripe and more — with company-specific interview styles.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: FileText,
    title: "Resume Personalization",
    description:
      "Upload your resume and get questions tailored to YOUR experience, projects, and tech stack.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description:
      "Scored feedback after every answer — strengths, weaknesses, senior tips, and sample strong answers.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const interviewTypes = [
  {
    icon: Code2,
    name: "DSA",
    desc: "Arrays, Trees, Graphs, DP, Sorting",
    color: "bg-blue-500",
    tag: "Free",
  },
  {
    icon: Network,
    name: "System Design",
    desc: "Design Twitter, Uber, Rate Limiter",
    color: "bg-purple-500",
    tag: "Pro",
  },
  {
    icon: MessageSquare,
    name: "Behavioral",
    desc: "STAR method, leadership, conflicts",
    color: "bg-green-500",
    tag: "Pro",
  },
  {
    icon: Layout,
    name: "Frontend",
    desc: "React, CSS, JS, performance",
    color: "bg-orange-500",
    tag: "Pro",
  },
  {
    icon: Server,
    name: "Backend",
    desc: "APIs, databases, architecture",
    color: "bg-red-500",
    tag: "Pro",
  },
  {
    icon: Trophy,
    name: "Full Loop",
    desc: "Complete on-site simulation",
    color: "bg-indigo-500",
    tag: "Pro",
  },
];

const companyLogos = [
  { name: "Google", color: "#4285F4" },
  { name: "Meta", color: "#0668E1" },
  { name: "Amazon", color: "#FF9900" },
  { name: "Apple", color: "#A2AAAD" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Stripe", color: "#635BFF" },
];

const platformStats = [
  { label: "Questions", value: "500+", icon: Target },
  { label: "Interview Types", value: "6", icon: Code2 },
  { label: "Companies", value: "10+", icon: Building2 },
  { label: "Response Time", value: "<1s", icon: Clock },
];

const comparisons = [
  {
    name: "LeetCode",
    what: "Only problems, no interview sim",
    price: "Free / $35/mo",
    highlight: false,
  },
  {
    name: "Pramp",
    what: "Peer-based, needs scheduling",
    price: "Free",
    highlight: false,
  },
  {
    name: "interviewing.io",
    what: "Human interviewers, expensive",
    price: "$200+/session",
    highlight: false,
  },
  {
    name: "ChatGPT",
    what: "No structure, no tracking",
    price: "$20/mo",
    highlight: false,
  },
  {
    name: "PrepWithAI ✨",
    what: "AI interviewer + voice + analytics",
    price: "Free / $9/mo",
    highlight: true,
  },
];

export default function LandingPage() {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-background noise-bg overflow-x-hidden">
      {/* ======== NAVBAR ======== */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Prep<span className="gradient-text">WithAI</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Features", href: "#features" },
                { label: "How it Works", href: "#how-it-works" },
                { label: "Pricing", href: "#pricing" },
                { label: "Questions", href: "/questions" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" variant="glow" className="gap-1.5">
                  Start Free <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileNav(!mobileNav)}
            >
              {mobileNav ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {mobileNav && (
            <motion.div
              className="md:hidden pb-4 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              {["Features", "How it Works", "Pricing"].map((l) => (
                <Link
                  key={l}
                  href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                  className="block py-2 text-sm text-muted-foreground"
                  onClick={() => setMobileNav(false)}
                >
                  {l}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button size="sm" className="w-full">
                    Start Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* ======== HERO ======== */}
      <section className="relative pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 hero-grid">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-8 px-4 py-1.5 text-sm bg-violet-500/10 border border-violet-500/20 text-violet-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI-Powered Mock Interviews — Free to Start
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ace Your Next
            <br />
            <span className="gradient-text">Tech Interview</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Practice with an AI interviewer that simulates real technical
            interviews from{" "}
            <span className="text-foreground font-medium">
              Google, Meta, Amazon
            </span>{" "}
            and more. Get instant scored feedback. Land your dream job.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/signup">
              <Button
                size="xl"
                variant="glow"
                className="gap-2 text-base px-8 py-4"
              >
                <Play className="w-5 h-5" />
                Start Free Interview
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button
                size="xl"
                variant="outline"
                className="gap-2 text-base px-8 py-4"
              >
                <Globe className="w-4 h-4" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Set up in 30 seconds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Powered by Groq AI (sub-second)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======== DEMO PREVIEW ======== */}
      <section id="demo" className="py-4 px-4 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl border border-border/50 overflow-hidden shadow-2xl shadow-violet-500/5"
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-zinc-900/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="ml-4 text-xs text-zinc-500 font-mono">
                PrepWithAI — Google Senior Interview
              </span>
            </div>

            <div className="bg-zinc-950 p-6 sm:p-8 space-y-5">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-zinc-800/80 border border-white/5 rounded-2xl rounded-tl-md p-4 max-w-lg">
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    Hi! I&apos;m your interviewer today. Given an array of
                    integers and a target sum, find two numbers that add up to
                    the target. Walk me through your approach.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-violet-600/90 border border-violet-500/30 rounded-2xl rounded-tr-md p-4 max-w-lg">
                  <p className="text-sm text-white leading-relaxed">
                    I&apos;d use a HashMap. For each element, check if
                    complement exists. Time: O(n), Space: O(n). Edge cases:
                    empty array, no solution, duplicates.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                  AT
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-zinc-800/80 border border-white/5 rounded-2xl rounded-tl-md p-4 max-w-lg">
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    Solid! Great that you mentioned edge cases proactively. What
                    about the two-pointer approach if the array is sorted? What
                    are the trade-offs?
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Score: 85/100 — Strong approach with good edge case handling
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======== STATS BAR ======== */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 mb-3">
                  <stat.icon className="w-6 h-6 text-violet-500" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== FEATURES ======== */}
      <section id="features" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-violet-500/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <Badge className="mb-4 bg-violet-500/10 text-violet-400 border-violet-500/20">
              Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything You Need to Prepare
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI-powered interview simulation to detailed analytics —
              everything built to help you land your dream job.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            {...stagger}
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={childFade}>
                <Card className="h-full group hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-violet-500/20">
                  <CardContent className="p-7">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <f.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======== INTERVIEW TYPES ======== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Practice Every Interview Format
            </h2>
            <p className="text-muted-foreground text-lg">
              6 different interview types covering every aspect of the technical
              hiring process.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewTypes.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={`/signup?type=${t.name.toLowerCase().replace(/ /g, "-")}`}
                >
                  <div className="flex items-center gap-4 p-5 rounded-xl border border-border/50 hover:border-violet-500/20 hover:bg-violet-500/[0.02] transition-all cursor-pointer group">
                    <div
                      className={`w-11 h-11 rounded-lg ${t.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <t.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{t.name}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.tag === "Free" ? "bg-green-500/10 text-green-500" : "bg-violet-500/10 text-violet-400"}`}
                        >
                          {t.tag}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {t.desc}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== HOW IT WORKS ======== */}
      <section id="how-it-works" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-violet-500/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <Badge className="mb-4 bg-violet-500/10 text-violet-400 border-violet-500/20">
              How It Works
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              3 Steps to Interview Confidence
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Format",
                desc: "Pick interview type, target company, and difficulty level. From DSA to full on-site loops.",
                icon: Target,
              },
              {
                step: "02",
                title: "Practice with AI",
                desc: "The AI interviewer asks questions, follows up, gives hints — just like a real senior engineer.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Get Scored Feedback",
                desc: "Detailed report with score, strengths, weaknesses, senior tips, and what to practice next.",
                icon: BarChart3,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/20">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-violet-500 flex items-center justify-center text-xs font-bold text-violet-500">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== COMPANIES ======== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p className="text-sm text-muted-foreground mb-8" {...fadeUp}>
            Practice for top tech companies
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {companyLogos.map((c, i) => (
              <motion.div
                key={c.name}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-lg font-semibold">{c.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== COMPARISON TABLE ======== */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-4xl font-bold mb-4">How PrepWithAI Compares</h2>
            <p className="text-muted-foreground">
              Every alternative, side by side. See why developers choose us.
            </p>
          </motion.div>

          <motion.div className="space-y-3" {...stagger}>
            {comparisons.map((c) => (
              <motion.div
                key={c.name}
                variants={childFade}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${c.highlight ? "border-violet-500/30 bg-violet-500/5" : "border-border/50 hover:border-border"}`}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold ${c.highlight ? "gradient-text" : ""}`}
                  >
                    {c.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{c.what}</div>
                </div>
                <div className="text-sm font-medium text-right ml-4">
                  {c.price}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======== PRICING ======== */}
      <section id="pricing" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-violet-500/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <Badge className="mb-4 bg-violet-500/10 text-violet-400 border-violet-500/20">
              Pricing
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`h-full relative ${plan.popular ? "border-violet-500/40 shadow-xl shadow-violet-500/10 scale-[1.03]" : "border-border/50"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-violet-600 text-white px-4 py-1 shadow-lg shadow-violet-500/30">
                        <Star className="w-3 h-3 mr-1.5" /> Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-1">
                        {plan.period}
                      </span>
                    </div>
                    <Link href="/signup">
                      <Button
                        className="w-full mb-6"
                        variant={plan.popular ? "glow" : "outline"}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                    <ul className="space-y-3">
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== FINAL CTA ======== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp}>
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-500/25 animate-float-slow">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join developers using AI to prepare smarter, practice harder, and
              land offers at top tech companies.
            </p>
            <Link href="/signup">
              <Button
                size="xl"
                variant="glow"
                className="gap-2 text-base px-10 py-5"
              >
                Start Free — No Credit Card
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              3 free interviews per day · No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">PrepWithAI</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link
                href="/pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/questions"
                className="hover:text-foreground transition-colors"
              >
                Questions
              </Link>
              <Link
                href="/companies"
                className="hover:text-foreground transition-colors"
              >
                Companies
              </Link>
              <Link
                href="/login"
                className="hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Built by{" "}
              <span className="font-medium text-foreground">
                Abdullah Tariq
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
