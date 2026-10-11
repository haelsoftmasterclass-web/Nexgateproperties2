"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "../ui/cn";

/**
 * Shows a CMS image, or a branded placeholder when none has been uploaded yet.
 * Also falls back to the placeholder if the image fails to load.
 * The placeholder uses the Nexgate symbol and makes clear no photograph is available.
 */
export function MediaImage({
  src,
  alt,
  sizes,
  priority,
  className,
  label = "Image to follow",
  badge,
}: {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  label?: string;
  badge?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("card-media relative overflow-hidden bg-sand", className)}>
      {src && !failed ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={80} className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,#fff_0%,transparent_60%)]">
          <Image src="/brand/nexgate-properties-symbol.png" alt="" width={46} height={92} className="h-16 w-auto opacity-25" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted/80">{label}</span>
        </div>
      )}
      {badge && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">{badge}</span>
      )}
    </div>
  );
}
