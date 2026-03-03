"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Brain,
  MessageSquare,
  Trophy,
  Flame,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  ArrowRight,
  Code2,
  Network,
  Sparkles,
  Zap,
  Calendar,
  Video,
  Mic,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getEloLevel, formatDuration, getPercentile } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─── Motivational Lines ─── */
const motivationalLines = [
  "Your consistency is your competitive advantage.",
  "The developer who practices daily beats the one who crams weekly.",
  "One session today is worth three sessions the night before the interview.",
  "Your next interview is closer than you think. Let us prepare for it.",
  "Every session you complete is an investment in your future salary.",
  "Great engineers are not born — they are practiced.",
  "The compound effect of daily practice is unstoppable.",
  "You are building muscle memory for technical interviews.",
  "Each question you solve makes the next one easier.",
  "Confidence comes from preparation, not luck.",
  "Today's practice is tomorrow's perfect answer.",
  "The best time to prepare was yesterday. The next best is right now.",
  "You are one session closer to your dream job.",
  "Consistency defeats talent when talent does not practice.",
  "Small daily improvements lead to staggering long-term results.",
  "Your future self will thank you for this session.",
  "Interview skills are muscles — train them daily.",
  "The gap between where you are and where you want to be is practice.",
  "Every expert was once a beginner who refused to give up.",
  "You do not rise to the level of your goals — you fall to the level of your systems.",
  "Master the fundamentals and the rest follows.",
  "Pressure is a privilege — it means you are aiming high.",
  "The harder the interview, the better the offer.",
  "Think of each session as compound interest for your career.",
  "Your dedication to practice sets you apart from 90% of candidates.",
  "Embrace the discomfort — that is where growth happens.",
  "You are not just preparing for an interview — you are leveling up as an engineer.",
  "Progress, not perfection.",
  "Show up. Do the work. Trust the process.",
  "Every rejection gets you closer to the right yes.",
];

function getGreeting(name: string): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 12) return { text: `Good morning, ${name}`, emoji: "🌅" };
  if (h < 17) return { text: `Good afternoon, ${name}`, emoji: "☀️" };
  if (h < 21) return { text: `Good evening, ${name}`, emoji: "🌆" };
  return { text: `Still grinding, ${name}?`, emoji: "🔥" };
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/* ─── Companies ─── */
const companies = [
  { name: "Google", slug: "google", color: "#4285F4", letter: "G" },
  { name: "Meta", slug: "meta", color: "#0668E1", letter: "M" },
  { name: "Amazon", slug: "amazon", color: "#FF9900", letter: "A" },
  { name: "Microsoft", slug: "microsoft", color: "#00A4EF", letter: "M" },
  { name: "Stripe", slug: "stripe", color: "#635BFF", letter: "S" },
  { name: "Apple", slug: "apple", color: "#A2AAAD", letter: "A" },
  {
    name: "Systems Limited",
    slug: "systems_limited",
    color: "#0066CC",
    letter: "S",
  },
  { name: "Techlogix", slug: "techlogix", color: "#FF6B35", letter: "T" },
  { name: "10Pearls", slug: "10pearls", color: "#00B4D8", letter: "10" },
];

/* ─── Interfaces ─── */
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

