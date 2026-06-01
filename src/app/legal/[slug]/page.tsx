import { notFound } from "next/navigation";
import MarketingLayout, { PageHero } from "@/components/layouts/MarketingLayout";

const LEGAL = {
  terms: {
    title: "Terms of Service",
    sections: [
      { heading: "Acceptance", body: "By accessing FlowSync, you agree to these terms. If you disagree, do not use our services." },
      { heading: "Use of Service", body: "You may use FlowSync to create and run automations in compliance with applicable laws. You are responsible for the content processed through your workflows." },
      { heading: "Account", body: "You must provide accurate information when creating an account. You are responsible for maintaining the security of your credentials." },
      { heading: "Limitation of Liability", body: "FlowSync is provided as-is. We are not liable for indirect damages arising from use of the platform." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      { heading: "Data Collection", body: "We collect account information, usage data, and workflow execution logs to provide and improve our services." },
      { heading: "Data Use", body: "Your data is used to run automations, provide support, and improve the platform. We do not sell your personal data." },
      { heading: "Security", body: "We encrypt data in transit and at rest. We are SOC 2 Type II certified and GDPR compliant." },
      { heading: "Your Rights", body: "You may request access, correction, or deletion of your data by contacting privacy@flowsync.io." },
    ],
  },
};

export function generateStaticParams() {
  return [{ slug: "terms" }, { slug: "privacy" }];
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const page = LEGAL[params.slug as keyof typeof LEGAL];
  if (!page) notFound();

  return (
    <MarketingLayout>
      <PageHero badge="Legal" title={page.title} />

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-8">
            {page.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-xl font-semibold text-white">{s.heading}</h2>
                <p className="mt-2 text-white/70 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
