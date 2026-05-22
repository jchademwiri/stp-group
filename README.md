# STP Group

Turborepo monorepo with two [Astro v6](https://astro.build) sites.

| App | Path | Dev URL |
| --- | --- | --- |
| STP (Sithembe) | `apps/stp` | http://localhost:4321 |
| LME | `apps/lme` | http://localhost:4322 |

STP routes: `/`, `/plant-hire`, `/plant-hire/[slug]`, `/services/grass-cutting`. See [docs/](./docs/).

Requires Node 22.12+.

### Shared packages

- `@repo/tailwind` — see [packages/tailwind/README.md](./packages/tailwind/README.md)
  - **Config:** `packages/tailwind/src/theme.css` (design tokens)
  - **Styles:** `packages/tailwind/src/styles.css`
  - **Layout:** `packages/tailwind/src/layouts/BaseLayout.astro`

## Commands

```sh
bun install
bun run dev          # both sites
bun run dev:stp      # STP only
bun run dev:lme      # LME only
bun run build
```
