"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { GalleryImage } from "@/lib/types";

import { Icon } from "../ui/Icon";
import { cn } from "../ui/cn";

/** Image gallery with thumbnails and an accessible full-screen viewer (keyboard: arrows, Escape). */
export function Gallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const count = images.length;
  const go = useCallback((d: number) => setActive((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  if (count === 0) return null;
  const current = images[active];

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-card bg-sand"
        aria-label={`Open gallery: ${current.alt_text}`}
      >
        <Image src={current.image} alt={current.alt_text} fill priority sizes="(min-width:1024px) 66vw, 100vw" quality={80} className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.02]" />
        {current.is_rendering && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">Artist’s impression</span>}
        {count > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-ink/75 px-3 py-1.5 text-xs font-semibold text-white">
            {active + 1} / {count} · View all
          </span>
        )}
      </button>
      {current.caption && <p className="mt-3 text-sm text-muted">{current.caption}</p>}
      {count > 1 && (
        <ul className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6" aria-label={`${title} photos`}>
          {images.map((img, i) => (
            <li key={img.image}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}: ${img.alt_text}`}
                aria-current={i === active}
                className={cn("relative block aspect-square w-full overflow-hidden rounded-xl ring-2 transition", i === active ? "ring-brand-500" : "ring-transparent opacity-70 hover:opacity-100")}
              >
                <Image src={img.image} alt="" fill sizes="120px" quality={70} className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label={`${title} gallery`}
        className="m-0 h-full max-h-none w-full max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <p className="text-sm">
              {active + 1} / {count}
            </p>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/30" aria-label="Close gallery">
              <Icon name="close" />
            </button>
          </div>
          <div className="relative flex-1">
            <Image src={current.image} alt={current.alt_text} fill sizes="100vw" quality={80} className="object-contain" />
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <button type="button" onClick={() => go(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/30" aria-label="Previous image">
              <Icon name="chevronLeft" />
            </button>
            <p className="text-center text-sm text-white/80">{current.caption || current.alt_text}</p>
            <button type="button" onClick={() => go(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/30" aria-label="Next image">
              <Icon name="chevronRight" />
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
