"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Trophy,
  TrendingUp,
  Calendar,
  ChevronRight,
  Loader2,
  Filter,
  Mic,
  Video,
  MessageSquare,
} from "lucide-react";
import { formatDuration, getScoreColor } from "@/lib/utils";

interface Session {
  _id: string;
  type: string;
  company: string;
  difficulty: string;
  score?: number;
  duration?: number;
  createdAt: string;
  voiceMode?: boolean;
  mode?: string;
  questionsAnswered?: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "text" | "voice" | "video">(
    "all",
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch {
        console.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return sessions;
    return sessions.filter((s) => {
      if (filter === "voice") return s.voiceMode && s.mode !== "video";
      if (filter === "video") return s.mode === "video";
      return !s.voiceMode && s.mode !== "video";
    });
  }, [sessions, filter]);

  const stats = useMemo(() => {
    const total = sessions.length;
    const scored = sessions.filter((s) => s.score != null);
    const avgScore =
      scored.length > 0
        ? scored.reduce((sum, s) => sum + (s.score || 0), 0) / scored.length
        : 0;
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const best =
      scored.length > 0 ? Math.max(...scored.map((s) => s.score || 0)) : 0;
    return { total, avgScore: Math.round(avgScore), totalTime, best };
  }, [sessions]);

  const getModeIcon = (s: Session) => {
    if (s.mode === "video") return <Video style={{ width: 14, height: 14 }} />;
    if (s.voiceMode) return <Mic style={{ width: 14, height: 14 }} />;
    return <MessageSquare style={{ width: 14, height: 14 }} />;
  };

  const getModeLabel = (s: Session) => {
    if (s.mode === "video") return "Video";
    if (s.voiceMode) return "Voice";
    return "Text";
  };

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

  return (
    <div
      className="animate-fade-up"
      style={{ maxWidth: 1000, margin: "0 auto" }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="text-display" style={{ marginBottom: 8 }}>
          Session History
        </h1>
        <p className="text-body" style={{ color: "var(--text-secondary)" }}>
          Review your past interview sessions and track improvement
        </p>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {[
          {
            label: "Total Sessions",
            value: stats.total,
            icon: Calendar,
            color: "#6366F1",
          },
          {
            label: "Avg Score",
            value: `${stats.avgScore}%`,
            icon: TrendingUp,
            color: "#22C55E",
          },
          {
            label: "Best Score",
            value: `${stats.best}%`,
            icon: Trophy,
            color: "#F59E0B",
          },
          {
            label: "Total Time",
            value: formatDuration(stats.totalTime),
            icon: Clock,
            color: "#3B82F6",
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
                fontSize: 24,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Mode Filter */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <Filter style={{ width: 14, height: 14, color: "var(--text-muted)" }} />
        {(["all", "text", "voice", "video"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "5px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              backgroundColor:
                filter === f
                  ? "rgba(99,102,241,0.15)"
                  : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f ? "rgba(99,102,241,0.3)" : "var(--border-subtle)"}`,
              color: filter === f ? "#818CF8" : "var(--text-secondary)",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {f === "all" ? `All (${sessions.length})` : f}
          </button>
        ))}
      </div>

      {/* Session List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((session, i) => {
          const score = session.score ?? 0;
          const scoreColor = getScoreColor(score);
          const date = new Date(session.createdAt);
          const timeAgo = getTimeAgo(date);

          return (
            <div
              key={session._id}
              onClick={() => router.push(`/interview/${session._id}/report`)}
              className={`stagger-${Math.min(i + 1, 8)}`}
              style={{
                padding: "14px 20px",
                borderRadius: 14,
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
                e.currentTarget.style.borderColor = "var(--border-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-surface)";
                e.currentTarget.style.borderColor = "var(--border-default)";
              }}
            >
              {/* Score circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: `2px solid ${scoreColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  className="font-code"
                  style={{ fontSize: 13, fontWeight: 700, color: scoreColor }}
                >
                  {score > 0 ? score : "—"}
                </span>
              </div>

              {/* Session info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      textTransform: "capitalize",
                    }}
                  >
                    {session.type.replace(/_/g, " ")}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 11,
                      padding: "1px 6px",
                      borderRadius: 4,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {getModeIcon(session)} {getModeLabel(session)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  <span style={{ textTransform: "capitalize" }}>
                    {session.company}
                  </span>
                  <span>·</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {session.difficulty}
                  </span>
                  {session.duration && (
                    <>
                      <span>·</span>
                      <span>{formatDuration(session.duration)}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Time */}
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-disabled)",
                  flexShrink: 0,
                }}
              >
                {timeAgo}
              </span>

              <ChevronRight
                style={{
                  width: 16,
                  height: 16,
                  color: "var(--text-disabled)",
                  flexShrink: 0,
                }}
              />
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <Clock
              style={{
                width: 32,
                height: 32,
                color: "var(--text-disabled)",
                margin: "0 auto 12px",
              }}
            />
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              No sessions yet
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Start an interview to see your history here
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
