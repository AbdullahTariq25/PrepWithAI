import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Code2,
  Mic,
  Target,
  Video,
} from "lucide-react";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

const features = [
  {
    icon: BrainCircuit,
    title: "Adaptive AI interviews",
    description: "Practice DSA, system design, behavioral, frontend, backend, DevOps, mobile, ML, leadership, and full interview loops.",
    details: ["Follow-up questions", "Difficulty-aware prompts", "Company-specific interview styles"],
  },
  {
    icon: Mic,
    title: "Voice practice",
    description: "Answer naturally, review speaking pace and filler words, and build the communication habits real interviews require.",
    details: ["Speech recognition", "Pace analysis", "Communication feedback"],
  },
  {
    icon: Video,
    title: "Video interview mode",
    description: "Rehearse the pressure of a live call with a focused interview workspace designed for realistic practice.",
    details: ["Camera-ready practice", "Live interview flow", "Post-session review"],
  },
  {
    icon: Building2,
    title: "Company preparation packs",
    description: "Prepare for different interview cultures and formats instead of practicing the same generic questions every time.",
    details: ["20+ company profiles", "Round-specific context", "Interview-style guidance"],
  },
  {
    icon: Code2,
    title: "Technical problem solving",
    description: "Explain your approach, reason about tradeoffs, and practice writing stronger technical answers with structured AI feedback.",
    details: ["Problem-solving review", "Complexity discussion", "Code-quality feedback"],
  },
  {
    icon: BarChart3,
    title: "Progress intelligence",
    description: "Turn repeated practice into a measurable improvement loop with scores, trends, streaks, and skill-level signals.",
    details: ["Score trends", "Skill breakdowns", "ELO-based progression"],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <MarketingNav />
      <main className="min-h-screen bg-[#08080c] pt-28 text-white">
        <section className="border-b border-white/7 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-3 py-1.5 text-xs font-medium text-indigo-300">
              <Target className="h-3.5 w-3.5" /> Built for deliberate practice
            </div>
            <h1 className="text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              One interview workspace. Every skill that matters.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#9b9bab] sm:text-lg">
              PrepWithAI combines realistic interview simulation, communication practice, technical feedback, company context, and measurable progress in one focused product.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/4 px-5 py-3 text-sm font-semibold text-[#d7d7df] transition hover:bg-white/7"
              >
                Compare plans
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-white/7 bg-[#111116] p-6 transition hover:-translate-y-1 hover:border-indigo-500/25"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                      <Icon className="h-5 w-5 text-indigo-300" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">{feature.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-[#9696a6]">{feature.description}</p>
                    <div className="mt-5 space-y-2.5">
                      {feature.details.map((detail) => (
                        <div key={detail} className="flex items-center gap-2 text-sm text-[#b6b6c2]">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/7 bg-white/[0.02] px-5 py-20 sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">How access works</div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Start free. Upgrade when deeper practice becomes valuable.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#9292a2]">
                The Free plan is designed for consistent core practice. Pro unlocks unlimited sessions, premium interview tracks, voice and video modes, company packs, deeper analytics, and personalized preparation.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#111116] p-6">
              <div className="text-sm font-semibold text-white">A better preparation loop</div>
              <div className="mt-5 space-y-4 text-sm text-[#a6a6b4]">
                {[
                  "Choose the skill or interview environment you need to improve.",
                  "Practice under realistic constraints and explain your thinking.",
                  "Review specific feedback instead of a generic score.",
                  "Repeat with a focused improvement target.",
                ].map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/12 text-xs font-semibold text-indigo-300">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 text-center sm:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-transparent px-6 py-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Practice with a system, not random questions.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#9b9bab] sm:text-base">
              Create a free account and start building a repeatable interview-preparation habit. Upgrade only when you need the full Pro workspace.
            </p>
            <Link
              href="/signup"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#17171d] transition hover:bg-[#eeeeF4]"
            >
              Create free account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
