// Sentry instrumentation for Next.js server-side
// This file must be named instrumentation.ts and placed in the project root or src/
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}
