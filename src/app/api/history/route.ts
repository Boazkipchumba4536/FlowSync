import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { json, unauthorized } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const logs = await prisma.runLog.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return json({
    logs: logs.map((l) => ({
      id: l.id,
      workflowId: l.workflowId,
      workflowName: l.workflowName,
      status: l.status,
      timestamp: l.createdAt.toISOString(),
      duration: l.duration,
      steps: JSON.parse(l.steps),
      error: l.error,
    })),
  });
}
