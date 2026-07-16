import mongoose, { Document, Model, Schema } from "mongoose";

export type BehaviorStoryStatus = "draft" | "ready";

export interface BehaviorStoryEvaluation {
  overallScore: number;
  specificity: number;
  ownership: number;
  impact: number;
  reflection: number;
  structure: number;
  summary: string;
  improvements: string[];
  evaluatedAt: Date;
}

export interface IBehaviorStory extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  competency: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  reflection: string;
  metrics: string;
  tags: string[];
  status: BehaviorStoryStatus;
  evaluation?: BehaviorStoryEvaluation;
  createdAt: Date;
  updatedAt: Date;
}

const BehaviorStoryEvaluationSchema = new Schema<BehaviorStoryEvaluation>(
  {
    overallScore: { type: Number, min: 0, max: 100, required: true },
    specificity: { type: Number, min: 0, max: 100, required: true },
    ownership: { type: Number, min: 0, max: 100, required: true },
    impact: { type: Number, min: 0, max: 100, required: true },
    reflection: { type: Number, min: 0, max: 100, required: true },
    structure: { type: Number, min: 0, max: 100, required: true },
    summary: { type: String, maxlength: 1000, default: "" },
    improvements: {
      type: [{ type: String, maxlength: 300 }],
      default: [],
    },
    evaluatedAt: { type: Date, required: true },
  },
  { _id: false },
);

const BehaviorStorySchema = new Schema<IBehaviorStory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 160,
    },
    competency: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "Leadership",
      index: true,
    },
    situation: { type: String, maxlength: 3000, default: "" },
    task: { type: String, maxlength: 2500, default: "" },
    action: { type: String, maxlength: 5000, default: "" },
    result: { type: String, maxlength: 3000, default: "" },
    reflection: { type: String, maxlength: 2500, default: "" },
    metrics: { type: String, maxlength: 1200, default: "" },
    tags: {
      type: [{ type: String, trim: true, maxlength: 40 }],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "ready"],
      default: "draft",
      index: true,
    },
    evaluation: { type: BehaviorStoryEvaluationSchema, required: false },
  },
  { timestamps: true },
);

BehaviorStorySchema.index({ userId: 1, updatedAt: -1 });
BehaviorStorySchema.index({ userId: 1, status: 1, competency: 1 });

const BehaviorStory: Model<IBehaviorStory> =
  mongoose.models.BehaviorStory ||
  mongoose.model<IBehaviorStory>("BehaviorStory", BehaviorStorySchema);

export default BehaviorStory;
