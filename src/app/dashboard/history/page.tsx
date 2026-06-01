"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { getHistory, type RunLog } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { CheckCircle2, XCircle, Loader2, History } from "lucide-react";

export default function HistoryPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <HistoryContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function HistoryContent() {
  const { session } = useAuth();
  const [logs, setLogs] = useState<RunLog[]>([]);

  useEffect(() => {
    if (session) setLogs(getHistory(session.userId));
  }, [session]);

  const statusIcon = (status: RunLog["status"]) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "error": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Loader2 className="h-4 w-4 animate-spin text-accent" />;
    }
  };

  if (logs.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold">Run history</h1>
        <div className="mt-8">
          <EmptyState
            icon={History}
            title="No runs yet"
            description="When your workflows execute, every run is logged here for full visibility and auditing."
            actionLabel="Create a workflow"
            actionHref={ROUTES.dashboardWorkflowNew}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Run history</h1>
        <p className="mt-1 text-sm text-white/50">{logs.length} executions logged</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-4 gap-4 border-b border-white/10 bg-white/5 px-4 py-3 text-xs font-medium uppercase tracking-wider text-white/40">
          <span className="col-span-2">Workflow</span>
          <span>Status</span>
          <span>Duration</span>
        </div>
        {logs.map((log) => (
          <div key={log.id} className="grid grid-cols-4 gap-4 border-b border-white/5 px-4 py-3 last:border-0">
            <div className="col-span-2">
              <p className="text-sm text-white">{log.workflowName}</p>
              <p className="text-xs text-white/40">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {statusIcon(log.status)}
              <span className="text-sm capitalize text-white/70">{log.status}</span>
            </div>
            <span className="text-sm text-white/50">{log.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
