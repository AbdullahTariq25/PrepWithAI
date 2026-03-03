// ===========================================
// PrepWithAI — API Usage Model
// Per-user, per-day API call tracking
// for rate limiting and analytics
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Interface ──────────────────────────────────────

export interface IApiUsage extends Document {
  userId?: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  provider: string;
  totalCalls: number;
  totalTokens: number;
  errorCount: number;
  lastCalledAt: Date;

  // Per-endpoint tracking
  endpoints: Map<string, number>;
}

// ─── Schema ─────────────────────────────────────────

const ApiUsageSchema = new Schema<IApiUsage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    provider: {
      type: String,
      required: true,
      default: "groq",
      trim: true,
    },
    totalCalls: { type: Number, default: 0, min: 0 },
    totalTokens: { type: Number, default: 0, min: 0 },
    errorCount: { type: Number, default: 0, min: 0 },
    lastCalledAt: { type: Date, default: Date.now },
    endpoints: { type: Map, of: Number, default: new Map() },
  },
  { timestamps: true }
);

// ─── Indexes ────────────────────────────────────────

ApiUsageSchema.index({ date: 1, provider: 1, userId: 1 }, { unique: true });
ApiUsageSchema.index({ userId: 1, date: -1 });
ApiUsageSchema.index({ date: -1 });

// ─── Export ─────────────────────────────────────────

const ApiUsageModel: Model<IApiUsage> =
  mongoose.models.ApiUsage || mongoose.model<IApiUsage>("ApiUsage", ApiUsageSchema);

export default ApiUsageModel;
