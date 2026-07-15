import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function buildVersion() {
  return (
    process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ||
    process.env.NEXT_PUBLIC_APP_VERSION ||
    "development"
  );
}

function liveness() {
  return {
    status: "ok",
    service: "PrepWithAI",
    version: buildVersion(),
    timestamp: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const deep = request.nextUrl.searchParams.get("deep") === "1";
  if (!deep) {
    return NextResponse.json(liveness(), {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const expectedSecret = process.env.HEALTH_CHECK_SECRET || process.env.CRON_SECRET;
  const providedSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checks: Record<string, { status: "ok" | "error"; latencyMs?: number }> = {};
  let databaseHealthy = false;

  const databaseStarted = Date.now();
  try {
    await dbConnect();
    if (!mongoose.connection.db) throw new Error("MongoDB connection is not ready");
    await mongoose.connection.db.admin().ping();
    databaseHealthy = true;
    checks.database = { status: "ok", latencyMs: Date.now() - databaseStarted };
  } catch (error) {
    console.error("Health check database failure:", error);
    checks.database = { status: "error", latencyMs: Date.now() - databaseStarted };
  }

  checks.aiConfiguration = { status: process.env.GROQ_API_KEY ? "ok" : "error" };
  checks.authConfiguration = {
    status: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET ? "ok" : "error",
  };

  const healthy =
    databaseHealthy &&
    checks.aiConfiguration.status === "ok" &&
    checks.authConfiguration.status === "ok";

  return NextResponse.json(
    {
      ...liveness(),
      status: healthy ? "ok" : "degraded",
      checks,
    },
    {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "X-PrepWithAI-Version": buildVersion(),
    },
  });
}
