# STP Landing Page — Implementation Plan

> Status: **Planned** — ready for implementation

## Goal

Reframe the STP homepage as a **capability showcase** — credibility first, then proof, then soft contact. No aggressive "Call now" buttons. Marketing tone, not selling tone.

## Page Structure

### Section 1 — Hero
**Purpose:** Immediate credibility + who we are

| Element | Content |
|---|---|
| Section label | `Municipal Contractor — Gauteng` |
| H1 | `Municipal contracts. Reliable delivery.` |
| Sub-text | CIDB grades 6CE, 6EP, 6SH, 5GB, 4SK — one paragraph listing what we do |
| Primary CTA | `View our services` → `/services` |
| Secondary CTA | `See our projects` → `/projects` |
| Tertiary CTA | `WhatsApp us` (outlined, whatsapp-green) |
| Trust badges | CIDB 6CE, 6EP, 6SH, 5GB, 4SK, COIDA, Public Liability |

**Data source:** `SITE` (description, region), `TrustBadges.astro`

---

### Section 2 — What We Do (3 capability cards)
**Purpose:** Briefly market the three service lines — no CTAs, just descriptions

| Element | Content |
|---|---|
| Section label | `What we do` |
| H2 | `Our services` |
| Intro | One sentence about three service lines backed by CIDB registration |
| Card 1 | **Plant hire & equipment** — trucks, tankers, bobcats, tractors, mowers |
| Card 2 | **Grass cutting & clearing** — estates, highways, plot reclamation |
| Card 3 | **Septic & desludging** — septic tanks, grease traps, liquid waste |

**Pattern:** Cards with hover lift + shadow (like LME). No "Learn more" links — the cards are informational.

**Data source:** Hardcoded in `index.astro` (same as current)

---

### Section 3 — Our Track Record (contracts grid)
**Purpose:** Social proof — show the municipal contracts we've won

| Element | Content |
|---|---|
| Section label | `Our track record` |
| H2 | `Contract awards` |
| Intro | One sentence about active/past municipal contracts |
| Grid | 6 featured projects (2 rows of 3) using `ProjectShowcase` cards |
| CTA | `View all projects →` (text link) |

**Data source:** `getFeaturedProjects(6)` from `projects.ts`

---

### Section 4 — Fleet & Equipment (capability list)
**Purpose:** Show we have the gear — lightweight list, not a catalogue

| Element | Content |
|---|---|
| Section label | `Our capability` |
| H2 | `Fleet & equipment` |
| Intro | "Over 8 equipment items — from heavy machinery to handheld tools — ready for deployment." |
| Grid | List of equipment items in pill/chip format (like LME fleet section) |

**Data source:** New `equipmentList` array in `site.ts` (simple string list of equipment names)

---

### Section 5 — Why Sithembe (4 value cards)
**Purpose:** Trust-building — what sets us apart

| Element | Content |
|---|---|
| Section label | `Why choose us` |
| H2 | `Why Sithembe` |
| Intro | One sentence about municipal trust and commitment |
| Cards | 4 values: Reliability, Safety first, Transparency, Local commitment |

**Data source:** `ABOUT.values` from `about.ts`

---

### Section 6 — Contact (3 info cards)
**Purpose:** Soft contact — informational, not pushy

| Element | Content |
|---|---|
| Section label | `Get in touch` |
| H2 | `Contact us` |
| Intro | "For tenders, contracts, or project enquiries" |
| Card 1 | **Call us** — phone number, "Mobile & WhatsApp" |
| Card 2 | **Email us** — admin@sithembe.co.za |
| Card 3 | **Visit us** — Pretoria & Gauteng, business hours |

**Pattern:** LME-style info cards with hover effects. No "Call now" button — just the card.

**Data source:** `SITE` (phone, email, region, hours)

---

## What's NOT on the homepage

- ~~"Call now" primary buttons~~ → replaced with "View our services"
- ~~"Ready to work with us?" sales block~~ → replaced with info cards
- ~~Per-service "Learn more" links~~ → cards are informational only
- ~~Emergency callout banners~~ → capability showcase tone
- ~~Testimonials section~~ → removed

---

## Implementation Steps

1. **Add `equipmentList` to `site.ts`** — simple string array of equipment names
2. **Rewrite `index.astro`** — restructure all 6 sections as described above
3. **Build & verify** — `bun run build --filter=stp`
4. **Preview in browser** — check mobile/desktop responsiveness

---

## Cleanup Tasks (from code review)

- Delete unused `Testimonials.astro` component and `testimonials.ts` data file
- Clean up dead imports (`whatsappUrl`, `WHATSAPP_DEFAULT_MESSAGE`) from grass-cutting, desludging, and services index pages
- Remove unused `process` variable from desludging page
- Remove "How is pricing calculated?" from grass-cutting FAQ JSON-LD schema
