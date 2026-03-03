// ===========================================
// PrepWithAI — Rate Limiter
// In-memory sliding window rate limiting
// for API route protection
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

// ─── Types ──────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// ─── In-Memory Store ────────────────────────────────

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ─── Rate Limit Check ───────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: limit - 1,
      limit,
      resetAt: now + windowMs,
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: limit - entry.count,
    limit,
    resetAt: entry.resetAt,
  };
}

// ─── Preset Rate Limiters ───────────────────────────

export function rateLimitAuth(ip: string): RateLimitResult {
  return checkRateLimit(`auth:${ip}`, 10, 15 * 60 * 1000); // 10 attempts per 15 min
}

export function rateLimitChat(userId: string): RateLimitResult {
  return checkRateLimit(`chat:${userId}`, 60, 60 * 1000); // 60 messages per minute
}

export function rateLimitApi(userId: string): RateLimitResult {
  return checkRateLimit(`api:${userId}`, 100, 60 * 1000); // 100 requests per minute
}
