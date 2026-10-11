import type { ReactNode } from "react";

import type { ServiceContent, SiteSettings } from "@/lib/types";

import { EnquiryForm, type EnquiryCategory, type ExtraField } from "../forms/EnquiryForm";
import { ButtonLink } from "../ui/Button";
import { Icon, type IconName } from "../ui/Icon";
import { Container, Section, SectionHeading } from "../ui/Section";
import { ContactAside } from "./ContactAside";
import { CtaBand } from "./CtaBand";
import { MediaImage } from "./MediaImage";
import { PageHero } from "./PageHero";
import { Prose } from "./Prose";
import { Notice } from "./States";
import { Steps } from "./Steps";

export type Offering = { icon: IconName; title: string; body: string };

/**
 * Shared template for the service pages. Default copy is passed in from each page; when management
 * publishes "Service content" in the admin, its headline, summary, body and image take precedence.
 */
export function ServiceLayout({
  cms,
  settings,
  path,
  crumbs,
  eyebrow,
  title,
  intro,
  overviewTitle,
  overview,
  offeringsTitle,
  offerings,
  extra,
  processTitle = "How it *works.*",
  process,
  disclosure,
  form,
  cta,
}: {
  cms?: ServiceContent;
  settings: SiteSettings;
  path: string;
  crumbs?: { name: string; href: string }[];
  eyebrow: string;
  title: string;
  intro: string;
  overviewTitle: string;
  overview: ReactNode;
  offeringsTitle: string;
  offerings: Offering[];
  extra?: ReactNode;
  processTitle?: string;
  process: { title: string; body: string }[];
  disclosure?: ReactNode;
  form: {
    category: EnquiryCategory;
    title: string;
    intro: string;
    fields?: ExtraField[];
    submitLabel?: string;
    messageRequired?: boolean;
    notice?: string;
  };
  cta: { title: string; intro: string };
}) {
  return (
    <>
      <PageHero
        title={cms?.headline || title}
        eyebrow={eyebrow}
        intro={cms?.summary || intro}
        crumbs={crumbs ?? [{ name: "Services", href: "/services/" }, { name: eyebrow, href: path }]}
        actions={
          <>
            <ButtonLink href="#enquire" arrow>
              {form.submitLabel ?? "Make an enquiry"}
            </ButtonLink>
            <ButtonLink href="/book-a-consultation/" variant="secondary">
              Book a consultation
            </ButtonLink>
          </>
        }
      />

      <Section labelledBy="overview-title">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="overview-title" eyebrow="Overview" title={overviewTitle} />
            <div data-reveal="" className="mt-8 space-y-5 text-lg leading-relaxed text-charcoal">
              {cms?.body ? <Prose source={cms.body} /> : overview}
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div data-reveal="scale">
              <MediaImage
                src={cms?.image}
                alt={cms?.image_alt || ""}
                sizes="(min-width:1024px) 40vw, 100vw"
                className="aspect-[4/5] rounded-card"
                label="Photography to follow"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" labelledBy="offerings-title">
        <Container>
          <SectionHeading id="offerings-title" eyebrow="What we cover" title={offeringsTitle} />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((o, i) => (
              <li key={o.title} data-reveal="" style={{ ["--reveal-delay" as string]: (i % 3) * 90 }} className="rounded-card bg-white p-8 ring-1 ring-line">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                  <Icon name={o.icon} size={22} />
                </span>
                <h3 className="mt-6 text-lg font-bold">{o.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{o.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {extra}

      <Section labelledBy="process-title">
        <Container>
          <SectionHeading id="process-title" eyebrow="The process" title={processTitle} />
          <div className="mt-14">
            <Steps steps={process} />
          </div>
          {disclosure && <div className="mt-10">{disclosure}</div>}
        </Container>
      </Section>

      <Section tone="paper" id="enquire" labelledBy="enquire-title" className="scroll-mt-20">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="enquire-title" eyebrow="Enquire" title={form.title} intro={form.intro} />
            <div data-reveal="" className="mt-8">
              <ContactAside settings={settings} />
            </div>
          </div>
          <div className="lg:col-span-8">
            <EnquiryForm
              category={form.category}
              fields={form.fields}
              submitLabel={form.submitLabel ?? "Send enquiry"}
              messageRequired={form.messageRequired}
              notice={form.notice}
            />
          </div>
        </Container>
      </Section>

      <CtaBand title={cta.title} intro={cta.intro} />
    </>
  );
}

export function RiskNotice({ children }: { children: ReactNode }) {
  return <Notice tone="warning">{children}</Notice>;
}
