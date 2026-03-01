"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Clock,
  Trophy,
  Zap,
  Code2,
  Brain,
  ChevronRight,
  Play,
  CheckCircle,
  Lock,
  Star,
  Timer,
  Users,
} from "lucide-react";

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  type: "coding" | "behavioral" | "system-design" | "quiz";
  timeLimit: number;
  points: number;
  completedBy: number;
  isCompleted: boolean;
  isLocked: boolean;
}

const MOCK_CHALLENGES: DailyChallenge[] = [
  {
    id: "1",
    title: "Two Sum",
    description:
      "Given an array of integers and a target, find two numbers that add up to the target.",
    difficulty: "easy",
    category: "Arrays & Hashing",
    type: "coding",
    timeLimit: 15,
    points: 50,
    completedBy: 1243,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "2",
    title: "Tell Me About Yourself",
    description:
      "Craft a compelling 2-minute response to this classic interview opener.",
    difficulty: "easy",
    category: "Behavioral",
    type: "behavioral",
    timeLimit: 10,
    points: 30,
    completedBy: 2891,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "3",
    title: "Design a URL Shortener",
    description: "Design a scalable URL shortening service like bit.ly.",
    difficulty: "medium",
    category: "System Design",
    type: "system-design",
    timeLimit: 30,
    points: 100,
    completedBy: 456,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "4",
    title: "JavaScript Trivia",
    description:
      "Test your knowledge of JavaScript closures, prototypes, and async patterns.",
    difficulty: "medium",
    category: "JavaScript",
    type: "quiz",
    timeLimit: 5,
    points: 40,
    completedBy: 1567,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "5",
    title: "Binary Tree Level Order Traversal",
    description: "Return the level order traversal of a binary tree as arrays.",
    difficulty: "medium",
    category: "Trees",
    type: "coding",
    timeLimit: 20,
    points: 75,
    completedBy: 789,
    isCompleted: false,
    isLocked: true,
  },
  {
    id: "6",
    title: "Design a Chat System",
    description:
      "Design a real-time messaging platform supporting 1:1 and group chats.",
    difficulty: "hard",
    category: "System Design",
    type: "system-design",
    timeLimit: 45,
    points: 150,
    completedBy: 234,
    isCompleted: false,
    isLocked: true,
  },
];

const difficultyConfig = {
  easy: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
  },
  medium: {
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
  },
  hard: {
    color: "text-red-400",
    bg: "bg-red-500/20",
    border: "border-red-500/30",
  },
};

const typeIcons: Record<string, React.ReactNode> = {
  coding: <Code2 className="w-4 h-4" />,
  behavioral: <Brain className="w-4 h-4" />,
  "system-design": <Zap className="w-4 h-4" />,
  quiz: <Star className="w-4 h-4" />,
};

export default function DailyChallengePage() {
  const [challenges] = useState<DailyChallenge[]>(MOCK_CHALLENGES);
  const [selectedChallenge, setSelectedChallenge] =
    useState<DailyChallenge | null>(null);
  const [streak] = useState(7);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const completedCount = challenges.filter((c) => c.isCompleted).length;
  const totalPoints = challenges
    .filter((c) => c.isCompleted)
    .reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 page-enter bg-[#080808]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            Daily Challenges
          </h1>
          <p className="text-[#888] mt-1">
            Complete challenges daily to maintain your streak
          </p>
        </div>
        <div className="flex items-center gap-2 text-[#888]">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            New challenges in:{" "}
            <span className="text-white font-mono">{timeLeft}</span>
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 slide-up-stagger">
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 premium-card">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-sm">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{streak} days</p>
          <p className="text-xs text-[#666] mt-1">Keep it going!</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Today&apos;s Progress</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {completedCount}/{challenges.length}
          </p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
            <div
              className="h-1.5 rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${(completedCount / challenges.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">Points Earned</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalPoints}</p>
          <p className="text-xs text-[#666] mt-1">Today&apos;s total</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Star className="w-4 h-4" />
            <span className="text-sm">Best Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">21 days</p>
          <p className="text-xs text-[#666] mt-1">Personal record</p>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-4">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          Streak History (Last 30 Days)
        </h3>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: 30 }, (_, i) => {
            const isActive = i >= 30 - streak;
            const isToday = i === 29;
            return (
              <div
                key={i}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition-colors ${
                  isToday
                    ? "border-2 border-orange-500 bg-orange-500/20 text-orange-400"
                    : isActive
                      ? "bg-orange-500/30 text-orange-400"
                      : "bg-white/5 text-[#555]"
                }`}
              >
                {isActive ? "🔥" : "·"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge, index) => {
          const diff = difficultyConfig[challenge.difficulty];
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all group premium-card ${
                challenge.isLocked ? "opacity-60" : "cursor-pointer"
              } ${challenge.isCompleted ? "border-emerald-500/30" : ""}`}
              onClick={() =>
                !challenge.isLocked && setSelectedChallenge(challenge)
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${diff.bg}`}>
                  {challenge.isLocked ? (
                    <Lock className={`w-4 h-4 ${diff.color}`} />
                  ) : challenge.isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    typeIcons[challenge.type]
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${diff.bg} ${diff.color}`}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className="text-xs text-indigo-400 font-medium">
                    +{challenge.points}pts
                  </span>
                </div>
              </div>

              <h3 className="text-white font-semibold mb-1 group-hover:text-indigo-400 transition-colors">
                {challenge.title}
              </h3>
              <p className="text-[#888] text-sm mb-3 line-clamp-2">
                {challenge.description}
              </p>

              <div className="flex items-center justify-between text-xs text-[#666]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {challenge.timeLimit}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {challenge.completedBy.toLocaleString()}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full ${diff.bg} ${diff.color}`}
                >
                  {challenge.category}
                </span>
              </div>

              {!challenge.isLocked && !challenge.isCompleted && (
                <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                  <Play className="w-3 h-3" />
                  Start Challenge
                </button>
              )}

              {challenge.isCompleted && (
                <div className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </div>
              )}

              {challenge.isLocked && (
                <div className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-white/5 text-[#666] rounded-lg text-sm">
                  <Lock className="w-3 h-3" />
                  Complete previous to unlock
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] rounded-xl border border-white/10 w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedChallenge.title}
                  </h2>
                  <p className="text-[#888] text-sm mt-1">
                    {selectedChallenge.category}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${difficultyConfig[selectedChallenge.difficulty].bg} ${difficultyConfig[selectedChallenge.difficulty].color}`}
                >
                  {selectedChallenge.difficulty}
                </span>
              </div>

              <p className="text-[#ccc] mb-4">
                {selectedChallenge.description}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <Timer className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <p className="text-white text-sm font-medium">
                    {selectedChallenge.timeLimit}m
                  </p>
                  <p className="text-xs text-[#666]">Time Limit</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-white text-sm font-medium">
                    {selectedChallenge.points}
                  </p>
                  <p className="text-xs text-[#666]">Points</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-white text-sm font-medium">
                    {selectedChallenge.completedBy}
                  </p>
                  <p className="text-xs text-[#666]">Completed</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="flex-1 py-2.5 bg-white/5 text-[#888] rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
