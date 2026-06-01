"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminApi } from "@/lib/services";
import { CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  return <AdminGuard><AdminLayout><PlatformSettings /></AdminLayout></AdminGuard>;
}

function PlatformSettings() {
  const [saved, setSaved] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getSettings().then(({ signupEnabled: s, maintenanceMode: m }) => {
      setSignupEnabled(s);
      setMaintenance(m);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await adminApi.settings({ signupEnabled, maintenanceMode: maintenance });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" /></div>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Platform settings</h1>
      <p className="mt-1 text-white/50">Global configuration for FlowSync</p>
      <div className="mt-8 space-y-6">
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
        <button type="button" onClick={handleSave} className="flex items-center gap-2 rounded-full bg-red-500/80 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500">
          {saved && <CheckCircle2 className="h-4 w-4" />}{saved ? "Saved!" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
