import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { json, error } from "@/lib/server/api-utils";

async function getSetting(key: string, fallback: boolean) {
  const row = await prisma.platformSetting.findUnique({ where: { key } });
  if (!row) return fallback;
  return row.value === "true";
}

export async function GET() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return error("Forbidden", 403);

  const [signupEnabled, maintenanceMode] = await Promise.all([
    getSetting("signup_enabled", true),
    getSetting("maintenance_mode", false),
  ]);

  return json({ signupEnabled, maintenanceMode });
}

export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return error("Forbidden", 403);

  const { signupEnabled, maintenanceMode } = await req.json();

  if (typeof signupEnabled === "boolean") {
    await prisma.platformSetting.upsert({
      where: { key: "signup_enabled" },
      update: { value: String(signupEnabled) },
      create: { key: "signup_enabled", value: String(signupEnabled) },
    });
  }

  if (typeof maintenanceMode === "boolean") {
    await prisma.platformSetting.upsert({
      where: { key: "maintenance_mode" },
      update: { value: String(maintenanceMode) },
      create: { key: "maintenance_mode", value: String(maintenanceMode) },
    });
  }

  return json({ ok: true });
}
