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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const categories = [
  {
    id: "arrays",
    name: "Arrays & Strings",
    count: 45,
    icon: Code2,
    color: "bg-blue-500",
  },
  {
    id: "trees",
    name: "Trees & Graphs",
    count: 38,
    icon: Network,
    color: "bg-purple-500",
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    count: 32,
    icon: Code2,
    color: "bg-green-500",
  },
  {
    id: "system-design",
    name: "System Design",
    count: 25,
    icon: Network,
    color: "bg-orange-500",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    count: 40,
    icon: MessageSquare,
    color: "bg-pink-500",
  },
  {
    id: "frontend",
    name: "Frontend",
    count: 30,
    icon: Layout,
    color: "bg-cyan-500",
  },
  {
    id: "backend",
    name: "Backend & APIs",
    count: 28,
    icon: Server,
    color: "bg-red-500",
  },
  {
    id: "sorting",
    name: "Sorting & Searching",
    count: 22,
    icon: Code2,
    color: "bg-indigo-500",
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    count: 18,
    icon: Code2,
    color: "bg-yellow-500",
  },
  {
    id: "stacks-queues",
    name: "Stacks & Queues",
    count: 15,
    icon: Code2,
    color: "bg-emerald-500",
  },
  {
    id: "math",
    name: "Math & Logic",
    count: 20,
    icon: Code2,
    color: "bg-violet-500",
  },
  {
    id: "concurrency",
    name: "Concurrency",
    count: 12,
    icon: Server,
    color: "bg-rose-500",
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

const difficultyColors: Record<string, string> = {
  Easy: "text-green-500 bg-green-500/10",
  Medium: "text-yellow-500 bg-yellow-500/10",
  Hard: "text-red-500 bg-red-500/10",
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
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Question Bank</h1>
        <p className="text-muted-foreground">
          Browse 500+ curated interview questions
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === cat.id ? "border-violet-500" : ""
              }`}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              }
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg ${cat.color} flex items-center justify-center`}
                >
                  <cat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{cat.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {cat.count} questions
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Questions list */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Popular Questions</h2>
        <div className="space-y-2">
          {filtered.map((q, i) => (
            <motion.div
              key={q.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-sm transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{q.title}</span>
                      <Badge
                        className={`text-xs ${difficultyColors[q.difficulty] || ""}`}
                        variant="outline"
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {q.category}
                      </Badge>
                      {q.companies.slice(0, 3).map((c) => (
                        <span key={c} className="text-xs text-muted-foreground">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Practice
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
