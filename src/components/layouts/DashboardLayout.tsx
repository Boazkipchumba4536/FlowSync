"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  Workflow,
  Plug,
  Bot,
  History,
  Settings,
  LogOut,
  Plus,
  Table2,
  FileText,
  MessageSquare,
  PenTool,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

const NAV = [
  { href: ROUTES.dashboard, label: "Home", icon: LayoutDashboard, exact: true },
  { href: ROUTES.dashboardWorkflows, label: "Workflows", icon: Workflow },
  { href: ROUTES.dashboardApps, label: "Apps", icon: Plug },
  { href: ROUTES.dashboardAgents, label: "Agents", icon: Bot },
  { href: ROUTES.dashboardTables, label: "Tables", icon: Table2 },
  { href: ROUTES.dashboardForms, label: "Forms", icon: FileText },
  { href: ROUTES.dashboardChatbots, label: "Chatbots", icon: MessageSquare },
  { href: ROUTES.dashboardCanvas, label: "Canvas", icon: PenTool },
  { href: ROUTES.dashboardHistory, label: "History", icon: History },
  { href: ROUTES.dashboardSettings, label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, signOut } = useAuth();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-background/95 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <Link href={ROUTES.dashboard} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
              <Zap className="h-4 w-4 text-accent" fill="currentColor" />
            </div>
            <span className="font-display text-lg font-bold">FlowSync</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive(href, exact)
                  ? "bg-accent/10 text-accent"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
          {session?.role === "admin" && (
            <Link
              href={ROUTES.admin}
              className="mt-2 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              <Shield className="h-4 w-4" />
              Admin panel
            </Link>
          )}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-lg bg-white/5 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">{session?.name}</p>
            <p className="truncate text-xs text-white/40">{session?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium uppercase text-accent">
              {session?.plan}
            </span>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <Link href={ROUTES.dashboard} className="font-display font-bold lg:hidden">FlowSync</Link>
          <div className="hidden text-sm text-white/40 lg:block">Automation platform</div>
          <Link
            href={ROUTES.dashboardWorkflowNew}
            className="cta-glow flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            Create
          </Link>
        </header>

        <main className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/10 bg-background/95 backdrop-blur-xl lg:hidden">
        {NAV.slice(0, 5).map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${
              isActive(href, exact) ? "text-accent" : "text-white/50"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
