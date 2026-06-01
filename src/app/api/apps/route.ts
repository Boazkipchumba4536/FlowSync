import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const apps = await prisma.connectedApp.findMany({
    where: { userId: session.userId },
    orderBy: { connectedAt: "desc" },
  });

  return json({
    apps: apps.map((a) => ({
      id: a.id,
      appId: a.appId,
      name: a.name,
      icon: a.icon,
      color: a.color,
      connectedAt: a.connectedAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  try {
    const { appId } = await req.json();
    if (!appId) return error("appId is required");

    const integration = await prisma.integration.findUnique({ where: { id: appId } });
    if (!integration || !integration.enabled) {
      return error("Integration not available", 404);
    }

    const existing = await prisma.connectedApp.findUnique({
      where: { userId_appId: { userId: session.userId, appId } },
    });
    if (existing) return error("App already connected", 409);

    const app = await prisma.connectedApp.create({
      data: {
        userId: session.userId,
        appId: integration.id,
        name: integration.name,
        icon: integration.icon,
        color: integration.color,
      },
    });

    await addAuditLog("app_connect", `Connected ${integration.name}`, session.userId);

    return json({
      app: {
        id: app.id,
        appId: app.appId,
        name: app.name,
        icon: app.icon,
        color: app.color,
        connectedAt: app.connectedAt.toISOString(),
      },
    }, 201);
  } catch (e) {
    console.error("Connect app error:", e);
    return error("Internal server error", 500);
  }
}
