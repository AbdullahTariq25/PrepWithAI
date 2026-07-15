import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { success, badRequest, serverError } from "@/lib/response";
import { validateQuery, flashcardsQuerySchema } from "@/lib/validation";
import Question from "@/models/Question";
import FlashcardProgress from "@/models/FlashcardProgress";

interface QuestionDoc {
  _id: { toString(): string };
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  hints: string[];
  solution?: string;
}

interface ProgressDoc {
  questionId: { toString(): string };
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  reviewCount: number;
  correctCount: number;
  nextReviewAt: Date;
  lastReviewedAt?: Date;
  lastRating?: string;
  mastered: boolean;
}

async function handler(req: NextRequest, ctx: AuthContext) {
  try {
    const validated = validateQuery(req.url, flashcardsQuerySchema);
    if (validated.error || !validated.data) {
      return badRequest(validated.error || "Invalid query");
    }

    const { category, limit } = validated.data;
    const dueOnly = req.nextUrl.searchParams.get("dueOnly") === "1";
    const filter: Record<string, unknown> = {};

    if (category && category !== "All" && category !== "all") {
      filter.category = category.toLowerCase().replace(/\s+/g, "-");
    }

    const questions = (await Question.find(filter)
      .select("title description difficulty category hints solution")
      .limit(Math.min(limit * 3, 150))
      .lean()) as unknown as QuestionDoc[];

    const questionIds = questions.map((question) => question._id);
    const progressRows = (await FlashcardProgress.find({
      userId: ctx.user.id,
      questionId: { $in: questionIds },
    }).lean()) as unknown as ProgressDoc[];

    const progressMap = new Map(
      progressRows.map((row) => [row.questionId.toString(), row]),
    );
    const now = Date.now();

    const cards = questions
      .map((question) => {
        const id = question._id.toString();
        const progress = progressMap.get(id);
        const due = !progress || new Date(progress.nextReviewAt).getTime() <= now;
        const reviewCount = progress?.reviewCount || 0;
        const correctCount = progress?.correctCount || 0;

        return {
          id,
          front: `${question.title}: ${question.description}`,
          back:
            question.solution ||
            (Array.isArray(question.hints) && question.hints.length > 0
              ? `${question.hints.join(". ")}.`
              : "Review the problem, state your assumptions, and explain the solution approach step by step."),
          category: question.category || "general",
          difficulty: question.difficulty || "medium",
          due,
          mastered: progress?.mastered || false,
          progress: {
            repetitions: progress?.repetitions || 0,
            reviewCount,
            retention: reviewCount > 0 ? Math.round((correctCount / reviewCount) * 100) : null,
            intervalDays: progress?.intervalDays || 0,
            nextReviewAt: progress?.nextReviewAt || null,
            lastReviewedAt: progress?.lastReviewedAt || null,
            lastRating: progress?.lastRating || null,
          },
        };
      })
      .filter((card) => !dueOnly || card.due)
      .sort((a, b) => {
        if (a.due !== b.due) return a.due ? -1 : 1;
        if (a.mastered !== b.mastered) return a.mastered ? 1 : -1;
        const aNext = a.progress.nextReviewAt
          ? new Date(a.progress.nextReviewAt).getTime()
          : 0;
        const bNext = b.progress.nextReviewAt
          ? new Date(b.progress.nextReviewAt).getTime()
          : 0;
        return aNext - bNext;
      })
      .slice(0, limit);

    const categories = Array.from(
      new Set(
        questions
          .map((question) => question.category)
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort();

    return success({
      flashcards: cards,
      total: cards.length,
      stats: {
        due: cards.filter((card) => card.due).length,
        mastered: cards.filter((card) => card.mastered).length,
        reviewed: cards.filter((card) => card.progress.reviewCount > 0).length,
      },
      categories,
    });
  } catch (error) {
    return serverError("Failed to fetch flashcards", error);
  }
}

export const GET = withAuth(handler);
