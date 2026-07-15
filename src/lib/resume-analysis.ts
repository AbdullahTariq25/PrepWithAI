const SKILL_PATTERNS: Array<[string, RegExp]> = [
  ["JavaScript", /\bjavascript\b|\bjs\b/i],
  ["TypeScript", /\btypescript\b|\bts\b/i],
  ["React", /\breact(?:\.js|js)?\b/i],
  ["Next.js", /\bnext(?:\.js|js)?\b/i],
  ["Node.js", /\bnode(?:\.js|js)?\b/i],
  ["Express", /\bexpress(?:\.js|js)?\b/i],
  ["Python", /\bpython\b/i],
  ["Java", /\bjava\b/i],
  ["C++", /\bc\+\+\b/i],
  ["C#", /\bc#\b|\bc sharp\b/i],
  ["Go", /\bgolang\b|\bgo language\b/i],
  ["Rust", /\brust\b/i],
  ["SQL", /\bsql\b/i],
  ["PostgreSQL", /\bpostgres(?:ql)?\b/i],
  ["MySQL", /\bmysql\b/i],
  ["MongoDB", /\bmongodb\b|\bmongo\b/i],
  ["Redis", /\bredis\b/i],
  ["GraphQL", /\bgraphql\b/i],
  ["REST APIs", /\brest(?:ful)?\s+api(?:s)?\b/i],
  ["Docker", /\bdocker\b/i],
  ["Kubernetes", /\bkubernetes\b|\bk8s\b/i],
  ["AWS", /\baws\b|amazon web services/i],
  ["Azure", /\bazure\b/i],
  ["Google Cloud", /\bgcp\b|google cloud/i],
  ["Git", /\bgit\b|github|gitlab/i],
  ["CI/CD", /\bci\s*\/\s*cd\b|continuous integration|continuous deployment/i],
  ["Tailwind CSS", /\btailwind(?:\s*css)?\b/i],
  ["HTML", /\bhtml5?\b/i],
  ["CSS", /\bcss3?\b/i],
  ["Machine Learning", /machine learning|\bml\b/i],
  ["TensorFlow", /\btensorflow\b/i],
  ["PyTorch", /\bpytorch\b/i],
  ["Pandas", /\bpandas\b/i],
  ["Figma", /\bfigma\b/i],
];

const ACTION_VERBS = [
  "built",
  "created",
  "designed",
  "developed",
  "implemented",
  "improved",
  "increased",
  "launched",
  "led",
  "optimized",
  "reduced",
  "shipped",
  "scaled",
  "automated",
  "delivered",
  "migrated",
  "owned",
];

const SECTION_ALIASES: Record<string, string[]> = {
  experience: ["experience", "work experience", "professional experience", "employment"],
  education: ["education", "academic background", "academics"],
  projects: ["projects", "selected projects", "personal projects", "project experience"],
  summary: ["summary", "profile", "professional summary", "about me", "objective"],
};

export interface ResumeAnalysisResult {
  skills: string[];
  experience: string;
  education: string;
  projects: string[];
  atsScore: number;
  actionVerbScore: number;
  quantificationScore: number;
  suggestions: string[];
  metadata: {
    characters: number;
    words: number;
    pages?: number;
    parser: string;
  };
}

interface ExtractedPdf {
  text: string;
  pages?: number;
  parser: string;
}

function normalizeText(value: string): string {
  return value
    .replace(/\u0000/g, "")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findSection(lines: string[], aliases: string[]): string[] {
  const normalizedAliases = new Set(aliases.map(normalizeHeading));
  const start = lines.findIndex((line) => normalizedAliases.has(normalizeHeading(line)));
  if (start === -1) return [];

  const result: string[] = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) {
      if (result.length > 0) result.push("");
      continue;
    }

    const normalized = normalizeHeading(line);
    const isKnownHeading = Object.values(SECTION_ALIASES)
      .flat()
      .some((alias) => normalizeHeading(alias) === normalized);

    if (isKnownHeading) break;
    result.push(line);
    if (result.length >= 30) break;
  }

  return result;
}

function summarizeSection(lines: string[], fallback: string): string {
  const useful = lines
    .filter(Boolean)
    .map((line) => line.replace(/^[•●▪◦\-*]+\s*/, "").trim())
    .filter((line) => line.length >= 3)
    .slice(0, 6);

  return useful.length > 0 ? useful.join(" · ").slice(0, 900) : fallback;
}

