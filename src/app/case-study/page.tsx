import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Database,
  FileSearch,
  GitBranch,
  Layers3,
  LibraryBig,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "PrepWithAI Engineering Case Study",
  description:
    "How PrepWithAI connects evidence-based interview practice, persistent learning, job tracking, behavioral stories, and offer decisions in one production-grade Next.js product.",
};

const productLoop = [
  {
    title: "Prepare",
    description: "Validate the environment, understand the target role, and identify truthful resume-to-job gaps.",
    icon: ShieldCheck,
  },
  {
    title: "Practice",
    description: "Run technical, behavioral, coding, voice, video, and system-design interview sessions.",
    icon: BrainCircuit,
  },
  {
    title: "Improve",
    description: "Review calibrated scores, candidate evidence, confidence, and one narrow next-practice target.",
    icon: Target,
  },
  {
    title: "Apply",
    description: "Track real opportunities, reusable stories, follow-ups, offers, and negotiation decisions.",
    icon: BriefcaseBusiness,
  },
];

const architecture = [
  {
    title: "Next.js application layer",
    detail: "App Router, React 19, TypeScript, server routes, responsive authenticated workspace, and public marketing surfaces.",
    icon: Layers3,
  },
  {
    title: "Persistent product state",
    detail: "MongoDB and Mongoose models for sessions, progress, spaced repetition, opportunities, behavioral evidence, offers, and account lifecycle data.",
    icon: Database,
  },
  {
    title: "Trustworthy AI boundary",
    detail: "Centralized Groq integration, retry and usage controls, structured outputs, prompt-injection boundaries, and evidence-only evaluation rules.",
    icon: ShieldCheck,
  },
  {
    title: "Release discipline",
    detail: "Feature branches, pull-request gates, exact-head lint and production builds, Vercel previews, health checks, and runtime smoke tests.",
    icon: GitBranch,
  },
];

const featureSystems = [
  {
    title: "Evidence-backed interview reports",
    description: "Reports quote short candidate evidence, expose evaluation confidence, and avoid claiming knowledge the candidate never demonstrated.",
    icon: FileSearch,
  },
  {
    title: "Persistent spaced repetition",
    description: "Again, Hard, Good, and Easy ratings update review intervals, ease, due dates, retention, and mastery across sessions.",
    icon: Layers3,
  },
  {
    title: "Behavioral Story Bank",
    description: "Users store real STAR evidence, metrics, reflection, competencies, and tags, then receive evidence-only quality scoring.",
    icon: LibraryBig,
  },
  {
    title: "Real opportunity pipeline",
    description: "The product stores user-owned jobs, next actions, dates, notes, source links, and honest application stages instead of fabricated listings.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Offer and negotiation lab",
    description: "First-year and recurring compensation are compared alongside learning, growth, work-life, brand, flexibility, and deadlines.",
    icon: Scale,
  },
  {
    title: "Privacy lifecycle",
    description: "Users can export the connected account data graph or permanently delete account, practice, career, story, offer, and usage records.",
    icon: ShieldCheck,
  },
];

const principles = [
  "Do not invent jobs, resume history, code execution, achievements, or evaluation evidence.",
  "Expose unavailable integrations and low-confidence assessments instead of simulating certainty.",
  "Use AI to improve preparation, not to provide stealth answers during a real interview.",
  "Make every dashboard surface lead to a real persistent workflow rather than a decorative placeholder.",
  "Treat accessibility, responsive behavior, security headers, authentication readiness, and data deletion as product features.",
];

