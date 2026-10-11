import Link from "next/link";
import type { ReactNode } from "react";

import type { PropertyFacets } from "@/lib/types";

import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

const fieldCls =
  "mt-1.5 h-11 w-full rounded-field border border-line bg-white px-3 text-[0.9375rem] text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

/**
 * Server-rendered GET filter form. Only shows filters that can return results (from /facets/),
 * keeps state in the URL, and works without JavaScript. Collapses into a drawer on small screens.
 */
export function FilterPanel({
  basePath,
  facets,
  values,
  showBedrooms,
}: {
  basePath: string;
  facets: PropertyFacets;
  values: Record<string, string | undefined>;
  showBedrooms: boolean;
}) {
  const activeCount = Object.entries(values).filter(([k, v]) => v && !["page", "ordering"].includes(k)).length;

  const form = (
    <form action={basePath} method="get" className="space-y-5">
      <Field label="Keyword">
        <input name="q" type="search" maxLength={100} defaultValue={values.q} placeholder="Title or area" className={fieldCls} />
      </Field>
      {facets.property_types.length > 1 && (
        <Field label="Property type">
          <select name="type" defaultValue={values.type ?? ""} className={fieldCls}>
            <option value="">All types</option>
            {facets.property_types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label} ({t.count})
              </option>
            ))}
          </select>
        </Field>
      )}
      {facets.countries.length > 1 && (
        <Field label="Country">
          <select name="country" defaultValue={values.country ?? ""} className={fieldCls}>
            <option value="">All countries</option>
            {facets.countries.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value}
              </option>
            ))}
          </select>
        </Field>
      )}
      {facets.states.length > 1 && (
        <Field label="State or region">
          <select name="state" defaultValue={values.state ?? ""} className={fieldCls}>
            <option value="">All states</option>
            {facets.states.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value}
              </option>
            ))}
          </select>
        </Field>
      )}
      {facets.cities.length > 1 && (
        <Field label="City">
          <select name="city" defaultValue={values.city ?? ""} className={fieldCls}>
            <option value="">All cities</option>
            {facets.cities.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value}
              </option>
            ))}
          </select>
        </Field>
      )}
      {facets.has_visible_prices && (
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Price</legend>
          {facets.currencies.length > 1 && (
            <select name="currency" defaultValue={values.currency ?? ""} aria-label="Currency" className={fieldCls}>
              <option value="">Any currency</option>
              {facets.currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <input name="min_price" type="number" min={0} step="any" inputMode="numeric" defaultValue={values.min_price} placeholder="Min" aria-label="Minimum price" className={fieldCls} />
            <input name="max_price" type="number" min={0} step="any" inputMode="numeric" defaultValue={values.max_price} placeholder="Max" aria-label="Maximum price" className={fieldCls} />
          </div>
          <p className="mt-1.5 text-xs text-muted">Listings with price on request are excluded when filtering by price.</p>
        </fieldset>
      )}
      {showBedrooms && facets.has_bedrooms && (
        <Field label="Bedrooms">
          <select name="bedrooms" defaultValue={values.bedrooms ?? ""} className={fieldCls}>
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </Field>
      )}
      {facets.listing_statuses.length > 1 && (
        <Field label="Availability">
          <select name="status" defaultValue={values.status ?? ""} className={fieldCls}>
            <option value="">All</option>
            {facets.listing_statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Sort by">
        <select name="ordering" defaultValue={values.ordering ?? ""} className={fieldCls}>
          <option value="">Featured first</option>
          <option value="-published_at">Newest</option>
          {facets.has_visible_prices && <option value="price">Price: low to high</option>}
          {facets.has_visible_prices && <option value="-price">Price: high to low</option>}
        </select>
      </Field>
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">
          Apply filters
        </Button>
        {activeCount > 0 && (
          <Link href={basePath} className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-muted hover:text-brand-500">
            Reset
          </Link>
        )}
      </div>
    </form>
  );

  return (
    <>
      <details className="group rounded-card bg-white ring-1 ring-line lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <Icon name="filter" size={18} />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </span>
          <Icon name="chevronDown" size={18} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-line px-5 py-5">{form}</div>
      </details>
      <div className="sticky top-24 hidden rounded-card bg-white p-6 ring-1 ring-line lg:block">
        <h2 className="mb-5 text-lg font-bold">Refine your search</h2>
        {form}
      </div>
    </>
  );
}
