"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Layers,
  Loader2,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";

interface FlashcardProgress {
  repetitions: number;
  reviewCount: number;
  retention: number | null;
  intervalDays: number;
  nextReviewAt: string | null;
  lastReviewedAt: string | null;
  lastRating: string | null;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  due: boolean;
  mastered: boolean;
  progress: FlashcardProgress;
}

interface FlashcardResponse {
  flashcards: Flashcard[];
  stats: { due: number; mastered: number; reviewed: number };
  categories: string[];
  error?: string;
}

type Rating = "again" | "hard" | "good" | "easy";

const ratingOptions: Array<{
  value: Rating;
  label: string;
  detail: string;
  className: string;
}> = [
  {
    value: "again",
    label: "Again",
    detail: "Review in ~10 min",
    className: "border-red-400/20 bg-red-400/8 text-red-200 hover:bg-red-400/14",
  },
  {
    value: "hard",
    label: "Hard",
    detail: "Short interval",
    className: "border-amber-400/20 bg-amber-400/8 text-amber-200 hover:bg-amber-400/14",
  },
  {
    value: "good",
    label: "Good",
    detail: "Normal interval",
    className: "border-indigo-400/20 bg-indigo-400/8 text-indigo-200 hover:bg-indigo-400/14",
  },
  {
    value: "easy",
    label: "Easy",
    detail: "Longer interval",
    className: "border-emerald-400/20 bg-emerald-400/8 text-emerald-200 hover:bg-emerald-400/14",
  },
];

function displayCategory(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatNextReview(value: string | null) {
  if (!value) return "New card";
  const date = new Date(value);
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Due now";
  const minutes = Math.ceil(diff / 60_000);
  if (minutes < 60) return `In ${minutes} min`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 48) return `In ${hours} hr`;
  return `In ${Math.ceil(hours / 24)} days`;
}

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({ due: 0, mastered: 0, reviewed: 0 });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dueOnly, setDueOnly] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reviewedThisSession, setReviewedThisSession] = useState(0);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ limit: "50" });
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (dueOnly) params.set("dueOnly", "1");

      const response = await fetch(`/api/flashcards?${params.toString()}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as FlashcardResponse;
      if (!response.ok) throw new Error(data.error || "Unable to load flashcards");

      setCards(data.flashcards || []);
      setStats(data.stats || { due: 0, mastered: 0, reviewed: 0 });
      setCategories(data.categories || []);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load flashcards");
    } finally {
      setLoading(false);
    }
  }, [dueOnly, selectedCategory]);

  useEffect(() => {
    void loadCards();
  }, [loadCards]);

  const currentCard = cards[currentIndex];
  const masteryRate = useMemo(() => {
    if (cards.length === 0) return 0;
    return Math.round((cards.filter((card) => card.mastered).length / cards.length) * 100);
  }, [cards]);

  function move(direction: 1 | -1) {
    if (cards.length === 0) return;
    setCurrentIndex((index) => (index + direction + cards.length) % cards.length);
    setIsFlipped(false);
  }

  async function rateCard(rating: Rating) {
    if (!currentCard || saving) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/flashcards/${currentCard.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to save review");

      setReviewedThisSession((count) => count + 1);
      await loadCards();
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Unable to save review");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7 page-enter">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            Retention workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Spaced repetition</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#858596]">
            Review real question-bank concepts on a schedule that adapts to how well you remember them.
            Your ratings and next-review dates are saved to your account.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[#a8a8b8]">
          <Sparkles className="h-4 w-4 text-violet-300" />
          {reviewedThisSession} reviewed this session
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Loaded cards", value: cards.length, icon: Layers },
          { label: "Due now", value: stats.due, icon: Clock3 },
          { label: "Reviewed", value: stats.reviewed, icon: RotateCcw },
          { label: "Mastery", value: `${masteryRate}%`, icon: Target },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-white/8 bg-[#101016] p-4">
              <div className="flex items-center gap-2 text-xs text-[#747486]">
                <Icon className="h-4 w-4 text-violet-300" /> {item.label}
              </div>
              <div className="mt-3 text-2xl font-semibold">{item.value}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-[#0e0e14] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-[#666678]" />
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              selectedCategory === "all"
                ? "border-violet-400/30 bg-violet-400/10 text-violet-200"
                : "border-white/8 bg-white/4 text-[#89899a] hover:text-white"
            }`}
          >
            All topics
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                selectedCategory === category
                  ? "border-violet-400/30 bg-violet-400/10 text-violet-200"
                  : "border-white/8 bg-white/4 text-[#89899a] hover:text-white"
              }`}
            >
              {displayCategory(category)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setDueOnly((value) => !value)}
          className={`rounded-xl border px-4 py-2 text-sm transition ${
            dueOnly
              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
              : "border-white/8 bg-white/4 text-[#9999aa] hover:text-white"
          }`}
        >
          {dueOnly ? "Showing due cards" : "Showing all cards"}
        </button>
      </div>

      {loading ? (
        <div className="grid min-h-[420px] place-items-center rounded-[28px] border border-white/8 bg-[#0d0d12]">
          <div className="text-center text-sm text-[#88889a]">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-violet-300" />
            Loading your review queue…
          </div>
        </div>
      ) : currentCard ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#737385]">
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 capitalize">
                {currentCard.difficulty}
              </span>
              <span>{displayCategory(currentCard.category)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFlipped((value) => !value)}
            className="group flex min-h-[360px] w-full flex-col items-center justify-center rounded-[30px] border border-white/9 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.10),transparent_42%),#0d0d13] p-7 text-center shadow-2xl shadow-black/20 transition hover:border-violet-400/20 sm:p-12"
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-violet-400/15 bg-violet-400/8 text-violet-300">
              {isFlipped ? <CheckCircle2 className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
              {isFlipped ? "Answer and coaching reference" : "Recall before revealing"}
            </p>
            <div className="mt-5 max-w-3xl text-xl font-medium leading-8 text-[#eeeeF5] sm:text-2xl">
              {isFlipped ? currentCard.back : currentCard.front}
            </div>
            <p className="mt-8 text-xs text-[#666678]">
              {isFlipped ? "Rate how difficult recall felt." : "Think through your answer, then click to reveal."}
            </p>
          </button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-[#747486]">
              <Clock3 className="h-4 w-4" />
              {formatNextReview(currentCard.progress.nextReviewAt)}
              {currentCard.progress.retention !== null && (
                <span>· {currentCard.progress.retention}% retention</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => move(-1)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/4 text-[#9b9bac] hover:bg-white/8 hover:text-white"
                aria-label="Previous card"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => move(1)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/4 text-[#9b9bac] hover:bg-white/8 hover:text-white"
                aria-label="Next card"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isFlipped && (
            <div className="grid gap-2 sm:grid-cols-4">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => void rateCard(option.value)}
                  disabled={saving}
                  className={`rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${option.className}`}
                >
                  <div className="text-sm font-semibold">{option.label}</div>
                  <div className="mt-1 text-[11px] opacity-70">{option.detail}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid min-h-[420px] place-items-center rounded-[28px] border border-white/8 bg-[#0d0d12] p-8 text-center">
          <div className="max-w-md">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">
              {dueOnly ? "Your review queue is clear" : "No flashcards found"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#818192]">
              {dueOnly
                ? "You have no cards due in this filter. Show all cards to study ahead or come back when the scheduler brings them back."
                : "The question bank has no cards for this topic yet."}
            </p>
            {dueOnly && (
              <button
                onClick={() => setDueOnly(false)}
                className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
              >
                Show all cards
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
