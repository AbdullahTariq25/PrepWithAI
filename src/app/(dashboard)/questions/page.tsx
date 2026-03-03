"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Code2,
  Brain,
  Users,
  Layout,
  Server,
  Target,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

interface Question {
  _id: string;
  title: string;
  type: string;
  difficulty: "junior" | "mid" | "senior" | "staff";
  company?: string;
  tags?: string[];
  frequency?: number;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: typeof Code2; color: string }
> = {
  dsa: { label: "DSA", icon: Code2, color: "#22C55E" },
  system_design: { label: "System Design", icon: Server, color: "#6366F1" },
  behavioral: { label: "Behavioral", icon: Users, color: "#F59E0B" },
  frontend: { label: "Frontend", icon: Layout, color: "#3B82F6" },
  backend: { label: "Backend", icon: Server, color: "#8B5CF6" },
  ml_ai: { label: "ML / AI", icon: Brain, color: "#EC4899" },
  product: { label: "Product", icon: Target, color: "#14B8A6" },
};

const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  junior: {
    label: "Junior",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
  },
  mid: {
    label: "Mid",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  senior: {
    label: "Senior",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  },
  staff: {
    label: "Staff+",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
  },
};

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch {
        console.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (search && !q.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (typeFilter !== "all" && q.type !== typeFilter) return false;
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter)
        return false;
      return true;
    });
  }, [questions, search, typeFilter, difficultyFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach((q) => {
      counts[q.type] = (counts[q.type] || 0) + 1;
    });
    return counts;
  }, [questions]);

  const activeFilters =
    (typeFilter !== "all" ? 1 : 0) + (difficultyFilter !== "all" ? 1 : 0);

  const startPractice = (q: Question) => {
    router.push(`/interview?type=${q.type}&company=general`);
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
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="text-display" style={{ marginBottom: 8 }}>
          Question Bank
        </h1>
        <p className="text-body" style={{ color: "var(--text-secondary)" }}>
          {questions.length} curated questions across{" "}
          {Object.keys(typeCounts).length} categories
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}
      >
        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              width: 16,
              height: 16,
              color: "var(--text-muted)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            style={{
              width: "100%",
              padding: "10px 14px 10px 40px",
              borderRadius: 12,
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            borderRadius: 12,
            backgroundColor:
              activeFilters > 0 ? "rgba(99,102,241,0.1)" : "var(--bg-surface)",
            border: `1px solid ${activeFilters > 0 ? "rgba(99,102,241,0.3)" : "var(--border-default)"}`,
            color: activeFilters > 0 ? "#818CF8" : "var(--text-secondary)",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <Filter style={{ width: 16, height: 16 }} />
          Filters
          {activeFilters > 0 && (
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "#6366F1",
                color: "white",
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div
          className="animate-fade-up"
          style={{
            marginBottom: 24,
            padding: 20,
            borderRadius: 16,
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <span
              className="text-label"
              style={{ color: "var(--text-secondary)" }}
            >
              Filters
            </span>
            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setDifficultyFilter("all");
                }}
                style={{
                  fontSize: 12,
                  color: "#818CF8",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Type filters */}
          <div style={{ marginBottom: 16 }}>
            <div
              className="text-caption"
              style={{ color: "var(--text-muted)", marginBottom: 8 }}
            >
              TYPE
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <FilterChip
                label="All"
                active={typeFilter === "all"}
                onClick={() => setTypeFilter("all")}
              />
              {Object.entries(TYPE_CONFIG).map(([key, conf]) => (
                <FilterChip
                  key={key}
                  label={`${conf.label} (${typeCounts[key] || 0})`}
                  active={typeFilter === key}
                  onClick={() => setTypeFilter(key)}
                  color={conf.color}
                />
              ))}
            </div>
          </div>

          {/* Difficulty filters */}
          <div>
            <div
              className="text-caption"
              style={{ color: "var(--text-muted)", marginBottom: 8 }}
            >
              DIFFICULTY
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <FilterChip
                label="All"
                active={difficultyFilter === "all"}
                onClick={() => setDifficultyFilter("all")}
              />
              {Object.entries(DIFFICULTY_CONFIG).map(([key, conf]) => (
                <FilterChip
                  key={key}
                  label={conf.label}
                  active={difficultyFilter === key}
                  onClick={() => setDifficultyFilter(key)}
                  color={conf.color}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div
        style={{ marginBottom: 16, fontSize: 13, color: "var(--text-muted)" }}
      >
        Showing {filtered.length} of {questions.length} questions
      </div>

      {/* Question Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((q, i) => {
          const diff = DIFFICULTY_CONFIG[q.difficulty] || DIFFICULTY_CONFIG.mid;
          const typeConf = TYPE_CONFIG[q.type];
          const TypeIcon = typeConf?.icon || Code2;

          return (
            <div
              key={q._id}
              onClick={() => startPractice(q)}
              className={`stagger-${Math.min(i + 1, 8)}`}
              style={{
                padding: "16px 20px",
                borderRadius: 14,
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                borderLeft: `3px solid ${diff.color}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = diff.border;
                e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.backgroundColor = "var(--bg-surface)";
              }}
            >
              {/* Type icon */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: `${typeConf?.color || "#666"}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <TypeIcon
                  style={{
                    width: 18,
                    height: 18,
                    color: typeConf?.color || "#666",
                  }}
                />
              </div>

              {/* Question info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {q.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: typeConf?.color || "var(--text-muted)",
                    }}
                  >
                    {typeConf?.label || q.type}
                  </span>
                  {q.company && q.company !== "general" && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: "1px 6px",
                        borderRadius: 4,
                        backgroundColor: "rgba(255,255,255,0.05)",
                        color: "var(--text-muted)",
                        textTransform: "capitalize",
                      }}
                    >
                      {q.company}
                    </span>
                  )}
                  {q.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 10,
                        padding: "1px 6px",
                        borderRadius: 4,
                        backgroundColor: "rgba(255,255,255,0.04)",
                        color: "var(--text-disabled)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Difficulty badge */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 8,
                  backgroundColor: diff.bg,
                  color: diff.color,
                  border: `1px solid ${diff.border}`,
                  flexShrink: 0,
                }}
              >
                {diff.label}
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
            <X
              style={{
                width: 32,
                height: 32,
                color: "var(--text-disabled)",
                margin: "0 auto 12px",
              }}
            />
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              No questions found
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Try adjusting your filters
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: active
          ? color
            ? `${color}20`
            : "rgba(99,102,241,0.15)"
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? (color || "#6366F1") + "40" : "var(--border-subtle)"}`,
        color: active ? color || "#818CF8" : "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 150ms ease",
      }}
    >
      {label}
    </button>
  );
}
