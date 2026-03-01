"use client";

import { motion } from "framer-motion";

const headers = ["Feature", "PrepWithAI", "LeetCode", "Pramp", "interviewing.io"];

const rows = [
    { feature: "Price", values: ["Free + $9/mo", "$35/mo", "Free", "$200+/session"] },
    { feature: "Available 24/7", values: ["check", "check", "schedule", "schedule"] },
    { feature: "AI Feedback", values: ["Detailed", "x", "x", "Human only"] },
    { feature: "Voice Mode", values: ["check", "x", "x", "check"] },
    { feature: "Video Mode", values: ["check", "x", "x", "check"] },
    { feature: "20+ Companies", values: ["check", "x", "x", "Limited"] },
    { feature: "Pakistan Companies", values: ["Exclusive", "x", "x", "x"] },
    { feature: "Progress Analytics", values: ["check", "check", "x", "x"] },
];

function CellContent({ val }: { val: string }) {
    if (val === "check") return <span style={{ color: "#22C55E", fontWeight: 600, fontSize: 16 }}>✓</span>;
    if (val === "x") return <span style={{ color: "#60607A", fontSize: 16 }}>✗</span>;
    if (val === "schedule") return <span style={{ color: "#60607A", fontSize: 13 }}>✗ Schedule</span>;
    if (val === "Detailed" || val === "Exclusive") return (
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <span style={{ color: "#22C55E", fontWeight: 600 }}>✓</span>
            <span style={{ color: "#A0A0B0" }}>{val}</span>
        </span>
    );
    if (val === "Human only" || val === "Limited") return (
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <span style={{ color: "#22C55E" }}>✓</span>
            <span style={{ color: "#A0A0B0" }}>{val}</span>
        </span>
    );
    return <span style={{ fontSize: 13, color: "#A0A0B0" }}>{val}</span>;
}

export default function ComparisonTable() {
    return (
        <section
            style={{
                background: "#0C0C10",
                padding: "120px 24px",
            }}
        >
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-[28px] md:text-[40px]"
                    style={{ fontWeight: 700, color: "white", letterSpacing: -1, textAlign: "center", marginBottom: 48, marginTop: 0, fontFamily: "var(--font-sans)" }}
                >
                    Why developers choose PrepWithAI
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: "#111116",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 16,
                        overflow: "hidden",
                    }}
                >
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#0E0E14", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    {headers.map((h, i) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: "14px 20px",
                                                fontSize: 13,
                                                fontWeight: i === 1 ? 600 : 500,
                                                color: i === 1 ? "#6366F1" : "#A0A0B0",
                                                textAlign: i === 0 ? "left" : "center",
                                                background: i === 1 ? "rgba(99,102,241,0.06)" : "transparent",
                                                borderTop: i === 1 ? "2px solid #6366F1" : "none",
                                            }}
                                        >
                                            {i === 1 ? (
                                                <span style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                                                    {h}
                                                    <span style={{ fontSize: 9, background: "#6366F1", color: "white", borderRadius: 999, padding: "1px 6px", fontWeight: 600 }}>★ Best</span>
                                                </span>
                                            ) : h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr
                                        key={row.feature}
                                        style={{
                                            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                        }}
                                    >
                                        <td style={{ padding: "16px 20px", fontSize: 14, color: "#A0A0B0", fontWeight: 500 }}>
                                            {row.feature}
                                        </td>
                                        {row.values.map((v, j) => (
                                            <td
                                                key={j}
                                                style={{
                                                    padding: "16px 20px",
                                                    textAlign: "center",
                                                    background: j === 0 ? "rgba(99,102,241,0.03)" : "transparent",
                                                }}
                                            >
                                                <CellContent val={v} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden" style={{ padding: 16 }}>
                        {rows.map((row, i) => (
                            <div key={row.feature} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", padding: "12px 0" }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 8 }}>{row.feature}</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
                                    {headers.slice(1).map((h, j) => (
                                        <div key={h} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", borderRadius: 6, background: j === 0 ? "rgba(99,102,241,0.06)" : "transparent" }}>
                                            <span style={{ fontSize: 11, color: "#60607A" }}>{h}</span>
                                            <CellContent val={row.values[j]} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
