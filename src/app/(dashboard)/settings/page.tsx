"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle2, CreditCard, Loader2, Save, Shield, Sparkles, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ current: "", newPassword: "", confirm: "" });

  useEffect(() => {
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    });
  }, [session?.user?.email, session?.user?.name]);

  async function handleSaveProfile() {
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to save profile");
      await update({ name: formData.name.trim() });
      setNotice("Profile updated successfully.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    setNotice("");
    if (passwordData.newPassword.length < 8) {
      setNotice("Your new password must be at least 8 characters.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirm) {
      setNotice("The new passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to update password");
      setPasswordData({ current: "", newPassword: "", confirm: "" });
      setNotice("Password updated successfully.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to update password");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAccount() {
    const confirmed = window.confirm("Delete your account and all associated data permanently? This cannot be undone.");
    if (!confirmed) return;

    setSaving(true);
    setNotice("");
    try {
      const response = await fetch("/api/user/delete", { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to delete account");
      }
      window.location.assign("/");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to delete account");
      setSaving(false);
    }
  }

  const plan = session?.user?.plan || "free";
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div className="mx-auto max-w-3xl space-y-7 page-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-[#858596]">Manage your profile, security, billing, and account data.</p>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#c8c8d2]">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {notice}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/10 p-2"><User className="h-5 w-5 text-indigo-400" /></div>
            <div>
              <h2 className="font-semibold">Profile</h2>
              <p className="text-sm text-[#858596]">Your account identity.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="settings-name" className="mb-1.5 block text-sm font-medium">Full name</label>
              <Input
                id="settings-name"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="settings-email" className="mb-1.5 block text-sm font-medium">Email</label>
              <Input id="settings-email" value={formData.email} disabled className="opacity-60" />
              <p className="mt-1 text-xs text-[#717181]">Email changes are not currently supported.</p>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving || !formData.name.trim()}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2"><Shield className="h-5 w-5 text-amber-400" /></div>
            <div>
              <h2 className="font-semibold">Security</h2>
              <p className="text-sm text-[#858596]">Update your password.</p>
            </div>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              aria-label="Current password"
              value={passwordData.current}
              onChange={(event) => setPasswordData((current) => ({ ...current, current: event.target.value }))}
              placeholder="Current password"
            />
            <Input
              type="password"
              aria-label="New password"
              value={passwordData.newPassword}
              onChange={(event) => setPasswordData((current) => ({ ...current, newPassword: event.target.value }))}
              placeholder="New password"
            />
            <Input
              type="password"
              aria-label="Confirm new password"
              value={passwordData.confirm}
              onChange={(event) => setPasswordData((current) => ({ ...current, confirm: event.target.value }))}
              placeholder="Confirm new password"
            />
            <Button
              onClick={handleChangePassword}
              disabled={saving || !passwordData.current || !passwordData.newPassword || !passwordData.confirm}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
              Update password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/10 p-2"><Sparkles className="h-5 w-5 text-indigo-300" /></div>
            <div>
              <h2 className="font-semibold">Plan and billing</h2>
              <p className="text-sm text-[#858596]">Your current product access.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-white/8 bg-white/4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{planLabel} plan</p>
                <Badge className="border-indigo-500/20 bg-indigo-500/10 text-indigo-300">{planLabel}</Badge>
              </div>
              <p className="mt-1 text-sm text-[#858596]">
                {plan === "free"
                  ? "Core interview practice with clear daily limits."
                  : "Premium interview preparation features are active on this account."}
              </p>
            </div>
            <Link href="/pricing">
              <Button variant="outline"><CreditCard className="mr-2 h-4 w-4" /> Manage plan</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/20">
        <CardContent className="p-6">
          <h2 className="font-semibold text-red-400">Danger zone</h2>
          <p className="mt-2 text-sm text-[#858596]">Permanently delete your account and associated data.</p>
          <Separator className="my-5" />
          <Button variant="destructive" onClick={deleteAccount} disabled={saving}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
