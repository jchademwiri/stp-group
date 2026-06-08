# Website Audit Report

**Date:** June 8, 2026  
**Scope:** All sites in the STP Group monorepo  
**Primary focus:** STP (Sithembe Plant Hire) - `apps/stp/`

---

## Sites Audited

| Site | Status | Notes |
|------|--------|-------|
| **STP (Sithembe)** | Production-ready | Full Astro 6 site with SSR, Tailwind v4, Resend email |
| **LME** | Placeholder | Empty shell - only a default `index.astro` |
| **LME Investments** | Placeholder | Empty shell - only a default `index.astro` |

The LME and LME Investments sites are identical boilerplate with no real content. The audit focuses entirely on **STP**.

---

## Audit Dimensions

| Category | File | Issues Found |
|----------|------|-------------|
| 🔴 **Critical** | [critical.md](./critical.md) | 3 |
| 🟠 **High** | [high.md](./high.md) | 5 |
| 🟡 **Medium** | [medium.md](./medium.md) | 8 |
| 🟢 **Low** | [low.md](./low.md) | 4 |
| ✅ **Positives** | [whats-working.md](./whats-working.md) | 10 strengths |
| 📋 **Action Plan** | [action-plan.md](./action-plan.md) | Prioritized fix roadmap |

**Total issues: 20** (3 critical, 5 high, 8 medium, 4 low)

---

## Tech Stack

- **Framework:** Astro 6 (SSR with Node adapter)
- **Styling:** Tailwind CSS v4 (shared `@repo/tailwind` package)
- **Email:** Resend API
- **Sitemap:** `@astrojs/sitemap`
- **Deployment:** Standalone Node server

---

## Quick Links

- [Critical Issues →](./critical.md) - Fix immediately
- [High Issues →](./high.md) - Fix before next deploy
- [Medium Issues →](./medium.md) - Fix soon
- [Low Issues →](./low.md) - Nice to have
- [What's Working →](./whats-working.md) - Don't break these
- [Action Plan →](./action-plan.md) - Prioritized roadmap
