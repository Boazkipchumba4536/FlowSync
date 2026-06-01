"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { tableApi } from "@/lib/services";
import type { TableDTO } from "@/lib/types";
import { Table2 } from "lucide-react";

export default function TablesPage() {
  return <AuthGuard><DashboardLayout><TablesContent /></DashboardLayout></AuthGuard>;
}

function TablesContent() {
  const [tables, setTables] = useState<TableDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => tableApi.list().then(({ tables: t }) => setTables(t)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const create = async () => { await tableApi.create(); load(); };

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold">Tables</h1><p className="mt-1 text-sm text-white/50">Store and sync data for workflows</p></div>
        <button type="button" onClick={create} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">+ New table</button>
      </div>
      {tables.length === 0 ? (
        <EmptyState icon={Table2} title="No tables yet" description="Create spreadsheet-like tables your workflows can read and update." actionLabel="Create table" onAction={create} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((t) => (
            <div key={t.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <Table2 className="h-6 w-6 text-blue-400" />
              <h3 className="mt-3 font-display font-semibold">{t.name}</h3>
              <p className="mt-1 text-xs text-white/40">{t.columns.length} columns · {t.rows} rows</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
