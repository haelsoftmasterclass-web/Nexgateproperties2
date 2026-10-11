"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";

import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { cn } from "../ui/cn";

export type EnquiryCategory =
  | "property"
  | "investment"
  | "project"
  | "management"
  | "advisory"
  | "international"
  | "sell-partner"
  | "consultation"
  | "general";

export type ExtraField = {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "number" | "radio";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  help?: string;
  half?: boolean;
};

type Props = {
  category: EnquiryCategory;
  title?: string;
  intro?: string;
  fields?: ExtraField[];
  propertySlug?: string;
  projectSlug?: string;
  messageLabel?: string;
  messageRequired?: boolean;
  messagePlaceholder?: string;
  submitLabel?: string;
  showContactMethod?: boolean;
  successTitle?: string;
  successMessage?: string;
  notice?: string;
  className?: string;
};

type Errors = Record<string, string>;

const CONSENT_TEXT =
  "I agree that Nexgate Properties may use the information I have provided to respond to my enquiry, as described in the privacy policy.";

const inputCls =
  "mt-1.5 block h-12 w-full rounded-field border border-line bg-white px-4 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 aria-[invalid=true]:border-danger";

const CONTACT_METHODS = [
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "video", label: "Video call" },
  { value: "in-person", label: "In person" },
];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
      <Icon name="alert" size={14} />
      {message}
    </p>
  );
}

function flattenErrors(data: unknown): Errors {
  const out: Errors = {};
  if (!data || typeof data !== "object") return out;
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (Array.isArray(value)) out[key] = String(value[0]);
    else if (typeof value === "string") out[key] = value;
    else if (value && typeof value === "object") Object.assign(out, flattenErrors(value));
  }
  return out;
}

/**
 * Reusable enquiry form. Validates in the browser for convenience, then posts to the Next.js
 * route handler, which forwards to the Django API. Success is only shown after the server
 * confirms the enquiry was stored.
 */
