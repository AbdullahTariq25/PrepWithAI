// ===========================================
// PrepWithAI — Constants & Configuration
// The Complete Developer Career Platform
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import type { CompanySlug, InterviewType } from "./types";

export const APP_NAME = "PrepWithAI";
export const APP_DESCRIPTION =
  "The complete developer career platform. AI-powered mock interviews, code execution, voice mode, progress analytics, resume builder, and career tools — all in one place.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const APP_TAGLINE = "Practice deliberately. Improve with evidence.";

// ─── Interview Types (12) ───────────────────────

export const INTERVIEW_TYPES: {
  id: InterviewType;
  name: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  free: boolean;
}[] = [
  {
    id: "dsa",
    name: "DSA",
    label: "Data Structures & Algorithms",
    description: "Arrays, Trees, Graphs, DP — LeetCode style coding problems",
    icon: "Code2",
    color: "from-blue-500 to-cyan-500",
    free: true,
  },
  {
    id: "system_design",
    name: "System Design",
    label: "System Design",
    description: "Design Twitter, Uber, Rate Limiter — whiteboard style",
    icon: "Network",
    color: "from-purple-500 to-pink-500",
    free: true,
  },
  {
    id: "behavioral",
    name: "Behavioral",
    label: "Behavioral (STAR Method)",
    description: "Leadership, Conflict, Teamwork, Failure Stories",
    icon: "Users",
    color: "from-green-500 to-emerald-500",
    free: true,
  },
  {
    id: "frontend",
    name: "Frontend",
    label: "Frontend Technical",
    description: "React, CSS, JavaScript, TypeScript, Web Performance",
    icon: "Monitor",
    color: "from-orange-500 to-yellow-500",
    free: true,
  },
  {
    id: "backend",
    name: "Backend",
    label: "Backend Technical",
    description: "APIs, Databases, Architecture, Microservices",
    icon: "Server",
    color: "from-red-500 to-rose-500",
    free: true,
  },
  {
    id: "full_stack",
    name: "Full-Stack",
    label: "Full-Stack Mixed",
    description: "Frontend + Backend + System Design combined",
    icon: "Layers",
    color: "from-teal-500 to-cyan-500",
    free: true,
  },
  {
    id: "devops",
    name: "DevOps",
    label: "DevOps & Cloud",
    description: "CI/CD, Docker, Kubernetes, AWS, Infrastructure",
    icon: "Cloud",
    color: "from-sky-500 to-blue-500",
    free: true,
  },
  {
    id: "mobile",
    name: "Mobile",
    label: "Mobile Development",
    description: "React Native, Flutter concepts, mobile architecture",
    icon: "Smartphone",
    color: "from-violet-500 to-purple-500",
    free: true,
  },
  {
    id: "machine_learning",
    name: "ML",
    label: "Machine Learning",
    description: "ML concepts, model evaluation, data pipelines",
    icon: "Brain",
    color: "from-amber-500 to-orange-500",
    free: true,
  },
  {
    id: "product_management",
    name: "PM",
    label: "Product Management",
    description: "Product sense, metrics, prioritization — for dev → PM",
    icon: "Target",
    color: "from-pink-500 to-rose-500",
    free: true,
  },
  {
    id: "leadership",
    name: "Leadership",
    label: "Engineering Leadership",
    description: "Staff/Principal level: architecture, mentoring, strategy",
    icon: "Crown",
    color: "from-yellow-500 to-amber-500",
    free: true,
  },
  {
    id: "full_loop",
    name: "Full Loop",
    label: "Full Interview Loop",
    description: "Compact multi-stage simulation across technical and behavioral signals",
    icon: "Trophy",
    color: "from-indigo-500 to-violet-500",
    free: true,
  },
];

// ─── Company Prep Packs (20) ────────────────────

export interface CompanyConfig {
  id: CompanySlug;
  name: string;
  description: string;
  logo: string;
  color: string;
  region: "faang" | "top_startup" | "pakistan" | "remote";
  interviewFormat: string;
  culture: string;
  personality: string;
  rounds: { name: string; duration: string; focus: string; description: string }[];
  tips: string[];
  avgSalary: { min: number; max: number; currency: string };
}

