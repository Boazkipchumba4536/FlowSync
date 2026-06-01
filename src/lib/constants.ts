export const NAV_LINKS = [
  { label: "Products", href: "/products/workflows" },
  { label: "Solutions", href: "/solutions/enterprise" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
] as const;

export const TRUST_BADGES = [
  { label: "SOC 2 Type II", icon: "shield" },
  { label: "GDPR", icon: "check" },
  { label: "99.9% uptime", icon: "shield" },
] as const;

export const HERO_COUNTER_TARGET = 593_138_971;

export const APP_NODES = [
  { id: "gmail", label: "Gmail", color: "#EA4335", x: 80, y: 120 },
  { id: "slack", label: "Slack", color: "#4A154B", x: 200, y: 40 },
  { id: "salesforce", label: "Salesforce", color: "#00A1E0", x: 340, y: 80 },
  { id: "hubspot", label: "HubSpot", color: "#FF7A59", x: 480, y: 40 },
  { id: "openai", label: "OpenAI", color: "#10A37F", x: 580, y: 140 },
  { id: "jira", label: "Jira", color: "#0052CC", x: 420, y: 220 },
  { id: "notion", label: "Notion", color: "#FFFFFF", x: 240, y: 200 },
  { id: "center", label: "FlowSync", color: "#FF5A1F", x: 330, y: 140 },
] as const;

export const APP_CONNECTIONS: [string, string][] = [
  ["gmail", "center"],
  ["slack", "center"],
  ["salesforce", "center"],
  ["hubspot", "center"],
  ["openai", "center"],
  ["jira", "center"],
  ["notion", "center"],
  ["gmail", "slack"],
  ["salesforce", "hubspot"],
  ["openai", "jira"],
];

export const MARQUEE_LOGOS = [
  { name: "Nvidia", svg: "nvidia" },
  { name: "Airbnb", svg: "airbnb" },
  { name: "Meta", svg: "meta" },
  { name: "Samsung", svg: "samsung" },
  { name: "Shopify", svg: "shopify" },
  { name: "Dropbox", svg: "dropbox" },
  { name: "Okta", svg: "okta" },
  { name: "Mastercard", svg: "mastercard" },
] as const;

export const STATS = [
  { value: 9000, suffix: "+", label: "App integrations" },
  { value: 3, suffix: "M+", label: "Businesses", multiplier: 1_000_000 },
  { value: 450, suffix: "K+", label: "Agents built", multiplier: 1000 },
  { value: 66000, suffix: "+", label: "Triggers & Actions" },
] as const;

export const PRODUCT_TABS = [
  {
    id: "workflows",
    label: "AI Workflows",
    title: "Automate anything with AI-powered Zaps",
    benefits: [
      "Connect 9,000+ apps with no code",
      "AI suggests and builds workflows for you",
      "Multi-step logic with branching and filters",
    ],
    gradient: "from-orange-500/20 to-purple-600/20",
    mockElements: ["Trigger: New email", "AI: Summarize", "Action: Post to Slack"],
  },
  {
    id: "agents",
    label: "AI Agents",
    title: "Agents that take real action",
    benefits: [
      "Delegate multi-step tasks to AI agents",
      "Agents use your connected apps securely",
      "Human-in-the-loop approval when needed",
    ],
    gradient: "from-purple-500/20 to-blue-600/20",
    mockElements: ["Research lead", "Draft outreach", "Schedule follow-up"],
  },
  {
    id: "chatbots",
    label: "Chatbots",
    title: "Answer customers instantly with AI",
    benefits: [
      "Train on your docs and knowledge base",
      "Hand off to humans seamlessly",
      "Deploy on web, Slack, and more",
    ],
    gradient: "from-green-500/20 to-teal-600/20",
    mockElements: ["Hi! How can I help?", "Track my order", "Talk to support"],
  },
  {
    id: "tables",
    label: "Tables",
    title: "Store and sync data your workflows need",
    benefits: [
      "Spreadsheet-like interface, database power",
      "Auto-update from connected apps",
      "Use as workflow memory and state",
    ],
    gradient: "from-blue-500/20 to-indigo-600/20",
    mockElements: ["Name", "Status", "Last synced"],
  },
  {
    id: "forms",
    label: "Forms",
    title: "Capture inputs that trigger workflows",
    benefits: [
      "Beautiful forms in minutes",
      "Instant workflow triggers on submit",
      "Conditional logic and validation",
    ],
    gradient: "from-pink-500/20 to-rose-600/20",
    mockElements: ["Contact us", "Request demo", "Submit ticket"],
  },
  {
    id: "canvas",
    label: "Canvas",
    title: "Plan workflows visually with AI",
    benefits: [
      "Map complex processes on a canvas",
      "AI helps design and optimize flows",
      "Collaborate with your team in real time",
    ],
    gradient: "from-amber-500/20 to-orange-600/20",
    mockElements: ["Start", "Decision", "End"],
  },
] as const;

export const TESTIMONIALS = [
  {
    company: "Superhuman",
    logo: "S",
    quote:
      "FlowSync cut our onboarding automation from weeks to hours. Our team ships faster than ever.",
    author: "Alex Chen",
    role: "Head of Operations",
    metrics: ["42 hours saved/week", "3x faster onboarding"],
    glow: "orange",
  },
  {
    company: "Remote",
    logo: "R",
    quote:
      "Governed AI workflows across 50+ countries — finally one system our compliance team trusts.",
    author: "Maria Santos",
    role: "VP of Engineering",
    metrics: ["100% audit coverage", "60% less manual work"],
    glow: "purple",
  },
  {
    company: "Erewhon",
    logo: "E",
    quote:
      "From experiments to production in days. FlowSync is how we scale AI without losing control.",
    author: "Jordan Lee",
    role: "Director of IT",
    metrics: ["200+ agents deployed", "99.9% uptime"],
    glow: "orange",
  },
] as const;

export const GOVERNANCE_PILLARS = [
  {
    title: "Control",
    icon: "shield",
    description:
      "Set policies, permissions, and guardrails so AI automation stays within your boundaries.",
    features: [
      "Role-based access control",
      "Approval workflows",
      "Data residency options",
      "SOC 2 Type II certified",
    ],
  },
  {
    title: "Delegation",
    icon: "users",
    description:
      "Empower teams to build automations while IT maintains oversight and standards.",
    features: [
      "Team workspaces",
      "Shared template library",
      "Sandbox environments",
      "Usage quotas & limits",
    ],
  },
  {
    title: "Visibility",
    icon: "eye",
    description:
      "Complete audit trails and analytics so you always know what AI did and why.",
    features: [
      "Full execution logs",
      "Real-time monitoring",
      "Anomaly detection",
      "Exportable reports",
    ],
  },
] as const;

export const FOOTER_LINKS = {
  Products: ["AI Workflows", "AI Agents", "Chatbots", "Tables", "Forms", "Canvas"],
  Solutions: ["RevOps", "Marketing", "IT", "Sales", "Customer Support", "Enterprise"],
  Resources: ["Blog", "Help Center", "Templates", "Webinars", "Community", "Developers"],
  Company: ["About", "Careers", "Press", "Partners", "Contact", "Legal"],
} as const;

export const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { name: "X", href: "https://x.com", icon: "x" },
  { name: "GitHub", href: "https://github.com", icon: "github" },
  { name: "YouTube", href: "https://youtube.com", icon: "youtube" },
] as const;

export const BENTO_FEATURES = [
  {
    id: "any-ai",
    title: "Any AI, Connected",
    description: "MCP, agents, and 9,000+ apps — one orchestration layer.",
    wide: true,
    type: "diagram" as const,
  },
  {
    id: "agents",
    title: "Agents That Take Action",
    description: "AI agents that don't just chat — they execute across your stack.",
    wide: false,
    type: "agent" as const,
  },
  {
    id: "teams",
    title: "Every Team Under One Roof",
    description: "Marketing, sales, ops — unified automation governance.",
    wide: false,
    type: "org" as const,
  },
  {
    id: "visibility",
    title: "Complete Visibility",
    description: "Audit every AI action with full execution logs and analytics.",
    wide: true,
    type: "audit" as const,
  },
] as const;
