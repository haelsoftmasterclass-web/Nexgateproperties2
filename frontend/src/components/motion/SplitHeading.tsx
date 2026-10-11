import { Fragment, type CSSProperties } from "react";

import { cn } from "../ui/cn";

/**
 * Renders a heading whose words slide up from a mask when scrolled into view.
 * Wrap words in *asterisks* to set them in the serif display face, e.g. "Build Your *Future.*"
 * The full text stays in the DOM, so screen readers and search engines read it normally.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  id,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
  delay?: number;
}) {
  const tokens = text.split(/(\*[^*]+\*)/).filter(Boolean);
  let index = 0;
  return (
    <Tag id={id} className={cn("split-heading", className)} data-reveal-split="" style={{ "--split-delay": delay } as CSSProperties}>
      {tokens.map((token, t) => {
        const accent = token.startsWith("*") && token.endsWith("*");
        const words = (accent ? token.slice(1, -1) : token).split(/\s+/).filter(Boolean);
        const leadingSpace = /^\s/.test(token) && t > 0;
        return (
          <Fragment key={t}>
            {leadingSpace && " "}
            {words.map((word, w) => {
              const i = index++;
              return (
                <Fragment key={w}>
                  <span className="split-word">
                    <span
                      style={{ "--word-index": i } as CSSProperties}
                      className={accent ? "font-display font-normal italic tracking-normal text-brand-500" : undefined}
                    >
                      {word}
                    </span>
                  </span>
                  {(w < words.length - 1 || /\s$/.test(token)) && " "}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </Tag>
  );
}
