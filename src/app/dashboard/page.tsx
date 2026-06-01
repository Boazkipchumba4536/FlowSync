"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { workflowApi, appApi, agentApi, historyApi } from "@/lib/services";
import { ROUTES } from "@/lib/routes";
import { Workflow, Plug, Bot, TrendingUp, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function DashboardContent() {
  const { session } = useAuth();
  const [stats, setStats] = useState({ workflows: 0, apps: 0, agents: 0, runs: 0 });
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    Promise.all([workflowApi.list(), appApi.list(), agentApi.list(), historyApi.list()])
      .then(([w, a, ag, h]) => {
        setStats({
          workflows: w.workflows.length,
          apps: a.apps.length,
          agents: ag.agents.length,
          runs: h.logs.length,
        });
        setIsNew(w.workflows.length === 0 && a.apps.length === 0);
      })
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: "Workflows", value: stats.workflows, icon: Workflow, href: ROUTES.dashboardWorkflows, color: "text-accent" },
    { label: "Connected apps", value: stats.apps, icon: Plug, href: ROUTES.dashboardApps, color: "text-blue-400" },
    { label: "AI agents", value: stats.agents, icon: Bot, href: ROUTES.dashboardAgents, color: "text-purple-400" },
    { label: "Task runs", value: stats.runs, icon: TrendingUp, href: ROUTES.dashboardHistory, color: "text-green-400" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Welcome{session?.name ? `, ${session.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-white/50">
          {isNew ? "Let's automate your first workflow." : "Your automation command center."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-accent/30 hover:bg-accent/5">
            <Icon className={`h-6 w-6 ${color}`} />
            <p className="mt-4 font-display text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-white/50">{label}</p>
          </Link>
        ))}
      </div>

      {isNew ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { step: "1", title: "Connect an app", desc: "Link Gmail, Slack, HubSpot, and more.", href: ROUTES.dashboardApps },
            { step: "2", title: "Build a workflow", desc: "Pick a trigger and chain actions with AI.", href: ROUTES.dashboardWorkflowNew },
            { step: "3", title: "Turn it on", desc: "Publish and watch tasks run automatically.", href: ROUTES.dashboardWorkflows },
          ].map(({ step, title, desc, href }) => (
            <Link key={step} href={href} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-accent/30">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">{step}</span>
              <h3 className="mt-4 font-display font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-white/50">{desc}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-white/10 bg-gradient-to-br from-accent/10 to-purple-600/10 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Create another workflow</h2>
              <p className="mt-1 text-sm text-white/60">Automate more tasks across your connected apps.</p>
              <Link href={ROUTES.dashboardWorkflowNew} className="mt-4 inline-block rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover">
                + New workflow
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
