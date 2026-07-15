"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Brain, RefreshCw } from "lucide-react";

const friendlyMessages: Record<string, string> = {
  Configuration:
    "Authentication is temporarily unavailable because the deployment is missing required server configuration.",
  AccessDenied: "Access to this account was denied.",
  Verification: "This sign-in link is invalid or has expired.",
};

export default function AuthErrorPage() {
  const [code, setCode] = useState("AuthenticationError");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("error");
    if (value) setCode(value);
  }, []);

  const message =
    friendlyMessages[code] ||
    "We could not complete authentication. Your account data has not been changed.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080c] px-4 py-10 text-white">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0d0d13] p-7 shadow-2xl shadow-black/40 sm:p-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
            <Brain className="h-5 w-5" />
          </span>
          PrepWithAI
        </Link>

        <div className="mt-10 grid h-14 w-14 place-items-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
          Authentication recovery
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Sign-in could not be completed
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-400">{message}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
          >
            <RefreshCw className="h-4 w-4" /> Try sign in again
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Return home
          </Link>
        </div>

        <p className="mt-8 text-xs text-zinc-600">Reference: {code}</p>
      </div>
    </main>
  );
}
