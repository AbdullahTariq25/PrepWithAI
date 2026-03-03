"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  Trophy,
  Target,
  Flame,
  Calendar,
  Clock,
  Loader2,
  Zap,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDuration, getScoreColor, getEloLevel } from "@/lib/utils";
interface ProgressData {
  totalSessions: number;
  averageScore: number;
  currentStreak: number;
  totalPracticeTime: number;
  eloRating: number;
  bestScore: number;
  weeklyGoal: number;
  weeklyCompleted: number;
  skillBreakdown: { skill: string; score: number }[];
  scoreHistory: { date: string; score: number }[];
  recentScores: number[];
  activityHeatmap: { date: string; count: number }[];
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/progress");
        const data = await res.json();
        setProgress(data);
      } catch {
        console.error("Failed to load progress");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const eloInfo = useMemo(() => {
    if (!progress) return { name: "Beginner", color: "#6b7280", emoji: "🌱" };
    const info = getEloLevel(progress.eloRating);
    const emojiMap: Record<string, string> = {
      Beginner: "🌱",
      Apprentice: "🌿",
      Intermediate: "⚡",
      Advanced: "🔥",
      Expert: "💎",
      Master: "👑",
      Grandmaster: "🏆",
    };
    return { ...info, emoji: emojiMap[info.name] || "🌱" };
  }, [progress]);

  const radarData = useMemo(() => {
    if (!progress?.skillBreakdown) return [];
    return progress.skillBreakdown.map((s) => ({
      skill: s.skill.replace(/_/g, " "),
      value: s.score,
      fullMark: 100,
    }));
  }, [progress]);

  const chartData = useMemo(() => {
    if (!progress?.scoreHistory) return [];
    return progress.scoreHistory.slice(-30).map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: d.score,
    }));
  }, [progress]);

  // Generate heatmap (last 12 weeks)
  const heatmapWeeks = useMemo(() => {
    const weeks: { date: Date; count: number }[][] = [];
    const today = new Date();
    const actMap = new Map<string, number>();
    progress?.activityHeatmap?.forEach((a) =>
      actMap.set(a.date.split("T")[0], a.count),
    );

    for (let w = 11; w >= 0; w--) {
      const week: { date: Date; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const key = date.toISOString().split("T")[0];
        week.push({ date, count: actMap.get(key) || 0 });
      }
      weeks.push(week);
    }
    return weeks;
  }, [progress]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <Loader2
          style={{
            width: 32,
            height: 32,
            animation: "spin 1s linear infinite",
            color: "#6366F1",
          }}
        />
      </div>
    );
  }

  if (!progress) return null;

  const weeklyPct =
    progress.weeklyGoal > 0
      ? Math.min(
          100,
          Math.round((progress.weeklyCompleted / progress.weeklyGoal) * 100),
        )
      : 0;

  return (
    <div
      className="animate-fade-up"
      style={{ maxWidth: 1100, margin: "0 auto" }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="text-display" style={{ marginBottom: 8 }}>
          Your Progress
        </h1>
        <p className="text-body" style={{ color: "var(--text-secondary)" }}>
          Track your growth and identify areas for improvement
        </p>
      </div>

      {/* Top Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {[
          {
            label: "ELO Rating",
            value: progress.eloRating,
            sub: `${eloInfo.emoji} ${eloInfo.name}`,
            icon: Zap,
            color: "#6366F1",
          },
          {
            label: "Average Score",
            value: `${progress.averageScore}%`,
            icon: Target,
            color: "#22C55E",
          },
          {
            label: "Total Sessions",
            value: progress.totalSessions,
            icon: Trophy,
            color: "#F59E0B",
          },
          {
            label: "Current Streak",
            value: `${progress.currentStreak}d`,
            icon: Flame,
            color: "#EF4444",
          },
          {
            label: "Practice Time",
            value: formatDuration(progress.totalPracticeTime),
            icon: Clock,
            color: "#3B82F6",
          },
          {
            label: "Best Score",
            value: `${progress.bestScore}%`,
            icon: TrendingUp,
            color: "#8B5CF6",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`stagger-${i + 1}`}
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: `${stat.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <stat.icon
                  style={{ width: 14, height: 14, color: stat.color }}
                />
              </div>
              <span
                className="text-caption"
                style={{ color: "var(--text-muted)" }}
              >
                {stat.label}
              </span>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {stat.value}
            </div>
            {stat.sub && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                {stat.sub}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Weekly Target */}
      <div
        style={{
          marginBottom: 32,
          padding: "16px 20px",
          borderRadius: 14,
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar style={{ width: 16, height: 16, color: "#6366F1" }} />
            <span
              className="text-label"
              style={{ color: "var(--text-secondary)" }}
            >
              Weekly Target
            </span>
          </div>
          <span
            className="font-code"
            style={{ fontSize: 13, color: "var(--text-primary)" }}
          >
            {progress.weeklyCompleted} / {progress.weeklyGoal} sessions
          </span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "rgba(99,102,241,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${weeklyPct}%`,
              borderRadius: 3,
              background: "linear-gradient(90deg, #6366F1, #818CF8)",
              transition: "width 600ms ease",
            }}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {/* Score Trend */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h3
            className="text-label"
            style={{ color: "var(--text-secondary)", marginBottom: 16 }}
          >
            Score Trend (30 Days)
          </h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#888" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366F1"
                  fill="url(#progressGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h3
            className="text-label"
            style={{ color: "var(--text-secondary)", marginBottom: 16 }}
          >
            Skill Breakdown
          </h3>
          <div style={{ height: 220 }}>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={radarData}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                >
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fontSize: 10, fill: "#888" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "var(--text-muted)",
                  fontSize: 13,
                }}
              >
                Complete more sessions to see your skill radar
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div
        style={{
          padding: 20,
          borderRadius: 16,
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          marginBottom: 32,
        }}
      >
        <h3
          className="text-label"
          style={{ color: "var(--text-secondary)", marginBottom: 16 }}
        >
          Activity (Last 12 Weeks)
        </h3>
        <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
          {heatmapWeeks.map((week, wi) => (
            <div
              key={wi}
              style={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {week.map((day, di) => {
                const intensity = Math.min(4, day.count);
                const colors = [
                  "rgba(255,255,255,0.04)",
                  "rgba(99,102,241,0.2)",
                  "rgba(99,102,241,0.4)",
                  "rgba(99,102,241,0.6)",
                  "rgba(99,102,241,0.9)",
                ];
                return (
                  <div
                    key={di}
                    title={`${day.date.toLocaleDateString()} — ${day.count} sessions`}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      backgroundColor: colors[intensity],
                      transition: "background-color 200ms ease",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 4,
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "var(--text-disabled)",
              marginRight: 4,
            }}
          >
            Less
          </span>
          {[
            "rgba(255,255,255,0.04)",
            "rgba(99,102,241,0.2)",
            "rgba(99,102,241,0.4)",
            "rgba(99,102,241,0.6)",
            "rgba(99,102,241,0.9)",
          ].map((c, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: c,
              }}
            />
          ))}
          <span
            style={{
              fontSize: 10,
              color: "var(--text-disabled)",
              marginLeft: 4,
            }}
          >
            More
          </span>
        </div>
      </div>

      {/* Skill Details */}
      {progress.skillBreakdown.length > 0 && (
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h3
            className="text-label"
            style={{ color: "var(--text-secondary)", marginBottom: 16 }}
          >
            Skill Details
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {progress.skillBreakdown
              .sort((a, b) => b.score - a.score)
              .map((skill, i) => {
                const color = getScoreColor(skill.score);
                return (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          textTransform: "capitalize",
                        }}
                      >
                        {skill.skill.replace(/_/g, " ")}
                      </span>
                      <span
                        className="font-code"
                        style={{ fontSize: 13, fontWeight: 600, color }}
                      >
                        {skill.score}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${skill.score}%`,
                          borderRadius: 2,
                          backgroundColor: color,
                          transition: "width 600ms ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
