export const FEEDBACK_RUBRIC_VERSION = "2.1";

export const FEEDBACK_DIMENSIONS = [
  "problemSolving",
  "communication",
  "codeQuality",
  "edgeCases",
  "timeManagement",
] as const;

export type FeedbackDimension = (typeof FEEDBACK_DIMENSIONS)[number];
export type HiringSignal = "strong_no" | "no" | "mixed" | "yes" | "strong_yes";

export interface FeedbackEvidence {
  dimension: FeedbackDimension;
  quote: string;
  reason: string;
}

export interface InterviewFeedback {
  overallScore: number;
  grades: Record<FeedbackDimension, number>;
  strengths: string[];
  improvements: string[];
  summary: string;
  seniorTip: string;
  recommendedTopics: string[];
  evidence: FeedbackEvidence[];
  evaluationConfidence: number;
  nextPracticeFocus: string;
  hiringSignal: HiringSignal;
  rubricVersion: string;
}

const DEFAULT_GRADES: Record<FeedbackDimension, number> = {
  problemSolving: 50,
  communication: 50,
  codeQuality: 50,
  edgeCases: 50,
  timeManagement: 50,
};

function clampScore(value: unknown, fallback = 50): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function cleanText(value: unknown, fallback: string, maxLength = 900): string {
  if (typeof value !== "string") return fallback;
  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned ? cleaned.slice(0, maxLength) : fallback;
}

function cleanStringArray(value: unknown, fallback: string[], maxItems = 5): string[] {
  if (!Array.isArray(value)) return fallback;

  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((item, index, all) => all.indexOf(item) === index)
    .slice(0, maxItems);

  return cleaned.length > 0 ? cleaned : fallback;
}

function normalizeForEvidenceMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[“”"'`]/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function candidateEvidenceText(transcript: string): string {
  return transcript
    .split("\n")
    .filter((line) => line.startsWith("Candidate:"))
    .map((line) => line.slice("Candidate:".length))
    .join(" ");
}

function normalizeEvidence(value: unknown, transcript: string): FeedbackEvidence[] {
  if (!Array.isArray(value)) return [];

  const candidateText = normalizeForEvidenceMatch(candidateEvidenceText(transcript));
  if (!candidateText) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const raw = item as Record<string, unknown>;
      const dimension = raw.dimension as FeedbackDimension;
      if (!FEEDBACK_DIMENSIONS.includes(dimension)) return null;

      const quote = cleanText(raw.quote, "", 240);
      const reason = cleanText(raw.reason, "", 320);
      const normalizedQuote = normalizeForEvidenceMatch(quote);

      // Evidence must be attributable to the candidate, not merely plausible text
      // produced by the evaluator. Very short fragments are too easy to match by chance.
      if (
        !quote ||
        !reason ||
        normalizedQuote.split(" ").filter(Boolean).length < 3 ||
        !candidateText.includes(normalizedQuote)
      ) {
        return null;
      }

      return { dimension, quote, reason };
    })
    .filter((item): item is FeedbackEvidence => Boolean(item))
    .filter(
      (item, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.dimension === item.dimension &&
            normalizeForEvidenceMatch(candidate.quote) === normalizeForEvidenceMatch(item.quote),
        ) === index,
    )
    .slice(0, 8);
}

function getTranscriptQuality(transcript: string): number {
  const candidateTurns = (transcript.match(/^Candidate:/gm) || []).length;
  const candidateWords = transcript
    .split("\n")
    .filter((line) => line.startsWith("Candidate:"))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  const turnScore = Math.min(100, candidateTurns * 18);
  const wordScore = Math.min(100, candidateWords / 4);
  return Math.round(turnScore * 0.55 + wordScore * 0.45);
}

