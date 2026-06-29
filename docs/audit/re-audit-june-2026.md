# 🔍 STP Site Re-Audit — June 2026

This is a follow-up audit to the original audit found in `docs/audit/`. It evaluates what has been fixed, what remains, and identifies new issues discovered during a fresh codebase review.

---

## Previous Audit: Status Summary

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | No CSRF Protection on `/api/quote` | 🔴 Critical | ✅ **Fixed** — Origin validation with `ALLOWED_ORIGINS` |
| 2 | Missing escape for single quotes in `escapeHtml` | 🔴 Critical | ✅ **Fixed** — `.replace(/'/g, "&#39;")` added |
| 3 | `robots.txt` references wrong sitemap URL | 🔴 Critical | ✅ **Fixed** — Now points to `sitemap.xml` |
| 4 | Sticky mobile bar occludes content | 🟠 High | ✅ **Fixed** — `scroll-pb-16` on body |
| 5 | `role="tablist"` misused on fleet filters | 🟠 High | ✅ **Fixed** — Changed to `role="group"` + `aria-pressed` |
| 6 | Inconsistent `<main>` tag usage | 🟠 High | ✅ **Fixed** — `<main>` wraps slot in `StpLayout.astro` |
| 7 | OG image defaults to non-existent file | 🟠 High | ❌ **Still outstanding** |
| 8 | No rate limiting on quote API | 🟠 High | ✅ **Fixed** — In-memory rate limiter (5 req/min/IP) |
| 9 | Form validation uses native browser tooltips | 🟡 Medium | ✅ **Partially fixed** — Inline validation added alongside native |
| 10 | Testimonials lack review structured data | 🟡 Medium | ❌ **Still outstanding** |
| 11 | No `prefers-reduced-motion` support | 🟡 Medium | ✅ **Fixed** — Added in `styles.css` |
| 12 | Gallery images lack width/height | 🟡 Medium | ✅ **Fixed** — `FleetImage.astro` has width/height |
| 13 | Missing `<meta name="theme-color">` | 🟡 Medium | ✅ **Fixed** — Added to `BaseLayout.astro` |
| 14 | `lang="en"` instead of `lang="en-ZA"` | 🟡 Medium | ✅ **Fixed** |
| 15 | Hardcoded geo coordinates | 🟡 Medium | ⚠️ Still hardcoded (low priority) |
| 16 | FleetImage flash of placeholder | 🟢 Low | ❌ **Still outstanding** |
| 17 | LME placeholder apps are empty shells | 🟢 Low | ❌ **Still outstanding** |
| 18 | `console.error` in production code | 🟢 Low | ❌ **Still outstanding** |

**Score: 12 of 18 issues resolved (67%)**

---

## New Issues Discovered

### 🔴 Critical

*None — all previous critical issues are resolved.*

### 🟠 High Priority

#### H1. WhatsApp tooltip shows wrong response time

**File:** `apps/stp/src/components/WhatsAppButton.astro`  
**Category:** UX / Accuracy

The floating WhatsApp button tooltip reads:
> "Chat with dispatch now (Average response: 5 mins)"

But `SITE.responseTime` is defined as **"within 2 hours during business hours"** in `site.ts`. This misleads users into expecting a 5-minute reply when the actual SLA is 2 hours.

**Fix:** Replace the hardcoded tooltip text with a dynamic value, or update it to match the site-wide response time.

---

#### H2. FAQ sections missing `FAQPage` structured data

**Files:**  
- `apps/stp/src/pages/services/desludging.astro`  
- `apps/stp/src/pages/services/grass-cutting.astro`  
- `apps/stp/src/pages/plant-hire/index.astro`  

**Category:** SEO

All three pages render FAQ accordions using the `Accordion` component, but none include `FAQPage` JSON-LD schema. Google uses FAQ rich results in search snippets — this is a significant missed opportunity for SERP visibility.

