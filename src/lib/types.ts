// ===========================================
// PrepWithAI — Complete TypeScript Types
// The Complete Developer Career Platform
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

// ─── Core Enums ───────────────────────────────────

export type InterviewType =
  | "dsa"
  | "system_design"
  | "behavioral"
  | "frontend"
  | "backend"
  | "full_loop"
  | "devops"
  | "mobile"
  | "machine_learning"
  | "product_management"
  | "leadership"
  | "full_stack";

export type CompanySlug =
  | "google"
  | "meta"
  | "amazon"
  | "apple"
  | "netflix"
  | "microsoft"
  | "stripe"
  | "shopify"
  | "airbnb"
  | "uber"
  | "lyft"
  | "notion"
  | "systems_limited"
  | "techlogix"
  | "10pearls"
  | "netsol"
  | "arbisoft"
  | "gitlab"
  | "automattic"
  | "toptal"
  | "general";

export type DifficultyLevel = "junior" | "mid" | "senior" | "staff";

export type PlanType = "free" | "pro" | "team" | "enterprise";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionCategory =
  | "array"
  | "string"
  | "linkedlist"
  | "tree"
  | "graph"
  | "dp"
  | "sorting"
  | "bit_manipulation"
  | "math"
  | "sliding_window"
  | "two_pointers"
  | "stack_queue"
  | "heap"
  | "system_design"
  | "behavioral"
  | "frontend"
  | "backend"
  | "sql"
  | "devops"
  | "react"
  | "javascript"
  | "typescript"
  | "css"
  | "api_design"
  | "database"
  | "caching"
  | "auth"
  | "microservices";

export type CodeLanguage = "javascript" | "python" | "java" | "cpp";

// ─── User ────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  username?: string;
  plan: PlanType;
  planExpiresAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentRole?: string;
  targetRole?: string;
  experienceYears?: number;
  targetCompanies: string[];
  targetDate?: string;
  experienceLevel?: DifficultyLevel;
  resumeUrl?: string;
  resumeParsed?: ResumeData;
  emailNotifications: boolean;
  weeklyReport: boolean;
  voiceEnabled: boolean;
  preferredLanguage: CodeLanguage;
  timezone?: string;
  totalSessions: number;
  avgScore: number;
  currentStreak: number;
  maxStreak: number;
  eloRating: number;
  onboarded: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}

// ─── Resume ──────────────────────────────────────

export interface ResumeData {
  name: string;
  email?: string;
  phone?: string;
  skills: string[];
  projects: ResumeProject[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  summary: string;
  certifications?: string[];
  atsScore?: number;
  keywordDensity?: Record<string, number>;
  actionVerbScore?: number;
  quantificationScore?: number;
  suggestions?: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  highlights?: string[];
}

export interface ResumeExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
  location?: string;
  highlights?: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  year: string;
  gpa?: string;
}

// ─── Session ─────────────────────────────────────

export interface Session {
  _id: string;
  userId: string;
  type: InterviewType;
  company: CompanySlug;
  difficulty: DifficultyLevel;
  voiceMode: boolean;
  whiteboardData?: Record<string, unknown>;
  messages: Message[];
  questions: SessionQuestion[];
  overallScore: number;
  grades: SessionGrades;
  duration: number;
  hintsUsed: number;
  completed: boolean;
  reportGenerated: boolean;
  codeSubmissions: CodeSubmission[];
  createdAt: string;
}

export interface SessionGrades {
  problemSolving: number;
  communication: number;
  codeQuality: number;
  edgeCases: number;
  timeManagement: number;
}

export interface Message {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: string;
  isVoice: boolean;
  audioUrl?: string;
  transcriptConfidence?: number;
}

export interface SessionQuestion {
  questionId: string;
  title: string;
  userAnswer: string;
  codeAnswer?: string;
  hintsUsed: number;
  timeSpent: number;
  feedback: QuestionFeedback;
}

export interface QuestionFeedback {
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

export interface CodeSubmission {
  language: CodeLanguage;
  code: string;
  output?: string;
  testResults?: TestResult[];
  timeComplexity?: string;
  spaceComplexity?: string;
  executionTime?: number;
  memoryUsed?: number;
  submittedAt: string;
}

export interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: number;
}

// ─── Question ────────────────────────────────────

