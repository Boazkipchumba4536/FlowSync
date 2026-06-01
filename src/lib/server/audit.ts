import { prisma } from "@/lib/prisma";

export async function addAuditLog(
  type: string,
  message: string,
  userId?: string,
  metadata?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: {
      type,
      message,
      userId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

export async function getAuditLogs(limit = 100) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
