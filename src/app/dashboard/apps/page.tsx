"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { getApps, saveApps, getAvailableApps, type ConnectedApp } from "@/lib/store";
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
  const { session } = useAuth();
  const [connected, setConnected] = useState<ConnectedApp[]>([]);
  const [showCatalog, setShowCatalog] = useState(false);
  const available = getAvailableApps();

  useEffect(() => {
    if (session) setConnected(getApps(session.userId));
  }, [session]);

  const connect = (app: (typeof available)[number]) => {
    if (!session || connected.some((c) => c.id === app.id)) return;
    const newApp: ConnectedApp = {
      id: app.id,
      name: app.name,
      icon: app.icon,
      color: app.color,
      connectedAt: new Date().toISOString(),
    };
    const updated = [...connected, newApp];
    setConnected(updated);
    saveApps(session.userId, updated);
    setShowCatalog(false);
  };

  const disconnect = (id: string) => {
    if (!session) return;
    const updated = connected.filter((a) => a.id !== id);
    setConnected(updated);
    saveApps(session.userId, updated);
  };

  if (connected.length === 0 && !showCatalog) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold">Connected apps</h1>
        <div className="mt-8">
          <EmptyState
            icon={Plug}
            title="No apps connected"
            description="Connect your first app to start building workflows. Choose from Gmail, Slack, HubSpot, OpenAI, and more."
            actionLabel="Connect an app"
            onAction={() => setShowCatalog(true)}
          />
        </div>
        {showCatalog && <Catalog available={available} connected={connected} onConnect={connect} />}
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
        <button
          type="button"
          onClick={() => setShowCatalog(!showCatalog)}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" /> Connect app
        </button>
      </div>

      {showCatalog && <Catalog available={available} connected={connected} onConnect={connect} />}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {connected.map((app) => (
          <div key={app.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold"
                style={{ backgroundColor: `${app.color}20`, color: app.color }}
              >
                {app.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{app.name}</p>
                <p className="flex items-center gap-1 text-xs text-green-400">
                  <Check className="h-3 w-3" /> Connected
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => disconnect(app.id)}
              className="mt-4 w-full rounded-lg border border-white/10 py-2 text-xs text-white/50 hover:border-red-500/30 hover:text-red-400"
            >
              Disconnect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Catalog({
  available,
  connected,
  onConnect,
}: {
  available: ReturnType<typeof getAvailableApps>;
  connected: ConnectedApp[];
  onConnect: (app: (typeof available)[number]) => void;
}) {
  const unconnected = available.filter((a) => !connected.some((c) => c.id === a.id));
  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-4 text-sm font-medium text-white/70">Select an app to connect</p>
      {unconnected.length === 0 ? (
        <p className="text-sm text-white/40">All available apps are connected.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {unconnected.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onConnect(app)}
              className="flex items-center gap-3 rounded-lg border border-white/10 p-3 text-left hover:border-accent/30 hover:bg-accent/5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold"
                style={{ backgroundColor: `${app.color}20`, color: app.color }}
              >
                {app.icon}
              </div>
              <span className="text-sm text-white">{app.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
