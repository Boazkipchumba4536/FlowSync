import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const forms = await prisma.form.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return json({
    forms: forms.map((f) => ({
      id: f.id,
      name: f.name,
      fields: f.fields,
      submissions: f.submissions,
      status: f.status,
      createdAt: f.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const { name } = await req.json();
  const form = await prisma.form.create({
    data: {
      userId: session.userId,
      name: name?.trim() || `Form ${Date.now()}`,
    },
  });

  await addAuditLog("form_create", `Form created: ${form.name}`, session.userId);

  return json({
    form: {
      id: form.id,
      name: form.name,
      fields: form.fields,
      submissions: form.submissions,
      status: form.status,
      createdAt: form.createdAt.toISOString(),
    },
  }, 201);
}
