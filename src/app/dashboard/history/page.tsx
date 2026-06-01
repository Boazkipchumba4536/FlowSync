"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import RunStepDiagnostics from "@/components/workflows/RunStepDiagnostics";
import { historyApi } from "@/lib/services";
import type { RunLogDTO } from "@/lib/types";
import { ROUTES } from "@/lib/routes";
import { CheckCircle2, XCircle, History, ChevronDown, ChevronRight } from "lucide-react";

export default function HistoryPage() {
  return (
    <AuthGuard><DashboardLayout><HistoryContent /></DashboardLayout></AuthGuard>
  );
}

function HistoryContent() {
  const [logs, setLogs] = useState<RunLogDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    historyApi.list().then(({ logs: l }) => setLogs(l)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;

  if (logs.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold">Run history</h1>
        <div className="mt-8">
          <EmptyState icon={History} title="No runs yet" description="When your workflows execute, every run is logged here with step-level diagnostics." actionLabel="Create a workflow" actionHref={ROUTES.dashboardWorkflowNew} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Run history</h1>
        <p className="mt-1 text-sm text-white/50">{logs.length} executions logged · expand any run for step diagnostics</p>
      </div>
      <div className="space-y-3">
        {logs.map((log) => {
          const expanded = expandedId === log.id;
          const retried = log.steps?.some((s) => (s.attempts ?? 1) > 1);
          return (
            <div key={log.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : log.id)}
                className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-white/[0.02]"
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-white/40" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/40" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{log.workflowName}</p>
                  <p className="text-xs text-white/40">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {retried && (
                    <span className="hidden rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] uppercase text-yellow-400 sm:inline">
                      Retries
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {log.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-sm capitalize text-white/70">{log.status}</span>
                  </div>
                  <span className="text-sm text-white/50">{log.duration}</span>
                </div>
              </button>
              {expanded && log.steps && log.steps.length > 0 && (
                <div className="border-t border-white/10 p-4">
                  <RunStepDiagnostics steps={log.steps} error={log.error} title="Step-by-step execution" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
