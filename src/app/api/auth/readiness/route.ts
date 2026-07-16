import { NextResponse } from "next/server";
import { getAuthSecretMode } from "@/lib/auth-secret";

export const dynamic = "force-dynamic";

export async function GET() {
  const mode = getAuthSecretMode();
  const ready = mode === "explicit" || mode === "server-derived" || mode === "development";

  return NextResponse.json(
    {
      ready,
      environment:
        process.env.VERCEL_ENV ||
        (process.env.NODE_ENV === "production" ? "production" : "development"),
      configuration: mode,
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
