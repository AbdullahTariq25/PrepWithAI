"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Keyboard,
  Lightbulb,
  PhoneOff,
  Send,
} from "lucide-react";
import { useVoiceInterview } from "@/hooks/useVoiceInterview";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function VoiceInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionParam = params?.id;
  const sessionId = Array.isArray(sessionParam)
    ? sessionParam[0]
    : (sessionParam ?? "");

  const {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    fillerCount,
    wordsPerMinute,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    isSupported,
  } = useVoiceInterview();

  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<
    "idle" | "thinking" | "speaking" | "listening"
  >("idle");
  const [elapsed, setElapsed] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const [totalQuestions] = useState(5);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(
    new Array(20).fill(4),
  );
  const [sessionInfo, setSessionInfo] = useState<{
    type: string;
    company: string;
    difficulty: string;
  } | null>(null);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const prevTranscriptRef = useRef("");

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [conversation]);

  // Load session
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
          });
          // Start the interview
          startInterviewConversation();
        }
      } catch (err) {
        console.error("Load session error:", err);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Audio visualization
  useEffect(() => {
    if (isListening) {
      setupAudioVisualization();
    } else {
      cleanupAudioVisualization();
      setWaveformData(new Array(20).fill(4));
    }
    return () => cleanupAudioVisualization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  // Silence detection — when user stops speaking for 2 seconds
  useEffect(() => {
    if (transcript !== prevTranscriptRef.current && transcript.length > 0) {
      prevTranscriptRef.current = transcript;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (isListening && transcript.trim().length > 5) {
          handleUserFinishedSpeaking(transcript);
        }
      }, 2500);
    }
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening]);

  const setupAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const bars: number[] = [];
        const bucketSize = Math.floor(bufferLength / 20);
        for (let i = 0; i < 20; i++) {
          let sum = 0;
          for (let j = 0; j < bucketSize; j++) {
            sum += dataArray[i * bucketSize + j] || 0;
          }
          const avg = sum / bucketSize;
          const normalized = Math.max(4, Math.min(48, (avg / 255) * 48));
          bars.push(normalized);
        }
        setWaveformData(bars);
        animFrameRef.current = requestAnimationFrame(updateWaveform);
      };

      animFrameRef.current = requestAnimationFrame(updateWaveform);
    } catch {
      console.error("Failed to setup audio visualization");
    }
  };

  const cleanupAudioVisualization = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const consumeSSEResponse = async (
    res: Response,
    onComplete: (fullText: string) => void,
  ) => {
    const reader = res.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";
    let accumulated = "";
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
          if (data.content) accumulated += data.content;
          if (data.done) onComplete(accumulated);
        } catch { /* skip */ }
      }
    }
    if (accumulated && !accumulated.includes("[DONE]")) onComplete(accumulated);
  };

  const startInterviewConversation = async () => {
    setAiStatus("thinking");
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });

      await consumeSSEResponse(res, (aiMessage) => {
        setConversation([
          { role: "assistant", content: aiMessage, timestamp: new Date() },
        ]);
        setAiStatus("speaking");
        if (!isMuted) {
          speakText(aiMessage, () => setAiStatus("listening"));
        } else {
          setAiStatus("listening");
        }
      });
    } catch {
      const fallback =
        "Hello! I am Alex, your interviewer today. Let us start with a brief introduction. Tell me about yourself.";
      setConversation([
        { role: "assistant", content: fallback, timestamp: new Date() },
      ]);
      setAiStatus("listening");
    }
  };

  const handleUserFinishedSpeaking = async (userText: string) => {
    stopListening();
    setAiStatus("thinking");

    const userMsg: ConversationMessage = {
      role: "user",
      content: userText.trim(),
      timestamp: new Date(),
    };
    setConversation((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", content: userText.trim() }),
      });

      await consumeSSEResponse(res, (aiResponse) => {
        const aiMsg: ConversationMessage = {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        };
        setConversation((prev) => [...prev, aiMsg]);

        setAiStatus("speaking");
        if (!isMuted) {
          speakText(aiResponse, () => {
            setAiStatus("listening");
          });
        } else {
          setAiStatus("listening");
        }
      });
    } catch {
      setAiStatus("listening");
    }

    prevTranscriptRef.current = "";
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    handleUserFinishedSpeaking(textInput.trim());
    setTextInput("");
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      setAiStatus("idle");
    } else {
      startListening();
      setAiStatus("listening");
    }
  };

  const handleMuteToggle = () => {
    if (!isMuted) {
      stopSpeaking();
    }
    setIsMuted(!isMuted);
  };

  const handleHint = async () => {
    if (hintsRemaining <= 0) return;
    setHintsRemaining((p) => p - 1);
    setAiStatus("thinking");

    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hint" }),
      });

      await consumeSSEResponse(res, (hint) => {
        const hintMsg: ConversationMessage = {
          role: "assistant",
          content: `💡 Hint: ${hint}`,
          timestamp: new Date(),
        };
        setConversation((prev) => [...prev, hintMsg]);
        setAiStatus("speaking");
        if (!isMuted) {
          speakText(hint, () => setAiStatus("listening"));
        } else {
          setAiStatus("listening");
        }
      });
    } catch {
      setAiStatus("listening");
    }
  };

  const handleEndCall = async () => {
    stopListening();
    stopSpeaking();
    cleanupAudioVisualization();
    try {
      await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end" }),
      });
    } catch {
      /* ignore */
    }
    router.push(`/interview/${sessionId}/report`);
  };

  const formatTime = (s: number): string => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#080808",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* ─── Top Info Bar ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {sessionInfo && (
            <>
              <span
                style={{
                  fontSize: 12,
                  padding: "3px 8px",
                  borderRadius: 6,
                  backgroundColor: "rgba(99,102,241,0.1)",
                  color: "#818CF8",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {sessionInfo.company}
              </span>
              <span
                style={{
                  fontSize: 12,
                  padding: "3px 8px",
                  borderRadius: 6,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "var(--text-secondary)",
                  textTransform: "capitalize",
                }}
              >
                {sessionInfo.type.replace(/_/g, " ")}
              </span>
            </>
          )}
        </div>
        <span
          className="font-code"
          style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatTime(elapsed)}
        </span>
        <span className="text-caption" style={{ color: "var(--text-muted)" }}>
          Q {questionNum} of {totalQuestions}
        </span>
      </div>

      {/* ─── AI Panel (Top Section) ─── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow background */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* AI Avatar */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          {/* Rings when speaking */}
          {aiStatus === "speaking" && (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 100 + i * 20,
                    height: 100 + i * 20,
                    marginTop: -(50 + i * 10),
                    marginLeft: -(50 + i * 10),
                    borderRadius: "50%",
                    border: "2px solid rgba(99,102,241,0.4)",
                    animation: `voice-ring-expand 1.2s ease-out infinite`,
                    animationDelay: `${i * 500}ms`,
                    pointerEvents: "none",
                  }}
                />
              ))}
            </>
          )}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                aiStatus === "speaking"
                  ? "0 0 40px rgba(99,102,241,0.4)"
                  : "0 0 20px rgba(99,102,241,0.2)",
              animation:
                aiStatus === "speaking"
                  ? "ai-speaking-scale 0.8s ease-in-out infinite"
                  : "none",
              transition: "box-shadow 300ms ease",
              position: "relative",
              zIndex: 2,
            }}
          >
            <span
              className="font-code"
              style={{ fontSize: 36, fontWeight: 700, color: "white" }}
            >
              A
            </span>
          </div>
        </div>

        {/* AI Name */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Alex Chen
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Senior Engineer · {sessionInfo?.company || "Google"}
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 24,
          }}
        >
          {aiStatus === "thinking" && (
            <>
              <div className="typing-indicator">
                <span />
                <span />
                <span />
              </div>
              <span style={{ fontSize: 12, color: "#818CF8" }}>
                Thinking...
              </span>
            </>
          )}
          {aiStatus === "speaking" && (
            <>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#22C55E",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <span style={{ fontSize: 12, color: "#22C55E" }}>
                Speaking...
              </span>
            </>
          )}
          {aiStatus === "listening" && (
            <>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#6366F1",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <span style={{ fontSize: 12, color: "#818CF8" }}>
                Listening...
              </span>
            </>
          )}
          {aiStatus === "idle" && (
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Ready
            </span>
          )}
        </div>

        {/* Transcript Panel */}
        <div
          ref={transcriptRef}
          style={{
            width: "90%",
            maxWidth: 600,
            maxHeight: 200,
            overflowY: "auto",
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 12,
            padding: 16,
          }}
        >
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={i === conversation.length - 1 ? "animate-fade-up" : ""}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
                opacity: i < conversation.length - 2 ? 0.5 : 1,
              }}
            >
              {msg.role === "assistant" && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{ fontSize: 8, color: "white", fontWeight: 700 }}
                  >
                    A
                  </span>
                </div>
              )}
              <div
                style={{
                  fontSize: 14,
                  color: msg.role === "user" ? "white" : "#D0D0D0",
                  fontStyle: msg.role === "user" ? "italic" : "normal",
                  maxWidth: "80%",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {interimTranscript && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                opacity: 0.6,
              }}
            >
              <span
                style={{ fontSize: 14, color: "white", fontStyle: "italic" }}
              >
                {interimTranscript}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Text Input (if toggled) ─── */}
      {showTextInput && (
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{ display: "flex", gap: 8, maxWidth: 600, margin: "0 auto" }}
          >
            <input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTextSubmit();
              }}
              placeholder="Type your answer..."
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 10,
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              onClick={handleTextSubmit}
              aria-label="Send message"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: "#6366F1",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send style={{ width: 16, height: 16, color: "white" }} />
            </button>
          </div>
        </div>
      )}

      {/* ─── Controls (Bottom Section) ─── */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          backgroundColor: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(20px)",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Waveform */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 4,
            height: 60,
            width: 280,
          }}
        >
          {waveformData.map((h, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: h,
                borderRadius: 3,
                background: isListening
                  ? `linear-gradient(to top, #22C55E, #86EFAC)`
                  : "var(--text-disabled)",
                transition: "height 80ms ease, background 200ms ease",
              }}
            />
          ))}
        </div>

        {/* Mic button + controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Speaker toggle */}
          <button
            onClick={handleMuteToggle}
            aria-label={isMuted ? "Unmute speaker" : "Mute speaker"}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 200ms ease",
            }}
          >
            {isMuted ? (
              <VolumeX
                style={{ width: 18, height: 18, color: "var(--text-muted)" }}
              />
            ) : (
              <Volume2
                style={{
                  width: 18,
                  height: 18,
                  color: "var(--text-secondary)",
                }}
              />
            )}
          </button>

          {/* Text input toggle */}
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            aria-label="Toggle text input"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: showTextInput
                ? "rgba(99,102,241,0.15)"
                : "rgba(255,255,255,0.06)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Keyboard
              style={{
                width: 18,
                height: 18,
                color: showTextInput ? "#818CF8" : "var(--text-secondary)",
              }}
            />
          </button>

          {/* Main Mic Button */}
          <button
            onClick={handleMicToggle}
            aria-label={isListening ? "Stop recording" : "Start recording"}
            className={isListening ? "voice-indicator-active" : ""}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: isListening ? "#22C55E" : "var(--bg-elevated)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 200ms ease",
            }}
          >
            {isListening ? (
              <Mic style={{ width: 32, height: 32, color: "white" }} />
            ) : (
              <Mic
                style={{
                  width: 32,
                  height: 32,
                  color: "var(--text-secondary)",
                }}
              />
            )}
          </button>

          {/* Hint */}
          <button
            onClick={handleHint}
            disabled={hintsRemaining <= 0}
            aria-label={`Get hint (${hintsRemaining} remaining)`}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor:
                hintsRemaining > 0
                  ? "rgba(245,158,11,0.1)"
                  : "rgba(255,255,255,0.03)",
              border: "none",
              cursor: hintsRemaining > 0 ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Lightbulb
              style={{
                width: 18,
                height: 18,
                color: hintsRemaining > 0 ? "#F59E0B" : "var(--text-disabled)",
              }}
            />
            {hintsRemaining > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#F59E0B",
                  color: "#000",
                  fontSize: 9,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {hintsRemaining}
              </span>
            )}
          </button>

          {/* End Call */}
          <button
            onClick={() => setShowEndDialog(true)}
            aria-label="End call"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "rgba(239,68,68,0.15)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneOff style={{ width: 18, height: 18, color: "#EF4444" }} />
          </button>
        </div>

        {/* Browser support warning */}
        {!isSupported && (
          <div
            style={{
              fontSize: 12,
              color: "#F59E0B",
              textAlign: "center",
              padding: "8px 16px",
              backgroundColor: "rgba(245,158,11,0.08)",
              borderRadius: 8,
            }}
          >
            Speech recognition is not supported in this browser. Please use
            Chrome or Edge, or switch to text input mode.
          </div>
        )}
      </div>

      {/* ─── End Call Dialog ─── */}
      {showEndDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            className="modal-enter"
            style={{
              width: 400,
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: 20,
              padding: 32,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "rgba(239,68,68,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <PhoneOff style={{ width: 24, height: 24, color: "#EF4444" }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              End this session?
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                marginBottom: 24,
              }}
            >
              You have answered {questionNum - 1} of {totalQuestions} questions.
              Your progress will be saved.
            </p>
            <button
              onClick={() => setShowEndDialog(false)}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 10,
                marginBottom: 8,
                backgroundColor: "transparent",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Continue Interview
            </button>
            <button
              onClick={handleEndCall}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 10,
                backgroundColor: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#EF4444",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              End & View Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
