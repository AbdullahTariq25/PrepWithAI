"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Target,
  DollarSign,
  Play,
  CheckCircle2,
  Building2,
  Users,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  BookOpen,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { COMPANY_PACKS } from "@/lib/constants";

function formatSalary(min: number, max: number, currency: string): string {
  if (currency === "PKR")
    return `PKR ${(min / 1000).toFixed(0)}K – ${(max / 1000).toFixed(0)}K`;
  if (currency === "USD/hr") return `$${min}/hr – $${max}/hr`;
  return `$${(min / 1000).toFixed(0)}K – $${(max / 1000).toFixed(0)}K`;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : (params?.slug ?? "");

  const company = COMPANY_PACKS.find((c) => c.id === slug);

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 bg-[#080808]">
        <Building2 className="w-16 h-16 text-[#888] mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Company Not Found</h1>
        <p className="text-[#888] mb-4">
          This company prep pack doesn&apos;t exist yet.
        </p>
        <Link href="/companies">
          <Button variant="outline">← Back to Companies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 bg-[#080808]">
      <Link
        href="/companies"
        className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start gap-6"
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shrink-0"
          style={{ backgroundColor: company.color }}
        >
          {company.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <Badge variant="outline" className="capitalize">
              {company.region.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-[#888] text-lg mb-4">{company.description}</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">
                {formatSalary(
                  company.avgSalary.min,
                  company.avgSalary.max,
                  company.avgSalary.currency,
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#888]">
              <Target className="w-4 h-4" />
              {company.rounds.length} interview rounds
            </div>
          </div>
        </div>
        <Button
          size="lg"
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 shrink-0"
          onClick={() => router.push(`/interview?company=${company.id}`)}
        >
          <Play className="w-4 h-4" /> Start Prep
        </Button>
      </motion.div>

      {/* Culture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> Company Culture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#888] leading-relaxed">{company.culture}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interview Format */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Interview Format
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-[#888] mb-4">
              {company.interviewFormat}
            </p>
            <Separator className="my-4" />
            <div className="space-y-4">
              {company.rounds.map((round, i) => (
                <div key={round.name} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
                      {i + 1}
                    </div>
                    {i < company.rounds.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{round.name}</h3>
                      <Badge variant="secondary" className="text-[10px]">
                        {round.duration}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize"
                      >
                        {round.focus}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#888]">{round.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {company.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-[#888]">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Prep Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-linear-to-br from-indigo-500/10 to-violet-500/10 border-indigo-500/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" /> Quick Start Prep
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {["dsa", "system_design", "behavioral"].map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  className="justify-between h-auto py-3 text-left"
                  onClick={() =>
                    router.push(`/interview?type=${type}&company=${company.id}`)
                  }
                >
                  <span className="capitalize">{type.replace(/_/g, " ")}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Salary Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Salary Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#888]">
                  {company.avgSalary.currency === "PKR"
                    ? `PKR ${(company.avgSalary.min / 1000).toFixed(0)}K`
                    : `$${(company.avgSalary.min / 1000).toFixed(0)}K`}
                </div>
                <div className="text-xs text-[#888] mt-1">Entry Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">
                  {company.avgSalary.currency === "PKR"
                    ? `PKR ${((company.avgSalary.min + company.avgSalary.max) / 2 / 1000).toFixed(0)}K`
                    : `$${((company.avgSalary.min + company.avgSalary.max) / 2 / 1000).toFixed(0)}K`}
                </div>
                <div className="text-xs text-[#888] mt-1">Mid-Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-400">
                  {company.avgSalary.currency === "PKR"
                    ? `PKR ${(company.avgSalary.max / 1000).toFixed(0)}K`
                    : `$${(company.avgSalary.max / 1000).toFixed(0)}K`}
                </div>
                <div className="text-xs text-[#888] mt-1">Senior Level</div>
              </div>
            </div>
            <div className="mt-4 h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500/60 via-emerald-500 to-indigo-500 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
