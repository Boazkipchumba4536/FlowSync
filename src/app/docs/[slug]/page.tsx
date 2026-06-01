import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { DOC_PAGES } from "@/lib/store";
import { DOC_SLUGS, ROUTES } from "@/lib/routes";
import { Book, ChevronRight } from "lucide-react";

export function generateStaticParams() {
  return DOC_SLUGS.map((slug) => ({ slug }));
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const doc = DOC_PAGES[params.slug];
  if (!doc) notFound();

  return (
    <MarketingLayout>
      <PageHero badge="Documentation" title={doc.title} />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <nav className="sticky top-24 space-y-1">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Guides</p>
                {DOC_SLUGS.map((slug) => {
                  const d = DOC_PAGES[slug];
                  const active = slug === params.slug;
                  return (
                    <Link
                      key={slug}
                      href={ROUTES.doc(slug)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active ? "bg-accent/10 text-accent" : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Book className="h-4 w-4" />
                      {d.title}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <article className="lg:col-span-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
                {doc.content.map((paragraph, i) => (
                  <p key={i} className={`text-white/70 leading-relaxed ${i > 0 ? "mt-4" : ""}`}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {params.slug !== DOC_SLUGS[DOC_SLUGS.length - 1] && (
                <Link
                  href={ROUTES.doc(DOC_SLUGS[DOC_SLUGS.indexOf(params.slug as typeof DOC_SLUGS[number]) + 1])}
                  className="mt-6 flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  Next: {DOC_PAGES[DOC_SLUGS[DOC_SLUGS.indexOf(params.slug as typeof DOC_SLUGS[number]) + 1]]?.title}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </article>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
