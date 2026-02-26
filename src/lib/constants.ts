// ===========================================
// PrepWithAI - Constants & Configuration
// Built by Abdullah Tariq
// ===========================================

export const APP_NAME = "PrepWithAI";
export const APP_DESCRIPTION =
  "AI-powered mock interview platform for software developers. Practice with an AI interviewer that simulates real technical interviews.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Interview Types
export const INTERVIEW_TYPES = [
  {
    id: "dsa",
    name: "DSA",
    label: "Data Structures & Algorithms",
    description: "Arrays, Trees, Graphs, DP, Sorting, Searching",
    icon: "Code2",
    color: "from-blue-500 to-cyan-500",
    free: true,
  },
  {
    id: "system_design",
    name: "System Design",
    label: "System Design",
    description: "Design Twitter, Uber, Rate Limiter, URL Shortener",
    icon: "Network",
    color: "from-purple-500 to-pink-500",
    free: false,
  },
  {
    id: "behavioral",
    name: "Behavioral",
    label: "Behavioral (STAR Method)",
    description: "Leadership, Conflict, Teamwork, Failure Stories",
    icon: "Users",
    color: "from-green-500 to-emerald-500",
    free: false,
  },
  {
    id: "frontend",
    name: "Frontend",
    label: "Frontend Specific",
    description: "React, CSS, JavaScript, Web Performance",
    icon: "Monitor",
    color: "from-orange-500 to-yellow-500",
    free: false,
  },
  {
    id: "backend",
    name: "Backend",
    label: "Backend Specific",
    description: "APIs, Databases, Architecture, Microservices",
    icon: "Server",
    color: "from-red-500 to-rose-500",
    free: false,
  },
  {
    id: "full_loop",
    name: "Full Loop",
    label: "Full Interview Loop",
    description: "Mix of all types — like a real Google interview loop",
    icon: "Layers",
    color: "from-indigo-500 to-violet-500",
    free: false,
  },
] as const;

// Company Styles
export const COMPANY_STYLES = [
  {
    id: "google",
    name: "Google",
    description: "Heavy DSA, system design, leadership (Googleyness)",
    logo: "/companies/google.svg",
    color: "#4285F4",
    interviewFormat: "Phone Screen → Technical (2) → System Design → Behavioral",
    culture: "Innovation, scalability thinking, Googleyness & Leadership",
  },
  {
    id: "meta",
    name: "Meta",
    description: "Product sense + DSA + behavioral, move fast culture",
    logo: "/companies/meta.svg",
    color: "#0668E1",
    interviewFormat: "Phone Screen → Coding (2) → System Design → Behavioral",
    culture: "Move Fast, Be Bold, Focus on Impact",
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Leadership Principles heavy, customer obsession",
    logo: "/companies/amazon.svg",
    color: "#FF9900",
    interviewFormat: "OA → Phone Screen → Loop (4-5 rounds) → Bar Raiser",
    culture: "Leadership Principles, Customer Obsession, Ownership",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Systems thinking + coding quality + API design",
    logo: "/companies/stripe.svg",
    color: "#635BFF",
    interviewFormat: "Phone Screen → Pair Programming → System Design → Culture",
    culture: "Craftsmanship, attention to detail, user-centric",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    description: "Problem solving, design, coding, growth mindset",
    logo: "/companies/microsoft.svg",
    color: "#00A4EF",
    interviewFormat: "Phone Screen → Technical (3-4) → As-Appropriate Round",
    culture: "Growth Mindset, Collaboration, Innovation",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Practical problem solving, ship fast, wear many hats",
    logo: "/companies/startup.svg",
    color: "#10B981",
    interviewFormat: "Phone Screen → Take-Home → Technical → Culture Fit",
    culture: "Move fast, ship features, wear many hats, pragmatism",
  },
  {
    id: "general",
    name: "General",
    description: "Balanced mix of all interview types and skills",
    logo: "/companies/general.svg",
    color: "#6366F1",
    interviewFormat: "Phone Screen → Technical → System Design → Behavioral",
    culture: "General best practices and industry standards",
  },
] as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  {
    id: "junior",
    name: "Junior",
    label: "Junior (0-2 years)",
    description: "Entry level, focus on fundamentals",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "mid",
    name: "Mid-Level",
    label: "Mid-Level (2-5 years)",
    description: "Intermediate, broader knowledge expected",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    id: "senior",
    name: "Senior",
    label: "Senior (5+ years)",
    description: "Deep expertise, system design, trade-offs",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "staff",
    name: "Staff",
    label: "Staff Engineer",
    description: "Architecture focus, tech leadership, cross-team impact",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
] as const;

// Skill Categories
export const SKILL_CATEGORIES = [
  "problemSolving",
  "communication",
  "codeQuality",
  "edgeCases",
  "timeManagement",
] as const;

export const SKILL_LABELS: Record<string, string> = {
  problemSolving: "Problem Solving",
  communication: "Communication",
  codeQuality: "Code Quality",
  edgeCases: "Edge Cases",
  timeManagement: "Time Management",
};

// Free tier limits
export const FREE_TIER_LIMITS = {
  sessionsPerDay: 3,
  savedSessions: 5,
  questionTypes: ["dsa"],
  voiceMode: false,
  companyPacks: false,
  resumeUpload: false,
  analytics: false,
};

// Pricing
export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "",
    description: "Get started with basic interview practice",
    features: [
      "3 mock interviews per day",
      "DSA questions only",
      "Basic feedback",
      "Save last 5 sessions",
    ],
    limitations: [
      "No voice mode",
      "No system design or behavioral",
      "No company prep packs",
      "No resume personalization",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 9,
    period: "/month",
    description: "Everything you need to ace your interviews",
    features: [
      "Unlimited interviews",
      "All question types (DSA + System Design + Behavioral)",
      "Voice mode — speak your answers",
      "Company-specific prep packs",
      "Detailed AI feedback with scoring",
      "Progress analytics & skill radar",
      "Resume upload for personalized questions",
      "Unlimited session history",
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    price: 29,
    period: "/month",
    description: "Prepare your entire engineering team",
    features: [
      "Everything in Pro",
      "5 team member seats",
      "Shared progress dashboard",
      "Manager readiness scores",
      "Bulk interview scheduling",
      "Custom question banks",
      "Priority support",
    ],
    limitations: [],
    cta: "Start Team Trial",
    popular: false,
  },
] as const;

// Navigation
export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Start Interview", href: "/interview", icon: "Play" },
  { label: "Questions", href: "/questions", icon: "BookOpen" },
  { label: "Companies", href: "/companies", icon: "Building2" },
  { label: "Progress", href: "/progress", icon: "TrendingUp" },
  { label: "History", href: "/history", icon: "Clock" },
  { label: "Resume", href: "/resume", icon: "FileText" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

// Question Categories
export const QUESTION_CATEGORIES = [
  { id: "array", name: "Arrays", count: 45 },
  { id: "string", name: "Strings", count: 35 },
  { id: "linkedlist", name: "Linked Lists", count: 25 },
  { id: "tree", name: "Trees", count: 30 },
  { id: "graph", name: "Graphs", count: 25 },
  { id: "dp", name: "Dynamic Programming", count: 40 },
  { id: "sorting", name: "Sorting & Searching", count: 20 },
  { id: "system_design", name: "System Design", count: 50 },
  { id: "behavioral", name: "Behavioral", count: 50 },
  { id: "frontend", name: "Frontend", count: 30 },
  { id: "backend", name: "Backend", count: 30 },
  { id: "sql", name: "SQL & Databases", count: 20 },
] as const;
