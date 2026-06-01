import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const chatbot = await prisma.chatbot.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!chatbot) return error("Chatbot not found", 404);

  const { status } = await req.json();
  const newStatus = status === "live" ? "live" : "draft";
  const updated = await prisma.chatbot.update({
    where: { id: params.id },
    data: { status: newStatus },
  });

  await addAuditLog(
    "chatbot_update",
    `Chatbot "${updated.name}" ${newStatus === "live" ? "went live" : "set to draft"}`,
    session.userId
  );

  return json({
    chatbot: {
      id: updated.id,
      name: updated.name,
      channel: updated.channel,
      conversations: updated.conversations,
      status: updated.status,
    },
  });
}
