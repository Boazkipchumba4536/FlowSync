import { api } from "@/lib/api-client";
import type {
  SessionUser,
  WorkflowDTO,
  ConnectedAppDTO,
  AgentDTO,
  RunLogDTO,
  ExecutionResultDTO,
  TableDTO,
  FormDTO,
  ChatbotDTO,
  IntegrationDTO,
  PlatformStats,
} from "@/lib/types";

export const authApi = {
  me: () => api.get<{ user: SessionUser }>("/api/auth/me"),
  signup: (name: string, email: string, password: string) =>
    api.post<{ user: SessionUser }>("/api/auth/signup", { name, email, password }),
  login: (email: string, password: string) =>
    api.post<{ user: SessionUser }>("/api/auth/login", { email, password }),
  logout: () => api.post<{ ok: boolean }>("/api/auth/logout"),
  demo: () => api.post<{ user: SessionUser }>("/api/auth/demo"),
};

export const workflowApi = {
  list: () => api.get<{ workflows: WorkflowDTO[] }>("/api/workflows"),
  get: (id: string) => api.get<{ workflow: WorkflowDTO }>(`/api/workflows/${id}`),
  create: (data: { name: string; trigger: string; actions: string[]; status?: string }) =>
    api.post<{ workflow: WorkflowDTO }>("/api/workflows", data),
  update: (id: string, data: Partial<{ name: string; trigger: string; actions: string[]; status: string }>) =>
    api.patch<{ workflow: WorkflowDTO }>(`/api/workflows/${id}`, data),
  delete: (id: string) => api.delete<{ ok: boolean }>(`/api/workflows/${id}`),
  run: (id: string) =>
    api.post<{ result: ExecutionResultDTO }>(`/api/workflows/${id}/run`),
};

export const appApi = {
  list: () => api.get<{ apps: ConnectedAppDTO[] }>("/api/apps"),
  connect: (appId: string) => api.post<{ app: ConnectedAppDTO }>("/api/apps", { appId }),
  disconnect: (id: string) => api.delete<{ ok: boolean }>(`/api/apps/${id}`),
};

export const integrationApi = {
  list: () => api.get<{ integrations: IntegrationDTO[] }>("/api/integrations"),
  toggle: (id: string, enabled: boolean) =>
    api.patch<{ integration: IntegrationDTO }>("/api/integrations", { id, enabled }),
};

export const agentApi = {
  list: () => api.get<{ agents: AgentDTO[] }>("/api/agents"),
  create: (name: string, description?: string) =>
    api.post<{ agent: AgentDTO }>("/api/agents", { name, description }),
  update: (id: string, status: "active" | "paused") =>
    api.patch<{ agent: AgentDTO }>(`/api/agents/${id}`, { status }),
};

export const historyApi = {
  list: () => api.get<{ logs: RunLogDTO[] }>("/api/history"),
};

export const tableApi = {
  list: () => api.get<{ tables: TableDTO[] }>("/api/tables"),
  create: (name?: string) => api.post<{ table: TableDTO }>("/api/tables", { name }),
};

export const formApi = {
  list: () => api.get<{ forms: FormDTO[] }>("/api/forms"),
  create: (name?: string) => api.post<{ form: FormDTO }>("/api/forms", { name }),
  update: (id: string, status: "published" | "draft") =>
    api.patch<{ form: FormDTO }>(`/api/forms/${id}`, { status }),
};

export const chatbotApi = {
  list: () => api.get<{ chatbots: ChatbotDTO[] }>("/api/chatbots"),
  create: (name?: string, channel?: string) =>
    api.post<{ chatbot: ChatbotDTO }>("/api/chatbots", { name, channel }),
  update: (id: string, status: "live" | "draft") =>
    api.patch<{ chatbot: ChatbotDTO }>(`/api/chatbots/${id}`, { status }),
};

export const adminApi = {
  stats: () =>
    api.get<{
      stats: PlatformStats;
      recentUsers: { id: string; name: string; email: string; plan: string; createdAt: string }[];
      audit: { id: string; type: string; message: string; userId?: string; timestamp: string }[];
    }>("/api/admin/stats"),
  users: () =>
    api.get<{
      users: {
        id: string;
        name: string;
        email: string;
        plan: string;
        role: string;
        status: string;
        createdAt: string;
        workflowCount: number;
      }[];
    }>("/api/admin/users"),
  updateUser: (id: string, data: { plan?: string; role?: string; status?: string }) =>
    api.patch(`/api/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/api/admin/users/${id}`),
  workflows: () =>
    api.get<{ workflows: (WorkflowDTO & { userName: string; userEmail: string })[] }>(
      "/api/admin/workflows"
    ),
  audit: () =>
    api.get<{ logs: { id: string; type: string; message: string; userId?: string; timestamp: string }[] }>(
      "/api/admin/audit"
    ),
  settings: (data: { signupEnabled?: boolean; maintenanceMode?: boolean }) =>
    api.patch("/api/admin/settings", {
      signupEnabled: data.signupEnabled,
      maintenanceMode: data.maintenanceMode,
    }),
  getSettings: () =>
    api.get<{ signupEnabled: boolean; maintenanceMode: boolean }>("/api/admin/settings"),
};
