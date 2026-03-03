"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "The AI feedback was brutally specific. It told me I keep forgetting edge cases. After two weeks of daily practice, I stopped missing them in every session.",
    name: "Hamza A.",
    outcome: "Beta tester — Systems Limited prep",
    initials: "HA",
    gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
  },
  {
    quote:
      "Voice mode changed everything for me. I used to freeze up in real interviews. Now I explain my thinking clearly while coding. Night and day difference.",
    name: "Sarah R.",
    outcome: "Beta tester — FAANG prep",
    initials: "SR",
    gradient: "linear-gradient(135deg, #22C55E, #34D399)",
  },
  {
    quote:
      "The Google prep pack is accurate. Almost every question in my actual interview was something I had practiced on PrepWithAI. I was genuinely not surprised.",
    name: "Muhammad K.",
    outcome: "Beta tester — Amazon prep",
    initials: "MK",
    gradient: "linear-gradient(135deg, #3B82F6, #60A5FA)",
  },
];

export default function Testimonials() {
  return (
    <section
      style={{
        background: "#0C0C10",
        padding: "120px 24px",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[28px] md:text-[40px]"
          style={{
            fontWeight: 700,
            color: "white",
            letterSpacing: -1,
            textAlign: "center",
            margin: "0 0 64px",
            fontFamily: "var(--font-sans)",
          }}
        >
          Developers who got the job
        </motion.h2>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "#60607A",
            marginTop: -48,
            marginBottom: 48,
          }}
        >
          Reviews collected from beta users
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: "#111116",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  fontSize: 48,
                  color: "rgba(99,102,241,0.3)",
                  lineHeight: 1,
                  fontFamily: "serif",
                  marginBottom: -12,
                }}
              >
                &ldquo;
              </div>

              <p
                style={{
                  fontSize: 15,
                  color: "#A0A0B0",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  flex: 1,
                  margin: 0,
                }}
              >
                {t.quote}
              </p>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  marginTop: 20,
                  paddingTop: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: t.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 14, fontWeight: 600, color: "white" }}
                    >
                      {t.name}
                    </div>
                    <div style={{ fontSize: 13, color: "#6366F1" }}>
                      {t.outcome}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
