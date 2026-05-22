import { Resend } from "resend";
import { SITE } from "@/data/site";

export type QuoteType = "plant-hire" | "grass-cutting";

export interface QuotePayload {
  type: QuoteType;
  name: string;
  email: string;
  phone: string;
  location?: string;
  equipment?: string;
  duration?: string;
  startDate?: string;
  message?: string;
  area?: string;
  frequency?: string;
  /** Honeypot — must be empty */
  website?: string;
}

export function parseQuotePayload(body: unknown): QuotePayload | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const type = o.type === "grass-cutting" ? "grass-cutting" : o.type === "plant-hire" ? "plant-hire" : null;
  if (!type) return null;

  const name = trim(o.name);
  const email = trim(o.email);
  const phone = trim(o.phone);
  if (!name || !email || !phone) return null;
  if (!isValidEmail(email)) return null;

  const base: QuotePayload = {
    type,
    name,
    email,
    phone,
    location: trim(o.location) || undefined,
    message: trim(o.message) || undefined,
    website: trim(o.website) || undefined,
  };

  if (type === "plant-hire") {
    const equipment = trim(o.equipment);
    const duration = trim(o.duration);
    const location = trim(o.location);
    if (!equipment || !duration || !location) return null;
    return {
      ...base,
      equipment,
      duration,
      location,
      startDate: trim(o.startDate) || undefined,
    };
  }

  return {
    ...base,
    area: trim(o.area) || undefined,
    frequency: trim(o.frequency) || undefined,
  };
}

export async function sendQuoteEmail(payload: QuotePayload): Promise<{ id: string }> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.QUOTE_TO_EMAIL ?? SITE.email;
  const from = import.meta.env.QUOTE_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Email service is not configured");
  }

  const resend = new Resend(apiKey);
  const subject =
    payload.type === "plant-hire"
      ? `Plant hire inquiry — ${payload.equipment}`
      : "Grass cutting / plot clearing inquiry";

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: payload.email,
    subject,
    html: buildQuoteHtml(payload),
    text: buildQuoteText(payload),
  });

  if (error) throw new Error(error.message);
  if (!data?.id) throw new Error("Failed to send email");

  try {
    await resend.emails.send({
      from,
      to: [payload.email],
      subject: "We received your inquiry — Sithembe",
      html: buildConfirmationHtml(payload),
      text: buildConfirmationText(payload),
    });
  } catch (err) {
    console.error("[quote] confirmation email failed:", err);
  }

  return { id: data.id };
}

function buildConfirmationText(p: QuotePayload): string {
  return `Hi ${p.name},\n\nThank you for contacting Sithembe. We have received your inquiry and will respond ${SITE.responseTime}.\n\n--- Your submission ---\n${buildQuoteText(p)}\n\nSithembe Plant Hire\n${SITE.phone}`;
}

function buildConfirmationHtml(p: QuotePayload): string {
  return `
    <p>Hi ${escapeHtml(p.name)},</p>
    <p>Thank you for contacting <strong>Sithembe</strong>. We have received your inquiry and will respond ${SITE.responseTime}.</p>
    <h3>Your submission</h3>
    ${buildQuoteHtml(p)}
    <p style="margin-top:24px;color:#666;font-size:14px">Sithembe Plant Hire · ${SITE.phone}</p>
  `.trim();
}

function buildQuoteText(p: QuotePayload): string {
  const lines = [
    `Type: ${p.type}`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone}`,
  ];

  if (p.type === "plant-hire") {
    lines.push(
      `Equipment: ${p.equipment}`,
      `Duration: ${p.duration}`,
      `Start date: ${p.startDate ?? "Not specified"}`,
      `Location: ${p.location}`,
    );
  } else {
    lines.push(`Area: ${p.area ?? "Not specified"}`, `Frequency: ${p.frequency ?? "Not specified"}`);
  }

  if (p.message) lines.push(`Message: ${p.message}`);
  return lines.join("\n");
}

function buildQuoteHtml(p: QuotePayload): string {
  const rows =
    p.type === "plant-hire"
      ? [
          row("Equipment", p.equipment),
          row("Duration", p.duration),
          row("Start date", p.startDate ?? "Not specified"),
          row("Location", p.location),
        ]
      : [row("Estimated area", p.area), row("Frequency", p.frequency)];

  return `
    <h2>${p.type === "plant-hire" ? "Plant hire inquiry" : "Grass cutting inquiry"}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      ${row("Name", p.name)}
      ${row("Email", p.email)}
      ${row("Phone", p.phone)}
      ${rows.join("")}
      ${p.message ? row("Message", p.message) : ""}
    </table>
  `.trim();
}

function row(label: string, value?: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;font-weight:600">${label}</td><td style="padding:6px 0">${escapeHtml(value ?? "")}</td></tr>`;
}

function trim(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
