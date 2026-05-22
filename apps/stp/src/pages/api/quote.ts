import type { APIRoute } from "astro";
import { parseQuotePayload, sendQuoteEmail } from "@/lib/quote";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("content-type")?.includes("application/json") !== true) {
    return json({ error: "Expected application/json" }, 415);
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
