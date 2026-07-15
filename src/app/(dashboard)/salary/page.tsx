"use client";

import { FormEvent, useMemo, useState } from "react";
import { Calculator, Check, Copy, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const locations = {
  Lahore: 1,
  Karachi: 1.08,
  Islamabad: 1.1,
  "Remote - International": 3.2,
} as const;

const companyMultipliers = {
  Startup: 0.9,
  Medium: 1,
  Large: 1.18,
  Enterprise: 1.35,
} as const;

const negotiationScripts = [
  {
    title: "The offer is below your target",
    text: "Thank you for the offer. Based on the scope of the role, the market range, and the value I can bring, I was targeting a higher range. Is there flexibility in the base compensation or the overall package?",
  },
  {
    title: "They ask for your expectation first",
    text: "I am focused on the responsibilities and the full package, but based on the market for comparable roles I am targeting a competitive range. I would be happy to discuss a number once I understand the complete scope and benefits.",
  },
  {
    title: "You are responding to a counteroffer",
    text: "I appreciate the movement and I am genuinely excited about the role. If we can close the remaining gap in the package, I would feel comfortable moving forward. What flexibility is still available?",
  },
];

export default function SalaryPage() {
  const [role, setRole] = useState("Full Stack Developer");
  const [experience, setExperience] = useState(3);
  const [location, setLocation] = useState<keyof typeof locations>("Lahore");
  const [companySize, setCompanySize] = useState<keyof typeof companyMultipliers>("Medium");
  const [calculated, setCalculated] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const estimate = useMemo(() => {
    const experienceBase = 85_000 + experience * 34_000;
    const roleMultiplier = /senior|lead|staff|principal/i.test(role) ? 1.35 : /junior|intern/i.test(role) ? 0.72 : 1;
    const midpoint = Math.round(
      experienceBase * locations[location] * companyMultipliers[companySize] * roleMultiplier,
    );
    return {
      low: Math.round(midpoint * 0.78 / 5_000) * 5_000,
      midpoint: Math.round(midpoint / 5_000) * 5_000,
      high: Math.round(midpoint * 1.28 / 5_000) * 5_000,
    };
  }, [companySize, experience, location, role]);

  function calculate(event: FormEvent) {
    event.preventDefault();
    setCalculated(true);
  }

  async function copyScript(index: number, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 page-enter">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 text-xs font-medium text-emerald-300">
          <TrendingUp className="h-3.5 w-3.5" /> Negotiation preparation
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Prepare for the compensation conversation.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#9090a0] sm:text-base">
          Use a directional estimate to frame your research, then rehearse calm, evidence-based language before the real negotiation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Calculator className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-semibold">Directional salary estimate</h2>
              <p className="mt-1 text-xs text-[#727284]">A planning aid, not verified market compensation data.</p>
            </div>
          </div>

          <form onSubmit={calculate} className="mt-6 space-y-5">
            <div>
              <label htmlFor="salary-role" className="mb-1.5 block text-sm font-medium">Role title</label>
              <Input id="salary-role" value={role} onChange={(event) => setRole(event.target.value)} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-medium">
                <label htmlFor="salary-experience">Years of experience</label>
                <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-[#c6c6d0]">{experience} years</span>
              </div>
              <input
                id="salary-experience"
                type="range"
                min="0"
                max="20"
                value={experience}
                onChange={(event) => setExperience(Number(event.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            <div>
              <label htmlFor="salary-location" className="mb-1.5 block text-sm font-medium">Location context</label>
              <select
                id="salary-location"
                value={location}
                onChange={(event) => setLocation(event.target.value as keyof typeof locations)}
                className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/40"
              >
                {Object.keys(locations).map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="salary-company" className="mb-1.5 block text-sm font-medium">Company size</label>
              <select
                id="salary-company"
                value={companySize}
                onChange={(event) => setCompanySize(event.target.value as keyof typeof companyMultipliers)}
                className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/40"
              >
                {Object.keys(companyMultipliers).map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500">Calculate planning range</Button>
          </form>

          {calculated && (
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">Planning range</div>
              <div className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                PKR {estimate.low.toLocaleString()} – {estimate.high.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-[#9d9daa]">Directional midpoint: PKR {estimate.midpoint.toLocaleString()} per month.</div>
              <p className="mt-4 text-xs leading-5 text-[#737385]">
                This estimate is generated from a simple product heuristic, not live compensation data. Validate your target with current job postings, recruiter conversations, public salary sources, benefits, equity, and the exact responsibilities of the role.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
              <MessageSquare className="h-5 w-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="font-semibold">Negotiation language</h2>
              <p className="mt-1 text-xs text-[#727284]">Use the structure, then adapt the wording to your real situation.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {negotiationScripts.map((script, index) => (
              <article key={script.title} className="rounded-2xl border border-white/7 bg-black/15 p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-[#e6e6ed]">{script.title}</h3>
                  <button
                    type="button"
                    onClick={() => void copyScript(index, script.text)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/8 bg-white/5 px-2.5 py-1.5 text-xs text-[#9b9bab] transition hover:bg-white/8 hover:text-white"
                  >
                    {copied === index ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === index ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#a1a1af]">{script.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.06] p-5">
            <div className="text-sm font-semibold text-indigo-200">A stronger negotiation sequence</div>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[#9b9baa]">
              <li><strong className="text-white">1.</strong> Show genuine interest before discussing the gap.</li>
              <li><strong className="text-white">2.</strong> Anchor your request in scope, market evidence, and value.</li>
              <li><strong className="text-white">3.</strong> Negotiate the full package, not only base salary.</li>
              <li><strong className="text-white">4.</strong> Pause after making the request and let the employer respond.</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
