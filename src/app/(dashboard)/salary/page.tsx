"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Calculator, MessageSquare, Briefcase, TrendingUp, HelpCircle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function SalaryPage() {
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculated(true);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-white page-enter font-sans">
      <div className="px-4 md:px-8 py-8 md:py-12 max-w-6xl mx-auto">
        <div className="flex items-center text-sm text-[#60607A] font-mono mb-8">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[#A0A0B0]">Salary Coach</span>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
          {/* SECTION 1: HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.div variants={itemVariants} className="inline-flex items-center px-2.5 py-1 rounded-md border border-emerald-400/20 bg-emerald-400/10 text-[10px] font-mono font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                  AI-Powered
                </motion.div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Salary Negotiation Coach</h1>
              <p className="text-[#A0A0B0] text-lg">Know your worth. Negotiate confidently.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SECTION 2: CALCULATOR */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-[#111116] border border-white/5 rounded-3xl p-8 relative shadow-lg">
                <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                  <Calculator className="w-5 h-5 text-emerald-500" /> What should you be earning?
                </h2>

                <form onSubmit={handleCalculate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Role Title</label>
                    <input type="text" defaultValue="Full Stack Developer" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50" />
                  </div>

                  <div>
                    <label className="flex justify-between text-sm font-medium text-[#A0A0B0] mb-2">
                      <span>Years of experience</span>
                      <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded text-xs">3 years</span>
                    </label>
                    <input type="range" min="0" max="15" defaultValue="3" className="w-full accent-emerald-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Location</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 appearance-none">
                      <option>Lahore</option>
                      <option>Karachi</option>
                      <option>Islamabad</option>
                      <option>Remote - International</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Tech Stack (Select multiple)</label>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Node.js", "Python", "AWS", "Go", "Docker", "TypeScript"].map((tech, idx) => (
                        <button key={tech} type="button" className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${idx < 2 || idx === 6 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-black/40 border-white/10 text-[#A0A0B0] hover:border-white/20'}`}>
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Company Size</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 appearance-none">
                      <option>Startup (1-50)</option>
                      <option>Medium (51-200)</option>
                      <option>Large (201-1000)</option>
                      <option>Enterprise (1000+)</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
                    Calculate Estimate
                  </button>
                </form>
              </div>

              <AnimatePresence>
                {calculated && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    className="bg-gradient-to-br from-[#1A1A24] to-[#111116] border border-emerald-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 p-8 text-emerald-500/10 pointer-events-none">
                      <TrendingUp className="w-32 h-32" />
                    </div>
                    <h3 className="text-[#A0A0B0] uppercase tracking-widest text-xs font-bold mb-4">Estimated Target</h3>
                    <div className="space-y-6 relative z-10">
                      <div>
                        <p className="text-3xl md:text-4xl font-bold font-mono text-white mb-2">PKR 150K - 250K <span className="text-lg text-[#60607A]">/mo</span></p>
                        <p className="text-sm text-emerald-400 font-medium bg-emerald-400/10 px-3 py-1 rounded-full inline-block">For international remote: $2,000 - $4,500/month</p>
                      </div>

                      <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <p className="font-mono text-[#A0A0B0] mb-1">Low</p>
                          <p className="font-bold">120K</p>
                        </div>
                        <div className="bg-white/5 rounded-lg py-1 border border-white/5">
                          <p className="font-mono text-emerald-500 mb-1">Median</p>
                          <p className="font-bold text-white">200K</p>
                        </div>
                        <div>
                          <p className="font-mono text-[#A0A0B0] mb-1">High</p>
                          <p className="font-bold">300K+</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* SECTION 3: NEGOTIATION SCRIPTS & SIMULATOR */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-indigo-400" /> What to say when they make an offer
              </h2>

              <div className="space-y-4">
                {/* Scenario 1 */}
                <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-colors">
                  <h4 className="font-bold text-sm mb-3 text-white flex items-center justify-between">
                    Scenario 1: They offer below your target
                    <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Common</span>
                  </h4>
                  <div className="font-mono text-sm bg-black/50 border border-white/5 rounded-xl p-4 text-[#A0A0B0] leading-relaxed relative">
                    "Thank you for the offer. Based on my research and the value I bring, I was expecting something closer to [X]. Is there flexibility there?"
                    <button className="absolute top-2 right-2 text-xs text-[#60607A] hover:text-white transition-colors bg-white/5 p-1.5 rounded opacity-0 group-hover:opacity-100">Copy</button>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-colors">
                  <h4 className="font-bold text-sm mb-3 text-white flex items-center justify-between">
                    Scenario 2: They ask your expected salary first
                  </h4>
                  <div className="font-mono text-sm bg-black/50 border border-white/5 rounded-xl p-4 text-[#A0A0B0] leading-relaxed relative">
                    "I am looking at the market range for this role which is [X to Y]. Within that range, I am flexible depending on the full package."
                    <button className="absolute top-2 right-2 text-xs text-[#60607A] hover:text-white transition-colors bg-white/5 p-1.5 rounded opacity-0 group-hover:opacity-100">Copy</button>
                  </div>
                </div>

                {/* Scenario 3 */}
                <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-colors">
                  <h4 className="font-bold text-sm mb-3 text-white flex items-center justify-between">
                    Scenario 3: Counter-offer response
                  </h4>
                  <div className="font-mono text-sm bg-black/50 border border-white/5 rounded-xl p-4 text-[#A0A0B0] leading-relaxed relative">
                    "I appreciate you coming back. Could we meet in the middle at [X]? I am very excited about this role and want to make this work."
                    <button className="absolute top-2 right-2 text-xs text-[#60607A] hover:text-white transition-colors bg-white/5 p-1.5 rounded opacity-0 group-hover:opacity-100">Copy</button>
                  </div>
                </div>
              </div>

              {/* SECTION 4: SIMULATOR CTA */}
              <div className="mt-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                <h3 className="text-xl font-bold mb-3 relative z-10">AI Negotiation Simulator</h3>
                <p className="text-sm text-[#A0A0B0] mb-6 relative z-10 mx-auto max-w-[300px]">
                  Practice your response live against a strict AI hiring manager.
                </p>
                <button className="relative z-10 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-lg shadow-indigo-500/20 text-sm">
                  Start Simulation Session
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
