export type UserRole = "user" | "admin";
export type UserPlan = "free" | "pro" | "team" | "enterprise";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  plan: UserPlan;
  role: UserRole;
  status: "active" | "suspended";
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  plan: UserPlan;
  role: UserRole;
}

const USERS_KEY = "flowsync_users";
const SESSION_KEY = "flowsync_session";
const ADMIN_EMAIL = "admin@flowsync.io";
const DEMO_EMAIL = "demo@flowsync.io";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getUsers(): User[] {
  if (!isBrowser()) return [];
  try {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return users.map((u) => ({
      ...u,
      role: u.role ?? "user",
      status: u.status ?? "active",
    }));
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const session: Session | null = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!session) return null;
    const user = getUsers().find((u) => u.id === session.userId);
    if (!user || user.status === "suspended") return null;
    return { ...session, role: user.role, plan: user.plan, name: user.name };
  } catch {
    return null;
  }
}

export function setSession(session: Session | null) {
  if (!isBrowser()) return;
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function toSession(user: User): Session {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    role: user.role,
  };
}

export function ensurePlatformAccounts() {
  if (!isBrowser()) return;
  let users = getUsers();

  if (!users.some((u) => u.email === ADMIN_EMAIL)) {
    users.push({
      id: "admin-user",
      name: "Platform Admin",
      email: ADMIN_EMAIL,
      password: "admin123",
      createdAt: new Date().toISOString(),
      plan: "enterprise",
      role: "admin",
      status: "active",
    });
  }

  saveUsers(users);
}

export function signUp(
  name: string,
  email: string,
  password: string
): { ok: true; session: Session } | { ok: false; error: string } {
  ensurePlatformAccounts();
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  const user: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    createdAt: new Date().toISOString(),
    plan: "free",
    role: "user",
    status: "active",
  };
  users.push(user);
  saveUsers(users);
  const session = toSession(user);
  setSession(session);
  return { ok: true, session };
}

export function signIn(
  email: string,
  password: string
): { ok: true; session: Session } | { ok: false; error: string } {
  ensurePlatformAccounts();
  const user = getUsers().find((u) => u.email === email.toLowerCase().trim());
  if (!user || user.password !== password) {
    return { ok: false, error: "Invalid email or password." };
  }
  if (user.status === "suspended") {
    return { ok: false, error: "Your account has been suspended. Contact support." };
  }
  const session = toSession(user);
  setSession(session);
  return { ok: true, session };
}

export function signOut() {
  setSession(null);
}

export function demoSignIn(): Session {
  ensurePlatformAccounts();
  let users = getUsers();
  let user = users.find((u) => u.email === DEMO_EMAIL);
  if (!user) {
    user = {
      id: "demo-user",
      name: "Demo User",
      email: DEMO_EMAIL,
      password: "demo123",
      createdAt: new Date().toISOString(),
      plan: "pro",
      role: "user",
      status: "active",
    };
    users.push(user);
    saveUsers(users);
  }
  const session = toSession(user);
  setSession(session);
  return session;
}

export function updateUser(userId: string, updates: Partial<Pick<User, "name" | "plan" | "role" | "status">>) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  const session = getSession();
  if (session?.userId === userId) {
    setSession(toSession(users[idx]));
  }
  return users[idx];
}

export function deleteUser(userId: string): boolean {
  if (userId === "admin-user") return false;
  const users = getUsers().filter((u) => u.id !== userId);
  saveUsers(users);
  const session = getSession();
  if (session?.userId === userId) setSession(null);
  return true;
}

export function getUserById(userId: string): User | undefined {
  return getUsers().find((u) => u.id === userId);
}

export { ADMIN_EMAIL, DEMO_EMAIL };
