import Link from "next/link";
import { ArrowRight, Code2, Github, Globe2, Target } from "lucide-react";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

const principles = [
  {
    title: "Practice should feel realistic",
    description: "Knowing an answer is different from explaining it under pressure. PrepWithAI is built around active interview rehearsal, not passive content consumption.",
  },
  {
    title: "Feedback should be actionable",
    description: "A score alone does not improve performance. The product is designed to help candidates identify a specific weakness and practice it again.",
  },
  {
    title: "Access should start simple",
    description: "Candidates can begin with a free account and decide whether deeper Pro workflows are valuable after experiencing the core practice loop.",
  },
];

export default function AboutPage() {
  return (
    <>
      <MarketingNav />
      <main className="min-h-screen bg-[#08080c] pt-28 text-white">
        <section className="border-b border-white/7 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-3 py-1.5 text-xs font-medium text-indigo-300">
              <Target className="h-3.5 w-3.5" /> Why PrepWithAI exists
            </div>
            <h1 className="text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Interview preparation should train the skill you actually need on interview day.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#9b9bab] sm:text-lg">
              Developers have access to endless questions, videos, and tutorials. The harder problem is turning knowledge into clear performance under pressure. PrepWithAI focuses on that gap.
            </p>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/12 to-violet-500/[0.03] p-7 sm:p-9">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold shadow-xl shadow-indigo-950/40">
                AT
              </div>
              <h2 className="mt-6 text-2xl font-bold">Abdullah Tariq</h2>
              <p className="mt-1 text-sm font-medium text-indigo-300">Founder and software developer</p>
              <p className="mt-5 text-sm leading-7 text-[#a0a0ae]">
                Based in Lahore, Pakistan, with previous study experience in Shenzhen, China. I build software products and practical AI workflows, with a focus on turning real user problems into complete digital systems.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://github.com/AbdullahTariq25"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Abdullah Tariq on GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-[#b7b7c3] transition hover:bg-white/8 hover:text-white"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://takneasolution.me/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Taknea Solutions website"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-[#b7b7c3] transition hover:bg-white/8 hover:text-white"
                >
                  <Globe2 className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">The product thesis</div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">From passive preparation to deliberate rehearsal.</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-[#9b9bab]">
                <p>
                  PrepWithAI started from a simple observation: a candidate can understand algorithms, system design, and behavioral frameworks yet still struggle to communicate those ideas clearly in a real interview.
                </p>
                <p>
                  The product brings practice, feedback, company context, voice and video rehearsal, progress tracking, and career tools into one workspace. The goal is not to promise a job offer. The goal is to help candidates arrive better prepared, more self-aware, and more confident in how they think out loud.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/features" className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[#d5d5de] transition hover:bg-white/8">
                  Explore features
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/7 bg-white/[0.02] px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">Product principles</div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">The standards behind the experience.</h2>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {principles.map((principle, index) => (
                <article key={principle.title} className="rounded-2xl border border-white/7 bg-[#111116] p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-bold text-indigo-300">{index + 1}</div>
                  <h3 className="mt-5 text-lg font-semibold">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#8e8e9e]">{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/7 bg-[#111116] p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10"><Code2 className="h-5 w-5 text-emerald-300" /></div>
              <h2 className="mt-6 text-2xl font-bold">Built as a real software product</h2>
              <p className="mt-4 text-sm leading-7 text-[#9494a4]">
                PrepWithAI combines a Next.js application, authenticated user workflows, MongoDB persistence, AI integrations, Stripe subscription infrastructure, transactional email, analytics, and multiple interview surfaces.
              </p>
              <a href="https://github.com/AbdullahTariq25/PrepWithAI" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200">
                View the repository <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent p-7 sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">The mission</div>
              <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl">
                Make high-quality interview rehearsal more accessible to developers building their careers anywhere in the world.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#9898a8]">
                The product will keep evolving through real usage, measured product decisions, and a focus on preparation outcomes rather than feature count alone.
              </p>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
