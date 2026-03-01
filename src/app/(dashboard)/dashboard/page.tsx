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
    color: "linear-gradient(135deg, #3B82F6, #06B6D4)",
  },
  {
    id: "system-design",
    name: "System Design",
    icon: Network,
    desc: "Architecture & scalability",
    color: "linear-gradient(135deg, #8B5CF6, #6366F1)",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    icon: MessageSquare,
    desc: "STAR method, leadership",
    color: "linear-gradient(135deg, #22C55E, #10B981)",
  },
  {
    id: "frontend",
    name: "Frontend",
    icon: Layout,
    desc: "React, CSS, JavaScript",
    color: "linear-gradient(135deg, #F97316, #EAB308)",
  },
  {
    id: "backend",
    name: "Backend",
    icon: Server,
    desc: "APIs & databases",
    color: "linear-gradient(135deg, #EF4444, #EC4899)",
  },
  {
    id: "full-loop",
    name: "Full Loop",
    icon: Trophy,
    desc: "Complete simulation",
    color: "linear-gradient(135deg, #6366F1, #8B5CF6)",
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

/* Raycast-style card wrapper */
const RayCard = ({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      backgroundColor: "#111116",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 14,
      ...style,
    }}
  >
    {children}
  </div>
);

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
      .catch(() => { });
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
    "rgba(255,255,255,0.04)",
    "rgba(99,102,241,0.3)",
    "rgba(99,102,241,0.5)",
    "rgba(99,102,241,0.7)",
    "rgba(99,102,241,1)",
  ];

  const stats = [
    {
      label: "Sessions",
      value: String(totalSessions),
      icon: MessageSquare,
      iconColor: "#60A5FA",
      bgColor: "rgba(59,130,246,0.1)",
      borderColor: "rgba(59,130,246,0.15)",
    },
    {
      label: "Avg Score",
      value: avgScore ? `${avgScore}%` : "—",
      icon: TrendingUp,
      iconColor: "#34D399",
      bgColor: "rgba(16,185,129,0.1)",
      borderColor: "rgba(16,185,129,0.15)",
    },
    {
      label: "Streak",
      value: `${streak}d`,
      icon: Flame,
      iconColor: "#FB923C",
      bgColor: "rgba(249,115,22,0.1)",
      borderColor: "rgba(249,115,22,0.15)",
    },
    {
      label: "Total Time",
      value: formatDuration(totalTime),
      icon: Clock,
      iconColor: "#818CF8",
      bgColor: "rgba(99,102,241,0.1)",
      borderColor: "rgba(99,102,241,0.15)",
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {getGreeting()},{" "}
            <span style={{ color: "#818CF8" }}>{firstName}</span>
          </h1>
          <p
            style={{
              color: "rgba(156,156,157,1)",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            Ready to level up your interview skills today?
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 10,
              backgroundColor: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            <Zap style={{ width: 16, height: 16, color: "#818CF8" }} />
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#818CF8",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {eloRating}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {eloLevel.name}
              </div>
            </div>
          </div>
          {streak > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                backgroundColor: "rgba(249,115,22,0.08)",
                border: "1px solid rgba(249,115,22,0.15)",
              }}
            >
              <Flame style={{ width: 16, height: 16, color: "#FB923C" }} />
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#FB923C",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {streak}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Day streak
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
          >
            <RayCard style={{ padding: 18, border: `1px solid ${stat.borderColor}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: stat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <stat.icon
                    style={{ width: 18, height: 18, color: stat.iconColor }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1,
                      margin: 0,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </RayCard>
          </motion.div>
        ))}
      </div>

      {/* Video Interview CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 14,
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12), rgba(168,85,247,0.12))",
            border: "1px solid rgba(99,102,241,0.15)",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
                }}
              >
                <Video style={{ width: 24, height: 24, color: "white" }} />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    Video Interview Mode
                  </h3>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: 4,
                      backgroundColor: "rgba(99,102,241,0.2)",
                      color: "#818CF8",
                      border: "1px solid rgba(99,102,241,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    NEW
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(156,156,157,1)",
                    margin: 0,
                  }}
                >
                  Practice with webcam, AI avatar, real-time speech analysis &
                  filler word detection
                </p>
              </div>
            </div>
            <Link href="/interview?mode=video">
              <Button variant="glow" className="gap-2 shrink-0">
                <Video style={{ width: 16, height: 16 }} />
                Try Video Interview
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        style={{ marginBottom: 24 }}
      >
        <RayCard style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <Calendar style={{ width: 16, height: 16, color: "#818CF8" }} />
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
              Activity
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {heatmapData.map((cell) => (
              <div
                key={cell.date}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 2,
                  backgroundColor: heatmapColors[cell.level],
                  transition: "background-color 200ms ease",
                }}
                title={`${cell.date}: ${cell.count} sessions`}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 10,
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            <span>Less</span>
            {heatmapColors.map((color, i) => (
              <div
                key={i}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 2,
                  backgroundColor: color,
                }}
              />
            ))}
            <span>More</span>
          </div>
        </RayCard>
      </motion.div>

      {/* Quick start */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
            Quick Start
          </h2>
          <Link href="/interview">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-[#9C9C9D] hover:text-white"
            >
              View all <ArrowRight style={{ width: 14, height: 14 }} />
            </Button>
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          {quickStartTypes.map((type, i) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.22 + i * 0.03 }}
            >
              <Link href={`/interview?type=${type.id}`} style={{ textDecoration: "none" }}>
                <RayCard
                  style={{
                    padding: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                  className="group hover:border-white/12 hover:bg-[#16161D]"
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: type.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "transform 200ms ease",
                    }}
                    className="group-hover:scale-110"
                  >
                    <type.icon
                      style={{ width: 20, height: 20, color: "white" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        margin: 0,
                        color: "#E8E8ED",
                      }}
                    >
                      {type.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(156,156,157,0.7)",
                        margin: 0,
                        marginTop: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {type.desc}
                    </p>
                  </div>
                  <Play
                    style={{
                      width: 16,
                      height: 16,
                      color: "rgba(255,255,255,0.2)",
                      opacity: 0,
                      transition: "opacity 200ms ease",
                    }}
                    className="group-hover:opacity-100"
                  />
                </RayCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skills & Recent */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 16,
        }}
      >
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <RayCard style={{ padding: 22 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 18,
              }}
            >
              <Target style={{ width: 16, height: 16, color: "#818CF8" }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                Skill Overview
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { name: "Problem Solving", key: "problemSolving" },
                { name: "Code Quality", key: "codeQuality" },
                { name: "Communication", key: "communication" },
                { name: "Edge Cases", key: "edgeCases" },
                { name: "Time Management", key: "timeManagement" },
              ].map((skill) => {
                const score = skills[skill.key] ?? 0;
                return (
                  <div key={skill.name}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ color: "#9C9C9D" }}>{skill.name}</span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          fontFamily: "monospace",
                          fontSize: 11,
                        }}
                      >
                        {score}/100
                      </span>
                    </div>
                    <Progress value={score} className="h-1.5" />
                  </div>
                );
              })}
              {totalSessions === 0 && (
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.25)",
                    textAlign: "center",
                    paddingTop: 8,
                  }}
                >
                  Complete interviews to build your skill profile
                </p>
              )}
            </div>
          </RayCard>
        </motion.div>

        {/* Recent sessions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <RayCard style={{ padding: 22 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 18,
              }}
            >
              <Clock style={{ width: 16, height: 16, color: "#818CF8" }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                Recent Sessions
              </h2>
            </div>
            {recentSessions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {recentSessions.map((s) => (
                  <Link
                    key={s._id}
                    href={`/interview/${s._id}/report`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "background-color 150ms ease",
                      }}
                      onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          backgroundColor: "rgba(99,102,241,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <MessageSquare
                          style={{
                            width: 16,
                            height: 16,
                            color: "#818CF8",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            textTransform: "capitalize",
                            color: "#E8E8ED",
                          }}
                        >
                          {s.type.replace("_", " ")}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(156,156,157,0.6)",
                            textTransform: "capitalize",
                          }}
                        >
                          {s.company} · {s.difficulty}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#E8E8ED",
                          }}
                        >
                          {s.overallScore || 0}%
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.25)",
                          }}
                        >
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
                    className="w-full gap-1 mt-2 text-[#9C9C9D]"
                  >
                    View all <ArrowRight style={{ width: 14, height: 14 }} />
                  </Button>
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <Brain
                    style={{
                      width: 24,
                      height: 24,
                      color: "rgba(255,255,255,0.25)",
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  No sessions yet
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(156,156,157,0.6)",
                    marginBottom: 14,
                  }}
                >
                  Start your first mock interview to see your history here
                </p>
                <Link href="/interview">
                  <Button variant="glow" size="sm" className="gap-2">
                    <Sparkles style={{ width: 14, height: 14 }} />
                    Start First Interview
                  </Button>
                </Link>
              </div>
            )}
          </RayCard>
        </motion.div>
      </div>
    </div>
  );
}
