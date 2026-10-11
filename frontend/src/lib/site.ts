import type { SiteSettings } from "./types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Nexgate Properties";

/**
 * Used only when the API cannot be reached. The source of truth is Site settings in the admin.
 * These are the Nexgate Group details supplied in the brief, pending confirmation for the subsidiary.
 */
export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  company_name: SITE_NAME,
  tagline: "A Nexgate Group company",
  short_description:
    "Nexgate Properties is the real estate business of Nexgate Group, helping clients buy, develop, invest in and manage residential and commercial property in Nigeria and internationally.",
  primary_email: "nexgategroup@gmail.com",
  whatsapp_number: "",
  vision: "",
  mission: "",
  about_copy_approved: false,
  contact_details_confirmed: false,
  offices: [
    {
      label: "Nigeria office",
      address: "H528 Ikota Complex, VGC, Lekki, Lagos, Nigeria",
      country: "Nigeria",
      address_verified: false,
      map_embed_query: "",
    },
    {
      label: "United States office",
      address: "39-19 Corporal Stone Street, Bayside, New York, NY 11361, USA",
      country: "United States",
      address_verified: false,
      map_embed_query: "",
    },
  ],
  phone_numbers: [
    { label: "Nigeria", number_e164: "+2347017461957", display: "+234 701 746 1957" },
    { label: "Nigeria", number_e164: "+2349120999494", display: "+234 912 099 9494" },
    { label: "Nigeria", number_e164: "+2348140122233", display: "+234 814 012 2233" },
    { label: "United States", number_e164: "+19295076825", display: "+1 929-507-6825" },
  ],
  social_links: [],
  affiliates: [
    { name: "Nexgate Group", description: "Parent company", url: "" },
    { name: "Nexgate Construction", description: "Construction", url: "" },
    { name: "Valdo Interiors", description: "Interior design, furniture and interior solutions", url: "" },
  ],
};

export type NavItem = { label: string; href: string; description?: string };

export const PROPERTY_NAV: NavItem[] = [
  { label: "Residential Properties", href: "/residential-properties/", description: "Homes and residential developments" },
  { label: "Commercial Properties", href: "/commercial-properties/", description: "Offices, retail and industrial space" },
];
