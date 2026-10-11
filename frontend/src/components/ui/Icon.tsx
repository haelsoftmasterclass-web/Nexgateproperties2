import type { SVGProps } from "react";

const paths = {
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  chevronDown: "m6 9 6 6 6-6",
  chevronLeft: "m15 18-6-6 6-6",
  chevronRight: "m9 18 6-6-6-6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  pin: "M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12Zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  check: "m5 12 5 5L20 7",
  bed: "M3 18V6M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6M7 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  bath: "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V5a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2",
  area: "M4 4h6M4 4v6M20 20h-6M20 20v-6M4 4l6 6M20 20l-6-6",
  building: "M4 21V5l8-3 8 3v16M9 21v-4h6v4M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01",
  home: "m3 11 9-8 9 8M5 9.5V21h14V9.5M10 21v-6h4v6",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  key: "M15 7a4 4 0 1 1-3.9 5H3v3h3v3h3v-3h2.1A4 4 0 0 1 15 7Zm1 3h.01",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  shield: "M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3Zm-3 9 2 2 4-4",
  handshake: "m11 17 2 2a1.5 1.5 0 0 0 2-2M14 14l2.5 2.5a1.5 1.5 0 0 0 2-2L15 11M8 12l3-3a2 2 0 0 1 2.8 0L18 13M3 11l4-4 4 1M21 11l-4-4-3 1M3 11l6 6",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  whatsapp: "M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12Zm-11-3c0 3.3 2.7 6 6 6l1-1.5-2-1-1 1a4 4 0 0 1-2.5-2.5l1-1-1-2L9 9Z",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5v-5m0-3h.01",
  alert: "M12 3 2 20h20L12 3Zm0 6v5m0 3h.01",
  sparkle: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  filter: "M4 5h16l-6 8v5l-4 2v-7L4 5Z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
