// ===========================================
// PrepWithAI — UserProgress Model
// Tracks daily scores, category mastery,
// company readiness, skills, ELO history, heatmap
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Interface ──────────────────────────────────────

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;

  // ELO
  eloRating: number;
  eloHistory: { date: Date; rating: number; change: number }[];

  // Skills radar
  skillScores: {
    problemSolving: number;
    communication: number;
    codeQuality: number;
    edgeCases: number;
    timeManagement: number;
  };

  // Category mastery
  categoryScores: {
    dsa: number;
    systemDesign: number;
    behavioral: number;
    frontend: number;
    backend: number;
  };

  // Granular topic tracking
  topicScores: Map<string, number>;
  weakTopics: string[];
  strongTopics: string[];

  // Daily performance
  dailyScores: { date: Date; score: number; sessions: number }[];

  // Streaks
  streak: number;
  maxStreak: number;

  // Aggregate stats
  totalTime: number;
  totalSessions: number;
  sessionsThisWeek: number;

  // Company readiness (0-100 per company)
  companiesReadiness: Map<string, number>;

  // Problem tracking
  solvedProblems: mongoose.Types.ObjectId[];

  // Goals & insights
  weeklyGoal: number;
  bestTimeOfDay: string;
  performanceByDifficulty: Map<string, number>;

  // Heatmap (YYYY-MM-DD → session count)
  heatmap: Map<string, number>;

  updatedAt: Date;
  createdAt: Date;
}

// ─── Schema ─────────────────────────────────────────

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ELO
    eloRating: { type: Number, default: 1200 },
    eloHistory: [
      {
        date: { type: Date, default: Date.now },
        rating: { type: Number },
        change: { type: Number },
      },
    ],

    // Skills radar
    skillScores: {
      problemSolving: { type: Number, default: 0, min: 0, max: 100 },
      communication: { type: Number, default: 0, min: 0, max: 100 },
      codeQuality: { type: Number, default: 0, min: 0, max: 100 },
      edgeCases: { type: Number, default: 0, min: 0, max: 100 },
      timeManagement: { type: Number, default: 0, min: 0, max: 100 },
    },

    // Category mastery
    categoryScores: {
      dsa: { type: Number, default: 0, min: 0, max: 100 },
      systemDesign: { type: Number, default: 0, min: 0, max: 100 },
      behavioral: { type: Number, default: 0, min: 0, max: 100 },
      frontend: { type: Number, default: 0, min: 0, max: 100 },
      backend: { type: Number, default: 0, min: 0, max: 100 },
    },

    // Granular topics
    topicScores: { type: Map, of: Number, default: new Map() },
    weakTopics: [{ type: String }],
    strongTopics: [{ type: String }],

    // Daily scores (kept for last 90 days)
    dailyScores: [
      {
        date: { type: Date },
        score: { type: Number, min: 0, max: 100 },
        sessions: { type: Number, min: 0 },
      },
    ],

    // Streaks
    streak: { type: Number, default: 0, min: 0 },
    maxStreak: { type: Number, default: 0, min: 0 },

    // Aggregates
    totalTime: { type: Number, default: 0, min: 0 },
    totalSessions: { type: Number, default: 0, min: 0 },
    sessionsThisWeek: { type: Number, default: 0, min: 0 },

    // Company readiness
    companiesReadiness: { type: Map, of: Number, default: new Map() },

    // Problem tracking
    solvedProblems: [{ type: Schema.Types.ObjectId, ref: "Question" }],

    // Goals & insights
    weeklyGoal: { type: Number, default: 5, min: 1, max: 30 },
    bestTimeOfDay: { type: String },
    performanceByDifficulty: { type: Map, of: Number, default: new Map() },

    // Heatmap
    heatmap: { type: Map, of: Number, default: new Map() },
  },
  { timestamps: true }
);

// ─── Indexes ────────────────────────────────────────

// userId index is already defined via field-level unique:true
UserProgressSchema.index({ eloRating: -1 });

// ─── Export ─────────────────────────────────────────

const UserProgressModel: Model<IUserProgress> =
  mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>("UserProgress", UserProgressSchema);

export default UserProgressModel;
