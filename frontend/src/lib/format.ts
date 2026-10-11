const CURRENCY_LOCALE: Record<string, string> = { NGN: "en-NG", USD: "en-US", GBP: "en-GB", EUR: "en-IE", AED: "en-AE" };

export function formatPrice(price: string | null, currency: string, visibility: string): string {
  if (visibility !== "show" || price === null) return "Price on request";
  const value = Number(price);
  if (!Number.isFinite(value)) return "Price on request";
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency] ?? "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(value: string | null): string | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? `${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(n)} m²` : null;
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function locationLine(parts: (string | null | undefined)[]): string {
  return parts.filter((p) => p && p.trim()).join(", ");
}

/** Builds a WhatsApp link only from a digits-only international number. */
export function whatsappHref(number: string, text?: string): string | null {
  const digits = (number || "").replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Returns a tel: link only for valid E.164 numbers, so no malformed links are rendered. */
export function telHref(e164: string): string | null {
  return /^\+[1-9]\d{6,14}$/.test(e164) ? `tel:${e164}` : null;
}

export function mailHref(email: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `mailto:${email}` : null;
}

export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
