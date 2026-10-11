# Design system

Visual direction: the layout rhythm and motion of eulerhq.com (announcement bar, sticky blurred header, large two-tone headlines, numbered 01–03 pillars, big stat tiles, closing CTA band), in Nexgate Properties’ own colours taken from the supplied logo.

## Colour tokens (`frontend/src/app/globals.css`)

| Token | Value | Use |
| --- | --- | --- |
| `brand-500` | `#B01F31` | Primary red from the logo (also the Nexgate Group red). Buttons, accents, links. |
| `brand-700` | `#800D27` | Deep burgundy. Announcement bar, CTA band, hover. |
| `brand-900` | `#3D0712` | Footer background. |
| `brand-50/100/200` | tints | Icon backgrounds, error panels. |
| `gold-500` | `#C9A84C` | Gold accent from the logo. Rules, bullets. Use sparingly; never as a large background. |
| `gold-300` | `#E3CF8A` | Gold on dark backgrounds. |
| `ink` | `#1D1B1A` | Headings and body text. |
| `charcoal` | `#252525` | Long-form text. |
| `muted` | `#5F6672` | Secondary text (AA contrast on white and paper). |
| `paper` | `#F7F6F3` | Warm off-white section background. |
| `sand` | `#EFECE6` | Image placeholders, skeletons. |
| `line` | `#E5E7EB` | Borders and dividers. |

## Typography

- **Manrope** (sans) for interface and headings: bold/extra-bold, tight tracking (−0.025em).
- **Instrument Serif italic** for accent words in headings. Wrap words in `*asterisks*` in `SplitHeading`/`SectionHeading` titles, e.g. `"Find the Right Property. *Build Your Future.*"`.
- Eyebrows: 12px, bold, uppercase, 0.18em tracking, with a gold rule.

## Spacing, radius, shadow

- Sections: `py-20 sm:py-28`. Container: max 1280px with 16/24/40px gutters.
- Radii: cards `1rem` (`rounded-card`), form fields `0.625rem`, buttons and chips fully rounded, large feature panels `1.75rem`.
- Shadows: `shadow-card` (rest), `shadow-lift` (hover, menus).
- Breakpoints: Tailwind defaults (sm 640, md 768, lg 1024, xl 1280).

## Motion

All motion is subtle and disabled for users who prefer reduced motion. Content is visible without JavaScript.

- `[data-reveal]`: fade up with a slight blur as elements enter the viewport; `--reveal-delay` staggers. Variants: `fade`, `scale`.
- `SplitHeading`: headline words slide up from a mask, one after another.
- `ArchitecturalLines`: line-art façade (based on the logo’s gate geometry) that draws itself in.
- `Marquee`: services ticker, pauses on hover.
- `CountUp`: counts to verified numbers only.
- Hover: cards lift, images zoom slightly, arrows slide.

## Components

`components/ui`: Button/ButtonLink (primary, secondary, ghost, light, outline-light), Icon, Container, Section, Eyebrow, SectionHeading.
`components/content`: PageHero, Breadcrumbs (with JSON-LD), CtaBand, Steps, CheckList, Accordion, Prose (safe CMS text), MediaImage (image or branded placeholder), Gallery (with accessible viewer), EmptyState, ErrorState, Notice, LoadingGrid, Pagination, ContactAside, ServiceLayout, LegalPageView.
`components/property`: PropertyCard/Grid, SearchForm, FilterPanel, ListingPage. `components/project`: ProjectCard. `components/insights`: ArticleCard. `components/forms`: EnquiryForm (configurable fields).

A testimonial component is intentionally not included until approved, genuine testimonials exist. No cookie banner is included because no tracking is installed.
