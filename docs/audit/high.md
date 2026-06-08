# 🟠 High Priority Issues

Fix these before the next deployment - they significantly impact user experience or accessibility.

---

## 4. Sticky Mobile Bar Occludes Content

**File:** `apps/stp/src/components/StickyMobileBar.astro` + `apps/stp/src/layouts/StpLayout.astro`  
**Category:** UX / Accessibility

### Problem

The sticky mobile bar (`fixed inset-x-0 bottom-0`) covers the bottom ~50px of every page on mobile. The footer only has `pb-24 md:pb-10`, but this only affects the footer section - any content above it (form submit buttons, FAQ answers, map links) can be permanently hidden behind the bar.

### Impact

- Users on mobile cannot reach content near the bottom of any section
- Form submit buttons may be unreachable
- FAQ answers near page bottom are cut off

### Fix

Add scroll padding to the document so anchor links and content clear the bar:

```css
/* In BaseLayout.astro or theme.css */
html {
  scroll-padding-bottom: 60px;
}
```

Or in `BaseLayout.astro`:
```html
<body class:list={["min-h-screen font-sans antialiased scroll-pb-16", bodyClass]}>
```

---

## 5. `role="tablist"` Misused on Fleet Filter Buttons

**File:** `apps/stp/src/pages/plant-hire/index.astro`  
**Category:** Accessibility / ARIA

### Problem

The fleet category filter buttons use `role="tablist"` with `aria-selected`, but these aren't tabs - they're toggle filters. The tablist pattern implies:

- Tabpanel semantics (which don't exist here)
- Arrow-key navigation between tabs (not implemented)
- `aria-controls` pointing to managed panels (missing)

Screen readers announce "tab list, 5 tabs" which is misleading.

### Current Code

```html
<div class="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Fleet categories">
  {FLEET_CATEGORIES.map((cat, i) => (
    <button type="button" data-filter={cat.id}
      aria-selected={i === 0 ? "true" : "false"}
      class:list={[...]}
    >
      {cat.label} ({counts[cat.id]})
    </button>
  ))}
</div>
```

### Fix

Use `aria-pressed` on plain buttons (or `role="group"` with a label):

```html
<div class="mt-6 flex flex-wrap gap-2" role="group" aria-label="Fleet categories">
  {FLEET_CATEGORIES.map((cat, i) => (
    <button type="button" data-filter={cat.id}
      aria-pressed={i === 0 ? "true" : "false"}
      class:list={[...]}
    >
      {cat.label} ({counts[cat.id]})
    </button>
  ))}
</div>
```

Also update `fleet-filter.ts` to set `aria-pressed` instead of `aria-selected`:

```ts
b.setAttribute("aria-pressed", isActive ? "true" : "false");
```

---

## 6. Inconsistent `<main>` Tag Usage

**Files:** Multiple pages  
**Category:** Accessibility / Semantics

### Problem

Some pages include `<main>`, others don't:

| Page | Has `<main>`? |
|------|--------------|
| `index.astro` (home) | ✅ Yes |
| `plant-hire/index.astro` | ❌ No |
| `plant-hire/[slug].astro` | ✅ Yes |
| `services/grass-cutting.astro` | ❌ No |

Screen readers use `<main>` to identify the primary content area. Without it, users can't skip to main content via landmarks.

### Fix

**Option A (recommended):** Add `<main>` to `StpLayout.astro` around the slot:

```astro
<BaseLayout {title} {description} ...>
  <header>...</header>
  <main>
    <slot />
  </main>
  <footer>...</footer>
</BaseLayout>
```

Then remove `<main>` from individual pages to avoid nesting.

**Option B:** Add `<main>` to every page that's missing it.

---

## 7. OG Image Defaults to Non-Existent File

**File:** `packages/tailwind/src/layouts/BaseLayout.astro`  
**Category:** SEO / Social Sharing

### Problem

The `ogImage` prop defaults to `/og-image.svg`, but no such file exists in `apps/stp/public/`. When pages don't explicitly pass an `ogImage` prop, social shares (Facebook, Twitter, LinkedIn) will show a broken image.

### Impact

- Social media shares look unprofessional
- Reduced click-through rates from social platforms

### Fix

Either:
1. **Create** `apps/stp/public/og-image.svg` (1200×630px recommended)
2. **Change the default** to an existing image:
   ```astro
   const { ogImage = "/images/og-default.png" } = Astro.props;
   ```
3. **Remove the default** and require every page to pass an OG image

---

## 8. No Rate Limiting on Quote API

**File:** `apps/stp/src/pages/api/quote.ts`  
**Category:** Security / Reliability

### Problem

The `/api/quote` endpoint has no rate limiting. A bot could:
- Spam hundreds of email submissions
- Exhaust your Resend free tier (100 emails/day)
- Flood your inbox with garbage

### Fix

Add basic in-memory rate limiting (or use a service like Upstash):

```ts
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const max = 5; // 5 requests per minute
  const timestamps = (submissions.get(ip) ?? []).filter((t) => now - t < window);
  timestamps.push(now);
  submissions.set(ip, timestamps);
  return timestamps.length > max;
}

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }
  // ... rest of handler
};
```

For production, consider Upstash Redis + `@upstash/ratelimit` for distributed rate limiting.

---


