"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Keyboard,
  Lightbulb,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react";
import { useVoiceInterview } from "@/hooks/useVoiceInterview";
import "./video-call.css";

interface Message {
  id: string;
  role: "interviewer" | "user";
  content: string;
  timestamp: Date;
}

export default function VideoInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionParam = params?.id;
  const sessionId = Array.isArray(sessionParam)
    ? sessionParam[0]
    : (sessionParam ?? "");

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const transcriptPanelRef = useRef<HTMLDivElement>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTranscriptRef = useRef("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<{
    type: string;
    company: string;
    difficulty: string;
  } | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [waveformData, setWaveformData] = useState<number[]>(
    new Array(20).fill(4),
  );

  const {
    isListening,
    transcript,
    interimTranscript,
    fillerCount,
    wordsPerMinute,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    resetTranscript,
    isSupported,
  } = useVoiceInterview();

  // ─── Camera & Audio Setup ──────────────────────
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        setStream(s);
        if (userVideoRef.current) userVideoRef.current.srcObject = s;
      })
      .catch(() => setCamOn(false));
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptPanelRef.current)
      transcriptPanelRef.current.scrollTop =
        transcriptPanelRef.current.scrollHeight;
  }, [messages]);

  // Audio visualization
  useEffect(() => {
    if (isListening) setupAudioVisualization();
    else {
      cleanupAudioVisualization();
      setWaveformData(new Array(20).fill(4));
    }
    return () => cleanupAudioVisualization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const setupAudioVisualization = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      audioCtx.createMediaStreamSource(audioStream).connect(analyser);
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const bars: number[] = [];
        const bucketSize = Math.floor(bufferLength / 20);
        for (let i = 0; i < 20; i++) {
          let sum = 0;
          for (let j = 0; j < bucketSize; j++)
            sum += dataArray[i * bucketSize + j] || 0;
          bars.push(Math.max(4, Math.min(48, (sum / bucketSize / 255) * 48)));
        }
        setWaveformData(bars);
        animFrameRef.current = requestAnimationFrame(update);
      };
      animFrameRef.current = requestAnimationFrame(update);
    } catch {
      /* ignore */
    }
  };

  const cleanupAudioVisualization = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current)
      audioContextRef.current.close().catch(() => { });
    audioContextRef.current = null;
    analyserRef.current = null;
  };

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
          });
          startInterviewChat();
        }
      } catch {
        /* ignore */
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // ─── Silence Detection ─────────────────────────
  useEffect(() => {
    if (transcript !== prevTranscriptRef.current && transcript.length > 0) {
      prevTranscriptRef.current = transcript;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (isListening && transcript.trim().length > 5) submitAnswer();
      }, 2500);
    }
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening]);

  // ─── SSE Stream Consumer ───────────────────────
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
        } catch {
          /* skip */
        }
      }
    }
    if (accumulated) onComplete(accumulated);
  };

  // ─── Interview Actions ─────────────────────────
  const startInterviewChat = async () => {
    if (!sessionId) return;
    setAiThinking(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      await consumeSSEResponse(res, (aiMessage) => {
        setMessages([
          {
            id: `msg-${Date.now()}`,
            role: "interviewer",
            content: aiMessage,
            timestamp: new Date(),
          },
        ]);
        setQuestionNumber(1);
        setAiThinking(false);
        setAiSpeaking(true);
        speakText(aiMessage, () => {
          setAiSpeaking(false);
          if (micOn) startListening();
        });
      });
    } catch {
      setAiThinking(false);
    }
  };

  const submitAnswer = useCallback(async () => {
    if (!transcript.trim() || !sessionId) return;
    stopListening();
    setAiThinking(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-user-${Date.now()}`,
        role: "user",
        content: transcript,
        timestamp: new Date(),
      },
    ]);
    const userText = transcript;
    resetTranscript();
    prevTranscriptRef.current = "";
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", content: userText }),
      });
      await consumeSSEResponse(res, (aiMessage) => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-ai-${Date.now()}`,
            role: "interviewer",
            content: aiMessage,
            timestamp: new Date(),
          },
        ]);
        setAiThinking(false);
        setAiSpeaking(true);
        speakText(aiMessage, () => {
          setAiSpeaking(false);
          if (micOn) startListening();
        });
      });
    } catch {
      setAiThinking(false);
    }
  }, [
    transcript,
    sessionId,
    stopListening,
    resetTranscript,
    speakText,
    startListening,
    micOn,
  ]);

  const handleHint = async () => {
    if (hintsRemaining <= 0 || !sessionId) return;
    setHintsRemaining((p) => p - 1);
    stopListening();
    setAiThinking(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hint" }),
      });
      await consumeSSEResponse(res, (hint) => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-hint-${Date.now()}`,
            role: "interviewer",
            content: `💡 ${hint}`,
            timestamp: new Date(),
          },
        ]);
        setAiThinking(false);
        setAiSpeaking(true);
        speakText(hint, () => {
          setAiSpeaking(false);
          if (micOn) startListening();
        });
      });
    } catch {
      setAiThinking(false);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    stopListening();
    setAiThinking(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-user-${Date.now()}`,
        role: "user",
        content: textInput.trim(),
        timestamp: new Date(),
      },
    ]);
    const text = textInput.trim();
    setTextInput("");

    fetch(`/api/interview/${sessionId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "message", content: text }),
    })
      .then((res) =>
        consumeSSEResponse(res, (aiMessage) => {
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-ai-${Date.now()}`,
              role: "interviewer",
              content: aiMessage,
              timestamp: new Date(),
            },
          ]);
          setAiThinking(false);
          setAiSpeaking(true);
          speakText(aiMessage, () => {
            setAiSpeaking(false);
            if (micOn) startListening();
          });
        }),
      )
      .catch(() => setAiThinking(false));
  };

  const toggleMic = () => {
    setMicOn(!micOn);
    stream?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    if (micOn && isListening) stopListening();
    if (!micOn) startListening();
  };

  const toggleCam = () => {
    setCamOn(!camOn);
    stream?.getVideoTracks().forEach((t) => (t.enabled = !camOn));
  };

  const toggleMute = () => {
    if (!isMuted) stopSpeaking();
    setIsMuted(!isMuted);
  };

  const endInterview = async () => {
    stopListening();
    stopSpeaking();
    stream?.getTracks().forEach((t) => t.stop());
    if (sessionId) {
      try {
        await fetch(`/api/interview/${sessionId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "end" }),
        });
      } catch {
        /* ok */
      }
    }
    router.push(`/interview/${sessionId}/report`);
  };

  // ─── Helpers ───────────────────────────────────
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const companyName = sessionInfo?.company
    ? sessionInfo.company.charAt(0).toUpperCase() + sessionInfo.company.slice(1)
    : "Company";

  const lastAiMessage =
    messages.filter((m) => m.role === "interviewer").slice(-1)[0]?.content || "";

  const aiStatus = aiThinking
    ? "thinking"
    : aiSpeaking
      ? "speaking"
      : isListening
        ? "listening"
        : "idle";

  // ─── Render ────────────────────────────────────
  return (
    <div className="vc-root">
      {/* ═══ Top Bar ═══ */}
      <div className="vc-topbar">
        <div className="vc-topbar-left">
          <div className="vc-topbar-dot" />
          <span className="vc-topbar-title">
            {companyName} — {sessionInfo?.type?.replace(/_/g, " ") || "Interview"}
          </span>
          {sessionInfo?.difficulty && (
            <span className="vc-topbar-badge">{sessionInfo.difficulty}</span>
          )}
        </div>
        <div className="vc-topbar-center">
          <span className="vc-topbar-stat">Q{questionNumber}</span>
          {wordsPerMinute > 0 && (
            <span className="vc-topbar-stat">{wordsPerMinute} WPM</span>
          )}
          {fillerCount > 0 && (
            <span className="vc-topbar-stat vc-topbar-stat--warn">
              <AlertTriangle style={{ width: 12, height: 12 }} /> {fillerCount}
            </span>
          )}
          <span className="vc-topbar-timer">
            <Clock style={{ width: 12, height: 12 }} />
            {formatTime(callDuration)}
          </span>
        </div>
      </div>

      {/* ═══ Main Area ═══ */}
      <div className="vc-main">
        {/* AI Panel (left/major) */}
        <div className="vc-ai-panel">
          <div className="vc-ai-avatar-container">
            {/* Waveform (shown when user is speaking) */}
            {isListening && (
              <div className="vc-waveform">
                {waveformData.map((h, i) => (
                  <div
                    key={i}
                    className={`vc-waveform-bar ${isListening ? "vc-waveform-bar--active" : "vc-waveform-bar--idle"}`}
                    style={{ height: h }}
                  />
                ))}
              </div>
            )}

            {/* AI Avatar */}
            <div style={{ position: "relative" }}>
              {aiSpeaking &&
                [0, 1, 2].map((i) => <div key={i} className="vc-ai-ring" />)}
              <div
                className={`vc-ai-avatar ${aiSpeaking ? "vc-ai-avatar--speaking" : ""}`}
              >
                <span className="vc-ai-avatar-letter">AI</span>
                {aiSpeaking && (
                  <div className="vc-ai-soundwave">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="vc-ai-soundwave-bar" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Info */}
            <div style={{ textAlign: "center" }}>
              <div className="vc-ai-name">AI Interviewer</div>
              <div className="vc-ai-role">
                Senior Engineer · {companyName}
              </div>

              <div className="vc-ai-status">
                {aiStatus === "thinking" && (
                  <>
                    <div className="vc-thinking-dots">
                      <span className="vc-thinking-dot" />
                      <span className="vc-thinking-dot" />
                      <span className="vc-thinking-dot" />
                    </div>
                    <span className="vc-ai-status-text vc-ai-status-text--thinking">
                      Thinking...
                    </span>
                  </>
                )}
                {aiStatus === "speaking" && (
                  <>
                    <div className="vc-ai-status-dot vc-ai-status-dot--speaking" />
                    <span className="vc-ai-status-text vc-ai-status-text--speaking">
                      Speaking...
                    </span>
                  </>
                )}
                {aiStatus === "listening" && (
                  <>
                    <div className="vc-ai-status-dot vc-ai-status-dot--listening" />
                    <span className="vc-ai-status-text vc-ai-status-text--listening">
                      Listening...
                    </span>
                  </>
                )}
                {aiStatus === "idle" && (
                  <span className="vc-ai-status-text vc-ai-status-text--idle">
                    Ready
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Caption overlay */}
          {showCaptions && lastAiMessage && (
            <div className="vc-caption">
              <div className="vc-caption-box">
                <div className="vc-caption-label">
                  Current Question · Q{questionNumber}
                </div>
                <div className="vc-caption-text">
                  {lastAiMessage.length > 250
                    ? lastAiMessage.slice(-250) + "..."
                    : lastAiMessage}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel — Webcam + Transcript */}
        <div className="vc-right-panel">
          <div className="vc-webcam">
            {camOn ? (
              <video ref={userVideoRef} autoPlay muted playsInline />
            ) : (
              <div className="vc-webcam-placeholder">
                <div className="vc-webcam-placeholder-avatar">You</div>
              </div>
            )}
            {isListening && (
              <div className="vc-webcam-rec">
                <div className="vc-webcam-rec-dot" />
                <span className="vc-webcam-rec-text">REC</span>
              </div>
            )}
          </div>

          <div ref={transcriptPanelRef} className="vc-transcript">
            <div className="vc-transcript-label">Your Answer</div>
            <div className="vc-transcript-text">
              {transcript}
              {interimTranscript && (
                <span className="vc-transcript-interim">
                  {" "}
                  {interimTranscript}
                </span>
              )}
              {!transcript && !interimTranscript && (
                <span className="vc-transcript-placeholder">
                  {isListening
                    ? "Listening... start speaking"
                    : "Press mic to start answering"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Text Input (if toggled) ═══ */}
      {showTextInput && (
        <div className="vc-textinput">
          <div className="vc-textinput-row">
            <input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTextSubmit();
              }}
              placeholder="Type your answer..."
              className="vc-textinput-field"
            />
            <button onClick={handleTextSubmit} className="vc-textinput-send">
              <Send style={{ width: 16, height: 16, color: "white" }} />
            </button>
          </div>
        </div>
      )}

      {/* ═══ Bottom Toolbar ═══ */}
      <div className="vc-toolbar">
        {/* Mic */}
        <div className="vc-tool-btn">
          <button
            onClick={toggleMic}
            className={`vc-tool-btn-circle ${!micOn
                ? "vc-tool-btn-circle--danger"
                : isListening
                  ? "vc-tool-btn-circle--mic-live"
                  : "vc-tool-btn-circle--default"
              }`}
          >
            {micOn ? (
              <Mic style={{ width: 20, height: 20, color: "white" }} />
            ) : (
              <MicOff style={{ width: 20, height: 20, color: "#EF4444" }} />
            )}
          </button>
          <span className="vc-tool-label">{micOn ? "Mic" : "Unmute"}</span>
        </div>

        {/* Camera */}
        <div className="vc-tool-btn">
          <button
            onClick={toggleCam}
            className={`vc-tool-btn-circle ${!camOn ? "vc-tool-btn-circle--danger" : "vc-tool-btn-circle--default"}`}
          >
            {camOn ? (
              <Video style={{ width: 20, height: 20, color: "white" }} />
            ) : (
              <VideoOff style={{ width: 20, height: 20, color: "#EF4444" }} />
            )}
          </button>
          <span className="vc-tool-label">{camOn ? "Camera" : "Show"}</span>
        </div>

        {/* Speaker */}
        <div className="vc-tool-btn">
          <button
            onClick={toggleMute}
            className={`vc-tool-btn-circle ${isMuted ? "vc-tool-btn-circle--danger" : "vc-tool-btn-circle--default"}`}
          >
            {isMuted ? (
              <VolumeX
                style={{ width: 20, height: 20, color: "#EF4444" }}
              />
            ) : (
              <Volume2 style={{ width: 20, height: 20, color: "white" }} />
            )}
          </button>
          <span className="vc-tool-label">Speaker</span>
        </div>

        {/* Text Input Toggle */}
        <div className="vc-tool-btn">
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className={`vc-tool-btn-circle ${showTextInput ? "vc-tool-btn-circle--active" : "vc-tool-btn-circle--default"}`}
          >
            <Keyboard
              style={{
                width: 20,
                height: 20,
                color: showTextInput ? "#818CF8" : "white",
              }}
            />
          </button>
          <span className="vc-tool-label">Type</span>
        </div>

        {/* Captions Toggle */}
        <div className="vc-tool-btn">
          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`vc-tool-btn-circle ${showCaptions ? "vc-tool-btn-circle--active" : "vc-tool-btn-circle--default"}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={showCaptions ? "#818CF8" : "white"}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 20, height: 20 }}
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M7 15h2M15 15h2M7 11h4M15 11h2" />
            </svg>
          </button>
          <span className="vc-tool-label">Captions</span>
        </div>

        {/* Hint */}
        <div className="vc-tool-btn">
          <button
            onClick={handleHint}
            disabled={hintsRemaining <= 0}
            className="vc-tool-btn-circle vc-tool-btn-circle--default"
            style={{
              position: "relative",
              opacity: hintsRemaining <= 0 ? 0.3 : 1,
            }}
          >
            <Lightbulb style={{ width: 20, height: 20, color: "#F59E0B" }} />
            {hintsRemaining > 0 && (
              <span className="vc-hint-badge">{hintsRemaining}</span>
            )}
          </button>
          <span className="vc-tool-label">Hint</span>
        </div>

        {/* End Call */}
        <div className="vc-tool-btn">
          <button
            onClick={() => setShowEndConfirm(true)}
            className="vc-tool-btn-circle vc-tool-btn-circle--end"
          >
            <PhoneOff style={{ width: 22, height: 22, color: "white" }} />
          </button>
          <span className="vc-tool-label" style={{ color: "#EF4444" }}>
            End
          </span>
        </div>
      </div>

      {/* Browser Warning */}
      {!isSupported && (
        <div className="vc-warning">
          Speech recognition not supported. Use Chrome or Edge, or switch to
          text input.
        </div>
      )}

      {/* ═══ End Modal ═══ */}
      {showEndConfirm && (
        <div
          className="vc-modal-overlay"
          onClick={() => setShowEndConfirm(false)}
        >
          <div className="vc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vc-modal-icon">
              <PhoneOff style={{ width: 24, height: 24, color: "#EF4444" }} />
            </div>
            <h3>End this session?</h3>
            <p>
              You have answered {questionNumber > 0 ? questionNumber - 1 : 0}{" "}
              questions. Your progress will be saved and you&apos;ll receive a
              detailed report.
            </p>
            <button
              onClick={() => setShowEndConfirm(false)}
              className="vc-modal-btn vc-modal-btn--cancel"
            >
              Continue Interview
            </button>
            <button onClick={endInterview} className="vc-modal-btn vc-modal-btn--end">
              End &amp; View Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
