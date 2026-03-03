// ===========================================
// PrepWithAI — Sessions History Route
// GET /api/sessions
// Returns paginated session history with
// filtering by type, company, difficulty
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { success, serverError } from "@/lib/response";
import Session from "@/models/Session";

async function handler(req: NextRequest, { user }: AuthContext) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(url.searchParams.get("limit") || "20"));
    const type = url.searchParams.get("type");
    const company = url.searchParams.get("company");
    const difficulty = url.searchParams.get("difficulty");
    const completed = url.searchParams.get("completed");

    // Build filter
    const filter: Record<string, unknown> = { userId: user.id };
    if (type) filter.type = type;
    if (company) filter.company = company.toLowerCase();
    if (difficulty) filter.difficulty = difficulty;
    if (completed === "true") filter.completed = true;
    if (completed === "false") filter.completed = false;

    const [sessions, total] = await Promise.all([
      Session.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          "type company difficulty overallScore duration hintsUsed completed voiceMode videoMode createdAt eloChange grades"
        )
        .lean(),
      Session.countDocuments(filter),
    ]);

    return success({
      sessions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return serverError("Failed to get sessions", error);
  }
}

export const GET = withAuth(handler);
