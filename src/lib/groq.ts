// ===========================================
// PrepWithAI — Groq AI Client
// Centralized AI client with retry logic,
// usage tracking, and response generation
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import Groq from "groq-sdk";
import dbConnect from "./mongodb";
import ApiUsage from "@/models/ApiUsage";

// ─── Client Singleton ───────────────────────────────

let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// ─── Model Config ───────────────────────────────────

const MODEL = "llama-3.3-70b-versatile";
const DAILY_LIMIT = parseInt(process.env.GROQ_DAILY_LIMIT || "1000", 10);

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── API Usage Tracking ─────────────────────────────

export async function trackApiCall(
  tokens: number = 0,
  isError: boolean = false,
  userId?: string,
  endpoint?: string
): Promise<void> {
  try {
    await dbConnect();
    const today = getTodayDate();

    const updateOps: Record<string, unknown> = {
      $inc: {
        totalCalls: 1,
        totalTokens: tokens,
        ...(isError ? { errorCount: 1 } : {}),
      },
      $set: { lastCalledAt: new Date() },
    };

    if (endpoint) {
      (updateOps.$inc as Record<string, number>)[`endpoints.${endpoint}`] = 1;
    }

    await ApiUsage.findOneAndUpdate(
      { date: today, provider: "groq", userId: userId || null },
      updateOps,
      { upsert: true, new: true }
    );
  } catch (error) {
    // Never let tracking failures break the main flow
    console.error("API usage tracking error:", error);
  }
}

export async function checkApiLimit(userId?: string): Promise<{
  allowed: boolean;
  remaining: number;
  total: number;
  limit: number;
}> {
  try {
    await dbConnect();
    const today = getTodayDate();

    const filter: Record<string, unknown> = { date: today, provider: "groq" };
    if (userId) filter.userId = userId;

    const usage = await ApiUsage.findOne(filter);
    const totalCalls = usage?.totalCalls || 0;

    return {
      allowed: totalCalls < DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - totalCalls),
      total: totalCalls,
      limit: DAILY_LIMIT,
    };
  } catch {
    // Fail open — if we can't check, allow the call
    return { allowed: true, remaining: DAILY_LIMIT, total: 0, limit: DAILY_LIMIT };
  }
}

export async function getUsageStats(days: number = 7) {
  try {
    await dbConnect();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().split("T")[0];

    const stats = await ApiUsage.find({
      provider: "groq",
      date: { $gte: startStr },
    }).sort({ date: -1 });

    return stats;
  } catch {
    return [];
  }
}

// ─── AI Response Generation ─────────────────────────

// Retry helper with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      const status = (error as { status?: number })?.status;
      // Only retry on 429 (rate limit) or 500+ (server errors)
      if (attempt < maxRetries && (status === 429 || (status && status >= 500))) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateInterviewResponse(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options: {
    temperature?: number;
    maxTokens?: number;
    userId?: string;
    endpoint?: string;
  } = {}
): Promise<{ content: string; tokensUsed: number }> {
  const {
    temperature = 0.7,
    maxTokens = 800,
    userId,
    endpoint = "chat",
  } = options;

  const groq = getGroqClient();

  try {
    const completion = await withRetry(() =>
      groq.chat.completions.create({
        model: MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      })
    );

    const content =
      completion.choices[0]?.message?.content ||
      "I apologize, I encountered an issue. Could you repeat that?";
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Track usage asynchronously — don't await
    trackApiCall(tokensUsed, false, userId, endpoint).catch(() => { });

    return { content, tokensUsed };
  } catch (error) {
    trackApiCall(0, true, userId, endpoint).catch(() => { });
    throw error;
  }
}

// ─── Streaming AI Response ──────────────────────────

