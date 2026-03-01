"use client";

import { motion } from "framer-motion";

const steps = [
    {
        num: 1,
        title: "Choose Your Setup",
        desc: "Pick interview type, company, and difficulty. DSA, System Design, Behavioral, Frontend, or Full Loop.",
    },
    {
        num: 2,
        title: "Interview with AI",
        desc: "Voice, video, or text. AI follows up, gives hints, simulates real interviewer pressure.",
    },
    {
        num: 3,
        title: "Get Better Every Session",
        desc: "Detailed report, scores, and exactly what to practice next.",
    },
];

export default function HowItWorks() {
    return (
        <section
            style={{
                background: "#0C0C10",
                padding: "120px 24px",
            }}
        >
            <div style={{ maxWidth: 1140, margin: "0 auto" }}>
                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-[28px] md:text-[40px]"
                    style={{ fontWeight: 700, color: "white", letterSpacing: -1, textAlign: "center", margin: 0, fontFamily: "var(--font-sans)" }}
                >
                    Three steps to interview confidence
                </motion.h2>

                {/* Steps */}
                <div
                    className="grid grid-cols-1 md:grid-cols-3"
                    style={{ gap: 40, marginTop: 64, position: "relative" }}
                >
                    {/* Connecting line - desktop only */}
                    <div
                        className="hidden md:block"
                        style={{
                            position: "absolute",
                            top: 24,
                            left: "17%",
                            right: "17%",
                            height: 1,
                            borderTop: "1px dashed rgba(99,102,241,0.3)",
                            zIndex: 0,
                        }}
                    />

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                position: "relative",
                                zIndex: 10,
                            }}
                        >
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 18,
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: 700,
                                    color: "white",
                                    boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                                }}
                            >
                                {step.num}
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 600, color: "white", marginTop: 20, marginBottom: 0 }}>
                                {step.title}
                            </h3>
                            <p style={{ fontSize: 15, color: "#A0A0B0", lineHeight: 1.7, marginTop: 8, maxWidth: 260, marginBottom: 0 }}>
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
