import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  subcategory: string;
  companies: string[];
  frequency: number;
  hints: string[];
  solutions: {
    approach: string;
    explanation: string;
    code: { javascript?: string; python?: string; java?: string; cpp?: string };
    timeComplexity: string;
    spaceComplexity: string;
  }[];
  tags: string[];
  timeLimit: number;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  testCases: { input: string; expectedOutput: string; isPublic: boolean }[];
  discussionCount: number;
  solvedCount: number;
  successRate: number;
  videoExplanation: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    companies: [{ type: String }],
    frequency: { type: Number, default: 5, min: 1, max: 10 },
    hints: [{ type: String }],
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
    tags: [{ type: String }],
    timeLimit: { type: Number, default: 30 },
    constraints: [{ type: String }],
    examples: [
      { input: { type: String }, output: { type: String }, explanation: { type: String } },
    ],
    testCases: [
      { input: { type: String }, expectedOutput: { type: String }, isPublic: { type: Boolean, default: true } },
    ],
    discussionCount: { type: Number, default: 0 },
    solvedCount: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    videoExplanation: { type: String },
  },
  { timestamps: true }
);

QuestionSchema.index({ category: 1, difficulty: 1 });
QuestionSchema.index({ companies: 1 });
QuestionSchema.index({ tags: 1 });

const QuestionModel: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default QuestionModel;
