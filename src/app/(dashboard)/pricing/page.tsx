"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Check, Crown, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const freeFeatures = [
  "3 interview sessions per day",
  "Core DSA practice",
  "Text interview mode",
  "Basic AI feedback",
  "Save your 5 most recent sessions",
];

const proFeatures = [
  "Unlimited interview sessions",
  "All interview tracks and company packs",
  "Voice and video interview modes",
  "Detailed scoring and improvement feedback",
  "Progress analytics and unlimited history",
  "Resume-personalized interview questions",
];

const teamFeatures = [
  "Everything in Pro",
  "5 seats included",
  "Shared team preparation workspace",
  "Manager visibility and readiness insights",
  "Priority support",
];

export default function PricingPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState<"trial" | "pro" | "team" | null>(null);
  const [notice, setNotice] = useState("");
  const currentPlan = session?.user?.plan || "free";

  async function startTrial() {
    setLoading("trial");
    setNotice("");
    try {
      const response = await fetch("/api/user/start-trial", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start trial");
      setNotice(data.message || "Your Pro trial is active.");
      await update();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to start trial");
    } finally {
      setLoading(null);
    }
  }

  async function checkout(planId: "pro" | "team") {
    setLoading(planId);
    setNotice("");
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to open checkout");
      }
      window.location.assign(data.url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to open checkout");
      setLoading(null);
    }
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "Build a consistent interview practice habit.",
      icon: ShieldCheck,
      features: freeFeatures,
      action: (
        <Button variant="outline" className="w-full" disabled>
          {currentPlan === "free" ? "Current plan" : "Free plan"}
        </Button>
      ),
    },
    {
      id: "pro",
      name: "Pro",
      price: "$9",
      suffix: "/month",
      description: "The complete preparation workspace for serious candidates.",
      icon: Crown,
      popular: true,
      features: proFeatures,
      action: currentPlan === "pro" ? (
        <Button className="w-full" disabled>Current plan</Button>
      ) : (
        <div className="grid gap-2">
          <Button className="w-full" onClick={() => checkout("pro")} disabled={loading !== null}>
            {loading === "pro" ? "Opening checkout…" : "Upgrade to Pro"}
          </Button>
          {currentPlan === "free" && (
            <Button variant="ghost" className="w-full" onClick={startTrial} disabled={loading !== null}>
              {loading === "trial" ? "Starting trial…" : "Start 14-day free trial"}
            </Button>
          )}
        </div>
      ),
    },
    {
      id: "team",
      name: "Team",
      price: "$29",
      suffix: "/month",
      description: "Structured interview readiness for small engineering teams.",
      icon: Users,
      features: teamFeatures,
      action: currentPlan === "team" ? (
        <Button className="w-full" disabled>Current plan</Button>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => checkout("team")} disabled={loading !== null}>
          {loading === "team" ? "Opening checkout…" : "Choose Team"}
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 page-enter">
      <div className="mx-auto max-w-3xl text-center">
        <Badge className="mb-4 gap-1.5 border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" /> Plans built for real interview preparation
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Choose how seriously you want to prepare.</h1>
        <p className="mt-4 text-base leading-7 text-[#9a9aaa] md:text-lg">
          Start with the free plan, try Pro for 14 days, and upgrade when you need unlimited practice and deeper feedback.
        </p>
      </div>

      {notice && (
        <div className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-[#c7c7d2]">
          {notice}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <section
              key={plan.id}
              className={`relative flex h-full flex-col rounded-2xl border p-6 ${
                plan.popular
                  ? "border-indigo-500/40 bg-gradient-to-b from-indigo-500/10 to-[#111116] shadow-[0_20px_80px_rgba(79,70,229,0.12)]"
                  : "border-white/8 bg-[#111116]"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 border-0 bg-indigo-600 text-white">
                  Most popular
                </Badge>
              )}

              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/5">
                <Icon className="h-5 w-5 text-indigo-300" />
              </div>
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                {plan.suffix && <span className="pb-1 text-sm text-[#77778a]">{plan.suffix}</span>}
              </div>
              <p className="mt-3 min-h-12 text-sm leading-6 text-[#9292a3]">{plan.description}</p>

              <div className="my-6 h-px bg-white/8" />
              <div className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-[#b6b6c2]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7">{plan.action}</div>
            </section>
          );
        })}
      </div>

      <p className="text-center text-xs text-[#666679]">
        Cancel paid subscriptions through the customer portal. Payment availability depends on the configured Stripe account.
      </p>
    </div>
  );
}
