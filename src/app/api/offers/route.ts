import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { badRequest, created, serverError, success } from "@/lib/response";
import Offer, { OfferStatus } from "@/models/Offer";

const STATUSES = new Set<OfferStatus>([
  "considering",
  "negotiating",
  "accepted",
  "declined",
]);

function cleanString(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanNumber(value: unknown, min = 0, max = 1_000_000_000) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function cleanScore(value: unknown) {
  return Math.round(cleanNumber(value, 1, 10));
}

function serializeOffer(offer: Record<string, unknown>) {
  const baseAnnual = Number(offer.baseAnnual || 0);
  const bonusAnnual = Number(offer.bonusAnnual || 0);
  const equityAnnual = Number(offer.equityAnnual || 0);
  const signingBonus = Number(offer.signingBonus || 0);
  const benefitsAnnual = Number(offer.benefitsAnnual || 0);
  const relocation = Number(offer.relocation || 0);
  const recurringTotal = baseAnnual + bonusAnnual + equityAnnual + benefitsAnnual;
  const yearOneTotal = recurringTotal + signingBonus + relocation;
  const fitScore = Math.round(
    ([
      offer.learningScore,
      offer.growthScore,
      offer.workLifeScore,
      offer.brandScore,
      offer.flexibilityScore,
    ].reduce<number>((sum, score) => sum + Number(score || 0), 0) /
      50) *
      100,
  );

  return { ...offer, recurringTotal, yearOneTotal, fitScore };
}

async function getOffers(req: NextRequest, ctx: AuthContext) {
  try {
    const filter: Record<string, unknown> = { userId: ctx.user.id };
    const status = req.nextUrl.searchParams.get("status") as OfferStatus | null;
    if (status && STATUSES.has(status)) filter.status = status;

    const offers = await Offer.find(filter).sort({ deadline: 1, updatedAt: -1 }).lean();
    return success({
      offers: offers.map((offer) =>
        serializeOffer(offer as unknown as Record<string, unknown>),
      ),
    });
  } catch (error) {
    return serverError("Failed to load offers", error);
  }
}

async function createOffer(req: NextRequest, ctx: AuthContext) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return badRequest("Invalid request body");

    const company = cleanString(body.company, 120);
    const role = cleanString(body.role, 160);
    const currency = (cleanString(body.currency, 8) || "USD").toUpperCase();
    const status = (cleanString(body.status, 20) || "considering") as OfferStatus;

    if (!company || !role) return badRequest("Company and role are required");
    if (!STATUSES.has(status)) return badRequest("Invalid offer status");

    let deadline: Date | undefined;
    if (typeof body.deadline === "string" && body.deadline.trim()) {
      const parsed = new Date(body.deadline);
      if (Number.isNaN(parsed.getTime())) return badRequest("Invalid offer deadline");
      deadline = parsed;
    }

    const offer = await Offer.create({
      userId: ctx.user.id,
      company,
      role,
      currency,
      baseAnnual: cleanNumber(body.baseAnnual),
      bonusAnnual: cleanNumber(body.bonusAnnual),
      equityAnnual: cleanNumber(body.equityAnnual),
      signingBonus: cleanNumber(body.signingBonus),
      benefitsAnnual: cleanNumber(body.benefitsAnnual),
      relocation: cleanNumber(body.relocation),
      learningScore: cleanScore(body.learningScore),
      growthScore: cleanScore(body.growthScore),
      workLifeScore: cleanScore(body.workLifeScore),
      brandScore: cleanScore(body.brandScore),
      flexibilityScore: cleanScore(body.flexibilityScore),
      status,
      deadline,
      notes: cleanString(body.notes, 5000),
    });

    return created({
      offer: serializeOffer(
        offer.toObject() as unknown as Record<string, unknown>,
      ),
    });
  } catch (error) {
    return serverError("Failed to create offer", error);
  }
}

export const GET = withAuth(getOffers);
export const POST = withAuth(createOffer);
