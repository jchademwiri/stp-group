# Implementation Plan: Site UI/UX Redesign

## Overview

Implement a Shared Visual Identity System with distinct per-site brand expressions across the STP and LME Astro 6 / Tailwind v4 monorepo. Work is divided into: shared design system tokens, STP brand application and homepage improvements, LME brand application and three new pages, accessibility and SEO hardening, and test coverage.

## Tasks

- [x] 1. Update shared design system tokens in `packages/tailwind/src/theme.css`
  - [x] 1.1 Add typography scale, layout, and semantic brand token skeleton to `theme.css`
    - Define `--font-sans: "Inter", system-ui, sans-serif`
    - Define named text-scale steps: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
    - Define `--max-w-content: 72rem`
    - Define `--color-charcoal: #1e1e24` and `--color-slate: #2a2a32`
    - Define `--color-whatsapp: #25d366`
    - Define `--color-brand: unset` and `--color-brand-hover: unset` as the semantic override pair
    - Do NOT define any site-specific colour values (`#ff9f1c`, `#0898c8`) in this file
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 1.2 Update `packages/tailwind/src/styles.css` `@source` directives
    - Ensure `@source` covers both `apps/stp/src` and `apps/lme/src` so Tailwind v4 generates all used utilities
    - _Requirements: 1.7_

  - [x] 1.3 Write smoke tests for shared token existence
    - Create `packages/tailwind/src/__tests__/theme-tokens.test.ts`
    - Assert `theme.css` contains `--color-charcoal`, `--color-slate`, `--color-whatsapp`, `--font-sans`, `--max-w-content`, `--color-brand`
    - Assert `theme.css` does NOT contain `#ff9f1c` or `#0898c8`
    - Assert `styles.css` `@source` covers both app `src` directories
    - _Requirements: 1.3, 1.5, 1.6_

- [x] 2. Create STP brand CSS entry point and update StpLayout
  - [x] 2.1 Create `apps/stp/src/styles/stp.css`
    - Import `@repo/tailwind/styles.css`
    - Add `@theme` block overriding `--color-brand: #ff9f1c` and `--color-brand-hover: #e88f10`
    - _Requirements: 2.1, 2.2, 1.6_

  - [x] 2.2 Update `apps/stp/src/layouts/StpLayout.astro`
    - Import `stp.css` in place of any direct `@repo/tailwind/styles.css` reference
    - Replace all `text-safety` / `bg-safety` / `border-safety` references with `text-brand` / `bg-brand` / `border-brand` equivalents
    - Update nav active state from `text-safety font-semibold` → `text-brand font-semibold`
    - Update nav hover states from `hover:text-safety` → `hover:text-brand`
    - Update footer phone/email link colours from `text-safety` → `text-brand`
    - Add skip-to-content link as first focusable element: `<a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to content</a>`
    - Verify `aria-expanded` / `aria-controls` on mobile hamburger are correct
    - Verify mobile nav panel uses `visibility: hidden` when closed
    - Retain existing nav link structure (Req 12): Plant Hire, Services, Grass Cutting, Desludging, About
    - Retain "Get a quote" (outlined) and "Call now" (filled bg-brand) desktop CTAs
    - _Requirements: 2.3, 2.4, 12.1, 12.2, 12.3, 17.1, 17.3, 17.4_

- [ ] 3. Update STP homepage (`apps/stp/src/pages/index.astro`)
  - [x] 3.1 Rework Hero section markup and content
    - Add SVG texture overlay at ≤6% opacity with `aria-hidden="true"`
    - Add Section_Label "Sithembe Group" using `text-sm font-semibold tracking-wider uppercase text-brand` pattern
    - Set `<h1>` to "Equipment on site when you need it" with `text-4xl font-bold tracking-tight md:text-5xl`
    - Add supporting paragraph referencing CIDB registration and service area
    - Add CTA row: "Call now" (bg-brand), "Browse plant hire", "WhatsApp dispatch"
    - Ensure reading flow: Hero → Trust → Featured Contracts → Services → Testimonials → Footer
    - _Requirements: 6.1, 6.6, 6.8, 5.3_

  - [x] 3.2 Update `apps/stp/src/components/TrustBadges.astro`
    - Update badge list to: CIDB 6CE, 6EP, 6SH, 5GB, 4SK + COIDA + Public Liability Insurance
    - Change icon colour from `text-safety` → `text-brand`
    - Apply Trust_Badge pill pattern: `flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium`
    - _Requirements: 6.2, 2.3, 14.3_

  - [ ] 3.3 Add Featured Contracts section to STP homepage
    - Import `getFeaturedProjects` from `apps/stp/src/data/projects.ts`
    - Render `ProjectShowcase` cards in a responsive grid for all featured projects
    - Section heading `<h2>` with `text-3xl font-bold`; always render the heading even when no projects exist
    - Grid must use single-column base with `md:grid-cols-2 lg:grid-cols-3` pattern
    - _Requirements: 6.3, 6.7, 5.4_

  - [ ] 3.4 Add/update Our Services section on STP homepage
    - Render three ServiceCards linking to `/plant-hire`, `/services/grass-cutting`, `/services/desludging`
    - Apply card pattern: `rounded-xl border border-white/10 bg-slate p-8 hover:-translate-y-1 hover:border-brand/30`
    - Grid: single-column base, `md:grid-cols-3`
    - _Requirements: 6.4, 6.7, 14.1, 14.5_

  - [ ] 3.5 Write property test for featured projects render count
    - Create or update test file in `apps/stp/src/__tests__/`
    - **Property 3: Featured projects render count equals data count**
    - Test that `renderProjectGrid(projects).cardCount === projects.length` for any array length 0..20
    - **Validates: Requirements 6.3**