export const COMPANY_PACKS: CompanyConfig[] = [
  // FAANG+
  {
    id: "google",
    name: "Google",
    description: "Heavy DSA, system design, Googleyness & leadership",
    logo: "/companies/google.svg",
    color: "#4285F4",
    region: "faang",
    interviewFormat: "Phone Screen → Technical (2) → System Design → Behavioral",
    culture: "Innovation, scalability thinking, Googleyness & Leadership",
    personality: "You are a Google interviewer. Be analytical, ask about scalability and edge cases. Push for optimal solutions. Ask 'What if the input is 10 billion records?' style questions. Value clean, readable code.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "One medium-hard coding problem with follow-ups" },
      { name: "Coding 1", duration: "45 min", focus: "DSA", description: "Two coding problems, medium + hard" },
      { name: "Coding 2", duration: "45 min", focus: "DSA", description: "One hard problem with optimization discussion" },
      { name: "System Design", duration: "45 min", focus: "System Design", description: "Design a Google-scale system" },
      { name: "Googleyness", duration: "45 min", focus: "Behavioral", description: "Leadership, teamwork, handling ambiguity" },
    ],
    tips: [
      "Always discuss time & space complexity",
      "Think out loud — communication is scored",
      "Ask clarifying questions before coding",
      "Consider edge cases proactively",
      "Google values 'Googleyness' — show you're collaborative and curious",
    ],
    avgSalary: { min: 150000, max: 350000, currency: "USD" },
  },
  {
    id: "meta",
    name: "Meta",
    description: "Product sense + DSA + behavioral, move fast culture",
    logo: "/companies/meta.svg",
    color: "#0668E1",
    region: "faang",
    interviewFormat: "Phone Screen → Coding (2) → System Design → Behavioral",
    culture: "Move Fast, Be Bold, Focus on Impact, Be Open",
    personality: "You are a Meta interviewer. Focus on speed and impact. Ask about product sense. 'How would this feature impact 3 billion users?' Push for practical, scalable solutions. Value execution speed.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "Two coding problems in 45 minutes" },
      { name: "Coding 1", duration: "45 min", focus: "DSA", description: "Two medium problems, focus on speed" },
      { name: "Coding 2", duration: "45 min", focus: "DSA", description: "One medium + one hard problem" },
      { name: "System Design", duration: "45 min", focus: "System Design", description: "Design a social feature at Meta scale" },
      { name: "Behavioral", duration: "45 min", focus: "Behavioral", description: "Impact-driven stories, 'move fast' culture fit" },
    ],
    tips: [
      "Speed matters — practice solving 2 problems in 45 minutes",
      "Product sense questions are common for E5+",
      "Quantify your impact in behavioral answers",
      "Meta values builders — show what you've shipped",
    ],
    avgSalary: { min: 160000, max: 380000, currency: "USD" },
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Leadership Principles heavy, customer obsession, bar raiser",
    logo: "/companies/amazon.svg",
    color: "#FF9900",
    region: "faang",
    interviewFormat: "OA → Phone Screen → Loop (4-5 rounds) → Bar Raiser",
    culture: "Customer Obsession, Ownership, Invent & Simplify, Bias for Action",
    personality: "You are an Amazon interviewer. Every answer must tie back to Leadership Principles. Ask 'Tell me about a time when...' for every behavioral. Push for STAR format. Be data-driven.",
    rounds: [
      { name: "Online Assessment", duration: "90 min", focus: "DSA", description: "2 coding problems + work simulation" },
      { name: "Phone Screen", duration: "60 min", focus: "DSA + Behavioral", description: "1 coding + LP questions" },
      { name: "Loop 1 - Coding", duration: "60 min", focus: "DSA", description: "2 problems + LP deep dive" },
      { name: "Loop 2 - System Design", duration: "60 min", focus: "System Design", description: "Design at Amazon scale + LPs" },
      { name: "Loop 3 - Bar Raiser", duration: "60 min", focus: "Behavioral", description: "Deep LP probing, cultural fit assessment" },
    ],
    tips: [
      "Know ALL 16 Leadership Principles by heart",
      "Every answer should reference a Leadership Principle",
      "Use STAR method rigorously — Situation, Task, Action, Result",
      "Include specific metrics and data in every story",
      "The Bar Raiser will push hard — stay calm and specific",
    ],
    avgSalary: { min: 140000, max: 320000, currency: "USD" },
  },
  {
    id: "apple",
    name: "Apple",
    description: "Secretive, detail-oriented, design + engineering excellence",
    logo: "/companies/apple.svg",
    color: "#555555",
    region: "faang",
    interviewFormat: "Phone Screen → Technical (3-4) → Design Review → Team Fit",
    culture: "Secrecy, attention to detail, design excellence, cross-functional collaboration",
    personality: "You are an Apple interviewer. Ask about design decisions and trade-offs. Push for attention to detail. 'Why did you choose this approach over alternatives?' Value craftsmanship.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "Coding + domain knowledge" },
      { name: "Technical 1", duration: "60 min", focus: "DSA", description: "Deep coding with optimization" },
      { name: "Technical 2", duration: "60 min", focus: "System Design", description: "Architecture with Apple-scale constraints" },
      { name: "Design Review", duration: "45 min", focus: "Frontend", description: "UI/UX decisions, API design" },
    ],
    tips: [
      "Apple values craftsmanship — quality over speed",
      "Discuss design trade-offs in detail",
      "Show passion for user experience",
      "Be prepared for domain-specific deep dives",
    ],
    avgSalary: { min: 155000, max: 340000, currency: "USD" },
  },
  {
    id: "netflix",
    name: "Netflix",
    description: "Freedom & Responsibility, senior-focused, high bar",
    logo: "/companies/netflix.svg",
    color: "#E50914",
    region: "faang",
    interviewFormat: "Phone Screen → Technical (2) → System Design → Culture",
    culture: "Freedom & Responsibility, context not control, highly aligned, loosely coupled",
    personality: "You are a Netflix interviewer. Expect senior-level thinking from everyone. Ask about trade-offs, operational concerns, and real-world experience. Value independent judgment and decision-making.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "Senior-level problem solving" },
      { name: "Technical", duration: "60 min", focus: "Backend", description: "System implementation deep dive" },
      { name: "System Design", duration: "60 min", focus: "System Design", description: "Streaming-scale architecture" },
      { name: "Culture", duration: "45 min", focus: "Behavioral", description: "Freedom & Responsibility alignment" },
    ],
    tips: [
      "Netflix only hires senior+ — expect hard questions",
      "Show independent judgment and decision-making",
      "Discuss operational concerns proactively",
      "The culture interview is critical — read the Netflix Culture Deck",
    ],
    avgSalary: { min: 200000, max: 500000, currency: "USD" },
  },
  {
    id: "microsoft",
    name: "Microsoft",
    description: "Growth mindset, problem solving, collaboration",
    logo: "/companies/microsoft.svg",
    color: "#00A4EF",
    region: "faang",
    interviewFormat: "Phone Screen → Technical (3-4) → As-Appropriate Round",
    culture: "Growth Mindset, Collaboration, Innovation, Diverse & Inclusive",
    personality: "You are a Microsoft interviewer. Value growth mindset and learning. Ask about problem-solving approach. 'How would you improve this?' Be encouraging but thorough. Test breadth of knowledge.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "Medium coding problem" },
      { name: "Technical 1", duration: "45 min", focus: "DSA", description: "Coding with follow-ups" },
      { name: "Technical 2", duration: "45 min", focus: "System Design", description: "Azure-scale system design" },
      { name: "Technical 3", duration: "45 min", focus: "Backend", description: "Domain-specific technical" },
      { name: "As-Appropriate", duration: "45 min", focus: "Behavioral", description: "Final assessment, team fit" },
    ],
    tips: [
      "Show growth mindset — what you learned from failures",
      "Collaboration stories are valued highly",
      "Microsoft interviews are generally friendly",
      "The 'as-appropriate' round is the final decision maker",
    ],
    avgSalary: { min: 140000, max: 300000, currency: "USD" },
  },
  // Top Startups
  {
    id: "stripe",
    name: "Stripe",
    description: "Systems thinking, coding quality, API design craftsman",
    logo: "/companies/stripe.svg",
    color: "#635BFF",
    region: "top_startup",
    interviewFormat: "Phone Screen → Pair Programming → System Design → Culture",
    culture: "Craftsmanship, attention to detail, user-centric, rigorous thinking",
    personality: "You are a Stripe interviewer. Focus on code quality and systems thinking. Ask about API design, error handling, edge cases. 'How would you make this payment system reliable?' Value clean, production-ready code.",
    rounds: [
      { name: "Phone Screen", duration: "60 min", focus: "DSA", description: "Bug squash or coding exercise" },
      { name: "Pair Programming", duration: "60 min", focus: "Backend", description: "Build a feature together, focus on code quality" },
      { name: "System Design", duration: "60 min", focus: "System Design", description: "Design a payment processing system" },
      { name: "Culture", duration: "45 min", focus: "Behavioral", description: "Values alignment, user empathy" },
    ],
    tips: [
      "Code quality matters more than speed at Stripe",
      "Focus on error handling and edge cases",
      "API design questions are very common",
      "Show genuine interest in financial infrastructure",
    ],
    avgSalary: { min: 170000, max: 380000, currency: "USD" },
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Commerce-focused, practical problem solving, Ruby/Rails",
    logo: "/companies/shopify.svg",
    color: "#96BF48",
    region: "top_startup",
    interviewFormat: "Phone Screen → Life Story → Technical → Peer Interview",
    culture: "Merchant obsession, act like an owner, thrive on change",
    personality: "You are a Shopify interviewer. Ask practical, commerce-related problems. Focus on real-world application. 'How would you build a checkout system that handles Black Friday?' Value pragmatism.",
    rounds: [
      { name: "Phone Screen", duration: "30 min", focus: "Behavioral", description: "Life story and motivation" },
      { name: "Technical 1", duration: "60 min", focus: "DSA", description: "Practical coding problem" },
      { name: "Technical 2", duration: "60 min", focus: "System Design", description: "Commerce-scale system" },
      { name: "Peer Interview", duration: "45 min", focus: "Behavioral", description: "Team fit and collaboration" },
    ],
    tips: [
      "Shopify values merchants — understand e-commerce",
      "The life story interview is unique — prepare your narrative",
      "Practical problem solving over theoretical perfection",
    ],
    avgSalary: { min: 130000, max: 280000, currency: "USD" },
  },
  {
    id: "airbnb",
    name: "Airbnb",
    description: "Belong anywhere, cross-functional, values-driven",
    logo: "/companies/airbnb.svg",
    color: "#FF5A5F",
    region: "top_startup",
    interviewFormat: "Phone Screen → Coding (2) → System Design → Cross-Functional → Values",
    culture: "Belong Anywhere, Champion the Mission, Be a Host, Embrace Adventure",
    personality: "You are an Airbnb interviewer. Ask about building trust and belonging. Focus on cross-functional collaboration. 'How would you design a trust & safety system?' Value empathy and mission alignment.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "Medium coding problem" },
      { name: "Coding", duration: "45 min", focus: "DSA", description: "Algorithm problem solving" },
      { name: "System Design", duration: "60 min", focus: "System Design", description: "Travel/hospitality scale" },
      { name: "Cross-Functional", duration: "45 min", focus: "Product Management", description: "Product + engineering thinking" },
      { name: "Values", duration: "45 min", focus: "Behavioral", description: "Core values alignment" },
    ],
    tips: [
      "Airbnb has a strong values interview — prepare stories for each",
      "Cross-functional thinking is highly valued",
      "Show passion for the mission of belonging",
    ],
    avgSalary: { min: 155000, max: 340000, currency: "USD" },
  },
  {
    id: "uber",
    name: "Uber",
    description: "Move fast, distributed systems, real-time at scale",
    logo: "/companies/uber.svg",
    color: "#000000",
    region: "top_startup",
    interviewFormat: "Phone Screen → Coding (2) → System Design → Behavioral",
    culture: "Build With Heart, Make Big Bets, Great Minds Don't Think Alike",
    personality: "You are an Uber interviewer. Focus on real-time systems, geo-distributed architecture. 'Design a ride matching system for 100M users.' Push for scale and reliability thinking.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "Medium-hard coding" },
      { name: "Coding 1", duration: "45 min", focus: "DSA", description: "Algorithms + data structures" },
      { name: "Coding 2", duration: "45 min", focus: "Backend", description: "System implementation" },
      { name: "System Design", duration: "60 min", focus: "System Design", description: "Real-time distributed systems" },
    ],
    tips: [
      "Uber loves geo-spatial and real-time system questions",
      "Think about distributed systems challenges",
      "Show experience with high-throughput systems",
    ],
    avgSalary: { min: 150000, max: 350000, currency: "USD" },
  },
  {
    id: "notion",
    name: "Notion",
    description: "Tool for thought, elegant solutions, full-stack craft",
    logo: "/companies/notion.svg",
    color: "#000000",
    region: "top_startup",
    interviewFormat: "Phone Screen → Coding → System Design → Product Sense → Culture",
    culture: "Mission-driven, craft-oriented, user-empathetic, thoughtful",
    personality: "You are a Notion interviewer. Focus on elegant, simple solutions. Ask about building tools that empower users. Value craft and thoughtfulness in design decisions.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "Clean coding problem" },
      { name: "Coding", duration: "60 min", focus: "Frontend", description: "Build a component or feature" },
      { name: "System Design", duration: "60 min", focus: "System Design", description: "Collaborative editing system" },
      { name: "Product", duration: "45 min", focus: "Product Management", description: "Product thinking and user empathy" },
    ],
    tips: [
      "Notion values elegant, simple solutions",
      "Show passion for tools and productivity",
      "Product sense is very important",
    ],
    avgSalary: { min: 160000, max: 350000, currency: "USD" },
  },
  // Pakistan Companies
  {
    id: "systems_limited",
    name: "Systems Limited",
    description: "Pakistan's largest IT company, enterprise solutions",
    logo: "/companies/systems.svg",
    color: "#0066CC",
    region: "pakistan",
    interviewFormat: "HR Screen → Technical Test → Technical Interview → HR Final",
    culture: "Professional, enterprise-focused, team-oriented, growth",
    personality: "You are a Systems Limited interviewer. Ask about enterprise development, teamwork, and practical problem solving. Focus on real-world scenarios and team collaboration. Be professional and encouraging.",
    rounds: [
      { name: "HR Screen", duration: "20 min", focus: "Behavioral", description: "Motivation and career goals" },
      { name: "Technical Test", duration: "60 min", focus: "DSA", description: "Online coding assessment" },
      { name: "Technical Interview", duration: "45 min", focus: "Full-Stack", description: "Framework knowledge + problem solving" },
      { name: "HR Final", duration: "20 min", focus: "Behavioral", description: "Salary discussion and team fit" },
    ],
    tips: [
      "Strong fundamentals in Java/.NET/React are valued",
      "Enterprise experience is a plus",
      "Show teamwork and communication skills",
    ],
    avgSalary: { min: 80000, max: 250000, currency: "PKR" },
  },
  {
    id: "10pearls",
    name: "10Pearls",
    description: "US-based digital innovation company with Pakistan offices",
    logo: "/companies/10pearls.svg",
    color: "#00BCD4",
    region: "pakistan",
    interviewFormat: "HR Screen → Technical Assessment → Technical Interview → Culture Fit",
    culture: "Innovation, quality, client-focused, US work culture",
    personality: "You are a 10Pearls interviewer. Mix of US and Pakistan work culture. Ask about modern tech stacks, cloud, and client-facing communication. Value both technical depth and soft skills.",
    rounds: [
      { name: "HR Screen", duration: "20 min", focus: "Behavioral", description: "Background and motivation" },
      { name: "Technical Assessment", duration: "90 min", focus: "DSA", description: "Online coding + MCQs" },
      { name: "Technical Interview", duration: "60 min", focus: "Full-Stack", description: "Deep technical discussion" },
      { name: "Culture Fit", duration: "30 min", focus: "Behavioral", description: "Team dynamics and values" },
    ],
    tips: [
      "Modern tech stack knowledge is important (React, Node, Cloud)",
      "Communication skills matter for client-facing roles",
      "Show initiative and self-learning ability",
    ],
    avgSalary: { min: 100000, max: 400000, currency: "PKR" },
  },
  {
    id: "arbisoft",
    name: "Arbisoft",
    description: "Top Pakistani tech company, edX/Kayak partner",
    logo: "/companies/arbisoft.svg",
    color: "#FF6600",
    region: "pakistan",
    interviewFormat: "Online Test → Technical Interview → Problem Solving → HR",
    culture: "Learning-oriented, collaborative, diverse projects, flat hierarchy",
    personality: "You are an Arbisoft interviewer. Ask about Python/Django, problem-solving approach, and willingness to learn. Value versatility and ability to work on diverse projects.",
    rounds: [
      { name: "Online Test", duration: "60 min", focus: "DSA", description: "Python/JS coding problems" },
      { name: "Technical", duration: "45 min", focus: "Backend", description: "Django/Python deep dive" },
      { name: "Problem Solving", duration: "45 min", focus: "DSA", description: "Live coding session" },
      { name: "HR", duration: "20 min", focus: "Behavioral", description: "Culture fit" },
    ],
    tips: [
      "Python and Django expertise is highly valued",
      "Show willingness to learn new technologies",
      "Diverse project experience is a plus",
    ],
    avgSalary: { min: 100000, max: 350000, currency: "PKR" },
  },
  {
    id: "netsol",
    name: "NetSol Technologies",
    description: "Global IT services, financial technology focus",
    logo: "/companies/netsol.svg",
    color: "#003366",
    region: "pakistan",
    interviewFormat: "HR → Technical Test → Panel Interview → Final",
    culture: "Corporate, process-oriented, financial domain, structured",
    personality: "You are a NetSol interviewer. Focus on software engineering fundamentals, OOP, and enterprise patterns. Ask about financial domain knowledge if applicable. Value structured thinking.",
    rounds: [
      { name: "HR Screen", duration: "20 min", focus: "Behavioral", description: "Background check" },
      { name: "Technical Test", duration: "60 min", focus: "DSA", description: "Coding + OOP concepts" },
      { name: "Panel Interview", duration: "60 min", focus: "Full-Stack", description: "Multiple interviewers" },
    ],
    tips: [
      "Strong OOP and design pattern knowledge is essential",
      "Financial domain knowledge is a big plus",
      "Be prepared for panel-style interviews",
    ],
    avgSalary: { min: 70000, max: 250000, currency: "PKR" },
  },
  {
    id: "techlogix",
    name: "Techlogix",
    description: "Cloud & digital transformation, Microsoft partner",
    logo: "/companies/techlogix.svg",
    color: "#0078D4",
    region: "pakistan",
    interviewFormat: "HR → Technical Assessment → Interview → Final Round",
    culture: "Cloud-first, Microsoft ecosystem, transformation-focused",
    personality: "You are a Techlogix interviewer. Focus on cloud technologies, Azure, and enterprise digital transformation. Value certifications and hands-on cloud experience.",
    rounds: [
      { name: "HR Screen", duration: "20 min", focus: "Behavioral", description: "Motivation and goals" },
      { name: "Technical Assessment", duration: "60 min", focus: "Backend", description: "Cloud + coding assessment" },
      { name: "Technical Interview", duration: "45 min", focus: "DevOps", description: "Azure/cloud deep dive" },
    ],
    tips: [
      "Azure and cloud certifications are highly valued",
      "Show experience with digital transformation projects",
      "Microsoft ecosystem knowledge is important",
    ],
    avgSalary: { min: 80000, max: 300000, currency: "PKR" },
  },
  // Remote-first
  {
    id: "gitlab",
    name: "GitLab",
    description: "All-remote pioneer, transparency, async communication",
    logo: "/companies/gitlab.svg",
    color: "#FC6D26",
    region: "remote",
    interviewFormat: "Screening → Technical → Peer Interview → Manager → Values",
    culture: "Transparency, iteration, collaboration, diversity, results",
    personality: "You are a GitLab interviewer. Focus on async communication, self-management, and technical depth. Ask about remote work experience. 'How do you handle ambiguity when working async?' Value transparency.",
    rounds: [
      { name: "Screening", duration: "30 min", focus: "Behavioral", description: "Background and remote work fit" },
      { name: "Technical", duration: "60 min", focus: "Backend", description: "Ruby/Go coding + architecture" },
      { name: "Peer Interview", duration: "45 min", focus: "Behavioral", description: "Team collaboration assessment" },
      { name: "Manager Interview", duration: "45 min", focus: "Leadership", description: "Growth and career goals" },
    ],
    tips: [
      "GitLab is 100% remote — show remote work maturity",
      "Read the GitLab Handbook before interviewing",
      "Async communication skills are critical",
      "Ruby and Go experience is valued",
    ],
    avgSalary: { min: 120000, max: 280000, currency: "USD" },
  },
  {
    id: "automattic",
    name: "Automattic",
    description: "WordPress.com, fully distributed, text-based culture",
    logo: "/companies/automattic.svg",
    color: "#0675C1",
    region: "remote",
    interviewFormat: "Text Chat → Code Test → Trial Project → Matt Chat",
    culture: "Distributed by design, open source, communication via text, long-term thinking",
    personality: "You are an Automattic interviewer. All communication is text-based. Focus on writing clarity, independent problem solving. Ask about open source contributions. Value async skills and WordPress ecosystem knowledge.",
    rounds: [
      { name: "Text Chat", duration: "60 min", focus: "Behavioral", description: "Slack-based conversation" },
      { name: "Code Test", duration: "3 days", focus: "Full-Stack", description: "Take-home project" },
      { name: "Trial Project", duration: "2-4 weeks", focus: "Full-Stack", description: "Paid trial working on real code" },
      { name: "Matt Chat", duration: "30 min", focus: "Behavioral", description: "Final chat with CEO" },
    ],
    tips: [
      "Written communication is king at Automattic",
      "The trial project is the real interview — treat it seriously",
      "WordPress/PHP experience is valuable",
      "Show you can work independently and async",
    ],
    avgSalary: { min: 100000, max: 250000, currency: "USD" },
  },
  {
    id: "toptal",
    name: "Toptal",
    description: "Top 3% of freelance talent, rigorous screening",
    logo: "/companies/toptal.svg",
    color: "#204ECF",
    region: "remote",
    interviewFormat: "Language Test → Tech Screen → Live Coding → Test Project",
    culture: "Elite talent, meritocracy, remote-first, client-focused",
    personality: "You are a Toptal screener. Be rigorous and precise. Test fundamentals deeply. No hints. Expect perfect solutions. 'Solve this in O(n) time and O(1) space.' Value top-tier engineering skills.",
    rounds: [
      { name: "Language/Personality", duration: "15 min", focus: "Behavioral", description: "English proficiency and communication" },
      { name: "Tech Screen", duration: "90 min", focus: "DSA", description: "3 problems, Codility-style" },
      { name: "Live Coding", duration: "60 min", focus: "DSA", description: "Solve problems live with interviewer" },
      { name: "Test Project", duration: "2 weeks", focus: "Full-Stack", description: "Build a complete project" },
    ],
    tips: [
      "Toptal acceptance rate is 3% — prepare thoroughly",
      "The Codility test is time-pressured — practice speed",
      "The test project must be production-quality",
      "English fluency is tested in the first round",
    ],
    avgSalary: { min: 60, max: 150, currency: "USD/hr" },
  },
  {
    id: "lyft",
    name: "Lyft",
    description: "Transportation, similar to Uber but different culture",
    logo: "/companies/lyft.svg",
    color: "#FF00BF",
    region: "top_startup",
    interviewFormat: "Phone Screen → Coding (2) → System Design → Behavioral",
    culture: "Community, inclusivity, innovation, safety-first",
    personality: "You are a Lyft interviewer. Similar technical bar to Uber but warmer culture. Ask about transportation/geo-spatial problems. Value inclusive thinking and community mindset.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "Medium coding problem" },
      { name: "Coding 1", duration: "45 min", focus: "DSA", description: "Algorithm problem" },
      { name: "System Design", duration: "60 min", focus: "System Design", description: "Transportation system design" },
      { name: "Behavioral", duration: "45 min", focus: "Behavioral", description: "Values and teamwork" },
    ],
    tips: [
      "Very similar to Uber prep but friendlier interviews",
      "Community and inclusivity stories are valued",
      "Show passion for improving transportation",
    ],
    avgSalary: { min: 140000, max: 310000, currency: "USD" },
  },
  // General
  {
    id: "general",
    name: "General",
    description: "Balanced preparation for any tech company interview",
    logo: "/companies/general.svg",
    color: "#6366F1",
    region: "faang",
    interviewFormat: "Phone Screen → Technical → System Design → Behavioral",
    culture: "General best practices and industry standards",
    personality: "You are a professional technical interviewer. Be balanced, fair, and thorough. Cover all aspects of software engineering. Give constructive feedback. Adjust difficulty based on the candidate's level.",
    rounds: [
      { name: "Phone Screen", duration: "45 min", focus: "DSA", description: "Medium coding problem" },
      { name: "Technical", duration: "45 min", focus: "Full-Stack", description: "Technical deep dive" },
      { name: "System Design", duration: "45 min", focus: "System Design", description: "Architecture discussion" },
      { name: "Behavioral", duration: "30 min", focus: "Behavioral", description: "Team fit and soft skills" },
    ],
    tips: [
      "Practice a mix of all question types",
      "Communication is as important as correctness",
      "Always ask clarifying questions",
      "Show enthusiasm for learning",
    ],
    avgSalary: { min: 100000, max: 250000, currency: "USD" },
  },
];

