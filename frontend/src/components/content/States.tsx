import type { ReactNode } from "react";

import { ButtonLink } from "../ui/Button";
import { cn } from "../ui/cn";
import { Icon, type IconName } from "../ui/Icon";

export function EmptyState({
  title,
  children,
  icon = "building",
  actions,
  className,
}: {
  title: string;
  children?: ReactNode;
  icon?: IconName;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-card border border-dashed border-line bg-paper px-6 py-14 text-center sm:px-12", className)} data-reveal="">
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-500 ring-1 ring-line">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="mt-6 text-xl font-bold text-ink">{title}</h3>
      {children && <div className="mx-auto mt-3 max-w-xl text-muted">{children}</div>}
      {actions && <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}

export function ErrorState({ title = "We couldn’t load this content", children }: { title?: string; children?: ReactNode }) {
  return (
    <div role="alert" className="rounded-card border border-brand-200 bg-brand-50 px-6 py-10 text-center">
      <Icon name="alert" size={26} className="mx-auto text-brand-500" />
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <div className="mx-auto mt-2 max-w-xl text-sm text-charcoal">
        {children ?? "Please refresh the page in a moment. If the problem continues, contact our team directly."}
      </div>
      <div className="mt-6 flex justify-center">
        <ButtonLink href="/contact-us/" variant="secondary" size="sm">
          Contact us
        </ButtonLink>
      </div>
    </div>
  );
}

export function Notice({ children, tone = "info", className }: { children: ReactNode; tone?: "info" | "warning"; className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl px-4 py-3.5 text-sm leading-relaxed",
        tone === "warning" ? "bg-gold-300/25 text-ink ring-1 ring-gold-500/40" : "bg-paper text-charcoal ring-1 ring-line",
        className,
      )}
    >
      <Icon name={tone === "warning" ? "alert" : "info"} size={18} className={cn("mt-0.5 shrink-0", tone === "warning" ? "text-gold-700" : "text-brand-500")} />
      <div>{children}</div>
    </div>
  );
}

export function LoadingGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-card ring-1 ring-line">
          <div className="aspect-[4/3] animate-pulse bg-sand" />
          <div className="space-y-3 p-6">
            <div className="h-3 w-1/3 animate-pulse rounded bg-sand" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-sand" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-sand" />
          </div>
        </div>
      ))}
    </div>
  );
}
