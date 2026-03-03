// ===========================================
// PrepWithAI — Session Model
// Complete interview session with messages,
// scoring, voice/video metrics, and sharing
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import mongoose, { Schema, Document, Model } from "mongoose";
import { nanoid } from "nanoid";

// ─── Sub-interfaces ─────────────────────────────────

export interface IMessage {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: Date;
  isVoice: boolean;
  transcriptConfidence?: number;
  wordsPerMinute?: number;
}

export interface IQuestionFeedback {
  score: number;
  correctness: number;
  communication: number;
  optimization: number;
  completeness: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  seniorTip: string;
  sampleAnswer: string;
  explanation: string;
}

export interface ISessionQuestion {
  questionId?: mongoose.Types.ObjectId;
  title: string;
  userAnswer: string;
  codeAnswer?: string;
  hintsUsed: number;
  timeSpent: number;
  feedback: IQuestionFeedback;
}

export interface ICodeSubmission {
  language: string;
  code: string;
  output?: string;
  testResults?: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    executionTime: number;
  }[];
  timeComplexity?: string;
  spaceComplexity?: string;
  executionTime?: number;
  memoryUsed?: number;
  submittedAt: Date;
}

export interface IGrades {
  problemSolving: number;
  communication: number;
  codeQuality: number;
  edgeCases: number;
  timeManagement: number;
}

// ─── Main Interface ─────────────────────────────────

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  company: string;
  difficulty: string;
  voiceMode: boolean;
  videoMode: boolean;
  whiteboardData?: Record<string, unknown>;

  // Conversation
  messages: IMessage[];
  questions: ISessionQuestion[];
  codeSubmissions: ICodeSubmission[];

  // Scoring
  overallScore: number;
  grades: IGrades;
  eloChange: number;
  eloAfter: number;

  // Metrics
  duration: number;
  hintsUsed: number;
  questionsAnswered: number;
  wordsSpoken: number;

  // Voice/Video metrics
  avgTranscriptConfidence: number;
  avgWordsPerMinute: number;

  // Status
  completed: boolean;
  reportGenerated: boolean;

  // Sharing
  shareToken?: string;
  isPublic: boolean;

  // AI feedback summary
  strengths: string[];
  improvements: string[];
  summary?: string;
  seniorTip?: string;
  recommendedTopics: string[];

  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  generateShareToken(): string;
}

// ─── Schema ─────────────────────────────────────────

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, "Interview type is required"],
      trim: true,
    },
    company: {
      type: String,
      required: true,
      default: "general",
      trim: true,
      lowercase: true,
    },
    difficulty: {
      type: String,
      required: true,
      default: "mid",
      enum: ["junior", "mid", "senior", "staff"],
    },
    voiceMode: { type: Boolean, default: false },
    videoMode: { type: Boolean, default: false },
    whiteboardData: { type: Schema.Types.Mixed },

    // Conversation
    messages: [
      {
        id: { type: String, required: true },
        role: {
          type: String,
          enum: ["interviewer", "candidate"],
          required: true,
        },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        isVoice: { type: Boolean, default: false },
        transcriptConfidence: { type: Number, min: 0, max: 1 },
        wordsPerMinute: { type: Number, min: 0 },
      },
    ],
    questions: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        title: { type: String },
        userAnswer: { type: String },
        codeAnswer: { type: String },
        hintsUsed: { type: Number, default: 0 },
        timeSpent: { type: Number, default: 0 },
        feedback: {
          score: { type: Number, default: 0 },
          correctness: { type: Number, default: 0 },
          communication: { type: Number, default: 0 },
          optimization: { type: Number, default: 0 },
          completeness: { type: Number, default: 0 },
          confidence: { type: Number, default: 0 },
          strengths: [{ type: String }],
          weaknesses: [{ type: String }],
          seniorTip: { type: String },
          sampleAnswer: { type: String },
          explanation: { type: String },
        },
      },
    ],
    codeSubmissions: [
      {
        language: { type: String },
        code: { type: String },
        output: { type: String },
        testResults: [
          {
            input: { type: String },
            expectedOutput: { type: String },
            actualOutput: { type: String },
            passed: { type: Boolean },
            executionTime: { type: Number },
          },
        ],
        timeComplexity: { type: String },
        spaceComplexity: { type: String },
        executionTime: { type: Number },
        memoryUsed: { type: Number },
        submittedAt: { type: Date, default: Date.now },
      },
    ],

    // Scoring
    overallScore: { type: Number, default: 0, min: 0, max: 100 },
    grades: {
      problemSolving: { type: Number, default: 0, min: 0, max: 100 },
      communication: { type: Number, default: 0, min: 0, max: 100 },
      codeQuality: { type: Number, default: 0, min: 0, max: 100 },
      edgeCases: { type: Number, default: 0, min: 0, max: 100 },
      timeManagement: { type: Number, default: 0, min: 0, max: 100 },
    },
    eloChange: { type: Number, default: 0 },
    eloAfter: { type: Number, default: 0 },

    // Metrics
    duration: { type: Number, default: 0, min: 0 },
    hintsUsed: { type: Number, default: 0, min: 0 },
    questionsAnswered: { type: Number, default: 0, min: 0 },
    wordsSpoken: { type: Number, default: 0, min: 0 },

    // Voice/Video metrics
    avgTranscriptConfidence: { type: Number, default: 0, min: 0, max: 1 },
    avgWordsPerMinute: { type: Number, default: 0, min: 0 },

    // Status
    completed: { type: Boolean, default: false },
    reportGenerated: { type: Boolean, default: false },

    // Sharing
    shareToken: { type: String, unique: true, sparse: true },
    isPublic: { type: Boolean, default: false },

    // AI feedback
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    summary: { type: String },
    seniorTip: { type: String },
    recommendedTopics: [{ type: String }],
  },
  { timestamps: true }
);

// ─── Indexes ────────────────────────────────────────

SessionSchema.index({ userId: 1, createdAt: -1 });
SessionSchema.index({ userId: 1, completed: 1 });
SessionSchema.index({ userId: 1, type: 1 });
// shareToken index is already defined via field-level unique:true
SessionSchema.index({ completed: 1, createdAt: -1 });
SessionSchema.index({ company: 1, overallScore: -1 });

// ─── Pre-save Middleware ────────────────────────────

SessionSchema.pre("save", function () {
  // Auto-calculate voice metrics from messages
  const voiceMessages = this.messages.filter((m) => m.isVoice && m.role === "candidate");
  if (voiceMessages.length > 0) {
    const confidences = voiceMessages
      .map((m) => m.transcriptConfidence)
      .filter((c): c is number => c !== undefined && c !== null);
    if (confidences.length > 0) {
      this.avgTranscriptConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    }

    const wpms = voiceMessages
      .map((m) => m.wordsPerMinute)
      .filter((w): w is number => w !== undefined && w !== null);
    if (wpms.length > 0) {
      this.avgWordsPerMinute = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    }
  }

  // Auto-count questions answered
  this.questionsAnswered = this.questions.filter((q) => q.userAnswer || q.codeAnswer).length;

  // Auto-count words spoken by candidate
  this.wordsSpoken = this.messages
    .filter((m) => m.role === "candidate")
    .reduce((sum, m) => sum + (m.content?.split(/\s+/).length || 0), 0);
});

// ─── Instance Methods ───────────────────────────────

SessionSchema.methods.generateShareToken = function (): string {
  this.shareToken = nanoid(12);
  this.isPublic = true;
  return this.shareToken;
};

// ─── Export ─────────────────────────────────────────

const SessionModel: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default SessionModel;
