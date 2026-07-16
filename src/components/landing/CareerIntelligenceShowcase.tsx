import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  LibraryBig,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

const supportingTools = [
  {
    icon: FileSearch,
    title: "Resume ↔ job match",
    description:
      "Compare a real resume with a real role description and expose truthful coverage gaps before applying.",
    accent: "text-cyan-300",
  },
  {
    icon: BriefcaseBusiness,
    title: "Application pipeline",
    description:
      "Track actual opportunities, next actions, follow-up dates, interview stages, and private notes.",
    accent: "text-fuchsia-300",
  },
  {
    icon: TrendingUp,
    title: "Evidence reports",
    description:
      "Connect transcript evidence, calibrated confidence, progress trends, and one focused next practice target.",
    accent: "text-indigo-300",
  },
];

export default function CareerIntelligenceShowcase() {
  return (
    <section id="career-intelligence" className="relative px-4 py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-16 -z-10 mx-auto h-[460px] max-w-6xl rounded-full bg-violet-500/[0.07] blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles className="h-3.5 w-3.5" /> Career intelligence, not disconnected utilities
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
              Prepare the interview, the application, and the decision in one system.
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              PrepWithAI now carries your evidence beyond a single mock session. Build reusable
              behavioral stories, target real roles, retain weak concepts, manage opportunities,
              and compare offers without inventing experience or pretending heuristic data is live market truth.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 font-semibold text-violet-300 transition hover:text-violet-200"
              >
                Build your workspace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/case-study"
                className="inline-flex items-center gap-2 font-medium text-zinc-400 transition hover:text-white"
              >
                Read the engineering case study
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-[28px] border border-violet-400/15 bg-[#0d0d13] p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.08]">
                  <LibraryBig className="h-5 w-5 text-violet-300" />
                </div>
                <span className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Behavioral Story Bank
                </span>
              </div>

              <h3 className="mt-7 max-w-xl text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Turn real work into interview-ready evidence.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                Capture Situation, Task, Action, Result, reflection, metrics, competencies, and tags once—then improve the evidence instead of memorizing robotic scripts.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Evidence-only AI evaluation",
                  "Specificity and ownership scoring",
                  "Impact and reflection checks",
                  "Reusable copy-ready STAR output",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-xl border border-white/7 bg-white/[0.025] px-3 py-3 text-xs leading-5 text-zinc-400"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">Story quality signal</p>
                    <p className="mt-1 text-sm font-medium text-zinc-200">Leadership · Production incident recovery</p>
                  </div>
                  <span className="text-2xl font-semibold tabular-nums text-emerald-300">84%</span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/6">
                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-violet-500 to-emerald-400" />
                </div>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[28px] border border-emerald-400/15 bg-[#0d0d13] p-6 sm:p-8">
            <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/12 blur-[100px]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.08]">
                  <Scale className="h-5 w-5 text-emerald-300" />
                </div>
                <span className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Offer & Negotiation Lab
                </span>
              </div>

              <h3 className="mt-7 max-w-xl text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Compare the whole opportunity before saying yes.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                Model first-year compensation, recurring value, deadlines, learning, growth, flexibility, brand, and work-life fit in a decision workspace you control.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ["Year one", "$142k"],
                  ["Recurring", "$128k"],
                  ["Career fit", "88%"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/8 bg-black/20 p-4 text-center">
                    <div className="text-lg font-semibold tabular-nums text-white sm:text-2xl">{value}</div>
                    <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-600">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {[
                  ["Learning and technical growth", 92],
                  ["Work-life and flexibility", 78],
                  ["Brand and future leverage", 86],
                ].map(([label, value]) => (
                  <div key={String(label)}>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">{label}</span>
                      <span className="font-mono text-zinc-500">{value}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.045] p-4">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <p className="text-xs leading-5 text-zinc-400">
                  Decision support remains transparent: user-entered offer data and explicit fit scores, not fabricated market benchmarks.
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {supportingTools.map(({ icon: Icon, title, description, accent }) => (
            <article
              key={title}
              className="group rounded-2xl border border-white/7 bg-white/[0.02] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/14 hover:bg-white/[0.035]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-black/20">
                  <Icon className={`h-4.5 w-4.5 ${accent}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-white" />
              </div>
              <h3 className="mt-5 font-semibold text-zinc-100">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-zinc-500">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.045] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-indigo-400/15 bg-indigo-400/[0.08]">
              <ShieldCheck className="h-4.5 w-4.5 text-indigo-300" />
            </div>
            <div>
              <p className="font-medium text-white">Designed for preparation—not covert assistance during real interviews.</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                That boundary protects candidate learning, employer trust, and the credibility of the product as a serious portfolio system.
              </p>
            </div>
          </div>
          <Link
            href="/case-study"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.07] hover:text-white"
          >
            Product decisions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
