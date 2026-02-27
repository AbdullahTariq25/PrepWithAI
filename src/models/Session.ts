import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  company: string;
  difficulty: string;
  voiceMode: boolean;
  whiteboardData?: Record<string, unknown>;
  messages: {
    id: string;
    role: "interviewer" | "candidate";
    content: string;
    timestamp: Date;
    isVoice: boolean;
    transcriptConfidence?: number;
  }[];
  questions: {
    questionId?: mongoose.Types.ObjectId;
    title: string;
    userAnswer: string;
    codeAnswer?: string;
    hintsUsed: number;
    timeSpent: number;
    feedback: {
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
    };
  }[];
  codeSubmissions: {
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
  }[];
  overallScore: number;
  grades: {
    problemSolving: number;
    communication: number;
    codeQuality: number;
    edgeCases: number;
    timeManagement: number;
  };
  duration: number;
  hintsUsed: number;
  completed: boolean;
  reportGenerated: boolean;
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      required: true,
    },
    company: { type: String, required: true },
    difficulty: { type: String, required: true },
    voiceMode: { type: Boolean, default: false },
    whiteboardData: { type: Schema.Types.Mixed },
    messages: [
      {
        id: { type: String, required: true },
        role: { type: String, enum: ["interviewer", "candidate"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        isVoice: { type: Boolean, default: false },
        transcriptConfidence: { type: Number },
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
    overallScore: { type: Number, default: 0 },
    grades: {
      problemSolving: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      codeQuality: { type: Number, default: 0 },
      edgeCases: { type: Number, default: 0 },
      timeManagement: { type: Number, default: 0 },
    },
    duration: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    reportGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SessionSchema.index({ userId: 1, createdAt: -1 });
SessionSchema.index({ completed: 1 });

const SessionModel: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default SessionModel;
