import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { ArticleSummary } from "@/lib/types";

import { MediaImage } from "../content/MediaImage";

export function ArticleCard({ article, index = 0, featured }: { article: ArticleSummary; index?: number; featured?: boolean }) {
  const date = formatDate(article.published_at);
  return (
    <article
      data-reveal=""
      style={{ ["--reveal-delay" as string]: (index % 3) * 90 }}
      className={featured ? "group relative grid gap-8 lg:grid-cols-2 lg:items-center" : "group relative flex flex-col"}
    >
      <MediaImage
        src={article.featured_image}
        alt={article.featured_image_alt || article.title}
        sizes={featured ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 33vw, 100vw"}
        className={featured ? "aspect-[16/10] rounded-card" : "aspect-[16/10] rounded-card"}
        label="Nexgate Insights"
      />
      <div className={featured ? "" : "mt-6"}>
        <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
          {article.category && <span className="text-brand-500">{article.category.name}</span>}
          {article.category && date && <span className="text-muted/50">·</span>}
          {date && (
            <time dateTime={article.published_at ?? undefined} className="text-muted">
              {date}
            </time>
          )}
        </p>
        <h3 className={featured ? "mt-4 text-3xl font-bold leading-tight sm:text-4xl" : "mt-3 text-xl font-bold leading-snug"}>
          <Link
            href={`/insights/${article.slug}/`}
            className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 after:absolute after:inset-0 group-hover:bg-[length:100%_1px] focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>
        {article.excerpt && <p className="mt-3 leading-relaxed text-muted">{article.excerpt}</p>}
      </div>
    </article>
  );
}
