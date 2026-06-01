"use client";

import { useEffect, useState, useCallback } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { agentApi } from "@/lib/services";
import type { AgentDTO } from "@/lib/types";
import { Bot, Plus } from "lucide-react";

export default function AgentsPage() {
  return (
    <AuthGuard><DashboardLayout><AgentsContent /></DashboardLayout></AuthGuard>
  );
}

function AgentsContent() {
  const [agents, setAgents] = useState<AgentDTO[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { agents: a } = await agentApi.list();
    setAgents(a);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const createAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await agentApi.create(name, description);
    setName(""); setDescription(""); setShowForm(false);
    load();
  };

  const toggleAgent = async (agent: AgentDTO) => {
    await agentApi.update(agent.id, agent.status === "active" ? "paused" : "active");
    load();
  };

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold">AI Agents</h1><p className="mt-1 text-sm text-white/50">Autonomous agents that take action</p></div>
        <button type="button" onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> New agent</button>
      </div>
      {showForm && (
        <form onSubmit={createAgent} className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Agent name" required className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-accent/50" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What should this agent do?" rows={2} className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-accent/50" />
          <button type="submit" className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">Create agent</button>
        </form>
      )}
      {agents.length === 0 ? (
        <EmptyState icon={Bot} title="No agents yet" description="Create AI agents that research leads, answer support tickets, and execute tasks." actionLabel="Create agent" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20"><Bot className="h-6 w-6 text-purple-400" /></div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${agent.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{agent.status}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{agent.name}</h3>
              <p className="mt-1 text-sm text-white/50">{agent.description}</p>
              <p className="mt-4 text-sm"><span className="font-display text-xl font-bold text-accent">{agent.tasksCompleted}</span> tasks completed</p>
              <button type="button" onClick={() => toggleAgent(agent)} className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">{agent.status === "active" ? "Pause" : "Activate"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
