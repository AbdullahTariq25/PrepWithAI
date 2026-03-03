"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mic, Video, BrainCircuit, BarChart3, Building2, ClipboardCheck, ArrowRight } from "lucide-react";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function FeaturesPage() {
    return (
        <>
            <MarketingNav />
            <main className="min-h-screen bg-[#08080C] text-white pt-24 pb-16 font-sans">
                {/* Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-medium text-indigo-400 mb-6 uppercase tracking-widest"
                    >
                        Features
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                    >
                        Everything PrepWithAI can do
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-[#A0A0B0] max-w-2xl mx-auto"
                    >
                        The most complete technical interview simulator designed to give you unfair advantages.
                    </motion.p>
                </div>

                {/* Feature 1 — AI Interview Engine */}
                <section className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={containerVariants}
                                className="order-2 lg:order-1"
                            >
                                <div className="grid grid-cols-3 gap-3">
                                    {["DSA", "System Design", "Behavioral", "Frontend", "Backend", "API Design", "Database", "DevOps", "Mobile", "Full Loop", "Culture Fit", "Salary Negotiation"].map((type, idx) => (
                                        <motion.div key={type} variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-500/50 transition-colors shadow-lg shadow-black/50">
                                            <BrainCircuit className="w-6 h-6 text-indigo-400 mb-1" />
                                            <span className="text-xs font-medium text-[#A0A0B0] leading-tight">{type}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                            <div className="order-1 lg:order-2 space-y-6">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">12 Interview Types Powered by AI</h2>
                                <p className="text-lg text-[#A0A0B0] leading-relaxed">
                                    DSA, System Design, Behavioral, Frontend, Backend, API Design, Database, DevOps, Mobile, Full Loop, Culture Fit, and Salary Negotiation. Every type has company-specific question banks and AI interviewer personalities.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 2 — Voice Mode */}
                <section className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-[#111116]/50 to-transparent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                                    <Mic className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">Speak Your Answers Naturally</h2>
                                <p className="text-lg text-[#A0A0B0] leading-relaxed">
                                    Enable voice mode and answer questions out loud. Real-time speech recognition, filler word detection (um, uh, like, basically), speaking pace analysis, and AI responds with voice too. Feels like a real phone interview.
                                </p>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="bg-[#111116] border border-white/10 rounded-3xl p-8 shadow-2xl relative h-[300px] flex items-center justify-center overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50 pointer-events-none" />
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                                        <motion.div
                                            key={bar}
                                            animate={{ height: ["20%", "80%", "40%", "100%", "30%"] }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: bar * 0.1 }}
                                            className="w-3 bg-emerald-500 rounded-full"
                                        />
                                    ))}
                                </div>
                                <div className="absolute bottom-6 left-0 right-0 text-center">
                                    <p className="font-mono text-sm text-emerald-400">Listening to your answer...</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Feature 3 — Video Interview Mode */}
                <section className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="order-2 lg:order-1 bg-[#111116] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                            >
                                <div className="aspect-video bg-black relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center border-4 border-[#111116] shadow-xl">
                                            <span className="text-3xl font-bold">AI</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-32 h-20 bg-gray-800 border border-white/20 rounded-xl overflow-hidden">
                                        <div className="w-full h-full flex items-center justify-center opacity-50">
                                            <Video className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2">
                                        <p className="text-sm font-mono text-white">Live Captions: <span className="text-gray-400">Can you explain Big-O?</span></p>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="order-1 lg:order-2 space-y-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-center text-purple-400">
                                        <Video className="w-6 h-6" />
                                    </div>
                                    <span className="px-2.5 py-1 rounded bg-purple-500/20 text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest border border-purple-500/30 text-nowrap">NEW</span>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">Full Video Call Experience</h2>
                                <p className="text-lg text-[#A0A0B0] leading-relaxed">
                                    Practice with your webcam on. AI avatar interviewer on screen, live captions appearing in real time, eye contact score, and a full post-call communication analysis report.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 4 — Company Prep Packs */}
                <section className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-[#111116]/50 to-transparent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">20+ Company-Specific Packs</h2>
                                <p className="text-lg text-[#A0A0B0] leading-relaxed">
                                    Google, Meta, Amazon, Apple, Microsoft, Netflix, Stripe, Airbnb, Uber, LinkedIn, Systems Limited, Techlogix, 10Pearls, Arbisoft, Netsol, Creative Chaos, and more. Each pack matches the exact interview style.
                                </p>
                                <Link href="/companies" className="inline-flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors group">
                                    View all companies <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={containerVariants}
                                className="grid grid-cols-4 md:grid-cols-5 gap-4"
                            >
                                {["G", "M", "a", "A", "M", "N", "S", "A", "U", "in", "SL", "T", "10", "A", "N"].map((letter, idx) => (
                                    <motion.div key={idx} variants={itemVariants} className="aspect-square bg-[#111116] border border-white/10 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg hover:bg-white/5 transition-colors group">
                                        <span className="opacity-70 group-hover:opacity-100 transition-opacity">{letter}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Feature 5 — Detailed AI Feedback */}
                <section className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="order-2 lg:order-1 bg-[#111116] border border-white/10 rounded-3xl p-8 shadow-2xl"
                            >
                                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-[#A0A0B0] mb-1">Overall Score</h3>
                                        <div className="text-5xl font-mono font-bold text-emerald-400">92<span className="text-2xl text-[#60607A]">/100</span></div>
                                    </div>
                                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold bg-emerald-500/10">A</div>
                                </div>
                                <div className="space-y-4">
                                    {["Technical Accuracy", "Communication clarity", "Problem Solving"].map((item, i) => (
                                        <div key={item}>
                                            <div className="flex justify-between text-sm mb-2 font-medium">
                                                <span className="text-white">{item}</span>
                                                <span className="text-[#A0A0B0 font-mono]">4.{(5 - i)}/5.0</span>
                                            </div>
                                            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${80 + (10 - i * 5)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                            <div className="order-1 lg:order-2 space-y-6">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                                    <ClipboardCheck className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">Feedback That Actually Helps</h2>
                                <p className="text-lg text-[#A0A0B0] leading-relaxed">
                                    After every session: overall score 0-100, grades across 5 dimensions, specific strengths with examples, specific weaknesses with fixes, a sample ideal answer, and 3 recommended topics to practice next.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 6 — Progress Analytics */}
                <section className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-[#111116]/50 to-transparent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">Track 90 Days of Progress</h2>
                                <p className="text-lg text-[#A0A0B0] leading-relaxed">
                                    Score trend chart, skill radar chart, company readiness bars, category performance breakdown, weekly heatmap, current streak, ELO rating, and weak topic detection with practice recommendations.
                                </p>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="bg-[#111116] border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[300px] flex items-end gap-2"
                            >
                                <div className="absolute top-6 left-6">
                                    <p className="text-sm font-medium text-[#A0A0B0] mb-1">ELO Rating Trend</p>
                                    <p className="text-2xl font-bold font-mono text-white">1450 <span className="text-rose-400 text-sm">↑ +42</span></p>
                                </div>
                                {[40, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-rose-500/20 to-rose-500 border border-rose-500/30 rounded-t-sm"
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 border-t border-white/5 text-center">
                    <div className="max-w-2xl mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Ready to ace your next interview?</h2>
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/40 hover:-translate-y-1"
                        >
                            Start practicing all features for free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>
            <MarketingFooter />
        </>
    );
}
