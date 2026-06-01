"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { chatbotApi } from "@/lib/services";
import type { ChatbotDTO } from "@/lib/types";
import { MessageSquare } from "lucide-react";

export default function ChatbotsPage() {
  return <AuthGuard><DashboardLayout><ChatbotsContent /></DashboardLayout></AuthGuard>;
}

function ChatbotsContent() {
  const [chatbots, setChatbots] = useState<ChatbotDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => chatbotApi.list().then(({ chatbots: b }) => setChatbots(b)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const create = async () => { await chatbotApi.create(); load(); };

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold">Chatbots</h1><p className="mt-1 text-sm text-white/50">AI chatbots for customer support</p></div>
        <button type="button" onClick={create} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">+ New chatbot</button>
      </div>
      {chatbots.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No chatbots yet" description="Deploy AI chatbots on web, Slack, and more." actionLabel="Create chatbot" onAction={create} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {chatbots.map((b) => (
            <div key={b.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-3">
                <MessageSquare className="h-6 w-6 text-green-400" />
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${b.status === "live" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"}`}>
                  {b.status}
                </span>
              </div>
              <h3 className="mt-3 font-display font-semibold">{b.name}</h3>
              <p className="mt-1 text-xs text-white/40">{b.channel} · {b.conversations} conversations</p>
              <button
                type="button"
                onClick={async () => {
                  await chatbotApi.update(b.id, b.status === "live" ? "draft" : "live");
                  load();
                }}
                className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                {b.status === "live" ? "Set to draft" : "Go live"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
