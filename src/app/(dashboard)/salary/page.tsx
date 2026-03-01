"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Target,
  Lightbulb,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Briefcase,
  BarChart3,
  Users,
  CheckCircle,
  MessageSquare,
  Shield,
} from "lucide-react";

interface SalaryData {
  role: string;
  company: string;
  level: string;
  location: string;
  base: { low: number; median: number; high: number };
  equity: { low: number; median: number; high: number };
  bonus: { low: number; median: number; high: number };
  total: { low: number; median: number; high: number };
}

const MOCK_SALARY_DATA: SalaryData = {
  role: "Senior Software Engineer",
  company: "FAANG Average",
  level: "L5/E5",
  location: "San Francisco, CA",
  base: { low: 170000, median: 195000, high: 225000 },
  equity: { low: 50000, median: 100000, high: 200000 },
  bonus: { low: 15000, median: 30000, high: 50000 },
  total: { low: 235000, median: 325000, high: 475000 },
};

const NEGOTIATION_TIPS = [
  {
    title: "Never give the first number",
    description:
      "Let the employer make the first offer. If pressed, provide a range based on market research.",
    icon: Shield,
    category: "strategy",
  },
  {
    title: "Use competing offers",
    description:
      "Having multiple offers strengthens your position. Share competing offers strategically.",
    icon: Target,
    category: "leverage",
  },
  {
    title: "Negotiate total compensation",
    description:
      "Beyond base salary, negotiate equity, signing bonus, RSU refresh, and PTO.",
    icon: DollarSign,
    category: "compensation",
  },
  {
    title: "Express enthusiasm first",
    description:
      "Show genuine excitement about the role before negotiating. This keeps the relationship positive.",
    icon: MessageSquare,
    category: "communication",
  },
  {
    title: "Ask for time to consider",
    description:
      "Never accept on the spot. Say 'I'm very excited. Can I have a few days to review the full package?'",
    icon: Lightbulb,
    category: "timing",
  },
  {
    title: "Counter with data",
    description:
      "Back up your ask with market data from Levels.fyi, Glassdoor, or Blind.",
    icon: BarChart3,
    category: "strategy",
  },
];

