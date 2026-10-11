import { whatsappHref } from "@/lib/format";

import { Icon } from "../ui/Icon";

/** Floating WhatsApp shortcut. Renders nothing until a WhatsApp number is configured in Site settings. */
export function WhatsAppButton({ number }: { number: string }) {
  const href = whatsappHref(number, "Hello Nexgate Properties, I would like to make an enquiry.");
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Nexgate Properties on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8f4e] text-white shadow-lift transition-transform hover:-translate-y-1"
    >
      <Icon name="whatsapp" size={26} />
    </a>
  );
}