// ─── Difficulty Levels ──────────────────────────

export const DIFFICULTY_LEVELS = [
  {
    id: "junior" as const,
    name: "Junior",
    label: "Junior (0-2 years)",
    description: "Entry level, focus on fundamentals",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    emoji: "🌱",
    eloRange: "1000-1400",
  },
  {
    id: "mid" as const,
    name: "Mid-Level",
    label: "Mid-Level (2-5 years)",
    description: "Intermediate, broader knowledge expected",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    emoji: "🚀",
    eloRange: "1400-1800",
  },
  {
    id: "senior" as const,
    name: "Senior",
    label: "Senior (5+ years)",
    description: "Deep expertise, system design, trade-offs",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    emoji: "⭐",
    eloRange: "1800-2200",
  },
  {
    id: "staff" as const,
    name: "Staff",
    label: "Staff Engineer",
    description: "Architecture focus, tech leadership, cross-team impact",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    emoji: "👑",
    eloRange: "2200-3000",
  },
];

// ─── Skill Categories ───────────────────────────

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

// ─── Free Tier Limits ───────────────────────────

export const FREE_TIER_LIMITS = {
  sessionsPerDay: Infinity,
  savedSessions: Infinity,
  questionTypes: ["dsa", "system_design", "behavioral", "frontend", "backend", "full_stack", "devops", "mobile", "machine_learning", "product_management", "leadership", "full_loop"] as InterviewType[],
  voiceMode: true,
  companyPacks: true,
  resumeUpload: true,
  analytics: true,
  codeExecution: true,
  dailyChallenge: true,
};

