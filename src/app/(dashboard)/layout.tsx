"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  ChevronDown,
  CreditCard,
  DollarSign,
  FileText,
  Flame,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";

const sections = [
  {
    label: "Practice",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/plan", label: "My Prep Plan", icon: Target },
      { href: "/interview", label: "New Interview", icon: MessageSquare },
      { href: "/daily", label: "Daily Challenge", icon: Flame },
      { href: "/questions", label: "Questions", icon: BookOpen },
      { href: "/flashcards", label: "Flashcards", icon: Layers },
    ],
  },
  {
    label: "Progress",
    items: [
      { href: "/companies", label: "Companies", icon: Building2 },
      { href: "/history", label: "History", icon: History },
      { href: "/progress", label: "Analytics", icon: BarChart3 },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
      { href: "/study-groups", label: "Study Groups", icon: Users },
    ],
  },
  {
    label: "Career",
    items: [
      { href: "/resume", label: "Resume Review", icon: FileText },
      { href: "/resume/builder", label: "Resume Builder", icon: Wand2 },
      { href: "/cover-letter", label: "Cover Letter", icon: Mail },
      { href: "/jobs", label: "Jobs", icon: Briefcase },
      { href: "/salary", label: "Salary Coach", icon: DollarSign },
    ],
  },
];

function isActivePath(currentPath: string, href: string) {
  return (
    currentPath === href ||
    (href !== "/dashboard" && currentPath.startsWith(`${href}/`))
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const immersive = /\/interview\/[^/]+\/(video|voice)/.test(pathname);
  if (immersive) {
    return <div className="min-h-screen bg-[#050507]">{children}</div>;
  }

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PW";

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/7 bg-[#0b0b10] transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/7 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-950/40">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">PrepWithAI</div>
              <div className="text-[11px] text-[#6f6f82]">Interview intelligence</div>
            </div>
          </Link>
          <button
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-[#8b8b9d] hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-white/7 px-4 py-4">
          <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/7 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-200">
                <Zap className="h-4 w-4" />
                {user?.eloRating || 1200} ELO
              </div>
              <span className="rounded-full border border-white/8 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9a9aaa]">
                {user?.plan || "free"}
              </span>
            </div>
            <div className="mt-2 text-xs text-[#747487]">
              {user?.currentStreak
                ? `${user.currentStreak}-day practice streak`
                : "Start a session to build your streak"}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.label} className="mb-5">
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#565668]">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-white/7 text-white"
                          : "text-[#9696a5] hover:bg-white/4 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active ? "text-indigo-300" : "text-[#6c6c7c]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/7 p-3">
          <Link
            href="/pricing"
            onClick={() => setSidebarOpen(false)}
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#9696a5] hover:bg-white/4 hover:text-white"
          >
            <CreditCard className="h-4 w-4" /> Pricing
          </Link>
          <Link
            href="/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#9696a5] hover:bg-white/4 hover:text-white"
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/7 bg-[#08080c]/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              className="rounded-lg border border-white/8 bg-white/4 p-2 text-[#b8b8c4] hover:bg-white/7 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <div className="text-sm font-semibold text-[#e9e9ef]">
                Your interview workspace
              </div>
              <div className="hidden text-xs text-[#69697a] sm:block">
                Practice deliberately. Measure improvement.
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-2 py-1.5 hover:bg-white/7"
              aria-expanded={profileOpen}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold">
                {initials}
              </div>
              <div className="hidden text-left sm:block">
                <div className="max-w-36 truncate text-xs font-medium text-[#ededf3]">
                  {user?.name || "PrepWithAI user"}
                </div>
                <div className="max-w-36 truncate text-[10px] text-[#6d6d7d]">
                  {user?.email || ""}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-[#777789]" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/8 bg-[#111116] p-2 shadow-2xl shadow-black/40">
                <div className="border-b border-white/7 px-3 py-2.5">
                  <div className="text-xs font-medium text-white">
                    {user?.name || "Account"}
                  </div>
                  <div className="mt-1 text-[11px] capitalize text-[#777789]">
                    {user?.plan || "free"} plan
                  </div>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#a6a6b4] hover:bg-white/5 hover:text-white"
                >
                  <Settings className="h-4 w-4" /> Account settings
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#a6a6b4] hover:bg-white/5 hover:text-white"
                >
                  <Sparkles className="h-4 w-4" /> Plans and billing
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/8"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
