"use client";

import { useEffect, useState, useCallback } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { appApi, integrationApi } from "@/lib/services";
import type { ConnectedAppDTO, IntegrationDTO } from "@/lib/types";
import { Check, Plus, Plug } from "lucide-react";

export default function AppsDashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <AppsContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function AppsContent() {
  const [connected, setConnected] = useState<ConnectedAppDTO[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationDTO[]>([]);
  const [showCatalog, setShowCatalog] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [appsRes, intRes] = await Promise.all([appApi.list(), integrationApi.list()]);
    setConnected(appsRes.apps);
    setIntegrations(intRes.integrations.filter((i) => i.enabled));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const connect = async (app: IntegrationDTO) => {
    await appApi.connect(app.id);
    setShowCatalog(false);
    load();
  };

  const disconnect = async (id: string) => {
    await appApi.disconnect(id);
    load();
  };

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;

  const unconnected = integrations.filter((a) => !connected.some((c) => c.appId === a.id));

  if (connected.length === 0 && !showCatalog) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold">Connected apps</h1>
        <div className="mt-8">
          <EmptyState icon={Plug} title="No apps connected" description="Connect your first app to start building workflows." actionLabel="Connect an app" onAction={() => setShowCatalog(true)} />
        </div>
        {showCatalog && <Catalog apps={unconnected} onConnect={connect} />}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Connected apps</h1>
          <p className="mt-1 text-sm text-white/50">{connected.length} connected</p>
        </div>
        <button type="button" onClick={() => setShowCatalog(!showCatalog)} className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover">
          <Plus className="h-4 w-4" /> Connect app
        </button>
      </div>
      {showCatalog && <Catalog apps={unconnected} onConnect={connect} />}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {connected.map((app) => (
          <div key={app.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold" style={{ backgroundColor: `${app.color}20`, color: app.color }}>{app.icon}</div>
              <div className="flex-1">
                <p className="font-medium text-white">{app.name}</p>
                <p className="flex items-center gap-1 text-xs text-green-400"><Check className="h-3 w-3" /> Connected</p>
              </div>
            </div>
            <button type="button" onClick={() => disconnect(app.id)} className="mt-4 w-full rounded-lg border border-white/10 py-2 text-xs text-white/50 hover:border-red-500/30 hover:text-red-400">Disconnect</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Catalog({ apps, onConnect }: { apps: IntegrationDTO[]; onConnect: (a: IntegrationDTO) => void }) {
  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-4 text-sm font-medium text-white/70">Select an app to connect</p>
      {apps.length === 0 ? (
        <p className="text-sm text-white/40">All available apps are connected.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <button key={app.id} type="button" onClick={() => onConnect(app)} className="flex items-center gap-3 rounded-lg border border-white/10 p-3 text-left hover:border-accent/30 hover:bg-accent/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold" style={{ backgroundColor: `${app.color}20`, color: app.color }}>{app.icon}</div>
              <span className="text-sm text-white">{app.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
