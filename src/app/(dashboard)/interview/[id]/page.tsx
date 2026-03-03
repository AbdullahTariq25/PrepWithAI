"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Brain,
  Send,
  Mic,
  MicOff,
  Lightbulb,
  SkipForward,
  Square,
  Clock,
  Code2,
  MessageSquare,
  Play,
  Loader2,
  Volume2,
  VolumeOff,
  Copy,
  Check,
} from "lucide-react";
import "./interview-session.css";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: "#1e1e1e",
        borderRadius: 12,
      }}
    >
      <Loader2 style={{ width: 24, height: 24, color: "#666" }} />
    </div>
  ),
});

// ─── Types ──────────────────────────────────────
interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}
interface CodeExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
}

// ─── Constants ──────────────────────────────────
const CODE_LANGUAGES = [
  { id: "javascript", label: "JavaScript", monacoId: "javascript" },
  { id: "python", label: "Python", monacoId: "python" },
  { id: "java", label: "Java", monacoId: "java" },
  { id: "cpp", label: "C++", monacoId: "cpp" },
];
const DEFAULT_CODE: Record<string, string> = {
  javascript:
    '// Write your solution here\nfunction solve(input) {\n  \n}\n\nconsole.log(solve("test"));',
  python:
    '# Write your solution here\ndef solve(input):\n    pass\n\nprint(solve("test"))',
  java: "public class Solution {\n    public static void main(String[] args) {\n        \n    }\n}",
  cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
};

// ─── SSE Stream Consumer ────────────────────────
async function consumeSSE(
  response: Response,
  onChunk: (text: string) => void,
  onMeta?: (meta: Record<string, unknown>) => void,
  onDone?: (fullContent: string) => void,
  onError?: (msg: string) => void,
) {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const data = JSON.parse(line.slice(6));
        if (data.meta) {
          onMeta?.(data);
        } else if (data.done) {
          onDone?.(data.fullContent || "");
        } else if (data.error) {
          onError?.(data.error);
        } else if (data.content) {
          onChunk(data.content);
        }
      } catch {
        // Skip malformed SSE
      }
    }
  }
}

// ─── Code Block Renderer ────────────────────────
function renderMessageContent(
  content: string,
  onCopy: (t: string) => void,
  copied: string | null,
) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const nl = part.indexOf("\n");
      const lang = part.slice(3, nl > 0 ? nl : 3).trim();
      const codeText = part.slice(nl > 0 ? nl + 1 : 3, -3).trim();
      const isCopied = copied === codeText;
      return (
        <div key={i} className="iv-codeblock">
          <div className="iv-codeblock-header">
            <span className="iv-codeblock-lang">{lang || "code"}</span>
            <button
              onClick={() => onCopy(codeText)}
              className={`iv-codeblock-copy ${isCopied ? "iv-codeblock-copy--copied" : "iv-codeblock-copy--idle"}`}
            >
              {isCopied ? (
                <Check style={{ width: 12, height: 12 }} />
              ) : (
                <Copy style={{ width: 12, height: 12 }} />
              )}
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre>{codeText}</pre>
        </div>
      );
    }
    return (
      <span key={i} style={{ whiteSpace: "pre-wrap" }}>
        {part}
      </span>
    );
  });
}

