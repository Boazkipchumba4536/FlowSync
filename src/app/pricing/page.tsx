"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { PRICING_PLANS } from "@/lib/store";
import { ROUTES } from "@/lib/routes";

export default function PricingPage() {
  return (
    <MarketingLayout>
      <PageHero
        badge="Pricing"
        title="Plans that scale with you"
        subtitle="Start free, upgrade when you're ready. No hidden fees."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-6 backdrop-blur-md ${
                  plan.highlighted
                    ? "border-accent/50 bg-accent/5 shadow-[0_0_40px_rgba(255,90,31,0.15)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-white/50">{plan.description}</p>
                <div className="mt-4">
                  {plan.price !== null ? (
                    <>
                      <span className="font-display text-4xl font-bold">${plan.price}</span>
                      <span className="text-white/50">{plan.period}</span>
                    </>
                  ) : (
                    <span className="font-display text-3xl font-bold">Custom</span>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.id === "enterprise" ? ROUTES.contactSales : ROUTES.signup}
                  className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "cta-glow bg-accent text-white hover:bg-accent-hover"
                      : "border border-white/20 text-white hover:border-accent/50 hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <h3 className="font-display text-xl font-bold">Compare all features</h3>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-white/50">
                    <th className="pb-3 pr-4">Feature</th>
                    <th className="pb-3 px-4">Free</th>
                    <th className="pb-3 px-4">Pro</th>
                    <th className="pb-3 px-4">Team</th>
                    <th className="pb-3 pl-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {[
                    ["Tasks/month", "100", "2,000", "50,000", "Unlimited"],
                    ["Workflows", "5", "Unlimited", "Unlimited", "Unlimited"],
                    ["Update time", "15 min", "2 min", "1 min", "Real-time"],
                    ["AI builder", "—", "✓", "✓", "✓"],
                    ["SSO/SAML", "—", "—", "—", "✓"],
                  ].map(([feature, ...vals]) => (
                    <tr key={feature} className="border-b border-white/5">
                      <td className="py-3 pr-4 font-medium text-white">{feature}</td>
                      {vals.map((v, j) => (
                        <td key={j} className="px-4 py-3">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
