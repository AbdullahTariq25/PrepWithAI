"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  MessageSquare,
  History,
  BarChart3,
  BookOpen,
  Building2,
  Settings,
  CreditCard,
  FileText,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Sparkles,
  Trophy,
  Zap,
  Flame,
  Layers,
  Wand2,
  Mail,
  Briefcase,
  DollarSign,
  Users,
  Clock,
  Crown,
  Gift,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { proTrialDaysRemaining, effectivePlan } from "@/lib/utils";

/* ── Navigation (priority order) ── */
const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/interview",
    label: "New Interview",
    icon: MessageSquare,
    badge: null,
  },
  { href: "/daily", label: "Daily Challenge", icon: Flame, badge: "Hot" },
  { href: "/questions", label: "Questions", icon: BookOpen },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
];

const secondaryNav = [
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/history", label: "History", icon: History },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, badge: "New" },
  { href: "/study-groups", label: "Study Groups", icon: Users },
];

const careerNav = [
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/resume/builder", label: "Resume Builder", icon: Wand2 },
  { href: "/cover-letter", label: "Cover Letter", icon: Mail },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/salary", label: "Salary Coach", icon: DollarSign },
];

const bottomNav = [
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const eloRating = user?.eloRating || 1200;
  const streak = user?.currentStreak || 0;
  const userPlan = user?.plan ?? "free";
  const trialEndsAt = user?.proTrialEndsAt;
  const isOnTrial = user?.isOnProTrial ?? false;
  const trialDaysLeft = proTrialDaysRemaining(trialEndsAt);
  const ePlan = effectivePlan({ plan: userPlan, proTrialEndsAt: trialEndsAt });

  /* Plan badge config */
  const planBadge = useMemo(() => {
    if (ePlan === "pro_trial")
      return {
        label: `PRO TRIAL · ${trialDaysLeft}d left`,
        color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      };
    if (ePlan === "pro")
      return {
        label: "PRO UNLIMITED",
        color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      };
    if (ePlan === "team")
      return {
        label: "TEAM",
        color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      };
    if (ePlan === "enterprise")
      return {
        label: "ENTERPRISE",
        color: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      };
    return {
      label: "FREE PLAN",
      color: "bg-white/6 text-[#888] border-white/8",
    };
  }, [ePlan, trialDaysLeft]);

  /* Trial expired? */
  const trialExpired =
    trialEndsAt &&
    !isOnTrial &&
    new Date(trialEndsAt) < new Date() &&
    userPlan === "free";

  const renderNavSection = (
    items: typeof primaryNav,
    sectionLabel?: string,
  ) => (
    <>
      {sectionLabel && (
        <div className="px-3 pt-4 pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#555]">
            {sectionLabel}
          </span>
        </div>
      )}
      {items.map((item) => {
        const badge = (item as { badge?: string | null }).badge;
        const isActive =
          currentPath === item.href ||
          (item.href !== "/dashboard" && currentPath.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group ${
              isActive
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "text-[#888] hover:bg-white/4 hover:text-white border border-transparent"
            }`}
          >
            <item.icon
              className={`w-[18px] h-[18px] ${isActive ? "text-indigo-400" : "text-[#666] group-hover:text-[#ccc]"}`}
            />
            <span className="flex-1">{item.label}</span>
            {badge && (
              <Badge className="ml-auto text-[9px] px-1.5 py-0 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                {badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-[#0A0A0A] border-r border-white/6 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo + Version */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-white/6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[15px] tracking-tight">
                Prep<span className="gradient-text">WithAI</span>
              </span>
              <span className="text-[9px] font-mono text-[#555] bg-white/4 px-1.5 py-0.5 rounded">
                v2.0
              </span>
            </Link>
            <button
              className="lg:hidden p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-[#888]" />
            </button>
          </div>

          {/* ELO + Streak bar */}
          <div className="px-4 py-2.5 border-b border-white/6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-sm font-bold tabular-nums text-indigo-400">
                  {eloRating}
                </span>
                <span className="text-[10px] text-[#555] uppercase tracking-wider">
                  ELO
                </span>
              </div>
              <div className="flex items-center gap-1">
                {streak > 0 ? (
                  <>
                    <Flame className="w-3.5 h-3.5 text-orange-400 streak-fire" />
                    <span className="text-sm font-bold tabular-nums text-orange-400">
                      {streak}d
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] text-[#555]">No streak</span>
                )}
              </div>
            </div>
          </div>

          {/* Plan Badge */}
          <div className="px-4 py-2">
            <div
              className={`text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md border text-center ${planBadge.color}`}
            >
              {ePlan === "pro_trial" && (
                <Gift className="w-3 h-3 inline mr-1 -mt-px" />
              )}
              {ePlan === "pro" && (
                <Crown className="w-3 h-3 inline mr-1 -mt-px" />
              )}
              {planBadge.label}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
            {renderNavSection(primaryNav)}
            {renderNavSection(secondaryNav, "Progress")}
            {renderNavSection(careerNav, "Career")}
            <div className="my-2 border-t border-white/4" />
            {renderNavSection(bottomNav)}
          </nav>

          {/* Usage meter (free users) */}
          {(ePlan === "free" || ePlan === "pro_trial") && (
            <div className="px-4 py-3 border-t border-white/6">
              {ePlan === "free" && (
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-[#888]">Daily sessions</span>
                    <span className="text-[#666] font-mono">?/3</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500/60 transition-all duration-500"
                      style={{ width: "33%" }}
                    />
                  </div>
                </div>
              )}
              {ePlan === "pro_trial" && (
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-amber-400">Trial remaining</span>
                    <span className="text-amber-400 font-mono font-bold">
                      {trialDaysLeft}d
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        trialDaysLeft <= 3
                          ? "bg-red-500"
                          : trialDaysLeft <= 7
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${(trialDaysLeft / 14) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User section */}
          <div className="border-t border-white/6 p-3">
            <div className="relative">
              <button
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/4 transition-colors"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.image ?? undefined} />
                  <AvatarFallback className="text-xs bg-indigo-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-[13px] font-medium truncate">
                    {user?.name ?? "User"}
                  </div>
                  <div className="text-[11px] text-[#666] truncate">
                    {user?.email ?? ""}
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#555] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className="absolute bottom-full left-0 right-0 mb-2 bg-[var(--bg-surface)] border border-white/8 rounded-lg shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      href="/settings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#ccc] hover:bg-white/4 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-[#888]" /> Settings
                    </Link>
                    <Link
                      href="/pricing"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#ccc] hover:bg-white/4 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Sparkles className="w-4 h-4 text-indigo-400" /> Upgrade
                      Plan
                    </Link>
                    <button
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-400 hover:bg-white/4 transition-colors w-full"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-[260px]">
        {/* Trial Banner — persistent for trial users */}
        {isOnTrial && (
          <div
            className={`relative overflow-hidden ${
              trialDaysLeft <= 3
                ? "bg-linear-to-r from-red-500/15 via-orange-500/10 to-red-500/15 border-b border-red-500/20"
                : "bg-linear-to-r from-indigo-500/10 via-violet-500/8 to-indigo-500/10 border-b border-indigo-500/15"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    trialDaysLeft <= 3 ? "bg-red-500/20" : "bg-indigo-500/20"
                  }`}
                >
                  {trialDaysLeft <= 3 ? (
                    <Clock className="w-4 h-4 text-red-400" />
                  ) : (
                    <Gift className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate">
                    {trialDaysLeft <= 3 ? (
                      <span className="text-red-400">
                        ⚠️ Pro trial ends in {trialDaysLeft} day
                        {trialDaysLeft !== 1 ? "s" : ""}! Don&apos;t lose
                        access.
                      </span>
                    ) : (
                      <span className="text-[#ccc]">
                        🎉 Pro trial active —{" "}
                        <strong className="text-indigo-400">
                          {trialDaysLeft} days
                        </strong>{" "}
                        remaining. All features unlocked!
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Link href="/pricing" className="shrink-0">
                <Button
                  size="sm"
                  variant={trialDaysLeft <= 3 ? "destructive" : "glow"}
                  className="gap-1.5 text-[12px] h-8"
                >
                  {trialDaysLeft <= 3 ? "Upgrade Now" : "See Plans"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            {/* Shimmer effect on urgent banner */}
            {trialDaysLeft <= 3 && (
              <div className="absolute inset-0 shine-effect pointer-events-none" />
            )}
          </div>
        )}

        {/* Trial Expired Banner */}
        {trialExpired && (
          <div className="bg-linear-to-r from-red-500/10 via-orange-500/8 to-red-500/10 border-b border-red-500/20">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-red-400">
                    Your 14-day Pro trial has ended. Upgrade to keep unlimited
                    interviews, voice mode & all features.
                  </p>
                </div>
              </div>
              <Link href="/pricing" className="shrink-0">
                <Button
                  size="sm"
                  variant="glow"
                  className="gap-1.5 text-[12px] h-8"
                >
                  Upgrade to Pro — $9/mo <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-[var(--bg-page)]/80 backdrop-blur-xl border-b border-white/6 flex items-center px-4 lg:px-8">
          <button
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-[#888]" />
          </button>
          <div className="flex-1" />
          <Link href="/interview">
            <Button size="sm" variant="glow" className="gap-2 text-[13px] h-9">
              <MessageSquare className="w-4 h-4" />
              New Interview
            </Button>
          </Link>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-3.5rem)] p-4 md:p-6 lg:p-8 bg-[#080808]">
          {children}
        </main>
      </div>
    </div>
  );
}
