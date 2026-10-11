import type { ReactNode } from "react";

import { SplitHeading } from "../motion/SplitHeading";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Section";
import { ArchitecturalLines } from "./ArchitecturalLines";

/** Closing call-to-action band, used at the end of most pages. */
export function CtaBand({
  title = "Ready to talk about your *next property move?*",
  intro = "Tell us what you are looking for. Our team will come back to you with relevant options and clear next steps.",
  primary = { label: "Book a consultation", href: "/book-a-consultation/" },
  secondary = { label: "Contact our team", href: "/contact-us/" },
  children,
}: {
  title?: string;
  intro?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
  children?: ReactNode;
}) {
  return (
    <section className="bg-white py-16 sm:py-24" aria-label="Get in touch">
      <Container>
        <div data-reveal="scale" className="relative overflow-hidden rounded-[1.75rem] bg-brand-700 px-6 py-16 text-white sm:px-14 sm:py-20">
          <ArchitecturalLines gold className="pointer-events-none absolute -right-10 -top-10 h-[130%] w-auto text-white/15" />
          <div className="relative max-w-2xl">
            <SplitHeading text={title} className="text-3xl font-bold leading-[1.08] sm:text-5xl [&_.text-brand-500]:text-gold-300" />
            <p data-reveal="" className="mt-6 text-lg text-white/80">
              {intro}
            </p>
            <div data-reveal="" className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={primary.href} variant="light" size="lg" arrow>
                {primary.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="outline-light" size="lg">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
