// ===========================================
// PrepWithAI — Question Model
// Comprehensive question bank with solutions,
// examples, hints, analytics, and text search
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Interface ──────────────────────────────────────

export interface IQuestion extends Document {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  subcategory: string;
  companies: string[];
  frequency: number;

  // Learning aids
  hints: string[];
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  testCases: { input: string; expectedOutput: string; isPublic: boolean }[];

  // Solutions
  solutions: {
    approach: string;
    explanation: string;
    code: {
      javascript?: string;
      python?: string;
      java?: string;
      cpp?: string;
    };
    timeComplexity: string;
    spaceComplexity: string;
  }[];

  // Metadata
  tags: string[];
  timeLimit: number;
  videoExplanation?: string;

  // Analytics (denormalized)
  discussionCount: number;
  solvedCount: number;
  successRate: number;
  avgScore: number;

  // Status
  isActive: boolean;
  isPremium: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ─────────────────────────────────────────

const QuestionSchema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Question description is required"],
      maxlength: 5000,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    subcategory: {
      type: String,
      trim: true,
      lowercase: true,
    },
    companies: [{ type: String, trim: true, lowercase: true }],
    frequency: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },

    // Learning aids
    hints: [{ type: String }],
    constraints: [{ type: String }],
    examples: [
      {
        input: { type: String },
        output: { type: String },
        explanation: { type: String },
      },
    ],
    testCases: [
      {
        input: { type: String },
        expectedOutput: { type: String },
        isPublic: { type: Boolean, default: true },
      },
    ],

    // Solutions
    solutions: [
      {
        approach: { type: String },
        explanation: { type: String },
        code: {
          javascript: { type: String },
          python: { type: String },
          java: { type: String },
          cpp: { type: String },
        },
        timeComplexity: { type: String },
        spaceComplexity: { type: String },
      },
    ],

    // Metadata
    tags: [{ type: String, trim: true, lowercase: true }],
    timeLimit: { type: Number, default: 30, min: 5, max: 120 },
    videoExplanation: { type: String },

    // Analytics
    discussionCount: { type: Number, default: 0, min: 0 },
    solvedCount: { type: Number, default: 0, min: 0 },
    successRate: { type: Number, default: 0, min: 0, max: 100 },
    avgScore: { type: Number, default: 0, min: 0, max: 100 },

    // Status
    isActive: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Indexes ────────────────────────────────────────

QuestionSchema.index({ category: 1, difficulty: 1 });
QuestionSchema.index({ companies: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ solvedCount: -1 });
QuestionSchema.index({ successRate: 1 });
QuestionSchema.index(
  { title: "text", description: "text", tags: "text" },
  { weights: { title: 10, tags: 5, description: 1 } }
);

// ─── Export ─────────────────────────────────────────

const QuestionModel: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default QuestionModel;
