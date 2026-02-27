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
import { PRICING_PLANS } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
};

const features = [
  {
    icon: Brain,
    title: "AI Interviewer",
    desc: "Asks follow-ups, pushes back on weak answers, gives hints — just like a real senior engineer.",
    color: "#7c3aed",
  },
  {
    icon: Mic,
    title: "Voice Mode",
    desc: "Speak your answers naturally. Real-time transcription so you practice actual speaking skills.",
    color: "#3b82f6",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    desc: "Skill radar charts, streak tracking, score trends, and weak area identification.",
    color: "#10b981",
  },
  {
    icon: Building2,
    title: "Company Prep Packs",
    desc: "Curated paths for Google, Meta, Amazon, Stripe and more with company-specific styles.",
    color: "#f59e0b",
  },
  {
    icon: FileText,
    title: "Resume Personalization",
    desc: "Upload your resume and get questions tailored to YOUR experience and tech stack.",
    color: "#ec4899",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    desc: "Scored feedback after every answer — strengths, weaknesses, senior tips, sample answers.",
    color: "#6366f1",
  },
];

const interviewTypes = [
  {
    icon: Code2,
    name: "DSA",
    desc: "Arrays, Trees, Graphs, DP, Sorting",
    color: "#3b82f6",
    tag: "Free",
  },
  {
    icon: Network,
    name: "System Design",
    desc: "Design Twitter, Uber, Rate Limiter",
    color: "#8b5cf6",
    tag: "Pro",
  },
  {
    icon: MessageSquare,
    name: "Behavioral",
    desc: "STAR method, leadership, conflicts",
    color: "#10b981",
    tag: "Pro",
  },
  {
    icon: Layout,
    name: "Frontend",
    desc: "React, CSS, JS, performance",
    color: "#f59e0b",
    tag: "Pro",
  },
  {
    icon: Server,
    name: "Backend",
    desc: "APIs, databases, architecture",
    color: "#ef4444",
    tag: "Pro",
  },
  {
    icon: Trophy,
    name: "Full Loop",
    desc: "Complete on-site simulation",
    color: "#6366f1",
    tag: "Pro",
  },
];

const stats = [
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

const companies = ["Google", "Meta", "Amazon", "Apple", "Microsoft", "Stripe"];

const gradientBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "14px 32px",
  borderRadius: 14,
  fontSize: 16,
  fontWeight: 700,
  color: "white",
  textDecoration: "none",
  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
  boxShadow: "0 0 28px rgba(124,58,237,0.5)",
};

const outlineBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "14px 32px",
  borderRadius: 14,
  fontSize: 16,
  fontWeight: 600,
  color: "#e4e4e7",
  textDecoration: "none",
  border: "1px solid #3f3f46",
  background: "rgba(255,255,255,0.02)",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "5px 16px",
  borderRadius: 999,
  background: "rgba(124,58,237,0.12)",
  border: "1px solid rgba(124,58,237,0.25)",
  color: "#a78bfa",
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 18,
};

