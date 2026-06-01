import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return error("Forbidden", 403);

  const body = await req.json();

  if (params.id === session.userId && body.role && body.role !== "admin") {
    return error("Cannot demote yourself", 400);
  }

  const data: Record<string, string> = {};
  if (body.plan) data.plan = body.plan;
  if (body.role) data.role = body.role;
  if (body.status) data.status = body.status;

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
  });

  await addAuditLog("user_update", `Admin updated user ${user.email}`, session.userId);

  return json({ user: { id: user.id, plan: user.plan, role: user.role, status: user.status } });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return error("Forbidden", 403);

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return error("User not found", 404);
  if (user.role === "admin" && user.email === "admin@flowsync.io") {
    return error("Cannot delete primary admin", 400);
  }

  await prisma.user.delete({ where: { id: params.id } });
  await addAuditLog("user_delete", `Admin deleted user ${user.email}`, session.userId);

  return json({ ok: true });
}
