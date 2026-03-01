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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#1e1e1e] rounded-lg">
      <Loader2 className="w-6 h-6 animate-spin text-[#888]" />
    </div>
  ),
});

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

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionParam = params?.id;
  const sessionId = Array.isArray(sessionParam)
    ? sessionParam[0]
    : (sessionParam ?? "");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

  const doStartInterview = async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages([
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Start error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading || !sessionId) return;
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
    setIsLoading(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", content: text }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((p) => [
          ...p,
          {
            id: `msg-${Date.now()}-ai`,
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
        if (data.newQuestion) setQuestionNum((p) => p + 1);
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setIsLoading(false);
    }
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
    setIsLoading(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", content: text }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((p) => [
          ...p,
          {
            id: `msg-${Date.now()}-ai`,
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Code submit error:", err);
    } finally {
      setIsLoading(false);
    }
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
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hint" }),
      });
      const data = await res.json();
      if (data.message) {
        setHintsUsed((p) => p + 1);
        setMessages((p) => [
          ...p,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Hint error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const skipQuestion = async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "skip" }),
      });
      const data = await res.json();
      if (data.message) {
        setQuestionNum((p) => p + 1);
        setMessages((p) => [
          ...p,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Skip error:", err);
    } finally {
      setIsLoading(false);
    }
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
      let f = "",
        im = "";
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

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const needsCodeEditor =
    sessionInfo?.type &&
    ["dsa", "frontend", "backend", "full_stack", "full_loop"].includes(
      sessionInfo.type,
    );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#080808]">
      {/* Top bar */}
      <div className="flex items-center justify-between py-3 px-4 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium capitalize">
              {sessionInfo?.type?.replace(/_/g, " ")} Interview
            </div>
            <div className="text-xs text-[#888] capitalize">
              {sessionInfo?.company} &bull; {sessionInfo?.difficulty}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {sessionInfo?.voiceMode && (
            <>
              <Badge
                variant="secondary"
                className="gap-1 bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
              >
                <Mic className="w-3 h-3" /> Voice
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setTtsEnabled(!ttsEnabled);
                  if (isSpeaking) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
              >
                {ttsEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeOff className="w-4 h-4 text-[#888]" />
                )}
              </Button>
            </>
          )}
          {needsCodeEditor && (
            <Button
              variant={showCode ? "default" : "outline"}
              size="sm"
              className="gap-1 h-7 text-xs"
              onClick={() => setShowCode(!showCode)}
            >
              <Code2 className="w-3 h-3" /> Code
            </Button>
          )}
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" /> {formatTime(elapsed)}
          </Badge>
          <Badge variant="outline">Q{questionNum}</Badge>
          {hintsUsed > 0 && (
            <Badge variant="secondary">{hintsUsed} hints</Badge>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={endInterview}
            className="gap-1 h-7 text-xs"
          >
            <Square className="w-3 h-3" /> End
          </Button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat panel */}
        <div
          className={`flex flex-col ${showCode ? "w-1/2 border-r border-white/6" : "w-full max-w-4xl mx-auto"}`}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-[#1A1A1A] rounded-tl-sm"}`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white">You</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#1A1A1A] rounded-2xl rounded-tl-sm p-4">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-[#666] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-[#666] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-[#666] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Hint/Skip bar */}
          <div className="border-t border-white/6 p-2 flex items-center gap-2 justify-center shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={requestHint}
              disabled={isLoading}
              className="gap-1 h-7 text-xs"
            >
              <Lightbulb className="w-3 h-3" /> Hint
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={skipQuestion}
              disabled={isLoading}
              className="gap-1 h-7 text-xs"
            >
              <SkipForward className="w-3 h-3" /> Skip
            </Button>
          </div>

          {/* Input area */}
          <div className="border-t border-white/6 p-3 shrink-0">
            <div className="flex items-end gap-3">
              {sessionInfo?.voiceMode && (
                <button
                  onClick={toggleRecording}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 relative ${isRecording ? "bg-red-500 scale-110 shadow-lg shadow-red-500/30" : "bg-[#1A1A1A] border border-white/8 hover:border-indigo-500/30"}`}
                >
                  {isRecording && (
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                  )}
                  {isRecording ? (
                    <MicOff className="w-5 h-5 text-white relative z-10" />
                  ) : (
                    <Mic className="w-5 h-5 text-[#888]" />
                  )}
                </button>
              )}
              {isRecording ? (
                <div className="flex items-center gap-2 flex-1 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-400 rounded-full animate-pulse"
                        style={{
                          height: `${8 + Math.random() * 16}px`,
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-red-400 ml-2">
                    Listening...
                  </span>
                </div>
              ) : (
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer... (Shift+Enter for new line)"
                  className="flex-1 min-h-11 max-h-40 resize-none"
                  rows={1}
                />
              )}
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Code editor panel */}
        {showCode && (
          <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <div className="flex items-center gap-1">
                {CODE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setCodeLang(lang.id);
                      setCode(DEFAULT_CODE[lang.id] || "");
                      setCodeOutput(null);
                    }}
                    className={`text-xs px-2.5 py-1 rounded transition-colors ${codeLang === lang.id ? "bg-indigo-600 text-white" : "text-[#888] hover:text-white hover:bg-white/10"}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 h-7 text-xs border-white/10 text-[#ccc] hover:text-white"
                  onClick={runCode}
                  disabled={runningCode}
                >
                  {runningCode ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}{" "}
                  Run
                </Button>
                <Button
                  size="sm"
                  className="gap-1 h-7 text-xs bg-indigo-600 hover:bg-indigo-700"
                  onClick={sendCodeWithMessage}
                  disabled={isLoading}
                >
                  <MessageSquare className="w-3 h-3" /> Submit
                </Button>
              </div>
            </div>
            <div className="flex-1">
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
              <div className="border-t border-white/10 max-h-40 overflow-y-auto">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#666]">
                      Output
                    </span>
                    {codeOutput.exitCode === 0 ? (
                      <Badge className="text-[9px] bg-emerald-500/20 text-emerald-400 border-0">
                        OK
                      </Badge>
                    ) : (
                      <Badge className="text-[9px] bg-red-500/20 text-red-400 border-0">
                        Error
                      </Badge>
                    )}
                    {codeOutput.executionTime > 0 && (
                      <span className="text-[10px] text-[#666]">
                        {codeOutput.executionTime.toFixed(0)}ms
                      </span>
                    )}
                  </div>
                  <pre className="text-xs text-[#ccc] font-mono whitespace-pre-wrap">
                    {codeOutput.stdout || codeOutput.stderr || "No output"}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
