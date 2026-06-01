import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createToken,
  setSessionCookie,
  verifyPassword,
  toSessionUser,
} from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, error } from "@/lib/server/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return error("Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return error("Invalid email or password", 401);
    }

    if (user.status === "suspended") {
      return error("Your account has been suspended. Contact support.", 403);
    }

    const session = toSessionUser(user);
    const token = await createToken(session);
    await setSessionCookie(token);
    await addAuditLog("login", `User signed in: ${user.email}`, user.id);

    return json({ user: session });
  } catch (e) {
    console.error("Login error:", e);
    return error("Internal server error", 500);
  }
}
