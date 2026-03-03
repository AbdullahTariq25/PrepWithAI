// ===========================================
// PrepWithAI — Standardized API Responses
// Consistent response format across all routes
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextResponse } from "next/server";

// ─── Success Responses ──────────────────────────────

export function success<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

// ─── Error Responses ────────────────────────────────

export function badRequest(message: string = "Bad request"): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message: string = "Unauthorized"): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message: string = "Forbidden"): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message: string = "Not found"): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function conflict(message: string = "Conflict"): NextResponse {
  return NextResponse.json({ error: message }, { status: 409 });
}

export function tooManyRequests(
  message: string = "Too many requests",
  retryAfter?: number
): NextResponse {
  const headers: Record<string, string> = {};
  if (retryAfter) {
    headers["Retry-After"] = String(retryAfter);
  }
  return NextResponse.json(
    { error: message, rateLimited: true },
    { status: 429, headers }
  );
}

export function serverError(
  message: string = "Internal server error",
  error?: unknown
): NextResponse {
  if (error) {
    console.error(`[ServerError] ${message}:`, error);
  }
  return NextResponse.json({ error: message }, { status: 500 });
}
