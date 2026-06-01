export type UserRole = "user" | "admin";
export type UserPlan = "free" | "pro" | "team" | "enterprise";
export type UserStatus = "active" | "suspended";
export type WorkflowStatus = "on" | "off" | "draft";

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  plan: UserPlan;
  role: UserRole;
}

export interface WorkflowDTO {
  id: string;
  userId: string;
  name: string;
  status: WorkflowStatus;
  trigger: string;
  actions: string[];
  runs: number;
  lastRun?: string;
  createdAt: string;
}

export interface ConnectedAppDTO {
  id: string;
  appId: string;
  name: string;
  icon: string;
  color: string;
  connectedAt: string;
}

export interface AgentDTO {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused";
  tasksCompleted: number;
  createdAt: string;
}

export interface RunStepDTO {
  step: string;
  status: "success" | "error";
  output?: string;
  attempts?: number;
}

export interface ExecutionResultDTO {
  success: boolean;
  duration: string;
  steps: RunStepDTO[];
  error?: string;
}

export interface RunLogDTO {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "error" | "running";
  timestamp: string;
  duration: string;
  steps?: RunStepDTO[];
  error?: string;
}

export interface TableDTO {
  id: string;
  name: string;
  rows: number;
  columns: string[];
  updatedAt: string;
}

export interface FormDTO {
  id: string;
  name: string;
  fields: number;
  submissions: number;
  status: "published" | "draft";
  createdAt: string;
}

export interface ChatbotDTO {
  id: string;
  name: string;
  channel: string;
  conversations: number;
  status: "live" | "draft";
}

export interface IntegrationDTO {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  enabled: boolean;
}

export interface AuditLogDTO {
  id: string;
  type: string;
  message: string;
  userId?: string;
  timestamp: string;
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalWorkflows: number;
  activeWorkflows: number;
  totalRuns: number;
  planBreakdown: Record<UserPlan, number>;
}

export const ADMIN_EMAIL = "admin@flowsync.io";
export const DEMO_EMAIL = "demo@flowsync.io";
