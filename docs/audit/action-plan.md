# 📋 Action Plan

Prioritized roadmap for fixing audit findings. Organized into phases based on impact and effort.

---

## Phase 1: Quick Wins (< 30 minutes)

These are fast fixes with high impact.

| Ref | Issue | File(s) | Effort |
|-----|-------|---------|--------|
| [#3](./critical.md#3-robotstxt-references-wrong-sitemap-url) | Fix `robots.txt` sitemap URL | `public/robots.txt` | 1 min |
| [#2](./critical.md#2-missing-escape-for-single-quotes-in-email-html) | Add single quote to `escapeHtml` | `src/lib/quote.ts` | 2 min |
| [#16](./medium.md#16-html-langen-instead-of-langenz) | Change `lang="en"` to `lang="en-ZA"` | `packages/tailwind/src/layouts/BaseLayout.astro` | 1 min |
| [#11](./medium.md#11-missing-meta-nametheme-color) | Add `<meta name="theme-color">` | `packages/tailwind/src/layouts/BaseLayout.astro` | 2 min |
| [#5](./high.md#5-roletablist-misused-on-fleet-filter-buttons) | Fix `aria-selected` → `aria-pressed` on fleet filters | `src/pages/plant-hire/index.astro` + `src/scripts/fleet-filter.ts` | 5 min |
| [#14](./medium.md#14-lme-investments-not-in-tailwind-content-scan) | Add `lme-investments` to Tailwind content scan | `packages/tailwind/src/styles.css` + `tailwind.config.mjs` | 2 min |
| [#4](./high.md#4-sticky-mobile-bar-occludes-content) | Add `scroll-padding-bottom` for sticky mobile bar | `packages/tailwind/src/styles.css` | 2 min |

---

## Phase 2: Important Fixes (1-2 hours)

These require more thought but significantly improve the site.

| Ref | Issue | File(s) | Effort |
|-----|-------|---------|--------|
| [#1](./critical.md#1-no-csrf-protection-on-apiquote) | Add CSRF protection to `/api/quote` | `src/pages/api/quote.ts` | 15 min |
| [#8](./high.md#8-no-rate-limiting-on-quote-api) | Add rate limiting to `/api/quote` | `src/pages/api/quote.ts` | 20 min |
| [#6](./high.md#6-inconsistent-main-tag-usage) | Add `<main>` consistently (wrap slot in SttpLayout) | `src/layouts/StpLayout.astro` + remove from pages | 10 min |
| [#7](./high.md#7-og-image-defaults-to-non-existent-file) | Create OG image or fix default | `public/` or `BaseLayout.astro` | 15 min |
| [#12](./medium.md#12-no-prefers-reduced-motion-support) | Add `prefers-reduced-motion` support | `packages/tailwind/src/styles.css` | 5 min |
| [#13](./medium.md#13-gallery-images-lack-widthheight-attributes) | Add `width`/`height` to gallery images | `src/pages/plant-hire/[slug].astro` | 5 min |
| [#10](./medium.md#10-testimonials-lack-review-structured-data) | Add Review/AggregateRating schema | `src/components/LocalBusinessSchema.astro` | 20 min |

---

## Phase 3: Polish (2-4 hours)

These improve the user experience and code quality.

| Ref | Issue | File(s) | Effort |
|-----|-------|---------|--------|
| [#9](./medium.md#9-form-validation-uses-native-browser-tooltips) | Custom form validation with inline errors | `QuoteForm.astro`, `GrassQuoteForm.astro`, `form-steps.ts` | 1-2 hrs |
| [#18](./low.md#18-fleetimageastro-flash-of-placeholder) | Fleet image fade-in on load | `FleetImage.astro` | 15 min |
| [#17](./low.md#17-lme-and-lme-investments-are-empty-shells) | Clean up LME placeholder apps | `apps/lme/`, `apps/lme-investments/` | 15 min |
| [#20](./low.md#20-custom-escapehtml-is-minimal) | Replace custom `escapeHtml` with `he` library | `src/lib/quote.ts` | 10 min |

---

## Phase 4: Future Improvements

Not urgent but worth considering.

| Ref | Improvement | Notes |
|-----|-------------|-------|
| [#19](./low.md#19-consoleerror-in-production-code) | Structured logging (replace `console.error`) | Consider Axiom or Logtail |
| [#15](./medium.md#15-hardcoded-geo-coordinates) | Move geo coords to env vars | If multi-location planned |
| - | Add Lighthouse CI to GitHub Actions | Catch regressions automatically |
| - | Add axe-core to test suite | Automated accessibility testing |
| - | Implement Content Security Policy headers | Defense in depth |

---

## Recommended Order

```
Week 1:  Phase 1 (all quick wins) + Phase 2 items #1, #8, #6
Week 2:  Phase 2 remaining + Phase 3 items #9, #18
Week 3+: Phase 3 remaining + Phase 4
```

---

## Testing After Fixes

After implementing changes, verify:

1. **Build passes:** `bun run build` in `apps/stp/`
2. **No TypeScript errors:** `bun run build` catches type issues
3. **Manual testing:** Navigate all pages, test forms, check mobile
4. **Accessibility:** Run Lighthouse accessibility audit (score should be 95+)
5. **SEO:** Validate structured data at [Google Rich Results Test](https://search.google.com/test/rich-results)
6. **Sitemap:** Verify `sitemap.xml` is generated and accessible at `/sitemap.xml`
