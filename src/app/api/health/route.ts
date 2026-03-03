// ===========================================
// PrepWithAI — Health Check API
// Monitors DB, Groq API, and system health
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { checkApiLimit } from "@/lib/groq";

export const dynamic = "force-dynamic";

// ─── Service Health Types ───────────────────────────

interface ServiceHealth {
  status: "healthy" | "degraded" | "unhealthy" | "unknown" | "rate_limited";
  latency?: number;
  message?: string;
}

// ─── GET Health ─────────────────────────────────────

export async function GET() {
  const services: Record<string, ServiceHealth> = {};
  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

  // 1. Check MongoDB
  const dbStart = Date.now();
  try {
    await dbConnect();
    services.database = {
      status: "healthy",
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    overallStatus = "degraded";
    services.database = {
      status: "unhealthy",
      latency: Date.now() - dbStart,
      message: error instanceof Error ? error.message : "Connection failed",
    };
  }

  // 2. Check Groq API availability
  try {
    const usage = await checkApiLimit();
    services.ai = {
      status: usage.allowed ? "healthy" : "rate_limited",
      message: usage.allowed
        ? `${usage.remaining}/${usage.limit} calls remaining`
        : "Daily API limit reached",
    };
    if (!usage.allowed) overallStatus = "degraded";
  } catch {
    services.ai = {
      status: "unknown",
      message: "Could not check API usage",
    };
  }

  // 3. Check required environment variables
  const requiredEnvVars = [
    "MONGODB_URI",
    "NEXTAUTH_SECRET",
    "GROQ_API_KEY",
  ];
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
  services.config = {
    status: missingVars.length === 0 ? "healthy" : "unhealthy",
    message:
      missingVars.length === 0
        ? "All required environment variables present"
        : `Missing: ${missingVars.join(", ")}`,
  };
  if (missingVars.length > 0) overallStatus = "unhealthy";

  // 4. Memory usage
  const mem = process.memoryUsage();
  services.memory = {
    status: mem.heapUsed / mem.heapTotal < 0.9 ? "healthy" : "degraded",
    message: `${Math.round(mem.heapUsed / 1024 / 1024)}MB / ${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
  };

  const statusCode = overallStatus === "healthy" ? 200 : 503;
  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      services,
    },
    { status: statusCode }
  );
}
