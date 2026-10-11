import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand } from "@/components/content/CtaBand";
import { PageHero } from "@/components/content/PageHero";
import { Pagination } from "@/components/content/Pagination";
import { EmptyState, ErrorState } from "@/components/content/States";
import { ProjectCard } from "@/components/project/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Container, Section } from "@/components/ui/Section";
import { getProjectFacets, getProjects } from "@/lib/api";
import { firstParam } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

const PAGE_SIZE = 9;

export async function generateMetadata({ searchParams }: PageProps<"/projects">): Promise<Metadata> {
  const sp = await searchParams;
  return pageMetadata({
    title: "Our Development Projects",
    description: "Residential and commercial development projects presented by Nexgate Properties, with location, category and current status.",
    path: "/projects/",
    noindex: Boolean(firstParam(sp.category) || firstParam(sp.status) || firstParam(sp.page)),
  });
}

function FilterChips({ label, param, options, current, other }: { label: string; param: string; options: { value: string; label?: string; count: number }[]; current?: string; other: Record<string, string | undefined> }) {
  const href = (value?: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(other)) if (v) q.set(k, v);
    if (value) q.set(param, value);
    return `/projects/${q.size ? `?${q}` : ""}`;
  };
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="mr-2 text-sm font-semibold text-muted">{label}</span>
      <Link href={href()} aria-current={!current ? "true" : undefined} className={cn("rounded-full px-4 py-2 text-sm font-semibold ring-1", !current ? "bg-ink text-white ring-ink" : "ring-line hover:ring-ink/30")}>
        All
      </Link>
      {options.map((o) => (
        <Link key={o.value} href={href(o.value)} aria-current={current === o.value ? "true" : undefined} className={cn("rounded-full px-4 py-2 text-sm font-semibold ring-1", current === o.value ? "bg-ink text-white ring-ink" : "ring-line hover:ring-ink/30")}>
          {o.label} <span className="opacity-60">({o.count})</span>
        </Link>
      ))}
    </div>
  );
}

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const sp = await searchParams;
  const facets = await getProjectFacets();
  const allowedCats = facets.ok ? facets.data.categories.map((c) => c.value) : [];
  const allowedStatuses = facets.ok ? facets.data.statuses.map((c) => c.value) : [];
  const category = allowedCats.includes(firstParam(sp.category) ?? "") ? firstParam(sp.category) : undefined;
  const status = allowedStatuses.includes(firstParam(sp.status) ?? "") ? firstParam(sp.status) : undefined;
  const pageRaw = firstParam(sp.page);
  const page = pageRaw && /^\d{1,3}$/.test(pageRaw) ? Number(pageRaw) : 1;
  const list = await getProjects({ category, status, page: String(page), page_size: String(PAGE_SIZE) });

  return (
    <>
      <PageHero
        title="Our *projects.*"
        eyebrow="Development portfolio"
        intro="Residential and commercial developments presented by Nexgate Properties, with each project’s location and current status."
        crumbs={[{ name: "Projects", href: "/projects/" }]}
        actions={
          <>
            <ButtonLink href="/property-development/" arrow>
              Discuss a development
            </ButtonLink>
            <ButtonLink href="/book-a-consultation/" variant="secondary">
              Book a consultation
            </ButtonLink>
          </>
        }
      />
      <Section labelledBy="projects-list">
        <Container>
          <h2 id="projects-list" className="sr-only">
            Project list
          </h2>
          {facets.ok && facets.data.total > 1 && (
            <div className="mb-12 space-y-4 border-b border-line pb-8">
              {facets.data.categories.length > 1 && <FilterChips label="Category" param="category" options={facets.data.categories} current={category} other={{ status }} />}
              {facets.data.statuses.length > 1 && <FilterChips label="Status" param="status" options={facets.data.statuses} current={status} other={{ category }} />}
            </div>
          )}
          {!list.ok && <ErrorState title="We couldn’t load projects right now" />}
          {list.ok && list.data.results.length > 0 && (
            <>
              <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {list.data.results.map((p, i) => (
                  <ProjectCard key={p.slug} project={p} index={i} />
                ))}
              </div>
              <Pagination basePath="/projects/" page={page} total={list.data.count} pageSize={PAGE_SIZE} query={{ category, status }} />
            </>
          )}
          {list.ok && list.data.results.length === 0 && (
            <EmptyState
              title={category || status ? "No projects match this filter" : "Projects will be published here"}
              icon="layers"
              actions={
                category || status ? (
                  <ButtonLink href="/projects/" variant="secondary">
                    Show all projects
                  </ButtonLink>
                ) : (
                  <ButtonLink href="/property-development/" arrow>
                    Register your interest
                  </ButtonLink>
                )
              }
            >
              {category || status ? "Try another filter." : "Development projects will appear here once their details are confirmed and approved for publication."}
            </EmptyState>
          )}
        </Container>
      </Section>
      <CtaBand title="Interested in a *development?*" intro="Ask about current projects, register interest in upcoming ones, or discuss a partnership." primary={{ label: "Make a project enquiry", href: "/property-development/#enquire" }} />
    </>
  );
}
