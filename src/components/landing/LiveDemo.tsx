"use client";

import { motion } from "framer-motion";
import { Brain, Mic, CheckCircle, AlertTriangle } from "lucide-react";

const skillBars = [
    { label: "Problem Solving", pct: 80, color: "#6366F1" },
    { label: "Communication", pct: 70, color: "#3B82F6" },
    { label: "Code Quality", pct: 70, color: "#22C55E" },
    { label: "Edge Cases", pct: 60, color: "#F59E0B" },
    { label: "Time Management", pct: 90, color: "#10B981" },
];

const messages = [
    { type: "ai" as const, text: "Let's start. Given an integer array, return indices of two numbers that add to a target." },
    { type: "user" as const, text: "I'd use a hash map. For each element, I check if the complement exists in the map." },
    { type: "ai" as const, text: "Good start. What's the time complexity? And how would you handle duplicate values?" },
    { type: "user" as const, text: "O(n) time, O(n) space. For duplicates, I would store the index and check before adding to the map." },
    { type: "ai" as const, text: "Nice. Now, walk me through how you'd handle edge cases — empty array, single element, no solution." },
];

export default function LiveDemo() {
    return (
        <section
            id="demo"
            style={{
                background: "#08080C",
                padding: "120px 24px",
                position: "relative",
            }}
        >
            {/* Subtle glow behind card */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: "center", marginBottom: 64 }}
                >
                    <h2
                        className="text-[28px] md:text-[40px]"
                        style={{ fontWeight: 700, color: "white", letterSpacing: -1, margin: 0, fontFamily: "var(--font-sans)" }}
                    >
                        See it in action
                    </h2>
                    <p style={{ fontSize: 18, color: "#A0A0B0", marginTop: 12 }}>
                        A real PrepWithAI session — unscripted
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background: "#0E0E14",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.08)",
                    }}
                >
                    {/* Title bar */}
                    <div
                        style={{
                            height: 40,
                            background: "#0A0A0F",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            padding: "0 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                        <span style={{ marginLeft: "auto", marginRight: "auto", fontSize: 11, color: "#60607A", fontFamily: "var(--font-mono)" }}>
                            Live Session — DSA · Medium · Google
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col md:grid" style={{ gridTemplateColumns: "58% 1px 1fr" }}>
                        {/* LEFT: Chat */}
                        <div style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 440 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: i * 0.1 }}
                                        style={{ display: "flex", gap: 8, alignItems: "flex-start", justifyContent: msg.type === "user" ? "flex-end" : "flex-start" }}
                                    >
                                        {msg.type === "ai" && (
                                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <Brain size={12} color="white" />
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                background: msg.type === "ai" ? "#18181F" : "rgba(99,102,241,0.15)",
                                                border: msg.type === "ai" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(99,102,241,0.2)",
                                                borderRadius: msg.type === "ai" ? "0 12px 12px 12px" : "12px 0 12px 12px",
                                                padding: "10px 14px",
                                                maxWidth: "85%",
                                            }}
                                        >
                                            <p style={{ fontSize: 13, color: msg.type === "ai" ? "#A0A0B0" : "white", lineHeight: 1.6, margin: 0 }}>
                                                {msg.text}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Typing indicator */}
                                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Brain size={12} color="white" />
                                    </div>
                                    <div style={{ background: "#18181F", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0 12px 12px 12px", padding: "10px 14px", display: "flex", alignItems: "center", gap: 4 }}>
                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366F1", animation: "typingDot 1.4s ease-in-out infinite", animationDelay: "0s" }} />
                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366F1", animation: "typingDot 1.4s ease-in-out infinite", animationDelay: "0.2s" }} />
                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366F1", animation: "typingDot 1.4s ease-in-out infinite", animationDelay: "0.4s" }} />
                                    </div>
                                </div>
                            </div>

                            {/* Voice bar */}
                            <div style={{ background: "#0A0A0F", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "16px -20px -20px", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Mic size={14} color="#22C55E" />
                                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                        {[4, 16, 8, 20, 6, 12, 3].map((h, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: 4,
                                                    borderRadius: 2,
                                                    background: "#22C55E",
                                                    animation: "waveform 0.8s ease-in-out infinite",
                                                    animationDelay: `${i * 0.1}s`,
                                                    height: h,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: 11, color: "#22C55E" }}>Voice active</span>
                                </div>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EF4444", animation: "pulse 2s ease-in-out infinite" }} />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block" style={{ background: "rgba(255,255,255,0.06)" }} />

                        {/* RIGHT: Score Panel */}
                        <div className="hidden md:flex" style={{ background: "#0A0A0F", padding: 20, flexDirection: "column" }}>
                            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#60607A" }}>Live Feedback</div>

                            {/* Score */}
                            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                                <div
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: "50%",
                                        border: "3px solid #6366F1",
                                        boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                    }}
                                >
                                    <span style={{ fontSize: 24, fontFamily: "var(--font-mono)", fontWeight: 700, color: "white" }}>74</span>
                                    <span style={{ fontSize: 11, color: "#60607A" }}>/100</span>
                                </div>
                            </div>

                            {/* Bars */}
                            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                                {skillBars.map((s) => (
                                    <div key={s.label}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                            <span style={{ fontSize: 11, color: "#A0A0B0" }}>{s.label}</span>
                                            <span style={{ fontSize: 11, color: "white" }}>{s.pct}%</span>
                                        </div>
                                        <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${s.pct}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                                style={{ height: "100%", borderRadius: 2, background: s.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Feedback items */}
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 16, paddingTop: 16 }}>
                                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                                    <CheckCircle size={14} color="#22C55E" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 12, color: "#22C55E", lineHeight: 1.5 }}>
                                        Strength: Correctly identified O(n) solution
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <AlertTriangle size={14} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 12, color: "#F59E0B", lineHeight: 1.5 }}>
                                        Weakness: Forgot to handle empty array edge case
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <p style={{ textAlign: "center", fontSize: 13, color: "#60607A", marginTop: 20 }}>
                    Voice and video modes available on Free and Pro plans
                </p>
            </div>
        </section>
    );
}
