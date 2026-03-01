"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  MessageSquare,
  Trophy,
  Flame,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
  Code2,
  Network,
  Layout,
  Server,
  Sparkles,
  Play,
  Zap,
  Calendar,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getEloLevel, formatDuration } from "@/lib/utils";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const quickStartTypes = [
  {
    id: "dsa",
    name: "DSA Practice",
    icon: Code2,
    desc: "Data structures & algorithms",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "system-design",
    name: "System Design",
    icon: Network,
    desc: "Architecture & scalability",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    icon: MessageSquare,
    desc: "STAR method, leadership",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "frontend",
    name: "Frontend",
    icon: Layout,
    desc: "React, CSS, JavaScript",
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "backend",
    name: "Backend",
    icon: Server,
    desc: "APIs & databases",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "full-loop",
    name: "Full Loop",
    icon: Trophy,
    desc: "Complete simulation",
    color: "from-indigo-500 to-violet-500",
  },
];

interface ProgressData {
  totalSessions: number;
  avgScore: number;
  streak: number;
  maxStreak: number;
  totalTime: number;
  eloRating: number;
  skillScores: Record<string, number>;
  categoryScores: Record<string, number>;
  dailyScores: { date: string; score: number }[];
  weeklyGoal: number;
  sessionsThisWeek: number;
}

interface SessionItem {
  _id: string;
  type: string;
  company: string;
  difficulty: string;
  overallScore: number;
  duration: number;
  completed: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [recentSessions, setRecentSessions] = useState<SessionItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/progress").then((r) => r.json()),
      fetch("/api/sessions").then((r) => r.json()),
    ])
      .then(([progressData, sessionsData]) => {
        if (!progressData.error) setProgress(progressData);
        if (sessionsData.sessions)
          setRecentSessions(sessionsData.sessions.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  const eloRating = progress?.eloRating ?? 1200;
  const eloLevel = useMemo(() => getEloLevel(eloRating), [eloRating]);
  const totalSessions = progress?.totalSessions ?? 0;
  const avgScore = progress?.avgScore ?? 0;
  const streak = progress?.streak ?? 0;
  const totalTime = progress?.totalTime ?? 0;
  const skills = progress?.skillScores ?? {};

  const heatmapData = useMemo(() => {
    const cells: { date: string; count: number; level: number }[] = [];
    const dailyMap = new Map<string, number>();
    for (const s of progress?.dailyScores ?? []) {
      const day = s.date.split("T")[0];
      dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
    }
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const count = dailyMap.get(key) || 0;
      cells.push({
        date: key,
        count,
        level:
          count === 0
            ? 0
            : count <= 1
              ? 1
              : count <= 2
                ? 2
                : count <= 3
                  ? 3
                  : 4,
      });
    }
    return cells;
  }, [progress?.dailyScores]);

  const heatmapColors = [
    "bg-white/4",
    "bg-indigo-500/30",
    "bg-indigo-500/50",
    "bg-indigo-500/70",
    "bg-indigo-500",
  ];

  const stats = [
    {
      label: "Sessions",
      value: String(totalSessions),
      icon: MessageSquare,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Avg Score",
      value: avgScore ? `${avgScore}%` : "—",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Streak",
      value: `${streak}d`,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      label: "Total Time",
      value: formatDuration(totalTime),
      icon: Clock,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 page-enter bg-[#080808]">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, <span className="gradient-text">{firstName}</span>
          </h1>
          <p className="text-[#888] mt-1">
            Ready to level up your interview skills today?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Zap className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-lg font-bold text-indigo-400 leading-none">
                {eloRating}
              </div>
              <div className="text-[10px] text-[#666] uppercase tracking-wider">
                {eloLevel.name}
              </div>
            </div>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Flame className="w-5 h-5 text-orange-400 streak-fire" />
              <div>
                <div className="text-lg font-bold text-orange-400 leading-none">
                  {streak}
                </div>
                <div className="text-[10px] text-[#666] uppercase tracking-wider">
                  Day streak
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            className={`card-3d premium-card bg-[#111] border ${stat.border} rounded-2xl p-5`}
          >
            <div className="flex items-center gap-3 relative z-10">
              <div
                className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight tabular-nums number-reveal">
                  {stat.value}
                </p>
                <p className="text-xs text-[#666] uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Interview CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600/20 via-violet-600/20 to-purple-600/20 border border-indigo-500/20 p-6">
          <div className="absolute inset-0 hero-grid opacity-20" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Video className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">
                    Video Interview Mode
                  </h3>
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[10px]">
                    NEW
                  </Badge>
                </div>
                <p className="text-sm text-[#888]">
                  Practice with webcam, AI avatar, real-time speech analysis
                  &amp; filler word detection
                </p>
              </div>
            </div>
            <Link href="/interview?mode=video">
              <Button variant="glow" className="gap-2 shrink-0">
                <Video className="w-4 h-4" />
                Try Video Interview
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h2 className="font-semibold">Activity</h2>
          </div>
          <div className="flex gap-0.75 flex-wrap">
            {heatmapData.map((cell) => (
              <div
                key={cell.date}
                className={`w-3 h-3 rounded-xs heatmap-cell transition-colors ${heatmapColors[cell.level]}`}
                title={`${cell.date}: ${cell.count} sessions`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-[#555]">
            <span>Less</span>
            {heatmapColors.map((color, i) => (
              <div key={i} className={`w-3 h-3 rounded-xs ${color}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </motion.div>

      {/* Quick start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Start</h2>
          <Link href="/interview">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-[#888] hover:text-white"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {quickStartTypes.map((type) => (
            <Link key={type.id} href={`/interview?type=${type.id}`}>
              <div className="card-3d premium-card bg-[#111] border border-white/8 rounded-2xl p-5 flex items-center gap-4 cursor-pointer group">
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${type.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}
                >
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{type.name}</h3>
                  <p className="text-sm text-[#666] truncate">{type.desc}</p>
                </div>
                <Play className="w-5 h-5 text-[#555] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Skills & Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold">Skill Overview</h2>
            </div>
            <div className="space-y-4">
              {[
                { name: "Problem Solving", key: "problemSolving" },
                { name: "Code Quality", key: "codeQuality" },
                { name: "Communication", key: "communication" },
                { name: "Edge Cases", key: "edgeCases" },
                { name: "Time Management", key: "timeManagement" },
              ].map((skill) => {
                const score = skills[skill.key] ?? 0;
                return (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#ccc]">{skill.name}</span>
                      <span className="text-[#666] font-mono text-xs">
                        {score}/100
                      </span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                );
              })}
              {totalSessions === 0 && (
                <p className="text-sm text-[#555] text-center pt-2">
                  Complete interviews to build your skill profile
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold">Recent Sessions</h2>
            </div>
            {recentSessions.length > 0 ? (
              <div className="space-y-2">
                {recentSessions.map((s) => (
                  <Link key={s._id} href={`/interview/${s._id}/report`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 transition-colors cursor-pointer group/item">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium capitalize">
                          {s.type.replace("_", " ")}
                        </div>
                        <div className="text-xs text-[#666] capitalize">
                          {s.company} · {s.difficulty}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {s.overallScore || 0}%
                        </div>
                        <div className="text-xs text-[#555]">
                          {formatDuration(s.duration)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/history">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-1 mt-2 text-[#888]"
                  >
                    View all <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-[#555]" />
                </div>
                <h3 className="font-semibold mb-1">No sessions yet</h3>
                <p className="text-sm text-[#666] mb-4">
                  Start your first mock interview to see your history here
                </p>
                <Link href="/interview">
                  <Button variant="glow" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Start First Interview
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
