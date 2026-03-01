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
  Search,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

/* -- Navigation (priority order) -- */
const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview", label: "New Interview", icon: MessageSquare },
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
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
    : "?";

  const eloRating = user?.eloRating || 1200;
  const streak = user?.currentStreak || 0;

  const renderNavSection = (
    items: typeof primaryNav,
    sectionLabel?: string,
  ) => (
    <>
      {sectionLabel && (
        <div style={{ padding: "16px 12px 6px 12px" }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.25)",
            }}
          >
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 12px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              margin: "1px 0",
              transition: "all 150ms ease",
              color: isActive ? "#E8E8ED" : "rgba(156,156,157,1)",
              backgroundColor: isActive
                ? "rgba(255,255,255,0.06)"
                : "transparent",
              border: "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "#E8E8ED";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "rgba(156,156,157,1)";
              }
            }}
          >
            <item.icon
              style={{
                width: 16,
                height: 16,
                opacity: isActive ? 1 : 0.6,
              }}
            />
            <span style={{ flex: 1 }}>{item.label}</span>
            {badge && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: 4,
                  backgroundColor:
                    badge === "Hot"
                      ? "rgba(249,115,22,0.15)"
                      : "rgba(99,102,241,0.15)",
                  color:
                    badge === "Hot"
                      ? "rgb(249,115,22)"
                      : "rgb(129,140,248)",
                  border: `1px solid ${badge === "Hot" ? "rgba(249,115,22,0.25)" : "rgba(99,102,241,0.25)"}`,
                }}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#08080C",
        color: "#E8E8ED",
        display: "flex",
      }}
    >
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 40,
            }}
            className="lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{
          width: 240,
          backgroundColor: "#0A0A0F",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 52,
              padding: "0 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Brain style={{ width: 14, height: 14, color: "white" }} />
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                Prep
                <span style={{ color: "#818CF8" }}>WithAI</span>
              </span>
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X style={{ width: 18, height: 18, color: "#9C9C9D" }} />
            </button>
          </div>

          {/* ELO + Streak compact bar */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Zap
                style={{ width: 13, height: 13, color: "#818CF8" }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#818CF8",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {eloRating}
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                ELO
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {streak > 0 ? (
                <>
                  <Flame
                    style={{ width: 13, height: 13, color: "#F97316" }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#F97316",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {streak}d
                  </span>
                </>
              ) : (
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
                  No streak
                </span>
              )}
            </div>
          </div>

          {/* Beta badge */}
          <div style={{ padding: "8px 12px" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "6px 10px",
                borderRadius: 6,
                textAlign: "center",
                backgroundColor: "rgba(16,185,129,0.1)",
                color: "rgb(52,211,153)",
                border: "1px solid rgba(16,185,129,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Sparkles style={{ width: 11, height: 11 }} />
              BETA · ALL FEATURES FREE
            </div>
          </div>

          {/* Navigation */}
          <nav
            style={{
              flex: 1,
              padding: "4px 8px",
              overflowY: "auto",
            }}
          >
            {renderNavSection(primaryNav)}
            {renderNavSection(secondaryNav, "Progress")}
            {renderNavSection(careerNav, "Career")}
            <div
              style={{
                margin: "8px 12px",
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            />
            {renderNavSection(bottomNav)}
          </nav>

          {/* User section */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: 10,
            }}
          >
            <div style={{ position: "relative" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: 8,
                  borderRadius: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 150ms ease",
                  color: "#E8E8ED",
                }}
                onClick={() => setProfileOpen(!profileOpen)}
                onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.04)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={user?.image ?? undefined} />
                  <AvatarFallback
                    style={{
                      fontSize: 10,
                      backgroundColor: "#6366F1",
                      color: "white",
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div
                  style={{
                    flex: 1,
                    textAlign: "left",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.name ?? "User"}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.3)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.email ?? ""}
                  </div>
                </div>
                <ChevronDown
                  style={{
                    width: 14,
                    height: 14,
                    color: "rgba(255,255,255,0.3)",
                    transition: "transform 200ms ease",
                    transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      left: 0,
                      right: 0,
                      marginBottom: 4,
                      backgroundColor: "#111116",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                      overflow: "hidden",
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 14px",
                        fontSize: 12,
                        color: "#9C9C9D",
                        textDecoration: "none",
                        transition: "background-color 150ms ease",
                      }}
                      onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <Settings style={{ width: 14, height: 14 }} />
                      Settings
                    </Link>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 14px",
                        fontSize: 12,
                        color: "#EF4444",
                        width: "100%",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        transition: "background-color 150ms ease",
                      }}
                      onClick={() => signOut({ callbackUrl: "/" })}
                      onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <LogOut style={{ width: 14, height: 14 }} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className="lg:pl-[240px]"
        style={{ flex: 1, minWidth: 0 }}
      >
        {/* Top bar — Raycast style: minimal, clean */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            height: 52,
            backgroundColor: "rgba(8,8,12,0.8)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginRight: 12,
              padding: 4,
            }}
          >
            <Menu style={{ width: 18, height: 18, color: "#9C9C9D" }} />
          </button>

          {/* Raycast-style search bar */}
          <div
            style={{
              flex: 1,
              maxWidth: 480,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              }}
            >
              <Search
                style={{ width: 14, height: 14, color: "rgba(255,255,255,0.3)" }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  flex: 1,
                }}
              >
                Search anything...
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Command style={{ width: 10, height: 10 }} />K
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <Link href="/interview">
            <Button size="sm" variant="glow" className="gap-2 text-[13px] h-8">
              <MessageSquare style={{ width: 14, height: 14 }} />
              New Interview
            </Button>
          </Link>
        </header>

        {/* Page content */}
        <main
          style={{
            minHeight: "calc(100vh - 52px)",
            padding: "24px",
            backgroundColor: "#08080C",
          }}
          className="md:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
