import type { NextConfig } from "next";

// Media (property, project and article images) is served by the Django API or a CDN in front of it.
const mediaUrl = new URL(process.env.MEDIA_PUBLIC_BASE_URL || process.env.API_URL || "http://localhost:8000");
const isLocalMedia = ["localhost", "127.0.0.1"].includes(mediaUrl.hostname);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  // Caching uses fetch revalidation and tags (see src/lib/api.ts) rather than Cache Components,
  // so pages degrade to designed empty states when the API is unreachable at build time.
  cacheComponents: false,
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    remotePatterns: [
      {
        protocol: mediaUrl.protocol.replace(":", "") as "http" | "https",
        hostname: mediaUrl.hostname,
        port: mediaUrl.port,
        pathname: "/media/**",
      },
      // Illustrative stock photos used by the demo listings (src/lib/demoListings.ts).
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    dangerouslyAllowLocalIP: isLocalMedia && process.env.NODE_ENV !== "production",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
