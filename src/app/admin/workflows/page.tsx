"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminApi } from "@/lib/services";
import type { WorkflowDTO } from "@/lib/types";

export default function AdminWorkflowsPage() {
  return <AdminGuard><AdminLayout><WorkflowsManager /></AdminLayout></AdminGuard>;
}

function WorkflowsManager() {
  const [workflows, setWorkflows] = useState<(WorkflowDTO & { userName: string; userEmail: string })[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.workflows().then(({ workflows: w }) => setWorkflows(w)).finally(() => setLoading(false));
  }, []);

  const filtered = workflows.filter((w) => filter === "all" || w.status === filter);

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-display text-2xl font-bold">All workflows</h1><p className="mt-1 text-white/50">{workflows.length} workflows across all users</p></div>
        <div className="flex gap-2">{["all", "on", "off", "draft"].map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-xs capitalize ${filter === f ? "bg-accent text-white" : "border border-white/10 text-white/50"}`}>{f}</button>
        ))}</div>
      </div>
      <div className="mt-8 space-y-3">
        {filtered.map((wf) => (
          <div key={`${wf.userId}-${wf.id}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-white">{wf.name}</p>
                <p className="mt-1 text-xs text-white/40">{wf.trigger} → {wf.actions.join(" → ")}</p>
                <p className="mt-2 text-xs text-white/50">Owner: {wf.userName} ({wf.userEmail})</p>
              </div>
              <div className="text-right">
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${wf.status === "on" ? "bg-green-500/20 text-green-400" : wf.status === "off" ? "bg-yellow-500/20 text-yellow-400" : "bg-white/10 text-white/50"}`}>{wf.status}</span>
                <p className="mt-2 text-sm text-white/70">{wf.runs.toLocaleString()} runs</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-12 text-center text-white/40">No workflows found.</p>}
      </div>
    </div>
  );
}
