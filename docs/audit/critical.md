# 🔴 Critical Issues

These must be fixed immediately - they pose security risks or cause functional failures.

---

## 1. No CSRF Protection on `/api/quote`

**File:** `apps/stp/src/pages/api/quote.ts`  
**Category:** Security

### Problem

The quote submission endpoint accepts POST requests with no origin or CSRF validation. An attacker can submit arbitrary form data from any domain using `fetch('/api/quote')` from a malicious page. This means:

- Spam submissions can flood your Resend quota
- Abusive content can be sent to your business email
- The honeypot field only catches basic bots, not sophisticated attacks

### Current Code

```ts
export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("content-type")?.includes("application/json") !== true) {
    return json({ error: "Expected application/json" }, 415);
  }
  // ... no origin validation
};
```

### Fix

Add `Origin` / `Referer` header validation:

```ts
export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get("origin");
  const allowed = ["https://sithembe.co.za", "http://localhost:4321"];
  if (!origin || !allowed.some((a) => origin.startsWith(a))) {
    return json({ error: "Forbidden" }, 403);
  }
  // ... rest of handler
};
```

---

## 2. Missing Escape for Single Quotes in Email HTML

**File:** `apps/stp/src/lib/quote.ts`  
**Category:** Security / HTML Injection

### Problem

The `escapeHtml()` function handles `& < > "` but does **not** escape single quotes (`'`). In `buildConfirmationHtml`, user-supplied values like `p.name` are injected into HTML via `escapeHtml()`. While the `row()` function wraps values in `<td>` tags (so single quotes aren't critical there), `buildConfirmationHtml` uses `escapeHtml(p.name)` in a context where attribute injection could occur.

### Current Code

```ts
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  // Missing: .replace(/'/g, "&#39;")
}
```

### Fix

Add single quote escaping:

```ts
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

Or use a battle-tested library like `he`:
```ts
import * as he from "he";
function escapeHtml(s: string): string {
  return he.encode(s);
}
```

---

## 3. `robots.txt` References Wrong Sitemap URL

**File:** `apps/stp/public/robots.txt`  
**Category:** SEO / Functional

### Problem

The `robots.txt` file references `sitemap-index.xml`, but `@astrojs/sitemap` generates `sitemap.xml` by default. The `sitemap-index.xml` is only created when there are multiple sitemaps (e.g., >50,000 URLs). Your site has ~12 pages, so only `sitemap.xml` is generated.

**Result:** Google and other crawlers cannot find your sitemap, which means:
- Pages may be indexed more slowly
- Search engines miss important pages
- You lose the SEO benefits of having a sitemap

### Current Content

```txt
User-agent: *
Allow: /

Sitemap: https://sithembe.co.za/sitemap-index.xml
```

### Fix

```txt
User-agent: *
Allow: /

Sitemap: https://sithembe.co.za/sitemap.xml
```

Or configure `@astrojs/sitemap` in `astro.config.mjs` to generate a sitemap index:

```js
integrations: [sitemap()], // already correct, just fix robots.txt
```
