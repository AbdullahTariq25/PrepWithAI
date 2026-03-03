// ===========================================
// PrepWithAI — Chat Route (MOST CRITICAL)
// POST /api/interview/[id]/chat
// Handles all interview actions: start, message,
// hint, skip, end — with Groq AI + SSE streaming
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { chatMessageSchema, validateBody } from "@/lib/validation";
import { badRequest, notFound, forbidden, serverError } from "@/lib/response";
import { tooManyRequests } from "@/lib/response";
import {
  generateInterviewResponse,
  generateInterviewResponseStream,
  checkApiLimit,
} from "@/lib/groq";
import { getSystemPrompt, getEndInterviewPrompt } from "@/lib/prompts";
import { rateLimitChat } from "@/lib/rateLimit";
import Session from "@/models/Session";

// Helper: build conversation history from session
function buildConversationHistory(
  session: { type: string; company: string; difficulty: string; messages: { role: string; content: string }[] }
) {
  const systemPrompt = getSystemPrompt(
    session.type,
    session.company,
    session.difficulty
  );
  const history: {
    role: "system" | "user" | "assistant";
    content: string;
  }[] = [{ role: "system", content: systemPrompt }];

  // Limit to last 30 messages to save tokens, but keep system prompt
  const msgs = session.messages;
  const recent = msgs.length > 30 ? msgs.slice(-30) : msgs;

  for (const msg of recent) {
    history.push({
      role: msg.role === "interviewer" ? "assistant" : "user",
      content: msg.content,
    });
  }

  return history;
}

// Helper: create streaming response with DB save after completion
function createStreamingResponse(
  session: ReturnType<typeof Object>,
  conversationHistory: { role: "system" | "user" | "assistant"; content: string }[],
  userId: string,
  endpoint: string,
  extraMeta?: { newQuestion?: boolean; hintsUsed?: number }
) {
  const { stream, fullContent } = generateInterviewResponseStream(
    conversationHistory,
    { userId, endpoint }
  );

  // Save complete message to DB after stream finishes
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
    .catch((err: unknown) => {
      console.error("Failed to save streamed message:", err);
    });

  // Send metadata in the first SSE event
  const encoder = new TextEncoder();
  const metaStream = new ReadableStream<Uint8Array>({
    start(controller) {
      const meta = {
        meta: true,
        ...(extraMeta || {}),
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(meta)}\n\n`)
      );
      controller.close();
    },
  });

  // Combine meta + AI stream
  const combined = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Send meta first
      const metaReader = metaStream.getReader();
      while (true) {
        const { done, value } = await metaReader.read();
        if (done) break;
        controller.enqueue(value);
      }

      // Then pipe AI stream
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
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

async function handler(req: NextRequest, { user, params }: AuthContext) {
  try {
    // Rate limit per user
    const rateCheck = rateLimitChat(user.id);
    if (!rateCheck.allowed) {
      return tooManyRequests("Slow down! Please wait before sending another message.", 5);
    }

    // Validate input
    const { data, error } = await validateBody(req, chatMessageSchema);
    if (error || !data) {
      return badRequest(error || "Invalid input");
    }

    const { id } = params;
    const { action, content } = data;

    // Check daily API limit
    const apiLimit = await checkApiLimit(user.id);
    if (!apiLimit.allowed) {
      return tooManyRequests(
        "AI responses are temporarily limited due to high usage. Please try again shortly."
      );
    }

    // Fetch session
    const session = await Session.findById(id);
    if (!session) {
      return notFound("Session not found");
    }
    if (session.userId.toString() !== user.id) {
      return forbidden("You do not have access to this session");
    }
    if (session.completed && action !== "end") {
      return badRequest("This interview session has already ended");
    }

    // Build conversation history (with 30-message window)
    const conversationHistory = buildConversationHistory(session);

    // ─── Handle Actions ─────────────────────────────

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
          { newQuestion: true }
        );
      }

      case "message": {
        if (!content?.trim()) {
          return badRequest("Message content cannot be empty");
        }

        // Add user message to DB immediately
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
          { newQuestion: false }
        );
      }

      case "hint": {
        conversationHistory.push({
          role: "user",
          content:
            "I'm stuck. Can you give me a small hint without revealing the full solution?",
        });

        session.hintsUsed = (session.hintsUsed || 0) + 1;
        await session.save();

        return createStreamingResponse(
          session,
          conversationHistory,
          user.id,
          "chat-hint",
          { hintsUsed: session.hintsUsed }
        );
      }

      case "skip": {
        conversationHistory.push({
          role: "user",
          content:
            "I'd like to skip this question. Please briefly explain the optimal approach, then move to the next question.",
        });

        return createStreamingResponse(
          session,
          conversationHistory,
          user.id,
          "chat-skip",
          { newQuestion: true }
        );
      }

      case "end": {
        // End remains non-streaming — needs full JSON parsing
        conversationHistory.push({
          role: "user",
          content: getEndInterviewPrompt(),
        });

        const { content: endMessage } = await generateInterviewResponse(
          conversationHistory,
          {
            temperature: 0.4,
            maxTokens: 1000,
            userId: user.id,
            endpoint: "chat-end",
          }
        );

        // Parse scores from AI response
        let overallScore = 0;
        let grades = {
          problemSolving: 0,
          communication: 0,
          codeQuality: 0,
          edgeCases: 0,
          timeManagement: 0,
        };
        let strengths: string[] = [];
        let weaknesses: string[] = [];
        let summary = "";
        let seniorTip = "";

        try {
          const jsonMatch = endMessage.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            overallScore = parsed.score || 0;
            if (parsed.grades) grades = { ...grades, ...parsed.grades };
            strengths = parsed.strengths || [];
            weaknesses = parsed.weaknesses || [];
            summary = parsed.summary || "";
            seniorTip = parsed.tip || "";
          }
        } catch {
          // JSON parsing failed — use defaults
        }

        // Calculate duration
        const duration =
          session.messages.length > 0
            ? Math.floor(
              (Date.now() -
                new Date(session.createdAt).getTime()) /
              1000
            )
            : 0;

        // Update session
        session.completed = true;
        session.overallScore = overallScore;
        session.grades = grades;
        session.duration = duration;
        session.strengths = strengths;
        session.improvements = weaknesses;
        session.summary = summary;
        session.seniorTip = seniorTip;
        session.messages.push({
          id: `msg-${Date.now()}-end`,
          role: "interviewer",
          content: endMessage,
          timestamp: new Date(),
          isVoice: false,
        });
        await session.save();

        return Response.json({
          message: endMessage,
          completed: true,
          score: overallScore,
          grades,
          duration,
          strengths,
          weaknesses,
          summary,
          seniorTip,
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
