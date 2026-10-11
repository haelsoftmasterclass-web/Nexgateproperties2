import type { ReactNode } from "react";

import { SplitHeading } from "../motion/SplitHeading";
import { Container, Eyebrow } from "../ui/Section";
import { ArchitecturalLines } from "./ArchitecturalLines";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** Hero for inner pages: breadcrumbs, eyebrow, animated H1, intro and actions. */
export function PageHero({
  title,
  eyebrow,
  intro,
  crumbs,
  actions,
  aside,
}: {
  title: string;
  eyebrow?: string;
  intro?: ReactNode;
  crumbs: Crumb[];
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative -mt-18 overflow-hidden bg-paper pb-16 pt-28 sm:pb-24 sm:pt-32">
      <ArchitecturalLines className="pointer-events-none absolute right-0 top-10 hidden h-[115%] w-auto text-brand-500/20 lg:block xl:right-[4%]" />
      <Container className="relative">
        <Breadcrumbs items={crumbs} />
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            {eyebrow && (
              <div data-reveal="" className="mb-5">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <SplitHeading as="h1" text={title} className="text-4xl font-bold leading-[1.04] text-ink sm:text-5xl lg:text-[4rem]" />
            {intro && (
              <div data-reveal="" style={{ ["--reveal-delay" as string]: 200 }} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
                {intro}
              </div>
            )}
            {actions && (
              <div data-reveal="" style={{ ["--reveal-delay" as string]: 300 }} className="mt-9 flex flex-wrap gap-3">
                {actions}
              </div>
            )}
          </div>
          {aside && <div className="lg:col-span-4">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
