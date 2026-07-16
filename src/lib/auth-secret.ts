export type AuthSecretMode =
  | "explicit"
  | "server-derived"
  | "development"
  | "build-only"
  | "missing";

function explicitSecret(): string | undefined {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || undefined;
}

function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function serverPrivateSeed(): string | undefined {
  return (
    process.env.MONGODB_URI ||
    process.env.GROQ_API_KEY ||
    process.env.HEALTH_CHECK_SECRET ||
    process.env.CRON_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    process.env.RESEND_API_KEY ||
    process.env.JUDGE0_API_KEY ||
    process.env.SENTRY_AUTH_TOKEN ||
    undefined
  );
}

function deploymentIdentity(): string {
  return [
    process.env.VERCEL_PROJECT_ID,
    process.env.VERCEL_GIT_REPO_ID,
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.VERCEL_URL,
    process.env.VERCEL_ENV,
  ]
    .filter(Boolean)
    .join(":");
}

function serverDerivedSecret(): string | undefined {
  if (!process.env.VERCEL && !process.env.VERCEL_ENV) return undefined;

  const privateSeed = serverPrivateSeed();
  if (!privateSeed) return undefined;

  return [
    "prepwithai-vercel-auth-v2",
    deploymentIdentity() || "vercel-deployment",
    privateSeed,
  ].join(":");
}

export function getAuthSecretMode(): AuthSecretMode {
  if (explicitSecret()) return "explicit";
  if (serverDerivedSecret()) return "server-derived";
  if (process.env.NODE_ENV !== "production") return "development";
  if (isProductionBuild()) return "build-only";
  return "missing";
}

export function resolveAuthSecret(): string | undefined {
  const explicit = explicitSecret();
  if (explicit) return explicit;

  const derived = serverDerivedSecret();
  if (derived) return derived;

  if (process.env.NODE_ENV !== "production") {
    return "prepwithai-local-development-auth-secret-v1";
  }

  if (isProductionBuild()) {
    // This value exists only so Next.js can evaluate route modules while compiling.
    // A deployed production runtime without an explicit or server-derived secret
    // still fails closed when the module is initialized outside the build phase.
    return "prepwithai-build-only-auth-secret-not-valid-at-runtime";
  }

  return undefined;
}

export function requireAuthSecret(): string {
  const secret = resolveAuthSecret();
  if (!secret) {
    throw new Error(
      "AUTH_SECRET or NEXTAUTH_SECRET is required unless a secure server-derived secret is available.",
    );
  }
  return secret;
}
