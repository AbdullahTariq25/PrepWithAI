import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { badRequest, notFound, serverError, success } from "@/lib/response";
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
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function patchJob(req: NextRequest, ctx: AuthContext) {
  try {
    const id = ctx.params.id;
    if (!mongoose.isValidObjectId(id)) return badRequest("Invalid job id");

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return badRequest("Invalid request body");

    const updates: Record<string, unknown> = {};

    if (body.company !== undefined) {
      const value = cleanString(body.company, 120);
      if (!value) return badRequest("Company cannot be empty");
      updates.company = value;
    }
    if (body.role !== undefined) {
      const value = cleanString(body.role, 160);
      if (!value) return badRequest("Role cannot be empty");
      updates.role = value;
    }
    if (body.location !== undefined) updates.location = cleanString(body.location, 120);
    if (body.jobDescription !== undefined) updates.jobDescription = cleanString(body.jobDescription, 12_000);
    if (body.notes !== undefined) updates.notes = cleanString(body.notes, 5_000);
    if (body.nextAction !== undefined) updates.nextAction = cleanString(body.nextAction, 300);

    if (body.url !== undefined) {
      const url = cleanUrl(body.url);
      if (url === null) return badRequest("Job URL must be a valid http or https URL");
      updates.url = url || undefined;
    }

    if (body.status !== undefined) {
      const status = cleanString(body.status, 30) as JobTargetStatus;
      if (!STATUSES.has(status)) return badRequest("Invalid job status");
      updates.status = status;
    }

    if (body.nextActionAt !== undefined) {
      if (body.nextActionAt === null || body.nextActionAt === "") {
        updates.nextActionAt = undefined;
      } else if (typeof body.nextActionAt === "string") {
        const parsed = new Date(body.nextActionAt);
        if (Number.isNaN(parsed.getTime())) return badRequest("Invalid next action date");
        updates.nextActionAt = parsed;
      }
    }

    const job = await JobTarget.findOneAndUpdate(
      { _id: id, userId: ctx.user.id },
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!job) return notFound("Job target not found");
    return success({ job });
  } catch (error) {
    return serverError("Failed to update job target", error);
  }
}

async function deleteJob(_req: NextRequest, ctx: AuthContext) {
  try {
    const id = ctx.params.id;
    if (!mongoose.isValidObjectId(id)) return badRequest("Invalid job id");

    const deleted = await JobTarget.findOneAndDelete({
      _id: id,
      userId: ctx.user.id,
    });
    if (!deleted) return notFound("Job target not found");

    return success({ message: "Job target deleted" });
  } catch (error) {
    return serverError("Failed to delete job target", error);
  }
}

export const PATCH = withAuth(patchJob);
export const DELETE = withAuth(deleteJob);
