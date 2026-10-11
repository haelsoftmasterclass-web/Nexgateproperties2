import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { ContactAside } from "@/components/content/ContactAside";
import { Gallery } from "@/components/content/Gallery";
import { MediaImage } from "@/components/content/MediaImage";
import { Prose } from "@/components/content/Prose";
import { ErrorState, Notice } from "@/components/content/States";
import { CheckList } from "@/components/content/Steps";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PropertyGrid } from "@/components/property/PropertyCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";
import { getProperty, getRedirect, getRelatedProperties, getSiteSettings } from "@/lib/api";
import { formatArea, formatPrice, locationLine } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

async function load(slug: string) {
  const res = await getProperty(slug);
  if (!res.ok && res.error === "not-found") {
    const target = await getRedirect("property", slug);
    if (target) permanentRedirect(`/properties/${target}/`);
    notFound();
  }
  return res;
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const res = await load(slug);
  if (!res.ok) return { title: "Property", robots: { index: false } };
  const p = res.data;
  const where = locationLine([p.city, p.state_region, p.country]);
  return pageMetadata({
    title: p.seo_title || `${p.title}${where ? `, ${p.city || p.state_region}` : ""}`,
    description: p.meta_description || p.summary || `${p.property_type_label} in ${where}. ${p.listing_status_label}. Enquire with Nexgate Properties.`,
    path: `/properties/${p.slug}/`,
    image: p.featured_image ?? p.images[0]?.image,
  });
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const res = await load(slug);
  if (!res.ok) {
    return (
      <Container className="py-24">
        <ErrorState title="We couldn’t load this property right now" />
      </Container>
    );
  }
  const p = res.data;
  const [related, settings] = await Promise.all([getRelatedProperties(slug), getSiteSettings()]);
  const listPath = p.category === "commercial" ? "/commercial-properties/" : "/residential-properties/";
  const listName = p.category === "commercial" ? "Commercial properties" : "Residential properties";
  const images = p.images.length ? p.images : p.featured_image ? [{ image: p.featured_image, alt_text: p.featured_image_alt || p.title, caption: "" }] : [];
  const location = locationLine([p.address, p.city, p.state_region, p.country]);

  const specs = [
    { label: "Property type", value: p.property_type_label },
    { label: "Category", value: p.category_label },
    { label: "Status", value: p.listing_status_label },
    { label: "Bedrooms", value: p.bedrooms?.toString() },
    { label: "Bathrooms", value: p.bathrooms?.toString() },
    { label: "Floor area", value: formatArea(p.floor_area_sqm) },
    { label: "Land area", value: formatArea(p.land_area_sqm) },
    { label: "Units or spaces", value: p.units?.toString() },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  const unavailable = ["sold", "off-market"].includes(p.listing_status);

  return (
    <>
      <section className="-mt-18 bg-paper pb-12 pt-28 sm:pt-32">
        <Container>
          <Breadcrumbs items={[{ name: listName, href: listPath }, { name: p.title, href: `/properties/${p.slug}/` }]} />
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p data-reveal="" className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
                {p.category_label} · {p.property_type_label}
              </p>
              <SplitHeading as="h1" text={p.title} className="mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl" />
              {location && (
                <p data-reveal="" className="mt-4 flex items-center gap-2 text-lg text-muted">
                  <Icon name="pin" size={18} />
                  {location}
                </p>
              )}
            </div>
            <div data-reveal="" className="lg:text-right">
              <p className="text-sm font-semibold text-muted">{p.listing_status_label}</p>
              <p className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">{formatPrice(p.price, p.currency, p.price_visibility)}</p>
              {p.price && p.price_qualifier && <p className="text-sm text-muted">{p.price_qualifier}</p>}
            </div>
          </div>
        </Container>
      </section>

      <Section className="!pt-12">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {images.length > 0 ? (
              <Gallery images={images} title={p.title} />
            ) : (
              <MediaImage src={null} alt="" sizes="66vw" className="aspect-[16/10] rounded-card" label="Photos to follow" />
            )}

            <dl className="mt-10 grid grid-cols-2 overflow-hidden rounded-card border-l border-t border-line sm:grid-cols-4">
              {specs.map((s) => (
                <div key={s.label} className="border-b border-r border-line bg-white p-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{s.label}</dt>
                  <dd className="mt-1.5 font-bold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-14">
              <h2 className="text-2xl font-bold">About this property</h2>
              <Prose source={p.description} className="mt-5" />
            </div>

            {(p.features.length > 0 || p.amenities.length > 0) && (
              <div className="mt-14 grid gap-10 sm:grid-cols-2">
                {p.features.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold">Features</h2>
                    <CheckList items={p.features} className="mt-5" />
                  </div>
                )}
                {p.amenities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold">Amenities</h2>
                    <CheckList items={p.amenities} className="mt-5" />
                  </div>
                )}
              </div>
            )}

            {p.location_notes && (
              <div className="mt-14">
                <h2 className="text-xl font-bold">Location</h2>
                <Prose source={p.location_notes} className="mt-4" />
              </div>
            )}

            {p.documentation_notes && (
              <div className="mt-14">
                <h2 className="text-xl font-bold">Documentation</h2>
                <Prose source={p.documentation_notes} className="mt-4" />
              </div>
            )}

            {p.project && (
              <Notice className="mt-14">
                This property is part of{" "}
                <a href={`/projects/${p.project.slug}/`} className="font-semibold text-brand-500 underline">
                  {p.project.name}
                </a>
                .
              </Notice>
            )}

            <Notice className="mt-6">
              Listing details are provided for information and may change. Price, availability and terms are confirmed in writing by our team.
              Please carry out your own checks and take independent legal advice before any purchase.
            </Notice>
          </div>

          <aside className="space-y-6 lg:col-span-4" aria-label="Enquire about this property">
            <div className="lg:sticky lg:top-24 space-y-6">
              <EnquiryForm
                category="property"
                propertySlug={p.slug}
                title={unavailable ? "Ask about similar properties" : "Enquire or book a viewing"}
                intro={unavailable ? "This property is no longer available. Tell us what you’re looking for." : "Send your question or request a viewing. A viewing is confirmed once our team contacts you."}
                fields={
                  unavailable
                    ? []
                    : [
                        {
                          name: "viewing_requested",
                          label: "I would like to",
                          type: "radio",
                          options: [
                            { value: "viewing", label: "Book a viewing" },
                            { value: "information", label: "Get more information" },
                          ],
                        },
                        { name: "preferred_date", label: "Preferred viewing date", type: "date" },
                      ]
                }
                messagePlaceholder="Any questions about this property?"
                submitLabel="Send enquiry"
                showContactMethod={false}
                className="!p-6"
              />
              <ContactAside settings={settings} />
            </div>
          </aside>
        </Container>
      </Section>

      {related.ok && related.data.length > 0 && (
        <Section tone="paper" labelledBy="related-title">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="related-title" className="text-3xl font-bold">
                Related properties
              </h2>
              <ButtonLink href={listPath} variant="secondary" arrow>
                All {listName.toLowerCase()}
              </ButtonLink>
            </div>
            <div className="mt-10">
              <PropertyGrid properties={related.data} />
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