export function generateInterviewResponseStream(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options: {
    temperature?: number;
    maxTokens?: number;
    userId?: string;
    endpoint?: string;
  } = {}
): {
  stream: ReadableStream<Uint8Array>;
  fullContent: Promise<string>;
} {
  const {
    temperature = 0.7,
    maxTokens = 800,
    userId,
    endpoint = "chat",
  } = options;

  const groq = getGroqClient();
  let resolveFullContent: (value: string) => void;
  let rejectFullContent: (reason: unknown) => void;

  const fullContent = new Promise<string>((resolve, reject) => {
    resolveFullContent = resolve;
    rejectFullContent = reject;
  });

  const encoder = new TextEncoder();
  let accumulated = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const completion = await groq.chat.completions.create({
          model: MODEL,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        });

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content || "";
          if (delta) {
            accumulated += delta;
            // SSE format
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
            );
          }
        }

        // Send done signal
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, fullContent: accumulated })}\n\n`)
        );
        controller.close();

        // Track usage (estimated tokens for streaming)
        const estimatedTokens = Math.ceil(accumulated.length / 4);
        trackApiCall(estimatedTokens, false, userId, endpoint).catch(() => { });

        resolveFullContent(accumulated);
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "AI response failed" })}\n\n`)
        );
        controller.close();
        trackApiCall(0, true, userId, endpoint).catch(() => { });
        rejectFullContent(error);
      }
    },
  });

  return { stream, fullContent };
}

export async function generateFeedback(
  transcript: string,
  type: string,
  difficulty: string,
  company: string,
  userId?: string
): Promise<{
  overallScore: number;
  grades: Record<string, number>;
  strengths: string[];
  improvements: string[];
  summary: string;
  seniorTip: string;
  recommendedTopics: string[];
}> {
  const groq = getGroqClient();

  const messages: { role: "system" | "user"; content: string }[] = [
    {
      role: "system",
      content:
        "You are an expert interview evaluator. Analyze the interview transcript and provide detailed, actionable feedback. Return valid JSON only — no markdown fences, no extra text.",
    },
    {
      role: "user",
      content: `Analyze this ${type.replace(/_/g, " ")} interview (${difficulty} level, ${company}).

Transcript:
${transcript.slice(0, 6000)}

Return exactly this JSON:
{
  "overallScore": <0-100>,
  "grades": {
    "problemSolving": <0-100>,
    "communication": <0-100>,
    "codeQuality": <0-100>,
    "edgeCases": <0-100>,
    "timeManagement": <0-100>
  },
  "strengths": ["str1", "str2", "str3"],
  "improvements": ["imp1", "imp2", "imp3"],
  "summary": "2-3 sentence assessment",
  "recommendedTopics": ["topic1", "topic2"],
  "seniorTip": "one advanced tip for improvement"
}`,
    },
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 1200,
      temperature: 0.3,
    });

    const tokensUsed = completion.usage?.total_tokens || 0;
    trackApiCall(tokensUsed, false, userId, "feedback").catch(() => { });

    const text = completion.choices[0]?.message?.content ?? "{}";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");

    const parsed = JSON.parse(match[0]);

    return {
      overallScore: parsed.overallScore || 60,
      grades: {
        problemSolving: parsed.grades?.problemSolving || 60,
        communication: parsed.grades?.communication || 60,
        codeQuality: parsed.grades?.codeQuality || 60,
        edgeCases: parsed.grades?.edgeCases || 50,
        timeManagement: parsed.grades?.timeManagement || 60,
      },
      strengths: parsed.strengths || ["Attempted the problem"],
      improvements: parsed.improvements || ["Could improve clarity"],
      summary:
        parsed.summary ||
        "Basic understanding shown. More practice recommended.",
      seniorTip:
        parsed.seniorTip ||
        "Focus on articulating your thought process clearly.",
      recommendedTopics: parsed.recommendedTopics || [],
    };
  } catch (error) {
    trackApiCall(0, true, userId, "feedback").catch(() => { });
    console.error("Feedback generation error:", error);

    // Return safe defaults instead of throwing
    return {
      overallScore: 60,
      grades: {
        problemSolving: 60,
        communication: 60,
        codeQuality: 60,
        edgeCases: 50,
        timeManagement: 60,
      },
      strengths: ["Attempted the problem"],
      improvements: ["Could improve clarity"],
      summary: "Basic understanding shown. More practice recommended.",
      seniorTip: "Focus on articulating your thought process clearly.",
      recommendedTopics: [],
    };
  }
}
