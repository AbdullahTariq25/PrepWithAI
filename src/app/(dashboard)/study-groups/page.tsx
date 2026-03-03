"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Users, Bell } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function StudyGroupsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = async () => {
    if (!email) return;
    // In the future, save to a waitlist collection
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-white page-enter">
      <div className="px-4 md:px-8 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="flex items-center text-sm text-[#60607A] font-mono mb-8">
          <Link
            href="/dashboard"
            className="hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[#A0A0B0]">Study Groups</span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Coming Soon State */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-6 border border-[#6366F1]/20">
              <Users className="w-10 h-10 text-[#6366F1]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Study Groups — Coming Soon
            </h1>
            <p className="text-[#A0A0B0] text-lg max-w-md mb-8">
              Study group features are being built. Join the waitlist to be
              notified when they launch.
            </p>

            {submitted ? (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-6 py-4">
                <Bell className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">
                  You&apos;ll be notified when study groups launch!
                </span>
              </div>
            ) : (
              <div className="flex gap-3 w-full max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#6366F1]/50"
                />
                <button
                  onClick={handleNotify}
                  className="px-6 py-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-colors shadow-lg shadow-[#6366F1]/20 font-medium whitespace-nowrap"
                >
                  Notify Me
                </button>
              </div>
            )}

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
              {[
                {
                  title: "Group Practice",
                  desc: "Practice with developers targeting the same company",
                },
                {
                  title: "Weekly Goals",
                  desc: "Set shared goals and hold each other accountable",
                },
                {
                  title: "Peer Feedback",
                  desc: "Get feedback from other developers in your group",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-[#111116] border border-white/5 rounded-2xl p-6 text-center"
                >
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#A0A0B0]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
