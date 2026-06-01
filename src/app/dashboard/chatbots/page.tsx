"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { getChatbots, saveChatbots, type Chatbot } from "@/lib/store";
import { MessageSquare, Plus } from "lucide-react";

export default function ChatbotsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ChatbotsContent />
      </DashboardLayout>
    </AuthGuard>
  );
}

function ChatbotsContent() {
  const { session } = useAuth();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);

  useEffect(() => {
    if (session) setChatbots(getChatbots(session.userId));
  }, [session]);

  const createChatbot = () => {
    if (!session) return;
    const bot: Chatbot = {
      id: `bot-${Date.now()}`,
      name: `Chatbot ${chatbots.length + 1}`,
      channel: "Web",
      conversations: 0,
      status: "draft",
    };
    const updated = [...chatbots, bot];
    setChatbots(updated);
    saveChatbots(session.userId, updated);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Chatbots</h1>
          <p className="mt-1 text-sm text-white/50">AI chatbots trained on your knowledge base</p>
        </div>
        <button type="button" onClick={createChatbot} className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> New chatbot
        </button>
      </div>

      {chatbots.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No chatbots yet" description="Deploy AI chatbots on web, Slack, and more to answer customer questions instantly." actionLabel="Create chatbot" onAction={createChatbot} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {chatbots.map((b) => (
            <div key={b.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <MessageSquare className="h-6 w-6 text-green-400" />
              <h3 className="mt-3 font-display font-semibold">{b.name}</h3>
              <p className="mt-1 text-xs text-white/40">{b.channel} · {b.conversations} conversations</p>
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase ${b.status === "live" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"}`}>{b.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
