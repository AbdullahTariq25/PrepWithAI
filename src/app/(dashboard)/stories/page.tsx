"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  Check,
  Clipboard,
  Loader2,
  MessageSquareText,
  Plus,
  Save,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";

interface StoryEvaluation {
  overallScore: number;
  specificity: number;
  ownership: number;
  impact: number;
  reflection: number;
  structure: number;
  summary: string;
  improvements: string[];
  evaluatedAt: string;
}

interface Story {
  _id: string;
  title: string;
  competency: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  reflection: string;
  metrics: string;
  tags: string[];
  status: "draft" | "ready";
  evaluation?: StoryEvaluation;
  updatedAt: string;
}

interface StoryForm {
  title: string;
  competency: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  reflection: string;
  metrics: string;
  tags: string;
  status: "draft" | "ready";
}

const competencies = [
  "Leadership",
  "Ownership",
  "Conflict resolution",
  "Failure and learning",
  "Ambiguity",
  "Collaboration",
  "Customer focus",
  "Technical judgment",
  "Execution",
  "Influence",
];

const emptyForm: StoryForm = {
  title: "",
  competency: "Leadership",
  situation: "",
  task: "",
  action: "",
  result: "",
  reflection: "",
  metrics: "",
  tags: "",
  status: "draft",
};

function storyToForm(story: Story): StoryForm {
  return {
    title: story.title,
    competency: story.competency,
    situation: story.situation,
    task: story.task,
    action: story.action,
    result: story.result,
    reflection: story.reflection,
    metrics: story.metrics,
    tags: story.tags.join(", "),
    status: story.status,
  };
}

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-300";
  if (score >= 65) return "text-amber-300";
  return "text-rose-300";
}

