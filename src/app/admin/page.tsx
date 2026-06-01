"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminApi } from "@/lib/services";
import type { PlatformStats } from "@/lib/types";
import { Users, Workflow, Zap, TrendingUp } from "lucide-react";

export default function AdminOverviewPage() {
  return <AdminGuard><AdminLayout><AdminOverview /></AdminLayout></AdminGuard>;
}

function AdminOverview() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<{ name: string; email: string; plan: string }[]>([]);
  const [audit, setAudit] = useState<{ message: string; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.stats().then((data) => {
      setStats(data.stats);
      setRecentUsers(data.recentUsers);
      setAudit(data.audit);
    }).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" /></div>;

  const cards = [
    { label: "Total users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Active workflows", value: stats.activeWorkflows, icon: Workflow, color: "text-accent" },
    { label: "Total runs", value: stats.totalRuns.toLocaleString(), icon: TrendingUp, color: "text-green-400" },
    { label: "Integrations", value: "12", icon: Zap, color: "text-purple-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Platform overview</h1>
      <p className="mt-1 text-white/50">Monitor and manage the entire FlowSync platform.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <Icon className={`h-6 w-6 ${color}`} />
            <p className="mt-4 font-display text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-white/50">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-lg font-semibold">Plan breakdown</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(stats.planBreakdown).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <span className="capitalize text-white/70">{plan}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${stats.totalUsers ? (count / stats.totalUsers) * 100 : 0}%` }} />
                  </div>
                  <span className="w-6 text-right text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-lg font-semibold">Recent signups</h2>
          <div className="mt-4 space-y-3">
            {recentUsers.map((u) => (
              <div key={u.email} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <div><p className="text-sm font-medium text-white">{u.name}</p><p className="text-xs text-white/40">{u.email}</p></div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase">{u.plan}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg font-semibold">Recent activity</h2>
        <div className="mt-4 space-y-2">
          {audit.map((entry) => (
            <div key={entry.timestamp + entry.message} className="flex items-center justify-between py-2 text-sm">
              <span className="text-white/70">{entry.message}</span>
              <span className="text-xs text-white/40">{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
