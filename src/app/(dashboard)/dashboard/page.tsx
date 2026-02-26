"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setProgress(d);
      })
      .catch(() => {});
  }, []);

  const totalSessions = progress?.totalSessions ?? 0;
  const avgScore = progress?.avgScore ?? 0;
  const streak = progress?.streak ?? 0;
  const totalTime = progress?.totalTime ?? 0;
  const skills = progress?.skillScores ?? {};
  const hours = Math.floor(totalTime / 3600);
  const mins = Math.floor((totalTime % 3600) / 60);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome header */}
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="gradient-text">{firstName}</span>! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Ready to ace your next interview? Pick a practice type below.
        </p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {[
          {
            label: "Sessions",
            value: String(totalSessions),
            icon: MessageSquare,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Avg Score",
            value: avgScore ? `${avgScore}%` : "—",
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10",
          },
          {
            label: "Streak",
            value: `${streak} day${streak !== 1 ? "s" : ""}`,
            icon: Flame,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
          },
          {
            label: "Total Time",
            value: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
            icon: Clock,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
          },
        ].map((stat) => (
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

      {/* Quick start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Start</h2>
          <Link href="/interview">
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStartTypes.map((type) => (
            <Link key={type.id} href={`/interview?type=${type.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${type.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{type.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {type.desc}
                    </p>
                  </div>
                  <Play className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Skills overview & Recent */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-violet-500" />
                Skill Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Problem Solving", key: "problemSolving" },
                { name: "Code Quality", key: "codeQuality" },
                { name: "Communication", key: "communication" },
                { name: "System Design", key: "systemDesign" },
                { name: "Edge Cases", key: "edgeCases" },
              ].map((skill) => {
                const score = skills[skill.key] ?? 0;
                return (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground">{score}/100</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                );
              })}
              <p className="text-sm text-muted-foreground text-center pt-2">
                Complete interviews to build your skill profile
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-violet-500" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No sessions yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your first mock interview to see your history here
                </p>
                <Link href="/interview">
                  <Button variant="glow" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Start First Interview
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
