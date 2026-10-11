import type { ReactNode } from "react";

import { SplitHeading } from "../motion/SplitHeading";
import { cn } from "./cn";

export function Container({ children, className, narrow }: { children: ReactNode; className?: string; narrow?: boolean }) {
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-10", narrow ? "max-w-4xl" : "max-w-7xl", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  tone = "white",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "paper" | "dark" | "brand";
  id?: string;
  labelledBy?: string;
}) {
  const tones = {
    white: "bg-white",
    paper: "bg-paper",
    dark: "bg-ink text-white",
    brand: "bg-brand-700 text-white",
  };
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-20 sm:py-28", tones[tone], className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, light, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em]",
        light ? "text-gold-300" : "text-brand-500",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-px w-6", light ? "bg-gold-300" : "bg-gold-500")} />
      {children}
    </p>
  );
}

/**
 * Section heading pattern from the Euler reference: eyebrow, large heading with a word-by-word
 * reveal, optional serif accent words wrapped in *asterisks*, and an intro paragraph.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  align = "left",
  light,
  as = "h2",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  id?: string;
  align?: "left" | "center";
  light?: boolean;
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <div data-reveal="" className={cn("mb-5", align === "center" && "flex justify-center")}>
          <Eyebrow light={light}>{eyebrow}</Eyebrow>
        </div>
      )}
      <SplitHeading
        as={as}
        id={id}
        text={title}
        className={cn(
          "font-bold leading-[1.05]",
          as === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-[3.25rem]",
          light ? "text-white" : "text-ink",
        )}
      />
      {intro && (
        <div data-reveal="" style={{ ["--reveal-delay" as string]: 150 }} className={cn("mt-6 text-lg leading-relaxed", light ? "text-white/75" : "text-muted")}>
          {intro}
        </div>
      )}
      {children}
    </div>
  );
}
