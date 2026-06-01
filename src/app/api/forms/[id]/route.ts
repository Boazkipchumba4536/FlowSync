import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const form = await prisma.form.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!form) return error("Form not found", 404);

  const { status } = await req.json();
  const newStatus = status === "published" ? "published" : "draft";
  const updated = await prisma.form.update({
    where: { id: params.id },
    data: { status: newStatus },
  });

  await addAuditLog(
    "form_update",
    `Form "${updated.name}" ${newStatus === "published" ? "published" : "unpublished"}`,
    session.userId
  );

  return json({
    form: {
      id: updated.id,
      name: updated.name,
      fields: updated.fields,
      submissions: updated.submissions,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
    },
  });
}
