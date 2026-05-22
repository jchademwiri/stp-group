# Sithembe (STP) — documentation index

| Document | Purpose |
| --- | --- |
| [prd_plant_hire.md](./prd_plant_hire.md) | Product requirements (MVP vs post-MVP) |
| [copy.md](./copy.md) | UI copy single source of truth |
| [data-schema.md](./data-schema.md) | Fleet data model & 8 inventory items |
| [routes.md](./routes.md) | URLs, navigation, SEO metadata |
| [marketing_recommendations.md](./marketing_recommendations.md) | UX/trust/SEO recommendations by phase |
| [implementation_plan_astro.md](./implementation_plan_astro.md) | **Active** — Astro build plan for `apps/stp` |
| [implementation_plan.md](./implementation_plan.md) | Legacy Next.js plan (reference only) |
| [sites.md](./sites.md) | STP vs LME monorepo mapping |

## Build order

1. `copy.md` + `data-schema.md` — content truth
2. `apps/stp/src/data/plantFleet.ts` — implements schema
3. Plant hire landing → detail pages → grass cutting
4. Add Resend env vars in `apps/stp/.env` (see `.env.example`)
5. Replace placeholder fleet photos in `apps/stp/public/images/plant-hire/`
