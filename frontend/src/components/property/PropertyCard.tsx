import Link from "next/link";

import { formatArea, formatPrice, locationLine } from "@/lib/format";
import type { PropertySummary } from "@/lib/types";

import { MediaImage } from "../content/MediaImage";
import { Icon } from "../ui/Icon";
import { cn } from "../ui/cn";

const statusTone: Record<string, string> = {
  available: "bg-success/10 text-success",
  "under-offer": "bg-gold-300/40 text-gold-700",
  reserved: "bg-gold-300/40 text-gold-700",
  sold: "bg-ink text-white",
  "off-market": "bg-sand text-muted",
};

export function PropertyCard({ property, index = 0 }: { property: PropertySummary; index?: number }) {
  const area = formatArea(property.floor_area_sqm) ?? formatArea(property.land_area_sqm);
  const location = locationLine([property.city, property.state_region, property.country !== "Nigeria" ? property.country : null]);
  return (
    <article
      data-reveal=""
      style={{ ["--reveal-delay" as string]: (index % 3) * 90 }}
      className="group relative flex flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-line transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
    >
      <MediaImage
        src={property.featured_image}
        alt={property.featured_image_alt || property.title}
        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        className="aspect-[4/3]"
        label="Photos to follow"
        badge={property.property_type_label}
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500">{property.category_label}</p>
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusTone[property.listing_status] ?? "bg-sand text-muted")}>
            {property.listing_status_label}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-bold leading-snug text-ink">
          <Link href={`/properties/${property.slug}/`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {property.title}
          </Link>
        </h3>
        {location && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="pin" size={15} />
            {location}
          </p>
        )}
        {(property.bedrooms || property.bathrooms || area) && (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-charcoal">
            {property.bedrooms != null && (
              <li className="inline-flex items-center gap-1.5">
                <Icon name="bed" size={16} className="text-muted" />
                {property.bedrooms} bed
              </li>
            )}
            {property.bathrooms != null && (
              <li className="inline-flex items-center gap-1.5">
                <Icon name="bath" size={16} className="text-muted" />
                {property.bathrooms} bath
              </li>
            )}
            {area && (
              <li className="inline-flex items-center gap-1.5">
                <Icon name="area" size={16} className="text-muted" />
                {area}
              </li>
            )}
          </ul>
        )}
        <div className="min-h-6 flex-1" />
        <div className="flex items-end justify-between border-t border-line pt-5">
          <p>
            <span className="block text-lg font-bold text-ink">{formatPrice(property.price, property.currency, property.price_visibility)}</span>
            {property.price_qualifier && property.price && <span className="text-xs text-muted">{property.price_qualifier}</span>}
          </p>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink transition-all duration-500 group-hover:bg-brand-500 group-hover:text-white">
            <Icon name="arrowUpRight" size={18} />
          </span>
        </div>
      </div>
    </article>
  );
}

export function PropertyGrid({ properties }: { properties: PropertySummary[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p, i) => (
        <PropertyCard key={p.slug} property={p} index={i} />
      ))}
    </div>
  );
}
