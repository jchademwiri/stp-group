/**
 * Shared client-side handler for /api/quote (Resend).
 */
export async function submitQuote(
  payload: Record<string, string | undefined>,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as { success?: boolean; error?: string };

    if (res.ok && data.success) {
      return { ok: true };
    }

    return {
      ok: false,
      message: data.error ?? "Something went wrong. Please call or WhatsApp us directly.",
    };
  } catch {
    return {
      ok: false,
      message: "Network error. Please call or WhatsApp us directly.",
    };
  }
}

export function setFormStatus(
  el: HTMLElement | null,
  message: string,
  variant: "success" | "error" | "pending",
): void {
  if (!el) return;
  el.classList.remove("hidden", "text-green-300", "text-red-300", "text-neutral-400");
  el.textContent = message;
  if (variant === "success") el.classList.add("text-green-300");
  else if (variant === "error") el.classList.add("text-red-300");
  else el.classList.add("text-neutral-400");
}
