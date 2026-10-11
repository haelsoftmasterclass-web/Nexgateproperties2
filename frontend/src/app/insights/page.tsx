import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand } from "@/components/content/CtaBand";
import { PageHero } from "@/components/content/PageHero";
import { Pagination } from "@/components/content/Pagination";
import { EmptyState, ErrorState } from "@/components/content/States";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getArticleCategories, getArticles } from "@/lib/api";
import { firstParam } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { SERVICES } from "@/lib/services";

const PAGE_SIZE = 9;

export async function generateMetadata({ searchParams }: PageProps<"/insights">): Promise<Metadata> {
  const sp = await searchParams;
  return pageMetadata({
    title: "Real Estate Insights",
    description: "Practical real estate guides from Nexgate Properties on buying, owning, managing, developing and investing in property.",
    path: "/insights/",
    noindex: Boolean(firstParam(sp.category) || firstParam(sp.page)),
  });
}

export default async function InsightsPage({ searchParams }: PageProps<"/insights">) {
  const sp = await searchParams;
  const cats = await getArticleCategories();
  const categories = cats.ok ? cats.data : [];
  const category = categories.some((c) => c.slug === firstParam(sp.category)) ? firstParam(sp.category) : undefined;
  const pageRaw = firstParam(sp.page);
  const page = pageRaw && /^\d{1,3}$/.test(pageRaw) ? Number(pageRaw) : 1;
  const list = await getArticles({ category, page: String(page), page_size: String(PAGE_SIZE) });
  const articles = list.ok ? list.data.results : [];
  const [featured, ...rest] = page === 1 && !category ? articles : [undefined, ...articles];

  return (
    <>
      <PageHero
        title="Real estate *insights.*"
        eyebrow="Insights"
        intro="Practical guides and explainers for buyers, property owners, developers and investors."
        crumbs={[{ name: "Insights", href: "/insights/" }]}
      />
      <Section className="!pt-14" labelledBy="articles-title">
        <Container>
          <h2 id="articles-title" className="sr-only">
            Articles
          </h2>
          {categories.length > 1 && (
            <nav aria-label="Article categories" className="mb-12 flex flex-wrap gap-2 border-b border-line pb-8">
              <Link href="/insights/" aria-current={!category ? "page" : undefined} className={cn("rounded-full px-4 py-2 text-sm font-semibold ring-1", !category ? "bg-ink text-white ring-ink" : "ring-line hover:ring-ink/30")}>
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/insights/?category=${c.slug}`}
                  aria-current={category === c.slug ? "page" : undefined}
                  className={cn("rounded-full px-4 py-2 text-sm font-semibold ring-1", category === c.slug ? "bg-ink text-white ring-ink" : "ring-line hover:ring-ink/30")}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          )}
          {!list.ok && <ErrorState title="We couldn’t load articles right now" />}
          {list.ok && articles.length === 0 && (
            <EmptyState title="Our first articles are being written" icon="sparkle" actions={<ButtonLink href="/frequently-asked-questions/" variant="secondary">Read our FAQs</ButtonLink>}>
              Guides on buying, owning, managing and investing in property will be published here soon.
            </EmptyState>
          )}
          {featured && (
            <div className="mb-20">
              <ArticleCard article={featured} featured />
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((a, i) => a && <ArticleCard key={a.slug} article={a} index={i} />)}
            </div>
          )}
          {list.ok && <Pagination basePath="/insights/" page={page} total={list.data.count} pageSize={PAGE_SIZE} query={{ category }} />}
        </Container>
      </Section>
      <Section tone="paper" labelledBy="related-services">
        <Container>
          <SectionHeading id="related-services" eyebrow="Related services" title="Put the guidance *into practice.*" />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <li key={s.key}>
                <Link href={s.href} className="group flex items-center justify-between rounded-xl bg-white px-5 py-4 font-semibold ring-1 ring-line hover:ring-brand-500">
                  {s.navLabel}
                  <span className="text-brand-500 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
