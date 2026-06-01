"use client";

import { useState } from "react";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminLayout from "@/components/layouts/AdminLayout";
import { getPlatformStats } from "@/lib/store";
import { CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <PlatformSettings />
      </AdminLayout>
    </AdminGuard>
  );
}

function PlatformSettings() {
  const [saved, setSaved] = useState(false);
  const stats = getPlatformStats();
  const [maintenance, setMaintenance] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Platform settings</h1>
      <p className="mt-1 text-white/50">Global configuration for FlowSync</p>

      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-medium text-white">Platform status</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-white/40">Total users</span><p className="font-bold">{stats.totalUsers}</p></div>
            <div><span className="text-white/40">Active workflows</span><p className="font-bold">{stats.activeWorkflows}</p></div>
            <div><span className="text-white/40">Total runs</span><p className="font-bold">{stats.totalRuns.toLocaleString()}</p></div>
            <div><span className="text-white/40">Version</span><p className="font-bold">1.0.0</p></div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-medium text-white">Access controls</h2>
          <label className="mt-4 flex items-center justify-between">
            <span className="text-sm text-white/70">Allow new signups</span>
            <input type="checkbox" checked={signupEnabled} onChange={(e) => setSignupEnabled(e.target.checked)} className="accent-accent" />
          </label>
          <label className="mt-4 flex items-center justify-between">
            <span className="text-sm text-white/70">Maintenance mode</span>
            <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} className="accent-accent" />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-full bg-red-500/80 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
        >
          {saved && <CheckCircle2 className="h-4 w-4" />}
          {saved ? "Saved!" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
