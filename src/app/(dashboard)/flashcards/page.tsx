"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Star,
  Check,
  X,
  Brain,
  Layers,
  Sparkles,
  Filter,
} from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  mastered: boolean;
}

const CATEGORIES = [
  "All",
  "JavaScript",
  "React",
  "System Design",
  "Data Structures",
  "Algorithms",
  "Behavioral",
  "SQL",
  "DevOps",
];

const MOCK_FLASHCARDS: Flashcard[] = [
  {
    id: "1",
    front: "What is the difference between == and === in JavaScript?",
    back: '== performs type coercion before comparison (loose equality), while === compares both value and type without coercion (strict equality). Example: "5" == 5 is true, but "5" === 5 is false.',
    category: "JavaScript",
    difficulty: "easy",
    mastered: false,
  },
  {
    id: "2",
    front: "Explain the Virtual DOM in React",
    back: "The Virtual DOM is a lightweight in-memory representation of the real DOM. React creates a virtual DOM tree, and when state changes, it creates a new virtual DOM, diffs it with the previous one (reconciliation), and only updates the changed parts in the real DOM. This minimizes expensive DOM operations.",
    category: "React",
    difficulty: "medium",
    mastered: false,
  },
  {
    id: "3",
    front: "What is a closure in JavaScript?",
    back: "A closure is a function that has access to variables from its outer (enclosing) function scope, even after the outer function has returned. Closures are created every time a function is created. They enable data privacy, factory functions, and module patterns.",
    category: "JavaScript",
    difficulty: "easy",
    mastered: false,
  },
  {
    id: "4",
    front: "Explain CAP Theorem",
    back: "The CAP theorem states that a distributed system can only guarantee 2 of 3 properties simultaneously: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition tolerance (system works despite network partitions). Since partitions are unavoidable, you choose between CP or AP systems.",
    category: "System Design",
    difficulty: "hard",
    mastered: false,
  },
  {
    id: "5",
    front: "What is the time complexity of binary search?",
    back: "O(log n) time complexity and O(1) space complexity for iterative implementation. The search space is halved with each comparison, making it efficient for sorted arrays. Recursive implementation uses O(log n) space for the call stack.",
    category: "Algorithms",
    difficulty: "easy",
    mastered: false,
  },
  {
    id: "6",
    front: "Explain the STAR method for behavioral interviews",
    back: "STAR stands for: Situation (set the context), Task (describe your responsibility), Action (explain what you did), Result (share the outcome with metrics). This framework helps structure behavioral answers clearly and concisely. Always quantify results when possible.",
    category: "Behavioral",
    difficulty: "easy",
    mastered: false,
  },
  {
    id: "7",
    front: "What is a B-Tree and where is it used?",
    back: "A B-Tree is a self-balancing search tree where nodes can have multiple keys and children. Each node can contain m-1 to 2m-1 keys. B-Trees are widely used in databases and file systems because they minimize disk I/O by keeping the tree shallow, allowing large branching factors.",
    category: "Data Structures",
    difficulty: "hard",
    mastered: false,
  },
  {
    id: "8",
    front: "What is the difference between SQL JOIN types?",
    back: "INNER JOIN: returns matching rows from both tables. LEFT JOIN: all rows from left + matching from right (NULLs for non-matching). RIGHT JOIN: all rows from right + matching from left. FULL OUTER JOIN: all rows from both tables. CROSS JOIN: cartesian product of both tables.",
    category: "SQL",
    difficulty: "medium",
    mastered: false,
  },
  {
    id: "9",
    front: "Explain useEffect cleanup in React",
    back: "The cleanup function in useEffect runs before the component unmounts and before the effect re-runs. It is used to prevent memory leaks by cleaning up subscriptions, event listeners, timers, or abort controllers. Return a function from useEffect to define cleanup logic.",
    category: "React",
    difficulty: "medium",
    mastered: false,
  },
  {
    id: "10",
    front: "What is CI/CD?",
    back: "CI (Continuous Integration): automatically building and testing code changes when merged. CD (Continuous Delivery): automatically deploying tested code to staging. CD (Continuous Deployment): automatically deploying to production. Tools: GitHub Actions, Jenkins, CircleCI, GitLab CI.",
    category: "DevOps",
    difficulty: "medium",
    mastered: false,
  },
];

