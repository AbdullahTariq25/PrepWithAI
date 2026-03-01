"use client";

import Link from "next/link";
import { Linkedin, Github, Twitter } from "lucide-react";

const productLinks = ["Features", "Pricing", "Companies", "Question Bank", "Daily Challenge"];
const companyLinks = ["About", "Blog", "Changelog", "Privacy", "Terms"];
const communityLinks = ["LinkedIn", "GitHub", "Twitter", "Discord", "Product Hunt"];

const socialIcons = [
    { icon: Linkedin, href: "#" },
    { icon: Github, href: "#" },
    { icon: Twitter, href: "#" },
];

export default function Footer() {
    return (
        <footer
            style={{
                background: "#0A0A0F",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "64px 24px 40px",
            }}
        >
            <div style={{ maxWidth: 1140, margin: "0 auto" }}>
                <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: 48 }}>
                    {/* Brand column */}
                    <div style={{ gridColumn: "span 1" }} className="md:col-span-1">
                        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
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
                            <span style={{ fontSize: 16, fontWeight: 500, color: "white" }}>
                                Prep<span style={{ color: "#6366F1" }}>WithAI</span>
                            </span>
                        </Link>
                        <p style={{ fontSize: 14, color: "#60607A", lineHeight: 1.6, marginBottom: 20 }}>
                            The complete AI interview coach for developers.
                        </p>
                        <div style={{ display: "flex", gap: 8 }}>
                            {socialIcons.map(({ icon: Icon, href }) => (
                                <a
                                    key={href + Icon.displayName}
                                    href={href}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#60607A",
                                        textDecoration: "none",
                                        transition: "all 200ms ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                                        e.currentTarget.style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.color = "#60607A";
                                    }}
                                >
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {[
                        { heading: "Product", links: productLinks },
                        { heading: "Company", links: companyLinks },
                        { heading: "Community", links: communityLinks },
                    ].map((col) => (
                        <div key={col.heading}>
                            <h4 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#60607A", marginBottom: 16, marginTop: 0 }}>
                                {col.heading}
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {col.links.map((link) => (
                                    <Link
                                        key={link}
                                        href="#"
                                        style={{
                                            fontSize: 14,
                                            color: "#A0A0B0",
                                            textDecoration: "none",
                                            transition: "color 150ms ease",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#A0A0B0")}
                                    >
                                        {link}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        marginTop: 48,
                        paddingTop: 24,
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 8,
                    }}
                >
                    <span style={{ fontSize: 13, color: "#60607A" }}>© 2026 PrepWithAI. All rights reserved.</span>
                    <span style={{ fontSize: 13, color: "#60607A" }}>Made with ❤️ in Lahore, Pakistan</span>
                </div>
            </div>
        </footer>
    );
}
