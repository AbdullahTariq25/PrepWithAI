"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Companies", href: "#companies" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "#" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                backgroundColor: scrolled ? "rgba(8,8,12,0.85)" : "rgba(8,8,12,0.6)",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
                transition: "background-color 300ms ease, border-bottom 300ms ease",
            }}
        >
            <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                fontWeight: 700,
                                color: "white",
                            }}
                        >
                            P
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 500, color: "white", fontFamily: "var(--font-sans)" }}>
                            Prep<span style={{ color: "#6366F1" }}>WithAI</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex" style={{ alignItems: "center", gap: 32 }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                style={{
                                    fontSize: 14,
                                    color: "#A0A0B0",
                                    textDecoration: "none",
                                    transition: "color 150ms ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#A0A0B0")}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex" style={{ alignItems: "center", gap: 12 }}>
                        <Link
                            href="/login"
                            style={{
                                fontSize: 14,
                                color: "#A0A0B0",
                                textDecoration: "none",
                                padding: "8px 16px",
                                borderRadius: 8,
                                border: "1px solid rgba(255,255,255,0.12)",
                                transition: "all 150ms ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "white";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#A0A0B0";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                            }}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 14,
                                fontWeight: 500,
                                color: "white",
                                background: "#6366F1",
                                padding: "8px 20px",
                                borderRadius: 10,
                                textDecoration: "none",
                                boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                                transition: "all 150ms ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#4F46E5")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#6366F1")}
                        >
                            Start Free <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 8 }}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: 20, paddingTop: 16 }}
                        className="md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    display: "block",
                                    padding: "10px 0",
                                    fontSize: 15,
                                    color: "#A0A0B0",
                                    textDecoration: "none",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div style={{ display: "flex", gap: 12, paddingTop: 16 }}>
                            <Link
                                href="/login"
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "10px 0",
                                    borderRadius: 10,
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: 14,
                                }}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "10px 0",
                                    borderRadius: 10,
                                    background: "#6366F1",
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                Start Free
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
