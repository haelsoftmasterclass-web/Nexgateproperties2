import { Icon } from "../ui/Icon";

/**
 * Accessible accordion built on native <details>/<summary>: keyboard operable, searchable with
 * find-in-page, and readable without JavaScript. Pass defaultOpen to show answers up front.
 */
export function Accordion({ items, defaultOpen = false }: { items: { question: string; answer: string }[]; defaultOpen?: boolean }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <details key={i} open={defaultOpen} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-lg font-semibold text-ink transition-colors hover:text-brand-500">
            <span>{item.question}</span>
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-line transition-transform duration-300 group-open:rotate-45">
              <Icon name="close" size={14} className="rotate-45" />
            </span>
          </summary>
          <div className="pb-6 pr-12 leading-relaxed text-charcoal">
            {item.answer.split(/\n{2,}/).map((p, j) => (
              <p key={j} className={j ? "mt-3" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
