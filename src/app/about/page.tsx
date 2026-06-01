import Link from "next/link";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { ROUTES } from "@/lib/routes";

export default function AboutPage() {
  return (
    <MarketingLayout>
      <PageHero
        badge="Company"
        title="About FlowSync"
        subtitle="We're building the AI orchestration layer for every team."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-6 text-white/70 leading-relaxed">
            <p>
              FlowSync was founded with a simple belief: every team has AI tools, but they need a system to connect, govern, and scale them.
            </p>
            <p>
              We help 3 million+ businesses automate workflows across 9,000+ apps — from startups shipping their first Zap to enterprises orchestrating AI agents at scale.
            </p>
            <p>
              Our platform combines no-code automation, AI agents, chatbots, and governed orchestration so teams can move from AI experiments to real results.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { stat: "2011", label: "Founded" },
              { stat: "800+", label: "Team members" },
              { stat: "3M+", label: "Businesses served" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <p className="font-display text-3xl font-bold text-accent">{stat}</p>
                <p className="mt-1 text-sm text-white/50">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href={ROUTES.contactSales} className="text-accent hover:underline">
              Join our team →
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