export default function CaseStudyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08080c] text-white">
      <section className="relative isolate border-b border-white/[0.06] px-4 pb-24 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-[-280px] -z-10 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/12 blur-[150px]" />
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            ← Back to PrepWithAI
          </Link>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-3 py-1.5 text-xs font-medium text-indigo-200">
                <Sparkles className="h-3.5 w-3.5" /> Product and engineering case study
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.055em] sm:text-6xl lg:text-[72px] lg:leading-[0.98]">
                Building an evidence-based career preparation operating system.
              </h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
                PrepWithAI began as an AI mock-interview product. It evolved into a connected system for readiness, role targeting, realistic practice, inspectable evaluation, retention, applications, behavioral evidence, and offer decisions.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/demo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100">
                  Explore product demo <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="https://github.com/AbdullahTariq25/PrepWithAI" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06]">
                  Review source repository <GitBranch className="h-4 w-4" />
                </a>
              </div>
            </div>

            <aside className="rounded-[26px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_35px_100px_rgba(0,0,0,0.4)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Project snapshot</p>
              <dl className="mt-6 space-y-5">
                {[
                  ["Role", "Founder and full-stack product developer"],
                  ["Audience", "Software engineers preparing for technical and behavioral interviews"],
                  ["Stack", "Next.js 16, React 19, TypeScript, MongoDB, Groq, Auth.js, Vercel"],
                  ["Product model", "Persistent preparation, practice, career, and decision workflows"],
                  ["Release approach", "PR-gated validation and exact-deployment verification"],
                ].map(([term, value]) => (
                  <div key={term} className="border-b border-white/[0.07] pb-5 last:border-0 last:pb-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">{term}</dt>
                    <dd className="mt-2 text-sm leading-6 text-zinc-300">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">The product problem</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Interview preparation is fragmented across too many disconnected tools.</h2>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              Candidates commonly switch between question libraries, video tools, notes, resumes, spreadsheets, job trackers, flashcards, and generic chatbots. The resulting workflow produces activity, but not always measurable improvement. PrepWithAI connects the full loop and preserves the evidence between steps.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {productLoop.map(({ title, description, icon: Icon }, index) => (
              <article key={title} className="rounded-2xl border border-white/[0.08] bg-[#0d0d13] p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-indigo-400/15 bg-indigo-400/[0.08] text-indigo-300"><Icon className="h-5 w-5" /></span>
                  <span className="font-mono text-xs text-zinc-700">0{index + 1}</span>
                </div>
                <h3 className="mt-7 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#0a0a0f] px-4 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">System design</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Architecture shaped by product trust.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-zinc-400">
              The engineering challenge was not only generating AI responses. It was building reliable boundaries around identity, data ownership, persistence, evaluation confidence, API usage, failures, and deployment readiness.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {architecture.map(({ title, detail, icon: Icon }) => (
              <article key={title} className="rounded-2xl border border-white/[0.08] bg-[#0d0d13] p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.04] text-indigo-300"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.025em]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Connected feature systems</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Features designed as persistent workflows, not isolated demos.</h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featureSystems.map(({ title, description, icon: Icon }) => (
              <article key={title} className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-indigo-400/20">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-black/20 text-indigo-300"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.025em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#0a0a0f] px-4 py-24 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Product integrity</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Trust became a design requirement.</h2>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              AI career products can easily overstate accuracy, fabricate certainty, or cross ethical boundaries. PrepWithAI uses explicit product rules to keep preparation useful and portfolio-defensible.
            </p>
          </div>
          <div className="space-y-3">
            {principles.map((principle) => (
              <div key={principle} className="flex gap-3 rounded-2xl border border-white/[0.08] bg-[#0d0d13] p-4 text-sm leading-6 text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {principle}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-indigo-400/15 bg-gradient-to-br from-indigo-500/10 via-[#0d0d13] to-violet-500/8 p-7 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Outcome</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">A portfolio project that demonstrates product judgment, not only UI implementation.</h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400">
                PrepWithAI now demonstrates full-stack architecture, trustworthy AI integration, data modeling, security and privacy lifecycle, product analytics, resilient authentication, responsive design, release engineering, and differentiated career workflows.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"><div className="flex items-center gap-2 text-sm font-medium"><BarChart3 className="h-4 w-4 text-indigo-300" /> Measurable learning loop</div></div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"><div className="flex items-center gap-2 text-sm font-medium"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Explicit trust boundaries</div></div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"><div className="flex items-center gap-2 text-sm font-medium"><BriefcaseBusiness className="h-4 w-4 text-fuchsia-300" /> Career workflow depth</div></div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.08] pt-8 sm:flex-row">
            <Link href="/signup" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100">Try PrepWithAI <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-5 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06]">Return to product site</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
