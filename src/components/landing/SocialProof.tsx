"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const companies = [
  "Google",
  "Meta",
  "Amazon",
  "Stripe",
  "Microsoft",
  "Apple",
  "Systems Limited",
  "Techlogix",
  "10Pearls",
  "Netsol",
  "Arbisoft",
];

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, motionVal, target]);

  useEffect(() => {
    const unsub = spring.on("change", (v: number) => {
      setDisplay(Math.floor(v).toLocaleString());
    });
    return unsub;
  }, [spring]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

interface PlatformStats {
  users: number;
  sessions: number;
  avgScore: number;
  displayUsers: string;
  displaySessions: string;
  displayAvgScore: string | null;
}

export default function SocialProof() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const displayStats = [
    {
      value: stats?.users ?? 0,
      suffix: "+",
      label: "Developers Joined",
      fallback: stats?.displayUsers ?? "—",
    },
    {
      value: stats?.sessions ?? 0,
      suffix: "+",
      label: "Practice Sessions",
      fallback: stats?.displaySessions ?? "—",
    },
    ...(stats?.avgScore && stats.avgScore > 0
      ? [
          {
            value: stats.avgScore,
            suffix: "%",
            label: "Average Score",
            fallback: stats.displayAvgScore ?? "—",
          },
        ]
      : [
          {
            value: 0,
            suffix: "",
            label: "Average Score",
            fallback: "Start practicing!",
          },
        ]),
  ];

  return (
    <section
      id="companies"
      style={{
        background: "#0C0C10",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 0",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>
        {/* Marquee label */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: "#60607A" }}>
            Trusted by developers preparing for
          </span>
        </div>

        {/* Marquee */}
        <div
          style={{ overflow: "hidden", position: "relative", marginBottom: 24 }}
        >
          {/* Fade edges */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 60,
              background: "linear-gradient(to right, #0C0C10, transparent)",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 60,
              background: "linear-gradient(to left, #0C0C10, transparent)",
              zIndex: 2,
            }}
          />

          <div
            style={{
              display: "flex",
              animation: "marquee 30s linear infinite",
              width: "max-content",
            }}
          >
            {[...companies, ...companies, ...companies].map((company, i) => (
              <span
                key={i}
                style={{
                  flexShrink: 0,
                  padding: "5px 14px",
                  margin: "0 6px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  fontSize: 13,
                  color: "#60607A",
                  whiteSpace: "nowrap",
                }}
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 64,
            flexWrap: "wrap",
          }}
        >
          {displayStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {stat.value > 0 ? (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                ) : (
                  <span>{stat.fallback}</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "#60607A", marginTop: 4 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
