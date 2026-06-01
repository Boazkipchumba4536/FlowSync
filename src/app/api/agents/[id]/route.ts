import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const agent = await prisma.agent.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!agent) return error("Agent not found", 404);

  const { status } = await req.json();
  const newStatus = status === "paused" ? "paused" : "active";
  const updated = await prisma.agent.update({
    where: { id: params.id },
    data: { status: newStatus },
  });

  await addAuditLog(
    "agent_update",
    `Agent "${updated.name}" ${newStatus === "active" ? "activated" : "paused"}`,
    session.userId
  );

  return json({
    agent: {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      status: updated.status,
      tasksCompleted: updated.tasksCompleted,
      createdAt: updated.createdAt.toISOString(),
    },
  });
}
