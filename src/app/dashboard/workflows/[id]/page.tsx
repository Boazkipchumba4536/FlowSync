"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import RunStepDiagnostics from "@/components/workflows/RunStepDiagnostics";
import { workflowApi } from "@/lib/services";
import type { ExecutionResultDTO, WorkflowDTO } from "@/lib/types";
import { ROUTES } from "@/lib/routes";
import { Play, Pause, Trash2, ArrowLeft, PlayCircle, CheckCircle2, XCircle } from "lucide-react";

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <DashboardLayout>
        <WorkflowDetail id={params.id} />
      </DashboardLayout>
    </AuthGuard>
  );
}

function WorkflowDetail({ id }: { id: string }) {
  const router = useRouter();
  const [workflow, setWorkflow] = useState<WorkflowDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<ExecutionResultDTO | null>(null);

  const load = useCallback(async () => {
    try {
      const { workflow: w } = await workflowApi.get(id);
      setWorkflow(w);
    } catch {
      setWorkflow(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;

  if (!workflow) {
    return (
      <div className="py-12 text-center">
        <p className="text-white/50">Workflow not found</p>
        <Link href={ROUTES.dashboardWorkflows} className="mt-4 inline-block text-accent hover:underline">Back to workflows</Link>
      </div>
    );
  }

  const toggle = async () => {
    const status = workflow.status === "on" ? "off" : "on";
    await workflowApi.update(id, { status });
    load();
  };

  const remove = async () => {
    await workflowApi.delete(id);
    router.push(ROUTES.dashboardWorkflows);
  };

  const testRun = async () => {
    setRunning(true);
    setLastResult(null);
    try {
      const { result } = await workflowApi.run(id);
      setLastResult(result);
      load();
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={ROUTES.dashboardWorkflows} className="flex items-center gap-1 text-sm text-white/50 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{workflow.name}</h1>
          <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${workflow.status === "on" ? "bg-green-500/20 text-green-400" : workflow.status === "off" ? "bg-yellow-500/20 text-yellow-400" : "bg-white/10 text-white/50"}`}>
            {workflow.status === "on" ? "Active" : workflow.status === "off" ? "Paused" : "Draft"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={testRun} disabled={running} className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent hover:bg-accent/20 disabled:opacity-50">
            <PlayCircle className="h-4 w-4" /> {running ? "Running..." : "Test run"}
          </button>
          <button type="button" onClick={toggle} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
            {workflow.status === "on" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {workflow.status === "on" ? "Pause" : "Turn on"}
          </button>
          <button type="button" onClick={remove} className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {lastResult && (
        <div className="mt-4 space-y-3">
          <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${lastResult.success ? "border border-green-500/30 bg-green-500/10 text-green-400" : "border border-red-500/30 bg-red-500/10 text-red-400"}`}>
            {lastResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {lastResult.success
              ? `Run completed in ${lastResult.duration}`
              : `Run failed in ${lastResult.duration}`}
          </div>
          <RunStepDiagnostics steps={lastResult.steps} error={lastResult.error} title="Latest test run" />
        </div>
      )}

      <div className="mt-8 space-y-4">
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
          <p className="text-xs font-semibold uppercase text-accent">Trigger</p>
          <p className="mt-1 text-white">{workflow.trigger}</p>
        </div>
        {workflow.actions.map((action, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase text-white/40">Action {i + 1}</p>
            <p className="mt-1 text-white">{action}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="font-display text-2xl font-bold">{workflow.runs.toLocaleString()}</p>
          <p className="text-xs text-white/40">Total runs</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="font-display text-2xl font-bold">{workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : "—"}</p>
          <p className="text-xs text-white/40">Last run</p>
        </div>
      </div>
    </div>
  );
}
