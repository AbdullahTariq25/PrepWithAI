import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { badRequest, notFound, serverError, success } from "@/lib/response";
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

async function patchOffer(req: NextRequest, ctx: AuthContext) {
  try {
    const id = ctx.params.id;
    if (!mongoose.isValidObjectId(id)) return badRequest("Invalid offer id");

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return badRequest("Invalid request body");

    const updates: Record<string, unknown> = {};

    if (body.company !== undefined) {
      const company = cleanString(body.company, 120);
      if (!company) return badRequest("Company cannot be empty");
      updates.company = company;
    }
    if (body.role !== undefined) {
      const role = cleanString(body.role, 160);
      if (!role) return badRequest("Role cannot be empty");
      updates.role = role;
    }
    if (body.currency !== undefined) updates.currency = (cleanString(body.currency, 8) || "USD").toUpperCase();

    for (const field of [
      "baseAnnual",
      "bonusAnnual",
      "equityAnnual",
      "signingBonus",
      "benefitsAnnual",
      "relocation",
    ]) {
      if (body[field] !== undefined) updates[field] = cleanNumber(body[field]);
    }

    for (const field of [
      "learningScore",
      "growthScore",
      "workLifeScore",
      "brandScore",
      "flexibilityScore",
    ]) {
      if (body[field] !== undefined) updates[field] = cleanScore(body[field]);
    }

    if (body.status !== undefined) {
      const status = cleanString(body.status, 20) as OfferStatus;
      if (!STATUSES.has(status)) return badRequest("Invalid offer status");
      updates.status = status;
    }

    if (body.deadline !== undefined) {
      if (body.deadline === null || body.deadline === "") {
        updates.deadline = undefined;
      } else if (typeof body.deadline === "string") {
        const parsed = new Date(body.deadline);
        if (Number.isNaN(parsed.getTime())) return badRequest("Invalid offer deadline");
        updates.deadline = parsed;
      }
    }

    if (body.notes !== undefined) updates.notes = cleanString(body.notes, 5000);

    const offer = await Offer.findOneAndUpdate(
      { _id: id, userId: ctx.user.id },
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!offer) return notFound("Offer not found");
    return success({ offer });
  } catch (error) {
    return serverError("Failed to update offer", error);
  }
}

async function deleteOffer(_req: NextRequest, ctx: AuthContext) {
  try {
    const id = ctx.params.id;
    if (!mongoose.isValidObjectId(id)) return badRequest("Invalid offer id");

    const deleted = await Offer.findOneAndDelete({ _id: id, userId: ctx.user.id });
    if (!deleted) return notFound("Offer not found");

    return success({ message: "Offer deleted" });
  } catch (error) {
    return serverError("Failed to delete offer", error);
  }
}

export const PATCH = withAuth(patchOffer);
export const DELETE = withAuth(deleteOffer);
