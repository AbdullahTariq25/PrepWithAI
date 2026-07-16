import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  Layers3,
  Mic2,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const stages = [
  {
    number: "01",
    eyebrow: "Prepare",
    title: "Enter the interview with your setup, target role, and strongest evidence already clear.",
    description:
      "Run device checks, define the role you are targeting, match your resume, and organize real behavioral stories before practice starts.",
    icon: ShieldCheck,
    accent: "from-cyan-400/20 to-indigo-500/5",
    items: ["Readiness Center", "Resume-to-job matching", "Behavioral Story Bank"],
  },
  {
    number: "02",
    eyebrow: "Practice",
    title: "Rehearse the pressure, reasoning, and communication—not just final answers.",
    description:
      "Choose a focused track and practice in text, voice, video, or coding mode with an interviewer that asks one question at a time.",
    icon: Mic2,
    accent: "from-indigo-400/20 to-violet-500/5",
    items: ["Technical and behavioral tracks", "Voice, video and code modes", "Company-style practice"],
  },
  {
    number: "03",
    eyebrow: "Improve",
    title: "Use inspectable evidence to decide exactly what to practice next.",
    description:
      "Review calibrated scores, candidate-only transcript evidence, confidence, progress trends, and one highest-leverage practice target.",
    icon: Target,
    accent: "from-violet-400/20 to-fuchsia-500/5",
    items: ["Evidence-backed reports", "Persistent spaced repetition", "Progress and ELO trends"],
  },
  {
    number: "04",
    eyebrow: "Apply & decide",
    title: "Carry preparation into real opportunities, follow-ups, negotiations, and decisions.",
    description:
      "Manage actual applications, preserve private context, compare complete offers, and keep every decision connected to the role you prepared for.",
    icon: BriefcaseBusiness,
    accent: "from-fuchsia-400/20 to-rose-500/5",
    items: ["User-owned job pipeline", "Offer and negotiation lab", "Private export and deletion"],
  },
];

export default function ProductWorkflowShowcase() {
  return (
    <section id="workspace" className="relative px-4 py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-96 max-w-5xl rounded-full bg-indigo-500/[0.07] blur-[120px]" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.06] px-3 py-1.5 text-xs font-medium text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" /> One connected preparation workspace
            </div>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
              From target role to offer decision—without disconnected tools.
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              PrepWithAI connects the full loop: validate your setup, organize your evidence,
              practice the right interview, inspect the feedback, retain weak concepts, manage
              opportunities, and make better career decisions.
            </p>
            <Link
              href="/#career-intelligence"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
            >
              Explore the complete career system <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <article
                key={stage.number}
                className="group relative overflow-hidden rounded-[26px] border border-white/8 bg-[#0d0d13] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/14 sm:p-7"
              >
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${stage.accent}`} />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/20 text-indigo-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs tracking-[0.18em] text-zinc-600">{stage.number}</span>
                  </div>

                  <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
                    {stage.eyebrow}
                  </p>
                  <h3 className="mt-3 max-w-xl text-xl font-semibold tracking-[-0.025em] text-white sm:text-2xl">
                    {stage.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">{stage.description}</p>

                  <div className="mt-6 grid gap-2 sm:grid-cols-3">
                    {stage.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 rounded-xl border border-white/7 bg-white/[0.025] px-3 py-2.5 text-xs leading-5 text-zinc-400"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { icon: FileSearch, label: "Truthful analysis", text: "No invented resume history, job listings, market data, or execution results." },
            { icon: Layers3, label: "Persistent intelligence", text: "Stories, reviews, applications, offers, progress, and reports survive refreshes." },
            { icon: ShieldCheck, label: "Production boundaries", text: "Explicit readiness, evidence confidence, privacy controls, and unavailable states." },
          ].map(({ icon: Icon, label, text }) => (
            <div key={label} className="rounded-2xl border border-white/7 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Icon className="h-4 w-4 text-indigo-300" /> {label}
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
