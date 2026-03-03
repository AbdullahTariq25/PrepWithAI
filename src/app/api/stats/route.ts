// ===========================================
// PrepWithAI — Public Stats API
// GET /api/stats (No auth required)
// Returns real platform stats from MongoDB
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    await dbConnect();

    const [userCount, sessionCount, avgResult] = await Promise.all([
      User.countDocuments(),
      Session.countDocuments({ completed: true }),
      Session.aggregate([
        { $match: { completed: true, overallScore: { $gt: 0 } } },
        { $group: { _id: null, avgScore: { $avg: "$overallScore" } } },
      ]),
    ]);

    const avgScore = Math.round(avgResult[0]?.avgScore || 0);

    // Honest thresholds — never lie, just round to nearest milestone
    const displayUsers = userCount < 10 ? "10+" : `${Math.floor(userCount / 10) * 10}+`;
    const displaySessions = sessionCount < 100 ? "100+" : `${Math.floor(sessionCount / 100) * 100}+`;
    const displayAvgScore = avgScore > 0 ? `${avgScore}%` : null;

    return NextResponse.json({
      users: userCount,
      sessions: sessionCount,
      avgScore,
      displayUsers,
      displaySessions,
      displayAvgScore,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { users: 0, sessions: 0, avgScore: 0, displayUsers: "10+", displaySessions: "100+", displayAvgScore: null },
      { status: 200 }
    );
  }
}
