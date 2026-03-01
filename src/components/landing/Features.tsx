"use client";

import { motion } from "framer-motion";
import { Bot, Mic, Video, Building2, BarChart3, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureCard {
    icon: LucideIcon;
    accent: string;
    accentBg: string;
    title: string;
    description: string;
    badge?: string;
}

const features: FeatureCard[] = [
    {
        icon: Bot,
        accent: "#6366F1",
        accentBg: "rgba(99,102,241,0.1)",
        title: "Feels Like a Real Interview",
        description: "Our AI senior engineer adapts to your answers, pushes back on weak responses, and gives hints when you are genuinely stuck.",
    },
    {
        icon: Mic,
        accent: "#22C55E",
        accentBg: "rgba(34,197,94,0.1)",
        title: "Speak Your Answers",
        description: "Enable voice mode and answer questions naturally. Filler word detection and speaking pace analysis included.",
    },
    {
        icon: Video,
        accent: "#3B82F6",
        accentBg: "rgba(59,130,246,0.1)",
        title: "Full Video Call Experience",
        description: "Practice with webcam on. AI avatar interviewer, live transcript, eye contact analysis. Looks like a real interview.",
        badge: "NEW",
    },
    {
        icon: Building2,
        accent: "#F59E0B",
        accentBg: "rgba(245,158,11,0.1)",
        title: "Company-Specific Prep",
        description: "Google interviews differ from Amazon. Prep with the exact style and culture fit requirements of your target company.",
    },
    {
        icon: BarChart3,
        accent: "#6366F1",
        accentBg: "rgba(99,102,241,0.1)",
        title: "Know What to Improve",
        description: "After every session: score breakdown across five dimensions, specific strengths, weaknesses, and a sample strong answer.",
    },
    {
        icon: TrendingUp,
        accent: "#22C55E",
        accentBg: "rgba(34,197,94,0.1)",
        title: "Track Your Journey",
        description: "90-day score trend, skill radar chart, weak topic heatmap, and streak tracking. See improvement in real numbers.",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
    return (
        <section
            id="features"
            style={{
                background: "#08080C",
                padding: "120px 24px",
            }}
        >
            <div style={{ maxWidth: 1140, margin: "0 auto" }}>
                {/* Section header */}
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2
                        className="text-[28px] md:text-[40px]"
                        style={{ fontWeight: 700, color: "white", letterSpacing: -1, fontFamily: "var(--font-sans)", margin: 0 }}
                    >
                        Everything you need to ace the interview
                    </h2>
                    <p style={{ fontSize: 18, color: "#A0A0B0", marginTop: 12 }}>
                        From DSA coding to behavioral questions — fully covered
                    </p>
                </div>

                {/* Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    style={{ gap: 20 }}
                >
                    {features.map((f) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={f.title}
                                variants={cardVariants}
                                style={{
                                    background: "#111116",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 16,
                                    padding: 28,
                                    position: "relative",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    transition: "all 200ms ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                                    e.currentTarget.style.boxShadow = "0 0 0 1px rgba(99,102,241,0.1), 0 8px 32px rgba(0,0,0,0.3)";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                {/* Badge */}
                                {f.badge && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 16,
                                            right: 16,
                                            background: "#EF4444",
                                            color: "white",
                                            fontSize: 10,
                                            fontWeight: 600,
                                            padding: "2px 8px",
                                            borderRadius: 999,
                                            letterSpacing: "0.5px",
                                        }}
                                    >
                                        {f.badge}
                                    </span>
                                )}

                                {/* Icon */}
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: f.accentBg,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Icon size={20} color={f.accent} />
                                </div>

                                <h3 style={{ fontSize: 18, fontWeight: 600, color: "white", marginTop: 16, marginBottom: 0 }}>
                                    {f.title}
                                </h3>
                                <p style={{ fontSize: 14, color: "#A0A0B0", lineHeight: 1.7, marginTop: 8, marginBottom: 0 }}>
                                    {f.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
