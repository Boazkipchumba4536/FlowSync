import { getUsers, type UserPlan } from "./auth";

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  status: "on" | "off" | "draft";
  trigger: string;
  actions: string[];
  runs: number;
  lastRun?: string;
  createdAt: string;
}

export interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  connectedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused";
  tasksCompleted: number;
  createdAt: string;
}

export interface RunLog {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "error" | "running";
  timestamp: string;
  duration: string;
}

export interface Table {
  id: string;
  name: string;
  rows: number;
  columns: string[];
  updatedAt: string;
}

export interface Form {
  id: string;
  name: string;
  fields: number;
  submissions: number;
  status: "published" | "draft";
  createdAt: string;
}

export interface Chatbot {
  id: string;
  name: string;
  channel: string;
  conversations: number;
  status: "live" | "draft";
}

export interface IntegrationApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  enabled: boolean;
}

function key(userId: string, type: string) {
  return `flowsync_${type}_${userId}`;
}

const PLATFORM_KEY = "flowsync_platform";

function read<T>(storageKey: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(storageKey: string, data: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey, JSON.stringify(data));
}

const DEMO_WORKFLOWS: Omit<Workflow, "userId">[] = [
  {
    id: "wf-1",
    name: "Email to Slack Summary",
    status: "on",
    trigger: "New email in Gmail",
    actions: ["AI Summarize", "Post to #general"],
    runs: 847,
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "wf-2",
    name: "Lead Scoring Pipeline",
    status: "on",
    trigger: "New HubSpot contact",
    actions: ["Score with AI", "Assign to sales rep", "Notify Slack"],
    runs: 234,
    lastRun: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
];

const DEFAULT_INTEGRATIONS: IntegrationApp[] = [
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

export function getWorkflows(userId: string): Workflow[] {
  return read<Workflow[]>(key(userId, "workflows"), []);
}

export function saveWorkflows(userId: string, workflows: Workflow[]) {
  write(key(userId, "workflows"), workflows);
}

export function getApps(userId: string): ConnectedApp[] {
  return read<ConnectedApp[]>(key(userId, "apps"), []);
}

export function saveApps(userId: string, apps: ConnectedApp[]) {
  write(key(userId, "apps"), apps);
}

export function getAgents(userId: string): Agent[] {
  return read<Agent[]>(key(userId, "agents"), []);
}

export function saveAgents(userId: string, agents: Agent[]) {
  write(key(userId, "agents"), agents);
}

export function getHistory(userId: string): RunLog[] {
  return read<RunLog[]>(key(userId, "history"), []);
}

export function saveHistory(userId: string, logs: RunLog[]) {
  write(key(userId, "history"), logs);
}

export function getTables(userId: string): Table[] {
  return read<Table[]>(key(userId, "tables"), []);
}

export function saveTables(userId: string, tables: Table[]) {
  write(key(userId, "tables"), tables);
}

export function getForms(userId: string): Form[] {
  return read<Form[]>(key(userId, "forms"), []);
}

export function saveForms(userId: string, forms: Form[]) {
  write(key(userId, "forms"), forms);
}

export function getChatbots(userId: string): Chatbot[] {
  return read<Chatbot[]>(key(userId, "chatbots"), []);
}

export function saveChatbots(userId: string, chatbots: Chatbot[]) {
  write(key(userId, "chatbots"), chatbots);
}

export function seedDemoUserData(userId: string) {
  if (getWorkflows(userId).length > 0) return;
  saveWorkflows(
    userId,
    DEMO_WORKFLOWS.map((w) => ({ ...w, userId }))
  );
  saveApps(userId, [
    { id: "gmail", name: "Gmail", icon: "GM", color: "#EA4335", connectedAt: new Date(Date.now() - 86400000 * 60).toISOString() },
    { id: "slack", name: "Slack", icon: "SL", color: "#4A154B", connectedAt: new Date(Date.now() - 86400000 * 45).toISOString() },
    { id: "hubspot", name: "HubSpot", icon: "HS", color: "#FF7A59", connectedAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  ]);
  saveAgents(userId, [
    { id: "ag-1", name: "Research Assistant", description: "Researches leads and drafts outreach", status: "active", tasksCompleted: 128, createdAt: new Date().toISOString() },
    { id: "ag-2", name: "Support Bot", description: "Answers tier-1 support questions", status: "active", tasksCompleted: 892, createdAt: new Date().toISOString() },
  ]);
}

export function runWorkflow(userId: string, workflowId: string): RunLog | null {
  const workflows = getWorkflows(userId);
  const idx = workflows.findIndex((w) => w.id === workflowId);
  if (idx === -1) return null;
  const wf = workflows[idx];
  const log: RunLog = {
    id: `run-${Date.now()}`,
    workflowId: wf.id,
    workflowName: wf.name,
    status: "success",
    timestamp: new Date().toISOString(),
    duration: `${Math.floor(Math.random() * 4) + 1}.${Math.floor(Math.random() * 9)}s`,
  };
  workflows[idx] = {
    ...wf,
    runs: wf.runs + 1,
    lastRun: log.timestamp,
  };
  saveWorkflows(userId, workflows);
  const history = [log, ...getHistory(userId)].slice(0, 100);
  saveHistory(userId, history);
  addAuditLog("workflow_run", `Workflow "${wf.name}" executed`, userId);
  return log;
}

export interface AuditLogEntry {
  id: string;
  type: string;
  message: string;
  userId?: string;
  timestamp: string;
}

export function getAuditLog(): AuditLogEntry[] {
  const platform = read<{ audit?: AuditLogEntry[] }>(PLATFORM_KEY, {});
  return platform.audit ?? [];
}

export function addAuditLog(type: string, message: string, userId?: string) {
  const platform = read<{ audit?: AuditLogEntry[]; integrations?: IntegrationApp[] }>(PLATFORM_KEY, {});
  const audit = [
    { id: `audit-${Date.now()}`, type, message, userId, timestamp: new Date().toISOString() },
    ...(platform.audit ?? []),
  ].slice(0, 200);
  write(PLATFORM_KEY, { ...platform, audit });
}

export function getIntegrations(): IntegrationApp[] {
  const platform = read<{ integrations?: IntegrationApp[] }>(PLATFORM_KEY, {});
  return platform.integrations?.length ? platform.integrations : DEFAULT_INTEGRATIONS;
}

export function saveIntegrations(integrations: IntegrationApp[]) {
  const platform = read<Record<string, unknown>>(PLATFORM_KEY, {});
  write(PLATFORM_KEY, { ...platform, integrations });
}

export function getAvailableApps() {
  return getIntegrations().filter((a) => a.enabled);
}

export const AVAILABLE_APPS = DEFAULT_INTEGRATIONS;

export function getAllWorkflowsForAdmin(): (Workflow & { userName: string; userEmail: string })[] {
  return getUsers().flatMap((user) =>
    getWorkflows(user.id).map((wf) => ({
      ...wf,
      userName: user.name,
      userEmail: user.email,
    }))
  );
}

export function getPlatformStats() {
  const users = getUsers();
  const workflows = getAllWorkflowsForAdmin();
  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter((w) => w.status === "on").length,
    totalRuns: workflows.reduce((s, w) => s + w.runs, 0),
    planBreakdown: {
      free: users.filter((u) => u.plan === "free").length,
      pro: users.filter((u) => u.plan === "pro").length,
      team: users.filter((u) => u.plan === "team").length,
      enterprise: users.filter((u) => u.plan === "enterprise").length,
    },
  };
}

export function deleteUserData(userId: string) {
  ["workflows", "apps", "agents", "history", "tables", "forms", "chatbots"].forEach((type) => {
    if (typeof window !== "undefined") localStorage.removeItem(key(userId, type));
  });
}

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "For individuals getting started",
    features: ["100 tasks/month", "5 active workflows", "Single-step Zaps", "15-min update time", "Community support"],
    cta: "Start free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: 29,
    period: "/month",
    description: "For growing teams automating work",
    features: ["2,000 tasks/month", "Unlimited workflows", "Multi-step Zaps", "2-min update time", "AI workflow builder", "Premium apps"],
    cta: "Start trial",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: 69,
    period: "/month",
    description: "For teams that need collaboration",
    features: ["50,000 tasks/month", "Shared workspaces", "User roles & permissions", "1-min update time", "Shared app connections", "Priority support"],
    cta: "Start trial",
    highlighted: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    period: "custom",
    description: "For organizations at scale",
    features: ["Unlimited tasks", "SSO & SAML", "Advanced admin controls", "Dedicated support", "Custom data retention", "SLA guarantee"],
    cta: "Talk to sales",
    highlighted: false,
  },
] as const;

