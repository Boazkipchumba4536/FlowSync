import Link from "next/link";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";
import { DOC_PAGES } from "@/lib/store";
import { DOC_SLUGS, ROUTES } from "@/lib/routes";
import { Book, ArrowRight } from "lucide-react";

export default function DocsIndexPage() {
  return (
    <MarketingLayout>
      <PageHero
        badge="Documentation"
        title="FlowSync Docs"
        subtitle="Everything you need to automate with confidence."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOC_SLUGS.map((slug) => {
              const doc = DOC_PAGES[slug];
              return (
                <Link
                  key={slug}
                  href={ROUTES.doc(slug)}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all hover:border-accent/30 hover:bg-accent/5"
                >
                  <Book className="h-8 w-8 text-accent" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-white group-hover:text-accent">
                    {doc.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/50 line-clamp-2">{doc.content[0]}</p>
                  <span className="mt-4 flex items-center gap-1 text-sm text-accent">
                    Read guide <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
