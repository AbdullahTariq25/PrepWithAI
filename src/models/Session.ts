import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  type: "dsa" | "system_design" | "behavioral" | "frontend" | "backend" | "full_loop";
  company: string;
  difficulty: "junior" | "mid" | "senior" | "staff";
  voiceMode: boolean;
  messages: {
    id: string;
    role: "interviewer" | "candidate";
    content: string;
    timestamp: Date;
    isVoice: boolean;
  }[];
  questions: {
    questionId?: mongoose.Types.ObjectId;
    title: string;
    userAnswer: string;
    feedback: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      seniorTip: string;
      sampleAnswer: string;
    };
  }[];
  overallScore: number;
  duration: number;
  hintsUsed: number;
  completed: boolean;
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["dsa", "system_design", "behavioral", "frontend", "backend", "full_loop"],
      required: true,
    },
    company: { type: String, required: true },
    difficulty: { type: String, enum: ["junior", "mid", "senior", "staff"], required: true },
    voiceMode: { type: Boolean, default: false },
    messages: [
      {
        id: { type: String, required: true },
        role: { type: String, enum: ["interviewer", "candidate"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        isVoice: { type: Boolean, default: false },
      },
    ],
    questions: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        title: { type: String },
        userAnswer: { type: String },
        feedback: {
          score: { type: Number, default: 0 },
          strengths: [{ type: String }],
          weaknesses: [{ type: String }],
          seniorTip: { type: String },
          sampleAnswer: { type: String },
        },
      },
    ],
    overallScore: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SessionModel: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default SessionModel;
