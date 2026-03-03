"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
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

const posts = [
    { title: "Complete Guide to Google Interviews 2026", category: "DSA", time: "8 min", type: "blue", date: "Feb 28, 2026" },
    { title: "Amazon Leadership Principles — How to Answer Every Question", category: "Behavioral", time: "6 min", type: "amber", date: "Feb 25, 2026" },
    { title: "System Design in 45 Minutes: A Framework That Works", category: "System Design", time: "10 min", type: "purple", date: "Feb 20, 2026" },
    { title: "Why LeetCode Alone Is Not Enough", category: "Strategy", time: "5 min", type: "indigo", date: "Feb 18, 2026" },
    { title: "How to Stop Saying Um and Uh in Interviews", category: "Communication", time: "4 min", type: "emerald", date: "Feb 14, 2026" },
    { title: "Pakistani Developer's Guide to International Tech Jobs", category: "Career", time: "7 min", type: "rose", date: "Feb 10, 2026" },
    { title: "Preparing for Systems Limited: What to Expect", category: "Career", time: "5 min", type: "rose", date: "Feb 5, 2026" },
    { title: "React Interview Questions Senior Engineers Actually Ask", category: "Frontend", time: "6 min", type: "cyan", date: "Jan 28, 2026" },
    { title: "From 45 to 89 Score: One Developer's 30-Day Journey", category: "Story", time: "5 min", type: "yellow", date: "Jan 20, 2026" },
];

export default function BlogPage() {
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
                        className="inline-flex items-center px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-xs font-mono font-medium text-fuchsia-400 mb-6 uppercase tracking-widest"
                    >
                        Blog
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                    >
                        Interview Prep Insights
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-[#A0A0B0] max-w-2xl mx-auto"
                    >
                        Tips, guides, and stories from PrepWithAI
                    </motion.p>
                </div>

                {/* Featured Post */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="group block relative rounded-3xl overflow-hidden cursor-pointer bg-[#111116] border border-white/10 hover:border-indigo-500/50 transition-colors"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-indigo-900/50 to-purple-900/50 relative overflow-hidden flex items-center justify-center p-12">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                <div className="w-full max-w-xs aspect-video bg-[#08080C] rounded-2xl border border-white/10 shadow-2xl relative flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
                                    <div className="flex bg-white/5 w-full h-8 absolute top-0 border-b border-white/10 items-center px-3 gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500/80" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                                        <div className="w-2 h-2 rounded-full bg-green-500/80" />
                                    </div>
                                    <span className="text-4xl">📉 ➔ 📈</span>
                                </div>
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <span className="text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest mb-4">Strategy</span>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-indigo-400 transition-colors">
                                    Why 90% of developers fail technical interviews
                                </h2>
                                <p className="text-[#A0A0B0] text-lg mb-8 leading-relaxed">
                                    The problem is almost never knowledge. It is communication and thinking out loud under pressure. Here is what the data shows.
                                </p>
                                <div className="mt-auto flex items-center justify-between text-sm text-[#60607A]">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-[#D1D1DF]">Abdullah Tariq</span>
                                        <span className="w-1 h-1 rounded-full bg-[#60607A]" />
                                        <span>Feb 15, 2026</span>
                                    </div>
                                    <span>8 min read</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Post Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 cursor-pointer">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {posts.map((post, i) => (
                            <motion.article
                                variants={itemVariants}
                                key={i}
                                className="group bg-[#111116] border border-white/5 hover:border-white/20 rounded-2xl flex flex-col transition-all hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="aspect-[2/1] bg-black/50 relative overflow-hidden border-b border-white/5 flex items-center justify-center p-6 bg-gradient-to-br from-[#111116] to-[#1A1A24]">
                                    <span className="text-white/20 font-bold text-xl font-mono tracking-tighter opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">{post.category}</span>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest border border-${post.type}-500/30 text-${post.type}-400 bg-${post.type}-500/10`}>
                                            {post.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                                        {post.title}
                                    </h3>

                                    <div className="mt-auto pt-6 flex items-center justify-between text-xs text-[#60607A] font-mono">
                                        <span className="text-[#A0A0B0] font-sans">Abdullah Tariq</span>
                                        <div className="flex items-center gap-3">
                                            <span>{post.date}</span>
                                            <span>{post.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                </section>

                {/* Newsletter Signup */}
                <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Get weekly tips</h3>
                                <p className="text-[#A0A0B0] max-w-md mx-auto">
                                    Join developers learning how to master technical interviews. No spam, just high signal content.
                                </p>
                            </div>

                            <form className="max-w-md mx-auto flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    required
                                />
                                <button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-[#6366F1]/25 border border-transparent">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </section>
            </main>
            <MarketingFooter />
        </>
    );
}
