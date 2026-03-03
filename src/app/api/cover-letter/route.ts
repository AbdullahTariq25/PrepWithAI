// ===========================================
// PrepWithAI — Cover Letter Generator API
// AI-powered cover letter generation via Groq
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { success, badRequest, serverError } from "@/lib/response";
import { validateBody, coverLetterSchema } from "@/lib/validation";
import { generateInterviewResponse, checkApiLimit } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rateLimit";
import { tooManyRequests } from "@/lib/response";

// ─── POST Generate Cover Letter ─────────────────────

async function handler(req: NextRequest, ctx: AuthContext) {
  try {
    // Rate limit: 10 cover letters per hour
    const rl = checkRateLimit(`cover:${ctx.user.id}`, 10, 60 * 60 * 1000);
    if (!rl.allowed) {
      return tooManyRequests(
        "Cover letter limit reached. Try again later.",
        Math.ceil((rl.resetAt - Date.now()) / 1000)
      );
    }

    // Check API limit
    const apiLimit = await checkApiLimit(ctx.user.id);
    if (!apiLimit.allowed) {
      return tooManyRequests("Daily AI limit reached. Upgrade for more.");
    }

    const validated = await validateBody(req, coverLetterSchema);
    if (validated.error || !validated.data) return badRequest(validated.error || "Invalid input");

    const { companyName, jobTitle, jobDescription, tone, keySkills, whyCompany } =
      validated.data;

    const prompt = `Generate a professional cover letter for the following:
Company: ${companyName}
Job Title: ${jobTitle}
${jobDescription ? `Job Description: ${jobDescription}` : ""}
${keySkills ? `Key Skills to Highlight: ${keySkills}` : ""}
${whyCompany ? `Why This Company: ${whyCompany}` : ""}
Tone: ${tone}

Write a compelling, ATS-friendly cover letter that:
1. Opens with a strong hook
2. Highlights relevant skills and experience
3. Shows genuine interest in the company
4. Includes specific examples and achievements
5. Closes with a clear call to action
6. Is 3-4 paragraphs, under 400 words

Return ONLY the letter text, no subject line or headers.`;

    const { content } = await generateInterviewResponse(
      [
        {
          role: "system",
          content:
            "You are an expert career coach who writes compelling, personalized cover letters for software engineers. Write in a natural, authentic voice.",
        },
        { role: "user", content: prompt },
      ],
      {
        temperature: 0.7,
        maxTokens: 1024,
        userId: ctx.user.id,
        endpoint: "cover-letter",
      }
    );

    return success({ letter: content });
  } catch (error) {
    return serverError("Failed to generate cover letter", error);
  }
}

// ─── Export ─────────────────────────────────────────

export const POST = withAuth(handler);
