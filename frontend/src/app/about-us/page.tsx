import type { Metadata } from "next";

import { CtaBand } from "@/components/content/CtaBand";
import { PageHero } from "@/components/content/PageHero";
import { Notice } from "@/components/content/States";
import { Steps } from "@/components/content/Steps";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getSiteSettings } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "About Nexgate Properties",
  description:
    "Nexgate Properties is the real estate business of Nexgate Group, serving buyers, investors, owners, developers and international clients. Learn about our approach and values.",
  path: "/about-us/",
});

// Proposed wording from the brief; replace in Site settings once management approves final copy.
const DEFAULT_VISION =
  "To be a trusted real estate brand for clients in Nigeria and around the world, known for clarity, quality and professionalism.";
const DEFAULT_MISSION =
  "To help our clients find, develop, invest in and manage property through accurate information, sound guidance and dependable service.";

const VALUES = [
  { title: "Quality", body: "We aim for high standards in the properties we present and the service we provide." },
  { title: "Integrity", body: "We give honest, accurate information, including about what is not yet confirmed." },
  { title: "Accountability", body: "We take ownership of our commitments and follow through on them." },
  { title: "Professionalism", body: "We treat every client, enquiry and transaction with care and respect." },
  { title: "Client focus", body: "We start with our clients’ goals and shape our advice around them." },
  { title: "Continuous improvement", body: "We keep learning and refining how we work." },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        title="About *Nexgate Properties.*"
        eyebrow="Who we are"
        intro="The real estate business of Nexgate Group, helping clients buy, develop, invest in and manage property in Nigeria and internationally."
        crumbs={[{ name: "About us", href: "/about-us/" }]}
      />

      <Section labelledBy="intro-title">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="intro-title" eyebrow="Our company" title="Real estate, *done with care.*" />
          </div>
          <div data-reveal="" className="space-y-5 text-lg leading-relaxed text-charcoal lg:col-span-6">
            <p>
              Nexgate Properties serves residential and commercial property buyers, investors, property owners, developers and international clients.
              We present property opportunities and development projects, handle investment enquiries, provide property and facility management
              support, and offer real estate advisory and consultancy.
            </p>
            <p>
              Our aim is simple: to give every client clear information, straightforward guidance and a professional experience from first enquiry to
              next steps.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="dark" labelledBy="group-title">
        <Container className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading
              id="group-title"
              light
              eyebrow="Part of Nexgate Group"
              title="One group, *complementary businesses.*"
              intro="Nexgate Properties is a business of Nexgate Group, which also includes Nexgate Construction and Valdo Interiors."
            />
          </div>
          <ul className="grid gap-px overflow-hidden rounded-card bg-white/10 lg:col-span-6">
            {settings.affiliates.map((a) => (
              <li key={a.name} className="flex items-center justify-between gap-6 bg-ink p-6">
                <div>
                  <p className="text-lg font-bold">{a.name}</p>
                  {a.description && <p className="text-sm text-white/60">{a.description}</p>}
                </div>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold-300 hover:text-white">
                    Visit
                  </a>
                )}
              </li>
            ))}
            <li className="bg-brand-700 p-6">
              <p className="text-lg font-bold">Nexgate Properties</p>
              <p className="text-sm text-white/70">Real estate</p>
            </li>
          </ul>
        </Container>
      </Section>

      <Section labelledBy="mv-title">
        <Container>
          <SectionHeading id="mv-title" eyebrow="Vision and mission" title="What we’re *working towards.*" />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div data-reveal="" className="rounded-card bg-paper p-10 ring-1 ring-line">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Vision</p>
              <p className="mt-5 text-2xl font-bold leading-snug">{settings.vision || DEFAULT_VISION}</p>
            </div>
            <div data-reveal="" style={{ ["--reveal-delay" as string]: 90 }} className="rounded-card bg-paper p-10 ring-1 ring-line">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Mission</p>
              <p className="mt-5 text-2xl font-bold leading-snug">{settings.mission || DEFAULT_MISSION}</p>
            </div>
          </div>
          {!settings.about_copy_approved && <Notice className="mt-6">Proposed wording. The vision, mission and values are pending management approval.</Notice>}
        </Container>
      </Section>

      <Section tone="paper" labelledBy="values-title">
        <Container>
          <SectionHeading id="values-title" eyebrow="Core values" title="The values *behind our work.*" />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <li key={v.title} className="bg-white p-8">
                <div data-reveal="" style={{ ["--reveal-delay" as string]: (i % 3) * 90 }}>
                <span className="font-display text-4xl italic text-brand-500">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-xl font-bold">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="approach-title">
        <Container>
          <SectionHeading
            id="approach-title"
            eyebrow="Our approach"
            title="Client-focused, *from the first conversation.*"
            intro="However you come to us, we follow the same simple approach."
          />
          <div className="mt-14">
            <Steps
              steps={[
                { title: "Listen", body: "We start by understanding your goals, budget, timeline and concerns." },
                { title: "Inform", body: "We share clear, accurate information, and we tell you what still needs to be confirmed." },
                { title: "Guide", body: "We explain your options and the considerations behind each one." },
                { title: "Follow through", body: "We keep you updated and help you move forward with confidence." },
              ]}
            />
          </div>
        </Container>
      </Section>

      <Section tone="paper" labelledBy="svc-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="svc-title" eyebrow="Our services" title="How we can *help.*" />
            <ButtonLink href="/services/" variant="secondary" arrow>
              All services
            </ButtonLink>
          </div>
          <div className="mt-14">
            <ServiceGrid services={SERVICES} />
          </div>
        </Container>
      </Section>

      <CtaBand title="Let’s start a *conversation.*" intro="Contact our team about buying, developing, investing in or managing property." primary={{ label: "Contact us", href: "/contact-us/" }} secondary={{ label: "Book a consultation", href: "/book-a-consultation/" }} />
    </>
  );
}
