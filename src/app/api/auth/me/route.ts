import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { json, unauthorized } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, plan: true, role: true, status: true, createdAt: true },
  });

  if (!user || user.status === "suspended") return unauthorized();

  return json({
    user: {
      userId: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      role: user.role,
    },
  });
}
