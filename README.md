# STP Group

Turborepo monorepo with two [Astro v6](https://astro.build) sites.

| App | Path | Dev URL |
| --- | --- | --- |
| STP | `apps/stp` | http://localhost:4321 |
| LME | `apps/lme` | http://localhost:4322 |

Requires Node 22.12+.

## Commands

```sh
bun install
bun run dev          # both sites
bun run dev:stp      # STP only
bun run dev:lme      # LME only
bun run build
```