export function EnquiryForm({
  category,
  title,
  intro,
  fields = [],
  propertySlug,
  projectSlug,
  messageLabel = "Message",
  messageRequired = false,
  messagePlaceholder = "Tell us what you are looking for",
  submitLabel = "Send enquiry",
  showContactMethod = true,
  successTitle = "Thank you. Your enquiry has been received.",
  successMessage = "A member of our team will be in touch. Please keep your reference number for your records.",
  notice,
  className,
}: Props) {
  const uid = useId();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const fid = (name: string) => `${uid}-${name}`;

  function validate(data: FormData): Errors {
    const e: Errors = {};
    const name = String(data.get("full_name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const method = String(data.get("preferred_contact_method") || "");
    if (name.length < 2) e.full_name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    if (phone && !/^\+?[0-9\s().-]{7,24}$/.test(phone)) e.phone = "Enter a valid phone number, including the country code.";
    if ((method === "phone" || method === "whatsapp") && !phone) e.phone = "Add a phone number so we can call or message you.";
    if (messageRequired && !String(data.get("message") || "").trim()) e.message = "Please tell us how we can help.";
    for (const f of fields) {
      const v = String(data.get(f.name) || "").trim();
      if (f.required && !v) e[f.name] = `Please complete “${f.label}”.`;
      if (f.type === "date" && v && v < today) e[f.name] = "Please choose a date from today onwards.";
    }
    if (!data.get("consent")) e.consent = "Please confirm you have read the privacy policy.";
    return e;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const clientErrors = validate(data);
    setErrors(clientErrors);
    setFormError(null);
    if (Object.keys(clientErrors).length) {
      const first = Object.keys(clientErrors)[0];
      (form.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
      return;
    }

    const details: Record<string, string> = {};
    for (const f of fields) {
      const v = String(data.get(f.name) || "").trim();
      if (v) details[f.name] = v;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiries/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          full_name: String(data.get("full_name")).trim(),
          email: String(data.get("email")).trim(),
          phone: String(data.get("phone") || "").trim(),
          message: String(data.get("message") || "").trim(),
          preferred_contact_method: String(data.get("preferred_contact_method") || ""),
          property_slug: propertySlug || "",
          project_slug: projectSlug || "",
          details,
          source_page: pathname,
          consent: data.get("consent") === "on",
          consent_text: CONSENT_TEXT,
          website: String(data.get("website") || ""),
          form_started_at: startedAt,
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.status === 201 && body?.reference) {
        setReference(body.reference);
        setStatus("success");
        form.reset();
        return;
      }
      if (res.status === 400 && body) {
        const serverErrors = flattenErrors(body);
        const fieldErrors: Errors = {};
        let general: string | null = null;
        for (const [k, v] of Object.entries(serverErrors)) {
          if (k === "non_field_errors" || k === "detail" || k === "details" || k === "property_slug" || k === "project_slug") general = v;
          else fieldErrors[k] = v;
        }
        setErrors(fieldErrors);
        setFormError(general ?? "Please check the highlighted fields and try again.");
      } else if (res.status === 429) {
        setFormError("We have received several submissions from your connection. Please wait a while before trying again, or contact us by phone.");
      } else {
        setFormError(body?.detail ?? "We could not send your enquiry right now. Please try again, or contact us by phone or email.");
      }
      setStatus("error");
    } catch {
      setStatus("error");
      setFormError("We could not reach our server. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className={cn("rounded-card bg-white p-8 ring-1 ring-line sm:p-10", className)}>
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <Icon name="check" size={28} />
        </span>
        <h3 className="mt-6 text-2xl font-bold text-ink">{successTitle}</h3>
        <p className="mt-3 text-charcoal">{successMessage}</p>
        {reference && (
          <p className="mt-6 inline-flex rounded-full bg-paper px-4 py-2 text-sm">
            Reference:&nbsp;<strong className="font-mono">{reference}</strong>
          </p>
        )}
        <div className="mt-8">
          <Button
            variant="secondary"
            onClick={() => {
              setStatus("idle");
              setReference(null);
            }}
          >
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  const describedBy = (name: string, help?: string) =>
    [errors[name] ? `${fid(name)}-error` : null, help ? `${fid(name)}-help` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={title ? `${uid}-title` : undefined}
      className={cn("rounded-card bg-white p-6 ring-1 ring-line sm:p-10", className)}
    >
      {title && (
        <h2 id={`${uid}-title`} className="text-2xl font-bold text-ink sm:text-3xl">
          {title}
        </h2>
      )}
      {intro && <p className="mt-3 text-muted">{intro}</p>}

      {formError && (
        <div role="alert" className="mt-6 flex gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 ring-1 ring-brand-200">
          <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
          {formError}
        </div>
      )}

      <div className={cn("grid gap-5 sm:grid-cols-2", title || intro || formError ? "mt-8" : "")}>
        <div className="sm:col-span-2">
          <label htmlFor={fid("full_name")} className="text-sm font-semibold text-ink">
            Full name <span className="text-brand-500">*</span>
          </label>
          <input id={fid("full_name")} name="full_name" autoComplete="name" required maxLength={120} aria-invalid={!!errors.full_name} aria-describedby={describedBy("full_name")} className={inputCls} />
          <FieldError id={`${fid("full_name")}-error`} message={errors.full_name} />
        </div>
        <div>
          <label htmlFor={fid("email")} className="text-sm font-semibold text-ink">
            Email <span className="text-brand-500">*</span>
          </label>
          <input id={fid("email")} name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={inputCls} />
          <FieldError id={`${fid("email")}-error`} message={errors.email} />
        </div>
        <div>
          <label htmlFor={fid("phone")} className="text-sm font-semibold text-ink">
            Phone
          </label>
          <input id={fid("phone")} name="phone" type="tel" autoComplete="tel" maxLength={32} placeholder="+234 …" aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} className={inputCls} />
          <FieldError id={`${fid("phone")}-error`} message={errors.phone} />
        </div>

        {fields.map((f) => (
          <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
            {f.type === "radio" ? (
              <fieldset aria-describedby={describedBy(f.name, f.help)}>
                <legend className="text-sm font-semibold text-ink">
                  {f.label} {f.required && <span className="text-brand-500">*</span>}
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {f.options?.map((o) => (
                    <label key={o.value} className="cursor-pointer">
                      <input type="radio" name={f.name} value={o.value} className="peer sr-only" />
                      <span className="inline-flex rounded-full px-4 py-2 text-sm font-medium ring-1 ring-line transition-colors peer-checked:bg-ink peer-checked:text-white peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-brand-500 hover:ring-ink/30">
                        {o.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <>
                <label htmlFor={fid(f.name)} className="text-sm font-semibold text-ink">
                  {f.label} {f.required && <span className="text-brand-500">*</span>}
                </label>
                {f.type === "select" ? (
                  <select id={fid(f.name)} name={f.name} defaultValue="" aria-invalid={!!errors[f.name]} aria-describedby={describedBy(f.name, f.help)} className={inputCls}>
                    <option value="">{f.placeholder ?? "Please select"}</option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={fid(f.name)}
                    name={f.name}
                    type={f.type}
                    min={f.type === "date" ? today : f.type === "number" ? 0 : undefined}
                    maxLength={f.type === "text" ? 500 : undefined}
                    placeholder={f.placeholder}
                    aria-invalid={!!errors[f.name]}
                    aria-describedby={describedBy(f.name, f.help)}
                    className={inputCls}
                  />
                )}
              </>
            )}
            {f.help && (
              <p id={`${fid(f.name)}-help`} className="mt-1.5 text-xs text-muted">
                {f.help}
              </p>
            )}
            <FieldError id={`${fid(f.name)}-error`} message={errors[f.name]} />
          </div>
        ))}

        {showContactMethod && (
          <div className="sm:col-span-2">
            <label htmlFor={fid("preferred_contact_method")} className="text-sm font-semibold text-ink">
              Preferred contact method
            </label>
            <select id={fid("preferred_contact_method")} name="preferred_contact_method" defaultValue="" className={inputCls}>
              <option value="">No preference</option>
              {CONTACT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor={fid("message")} className="text-sm font-semibold text-ink">
            {messageLabel} {messageRequired && <span className="text-brand-500">*</span>}
          </label>
          <textarea
            id={fid("message")}
            name="message"
            rows={5}
            maxLength={4000}
            placeholder={messagePlaceholder}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message")}
            className={cn(inputCls, "h-auto py-3")}
          />
          <FieldError id={`${fid("message")}-error`} message={errors.message} />
        </div>

        {/* Honeypot: hidden from people, tempting for bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={fid("website")}>Leave this field empty</label>
          <input id={fid("website")} name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-charcoal">
            <input
              type="checkbox"
              name="consent"
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? `${fid("consent")}-error` : undefined}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-line accent-brand-500"
            />
            <span>
              I agree that Nexgate Properties may use the information I have provided to respond to my enquiry, as described in the{" "}
              <Link href="/privacy-policy/" className="font-semibold text-brand-500 underline underline-offset-2">
                privacy policy
              </Link>
              . <span className="text-brand-500">*</span>
            </span>
          </label>
          <FieldError id={`${fid("consent")}-error`} message={errors.consent} />
        </div>
      </div>

      {notice && <p className="mt-6 text-sm text-muted">{notice}</p>}

      <div className="mt-8">
        <Button type="submit" size="lg" arrow disabled={status === "submitting"} aria-busy={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
