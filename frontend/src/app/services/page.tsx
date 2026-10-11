import type { Metadata } from "next";

import { CtaBand } from "@/components/content/CtaBand";
import { MediaImage } from "@/components/content/MediaImage";
import { PageHero } from "@/components/content/PageHero";
import { CheckList } from "@/components/content/Steps";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { getServiceContent } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "Our Real Estate Services",
  description:
    "Six real estate services from Nexgate Properties: property sales, development, investment, property and facility management, advisory, and international property.",
  path: "/services/",
});

export default async function ServicesPage() {
  const cms = await getServiceContent();
  return (
    <>
      <PageHero
        title="Our *services.*"
        eyebrow="What we do"
        intro="Six connected real estate services for buyers, owners, investors, developers and international clients."
        crumbs={[{ name: "Services", href: "/services/" }]}
        actions={
          <ButtonLink href="/book-a-consultation/" arrow>
            Book a consultation
          </ButtonLink>
        }
      />
      <Section>
        <Container className="space-y-24 sm:space-y-32">
          {SERVICES.map((s, i) => {
            const c = cms[s.key];
            const href = s.key === "properties-for-sale" ? "/residential-properties/" : s.href;
            return (
              <article key={s.key} id={s.key} className="grid scroll-mt-24 gap-10 lg:grid-cols-12 lg:items-center" aria-labelledby={`${s.key}-title`}>
                <div className={i % 2 ? "lg:order-2 lg:col-span-6 lg:col-start-7" : "lg:col-span-6"}>
                  <div data-reveal="scale">
                    <MediaImage src={c?.image} alt={c?.image_alt || ""} sizes="(min-width:1024px) 50vw, 100vw" className="aspect-[4/3] rounded-card" label="Photography to follow" />
                  </div>
                </div>
                <div className={i % 2 ? "lg:order-1 lg:col-span-5" : "lg:col-span-5 lg:col-start-8"}>
                  <p data-reveal="" className="font-display text-5xl italic text-brand-500">
                    {s.number}
                  </p>
                  <SplitHeading as="h2" id={`${s.key}-title`} text={s.title} className="mt-4 text-3xl font-bold leading-tight sm:text-4xl" />
                  <p data-reveal="" className="mt-5 text-lg leading-relaxed text-muted">
                    {c?.summary || s.summary}
                  </p>
                  <div data-reveal="">
                    <CheckList items={s.points} className="mt-7" />
                  </div>
                  <div data-reveal="" className="mt-9 flex flex-wrap gap-3">
                    <ButtonLink href={href} arrow>
                      {s.cta}
                    </ButtonLink>
                    {s.key === "properties-for-sale" && (
                      <ButtonLink href="/commercial-properties/" variant="secondary">
                        Commercial properties
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </Container>
      </Section>
      <CtaBand title="Not sure which service *you need?*" intro="Tell us about your situation and we’ll point you in the right direction." />
    </>
  );
}
