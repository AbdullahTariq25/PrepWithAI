// ===========================================
// PrepWithAI — Leaderboard API
// Ranked users with in-memory caching
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { success, badRequest, serverError } from "@/lib/response";
import { validateQuery, leaderboardQuerySchema } from "@/lib/validation";
import User from "@/models/User";

// ─── In-Memory Cache ────────────────────────────────

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

// ─── Types ──────────────────────────────────────────

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  image: string | null;
  eloRating: number;
  streak: number;
  totalSessions: number;
  avgScore: number;
  badges: string[];
  plan: string;
  isCurrentUser: boolean;
}

interface UserDoc {
  _id: { toString(): string };
  name?: string;
  image?: string;
  eloRating?: number;
  currentStreak?: number;
  totalSessions?: number;
  avgScore?: number;
  badges?: string[];
  plan?: string;
}

function toEntry(user: unknown, index: number): LeaderboardEntry {
  const u = user as UserDoc;
  return {
    rank: index + 1,
    id: u._id.toString(),
    name: u.name || "Anonymous",
    image: u.image || null,
    eloRating: u.eloRating || 1200,
    streak: u.currentStreak || 0,
    totalSessions: u.totalSessions || 0,
    avgScore: u.avgScore || 0,
    badges: u.badges || [],
    plan: u.plan || "free",
    isCurrentUser: false,
  };
}

// ─── GET Leaderboard ────────────────────────────────

async function handler(req: NextRequest, ctx: AuthContext) {
  try {
    const validated = validateQuery(req.url, leaderboardQuerySchema);
    if (validated.error || !validated.data) return badRequest(validated.error || "Invalid query");

    const { period, limit } = validated.data;
    const userId = ctx.user.id;
    const cacheKey = `leaderboard:${period}:${limit}`;

    // Check cache
    const cached = getCached(cacheKey) as {
      leaderboard: LeaderboardEntry[];
      totalUsers: number;
    } | null;

    let leaderboard: LeaderboardEntry[];
    let totalUsers: number;

    if (cached) {
      leaderboard = cached.leaderboard;
      totalUsers = cached.totalUsers;
    } else {
      // Build date filter
      const query: Record<string, unknown> = {};
      if (period === "weekly") {
        query.lastActiveDate = {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        };
      } else if (period === "monthly") {
        query.lastActiveDate = {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        };
      }

      const users = await User.find(query)
        .sort({ eloRating: -1 })
        .select(
          "name image eloRating currentStreak totalSessions avgScore badges plan"
        )
        .limit(limit)
        .lean();

      leaderboard = users.map((u, i) => toEntry(u, i));
      totalUsers = await User.countDocuments(query);

      // Cache the result
      setCache(cacheKey, { leaderboard, totalUsers });
    }

    // Mark current user
    const result = leaderboard.map((entry) => ({
      ...entry,
      isCurrentUser: entry.id === userId,
    }));

    // Find current user's rank if not in top results
    const currentUserInList = result.find((u) => u.isCurrentUser);
    let currentUserRank: LeaderboardEntry | null = null;

    if (!currentUserInList) {
      const currentUser = await User.findById(userId)
        .select(
          "name image eloRating currentStreak totalSessions avgScore badges plan"
        )
        .lean();

      if (currentUser) {
        const cu = currentUser as unknown as UserDoc;
        const elo = cu.eloRating || 1200;
        const higherCount = await User.countDocuments({
          eloRating: { $gt: elo },
        });
        const entry = toEntry(currentUser, higherCount);
        currentUserRank = { ...entry, isCurrentUser: true };
      }
    }

    return success({
      leaderboard: result,
      currentUserRank,
      totalUsers,
      cached: !!cached,
    });
  } catch (error) {
    return serverError("Failed to fetch leaderboard", error);
  }
}

// ─── Export ─────────────────────────────────────────

export const GET = withAuth(handler);
