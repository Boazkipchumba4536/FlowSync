import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { json, error } from "@/lib/server/api-utils";

export async function GET() {
  const integrations = await prisma.integration.findMany({ orderBy: { name: "asc" } });
  return json({
    integrations: integrations.map((i) => ({
      id: i.id,
      name: i.name,
      icon: i.icon,
      color: i.color,
      category: i.category,
      enabled: i.enabled,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return error("Forbidden", 403);
  }

  const { id, enabled } = await req.json();
  const integration = await prisma.integration.update({
    where: { id },
    data: { enabled: Boolean(enabled) },
  });

  return json({ integration });
}
