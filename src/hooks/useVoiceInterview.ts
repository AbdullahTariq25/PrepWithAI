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

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!(
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: unknown })
        .webkitSpeechRecognition
    );

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

  const calculateWPM = useCallback(
    (wordCount: number) => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
      if (elapsed > 0.05) {
        setWordsPerMinute(Math.round(wordCount / elapsed));
      }
    },
    []
  );

  const startListening = useCallback(() => {
    if (!isSupported) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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

    // Track speaking duration
    durationTimerRef.current = setInterval(() => {
      setSpeakingDuration(
        Math.floor((Date.now() - startTimeRef.current) / 1000)
      );
    }, 1000);

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  }, [isSupported, detectFillers, calculateWPM]);

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
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
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
          (v.lang === "en-US" && v.localService)
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
    },
    []
  );

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
    startTimeRef.current = Date.now();
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
  };
}
