const faqs = [
  {
    question: "What can I practice with PrepWithAI?",
    answer: "You can practice technical, coding, behavioral, frontend, backend, system-design, and role-specific interviews. The experience can include voice, video, written answers, and coding depending on the interview mode.",
  },
  {
    question: "Is the feedback generic?",
    answer: "The product is designed to evaluate the answer you actually gave. Feedback focuses on technical accuracy, reasoning, communication, completeness, and the most useful next improvement instead of only showing a model answer.",
  },
  {
    question: "Can I prepare for a specific company or seniority level?",
    answer: "Yes. PrepWithAI supports company-focused preparation and different role expectations so a junior frontend interview does not feel like a senior systems interview.",
  },
  {
    question: "Do I need a credit card to start?",
    answer: "No. You can create an account and begin with the free experience before deciding whether the paid plan is useful for your preparation.",
  },
  {
    question: "Is this a replacement for human interviewers?",
    answer: "No. It is a high-frequency practice environment. Use it to get more repetitions, identify weak patterns, and arrive better prepared for mock interviews with mentors, peers, or recruiters.",
  },
];

export default function FAQ() {
  return (
    <section className="border-t border-white/[0.06] bg-[#08080c] px-4 py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Frequently asked</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Clear answers before you start.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
            The product should feel simple from the first session: choose the interview, practice, review the evidence, and improve.
          </p>
        </div>

        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-white marker:content-none">
                {faq.question}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-500 transition group-open:rotate-45 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pr-10 text-sm leading-6 text-zinc-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
