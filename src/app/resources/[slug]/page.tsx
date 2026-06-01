import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { ROUTES } from "@/lib/routes";

const RESOURCES: Record<string, { title: string; description: string; items: string[] }> = {
  blog: {
    title: "Blog",
    description: "Latest news, tips, and automation inspiration.",
    items: ["5 workflows to automate today", "How AI is changing automation", "Customer story: Remote", "Building governed AI systems"],
  },
  webinars: {
    title: "Webinars",
    description: "Live and on-demand sessions with automation experts.",
    items: ["Getting started with FlowSync", "AI agents deep dive", "Enterprise governance best practices"],
  },
  community: {
    title: "Community",
    description: "Connect with other FlowSync users.",
    items: ["Community forum", "User groups", "Automation challenges", "Expert office hours"],
  },
  careers: {
    title: "Careers",
    description: "Join us in building the future of automation.",
    items: ["Engineering", "Product", "Design", "Customer Success", "Sales"],
  },
  press: {
    title: "Press",
    description: "FlowSync in the news.",
    items: ["Press kit", "Brand assets", "Media inquiries: press@flowsync.io"],
  },
  partners: {
    title: "Partners",
    description: "Grow your business with FlowSync.",
    items: ["Solution partners", "Technology partners", "Affiliate program", "Become a partner"],
  },
};

export function generateStaticParams() {
  return Object.keys(RESOURCES).map((slug) => ({ slug }));
}

export default function ResourcePage({ params }: { params: { slug: string } }) {
  const resource = RESOURCES[params.slug];
  if (!resource) notFound();

  return (
    <MarketingLayout>
      <PageHero badge="Resources" title={resource.title} subtitle={resource.description} />

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ul className="space-y-3">
            {resource.items.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 text-white/70 transition-colors hover:border-accent/30 hover:text-white"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-white/50">
            <Link href={ROUTES.signup} className="text-accent hover:underline">
              Get started with FlowSync →
            </Link>
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
