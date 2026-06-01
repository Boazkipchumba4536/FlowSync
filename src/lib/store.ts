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
