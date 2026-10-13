import type { Metadata } from "next";

import { SitePhotos } from "@/components/content/SitePhotos";
import { EmptyState } from "@/components/content/States";
import { ServiceLayout } from "@/components/content/ServiceLayout";
import { ProjectCard } from "@/components/project/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getProjects, getServiceContent, getSiteSettings } from "@/lib/api";
import { PROPERTY_CATEGORY_OPTIONS } from "@/lib/formOptions";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const cms = (await getServiceContent())["property-development"];
  return pageMetadata({
    title: cms?.seo_title || "Property Development and New Projects",
    description:
      cms?.meta_description ||
      "Explore residential and commercial property developments with Nexgate Properties, register interest in new projects and discuss development partnerships.",
    path: "/property-development/",
  });
}

export default async function PropertyDevelopmentPage() {
  const [cmsAll, settings, projects] = await Promise.all([
    getServiceContent(),
    getSiteSettings(),
    getProjects({ page_size: "3" }),
  ]);
  const list = projects.ok ? projects.data.results : [];
  return (
    <ServiceLayout
      cms={cmsAll["property-development"]}
      settings={settings}
      path="/property-development/"
      eyebrow="Property development"
      title="New developments, *thoughtfully presented.*"
      intro="Residential and commercial development opportunities, from early interest through to partnership discussions."
      overviewTitle="Development opportunities, *clearly explained.*"
      overview={
        <>
          <p>
            Nexgate Properties works on residential and commercial development
            opportunities and new property developments. We help buyers and
            investors understand what each project offers, keep them informed of
            its status, and handle enquiries and partnership discussions.
          </p>
          <p>
            Our role on each project is stated on its project page. Construction
            work within Nexgate Group is carried out by Nexgate Construction
            where it is involved, and project pages make clear who is
            responsible for what.
          </p>
        </>
      }
      offeringsTitle="Development *enquiries we handle.*"
      offerings={[
        {
          icon: "home",
          title: "Residential developments",
          body: "Homes within new residential developments, from apartments to houses, as projects become available.",
        },
        {
          icon: "building",
          title: "Commercial developments",
          body: "Office, retail and mixed-use developments for businesses and investors.",
        },
        {
          icon: "layers",
          title: "New project launches",
          body: "Register interest early and receive information as new projects are released.",
        },
        {
          icon: "handshake",
          title: "Development partnerships",
          body: "Landowners, developers and investors can discuss potential collaboration on development projects.",
        },
        {
          icon: "compass",
          title: "Development consultations",
          body: "Talk through a development idea or requirement with our team before you commit.",
        },
        {
          icon: "chart",
          title: "Development investment enquiries",
          body: "Where a project is open to investment, we’ll explain what is available and the considerations involved.",
        },
      ]}
      extra={
        <>
          <SitePhotos tone="paper" />
          <Section labelledBy="dev-projects">
            <Container>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading
                  id="dev-projects"
                  eyebrow="Featured projects"
                  title="Current *projects.*"
                />
                <ButtonLink href="/projects/" variant="secondary" arrow>
                  All projects
                </ButtonLink>
              </div>
              <div className="mt-12">
                {list.length ? (
                  <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {list.map((p, i) => (
                      <ProjectCard key={p.slug} project={p} index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Projects will be published here"
                    icon="layers"
                  >
                    We’ll share development projects here once their details are
                    confirmed. Register your interest below.
                  </EmptyState>
                )}
              </div>
            </Container>
          </Section>
        </>
      }
      process={[
        {
          title: "Share your interest",
          body: "Tell us whether you are a buyer, investor, landowner or developer, and what you are looking for.",
        },
        {
          title: "Initial conversation",
          body: "We discuss your goals, the projects or opportunities that may fit, and what information you need.",
        },
        {
          title: "Project information",
          body: "We share confirmed project details, status and next steps for the opportunities you choose to explore.",
        },
        {
          title: "Agree next steps",
          body: "Any purchase, investment or partnership proceeds only on written terms agreed by all parties.",
        },
      ]}
      form={{
        category: "project",
        title: "Discuss a *development.*",
        intro:
          "Register interest in a project or start a partnership conversation.",
        fields: [
          {
            name: "submission_type",
            label: "I am a",
            type: "select",
            options: [
              { value: "buyer", label: "Buyer" },
              { value: "investor", label: "Investor" },
              { value: "landowner", label: "Landowner" },
              { value: "developer", label: "Developer or partner" },
              { value: "other", label: "Other" },
            ],
            half: true,
          },
          {
            name: "property_category",
            label: "Development type",
            type: "select",
            options: PROPERTY_CATEGORY_OPTIONS,
            half: true,
          },
          {
            name: "preferred_location",
            label: "Preferred location",
            type: "text",
            placeholder: "City or area",
          },
        ],
        submitLabel: "Send development enquiry",
      }}
      cta={{
        title: "Have a development *in mind?*",
        intro:
          "Talk to our team about upcoming projects or partnership opportunities.",
      }}
    />
  );
}
