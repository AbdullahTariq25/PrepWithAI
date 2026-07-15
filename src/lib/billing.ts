export const BILLING = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    sessionsPerDay: 3,
    savedSessions: 5,
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 9,
    trialDays: 14,
  },
  team: {
    id: "team",
    name: "Team",
    price: 29,
    seats: 5,
  },
} as const;

export type PaidPlanId = "pro" | "team";
export type PlanId = "free" | PaidPlanId | "enterprise";

export function isPaidPlan(plan: string | null | undefined): plan is PaidPlanId | "enterprise" {
  return plan === "pro" || plan === "team" || plan === "enterprise";
}

export function isTrialActive(value: Date | string | null | undefined): boolean {
  if (!value) return false;
  const end = new Date(value);
  return Number.isFinite(end.getTime()) && end.getTime() > Date.now();
}

export function trialDaysRemaining(value: Date | string | null | undefined): number {
  if (!isTrialActive(value)) return 0;
  const end = new Date(value as Date | string).getTime();
  return Math.max(0, Math.ceil((end - Date.now()) / 86_400_000));
}

export function hasProAccess(user: {
  plan?: string | null;
  proTrialEndsAt?: Date | string | null;
} | null | undefined): boolean {
  if (!user) return false;
  return isPaidPlan(user.plan) || isTrialActive(user.proTrialEndsAt);
}

export function effectivePlan(user: {
  plan?: string | null;
  proTrialEndsAt?: Date | string | null;
} | null | undefined): PlanId {
  if (!user) return "free";
  if (isPaidPlan(user.plan)) return user.plan;
  return isTrialActive(user.proTrialEndsAt) ? "pro" : "free";
}
