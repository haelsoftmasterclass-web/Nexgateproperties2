import Link from "next/link";

import { breadcrumbJsonLd } from "@/lib/seo";

import { cn } from "../ui/cn";
import { Icon } from "../ui/Icon";
import { JsonLd } from "./JsonLd";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ items, light, className }: { items: Crumb[]; light?: boolean; className?: string }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="inline-flex items-center gap-1.5">
                {i > 0 && <Icon name="chevronRight" size={14} className={light ? "text-white/40" : "text-muted/60"} />}
                {last ? (
                  <span aria-current="page" className={cn("font-medium", light ? "text-white" : "text-ink")}>
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.href} className={cn("transition-colors", light ? "text-white/65 hover:text-white" : "text-muted hover:text-brand-500")}>
                    {c.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
