import "server-only";

import type {
  ApiResult,
  ArticleCategory,
  ArticleDetail,
  ArticleSummary,
  FAQCategory,
  LegalPage,
  MarketOption,
  Paginated,
  ProjectDetail,
  ProjectFacets,
  ProjectSummary,
  PropertyDetail,
  PropertyFacets,
  PropertySummary,
  ServiceContent,
  SiteSettings,
} from "./types";
import { FALLBACK_SITE_SETTINGS } from "./site";
import {
  DEMO_LISTINGS_ENABLED,
  demoProperty,
  demoPropertyFacets,
  demoPropertyList,
  demoRelated,
} from "./demoListings";

const API_URL = (process.env.API_URL || "http://localhost:8000").replace(/\/$/, "");
const DEFAULT_REVALIDATE = Number(process.env.API_REVALIDATE_SECONDS || 300);

type FetchOptions = { tags?: string[]; revalidate?: number; query?: Record<string, string | number | undefined> };

function buildUrl(path: string, query?: FetchOptions["query"]) {
  const url = new URL(`${API_URL}/api/${path.replace(/^\//, "")}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url;
}

/**
 * Fetches from the Django API on the server. Never throws: callers get a typed result
 * so pages can render an honest error or empty state instead of crashing.
 */
export async function apiGet<T>(path: string, options: FetchOptions = {}): Promise<ApiResult<T>> {
  const url = buildUrl(path, options.query);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: options.revalidate ?? DEFAULT_REVALIDATE, tags: options.tags },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return { ok: false, error: "not-found" };
    if (!res.ok) {
      console.error(`API ${res.status} for ${url.pathname}`);
      return { ok: false, error: "unavailable" };
    }
    return { ok: true, data: (await res.json()) as T };
  } catch (error) {
    console.error(`API unreachable for ${url.pathname}:`, (error as Error).message);
    return { ok: false, error: "unavailable" };
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await apiGet<SiteSettings>("site-settings/", { tags: ["site-settings"] });
  return res.ok ? res.data : FALLBACK_SITE_SETTINGS;
}

export type PropertyQuery = {
  q?: string;
  category?: string;
  type?: string;
  country?: string;
  state?: string;
  city?: string;
  currency?: string;
  min_price?: string;
  max_price?: string;
  status?: string;
  bedrooms?: string;
  page?: string;
  ordering?: string;
  featured?: string;
  page_size?: string;
};

// When demo listings are switched on and the API is unreachable, fall back to sample data.
function withDemo<T>(res: ApiResult<T>, demo: () => T | null): ApiResult<T> {
  if (res.ok || res.error !== "unavailable" || !DEMO_LISTINGS_ENABLED) return res;
  const data = demo();
  return data === null ? { ok: false, error: "not-found" } : { ok: true, data };
}

export const getProperties = async (query: PropertyQuery = {}) =>
  withDemo(await apiGet<Paginated<PropertySummary>>("properties/", { tags: ["properties"], query }), () =>
    demoPropertyList(query),
  );

export const getPropertyFacets = async (category?: string) =>
  withDemo(await apiGet<PropertyFacets>("properties/facets/", { tags: ["properties"], query: { category } }), () =>
    demoPropertyFacets(category),
  );

export const getProperty = async (slug: string) =>
  withDemo(
    await apiGet<PropertyDetail>(`properties/${encodeURIComponent(slug)}/`, {
      tags: ["properties", `property:${slug}`],
    }),
    () => demoProperty(slug),
  );

export const getRelatedProperties = async (slug: string) =>
  withDemo(
    await apiGet<PropertySummary[]>(`properties/${encodeURIComponent(slug)}/related/`, { tags: ["properties"] }),
    () => demoRelated(slug),
  );

export const getProjects = (query: { category?: string; status?: string; page?: string; featured?: string; page_size?: string } = {}) =>
  apiGet<Paginated<ProjectSummary>>("projects/", { tags: ["projects"], query });

export const getProjectFacets = () => apiGet<ProjectFacets>("projects/facets/", { tags: ["projects"] });

export const getProject = (slug: string) =>
  apiGet<ProjectDetail>(`projects/${encodeURIComponent(slug)}/`, { tags: ["projects", `project:${slug}`] });

export const getRelatedProjects = (slug: string) =>
  apiGet<ProjectSummary[]>(`projects/${encodeURIComponent(slug)}/related/`, { tags: ["projects"] });

export const getArticles = (query: { category?: string; page?: string; featured?: string; page_size?: string } = {}) =>
  apiGet<Paginated<ArticleSummary>>("articles/", { tags: ["articles"], query });

export const getArticleCategories = () => apiGet<ArticleCategory[]>("articles/categories/", { tags: ["articles"] });

export const getArticle = (slug: string) =>
  apiGet<ArticleDetail>(`articles/${encodeURIComponent(slug)}/`, { tags: ["articles", `article:${slug}`] });

export const getRelatedArticles = (slug: string) =>
  apiGet<ArticleSummary[]>(`articles/${encodeURIComponent(slug)}/related/`, { tags: ["articles"] });

export const getFaqs = () => apiGet<FAQCategory[]>("faqs/", { tags: ["faqs"] });

export const getLegalPage = (kind: string) => apiGet<LegalPage>(`legal/${kind}/`, { tags: ["legal"] });

export async function getServiceContent(): Promise<Record<string, ServiceContent>> {
  const res = await apiGet<ServiceContent[]>("services/", { tags: ["services"] });
  if (!res.ok) return {};
  return Object.fromEntries(res.data.map((s) => [s.service, s]));
}

export const getMarkets = () => apiGet<MarketOption[]>("markets/", { tags: ["markets"] });

export async function getRedirect(kind: "property" | "project" | "article", slug: string) {
  const res = await apiGet<{ new_slug: string }>(`redirects/${kind}/${encodeURIComponent(slug)}/`, {
    tags: ["redirects"],
  });
  return res.ok ? res.data.new_slug : null;
}
