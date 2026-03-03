"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Companies", href: "/companies" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
];

export default function MarketingNav() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

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
                padding: "12px 16px 0 16px",
            }}
        >
            {/* Floating Pill Container — same as landing page */}
            <div
                style={{
                    maxWidth: 1120,
                    margin: "0 auto",
                    borderRadius: 9999,
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    backgroundColor: scrolled
                        ? "rgba(8, 8, 12, 0.82)"
                        : "rgba(8, 8, 12, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: scrolled
                        ? "0 4px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
                        : "0 2px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                    transition:
                        "background-color 300ms ease, box-shadow 300ms ease",
                    padding: "0 8px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: 52,
                        padding: "0 16px",
                    }}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            textDecoration: "none",
                            flexShrink: 0,
                        }}
                    >
                        <div
                            style={{
                                width: 26,
                                height: 26,
                                borderRadius: 7,
                                background:
                                    "linear-gradient(135deg, #6366F1, #8B5CF6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "white",
                            }}
                        >
                            P
                        </div>
                        <span
                            style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "white",
                                fontFamily: "var(--font-sans)",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            Prep
                            <span style={{ color: "#818CF8" }}>WithAI</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links — centered */}
                    <div
                        className="hidden md:flex"
                        style={{
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                style={{
                                    fontSize: 13,
                                    fontWeight: pathname === link.href ? 500 : 450,
                                    color: pathname === link.href ? "white" : "rgba(156, 156, 157, 1)",
                                    textDecoration: "none",
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    transition: "color 150ms ease",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = "white")
                                }
                                onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                    pathname === link.href ? "white" : "rgba(156, 156, 157, 1)")
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div
                        className="hidden md:flex"
                        style={{
                            alignItems: "center",
                            gap: 8,
                            flexShrink: 0,
                        }}
                    >
                        <Link
                            href="/login"
                            style={{
                                fontSize: 13,
                                fontWeight: 450,
                                color: "rgba(156, 156, 157, 1)",
                                textDecoration: "none",
                                padding: "6px 14px",
                                borderRadius: 8,
                                transition: "color 150ms ease",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color = "white")
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                                "rgba(156, 156, 157, 1)")
                            }
                        >
                            Log in
                        </Link>

                        <Link
                            href="/signup"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "rgba(30, 30, 32, 1)",
                                background: "rgba(230, 230, 230, 1)",
                                padding: "7px 16px",
                                borderRadius: 9999,
                                textDecoration: "none",
                                transition: "all 150ms ease",
                                letterSpacing: "-0.01em",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(255, 255, 255, 1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(230, 230, 230, 1)";
                            }}
                        >
                            Start Free <ArrowRight size={13} strokeWidth={2.5} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            padding: 8,
                        }}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        style={{
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                            paddingBottom: 16,
                            paddingTop: 12,
                            paddingLeft: 16,
                            paddingRight: 16,
                        }}
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
                                    fontSize: 14,
                                    color: pathname === link.href ? "white" : "rgba(156, 156, 157, 1)",
                                    textDecoration: "none",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                paddingTop: 14,
                            }}
                        >
                            <Link
                                href="/login"
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "10px 0",
                                    borderRadius: 9999,
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "10px 0",
                                    borderRadius: 9999,
                                    background: "rgba(230, 230, 230, 1)",
                                    color: "rgba(30, 30, 32, 1)",
                                    textDecoration: "none",
                                    fontSize: 13,
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
