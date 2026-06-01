"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { getTables, saveTables, type Table } from "@/lib/store";
import { Table2, Plus } from "lucide-react";

export default function TablesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TablesContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function TablesContent() {
  const { session } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    if (session) setTables(getTables(session.userId));
  }, [session]);

  const createTable = () => {
    if (!session) return;
    const table: Table = {
      id: `tbl-${Date.now()}`,
      name: `Table ${tables.length + 1}`,
      rows: 0,
      columns: ["Name", "Status", "Updated"],
      updatedAt: new Date().toISOString(),
    };
    const updated = [...tables, table];
    setTables(updated);
    saveTables(session.userId, updated);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Tables</h1>
          <p className="mt-1 text-sm text-white/50">Store and sync data for your workflows</p>
        </div>
        <button type="button" onClick={createTable} className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> New table
        </button>
      </div>

      {tables.length === 0 ? (
        <EmptyState icon={Table2} title="No tables yet" description="Create spreadsheet-like tables that your workflows can read and update." actionLabel="Create table" onAction={createTable} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((t) => (
            <div key={t.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <Table2 className="h-6 w-6 text-blue-400" />
              <h3 className="mt-3 font-display font-semibold">{t.name}</h3>
              <p className="mt-1 text-xs text-white/40">{t.columns.length} columns · {t.rows} rows</p>
              <p className="mt-2 text-[10px] text-white/30">Updated {new Date(t.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