function extractProjectSignals(lines: string[]): string[] {
  return lines
    .filter(Boolean)
    .map((line) => line.replace(/^[•●▪◦\-*]+\s*/, "").trim())
    .filter((line) => line.length >= 12)
    .slice(0, 6);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function computeScores(text: string, lines: string[]) {
  const lower = text.toLowerCase();
  const actionHits = ACTION_VERBS.filter((verb) => new RegExp(`\\b${verb}\\b`, "i").test(text)).length;
  const quantifiedHits = text.match(/(?:\b\d+(?:\.\d+)?%|\b\d+[kKmMbB]\+?|\$\s?\d[\d,.]*|\b\d+\+\s+(?:users|customers|clients|requests|projects|team members|engineers))/g)?.length || 0;
  const bulletLikeLines = lines.filter((line) => /^[•●▪◦\-*]/.test(line.trim())).length;
  const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text);
  const hasPhone = /(?:\+?\d[\d\s().-]{7,}\d)/.test(text);
  const hasLinkedIn = /linkedin\.com/i.test(lower);
  const hasGitHub = /github\.com/i.test(lower);
  const hasExperience = findSection(lines, SECTION_ALIASES.experience).length > 0;
  const hasEducation = findSection(lines, SECTION_ALIASES.education).length > 0;
  const hasProjects = findSection(lines, SECTION_ALIASES.projects).length > 0;

  const actionVerbScore = clampScore((actionHits / 8) * 100);
  const quantificationScore = clampScore((quantifiedHits / 5) * 100);
  const structureScore = [hasEmail, hasPhone, hasExperience, hasEducation].filter(Boolean).length * 15 +
    [hasLinkedIn || hasGitHub, hasProjects, bulletLikeLines >= 3].filter(Boolean).length * 10;
  const lengthScore = text.length >= 1_500 && text.length <= 12_000 ? 15 : text.length >= 700 ? 9 : 4;
  const atsScore = clampScore(structureScore * 0.7 + lengthScore + actionVerbScore * 0.08 + quantificationScore * 0.07);

  return { atsScore, actionVerbScore, quantificationScore, quantifiedHits, actionHits };
}

export async function extractPdfText(buffer: Buffer): Promise<ExtractedPdf> {
  const module = (await import("pdf-parse")) as Record<string, unknown>;
  const ModernPDFParse = module.PDFParse as
    | (new (options: { data: Uint8Array }) => {
        getText: () => Promise<{ text?: string; total?: number; pages?: unknown[] }>;
        destroy?: () => Promise<void> | void;
      })
    | undefined;

  if (ModernPDFParse) {
    const parser = new ModernPDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      return {
        text: normalizeText(result.text || ""),
        pages: result.total || result.pages?.length,
        parser: "pdf-parse-v2",
      };
    } finally {
      await parser.destroy?.();
    }
  }

  const legacyParser = module.default as
    | ((data: Buffer) => Promise<{ text?: string; numpages?: number }>)
    | undefined;
  if (legacyParser) {
    const result = await legacyParser(buffer);
    return {
      text: normalizeText(result.text || ""),
      pages: result.numpages,
      parser: "pdf-parse-legacy",
    };
  }

  throw new Error("No compatible PDF parser export was found");
}

export function analyzeResumeText(text: string, pages?: number, parser = "pdf-parse"): ResumeAnalysisResult {
  const normalized = normalizeText(text);
  const lines = normalized.split("\n").map((line) => line.trim());
  const words = normalized.split(/\s+/).filter(Boolean);

  const skills = SKILL_PATTERNS.filter(([, pattern]) => pattern.test(normalized)).map(([name]) => name);
  const experienceLines = findSection(lines, SECTION_ALIASES.experience);
  const educationLines = findSection(lines, SECTION_ALIASES.education);
  const projectLines = findSection(lines, SECTION_ALIASES.projects);
  const summaryLines = findSection(lines, SECTION_ALIASES.summary);
  const scores = computeScores(normalized, lines);

  const suggestions: string[] = [];
  if (skills.length < 5) suggestions.push("Make core technical skills easy to scan in a dedicated skills section.");
  if (scores.actionVerbScore < 55) suggestions.push("Start more achievement bullets with strong action verbs such as built, led, optimized, or delivered.");
  if (scores.quantificationScore < 45) suggestions.push("Add measurable outcomes such as latency, revenue, users, conversion, cost, or delivery-time improvements where truthful.");
  if (experienceLines.length === 0) suggestions.push("Use a clearly labeled Experience section so recruiters and ATS systems can identify your work history quickly.");
  if (projectLines.length === 0) suggestions.push("Add a Projects section for role-relevant work, especially when professional experience is limited.");
  if (suggestions.length === 0) suggestions.push("Tailor the top skills and strongest quantified achievements to the exact role you are applying for.");

  const summaryFallback = summaryLines.length > 0
    ? summarizeSection(summaryLines, "")
    : "No dedicated professional summary was detected; preparation context is based on the document's structured sections.";

  return {
    skills,
    experience: summarizeSection(
      experienceLines,
      summaryFallback || "No clearly labeled experience section was detected in the extracted PDF text.",
    ),
    education: summarizeSection(
      educationLines,
      "No clearly labeled education section was detected in the extracted PDF text.",
    ),
    projects: extractProjectSignals(projectLines),
    atsScore: scores.atsScore,
    actionVerbScore: scores.actionVerbScore,
    quantificationScore: scores.quantificationScore,
    suggestions: suggestions.slice(0, 5),
    metadata: {
      characters: normalized.length,
      words: words.length,
      pages,
      parser,
    },
  };
}
