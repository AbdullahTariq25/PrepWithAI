import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_EXACT_ROUTES = new Set([
  "/",
  "/login",
  "/signup",
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

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return addSecurityHeaders(NextResponse.next());
  }

  let token = null;
  try {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
      secureCookie: request.nextUrl.protocol === "https:",
    });
  } catch (error) {
    console.error("Session validation failed:", error);
  }

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
    return addSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
