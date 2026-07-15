// ===========================================
// PrepWithAI — Session Model
// Complete interview session with messages,
// scoring, voice/video metrics, evaluation evidence, and sharing
// ===========================================

import mongoose, { Schema, Document, Model } from "mongoose";
import { nanoid } from "nanoid";

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

export interface IFeedbackEvidence {
  dimension:
    | "problemSolving"
    | "communication"
    | "codeQuality"
    | "edgeCases"
    | "timeManagement";
  quote: string;
  reason: string;
}

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  company: string;
  difficulty: string;
  voiceMode: boolean;
  videoMode: boolean;
  whiteboardData?: Record<string, unknown>;

  messages: IMessage[];
  questions: ISessionQuestion[];
  codeSubmissions: ICodeSubmission[];

  overallScore: number;
  grades: IGrades;
  eloChange: number;
  eloAfter: number;

  duration: number;
  hintsUsed: number;
  questionsAnswered: number;
  wordsSpoken: number;

  avgTranscriptConfidence: number;
  avgWordsPerMinute: number;

  completed: boolean;
  reportGenerated: boolean;
  feedbackProcessing: boolean;

  shareToken?: string;
  isPublic: boolean;

  strengths: string[];
  improvements: string[];
  summary?: string;
  seniorTip?: string;
  recommendedTopics: string[];
  feedbackEvidence: IFeedbackEvidence[];
  evaluationConfidence: number;
  nextPracticeFocus?: string;
  hiringSignal?: "strong_no" | "no" | "mixed" | "yes" | "strong_yes";
  rubricVersion?: string;
  feedbackGeneratedAt?: Date;

  createdAt: Date;
  updatedAt: Date;

  generateShareToken(): string;
}

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

    duration: { type: Number, default: 0, min: 0 },
    hintsUsed: { type: Number, default: 0, min: 0 },
    questionsAnswered: { type: Number, default: 0, min: 0 },
    wordsSpoken: { type: Number, default: 0, min: 0 },

    avgTranscriptConfidence: { type: Number, default: 0, min: 0, max: 1 },
    avgWordsPerMinute: { type: Number, default: 0, min: 0 },

    completed: { type: Boolean, default: false },
    reportGenerated: { type: Boolean, default: false },
    feedbackProcessing: { type: Boolean, default: false },

    shareToken: { type: String, unique: true, sparse: true },
    isPublic: { type: Boolean, default: false },

    strengths: [{ type: String }],
    improvements: [{ type: String }],
    summary: { type: String },
    seniorTip: { type: String },
    recommendedTopics: [{ type: String }],
    feedbackEvidence: [
      {
        dimension: {
          type: String,
          enum: [
            "problemSolving",
            "communication",
            "codeQuality",
            "edgeCases",
            "timeManagement",
          ],
        },
        quote: { type: String, maxlength: 240 },
        reason: { type: String, maxlength: 320 },
      },
    ],
    evaluationConfidence: { type: Number, default: 0, min: 0, max: 100 },
    nextPracticeFocus: { type: String, maxlength: 400 },
    hiringSignal: {
      type: String,
      enum: ["strong_no", "no", "mixed", "yes", "strong_yes"],
    },
    rubricVersion: { type: String },
    feedbackGeneratedAt: { type: Date },
  },
  { timestamps: true },
);

SessionSchema.index({ userId: 1, createdAt: -1 });
SessionSchema.index({ userId: 1, completed: 1 });
SessionSchema.index({ userId: 1, type: 1 });
SessionSchema.index({ completed: 1, createdAt: -1 });
SessionSchema.index({ company: 1, overallScore: -1 });

SessionSchema.pre("save", function () {
  const voiceMessages = this.messages.filter(
    (message) => message.isVoice && message.role === "candidate",
  );

  if (voiceMessages.length > 0) {
    const confidences = voiceMessages
      .map((message) => message.transcriptConfidence)
      .filter((value): value is number => value !== undefined && value !== null);
    if (confidences.length > 0) {
      this.avgTranscriptConfidence =
        confidences.reduce((sum, value) => sum + value, 0) / confidences.length;
    }

    const wpms = voiceMessages
      .map((message) => message.wordsPerMinute)
      .filter((value): value is number => value !== undefined && value !== null);
    if (wpms.length > 0) {
      this.avgWordsPerMinute =
        wpms.reduce((sum, value) => sum + value, 0) / wpms.length;
    }
  }

  this.questionsAnswered = this.questions.filter(
    (question) => question.userAnswer || question.codeAnswer,
  ).length;

  this.wordsSpoken = this.messages
    .filter((message) => message.role === "candidate")
    .reduce(
      (sum, message) => sum + (message.content?.split(/\s+/).length || 0),
      0,
    );
});

SessionSchema.methods.generateShareToken = function (): string {
  this.shareToken = nanoid(12);
  this.isPublic = true;
  return this.shareToken;
};

const SessionModel: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default SessionModel;
