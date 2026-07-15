import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { badRequest, created, serverError, success } from "@/lib/response";
import JobTarget, { JobTargetStatus } from "@/models/JobTarget";

const STATUSES = new Set<JobTargetStatus>([
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
  "archived",
]);

function cleanString(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanUrl(value: unknown) {
  const raw = cleanString(value, 1000);
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function getJobs(req: NextRequest, ctx: AuthContext) {
  try {
    const requestedStatus = req.nextUrl.searchParams.get("status") as JobTargetStatus | null;
    const filter: Record<string, unknown> = { userId: ctx.user.id };

    if (requestedStatus && STATUSES.has(requestedStatus)) {
      filter.status = requestedStatus;
    } else if (req.nextUrl.searchParams.get("includeArchived") !== "1") {
      filter.status = { $ne: "archived" };
    }

    const jobs = await JobTarget.find(filter)
      .sort({ nextActionAt: 1, updatedAt: -1 })
      .lean();

    const counts = await JobTarget.aggregate([
      { $match: { userId: new (await import("mongoose")).default.Types.ObjectId(ctx.user.id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return success({
      jobs,
      counts: Object.fromEntries(counts.map((item) => [item._id, item.count])),
    });
  } catch (error) {
    return serverError("Failed to load job targets", error);
  }
}

async function createJob(req: NextRequest, ctx: AuthContext) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return badRequest("Invalid request body");

    const company = cleanString(body.company, 120);
    const role = cleanString(body.role, 160);
    const location = cleanString(body.location, 120);
    const jobDescription = cleanString(body.jobDescription, 12_000);
    const notes = cleanString(body.notes, 5_000);
    const nextAction = cleanString(body.nextAction, 300);
    const url = cleanUrl(body.url);
    const status = (cleanString(body.status, 30) || "saved") as JobTargetStatus;

    if (!company || !role) return badRequest("Company and role are required");
    if (url === null) return badRequest("Job URL must be a valid http or https URL");
    if (!STATUSES.has(status)) return badRequest("Invalid job status");

    let nextActionAt: Date | undefined;
    if (typeof body.nextActionAt === "string" && body.nextActionAt.trim()) {
      const parsed = new Date(body.nextActionAt);
      if (Number.isNaN(parsed.getTime())) return badRequest("Invalid next action date");
      nextActionAt = parsed;
    }

    const job = await JobTarget.create({
      userId: ctx.user.id,
      company,
      role,
      location,
      url,
      status,
      jobDescription,
      notes,
      nextAction,
      nextActionAt,
    });

    return created({ job });
  } catch (error) {
    return serverError("Failed to create job target", error);
  }
}

export const GET = withAuth(getJobs);
export const POST = withAuth(createJob);
