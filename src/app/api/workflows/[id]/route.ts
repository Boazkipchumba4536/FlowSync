import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import {
  json,
  unauthorized,
  error,
  parseActions,
  serializeWorkflow,
} from "@/lib/server/api-utils";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const workflow = await prisma.workflow.findFirst({
    where: { id: params.id, userId: session.userId },
  });

  if (!workflow) return error("Workflow not found", 404);
  return json({ workflow: serializeWorkflow(workflow) });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  try {
    const existing = await prisma.workflow.findFirst({
      where: { id: params.id, userId: session.userId },
    });
    if (!existing) return error("Workflow not found", 404);

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.name?.trim()) data.name = body.name.trim();
    if (body.trigger) data.trigger = body.trigger;
    if (body.actions) data.actions = JSON.stringify(parseActions(body.actions));
    if (["on", "off", "draft"].includes(body.status)) data.status = body.status;

    const workflow = await prisma.workflow.update({
      where: { id: params.id },
      data,
    });

    await addAuditLog("workflow_update", `Workflow updated: ${workflow.name}`, session.userId);
    return json({ workflow: serializeWorkflow(workflow) });
  } catch (e) {
    console.error("Update workflow error:", e);
    return error("Internal server error", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const existing = await prisma.workflow.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!existing) return error("Workflow not found", 404);

  await prisma.workflow.delete({ where: { id: params.id } });
  await addAuditLog("workflow_delete", `Workflow deleted: ${existing.name}`, session.userId);

  return json({ ok: true });
}
