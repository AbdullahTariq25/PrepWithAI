"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Loader2,
  Lock,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  members: number;
  maxMembers: number;
  isPublic: boolean;
  isMember: boolean;
  isOwner: boolean;
  createdBy: string;
  nextSessionAt?: string | null;
  updatedAt?: string;
}

const categories = [
  "General",
  "DSA",
  "System Design",
  "Behavioral",
  "Frontend",
  "Backend",
  "Machine Learning",
  "Leadership",
];

function formatDate(value?: string | null) {
  if (!value) return "No session scheduled";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "No session scheduled";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "General",
    maxMembers: 20,
    isPublic: true,
    tags: "",
    nextSessionAt: "",
  });

  const loadGroups = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/study-groups", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load study groups");
      setGroups(Array.isArray(data.groups) ? data.groups : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load study groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return groups;
    return groups.filter((group) =>
      [group.name, group.description, group.category, ...group.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [groups, query]);

  async function createGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreating(true);
    try {
      const response = await fetch("/api/study-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          nextSessionAt: form.nextSessionAt
            ? new Date(form.nextSessionAt).toISOString()
            : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create study group");

      setGroups((current) => [data.group, ...current]);
      setForm({
        name: "",
        description: "",
        category: "General",
        maxMembers: 20,
        isPublic: true,
        tags: "",
        nextSessionAt: "",
      });
      setShowCreate(false);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create study group");
    } finally {
      setCreating(false);
    }
  }

  async function updateMembership(group: StudyGroup) {
    if (group.isOwner) return;
    setBusyId(group.id);
    setError("");
    try {
      const action = group.isMember ? "leave" : "join";
      const response = await fetch(`/api/study-groups/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update membership");

      setGroups((current) =>
        current.map((item) =>
          item.id === group.id
            ? {
                ...item,
                isMember: action === "join",
                members: data.members,
              }
            : item,
        ),
      );
    } catch (membershipError) {
      setError(
        membershipError instanceof Error
          ? membershipError.message
          : "Unable to update membership",
      );
    } finally {
      setBusyId("");
    }
  }

  async function deleteGroup(group: StudyGroup) {
    if (!window.confirm(`Delete “${group.name}” permanently?`)) return;
    setBusyId(group.id);
    setError("");
    try {
      const response = await fetch(`/api/study-groups/${group.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to delete study group");
      setGroups((current) => current.filter((item) => item.id !== group.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete study group");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7 page-enter">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-3 py-1.5 text-xs font-medium text-indigo-300">
            <Users className="h-3.5 w-3.5" /> Peer accountability
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Study groups</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8a8a9a] sm:text-base">
            Create focused preparation groups, schedule the next practice session, and build a smaller circle around the interview skills you are working on.
          </p>
        </div>
        <Button onClick={() => setShowCreate((open) => !open)} className="gap-2">
          <Plus className="h-4 w-4" /> {showCreate ? "Close form" : "Create group"}
        </Button>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {showCreate && (
        <form onSubmit={createGroup} className="rounded-3xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-[#111116] to-[#111116] p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-[#9a9aaa]">Group name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                minLength={3}
                maxLength={80}
                required
                placeholder="Senior system design practice"
                className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-[#9a9aaa]">Category</span>
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 text-sm outline-none focus:border-indigo-400/50"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-2 block text-xs font-medium text-[#9a9aaa]">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                maxLength={500}
                rows={3}
                placeholder="What will this group practice together?"
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-[#9a9aaa]">Tags, comma separated</span>
              <input
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                placeholder="React, Performance, Senior"
                className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none focus:border-indigo-400/50"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-[#9a9aaa]">Next session, optional</span>
              <input
                type="datetime-local"
                value={form.nextSessionAt}
                onChange={(event) => setForm((current) => ({ ...current, nextSessionAt: event.target.value }))}
                className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none focus:border-indigo-400/50"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-[#9a9aaa]">Maximum members</span>
              <input
                type="number"
                min={2}
                max={100}
                value={form.maxMembers}
                onChange={(event) => setForm((current) => ({ ...current, maxMembers: Number(event.target.value) }))}
                className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none focus:border-indigo-400/50"
              />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/15 px-4 py-3">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(event) => setForm((current) => ({ ...current, isPublic: event.target.checked }))}
                className="h-4 w-4 accent-indigo-500"
              />
              <span>
                <span className="block text-sm font-medium">Public group</span>
                <span className="block text-xs text-[#707081]">Visible and joinable by other authenticated members.</span>
              </span>
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={creating || form.name.trim().length < 3} className="gap-2">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create study group
            </Button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-white/7 bg-[#111116] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#606073]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search groups, categories, or tags"
            className="h-11 w-full rounded-xl border border-white/8 bg-black/20 pl-10 pr-4 text-sm outline-none focus:border-indigo-400/40"
          />
        </div>
        <div className="text-xs text-[#666678]">
          {filteredGroups.length} visible group{filteredGroups.length === 1 ? "" : "s"}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-80 items-center justify-center rounded-3xl border border-white/7 bg-[#111116]">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-300" />
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-white/8 bg-white/[0.02] px-6 text-center">
          <div className="max-w-md">
            <Users className="mx-auto h-8 w-8 text-[#5d5d70]" />
            <h2 className="mt-4 font-semibold">No matching study groups yet</h2>
            <p className="mt-2 text-sm leading-6 text-[#777789]">
              Create a focused group around the role, interview track, or weekly practice cadence you need.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredGroups.map((group) => {
            const full = group.members >= group.maxMembers;
            const busy = busyId === group.id;
            return (
              <article key={group.id} className="flex flex-col rounded-2xl border border-white/7 bg-[#111116] p-5 transition hover:border-indigo-500/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-indigo-500/15 bg-indigo-500/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-indigo-300">
                        {group.category}
                      </span>
                      {!group.isPublic && <Lock className="h-3.5 w-3.5 text-[#777789]" />}
                      {group.isOwner && (
                        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-emerald-300">Owner</span>
                      )}
                    </div>
                    <h2 className="mt-4 text-lg font-semibold tracking-tight">{group.name}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#818192]">
                      {group.description || "A focused peer practice group on PrepWithAI."}
                    </p>
                  </div>
                </div>

                {group.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <span key={tag} className="rounded-lg border border-white/7 bg-white/[0.03] px-2.5 py-1 text-[11px] text-[#9999a8]">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="mt-5 space-y-3 border-t border-white/7 pt-4 text-xs text-[#747486]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {group.members}/{group.maxMembers} members</span>
                    <span className="truncate">by {group.createdBy}</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5" /> {formatDate(group.nextSessionAt)}
                  </div>
                </div>

                <div className="mt-auto flex gap-2 pt-5">
                  {group.isOwner ? (
                    <>
                      <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-3 py-2.5 text-sm font-medium text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" /> Your group
                      </div>
                      <button
                        type="button"
                        aria-label={`Delete ${group.name}`}
                        disabled={busy}
                        onClick={() => void deleteGroup(group)}
                        className="grid h-11 w-11 place-items-center rounded-xl border border-red-500/15 bg-red-500/[0.05] text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </>
                  ) : (
                    <Button
                      variant={group.isMember ? "outline" : "default"}
                      disabled={busy || (!group.isMember && full)}
                      onClick={() => void updateMembership(group)}
                      className="w-full gap-2"
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : group.isMember ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      {group.isMember ? "Leave group" : full ? "Group full" : "Join group"}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
