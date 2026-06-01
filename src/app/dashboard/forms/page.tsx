"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { formApi } from "@/lib/services";
import type { FormDTO } from "@/lib/types";
import { FileText } from "lucide-react";

export default function FormsPage() {
  return <AuthGuard><DashboardLayout><FormsContent /></DashboardLayout></AuthGuard>;
}

function FormsContent() {
  const [forms, setForms] = useState<FormDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => formApi.list().then(({ forms: f }) => setForms(f)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const create = async () => { await formApi.create(); load(); };

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold">Forms</h1><p className="mt-1 text-sm text-white/50">Capture inputs that trigger workflows</p></div>
        <button type="button" onClick={create} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">+ New form</button>
      </div>
      {forms.length === 0 ? (
        <EmptyState icon={FileText} title="No forms yet" description="Build forms that instantly trigger your workflows when submitted." actionLabel="Create form" onAction={create} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {forms.map((f) => (
            <div key={f.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-3">
                <FileText className="h-6 w-6 text-pink-400" />
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${f.status === "published" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"}`}>
                  {f.status}
                </span>
              </div>
              <h3 className="mt-3 font-display font-semibold">{f.name}</h3>
              <p className="mt-1 text-xs text-white/40">{f.fields} fields · {f.submissions} submissions</p>
              <button
                type="button"
                onClick={async () => {
                  await formApi.update(f.id, f.status === "published" ? "draft" : "published");
                  load();
                }}
                className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                {f.status === "published" ? "Unpublish" : "Publish"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
