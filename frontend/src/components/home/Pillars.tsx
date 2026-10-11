import { SplitHeading } from "../motion/SplitHeading";

/** Numbered value pillars ("X, not Y.") following the Euler reference layout. */
export function Pillars({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <div key={item.title} className="grid gap-6 py-10 sm:py-14 lg:grid-cols-12 lg:items-start">
          <p data-reveal="" className="font-display text-6xl italic leading-none text-brand-500 lg:col-span-2 lg:text-7xl">
            {String(i + 1).padStart(2, "0")}
          </p>
          <SplitHeading as="h3" text={item.title} className="text-3xl font-bold leading-tight text-ink sm:text-4xl lg:col-span-5" />
          <p data-reveal="" style={{ ["--reveal-delay" as string]: 150 }} className="text-lg leading-relaxed text-muted lg:col-span-5">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}
