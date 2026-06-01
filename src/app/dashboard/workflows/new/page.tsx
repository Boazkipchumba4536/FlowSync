"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getWorkflows, saveWorkflows } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

const TRIGGERS = ["New email in Gmail", "New Slack message", "New HubSpot contact", "New form submission", "Schedule (daily)"];
const ACTIONS = ["Send Slack message", "AI Summarize", "Create CRM record", "Send email", "Update spreadsheet", "Run AI agent"];

export default function NewWorkflowPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <NewWorkflowContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function NewWorkflowContent() {
  const { session } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [steps, setSteps] = useState<string[]>([ACTIONS[0]]);

  const addStep = () => setSteps([...steps, ACTIONS[0]]);
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, val: string) => setSteps(steps.map((s, idx) => (idx === i ? val : s)));

  const handleSave = (publish: boolean) => {
    if (!session || !name.trim()) return;
    const workflows = getWorkflows(session.userId);
    const newWf = {
      id: `wf-${Date.now()}`,
      userId: session.userId,
      name: name.trim(),
      status: publish ? "on" as const : "draft" as const,
      trigger,
      actions: steps,
      runs: 0,
      createdAt: new Date().toISOString(),
    };
    saveWorkflows(session.userId, [...workflows, newWf]);
    router.push(ROUTES.workflow(newWf.id));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Create workflow</h1>
      <p className="mt-1 text-sm text-white/50">Build an automation step by step</p>

      <div className="mt-8 space-y-6">
        <div>
          <label className="mb-1.5 block text-sm text-white/70">Workflow name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My awesome workflow"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-accent/50"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Trigger</p>
          <select
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
          >
            {TRIGGERS.map((t) => (
              <option key={t} value={t} className="bg-background">{t}</option>
            ))}
          </select>
        </div>

        {steps.map((step, i) => (
          <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Action {i + 1}
              </p>
              {steps.length > 1 && (
                <button type="button" onClick={() => removeStep(i)} className="text-white/40 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <select
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
            >
              {ACTIONS.map((a) => (
                <option key={a} value={a} className="bg-background">{a}</option>
              ))}
            </select>
            {i < steps.length - 1 && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <ArrowRight className="h-4 w-4 rotate-90 text-accent" />
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addStep}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-3 text-sm text-white/50 hover:border-accent/30 hover:text-accent"
        >
          <Plus className="h-4 w-4" /> Add action
        </button>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={!name.trim()}
          className="flex-1 rounded-full border border-white/20 py-3 text-sm font-semibold text-white hover:border-accent/50 disabled:opacity-50"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={!name.trim()}
          className="cta-glow flex-1 rounded-full bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
