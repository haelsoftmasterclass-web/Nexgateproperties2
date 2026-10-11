"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import type { NavItem } from "@/lib/site";

import { ButtonLink } from "../ui/Button";
import { cn } from "../ui/cn";
import { Icon } from "../ui/Icon";
import { Logo } from "./Logo";

type Props = { propertyNav: NavItem[]; serviceNav: NavItem[]; phone?: { href: string; display: string } | null };

function Dropdown({ label, items, active }: { label: string; items: NavItem[]; active: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLLIElement>(null);
  const hoveredAt = useRef(0);
  const pathname = usePathname();

  // Close when the route changes (adjusting state during render, as React recommends).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        hoveredAt.current = Date.now();
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          // A click straight after hovering keeps the menu open instead of toggling it shut.
          if (Date.now() - hoveredAt.current < 500) return;
          setOpen((v) => !v);
        }}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors hover:text-brand-500",
          active ? "text-brand-500" : "text-ink",
        )}
      >
        {label}
        <Icon name="chevronDown" size={16} className={cn("transition-transform duration-300", open && "rotate-180")} />
      </button>
      <div
        id={id}
        className={cn(
          "absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <ul className="rounded-card bg-white p-2 shadow-lift ring-1 ring-line">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group block rounded-xl px-4 py-3 transition-colors hover:bg-paper">
                <span className="flex items-center justify-between text-sm font-semibold text-ink">
                  {item.label}
                  <Icon name="arrowRight" size={14} className="-translate-x-1 text-brand-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
                {item.description && <span className="mt-0.5 block text-xs text-muted">{item.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Header({ propertyNav, serviceNav, phone }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (!mobileOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const links: NavItem[] = [
    { label: "Projects", href: "/projects/" },
    { label: "About Us", href: "/about-us/" },
    { label: "Insights", href: "/insights/" },
    { label: "Contact Us", href: "/contact-us/" },
  ];

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-500",
        scrolled ? "bg-white/85 shadow-[0_1px_0_rgb(29_27_26/0.06)] backdrop-blur-xl" : "bg-white/0",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Logo priority />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            <li>
              <Link
                href="/"
                className={cn("rounded-full px-3.5 py-2 text-[0.9375rem] font-medium hover:text-brand-500", isActive("/") ? "text-brand-500" : "text-ink")}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Home
              </Link>
            </li>
            <Dropdown label="Properties" items={propertyNav} active={propertyNav.some((i) => isActive(i.href)) || pathname.startsWith("/properties/")} />
            <Dropdown label="Services" items={serviceNav} active={serviceNav.some((i) => isActive(i.href)) || pathname.startsWith("/services/")} />
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn("rounded-full px-3.5 py-2 text-[0.9375rem] font-medium hover:text-brand-500", isActive(l.href) ? "text-brand-500" : "text-ink")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/book-a-consultation/" size="sm" className="hidden sm:inline-flex" arrow>
            Enquire Now
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-line lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>

    </header>
      {/* Mobile navigation */}
      <div
        id={menuId}
        hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-white lg:hidden"
      >
        <div className="sticky top-0 z-10 flex h-18 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              setMobileOpen(false);
              toggleRef.current?.focus();
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-line"
            aria-label="Close menu"
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav aria-label="Mobile" className="px-4 pb-32 pt-2 sm:px-6">
          <ul className="divide-y divide-line">
            <li>
              <Link href="/" className="block py-4 text-lg font-semibold">Home</Link>
            </li>
            <li className="py-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Properties</p>
              <ul className="mt-2">
                {propertyNav.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} className="block py-2.5 text-lg font-semibold">{i.label}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="py-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Services</p>
              <ul className="mt-2">
                <li>
                  <Link href="/services/" className="block py-2.5 text-base font-semibold">All services</Link>
                </li>
                {serviceNav.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} className="block py-2.5 text-base font-medium text-charcoal">{i.label}</Link>
                  </li>
                ))}
              </ul>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-4 text-lg font-semibold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="fixed inset-x-0 bottom-0 flex gap-3 border-t border-line bg-white p-4">
          <ButtonLink href="/book-a-consultation/" className="flex-1" arrow>
            Enquire Now
          </ButtonLink>
          {phone && (
            <ButtonLink href={phone.href} variant="secondary" aria-label={`Call ${phone.display}`}>
              <Icon name="phone" size={18} />
            </ButtonLink>
          )}
        </div>
      </div>
    </>
  );
}
