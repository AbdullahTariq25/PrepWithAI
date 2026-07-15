import { Gauge, LineChart, Repeat2 } from "lucide-react";

const steps = [
  {
    icon: Gauge,
    number: "01",
    title: "Simulate the pressure",
    description: "Choose the role, interview type, difficulty, and mode. Practice inside a focused environment instead of reading another list of questions.",
  },
  {
    icon: LineChart,
    number: "02",
    title: "Get specific feedback",
    description: "Review what was strong, what was vague, what was technically weak, and the exact improvement that would raise the answer quality.",
  },
  {
    icon: Repeat2,
    number: "03",
    title: "Repeat with intent",
    description: "Use the feedback to target the next session. The goal is not more practice time; it is a tighter loop between attempt, evidence, and improvement.",
  },
];

export default function PracticeLoop() {
  return (
    <section className="bg-[#08080c] px-4 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-transparent p-6 sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">The practice loop</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Stop guessing whether you are getting better.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            PrepWithAI is designed around deliberate practice: realistic attempts, structured evaluation, and a clear next action. Every session should tell you what to do differently next time.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {steps.map(({ icon: Icon, number, title, description }) => (
            <article key={number} className="rounded-2xl border border-white/[0.07] bg-black/20 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-indigo-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-zinc-700">{number}</span>
              </div>
              <h3 className="mt-8 text-lg font-semibold tracking-[-0.025em] text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
