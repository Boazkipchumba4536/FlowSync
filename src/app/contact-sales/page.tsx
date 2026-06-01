"use client";

import { useState } from "react";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactSalesPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <MarketingLayout>
      <PageHero
        badge="Enterprise"
        title="Talk to sales"
        subtitle="Get a custom demo and pricing for your organization."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          {submitted ? (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
              <h2 className="mt-4 font-display text-xl font-bold">Request received!</h2>
              <p className="mt-2 text-white/60">Our team will reach out within 1 business day.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md"
            >
              <div className="space-y-4">
                {[
                  { name: "name", label: "Full name", type: "text", required: true },
                  { name: "email", label: "Work email", type: "email", required: true },
                  { name: "company", label: "Company", type: "text", required: true },
                  { name: "size", label: "Team size", type: "text", placeholder: "e.g. 50-200" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="mb-1.5 block text-sm text-white/70">{field.label}</label>
                    <input
                      name={field.name}
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50"
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-1.5 block text-sm text-white/70">How can we help?</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50"
                    placeholder="Tell us about your automation needs..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="cta-glow mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
              >
                {loading ? "Sending..." : "Request demo"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </MarketingLayout>
  );
}
