import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const agents = await prisma.agent.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return json({
    agents: agents.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      status: a.status,
      tasksCompleted: a.tasksCompleted,
      createdAt: a.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const { name, description } = await req.json();
  if (!name?.trim()) return error("Name is required");

  const agent = await prisma.agent.create({
    data: {
      userId: session.userId,
      name: name.trim(),
      description: description?.trim() || "",
    },
  });

  await addAuditLog("agent_create", `Agent created: ${agent.name}`, session.userId);

  return json({
    agent: {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      status: agent.status,
      tasksCompleted: agent.tasksCompleted,
      createdAt: agent.createdAt.toISOString(),
    },
  }, 201);
}
