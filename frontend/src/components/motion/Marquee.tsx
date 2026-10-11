import type { ReactNode } from "react";

/** Continuous horizontal ticker. Pauses on hover; static under reduced motion. Content is duplicated for a seamless loop. */
export function Marquee({ items, className }: { items: ReactNode[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex shrink-0 items-center gap-12">
          {item}
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee-mask overflow-hidden ${className ?? ""}`}>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
