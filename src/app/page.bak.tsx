"use client";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/constants";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

const features = [
  {
    icon: "Brain",
    title: "AI Interviewer",
    description:
      "A professional interviewer that asks follow-ups, pushes back on weak answers, and gives hints.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: "Mic",
    title: "Voice Mode",
    description:
      "Speak your answers naturally with real-time transcription and waveform visualization.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "BarChart3",
    title: "Progress Analytics",
    description:
      "Skill radar charts, streak tracking, score trends, and weak area heat maps.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: "Building2",
    title: "Company Prep Packs",
    description:
      "Curated prep paths for Google, Meta, Amazon, Stripe and more.",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    icon: "FileText",
    title: "Resume Personalization",
    description:
      "Upload your resume and get questions tailored to YOUR experience.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: "Zap",
    title: "Instant Feedback",
    description:
      "Scored feedback after every answer with strengths, weaknesses, and tips.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Mic,
  BarChart3,
  Building2,
  FileText,
  Zap,
};

const types = [
  {
    icon: Code2,
    name: "DSA",
    desc: "Arrays, Trees, Graphs, DP",
    color: "bg-blue-500",
  },
  {
    icon: Network,
    name: "System Design",
    desc: "Design Twitter, Uber, etc.",
    color: "bg-purple-500",
  },
  {
    icon: MessageSquare,
    name: "Behavioral",
    desc: "STAR method, leadership",
    color: "bg-green-500",
  },
  {
    icon: Code2,
    name: "Frontend",
    desc: "React, CSS, JavaScript",
    color: "bg-orange-500",
  },
  {
    icon: Code2,
    name: "Backend",
    desc: "APIs, Databases, Architecture",
    color: "bg-red-500",
  },
  {
    icon: Trophy,
    name: "Full Loop",
    desc: "Complete interview simulation",
    color: "bg-indigo-500",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Prep<span className="gradient-text">WithAI</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/questions"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Questions
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Start Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI-Powered Interview Practice
            </Badge>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ace Your Next
            <br />
            <span className="gradient-text">Tech Interview</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Practice with an AI interviewer that simulates real technical
            interviews from Google, Meta, Amazon and more. Get instant feedback
            and land your dream job.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/signup">
              <Button size="xl" variant="glow" className="gap-2">
                <Play className="w-5 h-5" />
                Start Free Interview
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="xl" variant="outline">
                Watch Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="rounded-2xl border border-border overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-zinc-900 text-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-sm text-zinc-400">
                  PrepWithAI - Google Senior Interview
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="bg-zinc-800 rounded-2xl rounded-tl-sm p-4 max-w-lg">
                    <p className="text-sm">
                      Hi! Given an array of integers and a target sum, find two
                      numbers that add up to the target. Walk me through your
                      approach.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-violet-600 rounded-2xl rounded-tr-sm p-4 max-w-lg">
                    <p className="text-sm">
                      HashMap approach. For each element, check if complement
                      exists. Time: O(n), Space: O(n).
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                    <span className="text-xs">AT</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="bg-zinc-800 rounded-2xl rounded-tl-sm p-4 max-w-lg">
                    <p className="text-sm">
                      Solid! What about edge cases? Alternative approach if
                      sorted?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Prepare
            </h2>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((f) => {
              const Icon = iconMap[f.icon];
              return (
                <motion.div key={f.title} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${f.gradient} flex items-center justify-center mb-4`}
                      >
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Types */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Practice Every Interview Format
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {types.map((t) => (
              <motion.div
                key={t.name}
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-all cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`w-10 h-10 rounded-lg ${t.color} flex items-center justify-center`}
                >
                  <t.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`h-full relative ${plan.popular ? "border-violet-500 shadow-lg shadow-violet-500/10" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" /> Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <Link href="/signup">
                    <Button
                      className="w-full mb-6"
                      variant={plan.popular ? "glow" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers using AI to prepare smarter.
          </p>
          <Link href="/signup">
            <Button size="xl" variant="glow" className="gap-2">
              Start Free - No Credit Card
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">PrepWithAI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/questions" className="hover:text-foreground">
              Questions
            </Link>
            <Link href="/companies" className="hover:text-foreground">
              Companies
            </Link>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Built by Abdullah Tariq
          </p>
        </div>
      </footer>
    </div>
  );
}
