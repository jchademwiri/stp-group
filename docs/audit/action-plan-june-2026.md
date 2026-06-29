# 📋 Updated Action Plan — June 2026

Prioritized roadmap based on the re-audit. Builds on the original action plan; items marked ✅ are already resolved.

---

## Phase 1: Quick Wins (< 30 minutes)

| Ref | Issue | File(s) | Effort |
|-----|-------|---------|--------|
| H1 | Fix WhatsApp tooltip response time | `WhatsAppButton.astro` | 2 min |
| M3 | Add `width`/`height` to gallery images | `plant-hire/[slug].astro` | 2 min |
| M5 | Fix variable shadowing in `form-steps.ts` | `scripts/form-steps.ts` | 2 min |
| L2 | Guard FleetImage script with length check | `FleetImage.astro` | 1 min |

---

## Phase 2: SEO Structured Data (1-2 hours)

These deliver the highest ROI for search visibility.

| Ref | Issue | File(s) | Effort |
|-----|-------|---------|--------|
| H2 | Add `FAQPage` schema to desludging page | `services/desludging.astro` | 20 min |
| H2 | Add `FAQPage` schema to grass-cutting page | `services/grass-cutting.astro` | 15 min |
| H2 | Add `FAQPage` schema to plant-hire page | `plant-hire/index.astro` | 15 min |
| H3 | Add `BreadcrumbList` schema to service pages | `services/*.astro`, `about.astro`, `plant-hire/index.astro` | 20 min |
| M1 | Add `Organization` schema to homepage | `pages/index.astro` | 15 min |
| M2 | Add `sameAs` social links to LocalBusiness schema | `LocalBusinessSchema.astro` | 5 min |

**Tip:** Consider creating a shared `BreadcrumbSchema.astro` component or a utility function to generate breadcrumb JSON-LD from the `crumbs` prop, so every page gets schema automatically.

---

## Phase 3: UX & Accuracy Fixes (1 hour)

| Ref | Issue | File(s) | Effort |
|-----|-------|---------|--------|
| H4 | Conditionally render availability badge | `FleetCard.astro`, `[slug].astro` | 10 min |
| M6 | Create `/privacy` POPIA page | `pages/privacy.astro` + link from forms | 30 min |
| M7 | Add `fetchpriority="high"` to priority images | `FleetImage.astro` | 5 min |

---

## Phase 4: Code Quality (1 hour)

| Ref | Issue | File(s) | Effort |
|-----|-------|---------|--------|
| M4 | Extract duplicated spinner HTML to shared utility | `form-utils.ts` or `submit-quote.ts` + all 3 form components | 30 min |
| L3 | Replace `console.error` with structured logging | `lib/quote.ts`, `api/quote.ts` | 15 min |
| L4 | Add `lme-investments` to Tailwind source scan | `packages/tailwind/src/styles.css` | 1 min |

---

## Phase 5: Polish & Future (2-4 hours)

| Ref | Issue | Notes |
|-----|-------|-------|
| L1 | Self-host Google Fonts | Use `@fontsource/inter` for better performance and privacy |
| — | Create OG image | 1200×630px SVG/PNG for social sharing |
| — | Add Lighthouse CI to GitHub Actions | Catch regressions automatically |
| — | Add axe-core to test suite | Automated accessibility testing |
| — | Implement Content Security Policy headers | Defense in depth |

---

## Recommended Order

```
Week 1:  Phase 1 (all quick wins) + Phase 2 (all SEO structured data)
Week 2:  Phase 3 (UX fixes) + Phase 4 (code quality)
Week 3+: Phase 5 (polish)
```

---

## Verification After Each Phase

1. **Build passes:** `bun run build` in `apps/stp/`
2. **Validate structured data:** [Google Rich Results Test](https://search.google.com/test/rich-results)
3. **Manual testing:** Navigate all pages, test forms, check mobile
4. **Accessibility:** Run Lighthouse accessibility audit (target 95+)
5. **SEO:** Verify sitemap at `/sitemap.xml`, check robots.txt
