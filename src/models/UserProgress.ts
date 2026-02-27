import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  eloRating: number;
  skillScores: {
    problemSolving: number;
    communication: number;
    codeQuality: number;
    edgeCases: number;
    timeManagement: number;
  };
  categoryScores: {
    dsa: number;
    systemDesign: number;
    behavioral: number;
    frontend: number;
    backend: number;
  };
  topicScores: Map<string, number>;
  weakTopics: string[];
  strongTopics: string[];
  dailyScores: { date: Date; score: number; sessions: number }[];
  streak: number;
  maxStreak: number;
  totalTime: number;
  totalSessions: number;
  sessionsThisWeek: number;
  companiesReadiness: Map<string, number>;
  solvedProblems: mongoose.Types.ObjectId[];
  weeklyGoal: number;
  bestTimeOfDay: string;
  performanceByDifficulty: Map<string, number>;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    eloRating: { type: Number, default: 1200 },
    skillScores: {
      problemSolving: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      codeQuality: { type: Number, default: 0 },
      edgeCases: { type: Number, default: 0 },
      timeManagement: { type: Number, default: 0 },
    },
    categoryScores: {
      dsa: { type: Number, default: 0 },
      systemDesign: { type: Number, default: 0 },
      behavioral: { type: Number, default: 0 },
      frontend: { type: Number, default: 0 },
      backend: { type: Number, default: 0 },
    },
    topicScores: { type: Map, of: Number, default: {} },
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
    maxStreak: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    sessionsThisWeek: { type: Number, default: 0 },
    companiesReadiness: { type: Map, of: Number, default: {} },
    solvedProblems: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    weeklyGoal: { type: Number, default: 5 },
    bestTimeOfDay: { type: String },
    performanceByDifficulty: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

const UserProgressModel: Model<IUserProgress> =
  mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>("UserProgress", UserProgressSchema);

export default UserProgressModel;
