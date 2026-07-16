"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  Loader2,
  Plus,
  Scale,
  Sparkles,
  Trash2,
} from "lucide-react";

interface Offer {
  _id: string;
  company: string;
  role: string;
  currency: string;
  baseAnnual: number;
  bonusAnnual: number;
  equityAnnual: number;
  signingBonus: number;
  benefitsAnnual: number;
  relocation: number;
  learningScore: number;
  growthScore: number;
  workLifeScore: number;
  brandScore: number;
  flexibilityScore: number;
  status: "considering" | "negotiating" | "accepted" | "declined";
  deadline?: string;
  notes: string;
  updatedAt: string;
}

type OfferForm = Omit<Offer, "_id" | "updatedAt">;

const emptyForm: OfferForm = {
  company: "",
  role: "",
  currency: "USD",
  baseAnnual: 0,
  bonusAnnual: 0,
  equityAnnual: 0,
  signingBonus: 0,
  benefitsAnnual: 0,
  relocation: 0,
  learningScore: 5,
  growthScore: 5,
  workLifeScore: 5,
  brandScore: 5,
  flexibilityScore: 5,
  status: "considering",
  deadline: "",
  notes: "",
};

function yearOneTotal(offer: Offer | OfferForm) {
  return (
    offer.baseAnnual +
    offer.bonusAnnual +
    offer.equityAnnual +
    offer.signingBonus +
    offer.benefitsAnnual +
    offer.relocation
  );
}

function recurringTotal(offer: Offer | OfferForm) {
  return offer.baseAnnual + offer.bonusAnnual + offer.equityAnnual + offer.benefitsAnnual;
}

function fitScore(offer: Offer | OfferForm) {
  return Math.round(
    ((offer.learningScore +
      offer.growthScore +
      offer.workLifeScore +
      offer.brandScore +
      offer.flexibilityScore) /
      50) *
      100,
  );
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  }
}

function deadlineLabel(deadline?: string) {
  if (!deadline) return "No deadline saved";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "No deadline saved";
  const days = Math.ceil((date.getTime() - Date.now()) / 86_400_000);
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "Decision due today";
  return `${days} day${days === 1 ? "" : "s"} remaining`;
}

