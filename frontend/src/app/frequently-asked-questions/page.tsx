import type { Metadata } from "next";

import { Accordion } from "@/components/content/Accordion";
import { CtaBand } from "@/components/content/CtaBand";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHero } from "@/components/content/PageHero";
import { EmptyState, ErrorState } from "@/components/content/States";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { getFaqs } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Nexgate Properties: buying residential and commercial property, inspections, investment, developments, management and international enquiries.",
  path: "/frequently-asked-questions/",
});

export default async function FaqPage() {
  const res = await getFaqs();
  const groups = res.ok ? res.data : [];
  const faqLd = groups.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: groups.flatMap((g) => g.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } }))),
      }
    : null;

  return (
    <>
      {faqLd && <JsonLd data={faqLd} />}
      <PageHero
        title="Frequently asked *questions.*"
        eyebrow="FAQs"
        intro="Quick answers about our services and how we work. Can’t find what you need? Contact our team."
        crumbs={[{ name: "FAQs", href: "/frequently-asked-questions/" }]}
      />
      <Section className="!pt-14">
        <Container className="grid gap-12 lg:grid-cols-12">
          {groups.length > 1 && (
            <nav aria-label="FAQ topics" className="lg:col-span-3">
              <ul className="space-y-1 lg:sticky lg:top-24">
                {groups.map((g) => (
                  <li key={g.slug}>
                    <a href={`#${g.slug}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-paper hover:text-ink">
                      {g.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className={groups.length > 1 ? "space-y-16 lg:col-span-9" : "space-y-16 lg:col-span-12"}>
            {!res.ok && <ErrorState title="We couldn’t load the FAQs right now" />}
            {res.ok && groups.length === 0 && (
              <EmptyState title="FAQs are being prepared" icon="info" actions={<ButtonLink href="/contact-us/">Ask us a question</ButtonLink>} />
            )}
            {groups.map((g) => (
              <section key={g.slug} id={g.slug} className="scroll-mt-24" aria-labelledby={`${g.slug}-h`}>
                <h2 id={`${g.slug}-h`} className="mb-4 text-2xl font-bold">
                  {g.name}
                </h2>
                <Accordion items={g.faqs} defaultOpen={g.faqs.length <= 2} />
              </section>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand title="Still have *a question?*" intro="Our team is happy to help." primary={{ label: "Contact us", href: "/contact-us/" }} secondary={{ label: "Book a consultation", href: "/book-a-consultation/" }} />
    </>
  );
}
