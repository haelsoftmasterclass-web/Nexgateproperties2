import { redirect } from "next/navigation";

import { getProperties, getPropertyFacets, type PropertyQuery } from "@/lib/api";
import { firstParam } from "@/lib/format";

import { CtaBand } from "../content/CtaBand";
import { PageHero } from "../content/PageHero";
import { Pagination } from "../content/Pagination";
import { EmptyState, ErrorState } from "../content/States";
import { CheckList } from "../content/Steps";
import { ButtonLink } from "../ui/Button";
import { Container, Section, SectionHeading } from "../ui/Section";
import { FilterPanel } from "./FilterPanel";
import { PropertyGrid } from "./PropertyCard";

const PAGE_SIZE = 12;
const FILTER_KEYS = ["q", "type", "country", "state", "city", "currency", "min_price", "max_price", "status", "bedrooms", "ordering", "page"] as const;
const ORDERINGS = new Set(["price", "-price", "-published_at"]);

type SearchParams = Record<string, string | string[] | undefined>;

/** Normalises query parameters: trims, drops unknown keys, rejects malformed numbers. */
export function normaliseFilters(sp: SearchParams) {
  const values: Record<string, string | undefined> = {};
  for (const key of FILTER_KEYS) {
    const raw = firstParam(sp[key])?.trim().slice(0, 100);
    if (!raw) continue;
    if (["min_price", "max_price"].includes(key) && !/^\d+(\.\d+)?$/.test(raw)) continue;
    if (["bedrooms", "page"].includes(key) && !/^\d{1,3}$/.test(raw)) continue;
    if (key === "ordering" && !ORDERINGS.has(raw)) continue;
    values[key] = raw;
  }
  if (values.page === "1") delete values.page;
  return values;
}

export function hasActiveFilters(sp: SearchParams) {
  return Object.keys(normaliseFilters(sp)).length > 0;
}

type Copy = {
  title: string;
  eyebrow: string;
  intro: string;
  path: string;
  crumb: string;
  aboutTitle: string;
  about: string[];
  categories: string[];
  emptyTitle: string;
  emptyBody: string;
};

export async function PropertyListingPage({
  category,
  searchParams,
  copy,
}: {
  category: "residential" | "commercial";
  searchParams: SearchParams;
  copy: Copy;
}) {
  // Homepage search posts here without JS; send commercial searches to the right page.
  const requested = firstParam(searchParams.category);
  if (requested && requested !== category && (requested === "residential" || requested === "commercial")) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(normaliseFilters(searchParams))) if (v) params.set(k, v);
    redirect(`/${requested}-properties/${params.size ? `?${params}` : ""}`);
  }

  const values = normaliseFilters(searchParams);
  const page = Number(values.page || 1);
  const query: PropertyQuery = { ...values, category, page: String(page), page_size: String(PAGE_SIZE) };
  const [list, facets] = await Promise.all([getProperties(query), getPropertyFacets(category)]);
  const filtered = Object.keys(values).some((k) => k !== "page" && k !== "ordering");

  return (
    <>
      <PageHero
        title={copy.title}
        eyebrow={copy.eyebrow}
        intro={copy.intro}
        crumbs={[{ name: copy.crumb, href: copy.path }]}
        actions={
          <>
            <ButtonLink href="#listings" arrow>
              View listings
            </ButtonLink>
            <ButtonLink href="/book-a-consultation/" variant="secondary">
              Request a viewing or consultation
            </ButtonLink>
          </>
        }
      />

      <Section id="listings" labelledBy="listings-title" className="scroll-mt-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <aside className="lg:col-span-4 xl:col-span-3" aria-label="Filters">
              {facets.ok && facets.data.total > 0 && (
                <FilterPanel basePath={copy.path} facets={facets.data} values={values} showBedrooms={category === "residential"} />
              )}
              {facets.ok && facets.data.total === 0 && (
                <div className="rounded-card bg-paper p-6 ring-1 ring-line">
                  <h2 className="font-bold">Looking for something specific?</h2>
                  <p className="mt-2 text-sm text-muted">Search filters will appear here once listings are published.</p>
                </div>
              )}
            </aside>
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
                <h2 id="listings-title" className="text-2xl font-bold">
                  {copy.crumb}
                </h2>
                {list.ok && (
                  <p className="text-sm text-muted" aria-live="polite">
                    {list.data.count} {list.data.count === 1 ? "property" : "properties"}
                    {filtered ? " match your search" : ""}
                  </p>
                )}
              </div>

              {!list.ok && <ErrorState title="We couldn’t load listings right now" />}
              {list.ok && list.data.results.length > 0 && (
                <>
                  <div className="[&>div]:lg:grid-cols-2 [&>div]:xl:grid-cols-3">
                    <PropertyGrid properties={list.data.results} />
                  </div>
                  <Pagination basePath={copy.path} page={page} total={list.data.count} pageSize={PAGE_SIZE} query={values} />
                </>
              )}
              {list.ok && list.data.results.length === 0 && filtered && (
                <EmptyState
                  title="No properties match your search"
                  icon="search"
                  actions={
                    <>
                      <ButtonLink href={copy.path} variant="secondary">
                        Reset filters
                      </ButtonLink>
                      <ButtonLink href="/book-a-consultation/" arrow>
                        Tell us what you need
                      </ButtonLink>
                    </>
                  }
                >
                  Try widening your search, or share your requirements and our team will look for suitable options.
                </EmptyState>
              )}
              {list.ok && list.data.results.length === 0 && !filtered && (
                <EmptyState
                  title={copy.emptyTitle}
                  actions={
                    <>
                      <ButtonLink href="/book-a-consultation/" arrow>
                        Share your requirements
                      </ButtonLink>
                      <ButtonLink href="/sell-or-partner-with-us/" variant="secondary">
                        Submit a property
                      </ButtonLink>
                    </>
                  }
                >
                  {copy.emptyBody}
                </EmptyState>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" labelledBy="about-listings">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading id="about-listings" eyebrow="How we can help" title={copy.aboutTitle}>
            <div data-reveal="" className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              {copy.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </SectionHeading>
          <div data-reveal="" className="self-end rounded-card bg-white p-8 ring-1 ring-line">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Property types we may present</p>
            <CheckList className="mt-6" items={copy.categories} />
            <p className="mt-6 text-sm text-muted">Available types depend on current listings. Filters only show types with published properties.</p>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Can’t see the *right property yet?*"
        intro="Tell us your preferred location, budget and timeline. We’ll contact you about suitable options and arrange viewings."
        primary={{ label: "Make a property enquiry", href: "/book-a-consultation/" }}
      />
    </>
  );
}
