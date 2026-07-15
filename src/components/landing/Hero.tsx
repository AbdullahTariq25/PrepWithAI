import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  Mic2,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Video,
} from "lucide-react";

const skills = [
  { label: "Technical quality", value: 88 },
  { label: "Communication", value: 78 },
  { label: "Problem solving", value: 84 },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#08080c] px-4 pb-24 pt-36 sm:pt-40 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[680px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-3.5 py-2 text-xs font-medium text-indigo-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            Evidence-based AI interview practice for software engineers
          </div>

          <h1 className="mt-7 text-balance text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-[76px] lg:leading-[0.98]">
            Practice under pressure.
            <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Improve with evidence.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Run realistic technical, behavioral, coding, and system-design interviews.
            Get a calibrated report with transcript evidence, evaluation confidence, and one
            focused skill to practice next.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-950 shadow-[0_10px_40px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Build your baseline <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-6 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Explore the product demo
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            {[
              "No credit card required",
              "Calibrated multi-skill rubric",
              "Voice, video and code modes",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
          <div className="absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-fuchsia-500/10 blur-2xl" />
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0d0d13] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="flex h-12 items-center border-b border-white/10 bg-black/20 px-4">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="mx-auto pr-[42px] text-[11px] font-medium tracking-wide text-zinc-500">
                POST-INTERVIEW REPORT · SENIOR FRONTEND ENGINEER
              </span>
            </div>

            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-300">
                      Calibrated report
                    </p>
                    <h2 className="mt-2 max-w-2xl text-xl font-semibold tracking-[-0.025em] text-white sm:text-2xl">
                      Strong technical judgment, with one important gap in measurable impact.
                    </h2>
                  </div>
                  <div className="grid h-20 w-20 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08]">
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-emerald-300">82</div>
                      <div className="text-[9px] uppercase tracking-wider text-emerald-400/70">Score</div>
                    </div>
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.label}>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-zinc-400">{skill.label}</span>
                        <span className="font-mono text-zinc-500">{skill.value}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Mic2, label: "Voice interview" },
                    { icon: Video, label: "Video practice" },
                    { icon: Code2, label: "Live coding" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.025] px-3 py-3 text-xs font-medium text-zinc-400"
                    >
                      <Icon className="h-4 w-4 text-indigo-300" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <aside className="bg-gradient-to-b from-white/[0.025] to-transparent p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                      Evidence behind the score
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">Inspectable coaching</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 text-xs text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" /> 86% confidence
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-violet-400/15 bg-violet-400/[0.045] p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-violet-300">
                    <Quote className="h-3.5 w-3.5" /> Candidate evidence
                  </div>
                  <p className="mt-3 text-sm italic leading-6 text-zinc-300">
                    “If the rows are cheap or the props change frequently, memoization could cost
                    more than it saves.”
                  </p>
                  <p className="mt-3 text-xs leading-5 text-zinc-500">
                    Supports the technical-quality score because the answer recognizes an
                    optimization trade-off instead of applying memoization blindly.
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-400/10 text-indigo-300">
                      <Target className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">Highest-leverage next practice</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">
                        Add one concrete before-and-after metric when explaining performance work.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
