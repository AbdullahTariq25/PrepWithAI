// ===========================================
// PrepWithAI — Interview Chat Route
// Handles start, message, hint, skip, and end actions
// with streaming AI responses and calibrated finalization
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { chatMessageSchema, validateBody } from "@/lib/validation";
import {
  badRequest,
  notFound,
  forbidden,
  serverError,
  tooManyRequests,
} from "@/lib/response";
import {
  generateInterviewResponse,
  generateInterviewResponseStream,
  checkApiLimit,
} from "@/lib/groq";
import { getSystemPrompt, getEndInterviewPrompt } from "@/lib/prompts";
import { rateLimitChat } from "@/lib/rateLimit";
import { finalizeInterview } from "@/lib/finalizeInterview";
import Session from "@/models/Session";

function buildConversationHistory(session: {
  type: string;
  company: string;
  difficulty: string;
  messages: { role: string; content: string }[];
}) {
  const systemPrompt = getSystemPrompt(
    session.type,
    session.company,
    session.difficulty,
  );
  const history: {
    role: "system" | "user" | "assistant";
    content: string;
  }[] = [{ role: "system", content: systemPrompt }];

  const messages = session.messages;
  const recent = messages.length > 30 ? messages.slice(-30) : messages;

  for (const message of recent) {
    history.push({
      role: message.role === "interviewer" ? "assistant" : "user",
      content: message.content,
    });
  }

  return history;
}

function createStreamingResponse(
  session: ReturnType<typeof Object>,
  conversationHistory: {
    role: "system" | "user" | "assistant";
    content: string;
  }[],
  userId: string,
  endpoint: string,
  extraMeta?: { newQuestion?: boolean; hintsUsed?: number },
) {
  const { stream, fullContent } = generateInterviewResponseStream(
    conversationHistory,
    { userId, endpoint },
  );

  fullContent
    .then(async (aiMessage) => {
      session.messages.push({
        id: `msg-${Date.now()}-ai`,
        role: "interviewer",
        content: aiMessage,
        timestamp: new Date(),
        isVoice: false,
      });
      await session.save();
    })
    .catch((error: unknown) => {
      console.error("Failed to save streamed message:", error);
    });

  const encoder = new TextEncoder();
  const metaStream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ meta: true, ...(extraMeta || {}) })}\n\n`,
        ),
      );
      controller.close();
    },
  });

  const combined = new ReadableStream<Uint8Array>({
    async start(controller) {
      const metaReader = metaStream.getReader();
      while (true) {
        const { done, value } = await metaReader.read();
        if (done) break;
        controller.enqueue(value);
      }

      const aiReader = stream.getReader();
      while (true) {
        const { done, value } = await aiReader.read();
        if (done) break;
        controller.enqueue(value);
      }
      controller.close();
    },
  });

  return new Response(combined, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

async function handler(req: NextRequest, { user, params }: AuthContext) {
  try {
    const rateCheck = await rateLimitChat(user.id);
    if (!rateCheck.allowed) {
      return tooManyRequests(
        "Slow down! Please wait before sending another message.",
        5,
      );
    }

    const { data, error } = await validateBody(req, chatMessageSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    const { id } = params;
    const { action, content } = data;

    const apiLimit = await checkApiLimit(user.id);
    if (!apiLimit.allowed) {
      return tooManyRequests(
        "AI responses are temporarily limited due to high usage. Please try again shortly.",
      );
    }

    const session = await Session.findById(id);
    if (!session) return notFound("Session not found");
    if (session.userId.toString() !== user.id) {
      return forbidden("You do not have access to this session");
    }

    if (session.completed && action !== "end") {
      return badRequest("This interview session has already ended");
    }

    if (action === "end" && session.reportGenerated) {
      const feedback = await finalizeInterview(id, user.id);
      return Response.json({
        completed: true,
        feedback,
        score: feedback.overallScore,
        grades: feedback.grades,
        duration: feedback.duration,
        strengths: feedback.strengths,
        weaknesses: feedback.improvements,
        summary: feedback.summary,
        seniorTip: feedback.seniorTip,
      });
    }

    const conversationHistory = buildConversationHistory(session);

    switch (action) {
      case "start": {
        conversationHistory.push({
          role: "user",
          content:
            "Please start the interview. Introduce yourself briefly and ask the first question.",
        });

        return createStreamingResponse(
          session,
          conversationHistory,
          user.id,
          "chat-start",
          { newQuestion: true },
        );
      }

      case "message": {
        if (!content?.trim()) {
          return badRequest("Message content cannot be empty");
        }

        session.messages.push({
          id: `msg-${Date.now()}-user`,
          role: "candidate",
          content: content.trim(),
          timestamp: new Date(),
          isVoice: false,
        });
        await session.save();

        conversationHistory.push({ role: "user", content: content.trim() });

        return createStreamingResponse(
          session,
          conversationHistory,
          user.id,
          "chat-message",
          { newQuestion: false },
        );
      }

      case "hint": {
        conversationHistory.push({
          role: "user",
          content:
            "I'm stuck. Give me one small hint that helps me make progress without revealing the full solution.",
        });

        session.hintsUsed = (session.hintsUsed || 0) + 1;
        await session.save();

        return createStreamingResponse(
          session,
          conversationHistory,
          user.id,
          "chat-hint",
          { hintsUsed: session.hintsUsed },
        );
      }

      case "skip": {
        conversationHistory.push({
          role: "user",
          content:
            "I'd like to skip this question. Give a concise explanation of the key approach, then move to the next appropriate question.",
        });

        return createStreamingResponse(
          session,
          conversationHistory,
          user.id,
          "chat-skip",
          { newQuestion: true },
        );
      }

      case "end": {
        conversationHistory.push({
          role: "user",
          content: getEndInterviewPrompt(),
        });

        const { content: closingMessage } = await generateInterviewResponse(
          conversationHistory,
          {
            temperature: 0.25,
            maxTokens: 260,
            userId: user.id,
            endpoint: "chat-end",
          },
        );

        session.messages.push({
          id: `msg-${Date.now()}-end`,
          role: "interviewer",
          content: closingMessage,
          timestamp: new Date(),
          isVoice: false,
        });
        await session.save();

        const feedback = await finalizeInterview(id, user.id);

        return Response.json({
          message: closingMessage,
          completed: true,
          feedback,
          score: feedback.overallScore,
          grades: feedback.grades,
          duration: feedback.duration,
          strengths: feedback.strengths,
          weaknesses: feedback.improvements,
          summary: feedback.summary,
          seniorTip: feedback.seniorTip,
        });
      }

      default:
        return badRequest(`Invalid action: ${action}`);
    }
  } catch (error) {
    return serverError("Failed to process message", error);
  }
}

export const POST = withAuth(handler);
