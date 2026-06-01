"use client";

import { useState } from "react";
import Link from "next/link";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { AVAILABLE_APPS, getAvailableApps } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { Search } from "lucide-react";

export default function AppsPage() {
  const [query, setQuery] = useState("");
  const availableApps = getAvailableApps().length ? getAvailableApps() : AVAILABLE_APPS;
  const categories = Array.from(new Set(availableApps.map((a) => a.category)));

  const filtered = availableApps.filter(
    (app) =>
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <MarketingLayout>
      <PageHero
        badge="Integrations"
        title="9,000+ app integrations"
        subtitle="Connect the tools you already use. Search our directory below."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps..."
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white outline-none focus:border-accent/50"
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setQuery(cat)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 hover:border-accent/30 hover:text-white"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((app) => (
              <Link
                key={app.id}
                href={ROUTES.signup}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-accent/30 hover:bg-accent/5"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                  style={{ backgroundColor: `${app.color}20`, color: app.color }}
                >
                  {app.icon}
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-accent">{app.name}</p>
                  <p className="text-xs text-white/40">{app.category}</p>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-white/50">No apps found. Try a different search.</p>
          )}
        </div>
      </section>
    </MarketingLayout>
  );
}