export default function StoryBankPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [form, setForm] = useState<StoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadStories = useCallback(async () => {
    try {
      const response = await fetch("/api/stories", { cache: "no-store" });
      const data = (await response.json()) as { stories?: Story[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to load stories");
      setStories(data.stories || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load stories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStories();
  }, [loadStories]);

  const completion = useMemo(() => {
    const fields = [form.situation, form.task, form.action, form.result, form.reflection];
    return Math.round((fields.filter((value) => value.trim().length >= 40).length / fields.length) * 100);
  }, [form]);

  const readyStories = stories.filter((story) => story.status === "ready").length;
  const evaluatedStories = stories.filter((story) => Boolean(story.evaluation)).length;
  const averageScore = evaluatedStories
    ? Math.round(
        stories.reduce((sum, story) => sum + (story.evaluation?.overallScore || 0), 0) /
          evaluatedStories,
      )
    : 0;

  function updateField<K extends keyof StoryForm>(field: K, value: StoryForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  function editStory(story: Story) {
    setEditingId(story._id);
    setForm(storyToForm(story));
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveStory(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(editingId ? `/api/stories/${editingId}` : "/api/stories", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });
      const data = (await response.json()) as { story?: Story; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to save story");

      setMessage(editingId ? "Story updated." : "Story added to your bank.");
      resetForm();
      await loadStories();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save story");
    } finally {
      setSaving(false);
    }
  }

  async function evaluateStory(id: string) {
    setEvaluatingId(id);
    setMessage("");
    try {
      const response = await fetch(`/api/stories/${id}/evaluate`, { method: "POST" });
      const data = (await response.json()) as { story?: Story; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to evaluate story");
      setMessage("Evidence-based story evaluation completed.");
      await loadStories();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to evaluate story");
    } finally {
      setEvaluatingId(null);
    }
  }

  async function deleteStory(id: string) {
    if (!window.confirm("Delete this story permanently?")) return;
    try {
      const response = await fetch(`/api/stories/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to delete story");
      if (editingId === id) resetForm();
      await loadStories();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete story");
    }
  }

  async function copyStory(story: Story) {
    const text = [
      `Situation: ${story.situation}`,
      `Task: ${story.task}`,
      `Action: ${story.action}`,
      `Result: ${story.result}`,
      story.reflection ? `Reflection: ${story.reflection}` : "",
      story.metrics ? `Evidence: ${story.metrics}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopiedId(story._id);
    window.setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7 page-enter">
      <section className="relative overflow-hidden rounded-[28px] border border-violet-400/15 bg-[#0d0d13] p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-violet-500/15 blur-[110px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/8 px-3 py-1.5 text-xs font-medium text-violet-200">
              <MessageSquareText className="h-3.5 w-3.5" /> Behavioral interview intelligence
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
              Build a reusable bank of stories that prove how you work.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9696a6] sm:text-base">
              Capture real examples once, improve the evidence, and reuse them across leadership, ownership, conflict, failure, and impact questions without memorizing robotic scripts.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Stories", stories.length],
              ["Interview ready", readyStories],
              ["Average quality", averageScore ? `${averageScore}%` : "—"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-black/20 p-4 text-center">
                <div className="text-2xl font-bold tabular-nums text-white">{value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#676779]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {message && (
        <div className="rounded-xl border border-indigo-400/15 bg-indigo-400/[0.06] px-4 py-3 text-sm text-indigo-100">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <form onSubmit={saveStory} className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
                {editingId ? "Edit story" : "New story"}
              </div>
              <h2 className="mt-2 text-xl font-semibold">Write the evidence before polishing the wording.</h2>
            </div>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-xs text-[#858596] hover:text-white">
                Cancel edit
              </button>
            )}
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-[#777789]">
              <span>Story completeness</span>
              <span className="font-mono">{completion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/6">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Story title</span>
              <input
                required
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Recovered a delayed client launch"
                className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm outline-none transition focus:border-violet-400/40"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Competency</span>
              <select
                value={form.competency}
                onChange={(event) => updateField("competency", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm outline-none focus:border-violet-400/40"
              >
                {competencies.map((competency) => <option key={competency}>{competency}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Status</span>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value as StoryForm["status"])}
                className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm outline-none focus:border-violet-400/40"
              >
                <option value="draft">Draft</option>
                <option value="ready">Interview ready</option>
              </select>
            </label>
          </div>

          {[
            ["situation", "Situation", "Give only the context the interviewer needs: team, product, constraint, and stakes."],
            ["task", "Task", "State your responsibility and what success required from you personally."],
            ["action", "Action", "Explain the decisions, trade-offs, communication, and execution you personally drove."],
            ["result", "Result", "Describe the outcome and connect it to business, user, quality, speed, or team impact."],
            ["reflection", "Reflection", "Show what you learned and what you would repeat or change next time."],
          ].map(([field, label, placeholder]) => (
            <label key={field} className="mt-4 block">
              <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">{label}</span>
              <textarea
                value={form[field as keyof StoryForm]}
                onChange={(event) => updateField(field as keyof StoryForm, event.target.value as never)}
                placeholder={placeholder}
                rows={field === "action" ? 5 : 3}
                className="w-full resize-y rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#555566] focus:border-violet-400/40"
              />
            </label>
          ))}

          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Metrics and verifiable evidence</span>
            <textarea
              value={form.metrics}
              onChange={(event) => updateField("metrics", event.target.value)}
              placeholder="Examples: reduced load time by 28%, shipped two days early, prevented three recurring incidents, supported 20,000 records."
              rows={2}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm leading-6 outline-none placeholder:text-[#555566] focus:border-violet-400/40"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Tags</span>
            <input
              value={form.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="frontend, client recovery, performance"
              className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm outline-none placeholder:text-[#555566] focus:border-violet-400/40"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save story changes" : "Add story to bank"}
          </button>
        </form>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">Your evidence library</div>
              <h2 className="mt-2 text-xl font-semibold">Stories ready for different interview questions</h2>
            </div>
            <button onClick={resetForm} className="hidden items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-[#c6c6d0] hover:bg-white/7 sm:inline-flex">
              <Plus className="h-4 w-4" /> New story
            </button>
          </div>

          {loading ? (
            <div className="grid min-h-64 place-items-center rounded-2xl border border-white/7 bg-[#111116]">
              <Loader2 className="h-6 w-6 animate-spin text-violet-300" />
            </div>
          ) : stories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#111116] p-10 text-center">
              <BrainCircuit className="mx-auto h-8 w-8 text-violet-300" />
              <h3 className="mt-4 font-semibold">Your strongest answers start as real evidence.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7f7f90]">
                Add one example from a project, client issue, team conflict, failure, or difficult decision. You can improve the structure after the facts are captured.
              </p>
            </div>
          ) : (
            stories.map((story) => (
              <article key={story._id} className="overflow-hidden rounded-2xl border border-white/7 bg-[#111116]">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${story.status === "ready" ? "border-emerald-400/20 bg-emerald-400/8 text-emerald-300" : "border-amber-400/20 bg-amber-400/8 text-amber-300"}`}>
                          {story.status === "ready" ? "Interview ready" : "Draft"}
                        </span>
                        <span className="text-xs text-[#777789]">{story.competency}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-white">{story.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8c8c9c]">{story.action || story.situation || "Add the STAR evidence to make this story useful."}</p>
                    </div>
                    {story.evaluation && (
                      <div className="rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-center">
                        <div className={`text-2xl font-bold ${scoreTone(story.evaluation.overallScore)}`}>{story.evaluation.overallScore}</div>
                        <div className="text-[9px] uppercase tracking-[0.12em] text-[#666678]">Quality</div>
                      </div>
                    )}
                  </div>

                  {story.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {story.tags.map((tag) => (
                        <span key={tag} className="rounded-lg border border-white/7 bg-white/[0.03] px-2 py-1 text-[11px] text-[#858596]">{tag}</span>
                      ))}
                    </div>
                  )}

                  {story.evaluation && (
                    <div className="mt-5 rounded-2xl border border-violet-400/15 bg-violet-400/[0.045] p-4">
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          ["Specific", story.evaluation.specificity],
                          ["Ownership", story.evaluation.ownership],
                          ["Impact", story.evaluation.impact],
                          ["Reflection", story.evaluation.reflection],
                          ["Structure", story.evaluation.structure],
                        ].map(([label, score]) => (
                          <div key={label} className="text-center">
                            <div className="text-sm font-semibold text-white">{score}</div>
                            <div className="mt-1 text-[9px] text-[#777789]">{label}</div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-xs leading-5 text-[#a0a0af]">{story.evaluation.summary}</p>
                      {story.evaluation.improvements.length > 0 && (
                        <ul className="mt-3 space-y-2 text-xs leading-5 text-[#858596]">
                          {story.evaluation.improvements.map((item) => (
                            <li key={item} className="flex gap-2"><Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300" />{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/7 pt-4">
                    <button onClick={() => editStory(story)} className="rounded-lg border border-white/8 bg-white/4 px-3 py-2 text-xs text-[#c2c2cd] hover:bg-white/7">Edit</button>
                    <button
                      onClick={() => void evaluateStory(story._id)}
                      disabled={evaluatingId === story._id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/20 bg-violet-400/8 px-3 py-2 text-xs font-medium text-violet-200 hover:bg-violet-400/12 disabled:opacity-60"
                    >
                      {evaluatingId === story._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                      Evaluate evidence
                    </button>
                    <button onClick={() => void copyStory(story)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/4 px-3 py-2 text-xs text-[#c2c2cd] hover:bg-white/7">
                      {copiedId === story._id ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Clipboard className="h-3.5 w-3.5" />}
                      {copiedId === story._id ? "Copied" : "Copy STAR"}
                    </button>
                    <button onClick={() => void deleteStory(story._id)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/8">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
