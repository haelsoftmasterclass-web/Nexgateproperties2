import type { Metadata } from "next";

import { ContactAside } from "@/components/content/ContactAside";
import { PageHero } from "@/components/content/PageHero";
import { Notice } from "@/components/content/States";
import { CheckList, Steps } from "@/components/content/Steps";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getSiteSettings } from "@/lib/api";
import { CURRENCY_OPTIONS } from "@/lib/formOptions";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sell or Partner With Us",
  description:
    "Property owners, landowners and developers can submit a property or propose a development partnership or commercial collaboration with Nexgate Properties.",
  path: "/sell-or-partner-with-us/",
});

export default async function SellPartnerPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        title="Sell or *partner with us.*"
        eyebrow="Property owners & partners"
        intro="Submit a property for us to review, or propose a development partnership or commercial collaboration."
        crumbs={[{ name: "Sell or partner with us", href: "/sell-or-partner-with-us/" }]}
        actions={
          <ButtonLink href="#submit" arrow>
            Submit your details
          </ButtonLink>
        }
      />
      <Section labelledBy="ways-title">
        <Container>
          <SectionHeading id="ways-title" eyebrow="Ways to work with us" title="Three ways *to get started.*" />
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: "home" as const, title: "Submit a property", body: "Owners of residential or commercial property can ask us to review it for presentation to our clients." },
              { icon: "handshake" as const, title: "Development partnership", body: "Landowners and developers can propose working together on a development project." },
              { icon: "building" as const, title: "Commercial collaboration", body: "Businesses can propose other real estate collaborations with Nexgate Properties." },
            ].map((w, i) => (
              <li key={w.title} data-reveal="" style={{ ["--reveal-delay" as string]: i * 90 }} className="rounded-card bg-paper p-8 ring-1 ring-line">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-500 ring-1 ring-line">
                  <Icon name={w.icon} size={22} />
                </span>
                <h3 className="mt-6 text-lg font-bold">{w.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{w.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section tone="paper" labelledBy="info-title">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading id="info-title" eyebrow="What we’ll need" title="Information to *have ready.*" intro="You don’t need everything to start, but these details help us review your submission." />
          <div data-reveal="" className="rounded-card bg-white p-8 ring-1 ring-line">
            <CheckList
              items={[
                "Property location and type",
                "Land size and building size, if known",
                "Title or ownership documents available",
                "Asking price or expected terms",
                "Current condition and occupancy",
                "For partnerships: the proposed project and each party’s role",
              ]}
            />
          </div>
        </Container>
      </Section>
      <Section labelledBy="process-title">
        <Container>
          <SectionHeading id="process-title" eyebrow="The process" title="What happens *next.*" />
          <div className="mt-14">
            <Steps
              steps={[
                { title: "Submit", body: "Send us the details using the form below." },
                { title: "Review", body: "Our team reviews your submission and may ask for more information or documents." },
                { title: "Discussion", body: "If it may be a fit, we arrange a conversation or inspection." },
                { title: "Decision", body: "We let you know whether we can proceed and on what terms." },
              ]}
            />
          </div>
        </Container>
      </Section>
      <Section tone="paper" id="submit" labelledBy="submit-title" className="scroll-mt-20">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-4">
            <SectionHeading id="submit-title" eyebrow="Submit" title="Tell us about *your property.*" />
            <Notice tone="warning">
              Submitting a property or proposal does not guarantee that it will be accepted, listed or lead to a partnership. All arrangements are
              subject to review and a written agreement.
            </Notice>
            <ContactAside settings={settings} />
          </div>
          <div className="lg:col-span-8">
            <EnquiryForm
              category="sell-partner"
              fields={[
                {
                  name: "submission_type",
                  label: "I would like to",
                  type: "radio",
                  required: true,
                  options: [
                    { value: "submit-property", label: "Submit a property" },
                    { value: "development-partnership", label: "Propose a development partnership" },
                    { value: "commercial-collaboration", label: "Propose a collaboration" },
                  ],
                },
                {
                  name: "property_type",
                  label: "Property type",
                  type: "select",
                  options: [
                    { value: "residential", label: "Residential building" },
                    { value: "commercial", label: "Commercial building" },
                    { value: "land", label: "Land" },
                    { value: "mixed-use", label: "Mixed-use" },
                    { value: "other", label: "Other" },
                  ],
                  half: true,
                },
                { name: "property_location", label: "Property location", type: "text", placeholder: "Area, city, state", half: true },
                { name: "land_size", label: "Land or building size", type: "text", placeholder: "e.g. 600 m²", half: true },
                { name: "title_documents", label: "Title documents available", type: "text", placeholder: "e.g. C of O, Governor’s Consent", half: true },
                { name: "asking_price", label: "Asking price or expected terms", type: "text", half: true },
                { name: "budget_currency", label: "Currency", type: "select", options: CURRENCY_OPTIONS, half: true },
                { name: "organisation", label: "Company or organisation (if any)", type: "text" },
              ]}
              messageLabel="Description"
              messagePlaceholder="Describe the property or your proposal"
              messageRequired
              submitLabel="Submit for review"
              successTitle="Thank you. Your submission has been received."
              successMessage="Our team will review it and contact you. Please remember that submission does not guarantee acceptance."
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
