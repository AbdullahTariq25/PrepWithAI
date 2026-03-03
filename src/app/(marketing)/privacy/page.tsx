"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
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

export default function PrivacyPage() {
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
                        className="inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-xs font-mono font-medium text-teal-400 mb-6 uppercase tracking-widest"
                    >
                        <Shield className="w-3.5 h-3.5 mr-2" /> Legal
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                    >
                        Privacy Policy
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-[#A0A0B0] flex flex-col gap-2"
                    >
                        <p className="font-mono text-sm">Last updated: February 28, 2026</p>
                        <p className="italic bg-white/5 border border-white/10 px-4 py-2 rounded-lg mt-4 w-fit mx-auto text-sm shadow-inner">
                            Written in plain English — not lawyer speak.
                        </p>
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
                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-teal-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">What we collect</h2>
                            <p className="text-[#A0A0B0] leading-relaxed mb-4">We only collect the absolute minimum data required to run the service:</p>
                            <ul className="list-disc pl-5 space-y-2 text-[#D1D1DF]">
                                <li>Your name and email address (for authentication).</li>
                                <li>Session data (transcripts of your mock interviews).</li>
                            </ul>
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mt-6 font-mono text-sm shadow-inner">
                                <span className="font-bold">WE DO NOT</span> collect payment info on our servers. <br />
                                <span className="font-bold">WE DO NOT</span> sell your data to third parties.
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-teal-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">How we use data</h2>
                            <p className="text-[#A0A0B0] leading-relaxed mb-4">Your data is yours. We strictly use it to:</p>
                            <ul className="list-disc pl-5 space-y-2 text-[#D1D1DF]">
                                <li>Generate accurate AI feedback via Groq and OpenAI models.</li>
                                <li>Power your personal progress tracking dashboard.</li>
                                <li>Send optional product update emails (which you can turn off).</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-teal-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">Data storage</h2>
                            <p className="text-[#A0A0B0] leading-relaxed">
                                We use MongoDB Atlas for structured database storage. During Voice and Video modes, <span className="text-white font-medium">we do not store any audio or video files</span>. We process the streams in-memory for transcription and instantly discard the media. Only the final text transcript is saved to your account history.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-teal-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">Your rights</h2>
                            <p className="text-[#A0A0B0] leading-relaxed mb-4">You have complete control over your account:</p>
                            <ul className="list-disc pl-5 space-y-2 text-[#D1D1DF]">
                                <li>You can download all your data traces from the Settings dashboard.</li>
                                <li>You can permanently delete your account and all associated records instantly.</li>
                                <li>You can opt out of any marketing emails easily.</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-teal-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">Cookies</h2>
                            <p className="text-[#A0A0B0] leading-relaxed">
                                We use a single required authentication cookie powered by NextAuth to keep you logged in. We do not use third-party tracking cookies, pixel trackers, or cross-site fingerprinting.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-teal-500/30 transition-colors group">
                            <h2 className="text-xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">Contact us</h2>
                            <p className="text-[#A0A0B0] leading-relaxed">
                                If you have any questions about this policy, please email <a href="mailto:privacy@prepwithai.com" className="text-white hover:text-teal-400 underline decoration-white/20 underline-offset-4 transition-colors">privacy@prepwithai.com</a>. We respond within 48 hours.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
            <MarketingFooter />
        </>
    );
}
