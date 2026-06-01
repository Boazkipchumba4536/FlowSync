import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const app = await prisma.connectedApp.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!app) return error("App not found", 404);

  await prisma.connectedApp.delete({ where: { id: params.id } });
  await addAuditLog("app_disconnect", `Disconnected ${app.name}`, session.userId);

  return json({ ok: true });
}