**Fix:** Add a `<script type="application/ld+json">` block with `FAQPage` schema to each page that has FAQ sections.

---

#### H3. Breadcrumb schema missing on service and about pages

**Files:**  
- `apps/stp/src/pages/services/desludging.astro`  
- `apps/stp/src/pages/services/grass-cutting.astro`  
- `apps/stp/src/pages/services/index.astro`  
- `apps/stp/src/pages/about.astro`  
- `apps/stp/src/pages/plant-hire/index.astro`  

**Category:** SEO

Only `plant-hire/[slug].astro` includes a `BreadcrumbList` JSON-LD schema. All other pages with visual breadcrumbs (via the `Breadcrumbs` component) lack the corresponding structured data. Google can display breadcrumb trails in search results when the schema is present.

**Fix:** Add `BreadcrumbList` schema to every page that uses the `Breadcrumbs` component, or centralize it in `Breadcrumbs.astro`.

---

#### H4. "Available Now" badge is hardcoded on all fleet cards

**Files:**  
- `apps/stp/src/components/FleetCard.astro`  
- `apps/stp/src/pages/plant-hire/[slug].astro`  

**Category:** UX / Accuracy

Every fleet card and detail page displays a green "Available Now" badge, but the `FleetItem` type has an `availability` field (`"available" | "booked" | "maintenance"`) that is never used in the UI. This misleads users when equipment is actually booked or in maintenance.

**Fix:** Conditionally render the badge based on `item.availability`:

```astro
{item.availability === "available" && (
  <span class="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-300">
    Available Now
  </span>
)}
{item.availability === "booked" && (
  <span class="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-300">
    Currently Booked
  </span>
)}
{item.availability === "maintenance" && (
  <span class="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-300">
    In Maintenance
  </span>
)}
```

---

### 🟡 Medium Priority

#### M1. No Organization schema on homepage

**File:** `apps/stp/src/pages/index.astro`  
**Category:** SEO

The homepage relies on the `LocalBusiness` schema injected via `StpLayout.astro`, but there is no `Organization` schema with social profile links, founding date, or logo. Adding this improves Knowledge Panel eligibility in Google.

---

#### M2. LocalBusiness schema lacks `sameAs` for social profiles

**File:** `apps/stp/src/components/LocalBusinessSchema.astro`  
**Category:** SEO

The schema includes geo coordinates, opening hours, and contact info, but no `sameAs` array linking to social media profiles (Facebook, LinkedIn, etc.). This weakens the Knowledge Graph connection.

---

#### M3. Gallery images in `[slug].astro` lack width/height

**File:** `apps/stp/src/pages/plant-hire/[slug].astro`  
**Category:** Performance / CLS

The gallery thumbnail images use `<img>` without `width` and `height` attributes:

```astro
<img src={src} alt={imageAlt(item.title)} class="rounded-lg object-cover" />
```

This causes layout shift (CLS) as images load. The `FleetImage` component has width/height, but the gallery grid does not.

**Fix:** Add explicit dimensions:
```astro
<img src={src} alt={imageAlt(item.title)} width={400} height={300} class="rounded-lg object-cover" loading="lazy" />
```

---

#### M4. Duplicated submit button spinner HTML across all forms

**Files:**  
- `apps/stp/src/components/QuoteForm.astro`  
- `apps/stp/src/components/GrassQuoteForm.astro`  
- `apps/stp/src/components/DesludgeQuoteForm.astro`  

**Category:** Code Quality / Maintainability

All three form components contain identical copy-pasted spinner SVG HTML in their submit handlers. This should be extracted into a shared utility function (e.g., in `form-utils.ts` or `submit-quote.ts`).

---

#### M5. Variable shadowing in `form-steps.ts`

**File:** `apps/stp/src/scripts/form-steps.ts`  
**Category:** Code Quality

