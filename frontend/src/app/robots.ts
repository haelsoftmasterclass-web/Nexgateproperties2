import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Block everything outside production so preview deployments are never indexed.
  if (process.env.ALLOW_INDEXING !== "true") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/*?*q=", "/*?*min_price=", "/*?*max_price="] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
