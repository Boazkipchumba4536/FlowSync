"use client";

import { useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function SettingsContent() {
  const { session } = useAuth();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(session?.name ?? "");
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-white/50">Manage your account preferences</p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-medium text-white">Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-white/70">Display name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-accent/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/70">Email</label>
              <input
                value={session?.email ?? ""}
                disabled
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/70">Plan</label>
              <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-sm font-medium capitalize text-accent">
                {session?.plan}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-medium text-white">Notifications</h2>
          <label className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 rounded accent-accent"
            />
            <span className="text-sm text-white/70">Email me when workflows fail</span>
          </label>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          {saved && <CheckCircle2 className="h-4 w-4" />}
          {saved ? "Saved!" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