// ─── Pricing Plans ──────────────────────────────

export const FREE_TRIAL_DAYS = 36500; // Effectively forever — everything is free

export const PRICING_PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: 0,
    period: "",
    description: "Get started — includes 14-day Pro trial",
    trialDays: 14,
    features: [
      "✨ 14-day free Pro trial (all features unlocked)",
      "3 mock interviews per day after trial",
      "DSA questions only after trial",
      "Basic AI feedback",
      "Code execution engine",
      "Daily challenge access",
      "Save last 5 sessions",
    ],
    limitations: [
      "No voice mode (after trial)",
      "No system design / behavioral (after trial)",
      "No company prep packs (after trial)",
      "No resume personalization (after trial)",
      "No progress analytics (after trial)",
    ],
    cta: "Start Free — 14-Day Pro Trial",
    popular: false,
    stripePriceId: "",
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: 9,
    period: "/month",
    description: "Everything you need to ace your interviews",
    trialDays: 14,
    features: [
      "Unlimited interviews",
      "All 12 question types",
      "Voice mode — speak naturally",
      "Video interview mode (NEW)",
      "20 company prep packs",
      "Code execution with test cases",
      "Detailed AI feedback with scoring",
      "Progress analytics & skill radar",
      "Resume upload & personalization",
      "Adaptive difficulty (ELO)",
      "Study groups & community",
      "Leaderboard access",
      "Unlimited session history",
    ],
    limitations: [],
    cta: "Start Pro — 14-Day Free Trial",
    popular: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
  },
  {
    id: "team" as const,
    name: "Team",
    price: 29,
    period: "/month",
    description: "Prepare your entire engineering team",
    trialDays: 14,
    features: [
      "Everything in Pro",
      "5 team member seats",
      "Team dashboard & analytics",
      "Manager readiness scores",
      "Custom question banks",
      "Bulk interview scheduling",
      "Priority support",
      "Admin controls",
    ],
    limitations: [],
    cta: "Start Team — 14-Day Free Trial",
    popular: false,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID || "",
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    price: 199,
    period: "/month",
    description: "For companies and universities at scale",
    trialDays: 0,
    features: [
      "Everything in Team",
      "Unlimited seats",
      "API access",
      "White-label option",
      "SSO / SAML integration",
      "Custom onboarding",
      "Dedicated success manager",
      "University partnerships",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
    stripePriceId: "",
  },
];

