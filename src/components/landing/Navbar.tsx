"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, ShieldCheck, X } from "lucide-react";

const navLinks = [
  { label: "Product", href: "/#workspace" },
  { label: "Career OS", href: "/#career-intelligence" },
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Case study", href: "/case-study" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        aria-label="Primary navigation"
        className={`mx-auto max-w-6xl overflow-hidden rounded-2xl border backdrop-blur-xl transition duration-300 ${
          scrolled
            ? "border-white/12 bg-[#09090e]/94 shadow-[0_18px_60px_rgba(0,0,0,0.5)]"
            : "border-white/8 bg-[#0a0a0f]/78 shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-3 sm:px-5">
          <Link
            href="/"
            aria-label="PrepWithAI home"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-[0_0_28px_rgba(99,102,241,0.38)]">
              P
            </span>
            <span>
              <span className="block text-[15px] font-semibold tracking-[-0.02em] text-white">
                Prep<span className="text-indigo-300">WithAI</span>
              </span>
              <span className="hidden items-center gap-1 text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600 sm:flex">
                <ShieldCheck className="h-2.5 w-2.5" /> Career intelligence
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-2.5 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 xl:px-3"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-white transition hover:bg-white/[0.07] md:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-black/15 px-3 pb-4 pt-3 md:hidden">
            <div className="grid grid-cols-2 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-950"
              >
                Start free
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
