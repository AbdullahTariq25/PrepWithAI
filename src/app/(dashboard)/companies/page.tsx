"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageSquare,
  Target,
  Search,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { COMPANY_PACKS } from "@/lib/constants";

const categories = [
  "all",
  "faang",
  "top_startup",
  "pakistan",
  "remote",
] as const;
const categoryLabels: Record<string, string> = {
  all: "All",
  faang: "FAANG+",
  top_startup: "Top Startups",
  pakistan: "Pakistan",
  remote: "Remote",
};

function formatSalary(min: number, max: number, currency: string): string {
  const fmt = (n: number) => {
    if (currency === "PKR") return "PKR " + (n / 1000).toFixed(0) + "K";
    return "$" + (n / 1000).toFixed(0) + "K";
  };
  return fmt(min) + " - " + fmt(max);
}

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = COMPANY_PACKS.filter((company) => {
    if (category !== "all" && company.region !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        company.name.toLowerCase().includes(q) ||
        company.description.toLowerCase().includes(q) ||
        company.culture.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 page-enter bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Company Prep Packs</h1>
        <p className="text-[#888]">
          {COMPANY_PACKS.length} companies with curated prep guides, salary data
          and interview strategies
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
          <Input
            placeholder="Search companies..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((company, i) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.5) }}
          >
            <Card className="h-full hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-150 group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                    style={{ backgroundColor: company.color }}
                  >
                    {company.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold truncate">
                      {company.name}
                    </h3>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {company.region.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-[#888] line-clamp-2">
                  {company.description}
                </p>

                <div className="text-xs text-[#888] bg-white/4 rounded-lg px-3 py-2">
                  {company.interviewFormat}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">
                    {formatSalary(
                      company.avgSalary.min,
                      company.avgSalary.max,
                      company.avgSalary.currency,
                    )}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Target className="w-4 h-4 text-indigo-500" /> Interview
                    Rounds ({company.rounds.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {company.rounds.map((round) => (
                      <Badge
                        key={round.name}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {round.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" /> Top
                    Tips
                  </div>
                  <ul className="space-y-1">
                    {company.tips.slice(0, 3).map((tip) => (
                      <li
                        key={tip}
                        className="text-sm text-[#888] flex items-start gap-2"
                      >
                        <span className="text-indigo-500 mt-0.5 text-xs">
                          &#9656;
                        </span>{" "}
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={"/interview?company=" + company.id}>
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

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#888]">No companies match your search</p>
        </div>
      )}
    </div>
  );
}
