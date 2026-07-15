"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080c] px-4 py-16 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/8 bg-[#111116] p-7 text-center shadow-2xl sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/8">
          <AlertTriangle className="h-6 w-6 text-amber-300" />
        </div>
        <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
          Something interrupted this screen
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Your progress is still yours. Let&apos;s recover the page.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#858596]">
          Retry the request first. If the problem continues, return to your dashboard and start from a stable screen.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 font-mono text-[11px] text-[#555566]">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