const SCRIPTS = [
  {
    scenario: "Receiving an initial offer",
    script:
      "Thank you so much for the offer! I'm really excited about the opportunity to join the team. I'd like to take a couple of days to review the full compensation package. Would that be okay?",
  },
  {
    scenario: "Countering the base salary",
    script:
      "I really appreciate the offer. Based on my research and the value I can bring with my experience in [specific skill], I was hoping for a base salary in the range of $X-$Y. Is there flexibility here?",
  },
  {
    scenario: "Negotiating equity",
    script:
      "I'm very interested in the long-term growth of the company. Could we discuss the equity component? I've seen similar roles at this level offer [X shares/RSUs], and I'd love to align on something comparable.",
  },
  {
    scenario: "Using a competing offer",
    script:
      "I want to be transparent — I do have another offer with a total compensation of $X. Your company is my top choice, but I want to make sure the compensation is competitive. Is there room to adjust?",
  },
  {
    scenario: "Negotiating sign-on bonus",
    script:
      "I understand the base salary may be at the top of the band. Would it be possible to bridge the gap with a signing bonus? I'm leaving behind [unvested equity/bonus] at my current company.",
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SalaryNegotiationPage() {
  const [selectedRole, setSelectedRole] = useState("senior-swe");
  const [selectedLocation, setSelectedLocation] = useState("sf");
  const [salaryData] = useState<SalaryData>(MOCK_SALARY_DATA);
  const [currentOffer, setCurrentOffer] = useState("");
  const [targetSalary, setTargetSalary] = useState("");
  const [expandedScript, setExpandedScript] = useState<number | null>(null);

  const offerNum = parseInt(currentOffer.replace(/[^0-9]/g, "")) || 0;
  const targetNum = parseInt(targetSalary.replace(/[^0-9]/g, "")) || 0;
  const gapAmount = targetNum - offerNum;
  const gapPercent =
    offerNum > 0 ? ((gapAmount / offerNum) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 page-enter bg-[#080808]">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
          Salary Negotiation Coach
        </h1>
        <p className="text-[#888] mt-1">
          Data-driven salary negotiation strategies and scripts
        </p>
      </div>

      {/* Salary Calculator */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          Market Salary Data
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-[#888] mb-1 block">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="junior-swe">Junior Software Engineer</option>
              <option value="mid-swe">Software Engineer</option>
              <option value="senior-swe">Senior Software Engineer</option>
              <option value="staff-swe">Staff Engineer</option>
              <option value="principal-swe">Principal Engineer</option>
              <option value="eng-manager">Engineering Manager</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-[#888] mb-1 block">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="sf">San Francisco, CA</option>
              <option value="nyc">New York, NY</option>
              <option value="seattle">Seattle, WA</option>
              <option value="austin">Austin, TX</option>
              <option value="remote">Remote (US)</option>
            </select>
          </div>
        </div>

        {/* Salary Ranges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Base Salary", data: salaryData.base, color: "indigo" },
            { label: "Equity/Year", data: salaryData.equity, color: "purple" },
            { label: "Annual Bonus", data: salaryData.bonus, color: "amber" },
            { label: "Total Comp", data: salaryData.total, color: "emerald" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <p className="text-[#888] text-xs uppercase tracking-wider mb-2">
                {item.label}
              </p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(item.data.median)}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-[#666]">
                  {formatCurrency(item.data.low)}
                </span>
                <div className="flex-1 bg-white/10 rounded-full h-1.5 relative">
                  <div
                    className={`absolute h-1.5 rounded-full ${
                      item.color === "indigo"
                        ? "bg-indigo-500"
                        : item.color === "purple"
                          ? "bg-purple-500"
                          : item.color === "amber"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                    }`}
                    style={{
                      left: "0%",
                      width: `${((item.data.median - item.data.low) / (item.data.high - item.data.low)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[#666]">
                  {formatCurrency(item.data.high)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#555] mt-3 flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          Data based on {salaryData.company} — {salaryData.level} —{" "}
          {salaryData.location}
        </p>
      </div>

      {/* Offer Analysis */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-rose-400" />
          Offer Analysis Calculator
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-[#888] mb-1 block">
              Current Offer (Total Comp)
            </label>
            <input
              type="text"
              value={currentOffer}
              onChange={(e) => setCurrentOffer(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="$280,000"
            />
          </div>
          <div>
            <label className="text-sm text-[#888] mb-1 block">
              Your Target
            </label>
            <input
              type="text"
              value={targetSalary}
              onChange={(e) => setTargetSalary(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="$325,000"
            />
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-[#666] mb-1">Negotiation Gap</p>
            {offerNum > 0 && targetNum > 0 ? (
              <div className="flex items-center gap-2">
                {gapAmount > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span
                  className={`text-lg font-bold ${gapAmount > 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  {formatCurrency(Math.abs(gapAmount))} ({gapPercent}%)
                </span>
              </div>
            ) : (
              <p className="text-[#666] text-sm">Enter both values</p>
            )}
          </div>
        </div>
        {offerNum > 0 && offerNum < salaryData.total.median && (
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-amber-400 text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Your offer is below market median (
              {formatCurrency(salaryData.total.median)}). You have room to
              negotiate!
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Negotiation Tips */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Key Negotiation Strategies
          </h3>
          <div className="space-y-3">
            {NEGOTIATION_TIPS.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
                  <tip.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{tip.title}</p>
                  <p className="text-[#888] text-xs mt-0.5">
                    {tip.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Negotiation Scripts */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            Ready-to-Use Scripts
          </h3>
          <div className="space-y-2">
            {SCRIPTS.map((script, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedScript(expandedScript === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    <span className="text-white text-sm">
                      {script.scenario}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-[#666] transition-transform ${expandedScript === index ? "rotate-90" : ""}`}
                  />
                </button>
                {expandedScript === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-3 pb-3"
                  >
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                      <p className="text-[#ccc] text-sm italic leading-relaxed">
                        &ldquo;{script.script}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Pre-Negotiation Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Researched market rate on Levels.fyi",
            "Know your minimum acceptable offer",
            "Have a target number with justification",
            "Prepared your value proposition",
            "Listed competing offers (if any)",
            "Practiced negotiation scripts",
            "Identified non-salary perks to negotiate",
            "Ready to walk away if needed",
            "Calculated total comp (not just base)",
          ].map((item, i) => (
            <label
              key={i}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-sm text-[#888] hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            >
              <input type="checkbox" className="rounded border-white/20" />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Helpful Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              name: "Levels.fyi",
              desc: "Verified compensation data",
              icon: Users,
            },
            {
              name: "Glassdoor",
              desc: "Salary reviews & company info",
              icon: Building2,
            },
            {
              name: "Blind",
              desc: "Anonymous professional network",
              icon: Shield,
            },
          ].map((resource) => (
            <div
              key={resource.name}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
            >
              <resource.icon className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-white text-sm font-medium">
                  {resource.name}
                </p>
                <p className="text-[#666] text-xs">{resource.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
