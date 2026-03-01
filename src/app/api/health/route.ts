// ===========================================
// PrepWithAI — Health Check API
// Monitors DB, Groq API, and overall system health
// ===========================================

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { checkApiLimit } from "@/lib/api-usage";

export const dynamic = "force-dynamic";

export async function GET() {
  const health: {
    status: string;
    timestamp: string;
    services: Record<string, { status: string; latency?: number; message?: string }>;
  } = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {},
  };

  // Check MongoDB
  const dbStart = Date.now();
  try {
    await connectDB();
    health.services.database = {
      status: "healthy",
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    health.status = "degraded";
    health.services.database = {
      status: "unhealthy",
      latency: Date.now() - dbStart,
      message: error instanceof Error ? error.message : "Connection failed",
    };
  }

  // Check Groq API availability (via usage limits)
  try {
    const usage = await checkApiLimit();
    health.services.ai = {
      status: usage.allowed ? "healthy" : "rate_limited",
      message: usage.allowed
        ? `${usage.remaining}/${usage.limit} calls remaining today`
        : "Daily API limit reached",
    };
    if (!usage.allowed) {
      health.status = "degraded";
    }
  } catch {
    health.services.ai = {
      status: "unknown",
      message: "Could not check API usage",
    };
  }

  // Check environment variables
  const requiredEnvVars = [
    "MONGODB_URI",
    "NEXTAUTH_SECRET",
    "GROQ_API_KEY",
  ];
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
  health.services.config = {
    status: missingVars.length === 0 ? "healthy" : "unhealthy",
    message:
      missingVars.length === 0
        ? "All required environment variables present"
        : `Missing: ${missingVars.join(", ")}`,
  };

  const statusCode = health.status === "healthy" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
