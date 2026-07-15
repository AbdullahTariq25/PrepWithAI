import mongoose, { Document, Model, Schema } from "mongoose";

export type FlashcardRating = "again" | "hard" | "good" | "easy";

export interface IFlashcardProgress extends Document {
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  reviewCount: number;
  correctCount: number;
  lastRating?: FlashcardRating;
  lastReviewedAt?: Date;
  nextReviewAt: Date;
  mastered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardProgressSchema = new Schema<IFlashcardProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
    easeFactor: { type: Number, min: 1.3, max: 3.5, default: 2.5 },
    intervalDays: { type: Number, min: 0, default: 0 },
    repetitions: { type: Number, min: 0, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    correctCount: { type: Number, min: 0, default: 0 },
    lastRating: {
      type: String,
      enum: ["again", "hard", "good", "easy"],
    },
    lastReviewedAt: { type: Date },
    nextReviewAt: { type: Date, default: Date.now, index: true },
    mastered: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

FlashcardProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
FlashcardProgressSchema.index({ userId: 1, nextReviewAt: 1 });

const FlashcardProgress: Model<IFlashcardProgress> =
  mongoose.models.FlashcardProgress ||
  mongoose.model<IFlashcardProgress>("FlashcardProgress", FlashcardProgressSchema);

export default FlashcardProgress;
