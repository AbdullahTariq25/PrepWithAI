"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Trophy, Loader2 } from "lucide-react";

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

interface LeaderboardUser {
  rank: number;
  name: string;
  eloRating: number;
  totalSessions: number;
  avgScore: number;
  streak: number;
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] =
    useState<LeaderboardUser | null>(null);
  const [, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const period =
          filter === "This Week"
            ? "weekly"
            : filter === "This Month"
              ? "monthly"
              : "all";
        const res = await fetch(`/api/leaderboard?period=${period}&limit=50`);
        const data = await res.json();
        if (data.data) {
          setLeaderboard(data.data.leaderboard || []);
          setCurrentUserRank(data.data.currentUserRank || null);
          setTotalUsers(data.data.totalUsers || 0);
        }
      } catch {
        console.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    load();
  }, [filter]);

  const topUsers = leaderboard.slice(0, 3);
  const allUsers = leaderboard.slice(3);

  // If current user is not in the list, add them at the end
  const displayUsers =
    currentUserRank && !leaderboard.find((u) => u.isCurrentUser)
      ? [...allUsers, currentUserRank]
      : allUsers;

  const myUser = leaderboard.find((u) => u.isCurrentUser) || currentUserRank;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080C] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080C] text-white page-enter">
      <div className="px-4 md:px-8 py-8 md:py-12 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-[#60607A] font-mono mb-8">
          <Link
            href="/dashboard"
            className="hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[#A0A0B0]">Leaderboard</span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* SECTION 1: HEADER & CURRENT USER CARD */}
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Global Leaderboard
                </h1>
              </div>
              <p className="text-[#A0A0B0] text-lg max-w-xl">
                Top developers ranked by ELO rating. Updated in real-time.
              </p>
            </div>

            {/* Current User Highlights */}
            {myUser && (
              <motion.div
                variants={itemVariants}
                className="w-full lg:w-auto bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
              >
                <div className="text-center sm:text-left">
                  <p className="text-[#6366F1] font-medium mb-1">
                    Your Rank: #{myUser.rank}
                  </p>
                  <p className="text-xl font-bold">{myUser.eloRating} ELO</p>
                </div>
                <div className="hidden sm:block w-px h-12 bg-white/10" />
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-mono font-bold">
                      {myUser.totalSessions}
                    </p>
                    <p className="text-xs text-[#A0A0B0] uppercase tracking-wider">
                      Sessions
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-mono font-bold">
                      {myUser.avgScore}
                    </p>
                    <p className="text-xs text-[#A0A0B0] uppercase tracking-wider">
                      Avg Score
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* SECTION 2: TOP 3 PODIUM */}
          {topUsers.length >= 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-4 items-end max-w-4xl mx-auto">
              {/* Rank 2 - Silver */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-t from-[#111116] to-[#1A1A24] border border-slate-300/20 rounded-t-3xl p-6 text-center relative md:h-[220px] order-2 md:order-1 flex flex-col justify-end"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-black font-bold border-4 border-[#08080C] shadow-lg shadow-slate-300/20">
                  2
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-slate-300">
                  {topUsers[1].name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-bold text-lg mb-1">{topUsers[1].name}</h3>
                <p className="text-slate-300 font-mono font-bold text-xl">
                  {topUsers[1].eloRating}
                </p>
                <p className="text-xs text-[#A0A0B0] mt-2">
                  {topUsers[1].totalSessions} sessions
                </p>
              </motion.div>

              {/* Rank 1 - Gold */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-t from-[#111116] to-amber-900/20 border border-amber-500/30 rounded-t-3xl p-6 text-center relative md:h-[260px] order-1 md:order-2 flex flex-col justify-end z-10 shadow-[0_-10px_40px_rgba(245,158,11,0.15)]"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-xl border-4 border-[#08080C] shadow-lg shadow-amber-500/40">
                  1
                </div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-2xl font-bold text-amber-500">
                  {topUsers[0].name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-bold text-xl mb-1 text-white">
                  {topUsers[0].name}
                </h3>
                <p className="text-amber-500 font-mono font-bold text-2xl">
                  {topUsers[0].eloRating}
                </p>
                <p className="text-xs text-amber-500/70 mt-2">
                  {topUsers[0].totalSessions} sessions
                </p>
              </motion.div>

              {/* Rank 3 - Bronze */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-t from-[#111116] to-orange-900/10 border border-orange-400/20 rounded-t-3xl p-6 text-center relative md:h-[200px] order-3 flex flex-col justify-end"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center text-black font-bold border-4 border-[#08080C] shadow-lg shadow-orange-400/20">
                  3
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-orange-400">
                  {topUsers[2].name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-bold text-lg mb-1">{topUsers[2].name}</h3>
                <p className="text-orange-400 font-mono font-bold text-xl">
                  {topUsers[2].eloRating}
                </p>
                <p className="text-xs text-[#A0A0B0] mt-2">
                  {topUsers[2].totalSessions} sessions
                </p>
              </motion.div>
            </div>
          ) : leaderboard.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="bg-[#111116] border border-white/5 rounded-2xl p-12 text-center"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                The leaderboard fills up as more developers join
              </h3>
              <p className="text-[#A0A0B0]">
                You are currently ranked #1! Keep practicing.
              </p>
            </motion.div>
          ) : null}

          {/* SECTION 3: FULL TABLE */}
          <motion.div
            variants={itemVariants}
            className="bg-[#111116] border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-lg font-bold">Rankings</h3>
              <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                {["All Time", "This Month", "This Week"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-md text-sm transition-colors ${filter === f ? "bg-white/10 text-white font-medium" : "text-[#A0A0B0] hover:text-white"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-[#A0A0B0] text-sm font-medium border-b border-white/5">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">ELO</th>
                    <th className="px-6 py-4">Sessions</th>
                    <th className="px-6 py-4">Avg Score</th>
                    <th className="px-6 py-4">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {displayUsers.map((user) => (
                    <tr
                      key={user.rank}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${user.isCurrentUser ? "bg-[#6366F1]/5 relative" : ""}`}
                    >
                      {user.isCurrentUser && (
                        <td className="absolute left-0 top-0 bottom-0 w-1 bg-[#6366F1]" />
                      )}
                      <td className="px-6 py-4 font-mono font-medium text-[#A0A0B0]">
                        #{user.rank}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span
                            className={
                              user.isCurrentUser
                                ? "text-[#6366F1] font-bold"
                                : "font-medium"
                            }
                          >
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-white">
                          {user.eloRating}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#A0A0B0]">
                        {user.totalSessions}
                      </td>
                      <td className="px-6 py-4 text-[#A0A0B0]">
                        {user.avgScore}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-orange-400">🔥</span>
                          <span className="font-mono text-[#A0A0B0]">
                            {user.streak}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* SECTION 4: HOW ELO WORKS */}
          <motion.div
            variants={itemVariants}
            className="bg-[#111116] border border-white/5 rounded-2xl p-6 md:p-8 max-w-3xl flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="w-12 h-12 bg-blue-500/10 flex-shrink-0 rounded-xl flex items-center justify-center text-blue-400 mt-1">
              <span className="font-bold text-xl">?</span>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">How ELO Rating Works</h3>
              <p className="text-[#A0A0B0] leading-relaxed text-sm">
                Your ELO starts at 1200. Complete sessions to earn or lose
                points. Higher score in a session = more points earned.
                Consistency matters — users who practice daily climb faster than
                users who practice occasionally.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
