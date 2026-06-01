"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getWorkflows, saveWorkflows, runWorkflow, type Workflow } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { Play, Pause, Trash2, ArrowLeft, PlayCircle } from "lucide-react";

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
  const { session } = useAuth();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    if (session) {
      const wf = getWorkflows(session.userId).find((w) => w.id === id);
      setWorkflow(wf ?? null);
    }
  }, [session, id]);

  if (!workflow) {
    return (
      <div className="text-center py-12">
        <p className="text-white/50">Workflow not found</p>
        <Link href={ROUTES.dashboardWorkflows} className="mt-4 inline-block text-accent hover:underline">
          Back to workflows
        </Link>
      </div>
    );
  }

  const toggle = () => {
    if (!session) return;
    const wfs = getWorkflows(session.userId);
    const updated = wfs.map((w) =>
      w.id === id ? { ...w, status: w.status === "on" ? "off" as const : "on" as const } : w
    );
    saveWorkflows(session.userId, updated);
    setWorkflow(updated.find((w) => w.id === id) ?? null);
  };

  const remove = () => {
    if (!session) return;
    const wfs = getWorkflows(session.userId).filter((w) => w.id !== id);
    saveWorkflows(session.userId, wfs);
    router.push(ROUTES.dashboardWorkflows);
  };

  const testRun = () => {
    if (!session) return;
    runWorkflow(session.userId, id);
    setWorkflow(getWorkflows(session.userId).find((w) => w.id === id) ?? null);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={ROUTES.dashboardWorkflows} className="flex items-center gap-1 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{workflow.name}</h1>
          <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
            workflow.status === "on" ? "bg-green-500/20 text-green-400" :
            workflow.status === "off" ? "bg-yellow-500/20 text-yellow-400" :
            "bg-white/10 text-white/50"
          }`}>
            {workflow.status === "on" ? "Active" : workflow.status === "off" ? "Paused" : "Draft"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={testRun}
            className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent hover:bg-accent/20"
          >
            <PlayCircle className="h-4 w-4" /> Test run
          </button>
          <button
            type="button"
            onClick={toggle}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            {workflow.status === "on" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {workflow.status === "on" ? "Pause" : "Turn on"}
          </button>
          <button
            type="button"
            onClick={remove}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

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
          <p className="font-display text-2xl font-bold">
            {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : "—"}
          </p>
          <p className="text-xs text-white/40">Last run</p>
        </div>
      </div>
    </div>
  );
}
