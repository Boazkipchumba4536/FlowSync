"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Users,
  Workflow,
  Plug,
  ScrollText,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

const NAV = [
  { href: ROUTES.admin, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.adminUsers, label: "Users", icon: Users },
  { href: ROUTES.adminWorkflows, label: "Workflows", icon: Workflow },
  { href: ROUTES.adminIntegrations, label: "Integrations", icon: Plug },
  { href: ROUTES.adminAudit, label: "Audit log", icon: ScrollText },
  { href: ROUTES.adminSettings, label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#07070B]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#07070B]/95 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
            <Shield className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <span className="font-display text-lg font-bold">Admin</span>
            <p className="text-[10px] uppercase tracking-wider text-white/40">FlowSync Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-red-500/10 text-red-400" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-4">
          <Link
            href={ROUTES.dashboard}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            User dashboard
          </Link>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">{session?.name}</p>
            <p className="text-[10px] uppercase text-red-400">Administrator</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-white/10 bg-[#07070B]/80 px-4 backdrop-blur-xl sm:px-6">
          <p className="text-sm text-white/50">Platform administration</p>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
