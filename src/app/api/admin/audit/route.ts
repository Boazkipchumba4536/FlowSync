import { getSessionUser } from "@/lib/server/session";
import { getAuditLogs } from "@/lib/server/audit";
import { json, error } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return error("Forbidden", 403);

  const logs = await getAuditLogs(200);

  return json({
    logs: logs.map((a) => ({
      id: a.id,
      type: a.type,
      message: a.message,
      userId: a.userId,
      timestamp: a.createdAt.toISOString(),
    })),
  });
}
