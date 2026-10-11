import { mailHref, telHref, whatsappHref } from "@/lib/format";
import type { SiteSettings } from "@/lib/types";

import { Icon } from "../ui/Icon";

/** Compact contact block used beside enquiry forms. Renders only valid links. */
export function ContactAside({ settings, title = "Prefer to talk?" }: { settings: SiteSettings; title?: string }) {
  const email = mailHref(settings.primary_email);
  const wa = whatsappHref(settings.whatsapp_number);
  return (
    <div className="rounded-card bg-paper p-6 ring-1 ring-line sm:p-8">
      <h2 className="text-lg font-bold">{title}</h2>
      <ul className="mt-5 space-y-3 text-[0.9375rem]">
        {settings.phone_numbers.slice(0, 2).map((p) => {
          const href = telHref(p.number_e164);
          return href ? (
            <li key={p.number_e164}>
              <a href={href} className="inline-flex items-center gap-3 font-semibold hover:text-brand-500">
                <Icon name="phone" size={18} className="text-brand-500" />
                {p.display}
              </a>
            </li>
          ) : null;
        })}
        {email && (
          <li>
            <a href={email} className="inline-flex items-center gap-3 font-semibold hover:text-brand-500">
              <Icon name="mail" size={18} className="text-brand-500" />
              {settings.primary_email}
            </a>
          </li>
        )}
        {wa && (
          <li>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-semibold hover:text-brand-500">
              <Icon name="whatsapp" size={18} className="text-brand-500" />
              Chat on WhatsApp
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
