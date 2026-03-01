"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Star,
  Loader2,
  Sparkles,
  Gift,
  Clock,
  ArrowRight,
  Crown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/constants";
import { proTrialDaysRemaining, effectivePlan } from "@/lib/utils";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [trialStarting, setTrialStarting] = useState(false);

  const user = session?.user;
  const ePlan = effectivePlan(
    user ? { plan: user.plan, proTrialEndsAt: user.proTrialEndsAt } : null,
  );
  const trialDaysLeft = proTrialDaysRemaining(user?.proTrialEndsAt);
  const trialExpired =
    user?.proTrialEndsAt &&
    !user.isOnProTrial &&
    new Date(user.proTrialEndsAt) < new Date() &&
    user.plan === "free";

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

  const handleStartTrial = async () => {
    if (!session?.user) {
      window.location.href = "/signup";
      return;
    }
    setTrialStarting(true);
    try {
      const res = await fetch("/api/user/start-trial", { method: "POST" });
      const data = await res.json();
      if (data.proTrialEndsAt) {
        // Refresh session to pick up trial status
        window.location.reload();
      }
    } catch {
      console.error("Trial start error");
    } finally {
      setTrialStarting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 page-enter bg-[#080808]">
      {/* Trial Status Banner */}
      {ePlan === "pro_trial" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-2xl border p-6 ${
            trialDaysLeft <= 3
              ? "bg-linear-to-r from-red-500/10 via-orange-500/8 to-red-500/10 border-red-500/20"
              : "bg-linear-to-r from-indigo-500/10 via-violet-500/8 to-indigo-500/10 border-indigo-500/20"
          }`}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  trialDaysLeft <= 3 ? "bg-red-500/20" : "bg-indigo-500/20"
                }`}
              >
                {trialDaysLeft <= 3 ? (
                  <Clock className="w-6 h-6 text-red-400" />
                ) : (
                  <Gift className="w-6 h-6 text-indigo-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {trialDaysLeft <= 3 ? (
                    <span className="text-red-400">Trial ending soon!</span>
                  ) : (
                    <span>Your Pro trial is active</span>
                  )}
                </h3>
                <p className="text-sm text-[#888]">
                  {trialDaysLeft <= 3
                    ? `Only ${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""} left. Upgrade now to keep all features.`
                    : `${trialDaysLeft} days remaining. All Pro features are unlocked — voice mode, all 12 types, analytics & more.`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div
                  className={`text-3xl font-bold tabular-nums ${trialDaysLeft <= 3 ? "text-red-400" : "text-indigo-400"}`}
                >
                  {trialDaysLeft}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#666]">
                  days left
                </div>
              </div>
            </div>
          </div>
          {trialDaysLeft <= 3 && (
            <div className="absolute inset-0 shine-effect pointer-events-none" />
          )}
        </motion.div>
      )}

      {/* Trial Expired Banner */}
      {trialExpired && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-500/20 bg-linear-to-r from-red-500/10 via-orange-500/8 to-red-500/10 p-6"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-red-400">
                  Your free trial has ended
                </h3>
                <p className="text-sm text-[#888]">
                  Upgrade to Pro to continue with unlimited interviews, voice
                  mode, company prep packs & more.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Badge className="mb-4 gap-1.5">
          <Sparkles className="w-3 h-3" /> Pricing
        </Badge>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-[#888] max-w-2xl mx-auto">
          Every plan includes a{" "}
          <strong className="text-indigo-400">14-day free Pro trial</strong>. No
          credit card required. Cancel anytime.
        </p>
      </motion.div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 slide-up-stagger">
        {PRICING_PLANS.map((plan, i) => {
          const isCurrentPlan =
            (plan.id === "free" && ePlan === "free") ||
            (plan.id === "pro" && (ePlan === "pro" || ePlan === "pro_trial")) ||
            (plan.id === "team" && ePlan === "team") ||
            (plan.id === "enterprise" && ePlan === "enterprise");

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="h-full"
            >
              <div
                className={`h-full relative bg-[var(--bg-surface)] border rounded-2xl p-6 transition-all duration-200 premium-card ${
                  plan.popular
                    ? "border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                    : "border-white/8 hover:border-white/14"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white px-3 py-1 gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </Badge>
                  </div>
                )}

                {/* 14-day trial badge on Pro */}
                {plan.id === "pro" && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-2.5 py-0.5 gap-1 text-[10px]">
                      <Gift className="w-3 h-3" /> 14-Day Free Trial
                    </Badge>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded">
                      Current
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  {plan.name}
                  {plan.id === "pro" && (
                    <Crown className="w-4 h-4 text-indigo-400" />
                  )}
                </h3>
                <p className="text-[13px] text-[#888] mb-4">
                  {plan.description}
                </p>
                <div className="mb-5">
                  <span className="text-3xl font-bold tabular-nums">
                    ${plan.price}
                  </span>
                  <span className="text-[#555] text-sm">{plan.period}</span>
                </div>

                {plan.id === "free" && !user?.proTrialEndsAt ? (
                  <Button
                    className="w-full mb-5 gap-1.5"
                    variant="glow"
                    onClick={handleStartTrial}
                    disabled={trialStarting}
                  >
                    {trialStarting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    Start 14-Day Pro Trial
                  </Button>
                ) : (
                  <Button
                    className="w-full mb-5"
                    variant={plan.popular ? "glow" : "outline"}
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loading === plan.id || isCurrentPlan}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {isCurrentPlan ? "Current Plan" : plan.cta}
                  </Button>
                )}

                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-[13px]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-[#ccc]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trial CTA for non-signed-in users */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <div className="inline-flex flex-col items-center gap-4 bg-linear-to-r from-indigo-500/10 via-violet-500/8 to-indigo-500/10 border border-indigo-500/20 rounded-2xl p-8">
            <Gift className="w-10 h-10 text-indigo-400" />
            <h3 className="text-xl font-bold">
              Start your{" "}
              <span className="text-indigo-400">14-day free Pro trial</span>{" "}
              today
            </h3>
            <p className="text-[#888] text-sm max-w-md">
              Sign up in 30 seconds. No credit card required. Get instant access
              to all Pro features including voice mode, all 12 interview types,
              and company prep packs.
            </p>
            <a href="/signup">
              <Button variant="glow" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </motion.div>
      )}

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
            q: "What's included in the 14-day free trial?",
            a: "Everything in the Pro plan — unlimited interviews, all 12 question types, voice mode, video interviews, 20+ company prep packs, analytics, resume upload, and more. No credit card needed to start.",
          },
          {
            q: "What happens after the trial ends?",
            a: "Your account switches to the Free plan (3 sessions/day, DSA only). All your data and progress is preserved. Upgrade anytime to restore Pro access.",
          },
          {
            q: "Can I cancel anytime?",
            a: "Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period.",
          },
          {
            q: "What AI model powers the interviews?",
            a: "We use Groq's LLama 3.3 70B model for fast, high-quality interview simulations with sub-second response times.",
          },
          {
            q: "How many questions are in the bank?",
            a: "Over 500 curated questions across DSA, system design, behavioral, frontend, and backend categories from top companies.",
          },
        ].map((faq) => (
          <div
            key={faq.q}
            className="bg-[var(--bg-surface)] border border-white/8 rounded-xl p-5 hover:border-white/12 transition-colors"
          >
            <h3 className="font-medium text-sm mb-1">{faq.q}</h3>
            <p className="text-sm text-[#888]">{faq.a}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
