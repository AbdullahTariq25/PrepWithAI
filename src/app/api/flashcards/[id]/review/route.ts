import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { badRequest, notFound, serverError, success } from "@/lib/response";
import { scheduleFlashcardReview } from "@/lib/spaced-repetition";
import FlashcardProgress, { FlashcardRating } from "@/models/FlashcardProgress";
import Question from "@/models/Question";

const RATINGS = new Set<FlashcardRating>(["again", "hard", "good", "easy"]);

async function handler(req: NextRequest, ctx: AuthContext) {
  try {
    const questionId = ctx.params.id;
    if (!mongoose.isValidObjectId(questionId)) {
      return badRequest("Invalid flashcard id");
    }

    const body = (await req.json().catch(() => null)) as { rating?: FlashcardRating } | null;
    const rating = body?.rating;
    if (!rating || !RATINGS.has(rating)) {
      return badRequest("Rating must be again, hard, good, or easy");
    }

    const questionExists = await Question.exists({ _id: questionId });
    if (!questionExists) return notFound("Flashcard not found");

    const existing = await FlashcardProgress.findOne({
      userId: ctx.user.id,
      questionId,
    }).lean();

    const schedule = scheduleFlashcardReview(
      {
        easeFactor: existing?.easeFactor || 2.5,
        intervalDays: existing?.intervalDays || 0,
        repetitions: existing?.repetitions || 0,
        reviewCount: existing?.reviewCount || 0,
        correctCount: existing?.correctCount || 0,
      },
      rating,
    );

    const progress = await FlashcardProgress.findOneAndUpdate(
      { userId: ctx.user.id, questionId },
      {
        $set: {
          ...schedule,
          lastRating: rating,
          lastReviewedAt: new Date(),
        },
        $setOnInsert: {
          userId: new mongoose.Types.ObjectId(ctx.user.id),
          questionId: new mongoose.Types.ObjectId(questionId),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return success({
      progress: {
        mastered: progress?.mastered || false,
        repetitions: progress?.repetitions || 0,
        reviewCount: progress?.reviewCount || 0,
        correctCount: progress?.correctCount || 0,
        intervalDays: progress?.intervalDays || 0,
        nextReviewAt: progress?.nextReviewAt || null,
        lastRating: progress?.lastRating || rating,
      },
    });
  } catch (error) {
    return serverError("Failed to save flashcard review", error);
  }
}

export const POST = withAuth(handler);