The `showStep` function declares `const n = Number(p.dataset.stepPanel)` inside a `forEach` callback, which shadows the outer parameter `n: number`. While this works due to closure scoping, it's confusing and a linting hazard.

```ts
// Current (shadows parameter)
const showStep = (n: number) => {
  panels.forEach((p) => {
    const n = Number(p.dataset.stepPanel); // ← shadows outer n
    p.hidden = n !== step;
  });
};

// Fix: rename inner variable
const showStep = (target: number) => {
  panels.forEach((p) => {
    const panelNum = Number(p.dataset.stepPanel);
    p.hidden = panelNum !== target;
  });
};
```

---

#### M6. No privacy policy / POPIA page

**Category:** Legal / Compliance

All three quote forms include the text:
> "By submitting, you agree we may contact you about this inquiry. We process data in line with POPIA."

But there is no privacy policy page linked from this text or elsewhere on the site. Under South Africa's Protection of Personal Information Act (POPIA), organizations processing personal data must provide a privacy notice.

**Fix:** Create `/privacy` with a POPIA-compliant privacy notice and link to it from the form footers.

---

#### M7. `fetchpriority="high"` missing on LCP images

**File:** `apps/stp/src/components/FleetImage.astro`  
**Category:** Performance

The `priority` prop controls `loading="eager"` vs `loading="lazy"`, but doesn't set `fetchpriority="high"` on priority images. This attribute tells the browser to prioritize the image download for LCP.

**Fix:** Add `fetchpriority="high"` when `priority` is true:
```astro
<img
  ...
  loading={priority ? "eager" : "lazy"}
  fetchpriority={priority ? "high" : undefined}
  ...
/>
```

---

### 🟢 Low Priority

#### L1. Google Fonts loaded via external `<link>` tag

**File:** `packages/tailwind/src/layouts/BaseLayout.astro`  
**Category:** Performance / Privacy

Google Fonts are loaded from `fonts.googleapis.com` with `<link rel="preconnect">`. This introduces a third-party dependency, adds DNS lookups, and can cause FOUT. Self-hosting fonts (via `@fontsource/inter` or downloading the files) would improve performance and privacy.

---

#### L2. FleetImage script runs on every page

**File:** `apps/stp/src/components/FleetImage.astro`  
**Category:** Performance

The inline `<script>` in `FleetImage.astro` runs `document.querySelectorAll("img[data-fleet-img]")` on every page load, even pages without fleet images (about, services, etc.). While harmless, it adds unnecessary JavaScript execution.

**Fix:** Guard with a length check or move to the fleet pages only.

---

#### L3. `console.error` calls in production code

**Files:**  
- `apps/stp/src/lib/quote.ts` (line 119)  
- `apps/stp/src/pages/api/quote.ts` (line 67)  

**Category:** Code Quality

Two `console.error` calls exist for error logging. In production, these should use structured logging (e.g., Axiom, Logtail, or a simple file logger) instead of raw console output.

---

#### L4. `lme-investments` not in Tailwind v4 content scan

**File:** `packages/tailwind/src/styles.css`  
**Category:** Build

The `@source` directive scans `apps/stp` and `apps/lme` but not `apps/lme-investments`. If that app is ever developed, its classes won't be picked up. This is a minor issue since the app is currently empty.

---

## Summary

| Category | Fixed | Outstanding | New |
|----------|-------|-------------|-----|
| 🔴 Critical | 3 | 0 | 0 |
| 🟠 High | 4 | 1 | 4 |
| 🟡 Medium | 5 | 1 | 7 |
| 🟢 Low | 0 | 3 | 4 |
| **Total** | **12** | **5** | **15** |

The site has made strong progress on security and accessibility basics. The remaining gaps are primarily **SEO structured data** (FAQ schema, breadcrumb schema, Organization schema) and **accuracy issues** (WhatsApp response time mismatch, hardcoded "Available Now" badge). The POPIA privacy page is a legal compliance gap that should be addressed before any marketing push.
