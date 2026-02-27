"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Code2,
  Network,
  MessageSquare,
  Layout,
  Server,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const categories = [
  {
    id: "arrays",
    name: "Arrays & Strings",
    count: 45,
    icon: Code2,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "trees",
    name: "Trees & Graphs",
    count: 38,
    icon: Network,
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    count: 32,
    icon: Code2,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "system-design",
    name: "System Design",
    count: 25,
    icon: Network,
    gradient: "from-orange-500 to-amber-500",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    count: 40,
    icon: MessageSquare,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "frontend",
    name: "Frontend",
    count: 30,
    icon: Layout,
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "backend",
    name: "Backend & APIs",
    count: 28,
    icon: Server,
    gradient: "from-red-500 to-pink-500",
  },
  {
    id: "sorting",
    name: "Sorting & Searching",
    count: 22,
    icon: Code2,
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    count: 18,
    icon: Code2,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    id: "stacks-queues",
    name: "Stacks & Queues",
    count: 15,
    icon: Code2,
    gradient: "from-emerald-500 to-green-500",
  },
  {
    id: "math",
    name: "Math & Logic",
    count: 20,
    icon: Code2,
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "concurrency",
    name: "Concurrency",
    count: 12,
    icon: Server,
    gradient: "from-rose-500 to-red-500",
  },
];

const sampleQuestions = [
  {
    title: "Two Sum",
    category: "Arrays",
    difficulty: "Easy",
    companies: ["Google", "Amazon", "Meta"],
  },
  {
    title: "LRU Cache",
    category: "Design",
    difficulty: "Medium",
    companies: ["Amazon", "Microsoft"],
  },
  {
    title: "Merge K Sorted Lists",
    category: "Linked Lists",
    difficulty: "Hard",
    companies: ["Google", "Meta"],
  },
  {
    title: "Design a URL Shortener",
    category: "System Design",
    difficulty: "Medium",
    companies: ["Stripe", "Meta"],
  },
  {
    title: "Tell me about a time you disagreed with your manager",
    category: "Behavioral",
    difficulty: "Medium",
    companies: ["Amazon"],
  },
  {
    title: "Implement Virtual DOM Diffing",
    category: "Frontend",
    difficulty: "Hard",
    companies: ["Meta", "Google"],
  },
];

const difficultyBorder: Record<string, string> = {
  Easy: "border-l-green-500",
  Medium: "border-l-amber-500",
  Hard: "border-l-red-500",
};

const difficultyText: Record<string, string> = {
  Easy: "text-green-400 bg-green-500/10",
  Medium: "text-amber-400 bg-amber-500/10",
  Hard: "text-red-400 bg-red-500/10",
};

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = sampleQuestions.filter((q) => {
    if (search) {
      const s = search.toLowerCase();
      return (
        q.title.toLowerCase().includes(s) ||
        q.category.toLowerCase().includes(s)
      );
    }
    if (selectedCategory) {
      return q.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 page-enter bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
        <p className="text-[#888] text-sm mt-1">
          Browse 500+ curated interview questions
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <Input
            placeholder="Search questions by title or category..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Categories grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
            >
              <div
                className={`bg-[#111] border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:bg-[#131313] group ${
                  selectedCategory === cat.id
                    ? "border-indigo-500/50 bg-indigo-500/5"
                    : "border-white/[0.08] hover:border-white/[0.14]"
                }`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id,
                  )
                }
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center shrink-0`}
                >
                  <cat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{cat.name}</div>
                  <div className="text-xs text-[#555]">
                    {cat.count} questions
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#555] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Questions list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-3">Popular Questions</h2>
        <div className="space-y-2">
          {filtered.map((q, i) => (
            <motion.div
              key={q.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
            >
              <div
                className={`bg-[#111] border border-white/[0.08] rounded-xl p-4 flex items-center gap-4 hover:border-white/[0.14] hover:bg-[#131313] transition-all duration-200 cursor-pointer group border-l-2 ${difficultyBorder[q.difficulty] || "border-l-white/[0.1]"}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-medium text-sm">{q.title}</span>
                    <Badge
                      className={`text-[10px] ${difficultyText[q.difficulty] || ""}`}
                      variant="outline"
                    >
                      {q.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {q.category}
                    </Badge>
                    {q.companies.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="text-[10px] text-[#555] px-1.5 py-0.5 rounded bg-white/[0.04]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity gap-1 text-xs"
                >
                  Practice <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
