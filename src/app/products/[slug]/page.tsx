import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { PRODUCT_PAGES } from "@/lib/store";
import { PRODUCT_SLUGS, ROUTES } from "@/lib/routes";
import { Check, ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCT_PAGES[params.slug];
  if (!product) notFound();

  return (
    <MarketingLayout>
      <PageHero badge="Product" title={product.title} subtitle={product.subtitle} />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold">Features</h2>
              <ul className="mt-6 space-y-4">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-white/70">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={ROUTES.signup}
                className="cta-glow mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">Popular use cases</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.useCases.map((uc) => (
                  <div
                    key={uc}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70"
                  >
                    {uc}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-accent/10 to-purple-600/10 p-6">
                <p className="text-sm text-white/60">
                  Explore templates for {product.title.toLowerCase()} in our template gallery.
                </p>
                <Link href={ROUTES.templates} className="mt-3 inline-block text-sm text-accent hover:underline">
                  Browse templates →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
