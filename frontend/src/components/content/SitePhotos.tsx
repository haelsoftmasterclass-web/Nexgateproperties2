import Image from "next/image";

import { Container, Section, SectionHeading } from "../ui/Section";
import { cn } from "../ui/cn";

/**
 * Photographs from Nexgate's own construction sites, supplied by the team.
 * Captions describe only what is visible; project names and locations are added once confirmed.
 */
const PHOTOS: {
  src: string;
  alt: string;
  caption: string;
  wide?: boolean;
  last?: boolean;
}[] = [
  {
    src: "/images/sites/drone-scaffolding.jpg",
    alt: "Aerial view of buildings under construction with scaffolding, marked Nexgate Construction",
    caption: "Structures going up",
    wide: true,
  },
  {
    src: "/images/sites/formwork-team.jpg",
    alt: "Two Nexgate team members in safety vests checking formwork on site",
    caption: "Formwork checks",
  },
  {
    src: "/images/sites/house-finishing.jpg",
    alt: "White two-storey house in its finishing stage while workers prepare the grounds",
    caption: "Finishing works",
  },
  {
    src: "/images/sites/foundation-aerial.jpg",
    alt: "Aerial view of a building foundation and substructure under construction",
    caption: "Foundation stage",
    wide: true,
  },
  {
    src: "/images/sites/formwork-inspection.jpg",
    alt: "Nexgate team member in a safety vest inspecting timber formwork",
    caption: "Site inspection",
  },
  {
    src: "/images/sites/blockwork.jpg",
    alt: "Workers laying blockwork for a new building",
    caption: "Blockwork",
  },
  {
    src: "/images/sites/site-front.jpg",
    alt: "Building site with stacked blocks and a Nexgate Group water tank",
    caption: "On site",
    last: true,
  },
];

export function SitePhotos({ tone = "white" }: { tone?: "white" | "paper" }) {
  return (
    <Section tone={tone} labelledBy="site-photos-title">
      <Container>
        <SectionHeading
          id="site-photos-title"
          eyebrow="From our sites"
          title="Work in *progress.*"
          intro="Recent photographs from Nexgate Group construction sites, taken by our team."
        />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {PHOTOS.map((p, i) => (
            <li
              key={p.src}
              data-reveal=""
              style={{ ["--reveal-delay" as string]: (i % 3) * 80 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-sand",
                p.wide ? "col-span-2 aspect-[3/2] lg:aspect-auto" : "aspect-[3/4]",
                p.last && "max-lg:col-span-2 max-lg:aspect-[3/2]",
              )}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes={
                  p.wide
                    ? "(min-width: 1024px) 66vw, 100vw"
                    : "(min-width: 1024px) 33vw, 50vw"
                }
                quality={80}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
                {p.caption}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
