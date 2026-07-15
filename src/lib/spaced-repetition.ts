import type { FlashcardRating } from "@/models/FlashcardProgress";

export interface ReviewState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  reviewCount: number;
  correctCount: number;
}

export interface ReviewSchedule extends ReviewState {
  nextReviewAt: Date;
  mastered: boolean;
}

const MIN_EASE = 1.3;
const MAX_EASE = 3.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function addDays(now: Date, days: number) {
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

export function scheduleFlashcardReview(
  state: ReviewState,
  rating: FlashcardRating,
  now = new Date(),
): ReviewSchedule {
  let easeFactor = state.easeFactor || 2.5;
  let intervalDays = state.intervalDays || 0;
  let repetitions = state.repetitions || 0;
  const reviewCount = (state.reviewCount || 0) + 1;
  let correctCount = state.correctCount || 0;

  if (rating === "again") {
    easeFactor = clamp(easeFactor - 0.2, MIN_EASE, MAX_EASE);
    intervalDays = 10 / (24 * 60); // review again in about 10 minutes
    repetitions = 0;
  } else if (rating === "hard") {
    easeFactor = clamp(easeFactor - 0.15, MIN_EASE, MAX_EASE);
    intervalDays = Math.max(1, intervalDays > 0 ? intervalDays * 1.2 : 1);
    repetitions += 1;
    correctCount += 1;
  } else if (rating === "good") {
    intervalDays =
      repetitions === 0
        ? 1
        : repetitions === 1
          ? 3
          : Math.max(1, intervalDays * easeFactor);
    repetitions += 1;
    correctCount += 1;
  } else {
    easeFactor = clamp(easeFactor + 0.15, MIN_EASE, MAX_EASE);
    intervalDays =
      repetitions === 0
        ? 4
        : Math.max(4, intervalDays * easeFactor * 1.3);
    repetitions += 1;
    correctCount += 1;
  }

  intervalDays = Math.round(intervalDays * 100) / 100;
  const mastered = repetitions >= 4 && intervalDays >= 21;

  return {
    easeFactor,
    intervalDays,
    repetitions,
    reviewCount,
    correctCount,
    nextReviewAt: addDays(now, intervalDays),
    mastered,
  };
}
