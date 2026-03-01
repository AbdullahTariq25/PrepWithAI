// ===========================================
// PrepWithAI — PostHog Analytics Provider
// Privacy-friendly product analytics
// ===========================================

"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (POSTHOG_KEY && typeof window !== "undefined") {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        persistence: "localStorage+cookie",
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") {
            ph.debug();
          }
        },
      });
    }
  }, []);

  if (!POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// ─── Event Tracking Utility ─────────────────────

export function trackEvent(
  event: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window !== "undefined" && POSTHOG_KEY) {
    posthog.capture(event, properties);
  }
}

// Pre-defined events for consistency
export const EVENTS = {
  // Auth
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",
  LOGIN: "login",

  // Onboarding
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_COMPLETED: "onboarding_completed",

  // Interview
  INTERVIEW_STARTED: "interview_started",
  INTERVIEW_COMPLETED: "interview_completed",
  INTERVIEW_VOICE_ENABLED: "interview_voice_enabled",
  INTERVIEW_VIDEO_ENABLED: "interview_video_enabled",
  INTERVIEW_HINT_USED: "interview_hint_used",

  // Features
  DAILY_CHALLENGE_STARTED: "daily_challenge_started",
  DAILY_CHALLENGE_COMPLETED: "daily_challenge_completed",
  FLASHCARD_SESSION_STARTED: "flashcard_session_started",
  QUESTION_VIEWED: "question_viewed",
  COMPANY_PACK_OPENED: "company_pack_opened",

  // Report
  REPORT_VIEWED: "report_viewed",
  REPORT_SHARED: "report_shared",

  // Subscription
  UPGRADE_CLICKED: "upgrade_clicked",
  CHECKOUT_STARTED: "checkout_started",
  SUBSCRIPTION_ACTIVATED: "subscription_activated",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",

  // Engagement
  RESUME_UPLOADED: "resume_uploaded",
  COVER_LETTER_GENERATED: "cover_letter_generated",
  STUDY_GROUP_JOINED: "study_group_joined",
} as const;