export const PRODUCT_PAGES: Record<string, { title: string; subtitle: string; features: string[]; useCases: string[] }> = {
  workflows: {
    title: "AI Workflows",
    subtitle: "Automate anything with AI-powered multi-step workflows",
    features: ["Visual workflow builder", "9,000+ app integrations", "AI suggests next steps", "Conditional logic & filters", "Error handling & retries", "Real-time execution logs"],
    useCases: ["Lead routing", "Email automation", "Data sync", "Notification pipelines"],
  },
  agents: {
    title: "AI Agents",
    subtitle: "Deploy autonomous agents that take real action across your stack",
    features: ["Natural language agent builder", "Multi-app tool use", "Human approval gates", "Memory & context", "Scheduled & triggered runs", "Performance analytics"],
    useCases: ["Lead research", "Customer support", "Data enrichment", "Report generation"],
  },
  chatbots: {
    title: "Chatbots",
    subtitle: "Answer customer questions instantly with AI trained on your knowledge",
    features: ["No-code chatbot builder", "Knowledge base training", "Multi-channel deploy", "Human handoff", "Conversation analytics", "Custom branding"],
    useCases: ["Customer support", "Internal help desk", "Lead qualification", "FAQ automation"],
  },
  tables: {
    title: "Tables",
    subtitle: "Store and sync data your workflows need — spreadsheet simple, database powerful",
    features: ["Spreadsheet interface", "Auto-sync from apps", "Workflow read/write", "Filtering & views", "Team collaboration", "API access"],
    useCases: ["Lead tracking", "Inventory sync", "Project status", "Customer records"],
  },
  forms: {
    title: "Forms",
    subtitle: "Capture inputs that instantly trigger your workflows",
    features: ["Drag-and-drop builder", "Conditional fields", "Instant workflow triggers", "Embeddable widgets", "File uploads", "Spam protection"],
    useCases: ["Contact forms", "Support tickets", "Lead capture", "Internal requests"],
  },
  canvas: {
    title: "Canvas",
    subtitle: "Plan and map complex workflows visually with AI assistance",
    features: ["Infinite canvas", "AI workflow suggestions", "Team collaboration", "Export to workflow", "Process documentation", "Version history"],
    useCases: ["Process mapping", "Workflow planning", "Team onboarding", "Architecture docs"],
  },
};

