const SKILLS: Array<{ name: string; aliases: RegExp }> = [
  { name: "JavaScript", aliases: /\bjavascript\b|\bjs\b/i },
  { name: "TypeScript", aliases: /\btypescript\b|\bts\b/i },
  { name: "React", aliases: /\breact(?:\.js|js)?\b/i },
  { name: "Next.js", aliases: /\bnext(?:\.js|js)?\b/i },
  { name: "Node.js", aliases: /\bnode(?:\.js|js)?\b/i },
  { name: "Python", aliases: /\bpython\b/i },
  { name: "Java", aliases: /\bjava\b/i },
  { name: "C++", aliases: /\bc\+\+\b/i },
  { name: "C#", aliases: /\bc#\b|\bc sharp\b/i },
  { name: "Go", aliases: /\bgolang\b|\bgo language\b/i },
  { name: "Rust", aliases: /\brust\b/i },
  { name: "SQL", aliases: /\bsql\b/i },
  { name: "PostgreSQL", aliases: /\bpostgres(?:ql)?\b/i },
  { name: "MongoDB", aliases: /\bmongodb\b|\bmongo\b/i },
  { name: "Redis", aliases: /\bredis\b/i },
  { name: "GraphQL", aliases: /\bgraphql\b/i },
  { name: "REST APIs", aliases: /\brest(?:ful)?\s+api(?:s)?\b/i },
  { name: "Docker", aliases: /\bdocker\b/i },
  { name: "Kubernetes", aliases: /\bkubernetes\b|\bk8s\b/i },
  { name: "AWS", aliases: /\baws\b|amazon web services/i },
  { name: "Azure", aliases: /\bazure\b/i },
  { name: "Google Cloud", aliases: /\bgcp\b|google cloud/i },
  { name: "CI/CD", aliases: /\bci\s*\/\s*cd\b|continuous integration|continuous deployment/i },
  { name: "Machine Learning", aliases: /machine learning|\bml\b/i },
  { name: "TensorFlow", aliases: /\btensorflow\b/i },
  { name: "PyTorch", aliases: /\bpytorch\b/i },
  { name: "Figma", aliases: /\bfigma\b/i },
];

const STOP_WORDS = new Set([
  "about", "after", "again", "also", "and", "are", "because", "been", "being",
  "build", "candidate", "company", "could", "experience", "from", "have", "into",
  "job", "more", "must", "our", "role", "should", "skills", "team", "that", "the",
  "their", "them", "they", "this", "through", "using", "with", "will", "work", "you",
  "your", "years", "requirements", "responsibilities", "preferred", "required",
]);

export interface JobMatchResult {
  matchScore: number;
  skillCoverage: number;
  keywordCoverage: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

function detectSkills(text: string) {
  return SKILLS.filter((skill) => skill.aliases.test(text)).map((skill) => skill.name);
}

function importantKeywords(text: string, limit = 24) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-/\s]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^[./-]+|[./-]+$/g, ""))
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));

  const counts = new Map<string, number>();
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
}

function percentage(numerator: number, denominator: number) {
  return denominator === 0 ? 100 : Math.round((numerator / denominator) * 100);
}

export function analyzeResumeJobMatch(
  resumeText: string,
  jobDescription: string,
): JobMatchResult {
  const resumeLower = resumeText.toLowerCase();
  const jobSkills = detectSkills(jobDescription);
  const resumeSkills = new Set(detectSkills(resumeText));
  const matchedSkills = jobSkills.filter((skill) => resumeSkills.has(skill));
  const missingSkills = jobSkills.filter((skill) => !resumeSkills.has(skill));

  const jobKeywords = importantKeywords(jobDescription);
  const matchedKeywords = jobKeywords.filter((keyword) => resumeLower.includes(keyword));
  const missingKeywords = jobKeywords.filter((keyword) => !resumeLower.includes(keyword));

  const skillCoverage = percentage(matchedSkills.length, jobSkills.length);
  const keywordCoverage = percentage(matchedKeywords.length, jobKeywords.length);
  const matchScore = Math.round(
    jobSkills.length > 0
      ? skillCoverage * 0.7 + keywordCoverage * 0.3
      : keywordCoverage,
  );

  const recommendations: string[] = [];
  if (missingSkills.length > 0) {
    recommendations.push(
      `The job description mentions ${missingSkills.slice(0, 5).join(", ")} but those skills were not detected in the resume. Add only skills you genuinely have and can defend in an interview.`,
    );
  }
  if (keywordCoverage < 60 && missingKeywords.length > 0) {
    recommendations.push(
      `Where truthful, align accomplishment language with role terms such as ${missingKeywords.slice(0, 6).join(", ")}.`,
    );
  }
  if (matchScore >= 75) {
    recommendations.push(
      "The document shows strong textual alignment. Prioritize interview examples that prove the matched skills with specific outcomes and trade-offs.",
    );
  } else {
    recommendations.push(
      "Tailor the summary, skills, and strongest achievement bullets to the target role instead of adding generic keyword repetition.",
    );
  }

  return {
    matchScore,
    skillCoverage,
    keywordCoverage,
    matchedSkills,
    missingSkills,
    matchedKeywords: matchedKeywords.slice(0, 12),
    missingKeywords: missingKeywords.slice(0, 12),
    recommendations: recommendations.slice(0, 3),
  };
}
