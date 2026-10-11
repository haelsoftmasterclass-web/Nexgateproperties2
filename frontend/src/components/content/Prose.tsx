import Link from "next/link";
import type { ReactNode } from "react";

import { type Inline, parseBlocks } from "@/lib/markdown";

function renderInline(parts: Inline[]): ReactNode[] {
  return parts.map((p, i) => {
    if (p.type === "link") {
      return p.href.startsWith("/") ? (
        <Link key={i} href={p.href}>
          {p.text}
        </Link>
      ) : (
        <a key={i} href={p.href} target="_blank" rel="noopener noreferrer">
          {p.text}
        </a>
      );
    }
    if (p.type === "strong") return <strong key={i}>{p.text}</strong>;
    return <span key={i}>{p.text}</span>;
  });
}

/** Renders CMS long-form text safely (no raw HTML). */
export function Prose({ source, className }: { source: string; className?: string }) {
  const blocks = parseBlocks(source);
  return (
    <div className={`prose-nexgate ${className ?? ""}`}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={b.id}>
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id}>
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          default:
            return <p key={i}>{renderInline(b.inline)}</p>;
        }
      })}
    </div>
  );
}