- [ ] 4. Checkpoint — STP work complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Create LME brand CSS entry point and update LmeLayout
  - [x] 5.1 Create `apps/lme/src/styles/lme.css`
    - Import `@repo/tailwind/styles.css`
    - Add `@theme` block with: `--color-brand: #0898c8`, `--color-brand-hover: #0a6a8a`, `--color-accent: #f59e0b`, `--color-accent-hover: #d97706`
    - _Requirements: 3.1, 3.2, 3.3, 1.6_

  - [x] 5.2 Update `apps/lme/src/layouts/LmeLayout.astro`
    - Import `lme.css` as the CSS entry point
    - Replace all `text-safety` / `bg-safety` references with `text-brand` / `bg-brand` variants
    - Update nav links from anchor-only to page routes: Home `/`, About `/about`, Services `/services`, Projects `/projects`, Contact `#contact`
    - Implement path-based active state logic using `Astro.url.pathname` matching (same pattern as STP):
      - Home: `p === "/" || p === ""`; About: `p.startsWith("/about")`; Services: `p.startsWith("/services")`; Projects: `p.startsWith("/projects")`; Contact anchor: always inactive
    - Active state style: `text-brand font-semibold`
    - Desktop nav primary CTA "Call now": `bg-accent text-charcoal` (amber button)
    - Add skip-to-content link as first focusable element
    - Verify `aria-expanded` / `aria-controls` on mobile hamburger
    - Verify mobile nav panel uses `visibility: hidden` (or equivalent) when closed
    - Apply `bg-charcoal` as default page background
    - Sticky bar: use LME brand colours; include "Call" and "WhatsApp" CTAs on mobile (≤768px); suppress if page-specific config set
    - Fix any `text-safety` references in `StickyMobileBar.astro` for LME → `text-brand`
    - _Requirements: 3.4, 3.6, 3.7, 11.1, 11.2, 11.3, 11.4, 11.5, 13.3, 17.1, 17.3, 17.4_

  - [ ] 5.3 Write property test for LME navigation mutual exclusion
    - Create or update test file in `apps/lme/src/__tests__/`
    - **Property 2: Navigation mutual exclusion — exactly one active link**
    - Test that for any path in `["/", "/about", "/services", "/projects", "/unknown"]`, `lmeNavLinks.filter(link => link.match(path)).length <= 1`
    - **Validates: Requirements 11.3**

- [x] 6. Create LME-specific components
  - [x] 6.1 Create `apps/lme/src/components/LmeTrustBadges.astro`
    - Read from `LME` data constant (no props)
    - Render pills for: CIDB 1CE, CIDB 1GB, CIDB 1EP, SARS Compliant, Founded 2014
    - Icon colour: `text-brand` (teal-blue)
    - Apply Trust_Badge pill pattern: `flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium`
    - All decorative SVG icons must carry `aria-hidden="true"`
    - _Requirements: 7.2, 3.4, 14.3, 17.5_

  - [x] 6.2 Verify `apps/lme/src/components/LocalBusinessSchema.astro`
    - Confirm it reads from the `LME` data object
    - Ensure all required JSON-LD fields present: `name`, `telephone`, `email`, `address`, `geo`, `areaServed`, `openingHours`, `url`
    - _Requirements: 16.2_

