import {
  Blocks,
  BrainCircuit,
  Code2,
  Database,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

const tracks = [
  {
    icon: Code2,
    title: "Data structures & algorithms",
    description: "Think aloud, write code, handle edge cases, and explain complexity under realistic interview pressure.",
    meta: "Coding · DSA · problem solving",
  },
  {
    icon: Blocks,
    title: "System design",
    description: "Practice requirements, APIs, data models, scaling decisions, failure modes, and trade-off communication.",
    meta: "Architecture · scalability · trade-offs",
  },
  {
    icon: BrainCircuit,
    title: "Frontend engineering",
    description: "Work through React, browser performance, accessibility, state, architecture, and product-quality decisions.",
    meta: "React · web platform · performance",
  },
  {
    icon: Database,
    title: "Backend engineering",
    description: "Prepare for APIs, databases, concurrency, distributed systems, caching, reliability, and observability.",
    meta: "APIs · databases · distributed systems",
  },
  {
    icon: MessageSquareText,
    title: "Behavioral interviews",
    description: "Build concise, evidence-based STAR answers and learn to communicate impact without sounding rehearsed.",
    meta: "Leadership · impact · communication",
  },
  {
    icon: ShieldCheck,
    title: "Role-specific practice",
    description: "Focus the interview around seniority, target company, role family, and the exact weaknesses you need to fix.",
    meta: "Company packs · seniority · custom focus",
  },
];

export default function InterviewTracks() {
  return (
    <section id="tracks" className="scroll-mt-28 border-y border-white/[0.06] bg-[#0a0a0f] px-4 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Interview tracks</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            One practice environment for the interviews that actually matter.
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
            Switch between interview formats without losing the feedback loop. PrepWithAI keeps the experience consistent while the questions, rubric, and expectations change with the role.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map(({ icon: Icon, title, description, meta }) => (
            <article
              key={title}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/25 hover:bg-white/[0.04]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-indigo-400/15 bg-indigo-400/[0.08] text-indigo-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.025em] text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
              <p className="mt-5 border-t border-white/[0.06] pt-4 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-600">
                {meta}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