export const SOLUTION_PAGES: Record<string, { title: string; subtitle: string; benefits: string[] }> = {
  revops: { title: "RevOps Automation", subtitle: "Drive revenue through intelligent automation", benefits: ["Automated lead routing", "Pipeline hygiene", "Forecast sync", "Commission calculations"] },
  marketing: { title: "Marketing Automation", subtitle: "Multiply campaign effectiveness and ROI", benefits: ["Lead nurturing flows", "Campaign reporting", "Social media automation", "Content distribution"] },
  it: { title: "IT Automation", subtitle: "Better manage systems with governed automation", benefits: ["Employee onboarding", "Access provisioning", "Incident response", "Asset tracking"] },
  sales: { title: "Sales Automation", subtitle: "Close more deals with less manual work", benefits: ["Lead scoring", "Outreach sequences", "CRM enrichment", "Meeting scheduling"] },
  "customer-support": { title: "Customer Support", subtitle: "Elevate customer satisfaction with AI", benefits: ["Ticket routing", "Auto-responses", "Escalation rules", "CSAT tracking"] },
  enterprise: { title: "Enterprise", subtitle: "Scale automation across your organization", benefits: ["SSO & SAML", "Advanced governance", "Dedicated support", "Custom SLAs"] },
};

export const DOC_PAGES: Record<string, { title: string; content: string[] }> = {
  "getting-started": {
    title: "Getting Started",
    content: [
      "Welcome to FlowSync! This guide will help you create your first automation in minutes.",
      "Step 1: Sign up for a free account at flowsync.io/signup.",
      "Step 2: Connect your first app from the Apps directory.",
      "Step 3: Create a workflow by choosing a trigger and one or more actions.",
      "Step 4: Turn on your workflow and watch it run automatically.",
    ],
  },
  workflows: {
    title: "Building Workflows",
    content: [
      "Workflows are the core of FlowSync — automated sequences triggered by events in your apps.",
      "Every workflow has a trigger (what starts it) and one or more actions (what happens next).",
      "Use filters to only run workflows when specific conditions are met.",
      "Add paths to create branching logic based on data.",
      "Test your workflow before turning it on using the Test button.",
    ],
  },
  integrations: {
    title: "App Integrations",
    content: [
      "FlowSync connects to 9,000+ apps through our integration platform.",
      "To connect an app, go to Dashboard → Apps and click Connect.",
      "You'll be redirected to authorize FlowSync to access your account.",
      "Once connected, the app appears in your workflow builder.",
      "Some apps require a paid plan for premium triggers and actions.",
    ],
  },
  api: {
    title: "Developer API",
    content: [
      "The FlowSync REST API lets you programmatically manage workflows, runs, and connections.",
      "Base URL: https://api.flowsync.io/v1",
      "Authentication: Bearer token via API keys in Dashboard → Settings.",
      "Endpoints: GET /workflows, POST /workflows, GET /runs, POST /webhooks.",
      "See our OpenAPI spec for full documentation.",
    ],
  },
  security: {
    title: "Security & Compliance",
    content: [
      "FlowSync is SOC 2 Type II certified and GDPR compliant.",
      "All data is encrypted in transit (TLS 1.3) and at rest (AES-256).",
      "Role-based access control lets you manage team permissions.",
      "Audit logs track every workflow execution and configuration change.",
      "Enterprise plans include SSO, SAML, and custom data retention policies.",
    ],
  },
};

export type { UserPlan } from "./auth";
