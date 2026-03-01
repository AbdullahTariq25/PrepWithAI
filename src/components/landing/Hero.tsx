"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, Mic } from "lucide-react";

const avatarData = [
    { initials: "AT", bg: "linear-gradient(135deg,#6366F1,#8B5CF6)" },
    { initials: "SJ", bg: "linear-gradient(135deg,#8B5CF6,#A78BFA)" },
    { initials: "MR", bg: "linear-gradient(135deg,#3B82F6,#60A5FA)" },
    { initials: "KL", bg: "linear-gradient(135deg,#10B981,#34D399)" },
    { initials: "NP", bg: "linear-gradient(135deg,#F59E0B,#FBBF24)" },
];

const skillBars = [
    { label: "Problem Solving", pct: 80, color: "#6366F1" },
    { label: "Communication", pct: 70, color: "#3B82F6" },
    { label: "Code Quality", pct: 70, color: "#22C55E" },
    { label: "Edge Cases", pct: 60, color: "#F59E0B" },
    { label: "Time Management", pct: 90, color: "#10B981" },
];

export default function Hero() {
    return (
        <section
            style={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                background: "#08080C",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Grid background */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Orb 1 - top center indigo */}
            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 800,
                    height: 800,
                    background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Orb 2 - right bottom violet */}
            <div
                style={{
                    position: "absolute",
                    bottom: "-5%",
                    right: "10%",
                    width: 600,
                    height: 600,
                    background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "160px 24px 60px", textAlign: "center", width: "100%" }}>

                {/* Eyebrow badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 14px",
                            borderRadius: 999,
                            border: "1px solid rgba(99,102,241,0.3)",
                            background: "rgba(99,102,241,0.06)",
                            fontSize: 12,
                            color: "#A0A0B0",
                            letterSpacing: "0.5px",
                        }}
                    >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", animation: "pulse 2s ease-in-out infinite" }} />
                        AI-Powered Interview Coaching — Voice &amp; Video Now Live
                    </span>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-[40px] md:text-[72px]"
                    style={{
                        fontWeight: 700,
                        letterSpacing: -2,
                        lineHeight: 1.05,
                        color: "white",
                        marginTop: 28,
                        marginBottom: 0,
                        fontFamily: "var(--font-sans)",
                    }}
                >
                    Practice Interviews.
                    <br />
                    <span
                        style={{
                            background: "linear-gradient(135deg, #6366F1, #A78BFA)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Get Hired Faster.
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{
                        maxWidth: 560,
                        margin: "20px auto 0",
                        color: "#A0A0B0",
                        fontSize: 18,
                        lineHeight: 1.7,
                    }}
                >
                    Simulate real technical interviews from Google, Meta, Amazon, and top Pakistani
                    companies. AI feedback after every answer. Voice and video modes. Available 24 hours a day.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}
                >
                    <Link
                        href="/signup"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 24px",
                            borderRadius: 10,
                            fontSize: 15,
                            fontWeight: 500,
                            color: "white",
                            background: "#6366F1",
                            textDecoration: "none",
                            boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                            transition: "all 200ms ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#4F46E5")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#6366F1")}
                    >
                        Start Practicing Free <ArrowRight size={15} />
                    </Link>
                    <Link
                        href="#demo"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 24px",
                            borderRadius: 10,
                            fontSize: 15,
                            fontWeight: 500,
                            color: "white",
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.15)",
                            textDecoration: "none",
                            transition: "all 200ms ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        Watch Demo →
                    </Link>
                </motion.div>

                {/* Social proof row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 24 }}
                >
                    <div style={{ display: "flex" }}>
                        {avatarData.map((a, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: a.bg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 9,
                                    fontWeight: 700,
                                    color: "white",
                                    border: "2px solid #08080C",
                                    marginLeft: i > 0 ? -8 : 0,
                                    position: "relative",
                                    zIndex: 5 - i,
                                }}
                            >
                                {a.initials}
                            </div>
                        ))}
                    </div>
                    <span style={{ fontSize: 13, color: "#60607A" }}>
                        1,000+ developers practicing
                    </span>
                </motion.div>

                {/* Hero Mockup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    style={{ marginTop: 80, maxWidth: 900, margin: "80px auto 0", position: "relative" }}
                >
                    {/* Glow behind */}
                    <div style={{ position: "absolute", inset: -16, background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />

                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                        style={{
                            position: "relative",
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
                                PrepWithAI Interview — Google Senior Engineer
                            </span>
                        </div>

                        {/* Main content grid */}
                        <div className="flex flex-col md:grid" style={{ gridTemplateColumns: "1fr 1px 1fr", minHeight: 320 }}>
                            {/* LEFT: Interview Chat */}
                            <div style={{ background: "#0E0E14", padding: 20 }}>
                                {/* Interviewer header */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "white" }}>A</div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: "white" }}>Alex Chen</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                                            <span style={{ fontSize: 11, color: "#60607A" }}>Senior Engineer · Google</span>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "#22C55E" }}>
                                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse 2s ease-in-out infinite" }} />
                                                Live
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat messages */}
                                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                                    {/* AI message */}
                                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Brain size={12} color="white" />
                                        </div>
                                        <div style={{ background: "#18181F", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0 12px 12px 12px", padding: "10px 14px", maxWidth: 380 }}>
                                            <p style={{ fontSize: 13, color: "#A0A0B0", lineHeight: 1.6, margin: 0 }}>
                                                Let&apos;s start. Given an integer array, return indices of two numbers that add to a target. Walk me through your approach.
                                            </p>
                                        </div>
                                    </div>

                                    {/* User message */}
                                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", justifyContent: "flex-end" }}>
                                        <div style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "12px 0 12px 12px", padding: "10px 14px", maxWidth: 380 }}>
                                            <p style={{ fontSize: 13, color: "white", lineHeight: 1.6, margin: 0 }}>
                                                I&apos;d use a hash map to track complements as I iterate through...
                                            </p>
                                        </div>
                                    </div>

                                    {/* Typing indicator */}
                                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Brain size={12} color="white" />
                                        </div>
                                        <div style={{ background: "#18181F", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0 12px 12px 12px", padding: "10px 14px", display: "flex", alignItems: "center", gap: 4 }}>
                                            <span className="typing-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366F1", animation: "typingDot 1.4s ease-in-out infinite", animationDelay: "0s" }} />
                                            <span className="typing-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366F1", animation: "typingDot 1.4s ease-in-out infinite", animationDelay: "0.2s" }} />
                                            <span className="typing-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366F1", animation: "typingDot 1.4s ease-in-out infinite", animationDelay: "0.4s" }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Voice Waveform Bar */}
                                <div style={{ background: "#0A0A0F", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 16, marginLeft: -20, marginRight: -20, marginBottom: -20, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                        <Mic size={14} color="#6366F1" />
                                        {[4, 16, 8, 20, 6].map((h, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: 4,
                                                    borderRadius: 2,
                                                    background: "#6366F1",
                                                    animation: `waveform 0.8s ease-in-out infinite`,
                                                    animationDelay: `${i * 0.1}s`,
                                                    height: h,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EF4444", animation: "pulse 2s ease-in-out infinite" }} />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block" style={{ background: "rgba(255,255,255,0.06)" }} />

                            {/* RIGHT: Live Score */}
                            <div className="hidden md:block" style={{ background: "#0A0A0F", padding: 20 }}>
                                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#60607A" }}>Live Feedback</div>

                                {/* Score circle */}
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

                                {/* Skill bars */}
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
                                                    animate={{ width: `${s.pct}%` }}
                                                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                                                    style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
