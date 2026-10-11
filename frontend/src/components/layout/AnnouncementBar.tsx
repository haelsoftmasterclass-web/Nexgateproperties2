import Link from "next/link";

import { Icon } from "../ui/Icon";

export function AnnouncementBar() {
  return (
    <div className="bg-brand-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-center text-[0.8125rem] sm:px-6 lg:px-10">
        <span className="hidden sm:inline text-white/80">Part of Nexgate Group.</span>
        <Link href="/book-a-consultation/" className="group inline-flex items-center gap-1.5 font-semibold">
          Speak to our property team
          <Icon name="arrowRight" size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
