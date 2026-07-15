// ===========================================
// PrepWithAI — Zod Validation Schemas
// Centralized input validation for application routes
// ===========================================

import { z } from "zod";

const interviewTypeSchema = z.enum([
  "dsa",
  "system_design",
  "behavioral",
  "frontend",
  "backend",
  "full_stack",
  "full_loop",
  "machine_learning",
  "mobile",
  "devops",
  "data_engineering",
  "security",
  "product_management",
  "leadership",
]);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters");

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
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email").toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export const createInterviewSchema = z.object({
  type: interviewTypeSchema.default("dsa"),
  company: z.string().max(100).trim().default("general"),
  difficulty: z
    .enum(["junior", "mid", "senior", "staff"])
    .default("mid"),
  voiceMode: z.boolean().default(false),
  videoMode: z.boolean().default(false),
});

export const chatMessageSchema = z.object({
  action: z.enum(["start", "message", "hint", "skip", "end"]),
  content: z.string().max(12_000, "Message is too long").optional().default(""),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
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
  targetCompanies: z.array(z.string().max(100)).max(20).optional(),
  preferredInterviewTypes: z.array(interviewTypeSchema).max(14).optional(),
  targetDate: z.string().datetime().optional().or(z.literal("")),
  preferredLanguage: z.string().max(50).optional(),
  timezone: z.string().max(100).optional(),
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
  interviewTypes: z
    .array(
      z
        .string()
        .transform((value) => value.trim().replace(/-/g, "_"))
        .pipe(interviewTypeSchema),
    )
    .min(1, "Choose at least one interview type")
    .max(8)
    .optional(),
  targetCompany: z.string().max(100).trim().optional(),
  targetRole: z.string().max(100).trim().optional(),
  targetDate: z.string().datetime().optional().or(z.literal("")),
  weeklyGoal: z.number().int().min(1).max(14).optional(),
});

export const questionsQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  company: z.string().max(100).optional(),
  tags: z.string().max(300).optional(),
});

export const leaderboardQuerySchema = z.object({
  period: z.enum(["all", "weekly", "monthly"]).default("all"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const settingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  voiceEnabled: z.boolean().optional(),
  preferredLanguage: z.string().max(50).optional(),
  timezone: z.string().max(100).optional(),
  theme: z.enum(["dark", "light", "system"]).optional(),
  weeklyGoal: z.number().min(1).max(30).optional(),
});

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

export const flashcardsQuerySchema = z.object({
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>,
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: error.issues[0]?.message || "Validation failed",
      };
    }
    return { data: null, error: "Invalid request body" };
  }
}

export function validateQuery<T>(
  url: string,
  schema: z.ZodSchema<T>,
): { data: T; error: null } | { data: null; error: string } {
  try {
    const { searchParams } = new URL(url);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    const data = schema.parse(params);
    return { data, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: error.issues[0]?.message || "Invalid query parameters",
      };
    }
    return { data: null, error: "Invalid query parameters" };
  }
}