function getWeights(type: string): Record<FeedbackDimension, number> {
  if (type === "behavioral") {
    return {
      problemSolving: 0.2,
      communication: 0.4,
      codeQuality: 0.05,
      edgeCases: 0.15,
      timeManagement: 0.2,
    };
  }

  if (type === "system_design") {
    return {
      problemSolving: 0.35,
      communication: 0.25,
      codeQuality: 0.05,
      edgeCases: 0.25,
      timeManagement: 0.1,
    };
  }

  if (type === "product_management" || type === "leadership") {
    return {
      problemSolving: 0.3,
      communication: 0.35,
      codeQuality: 0.05,
      edgeCases: 0.15,
      timeManagement: 0.15,
    };
  }

  if (type === "machine_learning" || type === "data_engineering") {
    return {
      problemSolving: 0.35,
      communication: 0.2,
      codeQuality: 0.15,
      edgeCases: 0.2,
      timeManagement: 0.1,
    };
  }

  return {
    problemSolving: 0.3,
    communication: 0.2,
    codeQuality: 0.25,
    edgeCases: 0.15,
    timeManagement: 0.1,
  };
}

function deriveHiringSignal(score: number): HiringSignal {
  if (score >= 90) return "strong_yes";
  if (score >= 75) return "yes";
  if (score >= 55) return "mixed";
  if (score >= 35) return "no";
  return "strong_no";
}

export function normalizeInterviewFeedback(
  rawValue: unknown,
  transcript: string,
  interviewType: string,
): InterviewFeedback {
  const raw = rawValue && typeof rawValue === "object" ? (rawValue as Record<string, unknown>) : {};
  const rawGrades = raw.grades && typeof raw.grades === "object" ? (raw.grades as Record<string, unknown>) : {};

  const grades = FEEDBACK_DIMENSIONS.reduce<Record<FeedbackDimension, number>>(
    (result, dimension) => {
      result[dimension] = clampScore(rawGrades[dimension], DEFAULT_GRADES[dimension]);
      return result;
    },
    { ...DEFAULT_GRADES },
  );

  const weights = getWeights(interviewType);
  const weightedGradeScore = Math.round(
    FEEDBACK_DIMENSIONS.reduce(
      (sum, dimension) => sum + grades[dimension] * weights[dimension],
      0,
    ),
  );
  const modelOverall = clampScore(raw.overallScore, weightedGradeScore);
  const overallScore = Math.round(weightedGradeScore * 0.65 + modelOverall * 0.35);

  const evidence = normalizeEvidence(raw.evidence, transcript);
  const transcriptQuality = getTranscriptQuality(transcript);
  const modelConfidence = clampScore(raw.evaluationConfidence, transcriptQuality);
  let evaluationConfidence = Math.round(modelConfidence * 0.7 + transcriptQuality * 0.3);

  if (evidence.length === 0) evaluationConfidence = Math.min(evaluationConfidence, 40);
  if (transcriptQuality < 30) evaluationConfidence = Math.min(evaluationConfidence, 35);

  const strengths = cleanStringArray(
    raw.strengths,
    ["Completed the interview and provided usable evidence for evaluation."],
    5,
  );
  const improvements = cleanStringArray(
    raw.improvements,
    ["Make reasoning more explicit and support important decisions with concrete trade-offs."],
    5,
  );
  const recommendedTopics = cleanStringArray(raw.recommendedTopics, [], 6);
  const nextPracticeFocus = cleanText(raw.nextPracticeFocus, improvements[0], 280);

  return {
    overallScore,
    grades,
    strengths,
    improvements,
    summary: cleanText(
      raw.summary,
      "The interview produced enough evidence for a baseline assessment. Use the highest-impact improvement area as the focus of the next session.",
      900,
    ),
    seniorTip: cleanText(
      raw.seniorTip,
      "State your assumptions early, make trade-offs explicit, and verify the result against the original requirement before moving on.",
      600,
    ),
    recommendedTopics,
    evidence,
    evaluationConfidence,
    nextPracticeFocus,
    // The practice signal is derived from the normalized score so it cannot
    // contradict the rubric after evidence validation and score calibration.
    hiringSignal: deriveHiringSignal(overallScore),
    rubricVersion: FEEDBACK_RUBRIC_VERSION,
  };
}
