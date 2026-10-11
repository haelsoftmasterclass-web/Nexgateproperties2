import type { Metadata } from "next";

import { PageHero } from "@/components/content/PageHero";
import { Notice } from "@/components/content/States";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Icon } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";
import { getSiteSettings } from "@/lib/api";
import { mailHref, telHref, whatsappHref } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: "Contact Nexgate Properties by phone, email or the enquiry form. Offices in Lekki, Lagos, Nigeria and Bayside, New York, USA.",
  path: "/contact-us/",
});

export default async function ContactPage() {
  const s = await getSiteSettings();
  const email = mailHref(s.primary_email);
  const wa = whatsappHref(s.whatsapp_number, "Hello Nexgate Properties, I would like to make an enquiry.");
  return (
    <>
      <PageHero
        title="Contact *us.*"
        eyebrow="Get in touch"
        intro="Call, email or send us a message. Our team will respond to your enquiry as soon as possible."
        crumbs={[{ name: "Contact us", href: "/contact-us/" }]}
      />
      <Section className="!pt-14">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            {s.offices.map((o, i) => (
              <div key={o.label} data-reveal="" style={{ ["--reveal-delay" as string]: i * 90 }} className="rounded-card bg-paper p-8 ring-1 ring-line">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">{o.label}</p>
                <address className="mt-4 text-lg not-italic leading-relaxed">{o.address}</address>
                {o.address_verified && o.map_embed_query ? (
                  <iframe
                    title={`Map of ${o.label}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(o.map_embed_query)}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="mt-6 aspect-[4/3] w-full rounded-xl border-0"
                  />
                ) : null}
              </div>
            ))}
            <div data-reveal="" className="rounded-card bg-white p-8 ring-1 ring-line">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Phone</p>
              <ul className="mt-4 space-y-3">
                {s.phone_numbers.map((p) => {
                  const href = telHref(p.number_e164);
                  return href ? (
                    <li key={p.number_e164}>
                      <a href={href} className="inline-flex items-center gap-3 text-lg font-semibold hover:text-brand-500">
                        <Icon name="phone" size={18} className="text-brand-500" />
                        {p.display}
                      </a>
                      {p.label && <span className="ml-2 text-sm text-muted">{p.label}</span>}
                    </li>
                  ) : null;
                })}
              </ul>
              {email && (
                <>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Email</p>
                  <a href={email} className="mt-4 inline-flex items-center gap-3 text-lg font-semibold hover:text-brand-500">
                    <Icon name="mail" size={18} className="text-brand-500" />
                    {s.primary_email}
                  </a>
                </>
              )}
              {wa && (
                <>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-brand-500">WhatsApp</p>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-3 text-lg font-semibold hover:text-brand-500">
                    <Icon name="whatsapp" size={18} className="text-brand-500" />
                    Chat with us
                  </a>
                </>
              )}
              {s.social_links.length > 0 && (
                <>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Follow us</p>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {s.social_links.map((l) => (
                      <li key={l.url}>
                        <a href={l.url} target="_blank" rel="noopener noreferrer me" className="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-line hover:ring-ink/30">
                          {l.platform}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            {!s.contact_details_confirmed && <Notice>These are Nexgate Group contact details.</Notice>}
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm category="general" title="Send us a message" intro="Fields marked * are required." messageRequired submitLabel="Send message" />
          </div>
        </Container>
      </Section>
    </>
  );
}
