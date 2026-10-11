import type { Metadata } from "next";

import { ArticleCard } from "@/components/insights/ArticleCard";
import { CtaBand } from "@/components/content/CtaBand";
import { EmptyState } from "@/components/content/States";
import { CheckList } from "@/components/content/Steps";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { CountUp } from "@/components/motion/CountUp";
import { Marquee } from "@/components/motion/Marquee";
import { ProjectCard } from "@/components/project/ProjectCard";
import { PropertyGrid } from "@/components/property/PropertyCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getArticles, getProjects, getProperties, getPropertyFacets } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Nexgate Properties | Real Estate in Nigeria and Beyond",
    description:
      "Find residential and commercial property, explore new developments and investment opportunities, and arrange property management and advice with Nexgate Properties, part of Nexgate Group.",
    path: "/",
  }),
  title: { absolute: "Nexgate Properties | Real Estate in Nigeria and Beyond" },
};

const PILLARS = [
  {
    title: "Clear information, *not guesswork.*",
    body: "Every listing shows its status and the details that have been confirmed. Where something is still being verified, we say so, so you can make decisions with confidence.",
  },
  {
    title: "Guidance, *not pressure.*",
    body: "Whether you are buying a home, looking for commercial space or weighing an investment, we start with your goals and talk you through the considerations before any commitment.",
  },
  {
    title: "A wider group, *not a single desk.*",
    body: "Nexgate Properties is part of Nexgate Group, alongside Nexgate Construction and Valdo Interiors, so your property conversations sit within a broader group of businesses.",
  },
];

