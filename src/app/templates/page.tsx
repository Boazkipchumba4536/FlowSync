import Link from "next/link";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { ROUTES } from "@/lib/routes";
import { ArrowRight } from "lucide-react";

const TEMPLATES = [
  { name: "Email to Slack Summary", category: "Productivity", apps: ["Gmail", "Slack", "OpenAI"], runs: "12K+" },
  { name: "Lead to CRM Pipeline", category: "Sales", apps: ["HubSpot", "Slack"], runs: "8K+" },
  { name: "Support Ticket Router", category: "Support", apps: ["Zendesk", "Slack"], runs: "5K+" },
  { name: "New Hire Onboarding", category: "HR", apps: ["Google Workspace", "Slack", "Notion"], runs: "3K+" },
  { name: "Invoice to Accounting", category: "Finance", apps: ["Stripe", "Google Sheets"], runs: "2K+" },
  { name: "Social Media Monitor", category: "Marketing", apps: ["Twitter", "Slack"], runs: "4K+" },
  { name: "Meeting Notes to Notion", category: "Productivity", apps: ["Zoom", "OpenAI", "Notion"], runs: "6K+" },
  { name: "E-commerce Order Alerts", category: "E-commerce", apps: ["Shopify", "Slack", "Gmail"], runs: "9K+" },
];

export default function TemplatesPage() {
  return (
    <MarketingLayout>
      <PageHero
        badge="Templates"
        title="Start with a template"
        subtitle="Pre-built workflows you can customize in minutes."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <Link
                key={t.name}
                href={ROUTES.signup}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-accent/30 hover:bg-accent/5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{t.category}</span>
                  <span className="text-xs text-white/40">{t.runs} uses</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white group-hover:text-accent">
                  {t.name}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1">
                  {t.apps.map((app) => (
                    <span key={app} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                      {app}
                    </span>
                  ))}
                </div>
                <span className="mt-4 flex items-center gap-1 text-sm text-accent">
                  Use template <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
