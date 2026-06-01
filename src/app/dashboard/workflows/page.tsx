"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { workflowApi } from "@/lib/services";
import type { WorkflowDTO } from "@/lib/types";
import { ROUTES } from "@/lib/routes";
import { Play, Pause, Zap, PlayCircle } from "lucide-react";

export default function WorkflowsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <WorkflowsContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function WorkflowsContent() {
  const [workflows, setWorkflows] = useState<WorkflowDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { workflows: w } = await workflowApi.list();
    setWorkflows(w);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (wf: WorkflowDTO) => {
    const status = wf.status === "on" ? "off" : "on";
    await workflowApi.update(wf.id, { status });
    load();
  };

  const testRun = async (id: string) => {
    setRunning(id);
    try {
      await workflowApi.run(id);
      await load();
    } finally {
      setRunning(null);
    }
  };

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;
  }

  if (workflows.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold">Workflows</h1>
        <div className="mt-8">
          <EmptyState icon={Zap} title="No workflows yet" description="Workflows automate tasks between your apps. Connect an app, then create your first workflow." actionLabel="Create workflow" actionHref={ROUTES.dashboardWorkflowNew} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Workflows</h1>
          <p className="mt-1 text-sm text-white/50">{workflows.length} total</p>
        </div>
        <Link href={ROUTES.dashboardWorkflowNew} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover">+ New workflow</Link>
      </div>
      <div className="space-y-3">
        {workflows.map((wf) => (
          <div key={wf.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:gap-4">
            <button type="button" onClick={() => toggleStatus(wf)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${wf.status === "on" ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/40"}`}>
              {wf.status === "on" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <Link href={ROUTES.workflow(wf.id)} className="min-w-0 flex-1">
              <p className="truncate font-medium text-white hover:text-accent">{wf.name}</p>
              <p className="truncate text-xs text-white/40">{wf.trigger} → {wf.actions.join(" → ")}</p>
            </Link>
            <button type="button" onClick={() => testRun(wf.id)} disabled={running === wf.id} className="hidden rounded-lg border border-white/10 p-2 text-white/50 hover:border-accent/30 hover:text-accent sm:block disabled:opacity-50">
              <PlayCircle className={`h-4 w-4 ${running === wf.id ? "animate-pulse" : ""}`} />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{wf.runs.toLocaleString()} runs</p>
              <p className="text-xs capitalize text-white/40">{wf.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
