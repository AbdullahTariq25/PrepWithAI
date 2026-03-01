"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Flame,
  Clock,
  Target,
  Brain,
  Trophy,
  Zap,
  Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getEloLevel } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

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

const skillLabels: Record<string, string> = {
  problemSolving: "Problem Solving",
  communication: "Communication",
  codeQuality: "Code Quality",
  edgeCases: "Edge Cases",
  timeManagement: "Time Management",
};

const categoryLabels: Record<string, string> = {
  dsa: "DSA",
  systemDesign: "System Design",
  behavioral: "Behavioral",
  frontend: "Frontend",
  backend: "Backend",
};

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load progress:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  const eloRating = stats?.eloRating ?? 1200;
  const eloLevel = useMemo(() => getEloLevel(eloRating), [eloRating]);
  const skills = stats?.skillScores ?? {};
  const categories = stats?.categoryScores ?? {};

  const radarData = useMemo(
    () =>
      Object.entries(skills).map(([key, value]) => ({
        subject: skillLabels[key] || key,
        score: value,
        fullMark: 100,
      })),
    [skills],
  );

  const chartData = useMemo(
    () =>
      (stats?.dailyScores ?? []).slice(-30).map((d) => ({
        date: new Date(d.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        score: d.score,
      })),
    [stats?.dailyScores],
  );

  const heatmapData = useMemo(() => {
    const cells: { date: string; count: number; level: number }[] = [];
    const dailyMap = new Map<string, number>();
    for (const s of stats?.dailyScores ?? []) {
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
  }, [stats?.dailyScores]);

  const heatmapColors = [
    "bg-white/4",
    "bg-indigo-500/30",
    "bg-indigo-500/50",
    "bg-indigo-500/70",
    "bg-indigo-500",
  ];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 bg-[#080808]">
        <div className="skeleton h-10 w-48 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Sessions",
      value: String(stats?.totalSessions ?? 0),
      icon: Brain,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Average Score",
      value: stats?.avgScore ? `${stats.avgScore}%` : "\u2014",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Day Streak",
      value: `${stats?.streak ?? 0}d`,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      label: "Total Time",
      value: `${Math.round((stats?.totalTime ?? 0) / 60)}m`,
      icon: Clock,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 page-enter bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <p className="text-[#888] text-sm mt-1">
          Track your improvement over time
        </p>
      </motion.div>

      {/* ELO banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="bg-linear-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-6 flex items-center gap-6">
          <div className="elo-glow flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 shrink-0">
            <div className="text-center">
              <Zap className="w-6 h-6 text-indigo-400 mx-auto" />
              <div className="text-2xl font-bold text-indigo-400 tabular-nums">
                {eloRating}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-lg font-bold"
              style={{ color: eloLevel.color }}
            >
              {eloLevel.name}
            </div>
            <p className="text-sm text-[#888]">
              Your competitive ELO rating. Win interviews to climb.
            </p>
            <div className="mt-2">
              <Progress
                value={Math.min(((eloRating - 800) / 1200) * 100, 100)}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-[#555] mt-1">
                <span>800</span>
                <span>2000+</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111] border border-white/8 rounded-xl p-4 flex items-center gap-3 card-3d premium-card"
          >
            <div
              className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
              <p className="text-[10px] text-[#555] uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="bg-[#111] border border-white/8 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-sm">Activity Heatmap</h3>
          </div>
          <div className="flex gap-0.75 flex-wrap">
            {heatmapData.map((cell) => (
              <div
                key={cell.date}
                className={`w-3 h-3 rounded-xs heatmap-cell ${heatmapColors[cell.level]}`}
                title={`${cell.date}: ${cell.count} sessions`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-[#555]">
            <span>Less</span>
            {heatmapColors.map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-xs ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-[#111] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-sm">Score Trend</h3>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#555" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#555" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1A1A1A",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      color: "#fff",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1", r: 3 }}
                    activeDot={{ r: 5, fill: "#818cf8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <Trophy className="w-10 h-10 text-[#333] mb-3" />
                <p className="text-sm text-[#555]">
                  Complete sessions to see your score trend
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Skill Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="bg-[#111] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-sm">Skill Radar</h3>
            </div>
            {(stats?.totalSessions ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 10, fill: "#888" }}
                  />
                  <PolarRadiusAxis
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <Target className="w-10 h-10 text-[#333] mb-3" />
                <p className="text-sm text-[#555]">
                  Complete interviews to build your skill radar
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Category Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-[#111] border border-white/8 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-sm">Category Breakdown</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(categories).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#ccc]">
                    {categoryLabels[key] || key}
                  </span>
                  <span className="text-[#888] tabular-nums">{value}/100</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
            {Object.keys(categories).length === 0 && (
              <p className="text-sm text-[#555] text-center py-4">
                Complete interviews to build your category scores
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Skill Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="bg-[#111] border border-white/8 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-sm">Skill Breakdown</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(skills).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#ccc]">{skillLabels[key] || key}</span>
                  <span className="text-[#888] tabular-nums">{value}/100</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
            {Object.keys(skills).length === 0 && (
              <p className="text-sm text-[#555] text-center py-4">
                Complete interviews to build your skill profile
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
