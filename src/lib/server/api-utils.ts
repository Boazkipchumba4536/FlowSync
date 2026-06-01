import { NextResponse } from "next/server";
import type { SessionUser } from "@/lib/types";

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized(message = "Unauthorized") {
  return error(message, 401);
}

export function forbidden(message = "Forbidden") {
  return error(message, 403);
}

export function requireAuth(session: SessionUser | null): session is SessionUser {
  return session !== null;
}

export function requireAdmin(session: SessionUser | null): session is SessionUser {
  return session !== null && session.role === "admin";
}

export function parseActions(actions: unknown): string[] {
  if (Array.isArray(actions)) return actions.filter((a) => typeof a === "string");
  if (typeof actions === "string") {
    try {
      const parsed = JSON.parse(actions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function serializeWorkflow(w: {
  id: string;
  userId: string;
  name: string;
  status: string;
  trigger: string;
  actions: string;
  runs: number;
  lastRun: Date | null;
  createdAt: Date;
}) {
  return {
    id: w.id,
    userId: w.userId,
    name: w.name,
    status: w.status,
    trigger: w.trigger,
    actions: JSON.parse(w.actions) as string[],
    runs: w.runs,
    lastRun: w.lastRun?.toISOString(),
    createdAt: w.createdAt.toISOString(),
  };
}
