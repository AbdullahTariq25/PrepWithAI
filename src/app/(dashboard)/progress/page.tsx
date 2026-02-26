"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const skillLabels: Record<string, string> = {
  problemSolving: "Problem Solving",
  codeQuality: "Code Quality",
  communication: "Communication",
  systemDesign: "System Design",
  edgeCases: "Edge Cases",
  optimization: "Optimization",
};

export default function ProgressPage() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgScore: 0,
    streak: 0,
    totalTime: 0,
    skills: {
      problemSolving: 0,
      codeQuality: 0,
      communication: 0,
      systemDesign: 0,
      edgeCases: 0,
      optimization: 0,
    },
    dailyScores: [] as { date: string; score: number }[],
  });
  const [, setLoading] = useState(true);

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

  const statCards = [
    {
      label: "Total Sessions",
      value: stats.totalSessions,
      icon: Brain,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Average Score",
      value: stats.avgScore || "—",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Day Streak",
      value: stats.streak,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Total Time",
      value: `${Math.round(stats.totalTime / 60)}h`,
      icon: Clock,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Progress</h1>
        <p className="text-muted-foreground">
          Track your improvement over time
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Skills radar */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-violet-500" /> Skill Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(stats.skills).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>{skillLabels[key] || key}</span>
                    <span className="text-muted-foreground">{value}/100</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
              {stats.totalSessions === 0 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  Complete interviews to build your skill profile
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Score trend chart placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-500" /> Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.dailyScores.length > 0 ? (
                <div className="h-64 flex items-end gap-1">
                  {stats.dailyScores.slice(-14).map((d, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full bg-violet-500 rounded-t-sm transition-all"
                        style={{ height: `${(d.score / 100) * 200}px` }}
                      />
                      <span className="text-xs text-muted-foreground rotate-45 origin-left">
                        {new Date(d.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Complete more sessions to see your score trend
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-500" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "First Steps",
                  desc: "Complete 1 interview",
                  icon: "🎯",
                  unlocked: stats.totalSessions >= 1,
                },
                {
                  name: "Streak Master",
                  desc: "7-day streak",
                  icon: "🔥",
                  unlocked: stats.streak >= 7,
                },
                {
                  name: "High Achiever",
                  desc: "Score 90+",
                  icon: "⭐",
                  unlocked: stats.avgScore >= 90,
                },
                {
                  name: "Veteran",
                  desc: "Complete 50 sessions",
                  icon: "🏆",
                  unlocked: stats.totalSessions >= 50,
                },
              ].map((ach) => (
                <div
                  key={ach.name}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    ach.unlocked
                      ? "bg-violet-500/5 border-violet-500/20"
                      : "opacity-40 grayscale"
                  }`}
                >
                  <div className="text-2xl mb-2">{ach.icon}</div>
                  <div className="font-medium text-sm">{ach.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {ach.desc}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