/* ─── RayCard Component ─── */
function RayCard({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Score Trend Chart Tooltip ─── */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <div
      style={{
        background: "rgba(15,15,15,0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border-default)",
        borderRadius: 10,
        padding: "10px 14px",
      }}
    >
      <div
        style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          {score}%
        </span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [recentSessions, setRecentSessions] = useState<SessionItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const greeting = useMemo(() => getGreeting(firstName), [firstName]);
  const dailyQuote = useMemo(
    () => motivationalLines[getDayOfYear() % motivationalLines.length],
    [],
  );

  const eloRating = progress?.eloRating ?? 1200;
  const eloLevel = useMemo(() => getEloLevel(eloRating), [eloRating]);
  const totalSessions = progress?.totalSessions ?? 0;
  const avgScore = progress?.avgScore ?? 0;
  const streak = progress?.streak ?? 0;
  const weeklyGoal = progress?.weeklyGoal ?? 5;
  const sessionsThisWeek = progress?.sessionsThisWeek ?? 0;
  const weeklyPct = Math.min(
    100,
    Math.round((sessionsThisWeek / weeklyGoal) * 100),
  );
  const percentile = useMemo(() => getPercentile(avgScore), [avgScore]);

  const chartData = useMemo(() => {
    const scores = progress?.dailyScores ?? [];
    return scores.slice(-30).map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: d.score,
    }));
  }, [progress?.dailyScores]);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="page-enter">
      {/* ─── Greeting ─── */}
      <div style={{ marginBottom: 32 }} className="animate-fade-up">
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {greeting.text} {greeting.emoji}
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            marginTop: 6,
            fontStyle: "italic",
          }}
        >
          &ldquo;{dailyQuote}&rdquo;
        </p>
      </div>

      {/* ─── Hero Stats Row ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 16,
        }}
        className="stagger"
      >
        {/* Total Sessions */}
        <RayCard style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "rgba(59,130,246,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare
                style={{ width: 18, height: 18, color: "#60A5FA" }}
              />
            </div>
            <span
              className="text-caption"
              style={{ color: "var(--text-secondary)" }}
            >
              Total Sessions
            </span>
          </div>
          <div
            className="font-code"
            style={{
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {totalSessions}
          </div>
        </RayCard>

        {/* Average Score */}
        <RayCard style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor:
                  avgScore >= 80
                    ? "rgba(34,197,94,0.1)"
                    : avgScore >= 60
                      ? "rgba(245,158,11,0.1)"
                      : "rgba(239,68,68,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp
                style={{
                  width: 18,
                  height: 18,
                  color:
                    avgScore >= 80
                      ? "#22C55E"
                      : avgScore >= 60
                        ? "#F59E0B"
                        : "#EF4444",
                }}
              />
            </div>
            <span
              className="text-caption"
              style={{ color: "var(--text-secondary)" }}
            >
              Average Score
            </span>
          </div>
          <div
            className="font-code"
            style={{
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1,
              color:
                avgScore >= 80
                  ? "#22C55E"
                  : avgScore >= 60
                    ? "#F59E0B"
                    : avgScore > 0
                      ? "#EF4444"
                      : "var(--text-primary)",
            }}
          >
            {avgScore > 0 ? `${avgScore}%` : "—"}
          </div>
        </RayCard>

        {/* Current Streak */}
        <RayCard style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "rgba(249,115,22,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flame style={{ width: 18, height: 18, color: "#FB923C" }} />
            </div>
            <span
              className="text-caption"
              style={{ color: "var(--text-secondary)" }}
            >
              Current Streak
            </span>
          </div>
          {streak > 0 ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span
                style={{
                  fontSize: 20,
                  animation: "fire-pulse 1s ease-in-out infinite",
                }}
              >
                🔥
              </span>
              <span
                className="font-code"
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "#FB923C",
                }}
              >
                {streak}d
              </span>
            </div>
          ) : (
            <div>
              <span
                className="font-code"
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "var(--text-muted)",
                }}
              >
                0d
              </span>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                Start a streak today
              </p>
            </div>
          )}
        </RayCard>

        {/* ELO Rating */}
        <RayCard style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "rgba(99,102,241,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap style={{ width: 18, height: 18, color: "#818CF8" }} />
            </div>
            <span
              className="text-caption"
              style={{ color: "var(--text-secondary)" }}
            >
              ELO Rating
            </span>
          </div>
          <div
            className="font-code"
            style={{
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1,
              color: "#818CF8",
            }}
          >
            {eloRating}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Top {100 - percentile}% of users · {eloLevel.name}
          </p>
        </RayCard>
      </div>

      {/* ─── Weekly Target ─── */}
      <div className="animate-fade-up stagger-5" style={{ marginBottom: 24 }}>
        <RayCard style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Target style={{ width: 16, height: 16, color: "#818CF8" }} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                Weekly Target
              </span>
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {weeklyPct}%
            </span>
          </div>
          <div
            style={{
              position: "relative",
              height: 8,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              className="bar-fill-animate"
              style={{
                height: "100%",
                width: `${weeklyPct}%`,
                borderRadius: 999,
                background:
                  weeklyPct >= 100
                    ? "linear-gradient(90deg, #22C55E, #4ADE80)"
                    : "linear-gradient(90deg, #6366F1, #818CF8)",
                transition: "width 600ms ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              fontSize: 12,
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              {sessionsThisWeek} of {weeklyGoal} sessions this week
            </span>
            {weeklyPct >= 100 && (
              <span style={{ color: "#22C55E" }}>Weekly goal achieved! 🎉</span>
            )}
          </div>
        </RayCard>
      </div>

      {/* ─── Score Trend Chart ─── */}
      <div className="animate-fade-up stagger-6" style={{ marginBottom: 24 }}>
        <RayCard style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                30-Day Score Trend
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                Your performance over the last 30 days
              </p>
            </div>
          </div>
          {chartData.length > 0 ? (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(99,102,241,0.30)" />
                      <stop offset="100%" stopColor="rgba(99,102,241,0.00)" />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#525252", fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#525252", fontSize: 11 }}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={false} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#6366F1",
                      stroke: "#fff",
                      strokeWidth: 1,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                height: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", zIndex: 2 }}>
                <Brain
                  style={{
                    width: 32,
                    height: 32,
                    color: "var(--text-muted)",
                    margin: "0 auto 12px",
                  }}
                />
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Complete your first interview
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginBottom: 16,
                  }}
                >
                  to see your score trend here
                </p>
                <Link href="/interview">
                  <Button
                    style={{
                      background: "#6366F1",
                      color: "white",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Start First Interview →
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </RayCard>
      </div>

      {/* ─── Company Readiness ─── */}
      <div className="animate-fade-up stagger-7" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
              Company Readiness
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginTop: 2,
              }}
            >
              Based on your recent sessions per company
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 8,
            scrollSnapType: "x mandatory",
          }}
        >
          {companies.map((c) => (
            <Link
              key={c.slug}
              href={`/interview?company=${c.slug}`}
              style={{
                textDecoration: "none",
                flexShrink: 0,
                scrollSnapAlign: "start",
              }}
            >
              <div
                style={{
                  width: 160,
                  height: 130,
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 14,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 200ms ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-default)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: c.color + "20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: c.color,
                  }}
                >
                  {c.letter}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {c.name}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Practice →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Recent Activity ─── */}
      <div className="animate-fade-up stagger-8" style={{ marginBottom: 24 }}>
        <RayCard style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Clock style={{ width: 16, height: 16, color: "#818CF8" }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                Recent Activity
              </h2>
            </div>
            {recentSessions.length > 0 && (
              <Link href="/history">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-[#909090] hover:text-white"
                  aria-label="View all sessions"
                >
                  View all <ArrowRight style={{ width: 14, height: 14 }} />
                </Button>
              </Link>
            )}
          </div>
          {recentSessions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {recentSessions.map((s) => {
                const scoreColor =
                  s.overallScore >= 80
                    ? "#22C55E"
                    : s.overallScore >= 60
                      ? "#F59E0B"
                      : "#EF4444";
                const scoreBg =
                  s.overallScore >= 80
                    ? "rgba(34,197,94,0.12)"
                    : s.overallScore >= 60
                      ? "rgba(245,158,11,0.12)"
                      : "rgba(239,68,68,0.12)";
                const companyInfo = companies.find(
                  (c) => c.slug === s.company,
                ) ?? {
                  color: "#6366F1",
                  letter: s.company?.[0]?.toUpperCase() ?? "?",
                };
                return (
                  <Link
                    key={s._id}
                    href={`/interview/${s._id}/report`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "background-color 150ms ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--bg-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          backgroundColor: companyInfo.color + "20",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          color: companyInfo.color,
                          flexShrink: 0,
                        }}
                      >
                        {companyInfo.letter}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            textTransform: "capitalize",
                            color: "var(--text-primary)",
                          }}
                        >
                          {s.type.replace(/_/g, " ")}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            textTransform: "capitalize",
                          }}
                        >
                          {s.company} · {s.difficulty} ·{" "}
                          {formatDuration(s.duration)}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "4px 12px",
                          borderRadius: 999,
                          backgroundColor: scoreBg,
                          color: scoreColor,
                          fontSize: 14,
                          fontWeight: 700,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {s.overallScore || 0}/100
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 0",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Brain
                  style={{ width: 28, height: 28, color: "var(--text-muted)" }}
                />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "var(--text-primary)",
                }}
              >
                No sessions yet
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 16,
                }}
              >
                Your first interview is 2 minutes away
              </p>
              <Link href="/interview">
                <Button
                  style={{
                    background: "#6366F1",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Sparkles style={{ width: 16, height: 16, marginRight: 8 }} />{" "}
                  Start Practicing →
                </Button>
              </Link>
            </div>
          )}
        </RayCard>
      </div>

      {/* ─── Quick Start / Jump Right In ─── */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{ fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 14 }}
        >
          Jump Right In
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
          }}
          className="stagger"
        >
          {/* Voice Interview */}
          <Link
            href="/interview?mode=voice&company=google&type=dsa"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.06), rgba(34,197,94,0.02))",
                border: "1px solid rgba(34,197,94,0.12)",
                padding: 24,
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(34,197,94,0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(34,197,94,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(34,197,94,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Mic style={{ width: 22, height: 22, color: "#22C55E" }} />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                Voice Interview
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Practice speaking your answers out loud
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Google", "DSA", "Medium"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 6,
                      backgroundColor: "rgba(34,197,94,0.08)",
                      color: "#22C55E",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          {/* Video Interview */}
          <Link
            href="/interview?mode=video&company=amazon&type=behavioral"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(59,130,246,0.02))",
                border: "1px solid rgba(59,130,246,0.12)",
                padding: 24,
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(59,130,246,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Video style={{ width: 22, height: 22, color: "#3B82F6" }} />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                Video Interview
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Full webcam experience with AI avatar
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Amazon", "Behavioral", "All Levels"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 6,
                      backgroundColor: "rgba(59,130,246,0.08)",
                      color: "#3B82F6",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          {/* Daily Challenge */}
          <Link href="/daily" style={{ textDecoration: "none" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02))",
                border: "1px solid rgba(245,158,11,0.12)",
                padding: 24,
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(245,158,11,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Flame style={{ width: 22, height: 22, color: "#F59E0B" }} />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                Daily Challenge
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Today&apos;s featured question — refreshes at midnight
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Featured", "Random Category"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 6,
                      backgroundColor: "rgba(245,158,11,0.08)",
                      color: "#F59E0B",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          {/* Custom Interview */}
          <Link href="/interview" style={{ textDecoration: "none" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(99,102,241,0.02))",
                border: "1px solid rgba(99,102,241,0.12)",
                padding: 24,
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(99,102,241,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Settings2
                  style={{ width: 22, height: 22, color: "#6366F1" }}
                />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                Custom Interview
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Choose your company, type, and difficulty
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["20+ Companies", "12 Interview Types"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 6,
                      backgroundColor: "rgba(99,102,241,0.08)",
                      color: "#6366F1",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
