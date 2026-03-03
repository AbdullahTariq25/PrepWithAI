// ===========================================
// PrepWithAI — Flashcards API
// Question-based flashcard generation
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { success, badRequest, serverError } from "@/lib/response";
import { validateQuery, flashcardsQuerySchema } from "@/lib/validation";
import Question from "@/models/Question";

// ─── Types ──────────────────────────────────────────

interface QuestionDoc {
  _id: { toString(): string };
  title: string;
  description: string;
  difficulty: string;
  category: string;
  hints: string[];
  solution?: string;
}

// ─── GET Flashcards ─────────────────────────────────

async function handler(req: NextRequest) {
  try {
    const validated = validateQuery(req.url, flashcardsQuerySchema);
    if (validated.error || !validated.data) return badRequest(validated.error || "Invalid query");

    const { category, limit } = validated.data;

    const filter: Record<string, unknown> = {};
    if (category && category !== "All" && category !== "all") {
      filter.category = category.toLowerCase().replace(/\s+/g, "-");
    }

    const questions = await Question.find(filter)
      .select("title description difficulty category hints solution")
      .limit(limit)
      .lean();

    const flashcards = questions.map((q: unknown) => {
      const question = q as QuestionDoc;
      const front = `${question.title}: ${question.description}`;
      const back =
        question.solution ||
        (Array.isArray(question.hints) && question.hints.length > 0
          ? question.hints.join(". ") + "."
          : "Review the solution approach for this problem.");

      return {
        id: question._id.toString(),
        front,
        back,
        category: question.category || "general",
        difficulty: question.difficulty || "medium",
        mastered: false,
      };
    });

    return success({
      flashcards,
      total: flashcards.length,
    });
  } catch (error) {
    return serverError("Failed to fetch flashcards", error);
  }
}

// ─── Export ─────────────────────────────────────────

export const GET = withAuth(handler);
