import Link from "next/link";

import { mailHref, telHref, whatsappHref } from "@/lib/format";
import { SERVICES } from "@/lib/services";
import type { SiteSettings } from "@/lib/types";

import { Container } from "../ui/Section";
import { Icon } from "../ui/Icon";
import { Logo } from "./Logo";

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ settings }: { settings: SiteSettings }) {
  const email = mailHref(settings.primary_email);
  const whatsapp = whatsappHref(settings.whatsapp_number);
  const year = new Date().getFullYear();
  const affiliates = settings.affiliates.filter((a) => a.url);

  return (
    <footer className="bg-brand-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container className="pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">{settings.short_description}</p>
            <ul className="mt-8 space-y-3 text-sm">
              {settings.phone_numbers.map((p) => {
                const href = telHref(p.number_e164);
                return href ? (
                  <li key={p.number_e164}>
                    <a href={href} className="inline-flex items-center gap-3 text-white/80 hover:text-white">
                      <Icon name="phone" size={16} className="text-gold-300" />
                      {p.display}
                    </a>
                  </li>
                ) : null;
              })}
              {email && (
                <li>
                  <a href={email} className="inline-flex items-center gap-3 text-white/80 hover:text-white">
                    <Icon name="mail" size={16} className="text-gold-300" />
                    {settings.primary_email}
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-white/80 hover:text-white">
                    <Icon name="whatsapp" size={16} className="text-gold-300" />
                    WhatsApp us
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <Column
              title="Properties"
              links={[
                { label: "Residential properties", href: "/residential-properties/" },
                { label: "Commercial properties", href: "/commercial-properties/" },
                { label: "Sell or partner with us", href: "/sell-or-partner-with-us/" },
              ]}
            />
            <Column title="Services" links={[{ label: "All services", href: "/services/" }, ...SERVICES.slice(1).map((s) => ({ label: s.navLabel, href: s.href }))]} />
            <Column
              title="Projects"
              links={[
                { label: "Our projects", href: "/projects/" },
                { label: "Property development", href: "/property-development/" },
                { label: "Book a consultation", href: "/book-a-consultation/" },
              ]}
            />
            <Column
              title="Company"
              links={[
                { label: "About us", href: "/about-us/" },
                { label: "Insights", href: "/insights/" },
                { label: "FAQs", href: "/frequently-asked-questions/" },
                { label: "Contact us", href: "/contact-us/" },
              ]}
            />
          </div>
        </div>

        <div className="mt-16 space-y-4 border-t border-white/10 pt-8 text-sm text-white/60">
          {settings.offices.map((o) => (
            <p key={o.label} className="flex items-start gap-3">
              <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-gold-300" />
              <span>
                <span className="text-white/80">{o.label}:</span> {o.address}
              </span>
            </p>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Nexgate Properties. A Nexgate Group company.
            {affiliates.length > 0 && (
              <>
                {" "}
                Group businesses:{" "}
                {affiliates.map((a, i) => (
                  <span key={a.name}>
                    {i > 0 && " · "}
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {a.name}
                    </a>
                  </span>
                ))}
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {settings.social_links.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer me" className="hover:text-white">
                {s.platform}
              </a>
            ))}
            <Link href="/privacy-policy/" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions/" className="hover:text-white">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
