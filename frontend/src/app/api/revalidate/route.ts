import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";

const ALLOWED = /^(properties|projects|articles|faqs|legal|services|markets|site-settings|redirects|(property|project|article):[a-z0-9-]+)$/;

/** Called by Django when content is saved, so published changes appear without waiting for the cache to expire. */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const supplied = request.headers.get("x-revalidate-secret") || "";
  if (!secret || supplied.length !== secret.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(secret))) {
    return NextResponse.json({ detail: "Unauthorised." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags) ? body.tags.filter((t): t is string => typeof t === "string" && ALLOWED.test(t)) : [];
  for (const tag of tags) revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: tags });
}
