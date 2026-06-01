import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { SOLUTION_PAGES } from "@/lib/store";
import { SOLUTION_SLUGS, ROUTES } from "@/lib/routes";
import { Check, ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return SOLUTION_SLUGS.map((slug) => ({ slug }));
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const solution = SOLUTION_PAGES[params.slug];
  if (!solution) notFound();

  return (
    <MarketingLayout>
      <PageHero badge="Solutions" title={solution.title} subtitle={solution.subtitle} />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-center">Key benefits</h2>
            <ul className="mt-8 space-y-4">
              {solution.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-white/80">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href={ROUTES.signup}
                className="cta-glow rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Start free
              </Link>
              <Link
                href={ROUTES.contactSales}
                className="flex items-center gap-2 rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white hover:border-accent/50"
              >
                Talk to sales <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
