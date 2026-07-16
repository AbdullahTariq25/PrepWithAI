import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { badRequest, created, serverError, success } from "@/lib/response";
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

async function getStories(req: NextRequest, ctx: AuthContext) {
  try {
    const filter: Record<string, unknown> = { userId: ctx.user.id };
    const status = req.nextUrl.searchParams.get("status") as BehaviorStoryStatus | null;
    const competency = cleanString(req.nextUrl.searchParams.get("competency"), 80);

    if (status && STATUSES.has(status)) filter.status = status;
    if (competency) filter.competency = competency;

    const stories = await BehaviorStory.find(filter)
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    const readyCount = await BehaviorStory.countDocuments({
      userId: ctx.user.id,
      status: "ready",
    });

    return success({
      stories,
      summary: {
        total: stories.length,
        ready: readyCount,
        evaluated: stories.filter((story) => Boolean(story.evaluation)).length,
      },
    });
  } catch (error) {
    return serverError("Failed to load behavioral stories", error);
  }
}

async function createStory(req: NextRequest, ctx: AuthContext) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return badRequest("Invalid request body");

    const title = cleanString(body.title, 160);
    const competency = cleanString(body.competency, 80) || "Leadership";
    const status = (cleanString(body.status, 20) || "draft") as BehaviorStoryStatus;

    if (!title) return badRequest("Story title is required");
    if (!STATUSES.has(status)) return badRequest("Invalid story status");

    const story = await BehaviorStory.create({
      userId: ctx.user.id,
      title,
      competency,
      situation: cleanString(body.situation, 3000),
      task: cleanString(body.task, 2500),
      action: cleanString(body.action, 5000),
      result: cleanString(body.result, 3000),
      reflection: cleanString(body.reflection, 2500),
      metrics: cleanString(body.metrics, 1200),
      tags: cleanTags(body.tags),
      status,
    });

    return created({ story });
  } catch (error) {
    return serverError("Failed to create behavioral story", error);
  }
}

export const GET = withAuth(getStories);
export const POST = withAuth(createStory);
