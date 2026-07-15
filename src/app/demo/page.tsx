import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Code2,
  Gauge,
  MessageSquare,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Video,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Product Demo | PrepWithAI",
  description:
    "See how PrepWithAI turns a realistic mock interview into calibrated, evidence-based coaching and a focused next practice step.",
};

const dimensions = [
  { label: "Problem solving", score: 84 },
  { label: "Communication", score: 78 },
  { label: "Technical quality", score: 88 },
  { label: "Edge cases", score: 69 },
  { label: "Time management", score: 81 },
];

const productSignals = [
  {
    icon: Brain,
    title: "Adaptive interview flow",
    description:
      "Follow-up questions respond to what the candidate actually says instead of replaying a fixed script.",
  },
  {
    icon: ShieldCheck,
    title: "Calibrated evaluation",
    description:
      "Scores are normalized across a fixed rubric and confidence drops when the transcript does not contain enough evidence.",
  },
  {
    icon: Quote,
    title: "Inspectable evidence",
    description:
      "The report can cite short candidate transcript excerpts so users can see why a score moved.",
  },
  {
    icon: Target,
    title: "One next practice target",
    description:
      "Every report ends with a narrow improvement objective rather than a generic list of everything to study.",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      <Navbar />

      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-36 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[150px]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-3.5 py-2 text-xs font-medium text-indigo-100">
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                Product walkthrough · no account required
              </div>
              <h1 className="mt-7 text-balance text-5xl font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                From interview pressure to
                <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  evidence you can act on.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-zinc-400 sm:text-lg">
                This walkthrough shows the product loop: realistic practice, calibrated scoring,
                transcript evidence, progress tracking, and one focused next step.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-zinc-100"
                >
                  Build your own baseline <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#walkthrough"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-6 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  View the walkthrough
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="walkthrough" className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
                Step 1 · realistic practice
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                The interviewer probes the answer instead of teaching during the session.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                Detailed coaching belongs after the interview. During practice, the product keeps
                the pressure and conversational rhythm closer to a real evaluation.
              </p>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300">
                    Senior frontend interview
                  </div>
                  <div className="mt-1 text-sm text-zinc-500">Question 4 · performance diagnosis</div>
                </div>
                <div className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-zinc-500">
                  18:42
                </div>
              </div>

              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <aside className="border-b border-white/8 bg-black/15 p-5 lg:border-b-0 lg:border-r sm:p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
                      <Brain className="h-5 w-5 text-indigo-300" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">AI interviewer</div>
                      <div className="text-xs text-zinc-500">Adaptive follow-up</div>
                    </div>
                  </div>

                  <p className="mt-6 text-lg font-medium leading-8 text-zinc-200">
                    You said you would memoize the expensive table rows. How would you determine
                    whether memoization is actually reducing work rather than adding comparison cost?
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-sm leading-6 text-zinc-500">
                    The next question is based on the candidate&apos;s previous answer, not selected
                    from a fixed sequence.
                  </div>
                </aside>

                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                        <MessageSquare className="h-5 w-5 text-violet-300" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Candidate response</div>
                        <div className="text-xs text-zinc-500">Live transcript</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/[0.025]">
                        <Video className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/[0.025]">
                        <Code2 className="h-4 w-4 text-zinc-500" />
                      </div>
                    </div>
                  </div>

                  <blockquote className="mt-6 rounded-2xl border border-violet-400/15 bg-violet-400/[0.045] p-5 text-sm leading-7 text-zinc-300 sm:text-base">
                    “I would measure the component with the React Profiler first. If the rows are
                    cheap or the props change frequently, memoization could cost more than it saves.
                    I would compare commit duration before and after the change.”
                  </blockquote>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      "Clarifies the measurement",
                      "Explains a trade-off",
                      "Defines a verification step",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 rounded-xl border border-white/7 bg-white/[0.02] p-3 text-xs leading-5 text-zinc-500"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                Step 2 · calibrated report
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                A score is useful only when the user can inspect why it exists.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                PrepWithAI normalizes the overall score against a fixed rubric and reduces confidence
                when the transcript contains weak or incomplete evidence.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/10 via-[#111116] to-[#0d0d12] p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300">
                  Interview score
                </div>
                <div className="mt-5 flex items-end gap-3">
                  <div className="text-7xl font-bold tracking-[-0.06em] text-emerald-300">82</div>
                  <div className="pb-2 text-sm text-zinc-600">/100</div>
                </div>
                <div className="mt-2 text-lg font-semibold">Strong performance</div>
                <div className="mt-6 rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-indigo-300" /> Evaluation confidence
                    </span>
                    <span className="font-mono text-zinc-300">86%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-300">
                  <TrendingUp className="h-4 w-4" /> Positive practice signal
                </div>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  A coaching signal for this practice level—not a promise of an employer decision.
                </p>
              </div>

              <div className="rounded-3xl border border-white/8 bg-[#111116] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">Calibrated dimensions</div>
                    <div className="mt-1 text-xs text-zinc-500">One optimistic number cannot contradict the detailed rubric.</div>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="mt-6 space-y-5">
                  {dimensions.map((dimension) => (
                    <div key={dimension.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-zinc-400">{dimension.label}</span>
                        <span className="font-mono text-zinc-500">{dimension.score}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                          style={{ width: `${dimension.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <article className="rounded-3xl border border-violet-400/12 bg-violet-400/[0.035] p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
                  <Quote className="h-4 w-4" /> Transcript evidence
                </div>
                <blockquote className="mt-5 border-l-2 border-violet-400/40 pl-4 text-sm italic leading-7 text-zinc-300">
                  “If the rows are cheap or the props change frequently, memoization could cost more than it saves.”
                </blockquote>
                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  Supports the technical-quality score because the candidate recognizes that optimization has its own cost and proposes measuring the trade-off.
                </p>
              </article>

              <article className="rounded-3xl border border-emerald-400/12 bg-emerald-400/[0.035] p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  <Target className="h-4 w-4" /> Highest-leverage next practice
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-8">
                  Add one concrete before-and-after metric when discussing performance work.
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  The next session should rehearse this one skill instead of repeating the entire interview loop.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
                Product system
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                The value is the loop, not a chatbot window.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                Practice data feeds a persistent skill profile so the user can see progress and choose the next session deliberately.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {productSignals.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/8 bg-[#111116] p-5 transition hover:-translate-y-1 hover:border-indigo-400/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                    <Icon className="h-5 w-5 text-indigo-300" />
                  </div>
                  <h3 className="mt-5 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-indigo-400/15 bg-gradient-to-br from-indigo-500/12 via-[#111116] to-violet-500/8 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Build a baseline with your own answers, not a demo score.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Your report becomes more useful as the product gathers repeated, evidence-rich practice sessions against a consistent rubric.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
            >
              Start your first interview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
