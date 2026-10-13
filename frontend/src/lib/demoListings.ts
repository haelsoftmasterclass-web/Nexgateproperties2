import type {
  Paginated,
  PropertyDetail,
  PropertyFacets,
  PropertySummary,
} from "./types";

/**
 * Sample listings for previewing the site before the CMS is hosted.
 * Used only when NEXT_PUBLIC_DEMO_LISTINGS is "true" AND the API is unreachable,
 * so real listings always win once the backend is live. Every title and summary
 * says DEMO so nobody mistakes these for available properties.
 */
export const DEMO_LISTINGS_ENABLED =
  process.env.NEXT_PUBLIC_DEMO_LISTINGS === "true";

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;
const render = (name: string) => `/images/renders/${name}.jpg`;

type DemoPhoto = { src: string; rendering: boolean };
const stock = (id: string): DemoPhoto => ({
  src: unsplash(id),
  rendering: false,
});
const impression = (name: string): DemoPhoto => ({
  src: render(name),
  rendering: true,
});

const CAPTION = {
  render:
    "Artist's impression supplied by Nexgate. Shown to illustrate the demo listing.",
  stock: "Illustrative stock photo (Unsplash). Not the actual property.",
};

// Homes use design renders supplied by Nexgate; commercial units use free-licence Unsplash photos.
const PHOTOS: Record<string, DemoPhoto[]> = {
  "demo-3-bedroom-terrace-duplex-lekki": [
    impression("terrace-street"),
    impression("terrace-aerial"),
  ],
  "demo-2-bedroom-apartment-ajah": [impression("white-modern-house")],
  "demo-office-space-ikeja": [
    "1497366216548-37526070297c",
    "1497366811353-6870744d04b2",
    "1524758631624-e2822e304c36",
  ].map(stock),
  "demo-3-bedroom-semi-detached-gwarinpa": [impression("modern-house-cars")],
  "demo-4-bedroom-detached-bungalow-lugbe": [
    impression("villa-pool"),
    impression("villa-low-angle"),
  ],
  "demo-retail-shop-wuse": [
    "1441986300917-64674bd600d8",
    "1567401893414-76b7b1e5a7a5",
  ].map(stock),
};

const DEMO_NOTE =
  "Demo listing for previewing the website. It is not a real property and is not for sale.";

type DemoInput = Pick<
  PropertyDetail,
  | "slug"
  | "title"
  | "category"
  | "property_type"
  | "property_type_label"
  | "state_region"
  | "city"
  | "bedrooms"
  | "bathrooms"
  | "floor_area_sqm"
  | "features"
  | "is_featured"
> & { area: string };

const inputs: DemoInput[] = [
  {
    slug: "demo-3-bedroom-terrace-duplex-lekki",
    title: "DEMO 3-Bedroom Terrace Duplex, Lekki",
    category: "residential",
    property_type: "terrace",
    property_type_label: "Terrace",
    state_region: "Lagos",
    city: "Lekki",
    area: "Lekki, Lagos",
    bedrooms: 3,
    bathrooms: 4,
    floor_area_sqm: "180",
    features: [
      "Fitted kitchen",
      "Ensuite bedrooms",
      "Visitor's toilet",
      "Parking for 2 cars",
    ],
    is_featured: true,
  },
  {
    slug: "demo-2-bedroom-apartment-ajah",
    title: "DEMO 2-Bedroom Apartment, Ajah",
    category: "residential",
    property_type: "apartment",
    property_type_label: "Apartment",
    state_region: "Lagos",
    city: "Ajah",
    area: "Ajah, Lagos",
    bedrooms: 2,
    bathrooms: 2,
    floor_area_sqm: "110",
    features: ["Balcony", "Shared security", "Backup power", "Parking space"],
    is_featured: true,
  },
  {
    slug: "demo-office-space-ikeja",
    title: "DEMO Office Space, Ikeja",
    category: "commercial",
    property_type: "office",
    property_type_label: "Office space",
    state_region: "Lagos",
    city: "Ikeja",
    area: "Ikeja, Lagos",
    bedrooms: null,
    bathrooms: 2,
    floor_area_sqm: "150",
    features: [
      "Open-plan floor",
      "Meeting room",
      "Kitchenette",
      "On-site parking",
    ],
    is_featured: true,
  },
  {
    slug: "demo-3-bedroom-semi-detached-gwarinpa",
    title: "DEMO 3-Bedroom Semi-Detached House, Gwarinpa",
    category: "residential",
    property_type: "semi-detached-house",
    property_type_label: "Semi-detached house",
    state_region: "Abuja (FCT)",
    city: "Gwarinpa",
    area: "Gwarinpa, Abuja",
    bedrooms: 3,
    bathrooms: 3,
    floor_area_sqm: "200",
    features: [
      "Boys' quarters",
      "Fitted kitchen",
      "Gated estate",
      "Garden space",
    ],
    is_featured: true,
  },
  {
    slug: "demo-4-bedroom-detached-bungalow-lugbe",
    title: "DEMO 4-Bedroom Detached Bungalow, Lugbe",
    category: "residential",
    property_type: "detached-house",
    property_type_label: "Detached house",
    state_region: "Abuja (FCT)",
    city: "Lugbe",
    area: "Lugbe, Abuja",
    bedrooms: 4,
    bathrooms: 4,
    floor_area_sqm: "240",
    features: [
      "Large compound",
      "Ensuite bedrooms",
      "Water treatment",
      "Parking for 3 cars",
    ],
    is_featured: true,
  },
  {
    slug: "demo-retail-shop-wuse",
    title: "DEMO Retail Shop, Wuse",
    category: "commercial",
    property_type: "retail",
    property_type_label: "Retail unit",
    state_region: "Abuja (FCT)",
    city: "Wuse",
    area: "Wuse, Abuja",
    bedrooms: null,
    bathrooms: 1,
    floor_area_sqm: "85",
    features: [
      "Street frontage",
      "Glass shopfront",
      "Storage room",
      "Customer parking",
    ],
    is_featured: true,
  },
];

