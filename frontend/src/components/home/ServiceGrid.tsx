import Link from "next/link";

import type { Service } from "@/lib/services";

import { Icon, type IconName } from "../ui/Icon";

const icons: Record<string, IconName> = {
  "properties-for-sale": "home",
  "property-development": "building",
  "real-estate-investment": "chart",
  "property-facility-management": "key",
  "real-estate-advisory": "compass",
  "international-property": "globe",
};

export function ServiceGrid({ services, linkToServicePage }: { services: Service[]; linkToServicePage?: boolean }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <li key={s.key} className="group relative bg-white p-8 transition-colors duration-500 hover:bg-paper sm:p-10">
          <div data-reveal="" style={{ ["--reveal-delay" as string]: (i % 3) * 90 }}>
          <div className="flex items-start justify-between">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500 transition-colors duration-500 group-hover:bg-brand-500 group-hover:text-white">
              <Icon name={icons[s.key]} size={22} />
            </span>
            <span className="font-display text-2xl italic text-muted/50">{s.number}</span>
          </div>
          <h3 className="mt-8 text-xl font-bold leading-snug text-ink">
            <Link href={linkToServicePage ? `/services/#${s.key}` : s.href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {s.title}
            </Link>
          </h3>
          <p className="mt-3 leading-relaxed text-muted">{s.short}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500">
            {s.cta}
            <Icon name="arrowRight" size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
