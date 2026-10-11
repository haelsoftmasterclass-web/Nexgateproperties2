import type { MetadataRoute } from "next";

import { getArticles, getLegalPage, getProjects, getProperties } from "@/lib/api";
import type { Paginated } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC_ROUTES = [
  "/",
  "/about-us/",
  "/services/",
  "/residential-properties/",
  "/commercial-properties/",
  "/property-development/",
  "/projects/",
  "/real-estate-investment/",
  "/property-facility-management/",
  "/real-estate-advisory/",
  "/international-property/",
  "/sell-or-partner-with-us/",
  "/book-a-consultation/",
  "/contact-us/",
  "/insights/",
  "/frequently-asked-questions/",
];

async function all<T>(fetchPage: (page: number) => Promise<{ ok: true; data: Paginated<T> } | { ok: false }>): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; page <= 50; page++) {
    const res = await fetchPage(page);
    if (!res.ok) break;
    out.push(...res.data.results);
    if (!res.data.next) break;
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, projects, articles, privacy, terms] = await Promise.all([
    all((page) => getProperties({ page: String(page), page_size: "48" })),
    all((page) => getProjects({ page: String(page), page_size: "48" })),
    all((page) => getArticles({ page: String(page), page_size: "48" })),
    getLegalPage("privacy-policy"),
    getLegalPage("terms-and-conditions"),
  ]);
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` }));
  // Legal pages are only listed once they have passed legal review (drafts are noindex).
  if (privacy.ok && privacy.data.legal_review_complete) entries.push({ url: `${SITE_URL}/privacy-policy/`, lastModified: privacy.data.updated_at });
  if (terms.ok && terms.data.legal_review_complete) entries.push({ url: `${SITE_URL}/terms-and-conditions/`, lastModified: terms.data.updated_at });
  entries.push(...properties.map((p) => ({ url: `${SITE_URL}/properties/${p.slug}/` })));
  entries.push(...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}/` })));
  entries.push(...articles.map((a) => ({ url: `${SITE_URL}/insights/${a.slug}/`, lastModified: a.published_at ?? undefined })));
  return entries;
}
