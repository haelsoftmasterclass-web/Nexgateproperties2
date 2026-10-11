export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type PropertyCategory = "residential" | "commercial";

export type PropertySummary = {
  slug: string;
  title: string;
  summary: string;
  category: PropertyCategory;
  category_label: string;
  property_type: string;
  property_type_label: string;
  country: string;
  state_region: string;
  city: string;
  price: string | null;
  currency: string;
  price_visibility: "show" | "on-request";
  price_qualifier: string;
  listing_status: string;
  listing_status_label: string;
  bedrooms: number | null;
  bathrooms: number | null;
  floor_area_sqm: string | null;
  land_area_sqm: string | null;
  featured_image: string | null;
  featured_image_alt: string;
  is_featured: boolean;
};

export type GalleryImage = { image: string; alt_text: string; caption: string; is_rendering?: boolean };

export type PropertyDetail = PropertySummary & {
  description: string;
  address: string;
  units: number | null;
  features: string[];
  amenities: string[];
  location_notes: string;
  documentation_notes: string;
  images: GalleryImage[];
  project: { slug: string; name: string } | null;
  seo_title: string;
  meta_description: string;
  published_at: string | null;
  updated_at: string;
};

export type FacetOption = { value: string; count: number; label?: string };

export type PropertyFacets = {
  total: number;
  property_types: FacetOption[];
  countries: FacetOption[];
  states: FacetOption[];
  cities: FacetOption[];
  currencies: string[];
  listing_statuses: FacetOption[];
  has_bedrooms: boolean;
  has_visible_prices: boolean;
};

export type ProjectSummary = {
  slug: string;
  name: string;
  summary: string;
  category: string;
  category_label: string;
  status: string;
  status_label: string;
  country: string;
  state_region: string;
  city: string;
  location_description: string;
  hero_image: string | null;
  hero_image_alt: string;
  hero_image_is_rendering: boolean;
  is_featured: boolean;
};

export type ProjectDetail = ProjectSummary & {
  description: string;
  key_features: string[];
  nexgate_role: string;
  start_date: string | null;
  expected_completion: string | null;
  accepts_purchase_enquiries: boolean;
  accepts_investment_enquiries: boolean;
  images: GalleryImage[];
  faqs: { question: string; answer: string }[];
  seo_title: string;
  meta_description: string;
  published_at: string | null;
  updated_at: string;
};

export type ProjectFacets = {
  total: number;
  categories: FacetOption[];
  statuses: FacetOption[];
};

export type ArticleCategory = { name: string; slug: string };

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory | null;
  author_name: string;
  published_at: string | null;
  featured_image: string | null;
  featured_image_alt: string;
  is_featured: boolean;
};

export type ArticleDetail = ArticleSummary & {
  body: string;
  references: { title: string; url: string }[];
  related_service: string;
  seo_title: string;
  meta_description: string;
  updated_at: string;
};

export type Office = {
  label: string;
  address: string;
  country: string;
  address_verified: boolean;
  map_embed_query: string;
};

export type Phone = { label: string; number_e164: string; display: string };

export type SiteSettings = {
  company_name: string;
  tagline: string;
  short_description: string;
  primary_email: string;
  whatsapp_number: string;
  vision: string;
  mission: string;
  about_copy_approved: boolean;
  contact_details_confirmed: boolean;
  offices: Office[];
  phone_numbers: Phone[];
  social_links: { platform: string; url: string }[];
  affiliates: { name: string; description: string; url: string }[];
};

export type FAQCategory = { name: string; slug: string; faqs: { id: number; question: string; answer: string }[] };

export type LegalPage = {
  kind: string;
  title: string;
  body: string;
  legal_review_complete: boolean;
  effective_date: string | null;
  seo_title: string;
  meta_description: string;
  updated_at: string;
};

export type ServiceContent = {
  service: string;
  headline: string;
  summary: string;
  body: string;
  image: string | null;
  image_alt: string;
  seo_title: string;
  meta_description: string;
};

export type MarketOption = { name: string; note: string };

/** Result wrapper so pages can tell "no data" apart from "the API failed". */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: "not-found" | "unavailable" };
