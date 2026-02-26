import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  companies: string[];
  frequency: number;
  hints: string[];
  solutionApproaches: string[];
  tags: string[];
  timeLimit: number;
  constraints?: string[];
  examples?: { input: string; output: string; explanation?: string }[];
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    category: { type: String, required: true, index: true },
    companies: [{ type: String }],
    frequency: { type: Number, default: 5, min: 1, max: 10 },
    hints: [{ type: String }],
    solutionApproaches: [{ type: String }],
    tags: [{ type: String }],
    timeLimit: { type: Number, default: 30 },
    constraints: [{ type: String }],
    examples: [
      {
        input: { type: String },
        output: { type: String },
        explanation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

QuestionSchema.index({ category: 1, difficulty: 1 });
QuestionSchema.index({ companies: 1 });
QuestionSchema.index({ tags: 1 });

const QuestionModel: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default QuestionModel;
