import mongoose, { Document, Model, Schema } from "mongoose";

export type JobTargetStatus =
  | "saved"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "archived";

export interface IJobTarget extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  location: string;
  url?: string;
  status: JobTargetStatus;
  jobDescription: string;
  notes: string;
  nextAction: string;
  nextActionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobTargetSchema = new Schema<IJobTarget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 160,
    },
    location: { type: String, trim: true, maxlength: 120, default: "" },
    url: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["saved", "applied", "interview", "offer", "rejected", "archived"],
      default: "saved",
      index: true,
    },
    jobDescription: { type: String, maxlength: 12_000, default: "" },
    notes: { type: String, maxlength: 5_000, default: "" },
    nextAction: { type: String, maxlength: 300, default: "" },
    nextActionAt: { type: Date, index: true },
  },
  { timestamps: true },
);

JobTargetSchema.index({ userId: 1, status: 1, updatedAt: -1 });
JobTargetSchema.index({ userId: 1, nextActionAt: 1 });

const JobTarget: Model<IJobTarget> =
  mongoose.models.JobTarget ||
  mongoose.model<IJobTarget>("JobTarget", JobTargetSchema);

export default JobTarget;
