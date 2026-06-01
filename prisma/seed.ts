import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const INTEGRATIONS = [
  { id: "gmail", name: "Gmail", icon: "GM", color: "#EA4335", category: "Email", enabled: true },
  { id: "slack", name: "Slack", icon: "SL", color: "#4A154B", category: "Communication", enabled: true },
  { id: "salesforce", name: "Salesforce", icon: "SF", color: "#00A1E0", category: "CRM", enabled: true },
  { id: "hubspot", name: "HubSpot", icon: "HS", color: "#FF7A59", category: "CRM", enabled: true },
  { id: "openai", name: "OpenAI", icon: "AI", color: "#10A37F", category: "AI", enabled: true },
  { id: "jira", name: "Jira", icon: "JR", color: "#0052CC", category: "Project Management", enabled: true },
  { id: "notion", name: "Notion", icon: "NO", color: "#FFFFFF", category: "Productivity", enabled: true },
  { id: "zendesk", name: "Zendesk", icon: "ZD", color: "#03363D", category: "Support", enabled: true },
  { id: "stripe", name: "Stripe", icon: "ST", color: "#635BFF", category: "Payments", enabled: true },
  { id: "airtable", name: "Airtable", icon: "AT", color: "#18BFFF", category: "Database", enabled: true },
  { id: "google-sheets", name: "Google Sheets", icon: "GS", color: "#34A853", category: "Productivity", enabled: true },
  { id: "microsoft-teams", name: "Microsoft Teams", icon: "MT", color: "#6264A7", category: "Communication", enabled: true },
];

async function main() {
  console.log("Seeding database...");

  for (const app of INTEGRATIONS) {
    await prisma.integration.upsert({
      where: { id: app.id },
      update: app,
      create: app,
    });
  }

  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@flowsync.io" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@flowsync.io",
      password: adminHash,
      plan: "enterprise",
      role: "admin",
      status: "active",
    },
  });

  const demoHash = await bcrypt.hash("demo123", 12);
  const demo = await prisma.user.upsert({
    where: { email: "demo@flowsync.io" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@flowsync.io",
      password: demoHash,
      plan: "pro",
      role: "user",
      status: "active",
    },
  });

  const existingDemoWf = await prisma.workflow.count({ where: { userId: demo.id } });
  if (existingDemoWf === 0) {
    await prisma.workflow.createMany({
      data: [
        {
          userId: demo.id,
          name: "Email to Slack Summary",
          status: "on",
          trigger: "New email in Gmail",
          actions: JSON.stringify(["AI Summarize", "Post to #general"]),
          runs: 847,
          lastRun: new Date(Date.now() - 3600000),
        },
        {
          userId: demo.id,
          name: "Lead Scoring Pipeline",
          status: "on",
          trigger: "New HubSpot contact",
          actions: JSON.stringify(["Score with AI", "Assign to sales rep", "Notify Slack"]),
          runs: 234,
          lastRun: new Date(Date.now() - 7200000),
        },
      ],
    });

    await prisma.connectedApp.createMany({
      data: [
        { userId: demo.id, appId: "gmail", name: "Gmail", icon: "GM", color: "#EA4335" },
        { userId: demo.id, appId: "slack", name: "Slack", icon: "SL", color: "#4A154B" },
        { userId: demo.id, appId: "hubspot", name: "HubSpot", icon: "HS", color: "#FF7A59" },
      ],
    });

    await prisma.agent.createMany({
      data: [
        { userId: demo.id, name: "Research Assistant", description: "Researches leads and drafts outreach", status: "active", tasksCompleted: 128 },
        { userId: demo.id, name: "Support Bot", description: "Answers tier-1 support questions", status: "active", tasksCompleted: 892 },
      ],
    });
  }

  await prisma.platformSetting.upsert({
    where: { key: "signup_enabled" },
    update: {},
    create: { key: "signup_enabled", value: "true" },
  });

  await prisma.platformSetting.upsert({
    where: { key: "maintenance_mode" },
    update: {},
    create: { key: "maintenance_mode", value: "false" },
  });

  await prisma.auditLog.create({
    data: { type: "system", message: "Database seeded successfully" },
  });

  console.log("Seed complete:", { admin: admin.email, demo: demo.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