export const DEMO_PROPERTIES: PropertyDetail[] = inputs.map(
  ({ area, ...p }) => ({
    ...p,
    summary: `Demo listing in ${area}. Shown to preview the site, not a real property.`,
    category_label: p.category === "residential" ? "Residential" : "Commercial",
    country: "Nigeria",
    price: "50000000.00",
    currency: "NGN",
    price_visibility: "show",
    price_qualifier: "",
    listing_status: "available",
    listing_status_label: "Demo",
    land_area_sqm: null,
    featured_image: PHOTOS[p.slug][0].src,
    featured_image_alt: `${PHOTOS[p.slug][0].rendering ? "Artist's impression" : "Illustrative photo"} for ${p.title}`,
    description: `${DEMO_NOTE}\n\nThis sample shows how a ${p.property_type_label.toLowerCase()} listing in ${area} will look once Nexgate Properties publishes real listings from the admin.`,
    address: "",
    units: null,
    amenities: [],
    location_notes: "",
    documentation_notes: "",
    images: PHOTOS[p.slug].map((photo, i) => ({
      image: photo.src,
      alt_text: `${photo.rendering ? "Artist's impression" : "Illustrative photo"} ${i + 1} for ${p.title}`,
      caption: photo.rendering ? CAPTION.render : CAPTION.stock,
      is_rendering: photo.rendering,
    })),
    project: null,
    seo_title: "",
    meta_description: DEMO_NOTE,
    published_at: null,
    updated_at: "2026-10-11T00:00:00Z",
  }),
);

const toSummary = (p: PropertyDetail): PropertySummary => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  category: p.category,
  category_label: p.category_label,
  property_type: p.property_type,
  property_type_label: p.property_type_label,
  country: p.country,
  state_region: p.state_region,
  city: p.city,
  price: p.price,
  currency: p.currency,
  price_visibility: p.price_visibility,
  price_qualifier: p.price_qualifier,
  listing_status: p.listing_status,
  listing_status_label: p.listing_status_label,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
  floor_area_sqm: p.floor_area_sqm,
  land_area_sqm: p.land_area_sqm,
  featured_image: p.featured_image,
  featured_image_alt: p.featured_image_alt,
  is_featured: p.is_featured,
});

type Query = Record<string, string | undefined>;

function matches(p: PropertyDetail, q: Query) {
  const text = q.q?.toLowerCase().trim();
  if (
    text &&
    !`${p.title} ${p.city} ${p.state_region} ${p.property_type_label}`
      .toLowerCase()
      .includes(text)
  )
    return false;
  if (q.category && p.category !== q.category) return false;
  if (q.type && p.property_type !== q.type) return false;
  if (q.country && p.country !== q.country) return false;
  if (q.state && p.state_region !== q.state) return false;
  if (q.city && p.city !== q.city) return false;
  if (q.currency && p.currency !== q.currency) return false;
  if (q.status && p.listing_status !== q.status) return false;
  if (q.featured === "true" && !p.is_featured) return false;
  if (q.bedrooms && (p.bedrooms ?? 0) < Number(q.bedrooms)) return false;
  const price = Number(p.price);
  if (q.min_price && price < Number(q.min_price)) return false;
  if (q.max_price && price > Number(q.max_price)) return false;
  return true;
}

export function demoPropertyList(q: Query): Paginated<PropertySummary> {
  const results = DEMO_PROPERTIES.filter((p) => matches(p, q));
  const size = Math.min(Number(q.page_size) || 12, 48);
  const page = Math.max(Number(q.page) || 1, 1);
  return {
    count: results.length,
    next: null,
    previous: null,
    results: results.slice((page - 1) * size, page * size).map(toSummary),
  };
}

function count<T extends string>(values: T[]) {
  const map = new Map<T, number>();
  values.forEach((v) => map.set(v, (map.get(v) ?? 0) + 1));
  return [...map.entries()].map(([value, n]) => ({ value, count: n }));
}

export function demoPropertyFacets(category?: string): PropertyFacets {
  const items = DEMO_PROPERTIES.filter(
    (p) => !category || p.category === category,
  );
  return {
    total: items.length,
    property_types: count(items.map((p) => p.property_type)).map((f) => ({
      ...f,
      label: items.find((p) => p.property_type === f.value)
        ?.property_type_label,
    })),
    countries: count(items.map((p) => p.country)),
    states: count(items.map((p) => p.state_region)),
    cities: count(items.map((p) => p.city)),
    currencies: ["NGN"],
    listing_statuses: [
      { value: "available", count: items.length, label: "Demo" },
    ],
    has_bedrooms: items.some((p) => p.bedrooms !== null),
    has_visible_prices: true,
  };
}

export const demoProperty = (slug: string) =>
  DEMO_PROPERTIES.find((p) => p.slug === slug) ?? null;

export const demoRelated = (slug: string) => {
  const current = demoProperty(slug);
  return DEMO_PROPERTIES.filter(
    (p) => p.slug !== slug && p.category === current?.category,
  )
    .slice(0, 3)
    .map(toSummary);
};
