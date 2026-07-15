import { Scale } from "lucide-react";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

const sections = [
  {
    title: "1. Eligibility and account use",
    body: [
      "You must be at least 13 years old to use PrepWithAI. You are responsible for the activity performed through your account and for keeping your credentials secure.",
      "You may not use the service to violate applicable law, interfere with the service, attempt unauthorized access, abuse rate limits, or disrupt other users.",
    ],
  },
  {
    title: "2. Nature of the service",
    body: [
      "PrepWithAI is an interview-practice and career-preparation product. It does not guarantee employment, compensation, admission, promotion, or any other career outcome.",
      "AI-generated questions, feedback, summaries, estimates, and recommendations may be incomplete or inaccurate. Important decisions should be checked against your own judgment and appropriate professional or primary sources.",
    ],
  },
  {
    title: "3. Your content and data",
    body: [
      "You retain ownership of the resumes, code, messages, interview responses, and other content you submit. You grant PrepWithAI the limited rights required to process that content and provide the requested product functionality.",
      "You are responsible for ensuring that content you upload does not violate another party's rights or contain information you are not authorized to provide.",
    ],
  },
  {
    title: "4. Plans, trials, and payments",
    body: [
      "PrepWithAI may offer Free, Pro, Team, Enterprise, trial, promotional, or other access levels. Features, limits, and prices may change as the product evolves, subject to applicable law and any commitments made at the time of purchase.",
      "Paid checkout and subscription management are processed through Stripe when billing is configured. PrepWithAI does not directly store complete payment-card details.",
      "A promotional or free trial may be limited to one use per account. Attempting to repeatedly obtain trial access through duplicate or abusive accounts may result in restriction or suspension.",
    ],
  },
  {
    title: "5. Cancellation and termination",
    body: [
      "You may stop using the service and delete your account through the available account controls. Paid subscription cancellation is subject to the billing options made available through the product and payment provider.",
      "We may restrict or terminate access when reasonably necessary to address fraud, abuse, security risks, legal requirements, or material violations of these terms.",
    ],
  },
  {
    title: "6. Availability and changes",
    body: [
      "The service may change, experience interruptions, or contain defects. We may add, remove, or modify features as we improve the product. We do not promise that every feature will always remain available in the same form.",
    ],
  },
  {
    title: "7. Limitation of responsibility",
    body: [
      "To the maximum extent permitted by applicable law, PrepWithAI is provided on an as-available basis. You remain responsible for how you use generated content and for verifying information before relying on it in high-impact situations.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <MarketingNav />
      <main className="min-h-screen bg-[#08080c] pt-28 text-white">
        <section className="border-b border-white/7 px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/8 px-3 py-1.5 text-xs font-medium text-rose-300">
              <Scale className="h-3.5 w-3.5" /> Legal
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Terms of Service</h1>
            <p className="mt-4 text-sm text-[#858596]">Last updated: July 15, 2026</p>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#9494a4]">
              These terms describe the rules for using PrepWithAI. By accessing or using the service, you agree to these terms.
            </p>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl space-y-5">
            {sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-white/7 bg-[#111116] p-6 sm:p-7">
                <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-[#9a9aaa]">{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}

            <article className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.05] p-6 sm:p-7">
              <h2 className="text-xl font-semibold">8. Contact</h2>
              <p className="mt-4 text-sm leading-7 text-[#9a9aaa]">
                Questions about these terms may be sent to <a href="mailto:legal@prepwithai.com" className="font-medium text-indigo-300 hover:text-indigo-200">legal@prepwithai.com</a>.
              </p>
            </article>

            <p className="pt-4 text-xs leading-6 text-[#666678]">
              This page is product terms text, not jurisdiction-specific legal advice. The operator should obtain qualified legal review before relying on these terms for a major commercial launch or a specific regulatory market.
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
