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

export async function GET() {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const workflows = await prisma.workflow.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
  });

  return json({ workflows: workflows.map(serializeWorkflow) });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const { name, trigger, actions, status } = body;

    if (!name?.trim() || !trigger) {
      return error("Name and trigger are required");
    }

    const actionList = parseActions(actions);
    if (actionList.length === 0) {
      return error("At least one action is required");
    }

    const freeLimit = 5;
    if (session.plan === "free") {
      const count = await prisma.workflow.count({ where: { userId: session.userId } });
      if (count >= freeLimit) {
        return error(`Free plan limited to ${freeLimit} workflows. Upgrade to add more.`, 403);
      }
    }

    const workflow = await prisma.workflow.create({
      data: {
        userId: session.userId,
        name: name.trim(),
        trigger,
        actions: JSON.stringify(actionList),
        status: status === "on" ? "on" : status === "off" ? "off" : "draft",
      },
    });

    await addAuditLog("workflow_create", `Workflow created: ${workflow.name}`, session.userId);

    return json({ workflow: serializeWorkflow(workflow) }, 201);
  } catch (e) {
    console.error("Create workflow error:", e);
    return error("Internal server error", 500);
  }
}
