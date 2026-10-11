import type { Metadata } from "next";

import { hasActiveFilters, PropertyListingPage } from "@/components/property/ListingPage";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ searchParams }: PageProps<"/commercial-properties">): Promise<Metadata> {
  return pageMetadata({
    title: "Commercial Properties for Sale",
    description:
      "Browse commercial property presented by Nexgate Properties, including offices, retail units, warehouses and mixed-use buildings. Filter by location, type and price.",
    path: "/commercial-properties/",
    noindex: hasActiveFilters(await searchParams),
  });
}

export default async function CommercialPage({ searchParams }: PageProps<"/commercial-properties">) {
  return (
    <PropertyListingPage
      category="commercial"
      searchParams={await searchParams}
      copy={{
        title: "Commercial *properties.*",
        eyebrow: "Space for business",
        intro: "Offices, retail units, industrial premises and more. Review specifications, location and availability, then speak to our team.",
        path: "/commercial-properties/",
        crumb: "Commercial properties",
        aboutTitle: "Commercial space, *matched to your needs.*",
        about: [
          "Commercial property decisions depend on location, size, access and use. Our listings set out the specifications that have been confirmed so you can compare options quickly.",
          "If you have a specific requirement, send us the details and our team will help you identify suitable space.",
        ],
        categories: ["Office spaces", "Retail units", "Commercial buildings", "Warehouses", "Industrial premises", "Mixed-use properties"],
        emptyTitle: "Commercial listings are being prepared",
        emptyBody: "There are no published commercial listings right now. Send us your space requirements and we’ll contact you as suitable options become available.",
      }}
    />
  );
}
