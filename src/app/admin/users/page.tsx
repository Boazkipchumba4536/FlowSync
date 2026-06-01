"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminLayout from "@/components/layouts/AdminLayout";
import { adminApi } from "@/lib/services";
import { Trash2, Ban, CheckCircle } from "lucide-react";

export default function AdminUsersPage() {
  return <AdminGuard><AdminLayout><UsersManager /></AdminLayout></AdminGuard>;
}

function UsersManager() {
  const [users, setUsers] = useState<Awaited<ReturnType<typeof adminApi.users>>["users"]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminApi.users().then(({ users: u }) => setUsers(u)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handlePlanChange = async (userId: string, plan: string) => {
    await adminApi.updateUser(userId, { plan });
    load();
  };

  const handleRoleChange = async (userId: string, role: string) => {
    await adminApi.updateUser(userId, { role });
    load();
  };

  const handleStatusToggle = async (userId: string, current: string) => {
    await adminApi.updateUser(userId, { status: current === "active" ? "suspended" : "active" });
    load();
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Delete user ${email} and all their data?`)) return;
    await adminApi.deleteUser(userId);
    load();
  };

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">User management</h1>
      <p className="mt-1 text-white/50">{users.length} registered users</p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wider text-white/40">
              <th className="px-4 py-3">User</th><th className="px-4 py-3">Plan</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Workflows</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3"><p className="font-medium text-white">{u.name}</p><p className="text-xs text-white/40">{u.email}</p></td>
                <td className="px-4 py-3">
                  <select value={u.plan} onChange={(e) => handlePlanChange(u.id, e.target.value)} className="rounded border border-white/10 bg-background px-2 py-1 text-xs capitalize">
                    {["free", "pro", "team", "enterprise"].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} disabled={u.email === "admin@flowsync.io"} className="rounded border border-white/10 bg-background px-2 py-1 text-xs capitalize disabled:opacity-50">
                    <option value="user">user</option><option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-white/70">{u.workflowCount}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${u.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{u.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleStatusToggle(u.id, u.status)} disabled={u.email === "admin@flowsync.io"} className="rounded p-1.5 text-white/40 hover:text-white disabled:opacity-30">
                      {u.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={() => handleDelete(u.id, u.email)} disabled={u.email === "admin@flowsync.io"} className="rounded p-1.5 text-white/40 hover:text-red-400 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
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
