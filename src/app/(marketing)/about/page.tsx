"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Instagram, Globe, Code2 } from "lucide-react";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function AboutPage() {
    return (
        <>
            <MarketingNav />
            <main className="min-h-screen bg-[#08080C] text-white pt-24 pb-16 font-sans">
                {/* Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-mono font-medium text-purple-400 mb-6 uppercase tracking-widest"
                    >
                        About
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                    >
                        Built by a developer, for developers
                    </motion.h1>
                </div>

                {/* The Story */}
                <section className="py-16 md:py-24 border-t border-white/5 bg-gradient-to-b from-[#111116]/30 to-transparent">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                        >
                            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-[#A0A0B0] leading-relaxed font-serif italic mb-8 relative">
                                <span className="text-5xl font-serif text-white/5 absolute -top-8 -left-8 md:-left-12">"</span>
                                In 2025, I failed a technical interview. Not because I did not know the material. I failed because I had never practiced answering out loud. I had never experienced real interviewer pressure. I had never gotten honest feedback on my communication. LeetCode had the problems. YouTube had the explanations. But nothing simulated the actual interview experience. So I built PrepWithAI.
                                <span className="text-5xl font-serif text-white/5 absolute -bottom-8 md:-right-8">"</span>
                            </motion.p>
                            <motion.div variants={itemVariants} className="text-[#A0A0B0] font-medium tracking-widest uppercase text-sm flex items-center justify-center gap-4">
                                <div className="w-12 h-[1px] bg-[#6366F1]/50" />
                                Abdullah Tariq
                                <div className="w-12 h-[1px] bg-[#6366F1]/50" />
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Founder Card & Bio */}
                <section className="py-16 md:py-24 relative overflow-hidden">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-[#111116] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group hover:border-[#6366F1]/30 transition-colors"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-500" />

                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10 text-center md:text-left">
                                {/* Avatar */}
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-[#1A1A24] shadow-xl flex-shrink-0">
                                    <span className="text-white text-3xl font-bold tracking-tight">AT</span>
                                </div>

                                {/* Details */}
                                <div className="space-y-4 pt-2">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-1">Abdullah Tariq</h2>
                                        <p className="text-[#6366F1] font-medium tracking-wide">Founder & Full Stack Developer</p>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-2 pb-4">
                                        <p className="text-sm font-mono text-[#A0A0B0] bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                            📍 Lahore, Pakistan <span className="text-[#60607A]">|</span> Previously: Shenzhen, China 🇨🇳
                                        </p>
                                        <p className="text-[#D1D1DF] leading-relaxed mt-2 text-[15px]">
                                            Full stack developer building tools that solve real problems for developers. PrepWithAI is my first commercial product — built solo, shipped publicly, and improved every week based on real user feedback. I also built DevReviewer, an AI code review tool at aicode-reviewer-seven.vercel.app
                                        </p>
                                    </div>

                                    {/* Social Links */}
                                    <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                                        <a href="https://github.com/AbdullahTariq25" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shadow-inner tooltip-wrap">
                                            <Github className="w-5 h-5 text-gray-300" />
                                        </a>
                                        <a href="https://www.linkedin.com/in/abdullah-bin-tariq-25at" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0a66c2]/20 hover:border-[#0a66c2]/50 transition-colors shadow-inner">
                                            <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                                        </a>
                                        <a href="https://twitter.com/2Abdullah_tariq" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1DA1F2]/20 hover:border-[#1DA1F2]/50 transition-colors shadow-inner">
                                            <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                                        </a>
                                        <a href="https://www.instagram.com/abdullah_tariq25/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E1306C]/20 hover:border-[#E1306C]/50 transition-colors shadow-inner">
                                            <Instagram className="w-5 h-5 text-[#E1306C]" />
                                        </a>
                                        <a href="https://abdullah25.fly.dev/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-colors shadow-inner">
                                            <Globe className="w-5 h-5 text-emerald-400" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Contact info & Mission */}
                <section className="py-16 md:py-24 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="flex flex-col justify-center space-y-6 bg-gradient-to-r from-indigo-500/10 to-transparent p-8 md:p-12 rounded-3xl border border-indigo-500/20"
                            >
                                <h2 className="text-sm font-mono tracking-widest text-[#A0A0B0] uppercase">The Mission</h2>
                                <p className="text-2xl md:text-3xl font-bold leading-tight">
                                    Making world-class interview prep accessible to every developer in Pakistan and beyond — regardless of budget, connections, or university.
                                </p>
                            </motion.div>

                            <div className="space-y-8 flex flex-col justify-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <h3 className="text-xl font-bold mb-4">Let's connect</h3>
                                    <div className="bg-[#111116] border border-white/10 rounded-2xl p-6">
                                        <div className="flex flex-col gap-4 font-mono text-sm">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                                <span className="text-[#A0A0B0]">Phone:</span>
                                                <span className="text-white">+92 311 4836720</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#A0A0B0]">WeChat:</span>
                                                <span className="text-white">Abdullah_Tariq25</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <h3 className="text-xl font-bold mb-4">Also by Abdullah</h3>
                                    <a href="https://aicode-reviewer-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="block bg-[#111116] border border-white/10 hover:border-emerald-500/30 rounded-2xl p-6 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                                <Code2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">DevReviewer — AI Code Review Tool</h4>
                                                <p className="text-sm text-[#A0A0B0]">Paste your code, get instant AI review with suggestions.</p>
                                            </div>
                                        </div>
                                    </a>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <MarketingFooter />
        </>
    );
}
