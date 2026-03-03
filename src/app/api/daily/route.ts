// ===========================================
// PrepWithAI — Daily Challenge Route
// GET /api/daily
// Returns 6 random questions as daily challenges
// (2 easy, 3 medium, 1 hard)
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { withAuth } from "@/lib/withAuth";
import { success, serverError } from "@/lib/response";
import Question from "@/models/Question";

async function handler() {
  try {
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      Question.aggregate([
        { $match: { difficulty: "easy", isActive: { $ne: false } } },
        { $sample: { size: 2 } },
      ]),
      Question.aggregate([
        { $match: { difficulty: "medium", isActive: { $ne: false } } },
        { $sample: { size: 3 } },
      ]),
      Question.aggregate([
        { $match: { difficulty: "hard", isActive: { $ne: false } } },
        { $sample: { size: 1 } },
      ]),
    ]);

    const challenges = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
    ].map((q) => ({
      id: q._id.toString(),
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      category: q.category,
      type:
        q.category === "behavioral"
          ? "behavioral"
          : q.category === "system-design"
            ? "system-design"
            : "coding",
      timeLimit: q.timeLimit || 20,
      points:
        q.difficulty === "easy"
          ? 30
          : q.difficulty === "medium"
            ? 75
            : 150,
      completedBy: q.solvedCount || 0,
      isCompleted: false,
      isLocked: false,
    }));

    return success({ challenges });
  } catch (error) {
    return serverError("Failed to fetch daily challenges", error);
  }
}

export const GET = withAuth(handler);