export default function OfferLabPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [form, setForm] = useState<OfferForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadOffers = useCallback(async () => {
    try {
      const response = await fetch("/api/offers", { cache: "no-store" });
      const data = (await response.json()) as { offers?: Offer[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to load offers");
      setOffers(data.offers || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load offers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOffers();
  }, [loadOffers]);

  const rankedOffers = useMemo(
    () =>
      [...offers].sort((a, b) => {
        const aComposite = yearOneTotal(a) * (0.7 + fitScore(a) / 250);
        const bComposite = yearOneTotal(b) * (0.7 + fitScore(b) / 250);
        return bComposite - aComposite;
      }),
    [offers],
  );

  const highestYearOne = offers.reduce((max, offer) => Math.max(max, yearOneTotal(offer)), 0);
  const highestFit = offers.reduce((max, offer) => Math.max(max, fitScore(offer)), 0);
  const activeOffers = offers.filter((offer) => offer.status === "considering" || offer.status === "negotiating").length;

  function updateField<K extends keyof OfferForm>(field: K, value: OfferForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function editOffer(offer: Offer) {
    setEditingId(offer._id);
    setForm({
      company: offer.company,
      role: offer.role,
      currency: offer.currency,
      baseAnnual: offer.baseAnnual,
      bonusAnnual: offer.bonusAnnual,
      equityAnnual: offer.equityAnnual,
      signingBonus: offer.signingBonus,
      benefitsAnnual: offer.benefitsAnnual,
      relocation: offer.relocation,
      learningScore: offer.learningScore,
      growthScore: offer.growthScore,
      workLifeScore: offer.workLifeScore,
      brandScore: offer.brandScore,
      flexibilityScore: offer.flexibilityScore,
      status: offer.status,
      deadline: offer.deadline ? offer.deadline.slice(0, 10) : "",
      notes: offer.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveOffer(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(editingId ? `/api/offers/${editingId}` : "/api/offers", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to save offer");
      setMessage(editingId ? "Offer updated." : "Offer added to the comparison lab.");
      resetForm();
      await loadOffers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save offer");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: Offer["status"]) {
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to update offer");
      await loadOffers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update offer");
    }
  }

  async function deleteOffer(id: string) {
    if (!window.confirm("Delete this offer permanently?")) return;
    try {
      const response = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to delete offer");
      if (editingId === id) resetForm();
      await loadOffers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete offer");
    }
  }

  const currentYearOne = yearOneTotal(form);
  const currentRecurring = recurringTotal(form);
  const currentFit = fitScore(form);

  return (
    <div className="mx-auto max-w-7xl space-y-7 page-enter">
      <section className="relative overflow-hidden rounded-[28px] border border-emerald-400/15 bg-[#0d0d13] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-emerald-500/12 blur-[110px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-xs font-medium text-emerald-200">
              <Scale className="h-3.5 w-3.5" /> Offer and negotiation intelligence
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
              Compare the whole opportunity—not only the base salary.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9696a6] sm:text-base">
              Model first-year compensation, recurring value, deadlines, learning, growth, flexibility, brand, and work-life fit before you accept, decline, or negotiate.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Active offers", activeOffers],
              ["Highest year one", highestYearOne && offers[0] ? formatMoney(highestYearOne, offers.find((offer) => yearOneTotal(offer) === highestYearOne)?.currency || "USD") : "—"],
              ["Highest fit", highestFit ? `${highestFit}%` : "—"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-black/20 p-4 text-center">
                <div className="truncate text-xl font-bold tabular-nums text-white sm:text-2xl">{value}</div>
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

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={saveOffer} className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">{editingId ? "Edit offer" : "Add an offer"}</div>
              <h2 className="mt-2 text-xl font-semibold">Capture the package and the work itself.</h2>
            </div>
            {editingId && <button type="button" onClick={resetForm} className="text-xs text-[#858596] hover:text-white">Cancel edit</button>}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Company</span>
              <input required value={form.company} onChange={(event) => updateField("company", event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm outline-none focus:border-emerald-400/40" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Role</span>
              <input required value={form.role} onChange={(event) => updateField("role", event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm outline-none focus:border-emerald-400/40" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Currency</span>
              <input value={form.currency} onChange={(event) => updateField("currency", event.target.value.toUpperCase())} maxLength={8} className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm uppercase outline-none focus:border-emerald-400/40" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Decision deadline</span>
              <input type="date" value={form.deadline || ""} onChange={(event) => updateField("deadline", event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm outline-none focus:border-emerald-400/40" />
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-white/7 bg-black/15 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><DollarSign className="h-4 w-4 text-emerald-300" /> Compensation components</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["baseAnnual", "Annual base"],
                ["bonusAnnual", "Expected annual bonus"],
                ["equityAnnual", "Annualized equity"],
                ["signingBonus", "Signing bonus"],
                ["benefitsAnnual", "Estimated annual benefits"],
                ["relocation", "Relocation or one-time support"],
              ].map(([field, label]) => (
                <label key={field} className="block">
                  <span className="mb-1.5 block text-xs text-[#8d8d9c]">{label}</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form[field as keyof OfferForm] as number}
                    onChange={(event) => updateField(field as keyof OfferForm, Number(event.target.value) as never)}
                    className="w-full rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm outline-none focus:border-emerald-400/40"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><BarChart3 className="h-4 w-4 text-indigo-300" /> Opportunity fit</div>
            <div className="mt-4 space-y-4">
              {[
                ["learningScore", "Learning"],
                ["growthScore", "Career growth"],
                ["workLifeScore", "Work-life fit"],
                ["brandScore", "Brand and network"],
                ["flexibilityScore", "Location and flexibility"],
              ].map(([field, label]) => (
                <label key={field} className="block">
                  <div className="mb-2 flex items-center justify-between text-xs text-[#9a9aaa]"><span>{label}</span><span className="rounded-lg bg-white/5 px-2 py-1 font-mono text-white">{form[field as keyof OfferForm] as number}/10</span></div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form[field as keyof OfferForm] as number}
                    onChange={(event) => updateField(field as keyof OfferForm, Number(event.target.value) as never)}
                    className="w-full accent-emerald-400"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.045] p-4 text-center">
            <div><div className="text-lg font-semibold text-white">{formatMoney(currentYearOne, form.currency)}</div><div className="mt-1 text-[10px] text-[#717183]">Year one</div></div>
            <div><div className="text-lg font-semibold text-white">{formatMoney(currentRecurring, form.currency)}</div><div className="mt-1 text-[10px] text-[#717183]">Recurring</div></div>
            <div><div className="text-lg font-semibold text-emerald-300">{currentFit}%</div><div className="mt-1 text-[10px] text-[#717183]">Fit score</div></div>
          </div>

          <label className="mt-5 block">
            <span className="mb-1.5 block text-xs font-medium text-[#a5a5b3]">Decision notes</span>
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows={4} placeholder="Team quality, manager, product, risk, visa, remote policy, concerns, and negotiation context." className="w-full resize-y rounded-xl border border-white/10 bg-[#0b0b10] px-4 py-3 text-sm leading-6 outline-none placeholder:text-[#555566] focus:border-emerald-400/40" />
          </label>

          <button type="submit" disabled={saving} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save offer changes" : "Add offer to comparison"}
          </button>
        </form>

        <section className="space-y-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">Decision board</div>
            <h2 className="mt-2 text-xl font-semibold">Rank compensation and career fit together.</h2>
          </div>

          {loading ? (
            <div className="grid min-h-64 place-items-center rounded-2xl border border-white/7 bg-[#111116]"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
          ) : rankedOffers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#111116] p-10 text-center">
              <BriefcaseBusiness className="mx-auto h-8 w-8 text-emerald-300" />
              <h3 className="mt-4 font-semibold">Add the first real offer or serious opportunity.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7f7f90]">This workspace avoids fake market estimates. It compares the numbers and priorities you enter so the decision remains grounded in your situation.</p>
            </div>
          ) : (
            rankedOffers.map((offer, index) => {
              const total = yearOneTotal(offer);
              const recurring = recurringTotal(offer);
              const fit = fitScore(offer);
              const topComp = total === highestYearOne;
              const topFit = fit === highestFit;
              return (
                <article key={offer._id} className="overflow-hidden rounded-2xl border border-white/7 bg-[#111116]">
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#a8a8b5]">Rank {index + 1}</span>
                          {topComp && <span className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">Highest compensation</span>}
                          {topFit && <span className="rounded-full border border-indigo-400/20 bg-indigo-400/8 px-2.5 py-1 text-[10px] font-semibold text-indigo-300">Highest fit</span>}
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-white">{offer.company}</h3>
                        <p className="mt-1 text-sm text-[#8d8d9d]">{offer.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{formatMoney(total, offer.currency)}</div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#69697a]">First-year value</div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-white/7 bg-black/15 p-3"><div className="text-sm font-semibold text-white">{formatMoney(offer.baseAnnual, offer.currency)}</div><div className="mt-1 text-[10px] text-[#69697a]">Base</div></div>
                      <div className="rounded-xl border border-white/7 bg-black/15 p-3"><div className="text-sm font-semibold text-white">{formatMoney(recurring, offer.currency)}</div><div className="mt-1 text-[10px] text-[#69697a]">Recurring total</div></div>
                      <div className="rounded-xl border border-white/7 bg-black/15 p-3"><div className="text-sm font-semibold text-emerald-300">{fit}%</div><div className="mt-1 text-[10px] text-[#69697a]">Opportunity fit</div></div>
                    </div>

                    <div className="mt-5 grid grid-cols-5 gap-2">
                      {[
                        ["Learning", offer.learningScore],
                        ["Growth", offer.growthScore],
                        ["Balance", offer.workLifeScore],
                        ["Brand", offer.brandScore],
                        ["Flex", offer.flexibilityScore],
                      ].map(([label, score]) => (
                        <div key={label} className="text-center"><div className="text-sm font-semibold text-white">{score}</div><div className="mt-1 text-[9px] text-[#666678]">{label}</div></div>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.045] px-3 py-2.5 text-xs text-amber-100">
                      <CalendarClock className="h-3.5 w-3.5 text-amber-300" /> {deadlineLabel(offer.deadline)}
                    </div>

                    {offer.notes && <p className="mt-4 text-sm leading-6 text-[#858596]">{offer.notes}</p>}

                    <div className="mt-5 rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.045] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-300"><Sparkles className="h-3.5 w-3.5" /> Negotiation focus</div>
                      <p className="mt-2 text-xs leading-5 text-[#9999a8]">
                        {offer.status === "accepted"
                          ? "Record what made this the right decision so future comparisons reflect your real priorities."
                          : topComp
                            ? "Protect the strongest parts of the package while negotiating role scope, title, flexibility, or development support."
                            : `The current first-year gap to the leading offer is ${formatMoney(Math.max(0, highestYearOne - total), offer.currency)}. Decide which mix of base, bonus, equity, flexibility, title, or learning support would close the real value gap.`}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/7 pt-4">
                      <select value={offer.status} onChange={(event) => void updateStatus(offer._id, event.target.value as Offer["status"])} className="rounded-lg border border-white/8 bg-[#0b0b10] px-3 py-2 text-xs text-[#c4c4cf] outline-none">
                        <option value="considering">Considering</option>
                        <option value="negotiating">Negotiating</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                      </select>
                      <button onClick={() => editOffer(offer)} className="rounded-lg border border-white/8 bg-white/4 px-3 py-2 text-xs text-[#c4c4cf] hover:bg-white/7">Edit</button>
                      {offer.status === "accepted" && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> Decision recorded</span>}
                      <button onClick={() => void deleteOffer(offer._id)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/8"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
