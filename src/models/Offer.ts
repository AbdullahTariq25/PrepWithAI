import mongoose, { Document, Model, Schema } from "mongoose";

export type OfferStatus = "considering" | "negotiating" | "accepted" | "declined";

export interface IOffer extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  currency: string;
  baseAnnual: number;
  bonusAnnual: number;
  equityAnnual: number;
  signingBonus: number;
  benefitsAnnual: number;
  relocation: number;
  learningScore: number;
  growthScore: number;
  workLifeScore: number;
  brandScore: number;
  flexibilityScore: number;
  status: OfferStatus;
  deadline?: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 160 },
    currency: { type: String, trim: true, uppercase: true, maxlength: 8, default: "USD" },
    baseAnnual: { type: Number, min: 0, max: 1_000_000_000, default: 0 },
    bonusAnnual: { type: Number, min: 0, max: 1_000_000_000, default: 0 },
    equityAnnual: { type: Number, min: 0, max: 1_000_000_000, default: 0 },
    signingBonus: { type: Number, min: 0, max: 1_000_000_000, default: 0 },
    benefitsAnnual: { type: Number, min: 0, max: 1_000_000_000, default: 0 },
    relocation: { type: Number, min: 0, max: 1_000_000_000, default: 0 },
    learningScore: { type: Number, min: 1, max: 10, default: 5 },
    growthScore: { type: Number, min: 1, max: 10, default: 5 },
    workLifeScore: { type: Number, min: 1, max: 10, default: 5 },
    brandScore: { type: Number, min: 1, max: 10, default: 5 },
    flexibilityScore: { type: Number, min: 1, max: 10, default: 5 },
    status: {
      type: String,
      enum: ["considering", "negotiating", "accepted", "declined"],
      default: "considering",
      index: true,
    },
    deadline: { type: Date, index: true },
    notes: { type: String, maxlength: 5000, default: "" },
  },
  { timestamps: true },
);

OfferSchema.index({ userId: 1, status: 1, updatedAt: -1 });
OfferSchema.index({ userId: 1, deadline: 1 });

const Offer: Model<IOffer> =
  mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);

export default Offer;
