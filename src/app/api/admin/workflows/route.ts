import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { json, error, serializeWorkflow } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return error("Forbidden", 403);

  const workflows = await prisma.workflow.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return json({
    workflows: workflows.map((w) => ({
      ...serializeWorkflow(w),
      userName: w.user.name,
      userEmail: w.user.email,
    })),
  });
}
