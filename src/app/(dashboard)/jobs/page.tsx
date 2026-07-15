"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Archive,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type JobStatus = "saved" | "applied" | "interview" | "offer" | "rejected" | "archived";

interface JobTarget {
  _id: string;
  company: string;
  role: string;
  location: string;
  url?: string;
  status: JobStatus;
  jobDescription: string;
  notes: string;
  nextAction: string;
  nextActionAt?: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions: Array<{ value: JobStatus; label: string }> = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

const statusStyle: Record<JobStatus, string> = {
  saved: "border-white/10 bg-white/5 text-[#a4a4b3]",
  applied: "border-blue-400/20 bg-blue-400/10 text-blue-200",
  interview: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  offer: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  rejected: "border-red-400/20 bg-red-400/10 text-red-200",
  archived: "border-zinc-400/15 bg-zinc-400/5 text-zinc-400",
};

const initialForm = {
  company: "",
  role: "",
  location: "",
  url: "",
  status: "saved" as JobStatus,
  nextAction: "",
  nextActionAt: "",
  jobDescription: "",
  notes: "",
};

function formatDate(value?: string) {
  if (!value) return "No follow-up date";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobTarget[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<"active" | JobStatus>("active");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filter !== "active") params.set("status", filter);
      const response = await fetch(`/api/jobs?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load job pipeline");
      setJobs(data.jobs || []);
      setCounts(data.counts || {});
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load job pipeline");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  async function createJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nextActionAt: form.nextActionAt || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save job target");
      setForm(initialForm);
      setShowForm(false);
      setFilter("active");
      await loadJobs();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save job target");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: JobStatus) {
    setError("");
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update status");
      await loadJobs();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update status");
    }
  }

  async function deleteJob(id: string) {
    if (!window.confirm("Delete this job target from your pipeline?")) return;
    setError("");
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to delete job target");
      await loadJobs();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete job target");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7 page-enter">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Career execution</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Job target pipeline</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#858596]">
            Track real opportunities you choose. PrepWithAI does not invent job listings, posting dates, salary data, or match percentages.
          </p>
        </div>
        <button
          onClick={() => setShowForm((value) => !value)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Close form" : "Add job target"}
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Saved", value: counts.saved || 0 },
          { label: "Applied", value: counts.applied || 0 },
          { label: "Interviews", value: counts.interview || 0 },
          { label: "Offers", value: counts.offer || 0 },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/8 bg-[#101016] p-4">
            <div className="text-xs text-[#747486]">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">{item.value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={createJob} className="rounded-[28px] border border-blue-400/15 bg-blue-400/[0.04] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-400/10 text-blue-300"><BriefcaseBusiness className="h-5 w-5" /></div>
            <div><h2 className="font-semibold">Add a real opportunity</h2><p className="mt-1 text-xs text-[#777789]">Save the source URL and your next action so the pipeline remains actionable.</p></div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-xs text-[#8d8d9d]">Company *</span><input required value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className="h-11 w-full rounded-xl border border-white/9 bg-black/20 px-3 text-sm outline-none focus:border-blue-400/40" placeholder="Company name" /></label>
            <label className="block"><span className="mb-2 block text-xs text-[#8d8d9d]">Role *</span><input required value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className="h-11 w-full rounded-xl border border-white/9 bg-black/20 px-3 text-sm outline-none focus:border-blue-400/40" placeholder="Software Engineer" /></label>
            <label className="block"><span className="mb-2 block text-xs text-[#8d8d9d]">Location</span><input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="h-11 w-full rounded-xl border border-white/9 bg-black/20 px-3 text-sm outline-none focus:border-blue-400/40" placeholder="Lahore, Remote, London…" /></label>
            <label className="block"><span className="mb-2 block text-xs text-[#8d8d9d]">Source URL</span><input type="url" value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} className="h-11 w-full rounded-xl border border-white/9 bg-black/20 px-3 text-sm outline-none focus:border-blue-400/40" placeholder="https://…" /></label>
            <label className="block"><span className="mb-2 block text-xs text-[#8d8d9d]">Status</span><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as JobStatus }))} className="h-11 w-full rounded-xl border border-white/9 bg-[#0b0b10] px-3 text-sm outline-none focus:border-blue-400/40">{statusOptions.filter((option) => option.value !== "archived").map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="block"><span className="mb-2 block text-xs text-[#8d8d9d]">Follow-up date</span><input type="datetime-local" value={form.nextActionAt} onChange={(event) => setForm((current) => ({ ...current, nextActionAt: event.target.value }))} className="h-11 w-full rounded-xl border border-white/9 bg-black/20 px-3 text-sm outline-none focus:border-blue-400/40" /></label>
          </div>

          <label className="mt-4 block"><span className="mb-2 block text-xs text-[#8d8d9d]">Next action</span><input value={form.nextAction} onChange={(event) => setForm((current) => ({ ...current, nextAction: event.target.value }))} className="h-11 w-full rounded-xl border border-white/9 bg-black/20 px-3 text-sm outline-none focus:border-blue-400/40" placeholder="Apply, follow up, prepare system design round…" /></label>
          <label className="mt-4 block"><span className="mb-2 block text-xs text-[#8d8d9d]">Job description</span><textarea value={form.jobDescription} onChange={(event) => setForm((current) => ({ ...current, jobDescription: event.target.value.slice(0, 12_000) }))} className="min-h-28 w-full rounded-xl border border-white/9 bg-black/20 px-3 py-3 text-sm leading-6 outline-none focus:border-blue-400/40" placeholder="Paste the role description for future preparation context." /></label>
          <label className="mt-4 block"><span className="mb-2 block text-xs text-[#8d8d9d]">Notes</span><textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value.slice(0, 5_000) }))} className="min-h-20 w-full rounded-xl border border-white/9 bg-black/20 px-3 py-3 text-sm leading-6 outline-none focus:border-blue-400/40" placeholder="Recruiter name, referral, interview notes…" /></label>

          <button type="submit" disabled={saving} className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-400 px-5 text-sm font-semibold text-slate-950 hover:bg-blue-300 disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Save opportunity</button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("active")} className={`rounded-full border px-3 py-1.5 text-xs ${filter === "active" ? "border-blue-400/30 bg-blue-400/10 text-blue-200" : "border-white/8 bg-white/4 text-[#858596]"}`}>Active</button>
        {statusOptions.map((option) => (
          <button key={option.value} onClick={() => setFilter(option.value)} className={`rounded-full border px-3 py-1.5 text-xs ${filter === option.value ? statusStyle[option.value] : "border-white/8 bg-white/4 text-[#858596]"}`}>{option.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid min-h-72 place-items-center rounded-2xl border border-white/8 bg-[#101016]"><Loader2 className="h-6 w-6 animate-spin text-blue-300" /></div>
      ) : jobs.length === 0 ? (
        <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-white/10 bg-[#0e0e13] p-8 text-center">
          <div className="max-w-md"><BriefcaseBusiness className="mx-auto h-8 w-8 text-[#5f5f70]" /><h2 className="mt-4 text-lg font-semibold">No job targets in this view</h2><p className="mt-2 text-sm leading-6 text-[#777789]">Add opportunities you are genuinely considering, then keep the next action and status current.</p></div>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <article key={job._id} className="rounded-2xl border border-white/8 bg-[#101016] p-5 transition hover:border-white/12">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{job.role}</h2>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyle[job.status]}`}>{statusOptions.find((option) => option.value === job.status)?.label}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#9a9aaa]">{job.company}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#6f6f80]">
                    {job.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>}
                    <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" />{job.nextAction ? `${job.nextAction} · ${formatDate(job.nextActionAt)}` : formatDate(job.nextActionAt)}</span>
                  </div>
                  {job.notes && <p className="mt-4 max-w-3xl text-sm leading-6 text-[#858596]">{job.notes}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select value={job.status} onChange={(event) => void updateStatus(job._id, event.target.value as JobStatus)} className="h-10 rounded-xl border border-white/9 bg-[#0b0b10] px-3 text-xs outline-none">
                    {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  {job.url && <a href={job.url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/9 bg-white/5 px-3 text-xs text-[#b5b5c2] hover:bg-white/8 hover:text-white">Open source <ExternalLink className="h-3.5 w-3.5" /></a>}
                  <button onClick={() => void updateStatus(job._id, "archived")} className="grid h-10 w-10 place-items-center rounded-xl border border-white/9 bg-white/5 text-[#777789] hover:text-white" aria-label="Archive job"><Archive className="h-4 w-4" /></button>
                  <button onClick={() => void deleteJob(job._id)} className="grid h-10 w-10 place-items-center rounded-xl border border-red-400/15 bg-red-400/5 text-red-300 hover:bg-red-400/10" aria-label="Delete job"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {job.status === "offer" && <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/6 px-3 py-2 text-xs text-emerald-200"><CheckCircle2 className="h-4 w-4" />Offer stage reached. Record the decision factors and negotiation notes before closing the opportunity.</div>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
