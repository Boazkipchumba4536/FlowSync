"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { getAgents, saveAgents, type Agent } from "@/lib/store";
import { Bot, Plus } from "lucide-react";

export default function AgentsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <AgentsContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function AgentsContent() {
  const { session } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (session) setAgents(getAgents(session.userId));
  }, [session]);

  const createAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !name.trim()) return;
    const agent: Agent = {
      id: `ag-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || "AI agent",
      status: "active",
      tasksCompleted: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...agents, agent];
    setAgents(updated);
    saveAgents(session.userId, updated);
    setName("");
    setDescription("");
    setShowForm(false);
  };

  const toggleAgent = (id: string) => {
    if (!session) return;
    const updated = agents.map((a) =>
      a.id === id ? { ...a, status: a.status === "active" ? "paused" as const : "active" as const } : a
    );
    setAgents(updated);
    saveAgents(session.userId, updated);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">AI Agents</h1>
          <p className="mt-1 text-sm text-white/50">Autonomous agents that take action across your apps</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" /> New agent
        </button>
      </div>

      {showForm && (
        <form onSubmit={createAgent} className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Agent name"
            required
            className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-accent/50"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should this agent do?"
            rows={2}
            className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-accent/50"
          />
          <button type="submit" className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
            Create agent
          </button>
        </form>
      )}

      {agents.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No agents yet"
          description="Create AI agents that research leads, answer support tickets, and execute multi-step tasks."
          actionLabel="Create agent"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                  <Bot className="h-6 w-6 text-purple-400" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${agent.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {agent.status}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{agent.name}</h3>
              <p className="mt-1 text-sm text-white/50">{agent.description}</p>
              <p className="mt-4 text-sm text-white/70">
                <span className="font-display text-xl font-bold text-accent">{agent.tasksCompleted}</span> tasks completed
              </p>
              <button
                type="button"
                onClick={() => toggleAgent(agent.id)}
                className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                {agent.status === "active" ? "Pause" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
