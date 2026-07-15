export type AuthSecretMode = "explicit" | "preview-derived" | "development" | "missing";

function explicitSecret(): string | undefined {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || undefined;
}

function previewSecretSeed(): string | undefined {
  if (process.env.VERCEL_ENV !== "preview") return undefined;

  const privateSeed =
    process.env.MONGODB_URI ||
    process.env.GROQ_API_KEY ||
    process.env.STRIPE_SECRET_KEY ||
    undefined;

  if (!privateSeed) return undefined;

  const deploymentIdentity = [
    process.env.VERCEL_PROJECT_ID,
    process.env.VERCEL_GIT_REPO_ID,
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.VERCEL_URL,
  ]
    .filter(Boolean)
    .join(":");

  return [
    "prepwithai-preview-auth-v1",
    deploymentIdentity || "preview",
    privateSeed,
  ].join(":");
}

export function getAuthSecretMode(): AuthSecretMode {
  if (explicitSecret()) return "explicit";
  if (previewSecretSeed()) return "preview-derived";
  if (process.env.NODE_ENV !== "production") return "development";
  return "missing";
}

export function resolveAuthSecret(): string | undefined {
  const explicit = explicitSecret();
  if (explicit) return explicit;

  const preview = previewSecretSeed();
  if (preview) return preview;

  if (process.env.NODE_ENV !== "production") {
    return "prepwithai-local-development-auth-secret-v1";
  }

  return undefined;
}

export function requireAuthSecret(): string {
  const secret = resolveAuthSecret();
  if (!secret) {
    throw new Error(
      "AUTH_SECRET or NEXTAUTH_SECRET is required for production authentication.",
    );
  }
  return secret;
}
