"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole site. Elements with [data-reveal] or [data-reveal-split]
 * get data-revealed="true" when they enter the viewport. Respects prefers-reduced-motion:
 * the html.motion-ready class (set before paint in the root layout) is removed and content shows at once.
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || !("IntersectionObserver" in window)) {
      root.classList.remove("motion-ready");
      return;
    }
    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed]), [data-reveal-split]:not([data-revealed])")
        .forEach((el) => observer.observe(el));
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    // Safety net: never leave content hidden if something goes wrong.
    const failsafe = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-split]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.dataset.revealed = "true";
      });
    }, 2500);

    const onChange = () => {
      if (reduce.matches) root.classList.remove("motion-ready");
    };
    reduce.addEventListener("change", onChange);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.clearTimeout(failsafe);
      reduce.removeEventListener("change", onChange);
    };
  }, [pathname]);

  return null;
}

/** Inline script for <head>: enables hidden-until-revealed styles only when JS and motion are allowed. */
export const motionBootScript = `try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){document.documentElement.classList.add('motion-ready')}}catch(e){}`;
