# STP Group

Turborepo monorepo with two [Astro v6](https://astro.build) sites.

| App | Path | Dev URL |
| --- | --- | --- |
| STP (Sithembe) | `apps/stp` | http://localhost:4321 |
| LME | `apps/lme` | http://localhost:4322 |

STP routes: `/`, `/plant-hire`, `/plant-hire/[slug]`, `/services/grass-cutting`. See [docs/](./docs/).

Requires Node 22.12+.

### Shared packages

- `@repo/tailwind` — Tailwind CSS v4 (Vite plugin), global styles, and `BaseLayout.astro`

## Commands

```sh
bun install
bun run dev          # both sites
bun run dev:stp      # STP only
bun run dev:lme      # LME only
bun run build
```
