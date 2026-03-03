"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const changelog = [
  {
    version: "v2.1.0",
    date: "Feb 28, 2026",
    title: "Voice Mode 2.0",
    badge: "NEW",
    color: "green",
    changes: [
      "Real-time speech recognition integrated with Deepgram for ultra-low latency.",
      "Filler word detection (um, uh, like) added to communication analytics score.",
      "AI now responds with synthesized voice mimicking realistic interviewer cadences.",
      "Added Speaking Pace analysis highlighting when you speak too fast under pressure.",
    ],
  },
  {
    version: "v2.0.0",
    date: "Feb 14, 2026",
    title: "Video Interview Mode",
    badge: "MAJOR",
    color: "indigo",
    changes: [
      "Full webcam integration with real-time video processing.",
      "On-screen AI avatar interviewer dynamically reacting to your answers.",
      "Live closed-captions toggle added to the dashboard.",
      "Eye contact scoring algorithm implemented prioritizing looking at the camera.",
    ],
  },
  {
    version: "v1.9.0",
    date: "Feb 1, 2026",
    title: "8 New Company Packs",
    badge: "IMPROVEMENT",
    color: "blue",
    changes: [
      "Added local tech giants: Systems Limited, Techlogix, 10Pearls, Arbisoft, Netsol, Creative Chaos.",
      "Updated Google algorithmic complexity questions based on recent 2026 reports.",
      "Amazon Behavioral pack now strictly enforces the STAR method in initial prompts.",
    ],
  },
  {
    version: "v1.8.0",
    date: "Jan 20, 2026",
    title: "Dashboard Redesign",
    badge: "UPDATE",
    color: "fuchsia",
    changes: [
      "Moved entirely to the new 'Raycast' inspired dark theme aesthetic (#08080C backgrounds).",
      "Unified all component border radii to 16px for consistency.",
      "Replaced standard generic typography with DM Sans for UI and JetBrains Mono for code.",
      "Optimized load times by switching to Next.js Turbopack.",
    ],
  },
  {
    version: "v1.7.0",
    date: "Jan 8, 2026",
    title: "Leaderboard + Study Groups",
    badge: "SOCIAL",
    color: "cyan",
    changes: [
      "Introduced global ELO rating system mapped to simulated interview performance.",
      "Added top 3 podium visualization for the community leaderboard.",
      "Launched Study Groups feature to find and invite peers for joint code reviews.",
      "Added real-time chat feature (coming soon) within study group rooms.",
    ],
  },
  {
    version: "v1.6.0",
    date: "Dec 25, 2025",
    title: "Daily Challenge System",
    badge: "NEW",
    color: "purple",
    changes: [
      "A new randomized DSA question deployed globally at 12:00 AM PST.",
      "Global streaks introduced. Missing a day resets multiplier.",
      "Heatmap added to profile illustrating commit-like consistency for interview prep.",
    ],
  },
  {
    version: "v1.5.0",
    date: "Dec 10, 2025",
    title: "Progress Analytics Overhaul",
    badge: "UPDATE",
    color: "rose",
    changes: [
      "Complete rewrite of the charting library transitioning to Framer Motion driven SVG metrics.",
      "Added Skill Radar visualizing the balance between DSA, System Design, and Behavioral.",
      "Introduced 'Weak Topic Detection' scanning historical session transcripts.",
    ],
  },
  {
    version: "v1.0.0",
    date: "Nov 15, 2025",
    title: "Public Launch 🚀",
    badge: "LAUNCH",
    color: "amber",
    changes: [
      "PrepWithAI is live! The first MVP shipped focusing purely on algorithmic coding interviews.",
      "Integrated Groq LLaMA 3.3 70B for highly critical mock feedback generation.",
      "Deployed on Vercel utilizing Edge Functions for sub-second latency.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <MarketingNav />
      <main className="min-h-screen bg-[#08080C] text-white pt-24 pb-16 font-sans">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-mono font-medium text-sky-400 mb-6 uppercase tracking-widest"
          >
            Changelog
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            What is new
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[#A0A0B0]"
          >
            We ship every week. Track the development journey.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-[140px] top-12 bottom-0 w-px bg-gradient-to-b from-[#6366F1]/50 via-white/10 to-transparent" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-16"
          >
            {changelog.map((entry, idx) => (
              <motion.article
                variants={itemVariants}
                key={idx}
                className="relative pl-10 md:pl-[180px]"
              >
                {/* Timestamp for desktop */}
                <div className="hidden md:block absolute left-0 top-1.5 w-[120px] text-right text-sm font-mono text-[#60607A]">
                  {entry.date}
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-[11px] md:left-[135.5px] top-2.5 w-3 h-3 rounded-full bg-[#08080C] border-2 border-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />

                <div className="bg-[#111116] border border-white/5 hover:border-white/10 rounded-2xl p-6 md:p-8 transition-colors">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-mono tracking-widest bg-${entry.color}-500/10 border border-${entry.color}-500/20 text-${entry.color}-400 font-bold`}
                    >
                      {entry.badge}
                    </span>
                    <span className="font-mono text-sm text-[#A0A0B0] bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      {entry.version}
                    </span>
                    <span className="md:hidden text-xs font-mono text-[#60607A] ml-auto">
                      {entry.date}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-6 tracking-tight text-white">
                    {entry.title}
                  </h2>

                  <ul className="space-y-4">
                    {entry.changes.map((change, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 text-[#D1D1DF] leading-relaxed text-sm md:text-[15px]"
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#60607A] flex-shrink-0" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
