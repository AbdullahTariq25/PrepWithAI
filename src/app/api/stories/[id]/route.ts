import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { badRequest, notFound, serverError, success } from "@/lib/response";
import BehaviorStory, { BehaviorStoryStatus } from "@/models/BehaviorStory";

const STATUSES = new Set<BehaviorStoryStatus>(["draft", "ready"]);

function cleanString(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanTags(value: unknown) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, 40))
        .filter(Boolean),
    ),
  ).slice(0, 12);
}

async function patchStory(req: NextRequest, ctx: AuthContext) {
  try {
    const id = ctx.params.id;
    if (!mongoose.isValidObjectId(id)) return badRequest("Invalid story id");

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return badRequest("Invalid request body");

    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = cleanString(body.title, 160);
      if (!title) return badRequest("Story title cannot be empty");
      updates.title = title;
    }
    if (body.competency !== undefined) {
      updates.competency = cleanString(body.competency, 80) || "Leadership";
    }
    if (body.situation !== undefined) updates.situation = cleanString(body.situation, 3000);
    if (body.task !== undefined) updates.task = cleanString(body.task, 2500);
    if (body.action !== undefined) updates.action = cleanString(body.action, 5000);
    if (body.result !== undefined) updates.result = cleanString(body.result, 3000);
    if (body.reflection !== undefined) updates.reflection = cleanString(body.reflection, 2500);
    if (body.metrics !== undefined) updates.metrics = cleanString(body.metrics, 1200);
    if (body.tags !== undefined) updates.tags = cleanTags(body.tags);

    if (body.status !== undefined) {
      const status = cleanString(body.status, 20) as BehaviorStoryStatus;
      if (!STATUSES.has(status)) return badRequest("Invalid story status");
      updates.status = status;
    }

    if (Object.keys(updates).length > 0) {
      updates.evaluation = undefined;
    }

    const story = await BehaviorStory.findOneAndUpdate(
      { _id: id, userId: ctx.user.id },
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!story) return notFound("Behavioral story not found");
    return success({ story });
  } catch (error) {
    return serverError("Failed to update behavioral story", error);
  }
}

async function deleteStory(_req: NextRequest, ctx: AuthContext) {
  try {
    const id = ctx.params.id;
    if (!mongoose.isValidObjectId(id)) return badRequest("Invalid story id");

    const deleted = await BehaviorStory.findOneAndDelete({
      _id: id,
      userId: ctx.user.id,
    });

    if (!deleted) return notFound("Behavioral story not found");
    return success({ message: "Behavioral story deleted" });
  } catch (error) {
    return serverError("Failed to delete behavioral story", error);
  }
}

export const PATCH = withAuth(patchStory);
export const DELETE = withAuth(deleteStory);
