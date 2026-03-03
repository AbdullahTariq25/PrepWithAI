// ===========================================
// PrepWithAI — Zod Validation Schemas
// Centralized input validation for all routes
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { z } from "zod";

// ─── Auth Schemas ───────────────────────────────────

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid email")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email").toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(128, "New password cannot exceed 128 characters"),
});

// ─── Interview Schemas ──────────────────────────────

export const createInterviewSchema = z.object({
  type: z.string().min(1, "Interview type is required").default("dsa"),
  company: z.string().default("general"),
  difficulty: z
    .enum(["junior", "mid", "senior", "staff"])
    .default("mid"),
  voiceMode: z.boolean().default(false),
  videoMode: z.boolean().default(false),
});

export const chatMessageSchema = z.object({
  action: z.enum(["start", "message", "hint", "skip", "end"]),
  content: z.string().optional().default(""),
});

// ─── User Schemas ───────────────────────────────────

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .trim()
    .optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  currentRole: z.string().max(100).optional(),
  targetRole: z.string().max(100).optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  experienceLevel: z
    .enum(["student", "junior", "mid", "senior", "staff", "principal"])
    .optional(),
  targetCompanies: z.array(z.string()).max(20).optional(),
  targetDate: z.string().datetime().optional().or(z.literal("")),
  preferredLanguage: z.string().optional(),
  timezone: z.string().optional(),
  theme: z.enum(["dark", "light", "system"]).optional(),
  emailNotifications: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  voiceEnabled: z.boolean().optional(),
  weeklyGoal: z.number().min(1).max(30).optional(),
});

export const onboardingSchema = z.object({
  experienceLevel: z
    .enum(["student", "junior", "mid", "senior", "staff", "principal"])
    .optional(),
  targetCompany: z.string().optional(),
  targetRole: z.string().optional(),
});

// ─── Questions Schema ───────────────────────────────

export const questionsQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  company: z.string().optional(),
  tags: z.string().optional(),
});

// ─── Leaderboard Schema ─────────────────────────────

export const leaderboardQuerySchema = z.object({
  period: z.enum(["all", "weekly", "monthly"]).default("all"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ─── Settings Schema ────────────────────────────────

export const settingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  voiceEnabled: z.boolean().optional(),
  preferredLanguage: z.string().optional(),
  timezone: z.string().optional(),
  theme: z.enum(["dark", "light", "system"]).optional(),
  weeklyGoal: z.number().min(1).max(30).optional(),
});

// ─── Cover Letter Schema ────────────────────────────

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(200).trim(),
  jobTitle: z.string().min(1, "Job title is required").max(200).trim(),
  jobDescription: z.string().max(5000).optional().default(""),
  tone: z
    .enum(["professional", "enthusiastic", "casual", "confident"])
    .default("professional"),
  keySkills: z.string().max(1000).optional().default(""),
  whyCompany: z.string().max(1000).optional().default(""),
});

// ─── Flashcards Schema ──────────────────────────────

export const flashcardsQuerySchema = z.object({
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Helper: Validate Request Body ──────────────────

export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstIssue = err.issues[0];
      return {
        data: null,
        error: firstIssue?.message || "Validation failed",
      };
    }
    return { data: null, error: "Invalid request body" };
  }
}

// ─── Helper: Validate Query Params ──────────────────

export function validateQuery<T>(
  url: string,
  schema: z.ZodSchema<T>
): { data: T; error: null } | { data: null; error: string } {
  try {
    const { searchParams } = new URL(url);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    const data = schema.parse(params);
    return { data, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstIssue = err.issues[0];
      return {
        data: null,
        error: firstIssue?.message || "Invalid query parameters",
      };
    }
    return { data: null, error: "Invalid query parameters" };
  }
}
