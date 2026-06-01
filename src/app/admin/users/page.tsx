"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminLayout from "@/components/layouts/AdminLayout";
import { getUsers, updateUser, deleteUser, type User, type UserPlan, type UserRole } from "@/lib/auth";
import { getWorkflows, deleteUserData, addAuditLog } from "@/lib/store";
import { Trash2, Shield, Ban, CheckCircle } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <UsersManager />
      </AdminLayout>
    </AdminGuard>
  );
}

function UsersManager() {
  const [users, setUsers] = useState<(User & { workflowCount: number })[]>([]);

  const load = () => {
    setUsers(
      getUsers().map((u) => ({
        ...u,
        workflowCount: getWorkflows(u.id).length,
      }))
    );
  };

  useEffect(() => {
    load();
  }, []);

  const handlePlanChange = (userId: string, plan: UserPlan) => {
    updateUser(userId, { plan });
    addAuditLog("user_update", `Plan changed to ${plan}`, userId);
    load();
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUser(userId, { role });
    addAuditLog("user_update", `Role changed to ${role}`, userId);
    load();
  };

  const handleStatusToggle = (userId: string, current: User["status"]) => {
    const status = current === "active" ? "suspended" : "active";
    updateUser(userId, { status });
    addAuditLog("user_update", `Account ${status}`, userId);
    load();
  };

  const handleDelete = (userId: string, email: string) => {
    if (!confirm(`Delete user ${email} and all their data?`)) return;
    deleteUserData(userId);
    deleteUser(userId);
    addAuditLog("user_delete", `User deleted: ${email}`, userId);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">User management</h1>
      <p className="mt-1 text-white/50">{users.length} registered users</p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wider text-white/40">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Workflows</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{u.name}</p>
                  <p className="text-xs text-white/40">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.plan}
                    onChange={(e) => handlePlanChange(u.id, e.target.value as UserPlan)}
                    className="rounded border border-white/10 bg-background px-2 py-1 text-xs capitalize"
                  >
                    {["free", "pro", "team", "enterprise"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    disabled={u.id === "admin-user"}
                    className="rounded border border-white/10 bg-background px-2 py-1 text-xs capitalize disabled:opacity-50"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-white/70">{u.workflowCount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                    u.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-white/40">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      title={u.status === "active" ? "Suspend" : "Activate"}
                      onClick={() => handleStatusToggle(u.id, u.status)}
                      disabled={u.id === "admin-user"}
                      className="rounded p-1.5 text-white/40 hover:bg-white/5 hover:text-white disabled:opacity-30"
                    >
                      {u.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    {u.role === "admin" && <Shield className="h-4 w-4 text-red-400" />}
                    <button
                      type="button"
                      title="Delete user"
                      onClick={() => handleDelete(u.id, u.email)}
                      disabled={u.id === "admin-user"}
                      className="rounded p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
