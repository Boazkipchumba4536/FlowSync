"use client";

import { motion } from "framer-motion";
import { Bot, Users, ArrowRight, Activity } from "lucide-react";
import { BENTO_FEATURES } from "@/lib/constants";

function DiagramVisual() {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {["MCP", "FlowSync", "9K Apps"].map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <motion.div
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            {label}
          </motion.div>
          {i < 2 && (
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            >
              <ArrowRight className="h-4 w-4 text-accent" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

function AgentVisual() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Bot className="h-16 w-16 text-accent" />
      </motion.div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <p className="text-xs text-white/40">Processing tasks...</p>
    </div>
  );
}

function OrgVisual() {
  const teams = ["Marketing", "Sales", "Ops", "IT"];
  return (
    <div className="py-4">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-accent/50 bg-accent/10">
        <Users className="h-5 w-5 text-accent" />
      </div>
      <div className="flex justify-center gap-2">
        {teams.map((team, i) => (
          <motion.div
            key={team}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] text-white/60"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {team}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AuditVisual() {
  const rows = [
    { action: "Email summarized", user: "AI Agent", time: "2s ago" },
    { action: "Slack message sent", user: "Workflow", time: "5s ago" },
    { action: "Lead scored", user: "Agent", time: "12s ago" },
    { action: "Ticket created", user: "Chatbot", time: "18s ago" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="grid grid-cols-3 gap-2 border-b border-white/10 bg-white/5 px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
        <span>Action</span>
        <span>Source</span>
        <span>Time</span>
      </div>
      {rows.map((row, i) => (
        <motion.div
          key={row.action}
          className="grid grid-cols-3 gap-2 border-b border-white/5 px-3 py-2 text-xs text-white/60 last:border-0"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
        >
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3 text-accent" />
            {row.action}
          </span>
          <span>{row.user}</span>
          <span className="text-white/40">{row.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

function CardVisual({ type }: { type: string }) {
  switch (type) {
    case "diagram":
      return <DiagramVisual />;
    case "agent":
      return <AgentVisual />;
    case "org":
      return <OrgVisual />;
    case "audit":
      return <AuditVisual />;
    default:
      return null;
  }
}

export default function BentoGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Every team has AI.{" "}
          <span className="text-accent">Now they need a system.</span>
        </motion.h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {BENTO_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all hover:border-accent/30 ${
                feature.wide ? "sm:col-span-2" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 via-transparent to-purple-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <h3 className="font-display text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-white/50">{feature.description}</p>
                <div className="mt-4">
                  <CardVisual type={feature.type} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
