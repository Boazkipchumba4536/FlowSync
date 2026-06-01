"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminApi } from "@/lib/services";

export default function AdminAuditPage() {
  return <AdminGuard><AdminLayout><AuditLog /></AdminLayout></AdminGuard>;
}

function AuditLog() {
  const [logs, setLogs] = useState<{ id: string; type: string; message: string; timestamp: string }[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.audit().then(({ logs: l }) => setLogs(l)).finally(() => setLoading(false));
  }, []);

  const types = ["all", ...Array.from(new Set(logs.map((l) => l.type)))];
  const filtered = filter === "all" ? logs : logs.filter((l) => l.type === filter);

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Audit log</h1>
      <p className="mt-1 text-white/50">Platform-wide activity and security events</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {types.map((t) => (
          <button key={t} type="button" onClick={() => setFilter(t)} className={`rounded-full px-3 py-1 text-xs capitalize ${filter === t ? "bg-red-500/20 text-red-400" : "border border-white/10 text-white/50"}`}>{t}</button>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-4 gap-4 border-b border-white/10 bg-white/5 px-4 py-3 text-xs font-medium uppercase tracking-wider text-white/40">
          <span className="col-span-2">Event</span><span>Type</span><span>Time</span>
        </div>
        {filtered.map((entry) => (
          <div key={entry.id} className="grid grid-cols-4 gap-4 border-b border-white/5 px-4 py-3 last:border-0">
            <span className="col-span-2 text-sm text-white/80">{entry.message}</span>
            <span className="text-xs capitalize text-white/50">{entry.type.replace("_", " ")}</span>
            <span className="text-xs text-white/40">{new Date(entry.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
