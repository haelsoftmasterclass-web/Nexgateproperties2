import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "./cn";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline-light";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white shadow-[0_8px_24px_-10px_rgb(176_31_49/0.7)] hover:bg-brand-700 hover:-translate-y-0.5",
  secondary: "bg-white text-ink ring-1 ring-inset ring-line hover:ring-ink/30 hover:-translate-y-0.5",
  ghost: "text-ink hover:text-brand-500",
  light: "bg-white text-brand-700 hover:bg-paper hover:-translate-y-0.5",
  "outline-light": "text-white ring-1 ring-inset ring-white/40 hover:bg-white/10 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = { variant?: Variant; size?: Size; arrow?: boolean; children: ReactNode; className?: string };

function Content({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="relative inline-flex h-4 w-4 overflow-hidden">
          <Icon name="arrowRight" size={16} className="transition-transform duration-500 group-hover/btn:translate-x-4" />
          <Icon name="arrowRight" size={16} className="absolute -translate-x-4 transition-transform duration-500 group-hover/btn:translate-x-0" />
        </span>
      )}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow,
  children,
  className,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const external = typeof href === "string" && /^(https?:|tel:|mailto:)/.test(href);
  const cls = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        <Content arrow={arrow}>{children}</Content>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  arrow,
  children,
  className,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}
