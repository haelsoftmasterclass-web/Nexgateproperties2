import Image from "next/image";
import Link from "next/link";

import { cn } from "../ui/cn";

/** The supplied Nexgate Properties logo: geometric symbol plus wordmark, arranged horizontally for the header. */
export function Logo({ light, className, priority }: { light?: boolean; className?: string; priority?: boolean }) {
  const suffix = light ? "-white" : "";
  return (
    <Link href="/" aria-label="Nexgate Properties home" className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={`/brand/nexgate-properties-symbol${suffix}.png`}
        alt=""
        width={184}
        height={370}
        priority={priority}
        className="h-11 w-auto"
      />
      <Image
        src={`/brand/nexgate-properties-wordmark${suffix}.png`}
        alt="Nexgate Properties"
        width={620}
        height={182}
        priority={priority}
        className="h-9 w-auto"
      />
    </Link>
  );
}
