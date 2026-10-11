import Link from "next/link";

import { cn } from "../ui/cn";
import { Icon } from "../ui/Icon";

/** Server-rendered pagination that preserves the current query string. */
export function Pagination({
  basePath,
  page,
  total,
  pageSize,
  query = {},
}: {
  basePath: string;
  page: number;
  total: number;
  pageSize: number;
  query?: Record<string, string | undefined>;
}) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  const href = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) if (v && k !== "page") params.set(k, v);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };
  const numbers = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev" className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-line hover:ring-ink/30" aria-label="Previous page">
          <Icon name="chevronLeft" size={18} />
        </Link>
      )}
      {numbers.map((p, i) => (
        <span key={p} className="inline-flex items-center gap-2">
          {i > 0 && p - numbers[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold",
              p === page ? "bg-ink text-white" : "ring-1 ring-line hover:ring-ink/30",
            )}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pages && (
        <Link href={href(page + 1)} rel="next" className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-line hover:ring-ink/30" aria-label="Next page">
          <Icon name="chevronRight" size={18} />
        </Link>
      )}
    </nav>
  );
}
