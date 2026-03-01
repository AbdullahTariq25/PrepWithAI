"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  DollarSign,
  ExternalLink,
  Search,
  Building2,
  Globe,
  Bookmark,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface JobListing {
  id: string;
  title: string;
  company: string;
  companyColor: string;
  location: string;
  remote: boolean;
  salary: { min: number; max: number };
  description: string;
  requirements: string[];
  tags: string[];
  matchScore: number;
  postedDaysAgo: number;
  applicationUrl: string;
}

const SAMPLE_JOBS: JobListing[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Google",
    companyColor: "#4285F4",
    location: "Mountain View, CA",
    remote: false,
    salary: { min: 180000, max: 280000 },
    description:
      "Build next-generation web experiences for billions of users. Work on Google Search, Maps, or YouTube frontend.",
    requirements: [
      "5+ years React/TypeScript",
      "System design experience",
      "Performance optimization",
      "Accessibility expertise",
    ],
    tags: ["React", "TypeScript", "Web Performance", "Design Systems"],
    matchScore: 87,
    postedDaysAgo: 2,
    applicationUrl: "#",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "Stripe",
    companyColor: "#635BFF",
    location: "San Francisco, CA",
    remote: true,
    salary: { min: 170000, max: 260000 },
    description:
      "Build financial infrastructure that powers the internet economy. Work on payments, billing, or developer tools.",
    requirements: [
      "4+ years full stack",
      "API design",
      "PostgreSQL",
      "Ruby or Go",
    ],
    tags: ["Node.js", "React", "PostgreSQL", "API Design"],
    matchScore: 82,
    postedDaysAgo: 1,
    applicationUrl: "#",
  },
  {
    id: "3",
    title: "Software Engineer II",
    company: "Meta",
    companyColor: "#0668E1",
    location: "Menlo Park, CA",
    remote: false,
    salary: { min: 160000, max: 240000 },
    description:
      "Join the team building the metaverse. Work on React Native, Instagram, or WhatsApp.",
    requirements: [
      "3+ years experience",
      "Strong DSA fundamentals",
      "Mobile or web experience",
    ],
    tags: ["React Native", "JavaScript", "Mobile", "Scalability"],
    matchScore: 78,
    postedDaysAgo: 3,
    applicationUrl: "#",
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "Amazon",
    companyColor: "#FF9900",
    location: "Seattle, WA",
    remote: false,
    salary: { min: 150000, max: 230000 },
    description:
      "Build highly available distributed systems at Amazon scale. AWS, microservices, and more.",
    requirements: [
      "3+ years backend",
      "Java or Python",
      "Distributed systems",
      "AWS experience",
    ],
    tags: ["Java", "AWS", "Microservices", "DynamoDB"],
    matchScore: 74,
    postedDaysAgo: 5,
    applicationUrl: "#",
  },
  {
    id: "5",
    title: "Senior Software Engineer",
    company: "Systems Limited",
    companyColor: "#0066CC",
    location: "Lahore, Pakistan",
    remote: false,
    salary: { min: 150000, max: 350000 },
    description:
      "Lead enterprise solutions for global clients. Build scalable Java/.NET applications.",
    requirements: [
      "5+ years experience",
      "Java/.NET/React",
      "Enterprise patterns",
      "Team leadership",
    ],
    tags: ["Java", "React", ".NET", "Enterprise"],
    matchScore: 91,
    postedDaysAgo: 1,
    applicationUrl: "#",
  },
  {
    id: "6",
    title: "React Developer",
    company: "10Pearls",
    companyColor: "#00BCD4",
    location: "Islamabad, Pakistan",
    remote: true,
    salary: { min: 120000, max: 300000 },
    description:
      "Build modern web applications for US-based clients. React, Node.js, and cloud technologies.",
    requirements: [
      "3+ years React",
      "Node.js",
      "AWS/Azure",
      "Agile experience",
    ],
    tags: ["React", "Node.js", "TypeScript", "Cloud"],
    matchScore: 88,
    postedDaysAgo: 2,
    applicationUrl: "#",
  },
  {
    id: "7",
    title: "Staff Engineer",
    company: "GitLab",
    companyColor: "#FC6D26",
    location: "Remote (Global)",
    remote: true,
    salary: { min: 170000, max: 300000 },
    description:
      "Shape the future of DevOps. Work on CI/CD, code review, and developer tooling — fully remote.",
    requirements: [
      "8+ years experience",
      "Ruby/Go",
      "Distributed systems",
      "Open source contributor",
    ],
    tags: ["Ruby", "Go", "DevOps", "Open Source"],
    matchScore: 72,
    postedDaysAgo: 4,
    applicationUrl: "#",
  },
  {
    id: "8",
    title: "Python Developer",
    company: "Arbisoft",
    companyColor: "#FF6600",
    location: "Lahore, Pakistan",
    remote: false,
    salary: { min: 100000, max: 300000 },
    description:
      "Work on edX, Kayak and other world-class products. Django, Python, and modern web stack.",
    requirements: [
      "2+ years Python/Django",
      "REST APIs",
      "PostgreSQL",
      "Docker",
    ],
    tags: ["Python", "Django", "PostgreSQL", "Docker"],
    matchScore: 85,
    postedDaysAgo: 3,
    applicationUrl: "#",
  },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return SAMPLE_JOBS.filter((job) => {
      if (remoteOnly && !job.remote) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.tags.some((t) => t.toLowerCase().includes(q)) ||
          job.location.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [search, remoteOnly]);

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 page-enter bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Job Board</h1>
        <p className="text-[#888]">
          Find your next role. AI-scored match with your profile.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
          <Input
            placeholder="Search jobs, companies, skills..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant={remoteOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setRemoteOnly(!remoteOnly)}
          className="gap-2"
        >
          <Globe className="w-4 h-4" /> Remote Only
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400">
              {SAMPLE_JOBS.length}
            </div>
            <div className="text-xs text-[#888]">Open Positions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {SAMPLE_JOBS.filter((j) => j.remote).length}
            </div>
            <div className="text-xs text-[#888]">Remote Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">
              {Math.round(
                SAMPLE_JOBS.reduce((s, j) => s + j.matchScore, 0) /
                  SAMPLE_JOBS.length,
              )}
              %
            </div>
            <div className="text-xs text-[#888]">Avg Match</div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-[#888] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-1">No jobs found</h3>
              <p className="text-[#888] text-sm">
                Try adjusting your search or filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
            >
              <Card className="hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ backgroundColor: job.companyColor }}
                    >
                      {job.company.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-[#888] mt-0.5">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />{" "}
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {job.location}
                            </span>
                            {job.remote && (
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                Remote
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            className={`px-3 py-1.5 rounded-lg text-center ${job.matchScore >= 80 ? "bg-emerald-500/10 border border-emerald-500/20" : job.matchScore >= 60 ? "bg-amber-500/10 border border-amber-500/20" : "bg-red-500/10 border border-red-500/20"}`}
                          >
                            <div
                              className={`text-lg font-bold ${job.matchScore >= 80 ? "text-emerald-400" : job.matchScore >= 60 ? "text-amber-400" : "text-red-400"}`}
                            >
                              {job.matchScore}%
                            </div>
                            <div className="text-[10px] text-[#888]">Match</div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-[#888] mt-2 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/6">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <DollarSign className="w-3.5 h-3.5" />
                            {job.salary.min >= 1000
                              ? `$${(job.salary.min / 1000).toFixed(0)}K`
                              : `PKR ${(job.salary.min / 1000).toFixed(0)}K`}{" "}
                            –{" "}
                            {job.salary.max >= 1000
                              ? `$${(job.salary.max / 1000).toFixed(0)}K`
                              : `PKR ${(job.salary.max / 1000).toFixed(0)}K`}
                          </span>
                          <span className="text-[#888]">
                            {job.postedDaysAgo === 1
                              ? "Yesterday"
                              : `${job.postedDaysAgo}d ago`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleSave(job.id)}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${saved.has(job.id) ? "fill-indigo-400 text-indigo-400" : ""}`}
                            />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-xs"
                          >
                            <Zap className="w-3 h-3" /> Prep
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1 text-xs bg-indigo-600 hover:bg-indigo-700"
                          >
                            Apply <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
