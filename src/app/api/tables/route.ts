import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const tables = await prisma.table.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
  });

  return json({
    tables: tables.map((t) => ({
      id: t.id,
      name: t.name,
      rows: t.rows,
      columns: JSON.parse(t.columns),
      updatedAt: t.updatedAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const { name, columns } = await req.json();
  const table = await prisma.table.create({
    data: {
      userId: session.userId,
      name: name?.trim() || `Table ${Date.now()}`,
      columns: JSON.stringify(columns || ["Name", "Status", "Updated"]),
    },
  });

  await addAuditLog("table_create", `Table created: ${table.name}`, session.userId);

  return json({
    table: {
      id: table.id,
      name: table.name,
      rows: table.rows,
      columns: JSON.parse(table.columns),
      updatedAt: table.updatedAt.toISOString(),
    },
  }, 201);
}
