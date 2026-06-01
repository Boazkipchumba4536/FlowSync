import { clearSessionCookie, getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json } from "@/lib/server/api-utils";

export async function POST() {
  const session = await getSessionUser();
  if (session) {
    await addAuditLog("logout", `User signed out: ${session.email}`, session.userId);
  }
  await clearSessionCookie();
  return json({ ok: true });
}
