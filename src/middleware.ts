import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { ROUTES } from "@/lib/routes";

const COOKIE_NAME = "flowsync_session";

const encoder = new TextEncoder();
function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  return encoder.encode(secret);
}

async function verifySession(token: string) {
  const secret = getSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as { role?: string; userId?: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isDashboard = pathname.startsWith("/dashboard");

  if (!isAdmin && !isDashboard) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL(ROUTES.login, req.url));
  }

  const session = await verifySession(token);
  if (!session?.userId) {
    return NextResponse.redirect(new URL(ROUTES.login, req.url));
  }

  if (isAdmin && session.role !== "admin") {
    return NextResponse.redirect(new URL(ROUTES.dashboard, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

