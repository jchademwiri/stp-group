# 🟢 Low Priority Issues

Nice-to-haves — fix when you have spare time or during a cleanup pass.

---

## 17. LME and LME Investments Are Empty Shells

**Files:** `apps/lme/`, `apps/lme-investments/`  
**Category:** Code Hygiene

### Problem

Both sites are identical boilerplate with just `index.astro` saying "Edit to get started." They have:
- No shared layout with STP
- No SEO setup (no meta tags, no structured data)
- No site data configuration
- No content

### Recommendation

Either:
1. **Remove them** from the monorepo if not planned
2. **Add a README.md** to each explaining their purpose and planned timeline
3. **Scaffold them properly** with BaseLayout, meta tags, and placeholder content

---

## 18. `FleetImage.astro` Flash of Placeholder

**File:** `apps/stp/src/components/FleetImage.astro`  
**Category:** UX / Performance

### Problem

The placeholder (truck SVG + "Photo coming soon") is always visible underneath the `<img>` until it loads. The `<img>` is `z-10` and covers the placeholder when loaded, but users see a flash of the placeholder before the image appears.

### Recommendation

Add an `onload` fade-in effect:

```astro
<img
  id={imgId}
  data-fleet-img
  src={src}
  alt={alt}
  width={1200}
  height={800}
  loading={priority ? "eager" : "lazy"}
  decoding="async"
  class="relative z-10 h-full w-full object-cover opacity-0 transition-opacity duration-300"
/>
```

```js
document.querySelectorAll("img[data-fleet-img]").forEach((img) => {
  if (!(img instanceof HTMLImageElement)) return;
  if (img.complete && img.naturalHeight === 0) {
    img.remove();
  } else {
    img.addEventListener("load", () => img.classList.add("opacity-100"));
    img.addEventListener("error", () => img.remove());
  }
});
```

---

## 19. `console.error` in Production Code

**Files:** `apps/stp/src/lib/quote.ts`, `apps/stp/src/pages/api/quote.ts`  
**Category:** Code Quality

### Problem

Two `console.error` calls exist in production code:

```ts
// lib/quote.ts
console.error("[quote] confirmation email failed:", err);

// pages/api/quote.ts
console.error("[api/quote]", message);
```

While `console.error` is fine for development, in production you may want:
- Structured logging (JSON format)
- Log levels (error, warn, info)
- Integration with a logging service (e.g., Axiom, Logtail)

### Recommendation

For now, `console.error` is acceptable. If you add a logging service later, replace these calls.

---

## 20. Custom `escapeHtml` Is Minimal

**File:** `apps/stp/src/lib/quote.ts`  
**Category:** Security / Code Quality

### Problem

The `escapeHtml` function handles only 4 characters (`& < > "`). While this covers most XSS vectors in HTML context, it's a custom implementation rather than a battle-tested library.

### Recommendation

Consider using `he` (HTML entity encoder) for production:

```ts
import * as he from "he";

function escapeHtml(s: string): string {
  return he.encode(s);
}
```

The `he` library handles all HTML entities correctly and is well-maintained (used by many popular projects).
