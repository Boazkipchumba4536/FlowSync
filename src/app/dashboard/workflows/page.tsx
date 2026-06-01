"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { getWorkflows, saveWorkflows, runWorkflow, type Workflow } from "@/lib/store";
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
  const { session } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const load = () => {
    if (session) setWorkflows(getWorkflows(session.userId));
  };

  useEffect(() => {
    load();
  }, [session]);

  const toggleStatus = (id: string) => {
    if (!session) return;
    const updated = workflows.map((w) =>
      w.id === id ? { ...w, status: w.status === "on" ? "off" as const : "on" as const } : w
    );
    setWorkflows(updated);
    saveWorkflows(session.userId, updated);
  };

  const testRun = (id: string) => {
    if (!session) return;
    runWorkflow(session.userId, id);
    load();
  };

  if (workflows.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold">Workflows</h1>
        <div className="mt-8">
          <EmptyState
            icon={Zap}
            title="No workflows yet"
            description="Workflows automate tasks between your apps. Connect an app, then create your first workflow."
            actionLabel="Create workflow"
            actionHref={ROUTES.dashboardWorkflowNew}
          />
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
        <Link href={ROUTES.dashboardWorkflowNew} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover">
          + New workflow
        </Link>
      </div>

      <div className="space-y-3">
        {workflows.map((wf) => (
          <div key={wf.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:gap-4">
            <button
              type="button"
              onClick={() => toggleStatus(wf.id)}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                wf.status === "on" ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/40"
              }`}
            >
              {wf.status === "on" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <Link href={ROUTES.workflow(wf.id)} className="min-w-0 flex-1">
              <p className="truncate font-medium text-white hover:text-accent">{wf.name}</p>
              <p className="truncate text-xs text-white/40">{wf.trigger} → {wf.actions.join(" → ")}</p>
            </Link>
            <button
              type="button"
              onClick={() => testRun(wf.id)}
              title="Test run"
              className="hidden rounded-lg border border-white/10 p-2 text-white/50 hover:border-accent/30 hover:text-accent sm:block"
            >
              <PlayCircle className="h-4 w-4" />
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
