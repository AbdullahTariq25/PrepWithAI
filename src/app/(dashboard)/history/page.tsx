"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Trophy,
  Lightbulb,
  Brain,
  Code2,
  Network,
  MessageSquare,
  Layout,
  Server,
  Search,
  ArrowRight,
  TrendingUp,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDuration, getScoreColor } from "@/lib/utils";

interface SessionItem {
  _id: string;
  type: string;
  company: string;
  difficulty: string;
  overallScore: number;
  duration: number;
  hintsUsed: number;
  completed: boolean;
  createdAt: string;
}

const typeIcons: Record<string, typeof Code2> = {
  dsa: Code2,
  system_design: Network,
  behavioral: MessageSquare,
  frontend: Layout,
  backend: Server,
  full_loop: Trophy,
};

const typeColors: Record<string, string> = {
  dsa: "from-blue-500 to-cyan-500",
  system_design: "from-purple-500 to-indigo-500",
  behavioral: "from-green-500 to-emerald-500",
  frontend: "from-orange-500 to-amber-500",
  backend: "from-red-500 to-pink-500",
  full_loop: "from-indigo-500 to-violet-500",
};

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (error) {
        console.error("Failed to load sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filter !== "all" && s.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.type.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q) ||
        s.difficulty.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCompleted = sessions.filter((s) => s.completed).length;
  const avgScore =
    totalCompleted > 0
      ? Math.round(
          sessions
            .filter((s) => s.completed)
            .reduce((a, s) => a + s.overallScore, 0) / totalCompleted,
        )
      : 0;
  const bestScore =
    sessions.length > 0
      ? Math.max(...sessions.map((s) => s.overallScore || 0))
      : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 page-enter bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
        <p className="text-[#888] text-sm mt-1">
          Review your past interviews and track improvement
        </p>
      </motion.div>

      {/* Mini stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          {
            label: "Completed",
            value: totalCompleted,
            icon: MessageSquare,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Avg Score",
            value: `${avgScore}%`,
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Best Score",
            value: `${bestScore}%`,
            icon: Trophy,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111] border border-white/8 rounded-xl p-4 flex items-center gap-3 premium-card"
          >
            <div
              className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold tabular-nums">{stat.value}</p>
              <p className="text-[10px] text-[#555] uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <Input
            placeholder="Search by type, company, or difficulty..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "dsa",
            "system_design",
            "behavioral",
            "frontend",
            "backend",
          ].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize text-xs"
            >
              {f === "all" ? "All" : f.replace("_", " ")}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Sessions list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Brain className="w-10 h-10 text-indigo-500 animate-pulse" />
          <p className="text-sm text-[#555]">Loading your sessions...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-[#111] border border-white/8 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-[#555]" />
          </div>
          <h3 className="font-semibold mb-1">No sessions yet</h3>
          <p className="text-sm text-[#666] mb-4">
            Start your first interview to build your history
          </p>
          <Link href="/interview">
            <Button variant="glow" className="gap-2">
              <Flame className="w-4 h-4" /> Start Interview
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((s, i) => {
            const Icon = typeIcons[s.type] || Code2;
            const gradient = typeColors[s.type] || "from-zinc-500 to-zinc-600";

            return (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/interview/${s._id}/report`}>
                  <div className="bg-[#111] border border-white/8 rounded-xl p-5 hover:border-white/14 hover:bg-[#131313] transition-all duration-200 cursor-pointer group premium-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-linear-to-br ${gradient} flex items-center justify-center shrink-0`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize text-sm">
                              {s.type.replace("_", " ")}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] capitalize"
                            >
                              {s.company}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-[10px] capitalize"
                            >
                              {s.difficulty}
                            </Badge>
                          </div>
                          <div className="text-xs text-[#555] flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />{" "}
                              {formatDuration(s.duration)}
                            </span>
                            {s.hintsUsed > 0 && (
                              <span className="flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" /> {s.hintsUsed}{" "}
                                hints
                              </span>
                            )}
                            <span>{timeAgo(s.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {s.completed ? (
                          <div
                            className={`text-2xl font-bold tabular-nums ${getScoreColor(s.overallScore)}`}
                          >
                            {s.overallScore}
                            <span className="text-xs text-[#555] font-normal ml-0.5">
                              /100
                            </span>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            In Progress
                          </Badge>
                        )}
                        <ArrowRight className="w-4 h-4 text-[#555] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
