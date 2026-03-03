"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, FileText, UploadCloud, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function ResumePage() {
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080C] text-white page-enter">
      <div className="px-4 md:px-8 py-8 md:py-12 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-[#60607A] font-mono mb-8">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[#A0A0B0]">Resume Review</span>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
          {/* SECTION 1: HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.div variants={itemVariants} className="inline-flex items-center px-2.5 py-1 rounded-md border border-indigo-400/20 bg-indigo-400/10 text-[10px] font-mono font-bold text-indigo-400 mb-2 uppercase tracking-wider">
                  ATS Score + Feedback
                </motion.div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Resume Review</h1>
              <p className="text-[#A0A0B0] text-lg">Get AI feedback on your resume before applying.</p>
            </div>
          </div>

          {!isUploaded ? (
            /* SECTION 2: UPLOAD AREA */
            <motion.div variants={itemVariants} className="bg-[#111116]/50 border-2 border-dashed border-white/10 rounded-3xl p-12 text-center hover:bg-[#111116] hover:border-[#6366F1]/50 transition-all duration-300 group cursor-pointer" onClick={() => setIsUploaded(true)}>
              <div className="w-20 h-20 mx-auto bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#6366F1]/20 transition-all duration-300">
                <UploadCloud className="w-10 h-10 text-[#6366F1]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Upload your resume</h3>
              <p className="text-[#A0A0B0] mb-8">PDF or DOCX — max 5MB</p>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-xl font-medium transition-colors">
                Browse Files
              </button>
            </motion.div>
          ) : (
            /* SECTION 3 & 4: RESULTS (Mocked) */
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <div className="flex items-center justify-between bg-[#111116] border border-white/5 rounded-2xl p-4 px-6">
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-[#A0A0B0]" />
                  <div>
                    <p className="font-medium text-white">abdullah_tariq_resume_v2.pdf</p>
                    <p className="text-xs text-[#60607A]">Analyzed just now</p>
                  </div>
                </div>
                <button onClick={() => setIsUploaded(false)} className="text-sm text-[#A0A0B0] hover:text-white transition-colors">Re-upload</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Overall Score Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-1 bg-[#111116] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
                  <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="8"
                        strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.72)}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 251.2 * (1 - 0.72) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-white mb-1">72</span>
                      <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">/ 100</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Needs Polish</h3>
                  <p className="text-sm text-[#A0A0B0] max-w-[200px]">Your resume passes basic ATS checks but lacks quantifiable impact in experience bullets.</p>
                </motion.div>

                {/* Dimensions */}
                <motion.div variants={itemVariants} className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#111116] border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" /> Keyword Match
                      </h4>
                      <span className="text-amber-500 font-mono font-bold">68%</span>
                    </div>
                    <p className="text-sm text-[#A0A0B0] mb-3">Missing some common core keywords for Full Stack roles.</p>
                    <p className="text-xs text-[#60607A]">Missing: CI/CD, Docker, Microservices</p>
                  </div>

                  <div className="bg-[#111116] border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Format & Structure
                      </h4>
                      <span className="text-green-500 font-mono font-bold">95%</span>
                    </div>
                    <p className="text-sm text-[#A0A0B0] mb-3">Excellent structure. Standard section headers detected perfectly.</p>
                    <p className="text-xs text-[#60607A]">Easily readable by ATS.</p>
                  </div>

                  <div className="bg-[#111116] border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" /> Quantified Impact
                      </h4>
                      <span className="text-red-500 font-mono font-bold">45%</span>
                    </div>
                    <p className="text-sm text-[#A0A0B0] mb-3">You describe responsibilities instead of achievements.</p>
                    <p className="text-xs text-[#60607A]">Only 2/8 bullets contain numbers.</p>
                  </div>

                  <div className="bg-[#111116] border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Clarity
                      </h4>
                      <span className="text-green-500 font-mono font-bold">85%</span>
                    </div>
                    <p className="text-sm text-[#A0A0B0] mb-3">Language is active and concise in most areas.</p>
                    <p className="text-xs text-[#60607A]">Good use of action verbs.</p>
                  </div>
                </motion.div>
              </div>

              {/* Section 4: Actionable Suggestions */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-bold mb-6">High Impact Suggestions</h3>
                <div className="space-y-4">
                  <div className="bg-[#111116] border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                    <span className="absolute top-4 right-6 text-[10px] font-mono uppercase text-red-400 font-bold bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">Critical</span>
                    <p className="text-sm text-white font-medium mb-1">Rewrite your most recent job's first bullet point.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <p className="text-xs text-[#60607A] uppercase font-mono mb-2">Your Current Text</p>
                        <p className="text-sm text-white/70 italic">"Responsible for building and maintaining the frontend using React and Next.js."</p>
                      </div>
                      <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                        <p className="text-xs text-green-500 uppercase font-mono mb-2">AI Suggestion</p>
                        <p className="text-sm text-white">"Spearheaded development of the core merchant dashboard using Next.js, reducing loading time by 40% and serving 10,000+ daily active users."</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#111116] border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                    <span className="absolute top-4 right-6 text-[10px] font-mono uppercase text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Medium</span>
                    <p className="text-sm text-white font-medium mb-1">Add missing technical skills directly demanded by the market.</p>
                    <div className="mt-4 p-4 bg-black/30 rounded-xl border border-white/5 text-sm text-[#A0A0B0]">
                      Your skill section lists "Java, Python, C++" but your application target is Full Stack. Consider explicitly adding <span className="text-white font-mono bg-white/10 px-1 py-0.5 rounded text-xs mx-1">Docker</span> and <span className="text-white font-mono bg-white/10 px-1 py-0.5 rounded text-xs mx-1">AWS/GCP</span> if you have arbitrary experience, as 85% of job descriptions require them.
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
