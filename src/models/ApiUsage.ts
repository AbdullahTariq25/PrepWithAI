// ===========================================
// PrepWithAI — API Usage Tracking Model
// Tracks Groq API calls for rate limiting
// ===========================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApiUsage extends Document {
  date: string; // YYYY-MM-DD format
  provider: string;
  totalCalls: number;
  totalTokens: number;
  errorCount: number;
  lastCalledAt: Date;
}

const ApiUsageSchema = new Schema<IApiUsage>({
  date: { type: String, required: true, index: true },
  provider: { type: String, required: true, default: "groq" },
  totalCalls: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  errorCount: { type: Number, default: 0 },
  lastCalledAt: { type: Date, default: Date.now },
});

ApiUsageSchema.index({ date: 1, provider: 1 }, { unique: true });

const ApiUsageModel: Model<IApiUsage> =
  mongoose.models.ApiUsage || mongoose.model<IApiUsage>("ApiUsage", ApiUsageSchema);

export default ApiUsageModel;