export default function LandingPage() {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fafafa",
        fontFamily: "system-ui,sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(5,5,5,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #1e1e24",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
            }}
          >
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Brain size={18} color="white" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#fafafa" }}>
                Prep
                <span
                  style={{
                    background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  WithAI
                </span>
              </span>
            </Link>

            <div className="nav-desktop">
              <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                {(
                  [
                    ["Features", "#features"],
                    ["How it Works", "#how-it-works"],
                    ["Pricing", "#pricing"],
                    ["Questions", "/questions"],
                  ] as [string, string][]
                ).map(([l, h]) => (
                  <Link
                    key={l}
                    href={h}
                    style={{
                      fontSize: 14,
                      color: "#a1a1aa",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#fafafa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#a1a1aa")
                    }
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>

            <div className="nav-desktop">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Link
                  href="/login"
                  style={{
                    fontSize: 14,
                    color: "#a1a1aa",
                    textDecoration: "none",
                    padding: "8px 16px",
                  }}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  style={{
                    ...gradientBtn,
                    padding: "9px 20px",
                    fontSize: 14,
                    borderRadius: 10,
                  }}
                >
                  Start Free <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <button
              className="nav-mobile"
              onClick={() => setMobileNav(!mobileNav)}
              style={{
                background: "none",
                border: "none",
                color: "#fafafa",
                cursor: "pointer",
                padding: 8,
              }}
            >
              {mobileNav ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {mobileNav && (
            <div
              style={{ borderTop: "1px solid #1e1e24", padding: "16px 0 20px" }}
            >
              {(
                [
                  ["Features", "#features"],
                  ["How it Works", "#how-it-works"],
                  ["Pricing", "#pricing"],
                  ["Questions", "/questions"],
                ] as [string, string][]
              ).map(([l, h]) => (
                <Link
                  key={l}
                  href={h}
                  onClick={() => setMobileNav(false)}
                  style={{
                    display: "block",
                    padding: "10px 0",
                    fontSize: 15,
                    color: "#a1a1aa",
                    textDecoration: "none",
                  }}
                >
                  {l}
                </Link>
              ))}
              <div style={{ display: "flex", gap: 12, paddingTop: 16 }}>
                <Link
                  href="/login"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "11px",
                    borderRadius: 10,
                    border: "1px solid #3f3f46",
                    color: "#fafafa",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "11px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    color: "white",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Start Free
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          paddingTop: 128,
          paddingBottom: 80,
          textAlign: "center",
          position: "relative",
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 80,
            left: "20%",
            width: 400,
            height: 400,
            background: "rgba(124,58,237,0.09)",
            borderRadius: "50%",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: "15%",
            width: 320,
            height: 320,
            background: "rgba(79,70,229,0.07)",
            borderRadius: "50%",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 18px",
                borderRadius: 999,
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.25)",
                color: "#a78bfa",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 32,
              }}
            >
              <Sparkles size={13} /> AI-Powered Mock Interviews — Free to Start
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(42px,9vw,88px)",
              fontWeight: 800,
              lineHeight: 1.08,
              marginBottom: 24,
              letterSpacing: "-2px",
            }}
          >
            Ace Your Next
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#7c3aed,#a78bfa,#6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Tech Interview
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: 18,
              color: "#a1a1aa",
              maxWidth: 580,
              margin: "0 auto 40px",
              lineHeight: 1.75,
            }}
          >
            Practice with an AI interviewer that simulates real technical
            interviews from{" "}
            <strong style={{ color: "#fafafa" }}>Google, Meta, Amazon</strong>{" "}
            and more. Get instant scored feedback. Land your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            <Link href="/signup" style={gradientBtn}>
              <Play size={18} /> Start Free Interview <ArrowRight size={16} />
            </Link>
            <Link href="#demo" style={outlineBtn}>
              <Globe size={16} /> Watch Demo
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 24,
              color: "#71717a",
              fontSize: 13,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={14} color="#22c55e" /> No credit card required
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={14} color="#3b82f6" /> Set up in 30 seconds
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Zap size={14} color="#eab308" /> Powered by Groq AI
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── DEMO PREVIEW ── */}
      <section id="demo" style={{ padding: "48px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid #1e1e24",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                background: "#111113",
                borderBottom: "1px solid #1e1e24",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#ef4444",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#eab308",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              <span
                style={{
                  marginLeft: 12,
                  fontSize: 12,
                  color: "#52525b",
                  fontFamily: "monospace",
                }}
              >
                PrepWithAI — Google Senior Interview
              </span>
            </div>
            <div
              style={{
                background: "#09090b",
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Brain size={15} color="white" />
                </div>
                <div
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "0 16px 16px 16px",
                    padding: "12px 16px",
                    maxWidth: 520,
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: "#e4e4e7",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    Hi! I&apos;m your interviewer today. Given an array of
                    integers and a target sum, find two numbers that add up to
                    the target. Walk me through your approach.
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    background: "rgba(124,58,237,0.85)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    borderRadius: "16px 0 16px 16px",
                    padding: "12px 16px",
                    maxWidth: 520,
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: "white",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    I&apos;d use a HashMap. For each element, check if
                    complement exists. Time: O(n), Space: O(n). Edge cases:
                    empty array, no solution, duplicates.
                  </p>
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#3f3f46",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  AT
                </div>
              </div>
              <div
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Brain size={15} color="white" />
                </div>
                <div
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "0 16px 16px 16px",
                    padding: "12px 16px",
                    maxWidth: 520,
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: "#e4e4e7",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    Solid approach! What about the two-pointer method if the
                    array is sorted? What are the trade-offs between the two
                    approaches?
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 20px",
                    borderRadius: 999,
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    color: "#4ade80",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <CheckCircle2 size={14} /> Score: 85/100 — Strong approach
                  with good edge case handling
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: 32,
            }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(124,58,237,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  <s.icon size={22} color="#8b5cf6" />
                </div>
                <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 4 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 14, color: "#71717a" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            style={{ textAlign: "center", marginBottom: 56 }}
            {...fadeUp}
          >
            <span style={badgeStyle}>Features</span>
            <h2
              style={{
                fontSize: "clamp(28px,5vw,44px)",
                fontWeight: 800,
                marginBottom: 14,
              }}
            >
              Everything You Need to Prepare
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "#71717a",
                maxWidth: 560,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              From AI-powered interview simulation to detailed analytics —
              everything built to help you land your dream job.
            </p>
          </motion.div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 20,
            }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{
                  background: "#0c0c0f",
                  border: "1px solid #1e1e24",
                  borderRadius: 18,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: f.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <f.icon size={22} color="white" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#71717a",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERVIEW TYPES ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            style={{ textAlign: "center", marginBottom: 48 }}
            {...fadeUp}
          >
            <h2
              style={{
                fontSize: "clamp(28px,5vw,44px)",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Practice Every Interview Format
            </h2>
            <p style={{ fontSize: 17, color: "#71717a" }}>
              6 different interview types covering every aspect of the technical
              hiring process.
            </p>
          </motion.div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 14,
            }}
          >
            {interviewTypes.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={`/signup?type=${t.name.toLowerCase()}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: 18,
                      borderRadius: 14,
                      border: "1px solid #1e1e24",
                      background: "#0c0c0f",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(124,58,237,0.35)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#1e1e24")
                    }
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: t.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <t.icon size={20} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#fafafa",
                          }}
                        >
                          {t.name}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 4,
                            background:
                              t.tag === "Free"
                                ? "rgba(34,197,94,0.12)"
                                : "rgba(124,58,237,0.12)",
                            color: t.tag === "Free" ? "#22c55e" : "#a78bfa",
                          }}
                        >
                          {t.tag}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#71717a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.desc}
                      </div>
                    </div>
                    <ChevronRight size={16} color="#52525b" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        style={{ padding: "80px 24px", background: "rgba(124,58,237,0.025)" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            style={{ textAlign: "center", marginBottom: 56 }}
            {...fadeUp}
          >
            <span style={badgeStyle}>How It Works</span>
            <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 800 }}>
              3 Steps to Interview Confidence
            </h2>
          </motion.div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 48,
            }}
          >
            {(
              [
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
              ] as {
                step: string;
                title: string;
                desc: string;
                icon: React.ElementType;
              }[]
            ).map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
                    }}
                  >
                    <item.icon size={28} color="white" />
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#050505",
                      border: "2px solid #7c3aed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#a78bfa",
                    }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#71717a",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANIES ── */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <p
          style={{
            fontSize: 12,
            color: "#52525b",
            marginBottom: 28,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Practice for top tech companies
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 36,
          }}
        >
          {companies.map((c) => (
            <span
              key={c}
              style={{ fontSize: 18, fontWeight: 700, color: "#3f3f46" }}
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <motion.div
            style={{ textAlign: "center", marginBottom: 48 }}
            {...fadeUp}
          >
            <h2
              style={{
                fontSize: "clamp(26px,5vw,40px)",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              How PrepWithAI Compares
            </h2>
            <p style={{ fontSize: 16, color: "#71717a" }}>
              Every alternative, side by side.
            </p>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr auto",
                gap: 16,
                padding: "6px 18px",
                fontSize: 11,
                fontWeight: 700,
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              <span>Platform</span>
              <span>What it does</span>
              <span>Price</span>
            </div>
            {comparisons.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr auto",
                  gap: 16,
                  padding: "16px 18px",
                  borderRadius: 12,
                  border: c.highlight
                    ? "1px solid rgba(124,58,237,0.4)"
                    : "1px solid #1e1e24",
                  background: c.highlight ? "rgba(124,58,237,0.06)" : "#0c0c0f",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: c.highlight ? "#a78bfa" : "#fafafa",
                  }}
                >
                  {c.name}
                </span>
                <span style={{ fontSize: 14, color: "#71717a" }}>{c.what}</span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fafafa",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.price}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        id="pricing"
        style={{ padding: "80px 24px", background: "rgba(124,58,237,0.025)" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <motion.div
            style={{ textAlign: "center", marginBottom: 56 }}
            {...fadeUp}
          >
            <span style={badgeStyle}>Pricing</span>
            <h2
              style={{
                fontSize: "clamp(28px,5vw,44px)",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Simple, Transparent Pricing
            </h2>
            <p style={{ fontSize: 17, color: "#71717a" }}>
              Start free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </motion.div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 24,
            }}
          >
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  position: "relative",
                  padding: 32,
                  borderRadius: 20,
                  border: plan.popular
                    ? "1px solid rgba(124,58,237,0.5)"
                    : "1px solid #1e1e24",
                  background: plan.popular
                    ? "rgba(124,58,237,0.06)"
                    : "#0c0c0f",
                  boxShadow: plan.popular
                    ? "0 0 40px rgba(124,58,237,0.12)"
                    : "none",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -15,
                      left: "50%",
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "5px 18px",
                        borderRadius: 999,
                        background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 700,
                        boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                      }}
                    >
                      <Star size={11} /> Most Popular
                    </span>
                  </div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 14, color: "#71717a", marginBottom: 24 }}>
                  {plan.description}
                </p>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 52, fontWeight: 800 }}>
                    ${plan.price}
                  </span>
                  <span
                    style={{ fontSize: 15, color: "#71717a", marginLeft: 5 }}
                  >
                    {plan.period}
                  </span>
                </div>
                <Link
                  href="/signup"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "14px",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: "none",
                    marginBottom: 28,
                    background: plan.popular
                      ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                      : "transparent",
                    color: "white",
                    border: plan.popular ? "none" : "1px solid #3f3f46",
                    boxShadow: plan.popular
                      ? "0 0 20px rgba(124,58,237,0.3)"
                      : "none",
                  }}
                >
                  {plan.cta}
                </Link>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {plan.features.map((feat: string) => (
                    <li
                      key={feat}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 14,
                        color: "#a1a1aa",
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        color="#22c55e"
                        style={{ flexShrink: 0, marginTop: 1 }}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <motion.div {...fadeUp}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 22,
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                boxShadow: "0 0 48px rgba(124,58,237,0.35)",
              }}
            >
              <Brain size={38} color="white" />
            </div>
            <h2
              style={{
                fontSize: "clamp(28px,5vw,48px)",
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              Ready to Ace Your Interview?
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "#71717a",
                lineHeight: 1.75,
                maxWidth: 500,
                margin: "0 auto 36px",
              }}
            >
              Join developers using AI to prepare smarter, practice harder, and
              land offers at top tech companies.
            </p>
            <Link
              href="/signup"
              style={{
                ...gradientBtn,
                padding: "16px 40px",
                fontSize: 17,
                borderRadius: 16,
              }}
            >
              Start Free — No Credit Card <ArrowRight size={18} />
            </Link>
            <p style={{ marginTop: 16, fontSize: 13, color: "#52525b" }}>
              3 free interviews per day · No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #1e1e24", padding: "40px 24px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Brain size={16} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 17 }}>PrepWithAI</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {(
              [
                ["Pricing", "/pricing"],
                ["Questions", "/questions"],
                ["Companies", "/companies"],
                ["Sign In", "/login"],
              ] as [string, string][]
            ).map(([l, h]) => (
              <Link
                key={l}
                href={h}
                style={{
                  fontSize: 14,
                  color: "#71717a",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#71717a")}
              >
                {l}
              </Link>
            ))}
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#52525b",
              display: "flex",
              alignItems: "center",
              gap: 6,
              margin: 0,
            }}
          >
            <Users size={14} /> Built by{" "}
            <strong style={{ color: "#a1a1aa" }}>Abdullah Tariq</strong>
          </p>
        </div>
      </footer>

      {/* ── RESPONSIVE ── */}
      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile  { display: none  !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none  !important; }
          .nav-mobile  { display: flex  !important; }
        }
      `}</style>
    </div>
  );
}