export default async function HomePage() {
  const [featuredProps, featuredProjects, articles, facets] = await Promise.all([
    getProperties({ featured: "true", page_size: "6" }),
    getProjects({ featured: "true", page_size: "2" }),
    getArticles({ page_size: "3" }),
    getPropertyFacets(),
  ]);

  const locations = facets.ok ? facets.data.cities.map((c) => c.value) : [];
  let properties = featuredProps.ok ? featuredProps.data.results : [];
  if (featuredProps.ok && properties.length === 0) {
    const latest = await getProperties({ page_size: "6" });
    properties = latest.ok ? latest.data.results : [];
  }
  let projects = featuredProjects.ok ? featuredProjects.data.results : [];
  if (featuredProjects.ok && projects.length === 0) {
    const latest = await getProjects({ page_size: "2" });
    projects = latest.ok ? latest.data.results : [];
  }

  return (
    <>
      <Hero locations={locations} />

      <div className="border-y border-line bg-white py-6" aria-label="Our services">
        <Marquee
          items={SERVICES.map((s) => (
            <span key={s.key} className="text-lg font-semibold text-ink/80">
              {s.navLabel}
            </span>
          ))}
        />
      </div>

      {/* Introduction */}
      <Section labelledBy="intro-title">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              id="intro-title"
              eyebrow="Introducing Nexgate Properties"
              title="Real estate with the *backing of a group.*"
              intro={
                <>
                  <p>
                    Nexgate Properties is the real estate business of Nexgate Group. We help individuals, families, businesses and investors find
                    residential and commercial property, take part in new developments, explore investment opportunities, and keep property well
                    managed.
                  </p>
                  <p className="mt-4">
                    We serve clients in Nigeria and Nigerians and international clients abroad, with clear information and a straightforward process
                    from first enquiry to next steps.
                  </p>
                </>
              }
            />
            <div data-reveal="" className="mt-10">
              <ButtonLink href="/about-us/" variant="secondary" arrow>
                About Nexgate Properties
              </ButtonLink>
            </div>
          </div>
          <dl data-reveal="" className="grid grid-cols-2 gap-px self-end overflow-hidden rounded-card bg-line ring-1 ring-line lg:col-span-5">
            {[
              { value: 6, label: "Core real estate services" },
              { value: 2, label: "Group offices, Lagos and New York" },
              { value: 4, label: "Nexgate Group brands" },
              { value: 2, label: "Property categories, residential and commercial" },
            ].map((s) => (
              <div key={s.label} className="bg-white p-6 sm:p-8">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-5xl font-extrabold tracking-tight text-brand-500 sm:text-6xl">
                    <CountUp value={s.value} />
                  </span>
                  <span className="mt-3 block text-sm leading-snug text-muted">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Services */}
      <Section tone="paper" labelledBy="services-title">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              id="services-title"
              eyebrow="What we do"
              title="Six services. *One property team.*"
              intro="From finding the right home to managing an income-producing building, choose the support you need."
            />
            <div data-reveal="">
              <ButtonLink href="/services/" variant="secondary" arrow>
                All services
              </ButtonLink>
            </div>
          </div>
          <div className="mt-14">
            <ServiceGrid services={SERVICES} />
          </div>
        </Container>
      </Section>

      {/* Featured properties */}
      <Section labelledBy="featured-title">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              id="featured-title"
              eyebrow="Featured properties"
              title="Properties *worth a closer look.*"
              intro="Selected residential and commercial opportunities currently presented by Nexgate Properties."
            />
            <div data-reveal="" className="flex flex-wrap gap-3">
              <ButtonLink href="/residential-properties/" variant="secondary">
                Residential
              </ButtonLink>
              <ButtonLink href="/commercial-properties/" variant="secondary">
                Commercial
              </ButtonLink>
            </div>
          </div>
          <div className="mt-14">
            {properties.length > 0 ? (
              <PropertyGrid properties={properties.slice(0, 6)} />
            ) : (
              <EmptyState
                title="New listings are on the way"
                actions={
                  <>
                    <ButtonLink href="/book-a-consultation/" arrow>
                      Tell us what you need
                    </ButtonLink>
                    <ButtonLink href="/sell-or-partner-with-us/" variant="secondary">
                      List your property
                    </ButtonLink>
                  </>
                }
              >
                We are preparing our first published listings. Share your requirements and our team will contact you with suitable options as they
                become available.
              </EmptyState>
            )}
          </div>
        </Container>
      </Section>

      {/* Featured projects */}
      <Section tone="paper" labelledBy="projects-title">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              id="projects-title"
              eyebrow="Development projects"
              title="New developments, *from plan to place.*"
              intro="Follow residential and commercial developments, check their current status and register your interest."
            />
            <div data-reveal="">
              <ButtonLink href="/projects/" variant="secondary" arrow>
                View all projects
              </ButtonLink>
            </div>
          </div>
          <div className="mt-14">
            {projects.length > 0 ? (
              <div className="grid gap-12 lg:grid-cols-2">
                {projects.map((p, i) => (
                  <ProjectCard key={p.slug} project={p} index={i} large />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Project details coming soon"
                icon="layers"
                actions={
                  <ButtonLink href="/property-development/" arrow>
                    Discuss a development
                  </ButtonLink>
                }
              >
                Published development projects will appear here. You can already contact us about development opportunities and partnerships.
              </EmptyState>
            )}
          </div>
        </Container>
      </Section>

      {/* Why choose */}
      <Section labelledBy="why-title">
        <Container>
          <SectionHeading
            id="why-title"
            eyebrow="Why Nexgate Properties"
            title="How we work with *every client.*"
            intro="Three commitments that shape every enquiry, viewing and consultation."
          />
          <div className="mt-14">
            <Pillars items={PILLARS} />
          </div>
        </Container>
      </Section>

      {/* International */}
      <Section tone="dark" labelledBy="intl-title" className="relative overflow-hidden">
        <Container className="relative grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading
              id="intl-title"
              light
              eyebrow="International property"
              title="Property interests that *cross borders.*"
              intro="Whether you are a Nigerian living abroad looking at home, or a client in Nigeria considering property overseas, we help you explore international residential and commercial opportunities and cross-border investment interests."
            />
            <div data-reveal="" className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/international-property/" variant="light" arrow>
                International enquiries
              </ButtonLink>
              <ButtonLink href="/book-a-consultation/" variant="outline-light">
                Book a consultation
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div data-reveal="scale" className="rounded-card bg-white/5 p-8 ring-1 ring-white/10 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">We can help with</p>
              <CheckList
                className="mt-6 text-white/85 [&_span:last-child]:text-white/85"
                items={[
                  "International residential property enquiries",
                  "International commercial property enquiries",
                  "Cross-border property investment interests",
                  "Enquiries from Nigerians abroad and international clients",
                ]}
              />
              <p className="mt-8 border-t border-white/10 pt-6 text-sm text-white/60">
                Group contact points in Lagos, Nigeria and New York, USA.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Insights */}
      {articles.ok && articles.data.results.length > 0 && (
        <Section labelledBy="insights-title">
          <Container>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <SectionHeading id="insights-title" eyebrow="Insights" title="Real estate, *explained.*" intro="Practical guides for buyers, owners and investors." />
              <div data-reveal="">
                <ButtonLink href="/insights/" variant="secondary" arrow>
                  All insights
                </ButtonLink>
              </div>
            </div>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {articles.data.results.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CtaBand
        title="Let’s find the *right property for you.*"
        intro="Tell us about the property you want to buy, develop, invest in or have managed. We’ll respond with clear next steps."
        primary={{ label: "Book a consultation", href: "/book-a-consultation/" }}
        secondary={{ label: "Explore properties", href: "/residential-properties/" }}
      />
    </>
  );
}
