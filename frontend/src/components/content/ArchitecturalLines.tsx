import type { CSSProperties } from "react";

/**
 * Line-art façade inspired by the geometry of the Nexgate symbol (a framed gate with a diagonal).
 * Strokes draw in on load; static under reduced motion.
 */
export function ArchitecturalLines({ className, gold }: { className?: string; gold?: boolean }) {
  const p = (d: string, delay: number, length = 1400, stroke?: string) => (
    <path
      d={d}
      className="draw-path"
      style={{ "--draw-delay": delay, "--path-length": length } as CSSProperties}
      stroke={stroke ?? "currentColor"}
    />
  );
  return (
    <svg viewBox="0 0 560 640" fill="none" strokeWidth={1.2} className={className} aria-hidden="true">
      {p("M80 620V140h200v480", 0, 1200)}
      {p("M280 620V60h200v560", 150, 1400)}
      {p("M80 620h460", 300, 500)}
      {p("M80 140l200 160", 450, 300)}
      {p("M280 60l200 170", 550, 300)}
      {p("M280 380l200-150", 650, 300)}
      {[180, 220, 260, 300, 340, 380, 420, 460, 500, 540].map((y, i) => (
        <g key={y}>{p(`M100 ${y + 40}h160`, 700 + i * 60, 180)}</g>
      ))}
      {[120, 170, 220, 270, 320, 370, 420, 470, 520, 570].map((y, i) => (
        <g key={y}>{p(`M300 ${y}h160`, 800 + i * 60, 180)}</g>
      ))}
      {p("M280 60l200 170", 1500, 300, gold ? "#C9A84C" : undefined)}
    </svg>
  );
}