// ─── Navigation ─────────────────────────────────

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Interview", href: "/interview", icon: "Play" },
  { label: "Questions", href: "/questions", icon: "BookOpen" },
  { label: "Daily Challenge", href: "/daily", icon: "Flame" },
  { label: "Flashcards", href: "/flashcards", icon: "Layers" },
  { label: "Companies", href: "/companies", icon: "Building2" },
  { label: "Progress", href: "/progress", icon: "TrendingUp" },
  { label: "History", href: "/history", icon: "Clock" },
  { label: "Resume", href: "/resume", icon: "FileText" },
  { label: "Resume Builder", href: "/resume/builder", icon: "Wand2" },
  { label: "Cover Letter", href: "/cover-letter", icon: "Mail" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Jobs", href: "/jobs", icon: "Briefcase" },
  { label: "Salary", href: "/salary", icon: "DollarSign" },
  { label: "Study Groups", href: "/study-groups", icon: "Users" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

// ─── Question Categories ────────────────────────

export const QUESTION_CATEGORIES = [
  { id: "array" as const, name: "Arrays", count: 50, icon: "Grid3x3" },
  { id: "string" as const, name: "Strings", count: 40, icon: "Type" },
  { id: "linkedlist" as const, name: "Linked Lists", count: 30, icon: "Link" },
  { id: "tree" as const, name: "Trees", count: 35, icon: "GitBranch" },
  { id: "graph" as const, name: "Graphs", count: 25, icon: "Share2" },
  { id: "dp" as const, name: "Dynamic Programming", count: 50, icon: "Puzzle" },
  { id: "sorting" as const, name: "Sorting & Searching", count: 30, icon: "ArrowUpDown" },
  { id: "sliding_window" as const, name: "Sliding Window", count: 25, icon: "SlidersHorizontal" },
  { id: "two_pointers" as const, name: "Two Pointers", count: 25, icon: "Pointer" },
  { id: "stack_queue" as const, name: "Stack & Queue", count: 30, icon: "Layers" },
  { id: "heap" as const, name: "Heap / Priority Queue", count: 20, icon: "Triangle" },
  { id: "bit_manipulation" as const, name: "Bit Manipulation", count: 20, icon: "Binary" },
  { id: "system_design" as const, name: "System Design", count: 50, icon: "Network" },
  { id: "behavioral" as const, name: "Behavioral", count: 50, icon: "MessageSquare" },
  { id: "frontend" as const, name: "Frontend", count: 40, icon: "Monitor" },
  { id: "backend" as const, name: "Backend", count: 40, icon: "Server" },
  { id: "sql" as const, name: "SQL & Databases", count: 20, icon: "Database" },
] as const;

// ─── Code Execution Languages ───────────────────

export const CODE_LANGUAGES = [
  { id: "javascript" as const, name: "JavaScript", judge0Id: 63, monacoId: "javascript" },
  { id: "python" as const, name: "Python 3", judge0Id: 71, monacoId: "python" },
  { id: "java" as const, name: "Java", judge0Id: 62, monacoId: "java" },
  { id: "cpp" as const, name: "C++", judge0Id: 54, monacoId: "cpp" },
] as const;

// ─── ELO Rating Config ──────────────────────────

export const ELO_CONFIG = {
  initialRating: 1200,
  kFactor: 32,
  minRating: 800,
  maxRating: 3000,
  levels: [
    { name: "Beginner", min: 800, max: 1000, color: "#6b7280" },
    { name: "Apprentice", min: 1000, max: 1200, color: "#22c55e" },
    { name: "Intermediate", min: 1200, max: 1500, color: "#3b82f6" },
    { name: "Advanced", min: 1500, max: 1800, color: "#8b5cf6" },
    { name: "Expert", min: 1800, max: 2100, color: "#f59e0b" },
    { name: "Master", min: 2100, max: 2400, color: "#ef4444" },
    { name: "Grandmaster", min: 2400, max: 3000, color: "#ec4899" },
  ],
} as const;

// ─── Badges ─────────────────────────────────────

export const BADGES = [
  { id: "first_session", name: "First Steps", description: "Complete your first interview", icon: "🎯" },
  { id: "streak_7", name: "On Fire", description: "7-day practice streak", icon: "🔥" },
  { id: "streak_30", name: "Unstoppable", description: "30-day practice streak", icon: "⚡" },
  { id: "score_90", name: "Ace", description: "Score 90+ on any interview", icon: "🏆" },
  { id: "problems_50", name: "Problem Crusher", description: "Solve 50 problems", icon: "💪" },
  { id: "problems_100", name: "Century Club", description: "Solve 100 problems", icon: "💯" },
  { id: "all_types", name: "Full Stack", description: "Complete all interview types", icon: "🌟" },
  { id: "voice_master", name: "Voice Master", description: "Complete 10 voice interviews", icon: "🎙️" },
  { id: "speed_demon", name: "Speed Demon", description: "Solve a hard problem in under 15 min", icon: "⏱️" },
  { id: "helper", name: "Community Helper", description: "Help 10 users in discussions", icon: "🤝" },
] as const;

// ─── Filler Words ───────────────────────────────

export const FILLER_WORDS = [
  "um", "uh", "like", "you know", "basically", "actually", "literally",
  "so", "right", "I mean", "sort of", "kind of", "well",
] as const;

// ─── Voice Config ───────────────────────────────

export const VOICE_CONFIG = {
  targetWPM: { min: 120, max: 160 },
  maxFillerPercentage: 5,
  voices: {
    google: { rate: 0.95, pitch: 1.0 },
    meta: { rate: 1.05, pitch: 1.0 },
    amazon: { rate: 0.9, pitch: 0.95 },
    stripe: { rate: 0.9, pitch: 1.05 },
    general: { rate: 0.95, pitch: 1.0 },
  },
} as const;
