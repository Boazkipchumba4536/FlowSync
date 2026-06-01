import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/session";
import { executeWorkflow } from "@/lib/server/workflow-engine";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  try {
    const result = await executeWorkflow(session.userId, params.id);
    return json({ result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Execution failed";
    if (message === "Workflow not found") return error(message, 404);
    console.error("Run workflow error:", e);
    return error("Internal server error", 500);
  }
}
