import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { success, serverError } from "@/lib/response";
import { getAuthSecretMode } from "@/lib/auth-secret";

async function handler(_req: NextRequest, ctx: AuthContext) {
  try {
    const started = Date.now();
    let databaseReady = false;

    try {
      if (!mongoose.connection.db) throw new Error("Database not connected");
      await mongoose.connection.db.admin().ping();
      databaseReady = true;
    } catch (error) {
      console.error("Readiness database ping failed", error);
    }

    const authMode = getAuthSecretMode();
    const aiReady = Boolean(process.env.GROQ_API_KEY);
    const codeExecutionReady = Boolean(process.env.JUDGE0_API_URL);
    const emailReady = Boolean(process.env.RESEND_API_KEY);
    const paymentsReady = Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
    );

    return success({
      ready: databaseReady && aiReady && authMode !== "missing",
      latencyMs: Date.now() - started,
      account: {
        authenticated: true,
        userId: ctx.user.id,
        plan: ctx.user.plan,
      },
      critical: {
        authentication: {
          ready: authMode !== "missing",
          mode: authMode === "preview-derived" ? "preview-fallback" : authMode,
        },
        database: { ready: databaseReady },
        aiInterview: { ready: aiReady },
      },
      optional: {
        codeExecution: { ready: codeExecutionReady },
        transactionalEmail: { ready: emailReady },
        payments: { ready: paymentsReady },
      },
      deployment: {
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
        version:
          process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ||
          process.env.NEXT_PUBLIC_APP_VERSION ||
          "development",
      },
    });
  } catch (error) {
    return serverError("Failed to run readiness diagnostics", error);
  }
}

export const GET = withAuth(handler);
