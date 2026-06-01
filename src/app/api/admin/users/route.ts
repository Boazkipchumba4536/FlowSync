import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return error("Forbidden", 403);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { workflows: true } } },
  });

  return json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      plan: u.plan,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt.toISOString(),
      workflowCount: u._count.workflows,
    })),
  });
}
