"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const companies = [
  {
    id: "google",
    name: "Google",
    logo: "🔍",
    style:
      "Structured interviews with emphasis on algorithms, system design, and Googleyness (culture fit).",
    rounds: ["Phone Screen", "Coding (x2)", "System Design", "Behavioral"],
    tips: [
      "Focus on optimal solutions",
      "Think out loud",
      "Ask clarifying questions",
    ],
    difficulty: "Hard",
    color: "from-blue-500 to-green-500",
  },
  {
    id: "meta",
    name: "Meta",
    logo: "🌐",
    style:
      "Fast-paced with emphasis on coding speed, system design at scale, and Move Fast culture.",
    rounds: ["Phone Screen", "Coding (x2)", "System Design", "Behavioral"],
    tips: [
      "Practice speed coding",
      "Know distributed systems",
      "Show initiative examples",
    ],
    difficulty: "Hard",
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "📦",
    style:
      "Heavy focus on Leadership Principles. Every answer should tie back to an LP.",
    rounds: ["Online Assessment", "Phone Screen", "Loop (4-5 rounds)"],
    tips: [
      "Memorize all 16 LPs",
      "Use STAR method religiously",
      "Prepare 2 stories per LP",
    ],
    difficulty: "Hard",
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "apple",
    name: "Apple",
    logo: "🍎",
    style:
      "Deep technical knowledge plus creativity. They value craftsmanship and attention to detail.",
    rounds: ["Phone Screen", "Technical Deep-Dive", "Design", "Team Match"],
    tips: [
      "Know your domain deeply",
      "Show passion for quality",
      "Prepare portfolio examples",
    ],
    difficulty: "Hard",
    color: "from-gray-500 to-zinc-600",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "🪟",
    style:
      "Practical problem-solving with growth mindset assessment. Less trick questions, more real-world.",
    rounds: [
      "Phone Screen",
      "Coding",
      "System Design",
      "Behavioral + Hiring Manager",
    ],
    tips: [
      "Show growth mindset",
      "Focus on clean code",
      "Demonstrate collaboration",
    ],
    difficulty: "Medium",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "💳",
    style:
      "Practical backend/API design focus. Clean code and attention to edge cases matter most.",
    rounds: ["Phone Screen", "Practical Coding", "API Design", "Behavioral"],
    tips: [
      "Write production-quality code",
      "Handle all edge cases",
      "Know REST & API design",
    ],
    difficulty: "Hard",
    color: "from-violet-500 to-indigo-500",
  },
];

export default function CompaniesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Company Prep Packs</h1>
        <p className="text-muted-foreground">
          Curated preparation guides for top tech companies
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {companies.map((company, i) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${company.color} flex items-center justify-center text-2xl`}
                    >
                      {company.logo}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{company.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {company.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{company.style}</p>

                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Target className="w-4 h-4 text-violet-500" /> Interview
                    Rounds
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {company.rounds.map((round) => (
                      <Badge
                        key={round}
                        variant="secondary"
                        className="text-xs"
                      >
                        {round}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <MessageSquare className="w-4 h-4 text-violet-500" /> Top
                    Tips
                  </div>
                  <ul className="space-y-1">
                    {company.tips.map((tip) => (
                      <li
                        key={tip}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-violet-500 mt-1">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/interview?company=${company.id}`}>
                  <Button className="w-full gap-2 mt-2">
                    Practice for {company.name}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
