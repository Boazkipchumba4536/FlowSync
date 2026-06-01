"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { getForms, saveForms, type Form } from "@/lib/store";
import { FileText, Plus } from "lucide-react";

export default function FormsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <FormsContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function FormsContent() {
  const { session } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    if (session) setForms(getForms(session.userId));
  }, [session]);

  const createForm = () => {
    if (!session) return;
    const form: Form = {
      id: `frm-${Date.now()}`,
      name: `Form ${forms.length + 1}`,
      fields: 3,
      submissions: 0,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    const updated = [...forms, form];
    setForms(updated);
    saveForms(session.userId, updated);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Forms</h1>
          <p className="mt-1 text-sm text-white/50">Capture inputs that trigger workflows</p>
        </div>
        <button type="button" onClick={createForm} className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> New form
        </button>
      </div>

      {forms.length === 0 ? (
        <EmptyState icon={FileText} title="No forms yet" description="Build forms that instantly trigger your workflows when submitted." actionLabel="Create form" onAction={createForm} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {forms.map((f) => (
            <div key={f.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <FileText className="h-6 w-6 text-pink-400" />
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${f.status === "published" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"}`}>{f.status}</span>
              </div>
              <h3 className="mt-3 font-display font-semibold">{f.name}</h3>
              <p className="mt-1 text-xs text-white/40">{f.fields} fields · {f.submissions} submissions</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
