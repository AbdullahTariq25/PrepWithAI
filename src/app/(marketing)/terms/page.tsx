"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function TermsPage() {
    return (
        <>
            <MarketingNav />
            <main className="min-h-screen bg-[#08080C] text-white pt-24 pb-16 font-sans">
                {/* Header */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs font-mono font-medium text-rose-400 mb-6 uppercase tracking-widest"
                    >
                        <Scale className="w-3.5 h-3.5 mr-2" /> Legal
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                    >
                        Terms of Service
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-[#A0A0B0] flex flex-col gap-2"
                    >
                        <p className="font-mono text-sm">Last updated: February 28, 2026</p>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/5">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-rose-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">1. Using PrepWithAI</h2>
                            <p className="text-[#A0A0B0] leading-relaxed mb-4">By accessing our service, you agree to these terms:</p>
                            <ul className="list-disc pl-5 space-y-2 text-[#D1D1DF]">
                                <li>You must be at least 13 years old.</li>
                                <li>You are responsible for maintaining the security of your account and API keys.</li>
                                <li>You must not use the service for any illegal or harmful purposes, including scraping data aggressively.</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-rose-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">2. Our Service</h2>
                            <p className="text-[#A0A0B0] leading-relaxed mb-4">PrepWithAI is a simulator designed to help you practice:</p>
                            <ul className="list-disc pl-5 space-y-2 text-[#D1D1DF]">
                                <li>We do <span className="text-white font-medium italic">not</span> guarantee you will get a job offer.</li>
                                <li>Because we rely on LLMs (OpenAI, Groq), the feedback generated may occasionally be inaccurate or biased. We are constantly improving our models, but cannot guarantee perfection.</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-rose-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">3. Your Content</h2>
                            <p className="text-[#A0A0B0] leading-relaxed">
                                The transcripts, resumes, and code you provide during sessions remain entirely yours. You grant us the limited right to process this data exclusively to provide our service to you. You can export or definitively delete this content at any time via your account settings.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-rose-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">4. Payments & Refunds</h2>
                            <p className="text-[#A0A0B0] leading-relaxed mb-4">We believe in transparent billing:</p>
                            <ul className="list-disc pl-5 space-y-2 text-[#D1D1DF]">
                                <li>Stripe securely handles all our payment processing. We do not store your credit card.</li>
                                <li>During our Beta period, the service is entirely free.</li>
                                <li>When paid plans launch, we will enforce a strict "no questions asked" 14-day refund policy for your first month.</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-rose-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">5. Termination</h2>
                            <p className="text-[#A0A0B0] leading-relaxed mb-4">
                                You may cancel your account at any time. We reserve the right to suspend or terminate accounts that abuse our systems (e.g., botting, DDoS). If we terminate your paid account without cause, we will issue a prorated refund.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-rose-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">6. Contact Information</h2>
                            <p className="text-[#A0A0B0] leading-relaxed">
                                For legal inquiries or notices, please contact us at <a href="mailto:legal@prepwithai.com" className="text-white hover:text-rose-400 underline decoration-white/20 underline-offset-4 transition-colors">legal@prepwithai.com</a>.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
            <MarketingFooter />
        </>
    );
}
