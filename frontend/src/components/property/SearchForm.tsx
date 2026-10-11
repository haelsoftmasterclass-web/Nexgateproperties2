"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

/**
 * Homepage property search. Sends visitors to the residential or commercial listing page with
 * the search in the query string. Without JavaScript the form still submits (to residential,
 * which redirects to commercial when that category is chosen).
 */
export function SearchForm({ locations }: { locations: string[] }) {
  const router = useRouter();
  const [category, setCategory] = useState("residential");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const q = String(data.get("q") || "").trim();
    const city = String(data.get("city") || "");
    if (q) params.set("q", q.slice(0, 100));
    if (city) params.set("city", city);
    const base = category === "commercial" ? "/commercial-properties/" : "/residential-properties/";
    router.push(`${base}${params.size ? `?${params}` : ""}#listings`);
  }

  return (
    <form
      action="/residential-properties/"
      method="get"
      onSubmit={onSubmit}
      role="search"
      aria-label="Search properties"
      className="grid gap-2 rounded-[1.25rem] bg-white p-2 shadow-lift ring-1 ring-line sm:grid-cols-[1fr_1fr_1.4fr_auto]"
    >
      <label className="flex flex-col rounded-xl px-4 py-2.5 transition-colors focus-within:bg-paper hover:bg-paper">
        <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted">Property</span>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full cursor-pointer bg-transparent text-[0.9375rem] font-semibold text-ink outline-none"
        >
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>
      </label>
      <label className="flex flex-col rounded-xl px-4 py-2.5 transition-colors focus-within:bg-paper hover:bg-paper sm:border-l sm:border-line">
        <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted">Location</span>
        <select name="city" defaultValue="" className="mt-1 w-full cursor-pointer bg-transparent text-[0.9375rem] font-semibold text-ink outline-none">
          <option value="">Any location</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col rounded-xl px-4 py-2.5 transition-colors focus-within:bg-paper hover:bg-paper sm:border-l sm:border-line">
        <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted">Keyword</span>
        <input
          name="q"
          type="search"
          maxLength={100}
          placeholder="e.g. duplex, Lekki, office"
          className="mt-1 w-full bg-transparent text-[0.9375rem] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted/70"
        />
      </label>
      <Button type="submit" size="lg" className="h-auto min-h-13 rounded-xl">
        <Icon name="search" size={18} />
        Search
      </Button>
    </form>
  );
}
