import type { Metadata } from "next";

import { hasActiveFilters, PropertyListingPage } from "@/components/property/ListingPage";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ searchParams }: PageProps<"/residential-properties">): Promise<Metadata> {
  return pageMetadata({
    title: "Residential Properties for Sale",
    description:
      "Browse residential properties presented by Nexgate Properties, including apartments, houses and duplexes. Filter by location, type and price, and request a viewing.",
    path: "/residential-properties/",
    noindex: hasActiveFilters(await searchParams),
  });
}

export default async function ResidentialPage({ searchParams }: PageProps<"/residential-properties">) {
  return (
    <PropertyListingPage
      category="residential"
      searchParams={await searchParams}
      copy={{
        title: "Residential *properties.*",
        eyebrow: "Homes for sale",
        intro: "Find a home that fits your plans. Browse current residential listings, compare the details, and request a viewing with our team.",
        path: "/residential-properties/",
        crumb: "Residential properties",
        aboutTitle: "Finding a home, *made clearer.*",
        about: [
          "We present residential properties with the information buyers need: location, price or price on request, availability and confirmed specifications.",
          "Tell us what you are looking for and we will help you shortlist suitable homes, arrange viewings and understand the next steps.",
        ],
        categories: ["Apartments", "Detached houses", "Semi-detached houses", "Terraces", "Duplexes", "Residential developments"],
        emptyTitle: "Residential listings are being prepared",
        emptyBody: "There are no published residential listings right now. Share your requirements and we’ll contact you when suitable homes become available.",
      }}
    />
  );
}
