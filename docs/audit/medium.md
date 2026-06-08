# 🟡 Medium Priority Issues

Fix these soon - they improve polish, accessibility, and SEO.

---

## 9. Form Validation Uses Native Browser Tooltips

**Files:** `apps/stp/src/components/QuoteForm.astro`, `GrassQuoteForm.astro`  
**Category:** UX / Accessibility

### Problem

Both quote forms use native browser validation (`required` + `checkValidity()`). On Safari/mobile, these show ugly default tooltip popups that don't match the site's dark theme. They also don't provide structured error information for screen readers.

### Current Behavior

- Native browser popup appears on invalid field
- No inline error messages
- No `aria-invalid` or `aria-describedby` on invalid fields

### Fix

Add `novalidate` to the `<form>` and implement custom inline validation:

```astro
<form id="hire-quote-form" class="mt-6" novalidate>
  <label class="flex flex-col gap-1.5 text-sm">
    <span class="font-medium text-neutral-200">Your Full Name *</span>
    <input
      type="text" name="name" required autocomplete="name"
      aria-describedby="name-error"
      class="rounded-lg border border-white/15 bg-charcoal px-4 py-2.5 text-white"
    />
    <span id="name-error" class="hidden text-xs text-red-400" role="alert"></span>
  </label>
</form>
```

Then in the form-steps validation:

```ts
const validateStep = (n: number): boolean => {
  let valid = true;
  const fields = panel.querySelectorAll("input, select, textarea");
  for (const field of fields) {
    const errorEl = document.getElementById(`${field.name}-error`);
    if (!field.checkValidity()) {
      field.setAttribute("aria-invalid", "true");
      if (errorEl) {
        errorEl.textContent = field.validationMessage;
        errorEl.classList.remove("hidden");
      }
      valid = false;
    } else {
      field.removeAttribute("aria-invalid");
      errorEl?.classList.add("hidden");
    }
  }
  return valid;
};
```

---

## 10. Testimonials Lack Review Structured Data

**File:** `apps/stp/src/components/Testimonials.astro`  
**Category:** SEO

### Problem

The testimonials section uses `<blockquote>` elements but has no `Review` or `AggregateRating` schema. Adding these could enable rich snippets (star ratings) in Google search results, improving click-through rates.

### Current Code

```astro
<blockquote class="rounded-xl border border-white/10 bg-charcoal/60 p-6">
  <p class="text-sm leading-relaxed text-neutral-300">&ldquo;{t.quote}&rdquo;</p>
  <footer class="mt-4 text-xs font-medium text-neutral-500">- {t.author}</footer>
</blockquote>
```

### Fix

Add `Review` schema in `LocalBusinessSchema.astro` or a new component:

```ts
const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.legalName,
  review: testimonials.map((t) => ({
    "@type": "Review",
    reviewBody: t.quote,
    author: { "@type": "Person", name: t.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: String(testimonials.length),
    bestRating: "5",
  },
};
```

---

## 11. Missing `<meta name="theme-color">`

**File:** `packages/tailwind/src/layouts/BaseLayout.astro`  
**Category:** UX / Mobile

### Problem

No `theme-color` meta tag is set. Mobile browsers (Chrome Android, Safari) use this to color the address bar and status bar. Without it, the default gray/white is shown, which mismatches the dark charcoal theme.

### Fix

Add inside `<head>`:

```html
<meta name="theme-color" content="#1e1e24" />
```

Or make it conditional for dark/light mode:

```html
<meta name="theme-color" content="#1e1e24" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
```

---

## 12. No `prefers-reduced-motion` Support

**File:** `packages/tailwind/src/styles.css` (or `theme.css`)  
**Category:** Accessibility

### Problem

No `@media (prefers-reduced-motion: reduce)` rule exists anywhere. The site has several animations and transitions:

- Fleet cards: `hover:-translate-y-1` with `transition-all duration-200`
- WhatsApp button: `hover:scale-105`
- Various `transition-colors` on links

Users with vestibular disorders or motion sensitivity may experience discomfort.

### Fix

Add a global reduced-motion rule in `packages/tailwind/src/styles.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 13. Gallery Images Lack `width`/`height` Attributes

**File:** `apps/stp/src/pages/plant-hire/[slug].astro`  
**Category:** Performance / CLS

### Problem

Gallery images are plain `<img>` tags without explicit `width`/`height`:

```astro
<img src={src} alt={imageAlt(item.title)} class="rounded-lg object-cover" />
```

This causes Cumulative Layout Shift (CLS) as images load and push content around.

### Fix

Add dimensions or use Astro's `<Image />` component:

```astro
<img
  src={src}
  alt={imageAlt(item.title)}
  width={400}
  height={300}
  loading="lazy"
  decoding="async"
  class="rounded-lg object-cover"
/>
```

Or better, use the Astro `<Image />` component for automatic optimization:

```astro
import { Image } from "astro:assets";
<Image src={src} alt={imageAlt(item.title)} width={400} height={300} />
```

---

## 14. `lme-investments` Not in Tailwind Content Scan

**Files:** `packages/tailwind/src/styles.css`, `packages/tailwind/tailwind.config.mjs`  
**Category:** Configuration

### Problem

The Tailwind content scan paths include `apps/stp` and `apps/lme` but not `apps/lme-investments`. If LME Investments adds custom Tailwind classes, they won't be detected and will be stripped from the output.

### Current `styles.css`

```css
@source "../../../apps/stp/src/**/*.{astro,html,js,ts}";
@source "../../../apps/lme/src/**/*.{astro,html,js,ts}";
```

### Fix

Add the missing path:

```css
@source "../../../apps/stp/src/**/*.{astro,html,js,ts}";
@source "../../../apps/lme/src/**/*.{astro,html,js,ts}";
@source "../../../apps/lme-investments/src/**/*.{astro,html,js,ts}";
```

And update `tailwind.config.mjs`:

```js
content: [
  "./src/**/*.{astro,html,js,ts}",
  "../../apps/stp/src/**/*.{astro,html,js,ts}",
  "../../apps/lme/src/**/*.{astro,html,js,ts}",
  "../../apps/lme-investments/src/**/*.{astro,html,js,ts}",
],
```

---

## 15. Hardcoded Geo Coordinates

**File:** `apps/stp/src/data/site.ts`  
**Category:** Maintainability

### Problem

Geo coordinates are hardcoded in the source code:

```ts
geo: {
  latitude: -25.7479,
  longitude: 28.2293,
},
```

If the business moves or opens a second location, this requires a code change and redeployment.

### Recommendation

Consider:
1. Moving to environment variables: `import.meta.env.SITE_LATITUDE`
2. Or keeping as-is if this is a single-location business (acceptable)

This is low priority since business relocations are rare.

---

## 16. `<html lang="en">` Instead of `lang="en-ZA"`

**File:** `packages/tailwind/src/layouts/BaseLayout.astro`  
**Category:** Accessibility

### Problem

The HTML lang attribute is set to `en` (generic English), but the business is South African. Screen readers use this to determine pronunciation rules for:

- Phone numbers (e.g., "012 880 3155" read differently in en-ZA vs en-US)
- Currency (ZAR)
- Dates and times
- Address formats

### Fix

```html
<html lang="en-ZA">
```

This is especially important for the contact details in the footer and throughout the site.
