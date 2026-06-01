import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createToken,
  setSessionCookie,
  hashPassword,
  verifyPassword,
  toSessionUser,
} from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, error } from "@/lib/server/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return error("Name, email, and password are required");
    }
    if (password.length < 6) {
      return error("Password must be at least 6 characters");
    }

    const signupEnabled = await prisma.platformSetting.findUnique({
      where: { key: "signup_enabled" },
    });
    if (signupEnabled?.value === "false") {
      return error("Signups are currently disabled", 403);
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) {
      return error("An account with this email already exists", 409);
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: await hashPassword(password),
        plan: "free",
        role: "user",
        status: "active",
      },
    });

    const session = toSessionUser(user);
    const token = await createToken(session);
    await setSessionCookie(token);
    await addAuditLog("signup", `New user registered: ${user.email}`, user.id);

    return json({ user: session });
  } catch (e) {
    console.error("Signup error:", e);
    return error("Internal server error", 500);
  }
}
