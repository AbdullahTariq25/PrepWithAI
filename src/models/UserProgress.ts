import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  skillScores: {
    problemSolving: number;
    communication: number;
    codeQuality: number;
    edgeCases: number;
    timeManagement: number;
  };
  weakTopics: string[];
  strongTopics: string[];
  dailyScores: { date: Date; score: number; sessions: number }[];
  streak: number;
  totalTime: number;
  totalSessions: number;
  sessionsThisWeek: number;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    skillScores: {
      problemSolving: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      codeQuality: { type: Number, default: 0 },
      edgeCases: { type: Number, default: 0 },
      timeManagement: { type: Number, default: 0 },
    },
    weakTopics: [{ type: String }],
    strongTopics: [{ type: String }],
    dailyScores: [
      {
        date: { type: Date },
        score: { type: Number },
        sessions: { type: Number },
      },
    ],
    streak: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    sessionsThisWeek: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserProgressModel: Model<IUserProgress> =
  mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>("UserProgress", UserProgressSchema);

export default UserProgressModel;
