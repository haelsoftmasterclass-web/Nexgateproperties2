import { NextResponse, type NextRequest } from "next/server";

const API_URL = (process.env.API_URL || "http://localhost:8000").replace(/\/$/, "");
const MAX_BODY_BYTES = 20_000;

/**
 * Forwards enquiry submissions to the Django API server-to-server. The browser never sees the
 * API key, and the visitor's IP is forwarded so Django can rate-limit per visitor.
 */
export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ detail: "Unsupported content type." }, { status: 415 });
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ detail: "Submission is too large." }, { status: 413 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  if (forwardedFor) headers["X-Forwarded-For"] = forwardedFor;
  if (process.env.ENQUIRY_API_KEY) headers["X-Enquiry-Key"] = process.env.ENQUIRY_API_KEY;

  try {
    const res = await fetch(`${API_URL}/api/enquiries/`, {
      method: "POST",
      headers,
      body: raw,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const body = await res.json().catch(() => ({ detail: "Unexpected response from the server." }));
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: "We could not reach our enquiries service. Please try again shortly or contact us by phone." },
      { status: 503 },
    );
  }
}
