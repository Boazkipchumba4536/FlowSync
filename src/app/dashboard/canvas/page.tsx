"use client";

import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ROUTES } from "@/lib/routes";
import { PenTool, Sparkles } from "lucide-react";

export default function CanvasPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div>
          <h1 className="font-display text-2xl font-bold">Canvas</h1>
          <p className="mt-1 text-sm text-white/50">Plan and map workflows visually with AI</p>

          <div className="relative mt-8 min-h-[400px] overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D14]">
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
            <div className="relative flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
              <PenTool className="h-12 w-12 text-accent/50" />
              <h2 className="mt-4 font-display text-xl font-semibold">Visual workflow canvas</h2>
              <p className="mt-2 max-w-md text-sm text-white/50">
                Drag triggers, actions, and AI steps onto the canvas. Export directly to a live workflow.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {["Trigger", "Filter", "AI Step", "Action", "Path"].map((node) => (
                  <div key={node} className="rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-2 text-xs text-white/60">
                    + {node}
                  </div>
                ))}
              </div>
              <Link
                href={ROUTES.dashboardWorkflowNew}
                className="mt-8 flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                <Sparkles className="h-4 w-4" /> Export to workflow
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
