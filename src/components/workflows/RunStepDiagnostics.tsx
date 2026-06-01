"use client";

import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import type { RunStepDTO } from "@/lib/types";

interface RunStepDiagnosticsProps {
  steps: RunStepDTO[];
  error?: string;
  title?: string;
}

export default function RunStepDiagnostics({ steps, error, title = "Run diagnostics" }: RunStepDiagnosticsProps) {
  if (steps.length === 0) return null;

  const retriedSteps = steps.filter((s) => (s.attempts ?? 1) > 1).length;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-white">{title}</p>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>{steps.length} steps</span>
          {retriedSteps > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-yellow-400">
              <RotateCcw className="h-3 w-3" />
              {retriedSteps} retried
            </span>
          )}
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {steps.map((step, index) => {
          const attempts = step.attempts ?? 1;
          const retried = attempts > 1;
          return (
            <div key={`${step.step}-${index}`} className="flex items-start gap-3 px-4 py-3">
              {step.status === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-white">{step.step}</p>
                  {retried && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                        step.status === "success"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {attempts} attempts
                    </span>
                  )}
                </div>
                {step.output && <p className="mt-1 text-xs text-white/45">{step.output}</p>}
              </div>
            </div>
          );
        })}
      </div>
      {error && (
        <div className="border-t border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
    </div>
  );
}
