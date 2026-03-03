import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need auth
  const publicRoutes = ["/", "/login", "/signup", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isApiAuth = pathname.startsWith("/api/auth");
  const isStripeWebhook = pathname === "/api/stripe/webhook";
  const isCronJob = pathname === "/api/cron";
  const isHealthCheck = pathname === "/api/health";
  const isShareRoute = pathname.startsWith("/api/share/");
  const isMarketingRoute =
    pathname.startsWith("/about") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/features") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/changelog") ||
    pathname.startsWith("/companies");

  // Allow public routes, auth API, stripe webhook, cron, health, share
  if (isPublicRoute || isApiAuth || isStripeWebhook || isCronJob || isHealthCheck || isShareRoute || isMarketingRoute) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // Check for session token (next-auth stores it as a cookie)
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  // Protected API routes
  if (pathname.startsWith("/api/") && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Protected pages — redirect to login
  if (!token && !pathname.startsWith("/api/")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

// ─── Security Headers ─────────────────────────────────

function addSecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
