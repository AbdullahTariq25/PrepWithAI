"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  CreditCard,
  Save,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirm) {
      alert("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.newPassword,
        }),
      });
      if (res.ok) {
        setPasswordData({ current: "", newPassword: "", confirm: "" });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Password error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Billing portal error:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const plan = (session?.user as { plan?: string })?.plan || "free";

  return (
    <div className="max-w-3xl mx-auto space-y-8 page-enter bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-[#888]">Manage your account and preferences</p>
      </motion.div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg px-4 py-3 text-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Changes saved successfully!
        </motion.div>
      )}

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <User className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Profile</h2>
                <p className="text-sm text-[#888]">Your personal information</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Email
                </label>
                <Input value={formData.email} disabled className="opacity-60" />
                <p className="text-xs text-[#888] mt-1">
                  Email cannot be changed
                </p>
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Security</h2>
                <p className="text-sm text-[#888]">
                  Password and authentication
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      current: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={
                  saving ||
                  !passwordData.current ||
                  !passwordData.newPassword ||
                  !passwordData.confirm
                }
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Billing & Plan</h2>
                <p className="text-sm text-[#888]">Manage your subscription</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/4 rounded-lg mb-4">
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-[#888]">
                  {plan === "free"
                    ? "Free tier — 3 interviews/day"
                    : plan === "pro"
                      ? "Pro — Unlimited interviews"
                      : "Team — 5 seats included"}
                </p>
              </div>
              <Badge
                className={
                  plan === "free"
                    ? "bg-zinc-500/10 text-zinc-400"
                    : plan === "pro"
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "bg-blue-500/10 text-blue-400"
                }
              >
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </Badge>
            </div>
            <div className="flex gap-3">
              {plan !== "free" && (
                <Button
                  variant="outline"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Manage Billing
                </Button>
              )}
              {plan === "free" && (
                <Button
                  variant="glow"
                  onClick={() => (window.location.href = "/pricing")}
                >
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-red-500/20">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-red-500 mb-2">
              Danger Zone
            </h2>
            <p className="text-sm text-[#888] mb-4">
              Permanently delete your account and all data. This action cannot
              be undone.
            </p>
            <Separator className="mb-4" />
            <Button
              variant="destructive"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to delete your account? This cannot be undone.",
                  )
                ) {
                  fetch("/api/user/delete", { method: "DELETE" }).then(() => {
                    window.location.href = "/";
                  });
                }
              }}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
