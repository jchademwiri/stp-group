# Implementation plan (Astro) — `apps/stp`

Active technical plan for the Sithembe site. Replaces the legacy Next.js structure in `implementation_plan.md`.

## Architecture

```
apps/stp/
├── public/images/plant-hire/     # WebP fleet photos (replace placeholders)
├── src/
│   ├── data/
│   │   ├── plantFleet.ts        # Fleet SSOT (from data-schema.md)
│   │   └── site.ts              # Phone, WhatsApp, hours, region
│   ├── components/
│   │   ├── TrustBadges.astro
│   │   ├── WhatsAppButton.astro
│   │   ├── StickyMobileBar.astro
│   │   ├── FleetCard.astro
│   │   ├── FleetImage.astro
│   │   └── QuoteForm.astro
│   ├── layouts/StpLayout.astro
│   └── pages/
│       ├── index.astro                    # Hub
│       ├── plant-hire/index.astro         # Fleet landing (phase 0+1)
│       ├── plant-hire/[slug].astro        # Equipment detail
│       └── services/grass-cutting.astro   # Grass cutting (phase 2)
```

Shared Tailwind theme: `packages/tailwind/src/styles.css` (charcoal, safety orange).

## Routes (implemented)

| Path | File |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/plant-hire` | `src/pages/plant-hire/index.astro` |
| `/plant-hire/[slug]` | `src/pages/plant-hire/[slug].astro` |
| `/services/grass-cutting` | `src/pages/services/grass-cutting.astro` |

## Forms (Resend)

- **Endpoint**: `POST /api/quote` (`src/pages/api/quote.ts`, `prerender = false`)
- **Email**: [Resend](https://resend.com) via `src/lib/quote.ts` — keys stay server-side
- **Env** (see `apps/stp/.env.example`): `RESEND_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL`
- **Deploy**: `@astrojs/node` adapter — static pages + on-demand `/api/quote` (`prerender = false`)
- **Components**: `QuoteForm.astro` (plant hire), `GrassQuoteForm.astro` (grass cutting)

## Commands

```sh
bun install
bun run dev --filter=stp
bun run build --filter=stp
```

## Post-MVP (not built)

- `GallerySlider.tsx` → Embla carousel on detail pages
- `CostEstimator.tsx` → grass cutting calculator (business-approved rates)
- Per-product JSON-LD (`Product` / `RentAction`)
- Live availability badges from backend/state

## Verification

1. `bun run build --filter=stp` — 10 static routes (hub + landing + 8 slugs + grass cutting)
2. Manual: WhatsApp links, `tel:` links, fleet filters, form validation
3. Lighthouse on `/plant-hire` after real WebP assets are added
