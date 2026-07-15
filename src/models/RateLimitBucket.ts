import mongoose, { Model, Schema } from "mongoose";

export interface IRateLimitBucket {
  key: string;
  count: number;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RateLimitBucketSchema = new Schema<IRateLimitBucket>(
  {
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, required: true, default: 0, min: 0 },
    resetAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

const RateLimitBucket: Model<IRateLimitBucket> =
  mongoose.models.RateLimitBucket ||
  mongoose.model<IRateLimitBucket>("RateLimitBucket", RateLimitBucketSchema);

export default RateLimitBucket;
