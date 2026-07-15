import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveAuthSecret } from "@/lib/auth-secret";

const PUBLIC_EXACT_ROUTES = new Set([
  "/",
  "/demo",
  "/login",
  "/signup",
  "/auth/error",
  "/reset-password",
  "/forgot-password",
]);

const PUBLIC_PREFIXES = [
  "/about",
  "/blog",
  "/features",
  "/pricing",
  "/terms",
  "/privacy",
  "/changelog",
  "/companies",
  "/api/auth",
  "/api/share/",
];

const PUBLIC_API_ROUTES = new Set([
  "/api/stripe/webhook",
  "/api/cron",
  "/api/health",
]);

function isPublic(pathname: string) {
  return (
    PUBLIC_EXACT_ROUTES.has(pathname) ||
    PUBLIC_API_ROUTES.has(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );
}

function secure(response: NextResponse, requestId: string): NextResponse {
  response.headers.set("X-Request-Id", requestId);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return response;
}

function nextResponse(request: NextRequest, requestId: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  return secure(
    NextResponse.next({
      request: { headers: requestHeaders },
    }),
    requestId,
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  if (isPublic(pathname)) {
    return nextResponse(request, requestId);
  }

  let token = null;
  try {
    const secret = resolveAuthSecret();
    if (!secret) throw new Error("Authentication secret is not configured");

    token = await getToken({
      req: request,
      secret,
      secureCookie: request.nextUrl.protocol === "https:",
    });
  } catch (error) {
    console.error("Session validation failed", { requestId, error });
  }

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return secure(
        NextResponse.json({ error: "Unauthorized", requestId }, { status: 401 }),
        requestId,
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
    return secure(NextResponse.redirect(loginUrl), requestId);
  }

  return nextResponse(request, requestId);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
