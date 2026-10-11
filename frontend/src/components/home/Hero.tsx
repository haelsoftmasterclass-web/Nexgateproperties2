import Image from "next/image";

import { ArchitecturalLines } from "../content/ArchitecturalLines";
import { SplitHeading } from "../motion/SplitHeading";
import { SearchForm } from "../property/SearchForm";
import { ButtonLink } from "../ui/Button";
import { Container, Eyebrow } from "../ui/Section";

export function Hero({ locations }: { locations: string[] }) {
  return (
    <section className="relative -mt-18 overflow-hidden bg-paper pt-18" aria-labelledby="hero-title">
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,rgb(29_27_26/0.045)_1px,transparent_1px)] bg-[size:calc(100%/12)_100%]" />
      <Container className="relative grid gap-12 pb-12 pt-16 sm:pt-24 lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-28">
        <div className="lg:col-span-7">
          <div data-reveal="" className="mb-7">
            <Eyebrow>Nexgate Properties · A Nexgate Group company</Eyebrow>
          </div>
          <SplitHeading
            as="h1"
            id="hero-title"
            text="Find the Right Property. *Build Your Future.*"
            className="text-[2.75rem] font-extrabold leading-[0.98] text-ink sm:text-6xl lg:text-[5.25rem]"
          />
          <p data-reveal="" style={{ ["--reveal-delay" as string]: 350 }} className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            Residential and commercial property, new developments, investment opportunities and property management, with
            guidance from a team that puts clarity first. In Nigeria and internationally.
          </p>
          <div data-reveal="" style={{ ["--reveal-delay" as string]: 450 }} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/residential-properties/" size="lg" arrow>
              Explore Properties
            </ButtonLink>
            <ButtonLink href="/book-a-consultation/" size="lg" variant="secondary">
              Speak to Our Team
            </ButtonLink>
          </div>
        </div>
        <div className="relative hidden lg:col-span-5 lg:block">
          <div data-reveal="scale" style={{ ["--reveal-delay" as string]: 200 }} className="relative ml-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[1.75rem] bg-brand-700 shadow-lift">
            <ArchitecturalLines gold className="absolute inset-0 h-full w-full p-10 text-white/35" />
            <div className="fade-in-late absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/90 to-transparent p-8 text-white" style={{ ["--fade-delay" as string]: 1600 }}>
              <p className="font-display text-3xl italic leading-tight">Residential. Commercial. International.</p>
              <p className="mt-2 text-sm text-white/70">Six services, one property team.</p>
            </div>
            <Image
              src="/brand/nexgate-properties-symbol-white.png"
              alt=""
              width={184}
              height={370}
              className="fade-in-late absolute right-8 top-8 h-16 w-auto opacity-90"
              style={{ ["--fade-delay" as string]: 1200 }}
            />
          </div>
        </div>
      </Container>
      <Container className="relative pb-16 sm:pb-20">
        <div data-reveal="" style={{ ["--reveal-delay" as string]: 550 }}>
          <SearchForm locations={locations} />
        </div>
      </Container>
    </section>
  );
}
