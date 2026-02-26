"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Send,
  Mic,
  MicOff,
  Lightbulb,
  SkipForward,
  Square,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

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

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Load session
  useEffect(() => {
    const loadSession = async () => {
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
            startInterview();
          }
        }
      } catch (error) {
        console.error("Failed to load session:", error);
      }
    };
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const startInterview = async () => {
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
    } catch (error) {
      console.error("Failed to start interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
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
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
        if (data.newQuestion) {
          setQuestionNum((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestHint = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hint" }),
      });
      const data = await res.json();
      if (data.message) {
        setHintsUsed((prev) => prev + 1);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: `💡 **Hint:** ${data.message}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to get hint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const skipQuestion = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "skip" }),
      });
      const data = await res.json();
      if (data.message) {
        setQuestionNum((prev) => prev + 1);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to skip question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const endInterview = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end" }),
      });
      router.push(`/interview/${sessionId}/report`);
    } catch (error) {
      console.error("Failed to end interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-speech for AI responses in voice mode
  const speakText = useCallback((text: string) => {
    if (!sessionInfo?.voiceMode) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Google") && v.lang.startsWith("en")
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, [sessionInfo?.voiceMode]);

  // Auto-speak AI messages when voice mode is on
  useEffect(() => {
    if (!sessionInfo?.voiceMode || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "assistant") {
      speakText(lastMsg.content);
    }
  }, [messages, sessionInfo?.voiceMode, speakText]);

  // Voice recording
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition: typeof window.SpeechRecognition;
        }
      ).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser. Please use Chrome.");
      return;
    }
    // Stop TTS if it's speaking
    window.speechSynthesis.cancel();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscript || interimTranscript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between py-3 px-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium capitalize">
              {sessionInfo?.type?.replace("-", " ")} Interview
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {sessionInfo?.company} • {sessionInfo?.difficulty}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            className="gap-1"
          >
            <Square className="w-3 h-3" /> End
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white rounded-tr-sm"
                    : "bg-muted rounded-tl-sm"
                }`}
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
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm p-4">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Actions bar */}
      <div className="border-t border-border p-3 flex items-center gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={requestHint}
          disabled={isLoading}
          className="gap-1"
        >
          <Lightbulb className="w-4 h-4" /> Hint
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={skipQuestion}
          disabled={isLoading}
          className="gap-1"
        >
          <SkipForward className="w-4 h-4" /> Skip
        </Button>
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-3">
          {sessionInfo?.voiceMode && (
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={toggleRecording}
              className="shrink-0"
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}

          {isRecording && (
            <div className="flex items-center gap-2 flex-1 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <div className="voice-waveform">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="text-sm text-red-500 ml-2">Recording...</span>
            </div>
          )}

          {!isRecording && (
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer... (Shift+Enter for new line)"
              className="flex-1 min-h-11 max-h-50 resize-none"
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
  );
}