// ─── Main Page Component ────────────────────────
export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionParam = params?.id;
  const sessionId = Array.isArray(sessionParam)
    ? sessionParam[0]
    : (sessionParam ?? "");

  // ─── State ─────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{
    type: string;
    company: string;
    difficulty: string;
    voiceMode: boolean;
  } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const [showCode, setShowCode] = useState(false);
  const [codeLang, setCodeLang] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [codeOutput, setCodeOutput] = useState<CodeExecResult | null>(null);
  const [runningCode, setRunningCode] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // ─── Refs ──────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Helpers ───────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ─── TTS (Text-to-Speech) ─────────────────────
  const speakText = useCallback(
    (text: string) => {
      if (!sessionInfo?.voiceMode || !ttsEnabled) return;
      window.speechSynthesis.cancel();
      const clean = text
        .replace(/```[\s\S]*?```/g, "code block")
        .replace(/[*_#`]/g, "");
      const u = new SpeechSynthesisUtterance(clean);
      u.rate = 0.95;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      const voices = window.speechSynthesis.getVoices();
      const pref = voices.find(
        (v) => v.name.includes("Google") && v.lang.startsWith("en"),
      );
      if (pref) u.voice = pref;
      window.speechSynthesis.speak(u);
    },
    [sessionInfo?.voiceMode, ttsEnabled],
  );

  useEffect(() => {
    if (!sessionInfo?.voiceMode || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === "assistant") speakText(last.content);
  }, [messages, sessionInfo?.voiceMode, speakText]);

  // ─── Streaming Helper ─────────────────────────
  const handleStreamingRequest = useCallback(
    async (
      body: Record<string, unknown>,
      opts?: { onMeta?: (meta: Record<string, unknown>) => void },
    ) => {
      if (!sessionId) return;
      setIsLoading(true);
      setIsStreaming(true);
      setStreamingContent("");

      try {
        const res = await fetch(`/api/interview/${sessionId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error("Chat error:", errData);
          setIsLoading(false);
          setIsStreaming(false);
          return;
        }

        let fullText = "";

        await consumeSSE(
          res,
          // onChunk
          (chunk) => {
            fullText += chunk;
            setStreamingContent(fullText);
          },
          // onMeta
          (meta) => {
            opts?.onMeta?.(meta);
          },
          // onDone
          () => {
            const finalMsg: Message = {
              id: `msg-${Date.now()}-ai`,
              role: "assistant",
              content: fullText,
              timestamp: new Date(),
            };
            setMessages((p) => [...p, finalMsg]);
            setStreamingContent("");
            setIsStreaming(false);
            setIsLoading(false);
          },
          // onError
          (errMsg) => {
            console.error("Stream error:", errMsg);
            setStreamingContent("");
            setIsStreaming(false);
            setIsLoading(false);
          },
        );
      } catch (err) {
        console.error("Fetch error:", err);
        setStreamingContent("");
        setIsStreaming(false);
        setIsLoading(false);
      }
    },
    [sessionId],
  );

  // ─── Load Session ──────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/interview/${sessionId}`);
        const data = await res.json();
        if (data.session) {
          setSessionInfo({
            type: data.session.type,
            company: data.session.company,
            difficulty: data.session.difficulty,
            voiceMode: data.session.voiceMode || false,
          });
          if (data.session.messages?.length) {
            setMessages(
              data.session.messages.map((m: Message, i: number) => ({
                ...m,
                id: `msg-${i}`,
                timestamp: new Date(m.timestamp),
              })),
            );
          } else {
            doStartInterview();
          }
        }
      } catch (err) {
        console.error("Load session error:", err);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // ─── Interview Actions ─────────────────────────
  const doStartInterview = async () => {
    await handleStreamingRequest(
      { action: "start" },
      {
        onMeta: (meta) => {
          if (meta.newQuestion) setQuestionNum(1);
        },
      },
    );
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading || !sessionId) return;

    // Optimistic update — show user message immediately
    setMessages((p) => [
      ...p,
      {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      },
    ]);
    setInput("");

    await handleStreamingRequest(
      { action: "message", content: text },
      {
        onMeta: (meta) => {
          if (meta.newQuestion) setQuestionNum((p) => p + 1);
        },
      },
    );
  };

  const sendCodeWithMessage = async () => {
    if (isLoading || !sessionId || !code.trim()) return;
    const codeBlock = "```" + codeLang + "\n" + code + "\n```";
    const outputBlock = codeOutput
      ? "\n\nOutput:\n" + (codeOutput.stdout || codeOutput.stderr)
      : "";
    const text = "Here is my code solution:\n" + codeBlock + outputBlock;

    setMessages((p) => [
      ...p,
      {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      },
    ]);

    await handleStreamingRequest({ action: "message", content: text });
  };

  const runCode = async () => {
    setRunningCode(true);
    setCodeOutput(null);
    try {
      const res = await fetch("/api/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: codeLang, stdin: "" }),
      });
      setCodeOutput(await res.json());
    } catch {
      setCodeOutput({
        stdout: "",
        stderr: "Execution failed",
        exitCode: 1,
        executionTime: 0,
      });
    } finally {
      setRunningCode(false);
    }
  };

  const requestHint = async () => {
    await handleStreamingRequest(
      { action: "hint" },
      {
        onMeta: (meta) => {
          if (typeof meta.hintsUsed === "number") setHintsUsed(meta.hintsUsed as number);
          else setHintsUsed((p) => p + 1);
        },
      },
    );
  };

  const skipQuestion = async () => {
    await handleStreamingRequest(
      { action: "skip" },
      {
        onMeta: (meta) => {
          if (meta.newQuestion) setQuestionNum((p) => p + 1);
        },
      },
    );
  };

  const endInterview = async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end" }),
      });
      router.push(`/interview/${sessionId}/report`);
    } catch (err) {
      console.error("End error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── STT (Speech-to-Text) ─────────────────────
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SR =
      window.SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition: typeof window.SpeechRecognition;
        }
      ).webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition not supported. Use Chrome.");
      return;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let f = "";
      let im = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) f += event.results[i][0].transcript;
        else im += event.results[i][0].transcript;
      }
      setInput(f || im);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  // ─── Keyboard ──────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopyCode = (ct: string) => {
    navigator.clipboard.writeText(ct);
    setCopiedCode(ct);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const needsCodeEditor =
    sessionInfo?.type &&
    ["dsa", "frontend", "backend", "full_stack", "full_loop"].includes(
      sessionInfo.type,
    );

  // ─── Render ────────────────────────────────────
  return (
    <div className="iv-container">
      {/* ═══ Top Bar ═══ */}
      <div className="iv-topbar">
        <div className="iv-topbar-left">
          <div className="iv-topbar-icon">
            <Brain style={{ width: 18, height: 18, color: "#fff" }} />
          </div>
          <div>
            <div className="iv-topbar-title">
              {sessionInfo?.type?.replace(/_/g, " ")} Interview
            </div>
            <div className="iv-topbar-subtitle">
              {sessionInfo?.company} · {sessionInfo?.difficulty}
            </div>
          </div>
        </div>

        <div className="iv-topbar-right">
          {sessionInfo?.voiceMode && (
            <>
              <span className="iv-pill iv-pill--accent">
                <Mic style={{ width: 11, height: 11 }} /> Voice
              </span>
              <button
                onClick={() => {
                  setTtsEnabled(!ttsEnabled);
                  if (isSpeaking) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className="iv-btn iv-btn--tts"
                style={{ color: ttsEnabled ? "#ccc" : "#555" }}
              >
                {ttsEnabled ? (
                  <Volume2 style={{ width: 14, height: 14 }} />
                ) : (
                  <VolumeOff style={{ width: 14, height: 14 }} />
                )}
              </button>
            </>
          )}
          {needsCodeEditor && (
            <button
              onClick={() => setShowCode(!showCode)}
              className={`iv-btn ${showCode ? "iv-btn--active" : ""}`}
            >
              <Code2 style={{ width: 12, height: 12 }} /> Code
            </button>
          )}
          <span className="iv-pill iv-pill--default">
            <Clock style={{ width: 11, height: 11 }} /> {formatTime(elapsed)}
          </span>
          <span className="iv-pill iv-pill--default">Q{questionNum}</span>
          {hintsUsed > 0 && (
            <span className="iv-pill iv-pill--accent">{hintsUsed} hints</span>
          )}
          <button
            onClick={() => setShowEndConfirm(true)}
            className="iv-btn iv-btn--end"
          >
            <Square style={{ width: 10, height: 10 }} /> End
          </button>
        </div>
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="iv-main">
        {/* Chat Panel */}
        <div
          className={`iv-chat-area ${showCode ? "iv-chat-area--split" : "iv-chat-area--full"}`}
        >
          {/* Messages */}
          <div className="iv-messages">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`iv-msg-row ${msg.role === "user" ? "iv-msg-row--user" : "iv-msg-row--ai"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="iv-msg-avatar">
                      <Brain
                        style={{ width: 16, height: 16, color: "#fff" }}
                      />
                    </div>
                  )}
                  <div
                    className={`iv-msg-bubble ${msg.role === "user" ? "iv-msg-bubble--user" : "iv-msg-bubble--ai"}`}
                  >
                    {renderMessageContent(
                      msg.content,
                      handleCopyCode,
                      copiedCode,
                    )}
                    <div className="iv-msg-time">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div
                      className="iv-msg-avatar"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#888",
                      }}
                    >
                      You
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streaming AI Response */}
            {isStreaming && streamingContent && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="iv-msg-row iv-msg-row--ai"
              >
                <div className="iv-msg-avatar">
                  <Brain style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <div className="iv-msg-bubble iv-msg-bubble--ai iv-streaming-cursor">
                  {renderMessageContent(
                    streamingContent,
                    handleCopyCode,
                    copiedCode,
                  )}
                </div>
              </motion.div>
            )}

            {/* Typing Indicator (before stream starts) */}
            {isLoading && !isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="iv-typing"
              >
                <div className="iv-msg-avatar">
                  <Brain style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <div className="iv-typing-bubble">
                  <span className="iv-typing-dot" />
                  <span className="iv-typing-dot" />
                  <span className="iv-typing-dot" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="iv-input-area">
            <div className="iv-input-wrap">
              {sessionInfo?.voiceMode && (
                <button
                  onClick={toggleRecording}
                  className={`iv-input-btn ${isRecording ? "iv-input-btn--mic-active" : "iv-input-btn--mic"}`}
                >
                  {isRecording ? (
                    <MicOff style={{ width: 18, height: 18 }} />
                  ) : (
                    <Mic style={{ width: 18, height: 18 }} />
                  )}
                </button>
              )}

              {isRecording ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 3,
                          borderRadius: 99,
                          background: "#F87171",
                          height: 12 + Math.random() * 8,
                          animation: `iv-dot-wave 0.8s ease-in-out infinite`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: "#F87171", fontWeight: 500 }}>
                    Listening...
                  </span>
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer... (Shift+Enter for new line)"
                  className="iv-input-textarea"
                  rows={1}
                />
              )}

              <div className="iv-input-actions">
                <button
                  onClick={requestHint}
                  disabled={isLoading}
                  className="iv-input-btn iv-input-btn--hint"
                  title="Get a hint"
                >
                  <Lightbulb style={{ width: 16, height: 16 }} />
                </button>
                <button
                  onClick={skipQuestion}
                  disabled={isLoading}
                  className="iv-input-btn iv-input-btn--skip"
                  title="Skip question"
                >
                  <SkipForward style={{ width: 16, height: 16 }} />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="iv-input-btn iv-input-btn--send"
                  title="Send message"
                >
                  <Send style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Code Editor Panel ═══ */}
        {showCode && (
          <div className="iv-code-panel">
            <div className="iv-code-header">
              <div className="iv-code-lang-select">
                {CODE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setCodeLang(lang.id);
                      setCode(DEFAULT_CODE[lang.id] || "");
                      setCodeOutput(null);
                    }}
                    className={`iv-code-lang-btn ${codeLang === lang.id ? "iv-code-lang-btn--active" : ""}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <div className="iv-code-actions">
                <button
                  onClick={runCode}
                  disabled={runningCode}
                  className="iv-btn"
                  style={{ opacity: runningCode ? 0.5 : 1 }}
                >
                  {runningCode ? (
                    <Loader2 style={{ width: 12, height: 12 }} />
                  ) : (
                    <Play style={{ width: 12, height: 12 }} />
                  )}{" "}
                  Run
                </button>
                <button
                  onClick={sendCodeWithMessage}
                  disabled={isLoading}
                  className="iv-btn iv-btn--active"
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                  <MessageSquare style={{ width: 12, height: 12 }} /> Submit
                </button>
              </div>
            </div>
            <div className="iv-code-editor">
              <MonacoEditor
                height="100%"
                language={
                  CODE_LANGUAGES.find((l) => l.id === codeLang)?.monacoId ||
                  "javascript"
                }
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v || "")}
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                  lineNumbers: "on",
                  renderLineHighlight: "gutter",
                  tabSize: 2,
                }}
              />
            </div>
            {codeOutput && (
              <div className="iv-code-output">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span className="iv-codeblock-lang">Output</span>
                  <span
                    className={`iv-pill ${codeOutput.exitCode === 0 ? "iv-pill--success" : "iv-pill--destructive"}`}
                  >
                    {codeOutput.exitCode === 0 ? "OK" : "Error"}
                  </span>
                  {codeOutput.executionTime > 0 && (
                    <span style={{ fontSize: 10, color: "#666" }}>
                      {codeOutput.executionTime.toFixed(0)}ms
                    </span>
                  )}
                </div>
                <pre
                  style={{
                    fontSize: 12,
                    color: "#ccc",
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                  }}
                >
                  {codeOutput.stdout || codeOutput.stderr || "No output"}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ End Confirmation Modal ═══ */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="iv-end-overlay"
            onClick={() => setShowEndConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="iv-end-modal"
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Square style={{ width: 24, height: 24, color: "#F87171" }} />
              </div>
              <h3>End Interview?</h3>
              <p>
                Your progress will be saved and you&apos;ll receive a detailed
                performance report.
              </p>
              <div className="iv-end-modal-actions">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="iv-end-modal-btn iv-end-modal-btn--cancel"
                  style={{ flex: 1 }}
                >
                  Continue
                </button>
                <button
                  onClick={endInterview}
                  className="iv-end-modal-btn iv-end-modal-btn--confirm"
                  style={{ flex: 1 }}
                >
                  End Interview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
