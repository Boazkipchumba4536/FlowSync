import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { addAuditLog } from "@/lib/server/audit";
import { json, unauthorized, error } from "@/lib/server/api-utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const chatbots = await prisma.chatbot.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return json({
    chatbots: chatbots.map((b) => ({
      id: b.id,
      name: b.name,
      channel: b.channel,
      conversations: b.conversations,
      status: b.status,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const { name, channel } = await req.json();
  const chatbot = await prisma.chatbot.create({
    data: {
      userId: session.userId,
      name: name?.trim() || `Chatbot ${Date.now()}`,
      channel: channel || "Web",
    },
  });

  await addAuditLog("chatbot_create", `Chatbot created: ${chatbot.name}`, session.userId);

  return json({
    chatbot: {
      id: chatbot.id,
      name: chatbot.name,
      channel: chatbot.channel,
      conversations: chatbot.conversations,
      status: chatbot.status,
    },
  }, 201);
}
