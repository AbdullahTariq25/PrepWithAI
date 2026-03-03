"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      style={{
        background: "#08080C",
        padding: "160px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 600,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[36px] md:text-[56px]"
          style={{
            fontWeight: 700,
            color: "white",
            letterSpacing: -1,
            lineHeight: 1.1,
            margin: 0,
            fontFamily: "var(--font-sans)",
          }}
        >
          Your next interview starts here.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 18, color: "#A0A0B0", marginTop: 16 }}
        >
          Join developers practicing with PrepWithAI. Free to start.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 40,
              padding: "16px 40px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 500,
              color: "white",
              background: "#6366F1",
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(99,102,241,0.4)",
              transition: "all 200ms ease",
              animation: "ctaGlow 3s ease-in-out infinite",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4F46E5";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#6366F1";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Start Practicing Free <ArrowRight size={16} />
          </Link>
        </motion.div>

        <p style={{ fontSize: 13, color: "#60607A", marginTop: 16 }}>
          No credit card required · Built by Abdullah Tariq, Lahore, Pakistan 🇵🇰
        </p>
      </div>
    </section>
  );
}
