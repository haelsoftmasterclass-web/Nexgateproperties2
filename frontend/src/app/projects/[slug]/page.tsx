import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { Accordion } from "@/components/content/Accordion";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { ContactAside } from "@/components/content/ContactAside";
import { CtaBand } from "@/components/content/CtaBand";
import { Gallery } from "@/components/content/Gallery";
import { MediaImage } from "@/components/content/MediaImage";
import { Prose } from "@/components/content/Prose";
import { ErrorState, Notice } from "@/components/content/States";
import { CheckList } from "@/components/content/Steps";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Container, Section } from "@/components/ui/Section";
import { getProject, getRedirect, getRelatedProjects, getSiteSettings } from "@/lib/api";
import { formatDate, locationLine } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

async function load(slug: string) {
  const res = await getProject(slug);
  if (!res.ok && res.error === "not-found") {
    const target = await getRedirect("project", slug);
    if (target) permanentRedirect(`/projects/${target}/`);
    notFound();
  }
  return res;
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const res = await load(slug);
  if (!res.ok) return { title: "Project", robots: { index: false } };
  const p = res.data;
  return pageMetadata({
    title: p.seo_title || p.name,
    description: p.meta_description || p.summary || `${p.category_label} in ${locationLine([p.city, p.state_region, p.country])}. Status: ${p.status_label}.`,
    path: `/projects/${p.slug}/`,
    image: p.hero_image,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const res = await load(slug);
  if (!res.ok) {
    return (
      <Container className="py-24">
        <ErrorState title="We couldn’t load this project right now" />
      </Container>
    );
  }
  const p = res.data;
  const [related, settings] = await Promise.all([getRelatedProjects(slug), getSiteSettings()]);
  const location = locationLine([p.location_description, p.city, p.state_region, p.country]);
  const facts = [
    { label: "Category", value: p.category_label },
    { label: "Status", value: p.status_label },
    { label: "Location", value: locationLine([p.city, p.state_region, p.country]) },
    { label: "Start", value: formatDate(p.start_date) },
    { label: "Expected completion", value: p.expected_completion },
    { label: "Our role", value: p.nexgate_role },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));
  const enquiryKinds = [p.accepts_purchase_enquiries && "purchase", p.accepts_investment_enquiries && "investment"].filter(Boolean);

  return (
    <>
      <section className="-mt-18 bg-paper pb-12 pt-28 sm:pt-32">
        <Container>
          <Breadcrumbs items={[{ name: "Projects", href: "/projects/" }, { name: p.name, href: `/projects/${p.slug}/` }]} />
          <p data-reveal="" className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
            {p.category_label} · <span className="text-gold-700">{p.status_label}</span>
          </p>
          <SplitHeading as="h1" text={p.name} className="mt-4 max-w-4xl text-4xl font-bold leading-[1.05] sm:text-6xl" />
          {p.summary && (
            <p data-reveal="" className="mt-6 max-w-2xl text-lg text-muted">
              {p.summary}
            </p>
          )}
        </Container>
      </section>
      <Container className="-mt-2">
        <div data-reveal="scale">
          <MediaImage
            src={p.hero_image}
            alt={p.hero_image_alt || p.name}
            sizes="100vw"
            priority
            className="aspect-[21/9] rounded-card"
            label="Project visuals to follow"
            badge={p.hero_image ? (p.hero_image_is_rendering ? "Artist’s impression" : "Photograph") : undefined}
          />
        </div>
      </Container>

      <Section className="!pt-14">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <dl className="grid grid-cols-2 overflow-hidden rounded-card border-l border-t border-line sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="border-b border-r border-line bg-white p-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{f.label}</dt>
                  <dd className="mt-1.5 font-bold">{f.value}</dd>
                </div>
              ))}
            </dl>
            {location && <p className="mt-4 text-sm text-muted">{location}</p>}

            {p.description && (
              <div className="mt-14">
                <h2 className="text-2xl font-bold">Project overview</h2>
                <Prose source={p.description} className="mt-5" />
              </div>
            )}

            {p.key_features.length > 0 && (
              <div className="mt-14">
                <h2 className="text-2xl font-bold">Key features</h2>
                <CheckList items={p.key_features} className="mt-5 sm:columns-2 [&>li]:break-inside-avoid" />
              </div>
            )}

            {p.images.length > 0 && (
              <div className="mt-14">
                <h2 className="mb-5 text-2xl font-bold">Gallery</h2>
                <Gallery images={p.images} title={p.name} />
                <p className="mt-3 text-xs text-muted">Images marked “Artist’s impression” are architectural renderings, not photographs.</p>
              </div>
            )}

            {p.faqs.length > 0 && (
              <div className="mt-14">
                <h2 className="mb-5 text-2xl font-bold">Frequently asked questions</h2>
                <Accordion items={p.faqs} />
              </div>
            )}

            <Notice className="mt-14">
              {enquiryKinds.length
                ? `This project is open to ${enquiryKinds.join(" and ")} enquiries. Details, availability and terms are confirmed in writing by our team.`
                : "Purchase or investment availability has not been announced for this project. You can still register your interest."}
            </Notice>
          </div>
          <aside className="lg:col-span-4" aria-label="Enquire about this project">
            <div className="space-y-6 lg:sticky lg:top-24">
              <EnquiryForm
                category={p.accepts_investment_enquiries && !p.accepts_purchase_enquiries ? "investment" : "project"}
                projectSlug={p.slug}
                title="Enquire about this project"
                intro={enquiryKinds.length ? "Ask about availability or register your interest." : "Register your interest and we’ll keep you updated."}
                fields={[
                  {
                    name: "investment_focus",
                    label: "I’m interested in",
                    type: "select",
                    options: [
                      ...(p.accepts_purchase_enquiries ? [{ value: "purchase", label: "Buying" }] : []),
                      ...(p.accepts_investment_enquiries ? [{ value: "investment", label: "Investing" }] : []),
                      { value: "updates", label: "Project updates" },
                      { value: "partnership", label: "Partnership" },
                    ],
                  },
                ]}
                showContactMethod={false}
                className="!p-6"
              />
              <ContactAside settings={settings} />
            </div>
          </aside>
        </Container>
      </Section>

      {related.ok && related.data.length > 0 && (
        <Section tone="paper" labelledBy="related-projects">
          <Container>
            <h2 id="related-projects" className="text-3xl font-bold">
              Other projects
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {related.data.map((r, i) => (
                <ProjectCard key={r.slug} project={r} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}
      <CtaBand title="Talk to us about *this project.*" intro="Our team can answer questions and keep you updated as the project progresses." />
    </>
  );
}
