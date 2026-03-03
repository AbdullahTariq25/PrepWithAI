"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Briefcase, MapPin, DollarSign, ExternalLink, Filter } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

const jobs = [
  { id: 1, company: "Arbisoft", role: "Senior React Developer", location: "Lahore", salary: "PKR 300K-450K", tags: ["Remote OK", "Senior", "Full-time"], match: 87, date: "2d ago", letter: "A", color: "from-blue-500 to-indigo-600" },
  { id: 2, company: "Systems Limited", role: "Backend Engineer (Node.js)", location: "Karachi", salary: "PKR 200K-320K", tags: ["Onsite", "Mid", "Full-time"], match: 72, date: "1d ago", letter: "S", color: "from-red-500 to-rose-600" },
  { id: 3, company: "Techlogix", role: "Full Stack Developer", location: "Islamabad", salary: "PKR 250K-380K", tags: ["Hybrid", "Senior", "Full-time"], match: 92, date: "3h ago", letter: "T", color: "from-gray-600 to-gray-800" },
  { id: 4, company: "10Pearls", role: "Software Engineer II", location: "Lahore", salary: "PKR 180K-280K", tags: ["Onsite", "Mid", "Full-time"], match: 65, date: "5d ago", letter: "1", color: "from-teal-500 to-emerald-600" },
  { id: 5, company: "Netsol Technologies", role: "React Native Developer", location: "Lahore", salary: "PKR 150K-250K", tags: ["Onsite", "Junior/Mid", "Full-time"], match: 58, date: "1w ago", letter: "N", color: "from-blue-400 to-cyan-500" },
  { id: 6, company: "Remote (via Contra)", role: "Frontend Engineer", location: "Fully Remote", salary: "$2000-3500/mo", tags: ["Remote", "Mid/Senior", "Contract"], match: 89, date: "4d ago", letter: "C", color: "from-purple-500 to-fuchsia-600" },
  { id: 7, company: "Remote (via Toptal)", role: "React Developer", location: "Fully Remote", salary: "$3000-5000/mo", tags: ["Remote", "Senior", "Freelance"], match: 75, date: "2w ago", letter: "T", color: "from-blue-600 to-blue-800" },
  { id: 8, company: "Remote (via Andela)", role: "Node.js Engineer", location: "Fully Remote", salary: "$2500-4000/mo", tags: ["Remote", "Mid", "Full-time"], match: 60, date: "Just now", letter: "A", color: "from-emerald-400 to-green-600" },
];

export default function JobsPage() {
  const [remoteOnly, setRemoteOnly] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080C] text-white page-enter font-sans">
      <div className="px-4 md:px-8 py-8 md:py-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center text-sm text-[#60607A] font-mono">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#A0A0B0]">Job Board</span>
          </div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {/* SECTION 1: HEADER & FILTERS */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
              </div>
              <p className="text-[#A0A0B0]">Curated tech jobs — remote and Pakistan-based.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button className="flex items-center justify-center gap-2 bg-[#111116] border border-white/10 hover:border-white/20 hover:bg-white/5 px-4 py-2 rounded-lg text-sm transition-colors text-[#A0A0B0]">
                <Filter className="w-4 h-4" /> Filters
              </button>
              <label className="flex items-center justify-center gap-2 bg-[#111116] border border-white/10 px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  className="accent-[#6366F1] w-4 h-4"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                />
                <span className={remoteOnly ? "text-white" : "text-[#A0A0B0]"}>Remote Only</span>
              </label>
              <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Submit a Job
              </button>
            </div>
          </div>

          {/* SECTION 2: JOB LIST */}
          <div className="space-y-3">
            {jobs.filter(j => !remoteOnly || j.tags.includes("Remote") || j.tags.includes("Remote OK")).map((job) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                className="bg-[#111116] hover:bg-[#1A1A24] border border-white/5 hover:border-white/10 rounded-2xl p-5 md:p-6 transition-all duration-300 group flex flex-col md:flex-row gap-6 md:items-center justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366F1]/5 blur-3xl rounded-full pointer-events-none" />

                <div className="flex items-start gap-5 w-full md:w-auto">
                  {/* Company Logo */}
                  <div className={`w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center text-xl font-bold text-white shadow-inner`}>
                    {job.letter}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="font-bold text-lg leading-none group-hover:text-[#6366F1] transition-colors">{job.role}</h3>
                      <span className="hidden sm:inline text-[#60607A] text-sm">•</span>
                      <p className="text-[#A0A0B0] text-sm">{job.company}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#60607A]">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                      {job.salary && (
                        <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                          <DollarSign className="w-3 h-3" />{job.salary}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded bg-white/5 border border-white/5 text-[#A0A0B0]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-none border-white/5 pt-4 md:pt-0">
                  <div className="flex flex-col md:items-end w-full md:w-auto gap-4 md:gap-2">
                    <div className="flex items-center justify-between gap-4 w-full md:w-auto">
                      <span className="text-xs text-[#60607A] md:hidden">Posted {job.date}</span>
                      {/* Match Score */}
                      <div className="flex items-center gap-2 bg-[#6366F1]/10 px-3 py-1.5 rounded-lg border border-[#6366F1]/20">
                        <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
                        <span className="text-xs font-bold text-[#6366F1]">{job.match}% Match</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 hidden md:flex">
                      <span className="text-xs text-[#60607A]">{job.date}</span>
                    </div>
                  </div>

                  <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-[#6366F1] hover:text-white border border-white/10 hover:border-[#6366F1] px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex-shrink-0 group/btn">
                    Apply <ExternalLink className="w-4 h-4 text-[#A0A0B0] group-hover/btn:text-white transition-colors" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
