import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "./site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noindex?: boolean;
  type?: "website" | "article";
};

/** Consistent metadata for every page: title, description, canonical, Open Graph and Twitter. */
export function pageMetadata({ title, description, path, image, noindex, type = "website" }: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
  const images = image ? [{ url: image }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url, siteName: SITE_NAME, type, locale: "en_NG", images },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: image ? [image] : undefined },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}
