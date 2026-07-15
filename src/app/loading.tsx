export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080c] px-4 text-white">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_0_40px_rgba(99,102,241,0.25)]" />
        <div className="mx-auto mt-7 h-3 w-32 animate-pulse rounded-full bg-white/8" />
        <div className="mx-auto mt-3 h-3 w-52 animate-pulse rounded-full bg-white/5" />
        <p className="mt-6 text-sm text-[#686879]">Preparing your workspace…</p>
      </div>
    </main>
  );
}
