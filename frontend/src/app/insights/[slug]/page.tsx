import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { CtaBand } from "@/components/content/CtaBand";
import { JsonLd } from "@/components/content/JsonLd";
import { MediaImage } from "@/components/content/MediaImage";
import { Prose } from "@/components/content/Prose";
import { ErrorState } from "@/components/content/States";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { getArticle, getRedirect, getRelatedArticles } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { serviceByKey } from "@/lib/services";
import { SITE_NAME, SITE_URL } from "@/lib/site";

async function load(slug: string) {
  const res = await getArticle(slug);
  if (!res.ok && res.error === "not-found") {
    const target = await getRedirect("article", slug);
    if (target) permanentRedirect(`/insights/${target}/`);
    notFound();
  }
  return res;
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const res = await load(slug);
  if (!res.ok) return { title: "Insights", robots: { index: false } };
  const a = res.data;
  return pageMetadata({
    title: a.seo_title || a.title,
    description: a.meta_description || a.excerpt || `${a.title}, from Nexgate Properties Insights.`,
    path: `/insights/${a.slug}/`,
    image: a.featured_image,
    type: "article",
  });
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const res = await load(slug);
  if (!res.ok) {
    return (
      <Container className="py-24">
        <ErrorState title="We couldn’t load this article right now" />
      </Container>
    );
  }
  const a = res.data;
  const related = await getRelatedArticles(slug);
  const service = serviceByKey(a.related_service);
  const date = formatDate(a.published_at);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt || undefined,
    image: a.featured_image ? [a.featured_image] : undefined,
    datePublished: a.published_at ?? undefined,
    dateModified: a.updated_at,
    author: a.author_name ? { "@type": "Person", name: a.author_name } : { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/nexgate-properties-logo.png` } },
    mainEntityOfPage: `${SITE_URL}/insights/${a.slug}/`,
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <article>
        <header className="-mt-18 bg-paper pb-14 pt-28 sm:pt-32">
          <Container narrow>
            <Breadcrumbs items={[{ name: "Insights", href: "/insights/" }, { name: a.title, href: `/insights/${a.slug}/` }]} />
            <p data-reveal="" className="mt-10 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.16em]">
              {a.category && <span className="text-brand-500">{a.category.name}</span>}
              {date && (
                <time className="text-muted" dateTime={a.published_at ?? undefined}>
                  {date}
                </time>
              )}
            </p>
            <SplitHeading as="h1" text={a.title} className="mt-4 text-4xl font-bold leading-[1.08] sm:text-5xl" />
            {a.excerpt && (
              <p data-reveal="" className="mt-6 text-xl leading-relaxed text-muted">
                {a.excerpt}
              </p>
            )}
            {a.author_name && <p className="mt-6 text-sm font-semibold">By {a.author_name}</p>}
          </Container>
        </header>
        {a.featured_image && (
          <Container className="max-w-5xl">
            <MediaImage src={a.featured_image} alt={a.featured_image_alt || ""} sizes="(min-width:1024px) 1024px, 100vw" priority className="mt-10 aspect-[16/9] rounded-card" />
          </Container>
        )}
        <Container narrow className="py-16">
          <Prose source={a.body} />
          {a.references.length > 0 && (
            <section className="mt-14 border-t border-line pt-8" aria-labelledby="refs">
              <h2 id="refs" className="text-lg font-bold">
                References
              </h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
                {a.references.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-brand-500 underline underline-offset-2">
                      {r.title}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {service && (
            <aside className="mt-14 rounded-card bg-paper p-8 ring-1 ring-line">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Related service</p>
              <h2 className="mt-3 text-2xl font-bold">{service.title}</h2>
              <p className="mt-2 text-muted">{service.short}</p>
              <ButtonLink href={service.href} className="mt-6" arrow>
                {service.cta}
              </ButtonLink>
            </aside>
          )}
        </Container>
      </article>
      {related.ok && related.data.length > 0 && (
        <Section tone="paper" labelledBy="related-articles">
          <Container>
            <h2 id="related-articles" className="text-3xl font-bold">
              Related articles
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {related.data.map((r, i) => (
                <ArticleCard key={r.slug} article={r} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}
      <CtaBand />
    </>
  );
}
