"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, FileText, Wand2, Copy, Download, RefreshCw, PenLine, Check } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function CoverLetterPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium (350 words)");

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setResult(`Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Engineer position at Arbisoft. With over 3 years of experience building scalable web applications using React and Next.js, and a proven track record of delivering high-impact features, I am confident in my ability to contribute effectively to your engineering team.

In my recent role, I spearheaded the development of a core merchant dashboard that reduced loading times by 40% and successfully scaled to support over 10,000 daily active users. This involved deep optimization strategies, a complete rewrite of the state management architecture using modern React patterns, and establishing rigorous CI/CD pipelines.

I have long admired Arbisoft's commitment to technical excellence and open-source contributions. The opportunity to bring my expertise in performance optimization and component-driven architecture to your upcoming projects aligns perfectly with my professional goals. I am particularly excited about your recent initiatives in AI-driven interfaces, an area I have been actively exploring and building prototypes for over the past year.

I would welcome the opportunity to discuss how my technical skills and product-focused mindset can support Arbisoft's ongoing success. I have attached my resume for your review.

Thank you for your time and consideration.

Best regards,

Abdullah Tariq
Lahore, Pakistan
abdullahtariq@prepwithai.com
github.com/abdullahtariq`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-white page-enter">
      <div className="px-4 md:px-8 py-8 md:py-12 max-w-5xl mx-auto">
        <div className="flex items-center text-sm text-[#60607A] font-mono mb-8">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[#A0A0B0]">Cover Letter</span>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {/* HEADER */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-bold">Cover Letter Generator</h1>
            </div>
            <p className="text-[#A0A0B0]">AI writes a personalized cover letter in 30 seconds.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FORM */}
            <motion.div variants={itemVariants} className="lg:col-span-5 bg-[#111116] border border-white/5 rounded-3xl p-6 lg:p-8 relative overflow-hidden h-fit">
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Target Company</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6366F1] appearance-none cursor-pointer">
                    <option>Arbisoft</option>
                    <option>Systems Limited</option>
                    <option>Techlogix</option>
                    <option>10Pearls</option>
                    <option>Google (Remote)</option>
                    <option>Custom...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Target Role</label>
                  <input type="text" defaultValue="Senior Frontend Engineer" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6366F1]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Your Experience (Briefly)</label>
                  <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6366F1] resize-none text-sm leading-relaxed" defaultValue="I have 3 years of React experience, built an AI interview platform, and worked on optimizing Next.js dashboards scaling to 10k users."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A0A0B0] mb-3">Tone</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Professional", "Conversational", "Enthusiastic"].map(t => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`py-2 rounded-lg text-xs font-medium transition-colors border ${tone === t ? 'bg-white/10 text-white border-white/20' : 'bg-black/20 text-[#A0A0B0] border-transparent hover:bg-white/5 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A0A0B0] mb-3">Length</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Short (200 words)", "Medium (350 words)", "Long (500 words)"].map(l => (
                      <button
                        key={l}
                        onClick={() => setLength(l)}
                        className={`py-2 rounded-lg text-xs font-medium transition-colors border ${length === l ? 'bg-[#6366F1]/20 text-indigo-400 border-[#6366F1]/30' : 'bg-black/20 text-[#A0A0B0] border-transparent hover:bg-white/5 hover:text-white'}`}
                      >
                        {l.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white py-4 rounded-xl font-medium transition-colors shadow-lg shadow-[#6366F1]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Wand2 className="w-5 h-5" /> Generate Letter</>
                  )}
                </button>
              </div>
            </motion.div>

            {/* RESULT */}
            <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col h-full">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full bg-gradient-to-b from-[#111116] to-[#08080C] border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 text-center min-h-[400px]"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#60607A]">
                      <PenLine className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Ready to write</h3>
                    <p className="text-sm text-[#A0A0B0] max-w-[250px]">
                      Fill out the details on the left and hit generate to get your AI-crafted cover letter.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full bg-[#111116] border border-white/5 rounded-3xl p-8 flex flex-col shadow-2xl relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-transparent rounded-3xl pointer-events-none" />

                    <div className="flex justify-end gap-2 mb-6 relative z-10">
                      <button onClick={handleGenerate} className="p-2 hover:bg-white/10 rounded-lg text-[#A0A0B0] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium" title="Regenerate">
                        <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Regenerate</span>
                      </button>
                      <button disabled className="p-2 hover:bg-white/10 rounded-lg text-[#A0A0B0] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium opacity-50 cursor-not-allowed" title="Download as TXT">
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
                      </button>
                      <button onClick={handleCopy} className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border ${copied ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'hover:bg-white/10 text-[#A0A0B0] hover:text-white border-transparent'}`} title="Copy to Clipboard">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 text-[15px] leading-relaxed text-[#D1D1DF] font-serif pr-4 whitespace-pre-wrap outline-none" contentEditable suppressContentEditableWarning>
                      {result}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.2);
                }
            `}} />
    </div>
  );
}