- [ ] 7. Update LME homepage (`apps/lme/src/pages/index.astro`)
  - [ ] 7.1 Rework LME Hero section
    - `<h1>` with construction/civil engineering headline using `text-4xl font-bold tracking-tight md:text-5xl`
    - Sub-headline listing CIDB grades 1CE, 1GB, 1EP
    - Three CTAs: "Call now" (`bg-accent text-charcoal` — amber primary), "View our services" (outlined), "WhatsApp us" (outlined)
    - Include `<LmeTrustBadges />` below CTAs
    - SVG texture overlay at ≤6% opacity with `aria-hidden="true"`
    - _Requirements: 7.1, 7.2, 3.5, 5.3_

  - [ ] 7.2 Add Services, Fleet, Why LME, Projects, and Contact sections to LME homepage
    - Services (`id="services"`): 3 cards (Civil Engineering 1CE, General Building 1GB, Electrical Engineering 1EP) with teal-blue icon backgrounds; single-column base, `md:grid-cols-3`
    - Fleet (`id="fleet"`): conditionally render `{LME.fleet.length > 0 && <section>...</section>}`; responsive grid with teal-blue check icons; omit entirely if empty
    - Why LME: all four `LME.values` items as icon cards; single-column base, `md:grid-cols-2 lg:grid-cols-4`
    - Projects (`id="projects"`): list all `LME.contracts` items with check-circle icons
    - Contact (`id="contact"`): cards for phone, email, address
    - Ensure reading flow: Hero → Services → Fleet → Why LME → Projects → Contact → Footer
    - Apply Section_Label pattern above each section heading
    - All cards: `rounded-xl border border-white/10 bg-slate p-8 hover:-translate-y-1 hover:border-brand/30`
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 14.1, 14.4_

  - [ ] 7.3 Write property test for LME fleet section conditional presence
    - **Property 4: LME fleet section conditional presence**
    - Test that `renderFleetSection(fleet).sectionVisible === (fleet.length > 0)` for any array length 0..30
    - **Validates: Requirements 7.4**

- [x] 8. Create LME data files
  - [x] 8.1 Add `contractCategories` map to `apps/lme/src/data/site.ts`
    - Add `export const contractCategories: Record<string, string[]>` mapping category names to contract strings
    - Categories: "Water & Sanitation", "Emergency Services", "Electrical", "Equipment Hire"
    - Populate with all current `LME.contracts` items as defined in the design
    - _Requirements: 10.3_

  - [x] 8.2 Create `apps/lme/src/data/services.ts`
    - Define `LmeServiceDetail` interface: `{ code: "1CE" | "1GB" | "1EP"; title: string; expandedDescription: string; projectTypes: string[] }`
    - Export `lmeServiceDetails: LmeServiceDetail[]` with entries for Civil Engineering (1CE), General Building (1GB), Electrical Engineering (1EP)
    - Include representative project types per service
    - _Requirements: 9.2, 9.3_

  - [x] 8.3 Write unit test for contractCategories coverage
    - Create `apps/lme/src/__tests__/data.test.ts`
    - Test that all items in `LME.contracts` are present in at least one category of `contractCategories`
    - _Requirements: 10.3_

- [ ] 9. Create LME About page (`apps/lme/src/pages/about.astro`)
  - [ ] 9.1 Implement LME About page structure and content
    - Use `LmeLayout` with `title="About Us | LME"` and appropriate `description` prop
    - Hero/Intro section: Section_Label "About us", `<h1>` "About Livhu and Musa Enterprise", founding story paragraph
    - Company Stats row: Founded 2014 | 10+ Employees | Centurion, Gauteng | CIDB Registered
    - Our Values section: 4 value cards from `LME.values` with supporting copy; single-column base, `md:grid-cols-2`
    - Credentials & CIDB Grades section: 3 grade cards (1CE, 1GB, 1EP) with descriptions of permitted work
    - CTA section with links to `/services` and `#contact`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 16.6_

  - [ ] 9.2 Verify LME About page navigation active state
    - Confirm that when path starts with `/about`, the LmeLayout highlights "About" nav item as active
    - This is covered by the path-based match logic implemented in task 5.2
    - _Requirements: 8.6_

- [ ] 10. Create LME Services page (`apps/lme/src/pages/services.astro`)
  - [ ] 10.1 Implement LME Services page structure and content
    - Use `LmeLayout` with `title="Services | LME"` and appropriate `description` prop
    - Page Hero: Section_Label "What we deliver", `<h1>` "Our Services"
    - For each entry in `lmeServiceDetails`: render a service block with CIDB grade badge, `<h2>` title, expanded description, project types list, and "Inquire about this service" CTA (→ `#contact` or `tel:`)
    - Contact CTA section (`id="contact"`) at bottom of page
    - Apply Section_Label pattern and brand token classes throughout
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 16.6_

  - [ ] 10.2 Verify LME Services page navigation active state
    - Confirm path `/services` triggers active state on "Services" nav link via task 5.2 logic
    - _Requirements: 9.6_

