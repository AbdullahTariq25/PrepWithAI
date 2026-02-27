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
  Maximize2,
  Minimize2,
  MessageSquare,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useVoiceInterview } from "@/hooks/useVoiceInterview";

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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality] = useState<"good" | "fair" | "poor">("good");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{
    type: string;
    company: string;
    difficulty: string;
  } | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

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
    resetTranscript,
  } = useVoiceInterview();

  // Start webcam
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

  // Load session info
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
          startInterviewChat();
        }
      } catch {
        console.error("Failed to load session");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const startInterviewChat = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const data = await res.json();
      if (data.message) {
        const msg: Message = {
          id: `msg-${Date.now()}`,
          role: "interviewer",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages([msg]);
        setQuestionNumber(1);
        // AI speaks the first question
        setAiSpeaking(true);
        speakText(data.message, () => setAiSpeaking(false));
      }
    } catch {
      console.error("Failed to start interview");
    }
  };

  const submitAnswer = useCallback(async () => {
    if (!transcript.trim() || isProcessing || !sessionId) return;
    stopListening();
    setIsProcessing(true);

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content: transcript,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`/api/interview/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", content: transcript }),
      });
      const data = await res.json();
      if (data.message) {
        const aiMsg: Message = {
          id: `msg-ai-${Date.now()}`,
          role: "interviewer",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (data.newQuestion) setQuestionNumber((p) => p + 1);
        resetTranscript();
        // AI speaks
        setAiSpeaking(true);
        speakText(data.message, () => setAiSpeaking(false));
      }
    } catch {
      console.error("Failed to send message");
    } finally {
      setIsProcessing(false);
    }
  }, [
    transcript,
    isProcessing,
    sessionId,
    stopListening,
    resetTranscript,
    speakText,
  ]);

  const endInterview = async () => {
    stopListening();
    stopSpeaking();
    stream?.getTracks().forEach((t) => t.stop());

    if (sessionId) {
      try {
        await fetch(`/api/interview/${sessionId}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fillerCount,
            wordsPerMinute,
            duration: callDuration,
            mode: "video",
          }),
        });
      } catch {
        // Continue anyway
      }
    }
    router.push(`/interview/${sessionId}/report`);
  };

  const toggleMic = () => {
    setMicOn(!micOn);
    stream?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    if (micOn && isListening) stopListening();
  };

  const toggleCam = () => {
    setCamOn(!camOn);
    stream?.getVideoTracks().forEach((t) => (t.enabled = !camOn));
  };

  const toggleRecord = () => {
    if (isListening) {
      stopListening();
      // After stopping, submit the answer
      if (transcript.trim()) {
        submitAnswer();
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const companyName = sessionInfo?.company
    ? sessionInfo.company.charAt(0).toUpperCase() + sessionInfo.company.slice(1)
    : "Company";
  const interviewTitle = `${companyName} — ${sessionInfo?.type?.replace(/_/g, " ") || "Interview"}`;

  return (
    <div className="h-screen bg-[#050505] flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-white/[0.06] bg-[#080808] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-white font-medium capitalize">
            {interviewTitle}
          </span>
          {sessionInfo?.difficulty && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-[#888] capitalize">
              {sessionInfo.difficulty}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Connection quality */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 rounded-full ${
                  connectionQuality === "good"
                    ? "bg-green-500"
                    : i <= 2
                      ? "bg-amber-500"
                      : "bg-white/10"
                }`}
                style={{ height: `${6 + i * 3}px` }}
              />
            ))}
          </div>
          {/* Question counter */}
          <span className="text-xs text-[#555]">Q{questionNumber}</span>
          {/* Timer */}
          <div className="text-sm font-mono text-white/60">
            {formatTime(callDuration)}
          </div>
        </div>
      </div>

      {/* MAIN VIDEO AREA */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* AI INTERVIEWER (left, main) */}
        <div className="flex-1 relative bg-[#0A0A0A] flex items-center justify-center">
          {/* Subtle grid background */}
          <div className="absolute inset-0 hero-grid opacity-30" />

          {/* AI Avatar */}
          <div className="flex flex-col items-center gap-6 z-10">
            <div
              className={`relative w-36 h-36 rounded-full border-4 ${
                aiSpeaking
                  ? "border-indigo-500 shadow-xl shadow-indigo-500/30"
                  : "border-white/10"
              } transition-all duration-300`}
            >
              {/* Pulse rings */}
              {aiSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
                  <div
                    className="absolute -inset-3 rounded-full border border-indigo-500/10 animate-ping"
                    style={{ animationDelay: "0.3s" }}
                  />
                </>
              )}

              {/* Avatar */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-white/90">AI</span>
                  {/* Waveform when speaking */}
                  {aiSpeaking && (
                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-white/80 rounded-full wave-bar"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white font-medium text-lg">AI Interviewer</p>
              <p className="text-white/40 text-sm capitalize">
                {companyName} ·{" "}
                {sessionInfo?.type?.replace(/_/g, " ") || "Interview"}
              </p>
              {aiSpeaking && (
                <div className="flex items-center gap-2 mt-2 justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400">Speaking...</span>
                </div>
              )}
              {isProcessing && (
                <div className="flex items-center gap-2 mt-2 justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs text-amber-400">Thinking...</span>
                </div>
              )}
            </div>
          </div>

          {/* Current question overlay */}
          {messages.filter((m) => m.role === "interviewer").length > 0 && (
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wider font-medium">
                  Current Question · Q{questionNumber}
                </p>
                <p className="text-sm text-white/90 leading-relaxed">
                  {
                    messages
                      .filter((m) => m.role === "interviewer")
                      .slice(-1)[0]?.content
                  }
                </p>
              </div>
            </div>
          )}

          {/* Stats overlay (top-left) */}
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
              <Clock className="w-3 h-3 text-white/40" />
              <span className="text-xs text-white/60 font-mono">
                {formatTime(callDuration)}
              </span>
            </div>
            {wordsPerMinute > 0 && (
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <span className="text-xs text-white/60">
                  {wordsPerMinute} WPM
                </span>
              </div>
            )}
            {fillerCount > 0 && (
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-amber-400">
                  {fillerCount} fillers
                </span>
              </div>
            )}
          </div>
        </div>

        {/* USER WEBCAM (right, smaller) */}
        <div
          className={`${
            showTranscript ? "w-[320px]" : "w-[240px]"
          } border-l border-white/[0.06] relative bg-[#080808] flex flex-col transition-all duration-200`}
        >
          {/* User video */}
          <div className="relative flex-1 bg-[#0D0D0D] overflow-hidden min-h-[200px]">
            {camOn ? (
              <video
                ref={userVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white/40">You</span>
                </div>
              </div>
            )}

            {/* Recording indicator */}
            {isListening && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-white/70">REC</span>
              </div>
            )}

            {/* Mic level indicator */}
            {micOn && isListening && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <div className="flex items-end gap-0.5 h-5">
                  {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-green-500 rounded-full wave-bar"
                      style={{ animationDelay: `${i * 80}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live transcript panel */}
          {showTranscript && (
            <div className="h-[200px] p-4 overflow-y-auto border-t border-white/[0.06]">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-medium">
                Your Answer (Live)
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                {transcript}
                {interimTranscript && (
                  <span className="text-white/30 italic">
                    {" "}
                    {interimTranscript}
                  </span>
                )}
              </p>
              {!transcript && !interimTranscript && (
                <p className="text-xs text-white/20 italic">
                  {isListening
                    ? "Listening... start speaking"
                    : "Press the mic button to start answering"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="h-20 flex items-center justify-center gap-4 border-t border-white/[0.06] bg-[#080808] shrink-0">
        {/* Mic toggle */}
        <button
          onClick={toggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 ${
            micOn
              ? "bg-[#1A1A1A] border border-white/10 hover:border-white/20"
              : "bg-red-500/20 border border-red-500/30"
          }`}
          title={micOn ? "Mute microphone" : "Unmute microphone"}
        >
          {micOn ? (
            <Mic className="w-5 h-5 text-white" />
          ) : (
            <MicOff className="w-5 h-5 text-red-400" />
          )}
        </button>

        {/* Camera toggle */}
        <button
          onClick={toggleCam}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 ${
            camOn
              ? "bg-[#1A1A1A] border border-white/10 hover:border-white/20"
              : "bg-red-500/20 border border-red-500/30"
          }`}
          title={camOn ? "Turn off camera" : "Turn on camera"}
        >
          {camOn ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <VideoOff className="w-5 h-5 text-red-400" />
          )}
        </button>

        {/* MAIN RECORD/SPEAK BUTTON */}
        <button
          onClick={toggleRecord}
          disabled={isProcessing || aiSpeaking}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            isListening
              ? "bg-red-500 shadow-lg shadow-red-500/40 animate-record"
              : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30"
          }`}
          title={isListening ? "Stop & submit answer" : "Start speaking"}
        >
          {isListening ? (
            <div className="w-5 h-5 bg-white rounded" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Volume / Speaker */}
        <button
          onClick={() => {
            if (isSpeaking) {
              stopSpeaking();
            }
          }}
          className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-150"
          title="Toggle AI voice"
        >
          {isSpeaking ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Transcript toggle */}
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 ${
            showTranscript
              ? "bg-indigo-500/20 border border-indigo-500/30"
              : "bg-[#1A1A1A] border border-white/10 hover:border-white/20"
          }`}
          title="Toggle transcript"
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
              setIsFullscreen(true);
            } else {
              document.exitFullscreen();
              setIsFullscreen(false);
            }
          }}
          className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-150"
          title="Toggle fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-white" />
          ) : (
            <Maximize2 className="w-5 h-5 text-white" />
          )}
        </button>

        {/* End call */}
        <button
          onClick={() => setShowEndConfirm(true)}
          className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-all duration-150 shadow-lg shadow-red-500/30 active:scale-95 ml-4"
          title="End interview"
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* End call confirmation modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full mx-4 page-enter">
            <h3 className="text-lg font-semibold text-white mb-2">
              End Interview?
            </h3>
            <p className="text-sm text-[#888] mb-6">
              Your session will be saved and you&apos;ll receive a detailed
              performance report including filler word analysis and speaking
              metrics.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-transparent border border-white/[0.1] hover:border-white/[0.2] text-[#888] hover:text-white text-sm rounded-lg transition-all"
              >
                Continue
              </button>
              <button
                onClick={endInterview}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-400 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-red-500/20"
              >
                End & Get Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
