/**
 * Minimal, safe renderer for CMS long-form text: "## " / "### " headings, "- " and "1. " lists,
 * paragraphs and [links](https://...). Output is a typed tree, never raw HTML.
 */
export type Inline = { type: "text"; text: string } | { type: "link"; text: string; href: string } | { type: "strong"; text: string };
export type Block =
  | { type: "h2" | "h3"; text: string; id: string }
  | { type: "p"; inline: Inline[] }
  | { type: "ul" | "ol"; items: Inline[][] };

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ type: "text", text: text.slice(last, m.index) });
    if (m[1]) out.push({ type: "link", text: m[1], href: m[2] });
    else out.push({ type: "strong", text: m[3] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) });
  return out;
}

export function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  const chunks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  for (const raw of chunks) {
    const chunk = raw.trim();
    if (!chunk) continue;
    const lines = chunk.split("\n");
    if (lines.length === 1 && /^###\s+/.test(chunk)) {
      const text = chunk.replace(/^###\s+/, "");
      blocks.push({ type: "h3", text, id: slug(text) });
    } else if (lines.length === 1 && /^##\s+/.test(chunk)) {
      const text = chunk.replace(/^##\s+/, "");
      blocks.push({ type: "h2", text, id: slug(text) });
    } else if (lines.every((l) => /^[-*]\s+/.test(l))) {
      blocks.push({ type: "ul", items: lines.map((l) => parseInline(l.replace(/^[-*]\s+/, ""))) });
    } else if (lines.every((l) => /^\d+[.)]\s+/.test(l))) {
      blocks.push({ type: "ol", items: lines.map((l) => parseInline(l.replace(/^\d+[.)]\s+/, ""))) });
    } else if (/^#{2,3}\s+/.test(lines[0])) {
      const level = lines[0].startsWith("###") ? "h3" : "h2";
      const text = lines[0].replace(/^#{2,3}\s+/, "");
      blocks.push({ type: level, text, id: slug(text) });
      blocks.push({ type: "p", inline: parseInline(lines.slice(1).join(" ")) });
    } else {
      blocks.push({ type: "p", inline: parseInline(lines.join(" ")) });
    }
  }
  return blocks;
}