- [ ] 11. Create LME Projects page (`apps/lme/src/pages/projects.astro`)
  - [ ] 11.1 Implement LME Projects page structure and content
    - Use `LmeLayout` with `title="Projects | LME"` and appropriate `description` prop
    - Page Hero: Section_Label "Our track record", `<h1>` "Projects & Contract Awards"
    - Credibility statement referencing CIDB registration and SARS compliance
    - Implement categorisation logic using `contractCategories` map; include defensive "Other" fallback for unmatched contracts; filter out empty categories
    - Render each category as a `<section>` with `<h2>` and contracts list with check-circle icons; client attribution "City of Tshwane Metropolitan Municipality" where applicable
    - CTA section encouraging tender officers to contact LME for new contracts
    - All decorative SVGs carry `aria-hidden="true"`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 16.6, 17.5_

  - [ ] 11.2 Write property test for LME contracts render count
    - **Property 5: LME contracts render count equals data count**
    - Test that total contract items rendered on the Projects page equals `LME.contracts.length` for any contracts array
    - **Validates: Requirements 10.2**

  - [ ] 11.3 Verify LME Projects page navigation active state
    - Confirm path `/projects` triggers active state on "Projects" nav link via task 5.2 logic
    - _Requirements: 10.6_

- [ ] 12. Update BaseLayout for SEO, performance, and accessibility (`packages/tailwind/src/layouts/BaseLayout.astro`)
  - [x] 12.1 Add font preconnect, canonical link, and Open Graph tags to BaseLayout
    - Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` before the stylesheet link
    - Load Inter font with `display=swap`
    - Add `<link rel="canonical" href={canonical}>` when `canonical` prop is provided
    - Render `og:title`, `og:description`, `og:image`, `og:url` tags independently — each renders if its value is available, missing values do not suppress other tags
    - Add `<slot name="head" />` for per-page schema injection
    - Add skip-to-content link as first focusable element in `<body>`: `<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 ...">Skip to content</a>`
    - Wrap `<slot />` in `<main id="main-content">`
    - _Requirements: 15.1, 15.2, 16.4, 16.5, 17.1, 5.7_

  - [ ] 12.2 Write property test for Open Graph independent rendering
    - **Property 8: Open Graph tags render available props independently**
    - Test that for any combination of defined/undefined `(title, description, ogImage, canonical)`, each defined prop produces its corresponding tag and undefined props do not suppress others
    - **Validates: Requirements 16.5**

- [ ] 13. Add LME LocalBusiness JSON-LD schema to LME pages
  - [ ] 13.1 Verify and update LME `LocalBusinessSchema.astro`
    - Confirm the component reads from the `LME` data object
    - Ensure all required fields are present: `name`, `telephone`, `email`, `address`, `geo`, `areaServed`, `openingHours`, `url`
    - Add `<LocalBusinessSchema />` to `LmeLayout.astro` via `<slot name="head" />` or directly in layout so it renders on every LME page
    - _Requirements: 16.2_

  - [ ] 13.2 Verify STP `LocalBusinessSchema.astro` and `Organization` schema
    - Confirm STP `LocalBusinessSchema.astro` reads from `SITE` with all required fields (name, telephone, email, address, geo, areaServed, openingHours, url)
    - Confirm STP homepage outputs `Organization` JSON-LD with: name, legalName, url, logo, telephone, email, areaServed, foundingDate, sameAs
    - _Requirements: 16.1, 16.3_

