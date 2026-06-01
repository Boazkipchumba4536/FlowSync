"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminLayout from "@/components/layouts/AdminLayout";
import { integrationApi } from "@/lib/services";
import type { IntegrationDTO } from "@/lib/types";

export default function AdminIntegrationsPage() {
  return <AdminGuard><AdminLayout><IntegrationsManager /></AdminLayout></AdminGuard>;
}

function IntegrationsManager() {
  const [integrations, setIntegrations] = useState<IntegrationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => integrationApi.list().then(({ integrations: i }) => setIntegrations(i)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const toggle = async (id: string, enabled: boolean) => {
    await integrationApi.toggle(id, !enabled);
    load();
  };

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Integration catalog</h1>
      <p className="mt-1 text-white/50">{integrations.filter((i) => i.enabled).length} active integrations</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((app) => (
          <div key={app.id} className={`flex items-center justify-between rounded-xl border p-4 ${app.enabled ? "border-white/10 bg-white/[0.03]" : "border-white/5 opacity-60"}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold" style={{ backgroundColor: `${app.color}20`, color: app.color }}>{app.icon}</div>
              <div><p className="font-medium text-white">{app.name}</p><p className="text-xs text-white/40">{app.category}</p></div>
            </div>
            <button type="button" onClick={() => toggle(app.id, app.enabled)} className={`relative h-6 w-11 rounded-full ${app.enabled ? "bg-accent" : "bg-white/20"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${app.enabled ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
