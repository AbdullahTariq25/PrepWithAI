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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  dsa: "bg-blue-500",
  system_design: "bg-purple-500",
  behavioral: "bg-green-500",
  frontend: "bg-orange-500",
  backend: "bg-red-500",
  full_loop: "bg-indigo-500",
};

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Session History</h1>
        <p className="text-muted-foreground">
          Review your past interviews and track improvement
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
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
              className="capitalize"
            >
              {f === "all" ? "All" : f.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Brain className="w-10 h-10 text-violet-500 animate-pulse" />
        </div>
      ) : filteredSessions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-1">No sessions yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start your first interview to build your history
            </p>
            <Link href="/interview">
              <Button variant="glow">Start Interview</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((s, i) => {
            const Icon = typeIcons[s.type] || Code2;
            const color = typeColors[s.type] || "bg-zinc-500";
            const date = new Date(s.createdAt);

            return (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/interview/${s._id}/report`}>
                  <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">
                            {s.type.replace("_", " ")}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {s.company}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs capitalize"
                          >
                            {s.difficulty}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
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
                          <span>{date.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {s.completed ? (
                          <div
                            className={`text-2xl font-bold ${getScoreColor(s.overallScore)}`}
                          >
                            {s.overallScore}
                          </div>
                        ) : (
                          <Badge variant="secondary">In Progress</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
