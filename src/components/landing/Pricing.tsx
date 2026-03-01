"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

interface PlanFeature {
    text: string;
}

interface Plan {
    name: string;
    price: string;
    period: string;
    subtitle: string;
    features: PlanFeature[];
    cta: string;
    highlighted?: boolean;
}

const plans: Plan[] = [
    {
        name: "Free",
        price: "$0",
        period: "/month",
        subtitle: "Perfect to start",
        features: [
            { text: "3 interviews/day" },
            { text: "DSA questions only" },
            { text: "Text mode" },
            { text: "Basic AI feedback" },
            { text: "Last 5 sessions" },
        ],
        cta: "Get Started",
    },
    {
        name: "Pro",
        price: "$9",
        period: "/month",
        subtitle: "For serious prep",
        highlighted: true,
        features: [
            { text: "Unlimited interviews" },
            { text: "All interview types" },
            { text: "Voice + Video mode" },
            { text: "20+ company packs" },
            { text: "Detailed AI scoring" },
            { text: "90-day analytics" },
            { text: "Resume personalization" },
            { text: "Unlimited history" },
        ],
        cta: "Start Pro Free",
    },
    {
        name: "Team",
        price: "$29",
        period: "/month",
        subtitle: "5 seats included",
        features: [
            { text: "Everything in Pro" },
            { text: "Team dashboard" },
            { text: "Manager view" },
            { text: "Custom questions" },
            { text: "Priority support" },
        ],
        cta: "Contact Us",
    },
];

export default function Pricing() {
    return (
        <section
            id="pricing"
            style={{
                background: "#08080C",
                padding: "120px 24px",
            }}
        >
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: "center", marginBottom: 64 }}
                >
                    <h2
                        className="text-[28px] md:text-[40px]"
                        style={{ fontWeight: 700, color: "white", letterSpacing: -1, margin: 0, fontFamily: "var(--font-sans)" }}
                    >
                        Simple, honest pricing
                    </h2>
                    <p style={{ fontSize: 18, color: "#A0A0B0", marginTop: 12 }}>
                        Start free. Upgrade when ready.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20, alignItems: "start" }}>
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            style={{
                                position: "relative",
                                background: plan.highlighted
                                    ? "linear-gradient(180deg, rgba(99,102,241,0.06) 0%, #111116 100%)"
                                    : "#111116",
                                border: plan.highlighted
                                    ? "1px solid rgba(99,102,241,0.4)"
                                    : "1px solid rgba(255,255,255,0.06)",
                                borderRadius: 16,
                                padding: 28,
                                transform: plan.highlighted ? "scale(1.04)" : "none",
                                boxShadow: plan.highlighted
                                    ? "0 0 0 1px rgba(99,102,241,0.2), 0 0 60px rgba(99,102,241,0.1)"
                                    : "none",
                                transition: "all 200ms ease",
                                zIndex: plan.highlighted ? 10 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!plan.highlighted) {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!plan.highlighted) {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                                    e.currentTarget.style.transform = "none";
                                }
                            }}
                        >
                            {/* Popular badge */}
                            {plan.highlighted && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: -12,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                                        color: "white",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        padding: "4px 16px",
                                        borderRadius: 999,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Most Popular
                                </div>
                            )}

                            <h3 style={{ fontSize: 22, fontWeight: 600, color: plan.highlighted ? "#6366F1" : "white", margin: 0 }}>
                                {plan.name}
                            </h3>

                            <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 4 }}>
                                <span style={{ fontSize: 48, fontFamily: "var(--font-mono)", fontWeight: 700, color: "white" }}>
                                    {plan.price}
                                </span>
                                <span style={{ fontSize: 16, color: "#60607A" }}>{plan.period}</span>
                            </div>

                            <p style={{ fontSize: 14, color: "#A0A0B0", marginTop: 4, marginBottom: 0 }}>{plan.subtitle}</p>

                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 20, paddingTop: 20 }}>
                                {plan.features.map((f) => (
                                    <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                        <Check size={14} color={plan.highlighted ? "#22C55E" : "#22C55E"} />
                                        <span style={{ fontSize: 14, color: "#A0A0B0" }}>{f.text}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={plan.cta === "Contact Us" ? "#" : "/signup"}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    marginTop: 20,
                                    width: "100%",
                                    padding: "12px 0",
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    transition: "all 200ms ease",
                                    ...(plan.highlighted
                                        ? {
                                            background: "#6366F1",
                                            color: "white",
                                            boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                                            border: "none",
                                        }
                                        : {
                                            background: "transparent",
                                            color: "white",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                        }),
                                }}
                                onMouseEnter={(e) => {
                                    if (plan.highlighted) {
                                        e.currentTarget.style.background = "#4F46E5";
                                    } else {
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (plan.highlighted) {
                                        e.currentTarget.style.background = "#6366F1";
                                    } else {
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                                        e.currentTarget.style.background = "transparent";
                                    }
                                }}
                            >
                                {plan.cta} {plan.highlighted && <ArrowRight size={14} />}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <p style={{ textAlign: "center", fontSize: 13, color: "#60607A", marginTop: 20 }}>
                    All plans include 14-day money-back guarantee · No credit card for free tier
                </p>
            </div>
        </section>
    );
}