const diffColors = {
  easy: { text: "text-emerald-400", bg: "bg-emerald-500/20" },
  medium: { text: "text-amber-400", bg: "bg-amber-500/20" },
  hard: { text: "text-red-400", bg: "bg-red-500/20" },
};

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>(MOCK_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMastered, setShowMastered] = useState(true);
  const [studyMode, setStudyMode] = useState<"browse" | "study">("browse");

  const filteredCards = cards.filter((c) => {
    if (selectedCategory !== "All" && c.category !== selectedCategory)
      return false;
    if (!showMastered && c.mastered) return false;
    return true;
  });

  const currentCard = filteredCards[currentIndex];
  const masteredCount = cards.filter((c) => c.mastered).length;

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex(
      (prev) => (prev - 1 + filteredCards.length) % filteredCards.length,
    );
  };

  const shuffleCards = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const toggleMastered = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mastered: !c.mastered } : c)),
    );
  };

  const markKnown = () => {
    if (currentCard) {
      toggleMastered(currentCard.id);
      nextCard();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 page-enter bg-[#080808]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            Flashcards
          </h1>
          <p className="text-[#888] mt-1">
            Master interview concepts with spaced repetition
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setStudyMode(studyMode === "browse" ? "study" : "browse")
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              studyMode === "study"
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-[#888] hover:text-white"
            }`}
          >
            <Brain className="w-4 h-4" />
            {studyMode === "study" ? "Exit Study Mode" : "Study Mode"}
          </button>
          <button
            onClick={shuffleCards}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-[#888] rounded-lg hover:text-white hover:bg-white/10 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 slide-up-stagger">
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 premium-card">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Layers className="w-4 h-4" />
            <span className="text-sm">Total Cards</span>
          </div>
          <p className="text-2xl font-bold text-white">{cards.length}</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 premium-card">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Check className="w-4 h-4" />
            <span className="text-sm">Mastered</span>
          </div>
          <p className="text-2xl font-bold text-white">{masteredCount}</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 premium-card">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">To Review</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {cards.length - masteredCount}
          </p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 premium-card">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Mastery</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {Math.round((masteredCount / cards.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-[#666]" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === cat
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "bg-white/5 text-[#888] border border-white/10 hover:border-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => setShowMastered(!showMastered)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            showMastered
              ? "bg-white/5 text-[#888] border border-white/10"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          }`}
        >
          {showMastered ? "Hide Mastered" : "Show Mastered"}
        </button>
      </div>

      {/* Flashcard Display */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="flex flex-col items-center">
          {/* Progress */}
          <div className="w-full max-w-2xl flex items-center justify-between mb-4 text-sm text-[#888]">
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${diffColors[currentCard.difficulty].bg} ${diffColors[currentCard.difficulty].text}`}
              >
                {currentCard.difficulty}
              </span>
              <span className="text-[#666]">{currentCard.category}</span>
            </div>
          </div>

          {/* Card */}
          <div
            className="w-full max-w-2xl perspective-1000 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentCard.id}-${isFlipped ? "back" : "front"}`}
                initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`min-h-75 p-8 rounded-2xl border flex flex-col items-center justify-center text-center ${
                  isFlipped
                    ? "bg-indigo-500/10 border-indigo-500/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <p className="text-xs text-[#666] uppercase tracking-wider mb-4">
                  {isFlipped ? "💡 Answer" : "❓ Question"}
                </p>
                <p
                  className={`text-lg md:text-xl ${isFlipped ? "text-[#ccc]" : "text-white"} leading-relaxed`}
                >
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
                <p className="text-xs text-[#555] mt-6">
                  {isFlipped
                    ? "Click to see question"
                    : "Click to reveal answer"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={prevCard}
              className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-[#888] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {studyMode === "study" ? (
              <>
                <button
                  onClick={nextCard}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                  Don&apos;t Know
                </button>
                <button
                  onClick={markKnown}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Know It
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Flip
                </button>
                <button
                  onClick={() => toggleMastered(currentCard.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors ${
                    currentCard.mastered
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/5 text-[#888] hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${currentCard.mastered ? "fill-emerald-400" : ""}`}
                  />
                  {currentCard.mastered ? "Mastered" : "Mark Mastered"}
                </button>
              </>
            )}

            <button
              onClick={nextCard}
              className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-[#888] hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl mt-6">
            <div className="flex gap-1">
              {filteredCards.map((card, i) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsFlipped(false);
                  }}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    i === currentIndex
                      ? "bg-purple-500"
                      : card.mastered
                        ? "bg-emerald-500/50"
                        : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-[#555] mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No Flashcards Found</h3>
          <p className="text-[#888] text-sm">
            Try changing your filters or category selection.
          </p>
        </div>
      )}
    </div>
  );
}
