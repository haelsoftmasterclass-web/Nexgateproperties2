import { cn } from "../ui/cn";

/** Numbered process steps (01, 02, 03...) in the Euler pillar style. */
export function Steps({ steps, light }: { steps: { title: string; body: string }[]; light?: boolean }) {
  return (
    <ol className={cn("grid gap-px overflow-hidden rounded-card sm:grid-cols-2", steps.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3", light ? "bg-white/10" : "bg-line")}>
      {steps.map((s, i) => (
        <li key={s.title} className={cn("p-8", light ? "bg-brand-900" : "bg-white")}>
          <div data-reveal="" style={{ ["--reveal-delay" as string]: i * 90 }}>
          <span className={cn("font-display text-5xl italic", light ? "text-gold-300" : "text-brand-500")}>{String(i + 1).padStart(2, "0")}</span>
          <h3 className={cn("mt-6 text-lg font-bold", light ? "text-white" : "text-ink")}>{s.title}</h3>
          <p className={cn("mt-3 text-[0.9375rem] leading-relaxed", light ? "text-white/70" : "text-muted")}>{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-charcoal">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