export interface Question {
  _id: string;
  title: string;
  description: string;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  subcategory?: string;
  companies: CompanySlug[];
  frequency: number;
  hints: string[];
  solutions: QuestionSolution[];
  tags: string[];
  timeLimit: number;
  constraints?: string[];
  examples?: QuestionExample[];
  testCases?: TestCase[];
  discussionCount: number;
  solvedCount: number;
  successRate: number;
  relatedQuestions?: string[];
  videoExplanation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionSolution {
  approach: string;
  explanation: string;
  code: Partial<Record<CodeLanguage, string>>;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface QuestionExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isPublic: boolean;
}

// ─── User Progress ───────────────────────────────

export interface UserProgress {
  userId: string;
  eloRating: number;
  skillScores: SkillScores;
  categoryScores: CategoryScores;
  topicScores: Record<string, number>;
  weakTopics: string[];
  strongTopics: string[];
  dailyScores: DailyScore[];
  streak: number;
  maxStreak: number;
  totalTime: number;
  totalSessions: number;
  sessionsThisWeek: number;
  companiesReadiness: Record<string, number>;
  solvedProblems: string[];
  weeklyGoal: number;
  bestTimeOfDay?: string;
  performanceByDifficulty: Record<string, number>;
}

export interface SkillScores {
  problemSolving: number;
  communication: number;
  codeQuality: number;
  edgeCases: number;
  timeManagement: number;
}

export interface CategoryScores {
  dsa: number;
  systemDesign: number;
  behavioral: number;
  frontend: number;
  backend: number;
}

export interface DailyScore {
  date: string;
  score: number;
  sessions: number;
}

// ─── Company ─────────────────────────────────────

export interface CompanyPrepPack {
  id: CompanySlug;
  name: string;
  description: string;
  logo: string;
  color: string;
  region: "faang" | "top_startup" | "pakistan" | "remote";
  interviewFormat: string;
  culture: string;
  rounds: InterviewRound[];
  tips: string[];
  questionCount: number;
  prepSchedule: PrepDay[];
  readinessScore?: number;
  averageSalary?: { min: number; max: number; currency: string };
  interviewExperiences: InterviewExperience[];
  insiderTips: InsiderTip[];
}

export interface InterviewRound {
  name: string;
  duration: string;
  focus: string;
  description: string;
  tips?: string[];
}

export interface PrepDay {
  day: number;
  title: string;
  tasks: string[];
  type: InterviewType;
}

export interface InterviewExperience {
  role: string;
  level: string;
  outcome: "accepted" | "rejected" | "pending";
  date: string;
  rounds: { type: string; questions: string[]; difficulty: string }[];
  tips: string;
  verified: boolean;
}

export interface InsiderTip {
  content: string;
  upvotes: number;
  authorVerified: boolean;
}

// ─── Study Group ─────────────────────────────────

export interface StudyGroup {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: StudyGroupMember[];
  isPublic: boolean;
  targetCompany?: string;
  targetRole?: string;
  maxMembers: number;
  messageCount: number;
  createdAt: string;
}

export interface StudyGroupMember {
  userId: string;
  userName: string;
  userImage?: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

// ─── Leaderboard ─────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userImage?: string;
  score: number;
  sessionsCompleted: number;
  streak: number;
  eloRating: number;
  badges: string[];
}

// ─── Daily Challenge ─────────────────────────────

export interface DailyChallenge {
  _id: string;
  date: string;
  questionId: string;
  question: Question;
  participants: number;
  topSolver?: { userId: string; userName: string; time: number };
}

// ─── Flashcard ───────────────────────────────────

export interface Flashcard {
  _id: string;
  front: string;
  back: string;
  category: string;
  difficulty: QuestionDifficulty;
  nextReview: string;
  repetitions: number;
  easeFactor: number;
  interval: number;
}

// ─── Job ─────────────────────────────────────────

export interface Job {
  _id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote: boolean;
  salary?: { min: number; max: number; currency: string };
  description: string;
  requirements: string[];
  niceToHave: string[];
  applicationUrl: string;
  source: string;
  matchScore?: number;
  postedAt: string;
  tags: string[];
}

// ─── Session Report ──────────────────────────────

export interface SessionReport {
  overallScore: number;
  scoreLabel: string;
  percentile: number;
  grades: SessionGrades;
  breakdown: ReportBreakdown[];
  questionsAsked: number;
  hintsUsed: number;
  timeTaken: number;
  topImprovements: string[];
  recommendedSessions: RecommendedSession[];
  communicationPatterns: CommunicationPattern;
  readinessEstimate: string;
  studyPlan: string[];
}

export interface ReportBreakdown {
  category: string;
  score: number;
  maxScore: number;
  label: string;
}

export interface RecommendedSession {
  title: string;
  description: string;
  type: InterviewType;
}

export interface CommunicationPattern {
  avgResponseTime: number;
  fillerWordCount: number;
  fillerWords: Record<string, number>;
  speakingPace: number;
  clarityScore: number;
}

// ─── Voice Mode ──────────────────────────────────

export interface VoiceState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  isSpeaking: boolean;
  error: string | null;
  confidence: number;
  fillerWords: Record<string, number>;
  wordsPerMinute: number;
  speakingDuration: number;
}

// ─── Code Execution ──────────────────────────────

export interface CodeExecutionRequest {
  code: string;
  language: CodeLanguage;
  stdin?: string;
  testCases?: TestCase[];
}

export interface CodeExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  memoryUsed: number;
  testResults?: TestResult[];
  passedTests: number;
  totalTests: number;
}

// ─── AI Chat ─────────────────────────────────────

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ─── API Responses ───────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Notification ────────────────────────────────

export interface Notification {
  _id: string;
  userId: string;
  type: "achievement" | "streak" | "challenge" | "social" | "system";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ─── Cover Letter ────────────────────────────────

export interface CoverLetter {
  _id: string;
  userId: string;
  jobTitle: string;
  company: string;
  content: string;
  tone: "formal" | "friendly" | "startup";
  createdAt: string;
}

// ─── Salary Data ─────────────────────────────────

export interface SalaryData {
  role: string;
  level: string;
  company: string;
  location: string;
  baseSalary: { min: number; max: number; median: number };
  totalComp: { min: number; max: number; median: number };
  currency: string;
}
