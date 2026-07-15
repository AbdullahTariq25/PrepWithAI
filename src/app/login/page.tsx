"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Brain, Check, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const benefits = [
  "Resume your interview history and progress",
  "Practice voice, coding, behavioral, and system-design interviews",
  "Review AI feedback and target the next weak spot",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("We could not sign you in with those credentials.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08080c] px-4 py-8 text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-280px] h-[620px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13]/95 shadow-[0_40px_120px_rgba(0,0,0,0.5)] lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden border-r border-white/10 bg-gradient-to-br from-indigo-500/[0.09] via-transparent to-violet-500/[0.08] p-10 lg:flex lg:flex-col lg:justify-between">
            <Link href="/" className="inline-flex items-center gap-2.5 self-start">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_0_28px_rgba(99,102,241,0.3)]">
                <Brain className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold tracking-[-0.02em]">
                Prep<span className="text-indigo-300">WithAI</span>
              </span>
            </Link>

            <div className="py-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Welcome back</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white">
                Pick up where your last practice session ended.
              </h1>
              <p className="mt-5 text-sm leading-6 text-zinc-400">
                Your next interview should feel familiar because you have already practiced the pressure, the reasoning, and the communication.
              </p>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <Check className="h-3 w-3" />
                    </span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-zinc-600">Practice with intent. Improve with evidence.</p>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <Link href="/" className="mb-10 inline-flex items-center gap-2.5 lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                <Brain className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold tracking-[-0.02em]">
                Prep<span className="text-indigo-300">WithAI</span>
              </span>
            </Link>

            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Account access</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Sign in to continue</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Use the email and password connected to your PrepWithAI account.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {error && (
                  <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-zinc-400">Email address</span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-zinc-400">Password</span>
                  <span className="relative block">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-zinc-500">
                New to PrepWithAI?{" "}
                <Link href="/signup" className="font-medium text-indigo-300 hover:text-indigo-200">
                  Create an account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
