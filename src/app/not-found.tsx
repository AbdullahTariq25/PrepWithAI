import Link from "next/link";
import { ArrowLeft, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080c] px-4 py-16 text-white">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
          <Compass className="h-6 w-6 text-indigo-300" />
        </div>
        <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          404 · Route not found
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          This path is not part of your preparation plan.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#858596] sm:text-base">
          The link may be outdated or the page may have moved. Return to the product or explore the public demo.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
          >
            <Home className="h-4 w-4" /> Go home
          </Link>
          <Link
            href="/demo"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06]"
          >
            <ArrowLeft className="h-4 w-4" /> Explore the demo
          </Link>
        </div>
      </div>
    </main>
  );
}
