"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview", label: "Interview", icon: MessageSquare },
  { href: "/questions", label: "Questions", icon: BookOpen },
  { href: "/daily", label: "Daily Challenge", icon: Flame },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/history", label: "History", icon: History },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/resume/builder", label: "Resume Builder", icon: Wand2 },
  { href: "/cover-letter", label: "Cover Letter", icon: Mail },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/salary", label: "Salary Coach", icon: DollarSign },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/study-groups", label: "Study Groups", icon: Users },
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

  const eloRating =
    ((user as Record<string, unknown>)?.eloRating as number) || 1200;
  const streak =
    ((user as Record<string, unknown>)?.currentStreak as number) || 0;

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5]">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0c0c0c] border-r border-white/[0.06] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.06]">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Prep<span className="gradient-text">WithAI</span>
              </span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ELO + Streak mini bar */}
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-400">
                  {eloRating}
                </span>
                <span className="text-xs text-[#888]">ELO</span>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-sm">🔥</span>
                  <span className="text-sm font-medium text-orange-400">
                    {streak}d
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.href ||
                (item.href !== "/dashboard" &&
                  currentPath.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "text-[#888] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.label === "Leaderboard" && (
                    <Badge className="ml-auto text-[10px] px-1.5 py-0 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                      New
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t border-white/[0.06] p-3">
            <div className="relative">
              <button
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.image ?? undefined} />
                  <AvatarFallback className="text-xs bg-indigo-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium truncate">
                    {user?.name ?? "User"}
                  </div>
                  <div className="text-xs text-[#888] capitalize">
                    {((user as Record<string, unknown>)?.plan as string) ??
                      "free"}{" "}
                    plan
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-[#888]" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className="absolute bottom-full left-0 right-0 mb-2 bg-[#111] border border-white/[0.08] rounded-lg shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/[0.04] transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <Link
                      href="/pricing"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/[0.04] transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Sparkles className="w-4 h-4" /> Upgrade Plan
                    </Link>
                    <button
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-white/[0.04] transition-colors w-full"
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
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#080808]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4 lg:px-8">
          <button
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <Link href="/interview">
            <Button size="sm" variant="glow" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              New Interview
            </Button>
          </Link>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 bg-[#080808]">
          {children}
        </main>
      </div>
    </div>
  );
}
