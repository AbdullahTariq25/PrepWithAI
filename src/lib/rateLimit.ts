import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import RateLimitBucket from "@/models/RateLimitBucket";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

const globalRateLimit = globalThis as typeof globalThis & {
  __prepWithAiRateLimitStore?: Map<string, RateLimitEntry>;
};

const fallbackStore =
  globalRateLimit.__prepWithAiRateLimitStore || new Map<string, RateLimitEntry>();
globalRateLimit.__prepWithAiRateLimitStore = fallbackStore;

function hashIdentifier(identifier: string): string {
  return crypto.createHash("sha256").update(identifier).digest("hex");
}

function localFallback(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  if (fallbackStore.size > 2_000) {
    for (const [storedKey, entry] of fallbackStore) {
      if (entry.resetAt <= now) fallbackStore.delete(storedKey);
      if (fallbackStore.size <= 1_500) break;
    }
  }

  const entry = fallbackStore.get(key);
  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    fallbackStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: Math.max(0, limit - 1), limit, resetAt };
  }

  entry.count += 1;
  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    limit,
    resetAt: entry.resetAt,
  };
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60 * 1000,
): Promise<RateLimitResult> {
  const key = hashIdentifier(identifier);
  const now = new Date();
  const newResetAt = new Date(now.getTime() + windowMs);

  try {
    await dbConnect();

    let bucket = await RateLimitBucket.findOneAndUpdate(
      { key, resetAt: { $gt: now } },
      { $inc: { count: 1 } },
      { new: true },
    );

    if (!bucket) {
      bucket = await RateLimitBucket.findOneAndUpdate(
        { key },
        {
          $set: {
            count: 1,
            resetAt: newResetAt,
          },
        },
        { upsert: true, new: true },
      );
    }

    const count = bucket?.count || 1;
    const resetAt = bucket?.resetAt?.getTime() || newResetAt.getTime();

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      limit,
      resetAt,
    };
  } catch (error) {
    // Rate limiting should remain available during a transient database incident,
    // but the bounded in-process fallback is intentionally less authoritative
    // than the distributed MongoDB bucket.
    console.error("Distributed rate limit check failed; using local fallback:", error);
    return localFallback(key, limit, windowMs);
  }
}

export function rateLimitAuth(ip: string): Promise<RateLimitResult> {
  return checkRateLimit(`auth:${ip}`, 10, 15 * 60 * 1000);
}

export function rateLimitChat(userId: string): Promise<RateLimitResult> {
  return checkRateLimit(`chat:${userId}`, 45, 60 * 1000);
}

export function rateLimitApi(userId: string): Promise<RateLimitResult> {
  return checkRateLimit(`api:${userId}`, 100, 60 * 1000);
}
