"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "you know",
  "basically",
  "literally",
  "actually",
  "so",
  "right",
  "I mean",
  "sort of",
  "kind of",
];

const WAVEFORM_BARS = 20;
const SILENCE_TIMEOUT_MS = 2000;

interface UseVoiceInterviewReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  fillerCount: number;
  fillerWords: { word: string; count: number }[];
  wordsPerMinute: number;
  totalWords: number;
  speakingDuration: number;
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  /** 0-20 frequency bar values (0–1 normalized) for waveform visualization */
  waveformData: number[];
  /** Overall mic audio level 0–1 */
  audioLevel: number;
  /** True when user has been silent for > SILENCE_TIMEOUT_MS */
  silenceDetected: boolean;
  /** Register a callback that fires when silence is detected */
  onSilence: (cb: (() => void) | null) => void;
}

export function useVoiceInterview(): UseVoiceInterviewReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [fillerCount, setFillerCount] = useState(0);
  const [fillerWords, setFillerWords] = useState<
    { word: string; count: number }[]
  >([]);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [speakingDuration, setSpeakingDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(
    () => new Array(WAVEFORM_BARS).fill(0),
  );
  const [audioLevel, setAudioLevel] = useState(0);
  const [silenceDetected, setSilenceDetected] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // AudioContext refs for waveform
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  // Silence detection refs
  const lastSpeechRef = useRef<number>(0);
  const silenceCallbackRef = useRef<(() => void) | null>(null);
  const silenceFiredRef = useRef(false);

  const isSupported =
    typeof window !== "undefined" &&
    !!(
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: unknown })
        .webkitSpeechRecognition
    );

  const onSilence = useCallback((cb: (() => void) | null) => {
    silenceCallbackRef.current = cb;
  }, []);

  const detectFillers = useCallback((text: string) => {
    const lower = text.toLowerCase();
    let count = 0;
    const found: Record<string, number> = {};

    for (const word of FILLER_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      const matches = lower.match(regex);
      if (matches) {
        count += matches.length;
        found[word] = (found[word] || 0) + matches.length;
      }
    }

    if (count > 0) {
      setFillerCount((prev) => prev + count);
      setFillerWords((prev) => {
        const updated = [...prev];
        for (const [word, cnt] of Object.entries(found)) {
          const existing = updated.find((f) => f.word === word);
          if (existing) {
            existing.count += cnt;
          } else {
            updated.push({ word, count: cnt });
          }
        }
        return updated.sort((a, b) => b.count - a.count);
      });
    }
  }, []);

  const calculateWPM = useCallback((wordCount: number) => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    if (elapsed > 0.05) {
      setWordsPerMinute(Math.round(wordCount / elapsed));
    }
  }, []);

  // ─── AudioContext waveform analyser ───────────────
  const startAudioAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // gives 32 frequency bins; we pick 20
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);

        // Pick WAVEFORM_BARS evenly-spaced bins, normalize to 0–1
        const bars: number[] = [];
        const step = Math.max(1, Math.floor(dataArray.length / WAVEFORM_BARS));
        for (let i = 0; i < WAVEFORM_BARS; i++) {
          const idx = Math.min(i * step, dataArray.length - 1);
          bars.push(dataArray[idx] / 255);
        }
        setWaveformData(bars);

        // Compute RMS audio level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 255;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        setAudioLevel(rms);

        // Silence detection: if audio level drops below threshold
        const SILENCE_THRESHOLD = 0.04;
        if (rms > SILENCE_THRESHOLD) {
          lastSpeechRef.current = Date.now();
          silenceFiredRef.current = false;
          setSilenceDetected(false);
        } else {
          const silentFor = Date.now() - lastSpeechRef.current;
          if (silentFor > SILENCE_TIMEOUT_MS) {
            setSilenceDetected(true);
            if (!silenceFiredRef.current && silenceCallbackRef.current) {
              silenceFiredRef.current = true;
              silenceCallbackRef.current();
            }
          }
        }

        animFrameRef.current = requestAnimationFrame(tick);
      };

      animFrameRef.current = requestAnimationFrame(tick);
    } catch {
      // Mic denied or not available — waveform stays zeroed
    }
  }, []);

  const stopAudioAnalyser = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    analyserRef.current = null;
    if (audioCtxRef.current?.state !== "closed") {
      audioCtxRef.current?.close();
    }
    audioCtxRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setWaveformData(new Array(WAVEFORM_BARS).fill(0));
    setAudioLevel(0);
    setSilenceDetected(false);
  }, []);

  // ─── Speech Recognition ───────────────────────────

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const w = window as unknown as Record<string, unknown>;
    const SR = (w.SpeechRecognition || w.webkitSpeechRecognition) as
      | (new () => SpeechRecognition)
      | undefined;
    if (!SR) return;

    const recognition = new SR() as SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let finalText = "";
      let interim = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalText += t;
        } else {
          interim += t;
        }
      }

      if (finalText) {
        // Reset silence timer on speech
        lastSpeechRef.current = Date.now();
        silenceFiredRef.current = false;
        setSilenceDetected(false);

        setTranscript((prev) => prev + finalText);
        detectFillers(finalText);

        const words = finalText.trim().split(/\s+/).length;
        setTotalWords((prev) => {
          const newTotal = prev + words;
          calculateWPM(newTotal);
          return newTotal;
        });
      }

      setInterimTranscript(interim);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      if (e.error === "not-allowed") {
        console.error("Microphone access denied");
      }
      if (e.error !== "no-speech" && e.error !== "aborted") {
        console.error("Speech recognition error:", e.error);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // Already started
        }
      }
    };

    recognitionRef.current = recognition;
    startTimeRef.current = Date.now();
    lastSpeechRef.current = Date.now();
    silenceFiredRef.current = false;

    // Track speaking duration
    durationTimerRef.current = setInterval(() => {
      setSpeakingDuration(
        Math.floor((Date.now() - startTimeRef.current) / 1000),
      );
    }, 1000);

    // Start audio analyser for waveform
    startAudioAnalyser();

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  }, [isSupported, detectFillers, calculateWPM, startAudioAnalyser]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      const ref = recognitionRef.current;
      recognitionRef.current = null;
      ref.stop();
    }
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    stopAudioAnalyser();
    setIsListening(false);
    setInterimTranscript("");
  }, [stopAudioAnalyser]);

  // ─── TTS ──────────────────────────────────────────

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(
      (v) =>
        (v.name.includes("Google") && v.lang === "en-US") ||
        v.name.includes("Alex") ||
        v.name.includes("Samantha") ||
        (v.lang === "en-US" && v.localService),
    );
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setFillerCount(0);
    setFillerWords([]);
    setWordsPerMinute(0);
    setTotalWords(0);
    setSpeakingDuration(0);
    setSilenceDetected(false);
    silenceFiredRef.current = false;
    startTimeRef.current = Date.now();
    lastSpeechRef.current = Date.now();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      // Cleanup audio analyser
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      sourceRef.current?.disconnect();
      if (audioCtxRef.current?.state !== "closed") {
        audioCtxRef.current?.close();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    fillerCount,
    fillerWords,
    wordsPerMinute,
    totalWords,
    speakingDuration,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    resetTranscript,
    isSupported,
    waveformData,
    audioLevel,
    silenceDetected,
    onSilence,
  };
}