- [ ] 14. Accessibility and performance hardening
  - [ ] 14.1 Audit and fix all decorative SVG icons across both sites
    - Search both `apps/stp/src` and `apps/lme/src` for inline `<svg>` elements lacking `aria-hidden="true"`
    - Add `aria-hidden="true"` to every decorative SVG (icons, texture overlays, decorative shapes)
    - Ensure all interactive image links carry descriptive `alt` text on `<img>` elements (e.g. logo links)
    - _Requirements: 17.5, 17.6, 15.5_

  - [ ] 14.2 Audit and fix `<img>` elements for `alt` attributes and lazy loading
    - Ensure every `<img>` in both sites has an `alt` attribute (empty string `""` for decorative images)
    - Add `loading="lazy"` and explicit `width`/`height` to appropriate images
    - Add `loading="lazy"` to any `<iframe>` elements (e.g. OpenStreetMap in STP footer)
    - _Requirements: 15.3, 15.5_

  - [ ] 14.3 Add `prefers-reduced-motion` CSS block to theme.css or styles.css
    - Add `@media (prefers-reduced-motion: reduce)` block setting `animation-duration`, `transition-duration`, and `animation-iteration-count` to minimal values
    - _Requirements: 15.4_

  - [ ] 14.4 Verify keyboard navigation focus rings on both sites
    - Confirm all interactive elements have a visible focus ring with sufficient contrast (3:1 minimum for WCAG AA)
    - Verify mobile nav toggle has `aria-expanded` (true/false) and `aria-controls` referencing the mobile nav panel `id`
    - Verify mobile nav panel is hidden from assistive technology when closed (`visibility: hidden` or equivalent)
    - _Requirements: 17.2, 17.3, 17.4, 17.7_

  - [ ] 14.5 Write property tests for img alt attributes and decorative SVG aria-hidden
    - **Property 6: All img elements have alt attributes**
    - Test that every `<img>` element in rendered HTML of STP and LME pages has an `alt` attribute
    - **Property 7: All decorative SVGs carry aria-hidden**
    - Test that every decorative inline `<svg>` carries `aria-hidden="true"`
    - **Validates: Requirements 15.5, 17.5**

- [ ] 15. WCAG contrast verification tests
  - [x] 15.1 Create contrast ratio utility and unit tests
    - Create `packages/tailwind/src/__tests__/contrast.test.ts`
    - Implement `wcagContrastRatio(hex1: string, hex2: string): number` using WCAG relative luminance formula
    - Write example-based tests for all key colour pairs:
      - `#ff9f1c` on `#1e1e24` ≥ 3.0 (large text/icons threshold)
      - `#0898c8` on `#1e1e24` ≥ 3.0 (UI component threshold)
      - `#f59e0b` on `#1e1e24` ≥ 4.5 (amber CTA button text background)
      - `#1e1e24` on `#f59e0b` ≥ 4.5 (charcoal text on amber button)
      - `#a3a3a3` on `#1e1e24` ≥ 4.5 (neutral-400 body text on charcoal)
      - `#a3a3a3` on `#2a2a32` ≥ 4.5 (neutral-400 body text on slate)
      - `#ffffff` on `#1e1e24` ≥ 4.5 (white text on charcoal)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 15.2 Write property test for WCAG body text contrast — parameterised pairs
    - **Property 1: WCAG body text contrast — all dark surfaces**
    - Test each declared body text colour / dark surface pair meets 4.5:1 using parameterised `test.each`:
      - `["#e5e5e5", "#1e1e24"]`, `["#a3a3a3", "#1e1e24"]`, `["#ffffff", "#1e1e24"]`, `["#e5e5e5", "#2a2a32"]`
    - **Validates: Requirements 4.1**

  - [ ] 15.3 Write property test for responsive grid sections single-column at mobile
    - **Property 9: Responsive grid sections are single-column at mobile**
    - Test that every grid element's class list has a single-column base (no bare `grid-cols-[2-9]`) and a `md:grid-cols-*` expansion variant
    - **Validates: Requirements 13.2**

- [ ] 16. Final checkpoint — all sites and tests
  - Ensure all tests pass across `packages/tailwind`, `apps/stp`, and `apps/lme`. Ask the user if any questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- STP navigation structure is deliberately unchanged (Requirement 12) — only token/class name updates
- LME navigation migrates from anchor-only to full page routes — this is a breaking change to the LME nav and must be done in task 5.2 before any LME page work
- Safety-orange (`#ff9f1c`) at 2.78:1 on charcoal is below the small-text threshold — enforce large-text and icon-only usage in code review (Req 4.2)
- Property tests use `fast-check` and `vitest` as specified in the design document
- The `contractCategories` map is a static categorisation of existing `LME.contracts` data — no external data source required
- Checkpoints at task 4 and task 16 ensure incremental validation before adding new pages

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1", "8.1", "8.2"] },
    { "id": 2, "tasks": ["2.2", "5.1", "8.3"] },
    { "id": 3, "tasks": ["3.1", "3.2", "5.2", "6.1", "6.2", "12.1", "15.1"] },
    { "id": 4, "tasks": ["3.3", "3.4", "5.3", "7.1", "9.1", "10.1", "11.1", "12.2", "15.2"] },
    { "id": 5, "tasks": ["3.5", "7.2", "13.1", "13.2", "14.1", "14.2", "14.3", "14.4"] },
    { "id": 6, "tasks": ["7.3", "9.2", "10.2", "11.2", "11.3", "14.5", "15.3"] }
  ]
}
```
