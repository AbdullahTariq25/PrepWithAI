"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Code2,
  CreditCard,
  Database,
  Loader2,
  Mail,
  Mic,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ReadinessResponse {
  ready: boolean;
  latencyMs: number;
  critical: {
    authentication: { ready: boolean; mode: string };
    database: { ready: boolean };
    aiInterview: { ready: boolean };
  };
  optional: {
    codeExecution: { ready: boolean };
    transactionalEmail: { ready: boolean };
    payments: { ready: boolean };
  };
  deployment: { environment: string; version: string };
  error?: string;
}

type DeviceState = "unchecked" | "ready" | "blocked" | "unsupported";

function StatusPill({ ready, optional = false }: { ready: boolean; optional?: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        ready
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
          : optional
            ? "border-white/10 bg-white/5 text-[#858596]"
            : "border-red-400/20 bg-red-400/10 text-red-200"
      }`}
    >
      {ready ? "Ready" : optional ? "Not configured" : "Needs attention"}
    </span>
  );
}

function DevicePill({ state }: { state: DeviceState }) {
  const labels: Record<DeviceState, string> = {
    unchecked: "Not checked",
    ready: "Ready",
    blocked: "Blocked",
    unsupported: "Unsupported",
  };
  const styles: Record<DeviceState, string> = {
    unchecked: "border-white/10 bg-white/5 text-[#858596]",
    ready: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    blocked: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    unsupported: "border-red-400/20 bg-red-400/10 text-red-200",
  };

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${styles[state]}`}>{labels[state]}</span>;
}

export default function ReadinessPage() {
  const [server, setServer] = useState<ReadinessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingDevices, setCheckingDevices] = useState(false);
  const [error, setError] = useState("");
  const [microphone, setMicrophone] = useState<DeviceState>("unchecked");
  const [camera, setCamera] = useState<DeviceState>("unchecked");
  const [secureContext, setSecureContext] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(false);

  const loadServerReadiness = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/readiness", { cache: "no-store" });
      const data = (await response.json()) as ReadinessResponse;
      if (!response.ok) throw new Error(data.error || "Unable to check server readiness");
      setServer(data);
    } catch (readinessError) {
      setError(
        readinessError instanceof Error
          ? readinessError.message
          : "Unable to check server readiness",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSecureContext(window.isSecureContext);
    setSpeechRecognition(
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window,
    );
    void loadServerReadiness();
  }, [loadServerReadiness]);

  async function checkMedia(kind: "audio" | "video"): Promise<DeviceState> {
    if (!navigator.mediaDevices?.getUserMedia) return "unsupported";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: kind === "audio",
        video: kind === "video",
      });
      stream.getTracks().forEach((track) => track.stop());
      return "ready";
    } catch {
      return "blocked";
    }
  }

  async function runDeviceCheck() {
    setCheckingDevices(true);
    const [micState, cameraState] = await Promise.all([
      checkMedia("audio"),
      checkMedia("video"),
    ]);
    setMicrophone(micState);
    setCamera(cameraState);
    setCheckingDevices(false);
  }

  const serverChecks = server
    ? [
        {
          label: "Authentication",
          detail: `Session signing: ${server.critical.authentication.mode}`,
          icon: ShieldCheck,
          ready: server.critical.authentication.ready,
        },
        {
          label: "Database",
          detail: `MongoDB responded in the ${server.latencyMs} ms readiness cycle`,
          icon: Database,
          ready: server.critical.database.ready,
        },
        {
          label: "AI interviewer",
          detail: "Interview generation and final evaluation provider",
          icon: Sparkles,
          ready: server.critical.aiInterview.ready,
        },
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl space-y-7 page-enter">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Pre-interview diagnostics
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Readiness Center</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#858596]">
            Verify the core platform and your browser devices before starting a timed voice or video interview.
          </p>
        </div>
        <button
          onClick={() => void loadServerReadiness()}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/9 bg-white/5 px-4 text-sm text-[#b8b8c5] hover:bg-white/8 hover:text-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Recheck platform
        </button>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/8 p-4 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div
        className={`rounded-[28px] border p-6 sm:p-7 ${
          server?.ready
            ? "border-emerald-400/20 bg-emerald-400/[0.06]"
            : "border-amber-400/20 bg-amber-400/[0.05]"
        }`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${server?.ready ? "bg-emerald-400/12 text-emerald-300" : "bg-amber-400/12 text-amber-300"}`}>
              {server?.ready ? <CheckCircle2 className="h-6 w-6" /> : <Activity className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {loading ? "Checking core services…" : server?.ready ? "Core interview services are ready" : "Core services need attention"}
              </h2>
              <p className="mt-1 text-sm text-[#8b8b9c]">
                Build {server?.deployment.version || "—"} · {server?.deployment.environment || "unknown"}
              </p>
            </div>
          </div>
          {server?.ready && (
            <Link
              href="/interview"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
            >
              Start an interview
            </Link>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Core platform</h2>
          <p className="mt-1 text-sm text-[#747486]">These services are required for a reliable AI interview session.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {serverChecks.map((check) => {
            const Icon = check.icon;
            return (
              <div key={check.label} className="rounded-2xl border border-white/8 bg-[#101016] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/8 text-cyan-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <StatusPill ready={check.ready} />
                </div>
                <h3 className="mt-4 font-medium">{check.label}</h3>
                <p className="mt-1 text-xs leading-5 text-[#747486]">{check.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Browser and devices</h2>
            <p className="mt-1 text-sm text-[#747486]">Permissions are tested locally in your browser and media tracks are stopped immediately.</p>
          </div>
          <button
            onClick={() => void runDeviceCheck()}
            disabled={checkingDevices}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {checkingDevices ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
            Run device check
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/8 bg-[#101016] p-4">
            <div className="flex items-center justify-between"><ShieldCheck className="h-4 w-4 text-cyan-300" /><StatusPill ready={secureContext} /></div>
            <div className="mt-3 text-sm font-medium">Secure browser context</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#101016] p-4">
            <div className="flex items-center justify-between"><Mic className="h-4 w-4 text-cyan-300" /><DevicePill state={microphone} /></div>
            <div className="mt-3 text-sm font-medium">Microphone</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#101016] p-4">
            <div className="flex items-center justify-between"><Camera className="h-4 w-4 text-cyan-300" /><DevicePill state={camera} /></div>
            <div className="mt-3 text-sm font-medium">Camera</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#101016] p-4">
            <div className="flex items-center justify-between"><Activity className="h-4 w-4 text-cyan-300" /><StatusPill ready={speechRecognition} optional /></div>
            <div className="mt-3 text-sm font-medium">Speech recognition</div>
          </div>
        </div>
      </section>

      {server && (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Optional integrations</h2>
            <p className="mt-1 text-sm text-[#747486]">These expand the product but do not block text-based interview practice.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: "Code execution", icon: Code2, ready: server.optional.codeExecution.ready },
              { label: "Transactional email", icon: Mail, ready: server.optional.transactionalEmail.ready },
              { label: "Payments", icon: CreditCard, ready: server.optional.payments.ready },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#101016] p-4">
                  <div className="flex items-center gap-3"><Icon className="h-4 w-4 text-[#858596]" /><span className="text-sm">{item.label}</span></div>
                  <StatusPill ready={item.ready} optional />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
