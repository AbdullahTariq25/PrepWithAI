// ===========================================
// PrepWithAI - TypeScript Types
// Built by Abdullah Tariq
// ===========================================

export type InterviewType =
  | "dsa"
  | "system_design"
  | "behavioral"
  | "frontend"
  | "backend"
  | "full_loop";

export type CompanyStyle =
  | "google"
  | "meta"
  | "amazon"
  | "stripe"
  | "microsoft"
  | "startup"
  | "general";

export type DifficultyLevel = "junior" | "mid" | "senior" | "staff";

export type PlanType = "free" | "pro" | "team";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionCategory =
  | "array"
  | "string"
  | "linkedlist"
  | "tree"
  | "graph"
  | "dp"
  | "sorting"
  | "system_design"
  | "behavioral"
  | "frontend"
  | "backend"
  | "sql";

// User
export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  plan: PlanType;
  resumeUrl?: string;
  resumeParsed?: ResumeData;
  totalSessions: number;
  avgScore: number;
  streak: number;
  onboarded: boolean;
  targetCompany?: CompanyStyle;
  experienceLevel?: DifficultyLevel;
  createdAt: string;
  updatedAt: string;
}

// Resume
export interface ResumeData {
  name: string;
  skills: string[];
  projects: { name: string; description: string; tech: string[] }[];
  experience: { title: string; company: string; duration: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  summary: string;
}

// Session
export interface Session {
  _id: string;
  userId: string;
  type: InterviewType;
  company: CompanyStyle;
  difficulty: DifficultyLevel;
  messages: Message[];
  questions: SessionQuestion[];
  overallScore: number;
  duration: number;
  hintsUsed: number;
  completed: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: string;
  isVoice: boolean;
}

export interface SessionQuestion {
  questionId: string;
  title: string;
  userAnswer: string;
  feedback: QuestionFeedback;
}

export interface QuestionFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  seniorTip: string;
  sampleAnswer: string;
}

// Question
export interface Question {
  _id: string;
  title: string;
  description: string;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  companies: CompanyStyle[];
  frequency: number;
  hints: string[];
  solutionApproaches: string[];
  tags: string[];
  timeLimit: number;
  constraints?: string[];
  examples?: { input: string; output: string; explanation?: string }[];
}

// User Progress
export interface UserProgress {
  userId: string;
  skillScores: SkillScores;
  weakTopics: string[];
  strongTopics: string[];
  dailyScores: DailyScore[];
  streak: number;
  totalTime: number;
  totalSessions: number;
  sessionsThisWeek: number;
}

export interface SkillScores {
  problemSolving: number;
  communication: number;
  codeQuality: number;
  edgeCases: number;
  timeManagement: number;
}

export interface DailyScore {
  date: string;
  score: number;
  sessions: number;
}

// Session Report
export interface SessionReport {
  overallScore: number;
  scoreLabel: string;
  breakdown: {
    category: string;
    score: number;
    maxScore: number;
  }[];
  questionsAsked: number;
  hintsUsed: number;
  timeTaken: number;
  percentile: number;
  topImprovements: string[];
  recommendedSessions: {
    title: string;
    description: string;
    type: InterviewType;
  }[];
}

// Company Prep Pack
export interface CompanyPrepPack {
  id: CompanyStyle;
  name: string;
  description: string;
  logo: string;
  color: string;
  interviewFormat: string;
  culture: string;
  rounds: InterviewRound[];
  tips: string[];
  questionCount: number;
  prepSchedule: PrepDay[];
  readinessScore?: number;
}

export interface InterviewRound {
  name: string;
  duration: string;
  focus: string;
  description: string;
}

export interface PrepDay {
  day: number;
  title: string;
  tasks: string[];
  type: InterviewType;
}

// AI Chat
export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Voice Mode
export interface VoiceState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  isSpeaking: boolean;
  error: string | null;
}

// API Responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
