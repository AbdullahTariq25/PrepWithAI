import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "all";
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);

    await connectDB();

    const query = period === "weekly"
      ? { lastActiveDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
      : {};

    const users = await User.find(query)
      .sort({ eloRating: -1 })
      .select("name image eloRating currentStreak totalSessions avgScore badges plan")
      .limit(limit)
      .lean();

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id.toString(),
      name: user.name,
      image: user.image,
      eloRating: user.eloRating || 1200,
      streak: user.currentStreak || 0,
      totalSessions: user.totalSessions || 0,
      avgScore: user.avgScore || 0,
      badges: user.badges || [],
      plan: user.plan || "free",
      isCurrentUser: user._id.toString() === session.user.id,
    }));

    // Find current user's rank if not in top results
    const currentUserInList = leaderboard.find((u) => u.isCurrentUser);
    let currentUserRank = null;

    if (!currentUserInList) {
      const currentUser = await User.findById(session.user.id)
        .select("name image eloRating currentStreak totalSessions avgScore badges plan")
        .lean();

      if (currentUser) {
        const higherCount = await User.countDocuments({
          eloRating: { $gt: currentUser.eloRating || 1200 },
        });
        currentUserRank = {
          rank: higherCount + 1,
          id: currentUser._id.toString(),
          name: currentUser.name,
          image: currentUser.image,
          eloRating: currentUser.eloRating || 1200,
          streak: currentUser.currentStreak || 0,
          totalSessions: currentUser.totalSessions || 0,
          avgScore: currentUser.avgScore || 0,
          badges: currentUser.badges || [],
          plan: currentUser.plan || "free",
          isCurrentUser: true,
        };
      }
    }

    return NextResponse.json({
      leaderboard,
      currentUserRank,
      totalUsers: await User.countDocuments(),
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to get leaderboard" },
      { status: 500 }
    );
  }
}
