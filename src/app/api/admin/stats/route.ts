import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { getAuditLogs } from "@/lib/server/audit";
import { json, error } from "@/lib/server/api-utils";
import type { UserPlan } from "@/lib/types";

export async function GET() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return error("Forbidden", 403);

  const [users, workflows, runsAgg] = await Promise.all([
    prisma.user.findMany(),
    prisma.workflow.findMany(),
    prisma.runLog.count(),
  ]);

  const planBreakdown: Record<UserPlan, number> = {
    free: 0,
    pro: 0,
    team: 0,
    enterprise: 0,
  };

  users.forEach((u) => {
    const plan = u.plan as UserPlan;
    if (plan in planBreakdown) planBreakdown[plan]++;
  });

  const audit = await getAuditLogs(20);

  return json({
    stats: {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter((w) => w.status === "on").length,
      totalRuns: runsAgg,
      planBreakdown,
    },
    recentUsers: users.slice(-5).reverse().map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      plan: u.plan,
      createdAt: u.createdAt.toISOString(),
    })),
    audit: audit.map((a) => ({
      id: a.id,
      type: a.type,
      message: a.message,
      userId: a.userId,
      timestamp: a.createdAt.toISOString(),
    })),
  });
}
