import type { APIRoute } from "astro";
import { parseQuotePayload, sendQuoteEmail } from "@/lib/quote";

export const prerender = false;

/** Simple in-memory rate limiter (per-process). */
const hits = new Map<string, number[]>();
const RATE_WINDOW = 60_000; // 1 minute
const RATE_MAX = 5; // 5 requests per minute per IP

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW);
  timestamps.push(now);
  hits.set(key, timestamps);
  // Prune stale entries when map grows large
  if (hits.size > 10_000) {
    for (const [k, ts] of hits) {
      if (ts.every((t) => now - t > RATE_WINDOW)) hits.delete(k);
    }
  }
  return timestamps.length > RATE_MAX;
}

const ALLOWED_ORIGINS = ["https://sithembe.co.za", "http://localhost:4321"];

export const POST: APIRoute = async ({ request }) => {
  // --- Origin / CSRF check ---
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.some((a) => origin.startsWith(a))) {
    return json({ error: "Forbidden" }, 403);
  }

  // --- Content-type check ---
  if (request.headers.get("content-type")?.includes("application/json") !== true) {
    return json({ error: "Expected application/json" }, 415);
  }

  // --- Rate limit ---
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? origin;
  if (isRateLimited(ip)) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const payload = parseQuotePayload(body);
  if (!payload) {
    return json({ error: "Missing or invalid fields" }, 400);
  }

  // Honeypot — pretend success for bots
  if (payload.website) {
    return json({ success: true, id: "ok" });
  }

  try {
    const { id } = await sendQuoteEmail(payload);
    return json({ success: true, id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    console.error("[api/quote]", message);
    const status = message.includes("not configured") ? 503 : 500;
    return json({ error: "Unable to send inquiry. Please call or WhatsApp us." }, status);
  }
};

function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
