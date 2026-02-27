"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/constants";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    if (!session?.user) {
      window.location.href = "/signup";
      return;
    }
    if (planId === "free") return;

    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 page-enter bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Badge className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" /> Pricing
        </Badge>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-[#888] max-w-2xl mx-auto">
          Start free. Upgrade when you need more. Cancel anytime.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {PRICING_PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div
              className={`h-full relative bg-[#111] border rounded-2xl p-8 transition-all duration-200 ${
                plan.popular
                  ? "border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                  : "border-white/[0.08] hover:border-white/[0.14]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-600 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-sm text-[#888] mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold tabular-nums">
                  ${plan.price}
                </span>
                <span className="text-[#555]">{plan.period}</span>
              </div>
              <Button
                className="w-full mb-6"
                variant={plan.popular ? "glow" : "outline"}
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
              >
                {loading === plan.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {plan.cta}
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-[#ccc]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mx-auto space-y-3 pt-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6 tracking-tight">
          Frequently Asked Questions
        </h2>
        {[
          {
            q: "Can I cancel anytime?",
            a: "Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period.",
          },
          {
            q: "What AI model powers the interviews?",
            a: "We use Groq's LLama 3.3 70B model for fast, high-quality interview simulations with sub-second response times.",
          },
          {
            q: "Is voice mode included in the free plan?",
            a: "Voice mode is available on Pro and Team plans. Free users get text-based interviews.",
          },
          {
            q: "How many questions are in the bank?",
            a: "Over 500 curated questions across DSA, system design, behavioral, frontend, and backend categories.",
          },
        ].map((faq) => (
          <div
            key={faq.q}
            className="bg-[#111] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
          >
            <h3 className="font-medium text-sm mb-1">{faq.q}</h3>
            <p className="text-sm text-[#888]">{faq.a}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
