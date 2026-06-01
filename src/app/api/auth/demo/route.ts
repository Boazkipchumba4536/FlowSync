import { prisma } from "@/lib/prisma";
import {
  createToken,
  setSessionCookie,
  toSessionUser,
} from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json } from "@/lib/server/api-utils";
import { DEMO_EMAIL } from "@/lib/types";

export async function POST() {
  let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (!user) {
    const bcrypt = await import("bcryptjs");
    user = await prisma.user.create({
      data: {
        name: "Demo User",
        email: DEMO_EMAIL,
        password: await bcrypt.hash("demo123", 12),
        plan: "pro",
        role: "user",
        status: "active",
      },
    });
  }

  const session = toSessionUser(user);
  const token = await createToken(session);
  await setSessionCookie(token);
  await addAuditLog("login", "Demo account accessed", user.id);

  return json({ user: session });
}
