# Requirements Document

## Introduction

Both STP (Sithembe Plant Hire) and LME (Livhu and Musa Enterprise) are sister companies in the Sithembe Group operating in Pretoria and Gauteng. Currently both Astro 6 / Tailwind v4 websites share an identical visual language — dark charcoal backgrounds, the same safety-orange (#ff9f1c) accent, and near-identical layout patterns — which erases the distinct brand personality each company needs.

This feature establishes a **Shared Visual Identity System** with **distinct per-site brand expressions**:
- STP retains its industrial/operational character (plant hire, grass cutting, desludging) with safety orange
- LME gains its own professional/civil-engineering character using its existing teal-blue (#0898c8) and amber accent palette
- Both share spacing, typographic scale, component structure, and layout conventions from the shared `@repo/tailwind` package
- LME receives the missing pages (About, Services, Projects) and improved homepage hierarchy
- STP's existing pages receive improved visual hierarchy and section structure

---

## Glossary

- **Design_System**: The shared set of Tailwind v4 CSS custom properties, typography scale, spacing, and component patterns defined in `packages/tailwind/src/`.
- **STP_Brand**: The visual identity for Sithembe Plant Hire — industrial, operational, safety-orange primary accent, dark charcoal base.
- **LME_Brand**: The visual identity for Livhu and Musa Enterprise — professional, civil-engineering, teal-blue (#0898c8) primary with amber (#f59e0b) CTA accent.
- **Brand_Token**: A CSS custom property (Tailwind v4 `@theme` variable) that maps a semantic name to a colour, e.g. `--color-brand` or `--color-brand-hover`.
- **BaseLayout**: The shared Astro layout in `packages/tailwind/src/layouts/BaseLayout.astro` consumed by both sites.
- **StpLayout**: The STP site-level layout at `apps/stp/src/layouts/StpLayout.astro`.
- **LmeLayout**: The LME site-level layout at `apps/lme/src/layouts/LmeLayout.astro`.
- **Trust_Badge**: A small pill-shaped element displaying a credential (CIDB grade, insurance, compliance status).
- **Hero_Section**: The top-most full-width section of a page, containing the primary headline, sub-copy, and CTAs.
- **Section_Label**: The small all-caps, tracked, coloured text that appears above section headings (e.g. "What we do").
- **Sticky_Bar**: The fixed bottom bar shown on mobile with quick-action CTAs (call, WhatsApp, quote).
- **CTA**: Call-to-action button or link.
- **WCAG_AA**: Web Content Accessibility Guidelines 2.2 Level AA — minimum contrast ratio 4.5:1 for normal text, 3:1 for large text and UI components.

---

## Requirements

---

### Requirement 1: Design System — Shared Foundation Tokens

**User Story:** As a developer maintaining both sites, I want a single source of truth for shared design tokens, so that both sites share consistent spacing, typography, and structural conventions without duplicating values.

#### Acceptance Criteria

1. THE Design_System SHALL define a shared typographic scale using Inter as the primary sans-serif font, with named scale steps (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl) as Tailwind v4 `@theme` variables.
2. THE Design_System SHALL define a shared spacing scale and a maximum content width (`max-w-content: 72rem`) as Tailwind v4 `@theme` variables.
3. THE Design_System SHALL define shared neutral surface colours — `--color-charcoal: #1e1e24` and `--color-slate: #2a2a32` — as the common dark-background foundation for both sites.
4. THE Design_System SHALL define `--color-whatsapp: #25d366` as a shared utility colour available to both sites.
5. THE Design_System SHALL define a `--color-brand` semantic token pair (`--color-brand` and `--color-brand-hover`) that each site overrides with its own primary accent colour.
6. WHERE a site overrides `--color-brand`, THE Design_System SHALL allow the override to be scoped to that site's own CSS entry point using CSS custom properties, such that the shared `theme.css` file is never modified and the override never affects the other site.
7. WHEN a developer adds a new shared token to `theme.css`, THE Design_System SHALL make that token available to both `apps/stp` and `apps/lme` without additional configuration.

---

### Requirement 2: STP Brand Token Application

**User Story:** As a visitor to the STP site, I want the site to feel industrial and operational — conveying heavy equipment, reliability, and rapid dispatch — so that I am confident in STP's ability to deliver plant hire services.

#### Acceptance Criteria

1. THE STP_Brand SHALL use `--color-safety: #ff9f1c` as its `--color-brand` value throughout the STP site.
2. THE STP_Brand SHALL use `--color-safety-hover: #e88f10` as the hover/active state for all STP primary CTAs.
3. THE StpLayout SHALL apply `--color-brand` (safety orange) to all interactive accent elements: navigation active states, CTA buttons, link hovers, Section_Labels, Trust_Badge icons, and icon highlights.
4. THE StpLayout SHALL use `bg-charcoal` as the default page background and `bg-slate` for elevated card surfaces throughout the STP site.
5. WHEN a user views any STP page on a device with a viewport narrower than 768px, THE StpLayout SHALL display the Sticky_Bar with call and quote CTA links using STP_Brand colours, unless the Sticky_Bar is suppressed by page-specific configuration.

---

### Requirement 3: LME Brand Token Application

**User Story:** As a visitor to the LME site, I want the site to feel professional and credible — reflecting civil engineering, construction, and municipal contract work — so that I trust LME as a qualified contractor.

#### Acceptance Criteria

1. THE LME_Brand SHALL use teal-blue `#0898c8` as its `--color-brand` value, replacing all safety-orange references in the LME site.
2. THE LME_Brand SHALL use `#0a6a8a` as the hover/active state for `--color-brand-hover` on the LME site.
3. THE LME_Brand SHALL use amber `#f59e0b` as a secondary accent (`--color-accent`) exclusively for LME's primary CTA buttons ("Call now", "Get a quote", tender inquiry).
4. THE LmeLayout SHALL apply `--color-brand` (teal-blue) to navigation active states, Section_Labels, Trust_Badge icons, icon highlights, and non-CTA link hovers throughout the LME site.
5. THE LmeLayout SHALL apply `--color-accent` (amber) to primary CTA buttons in the LME hero and contact sections.
6. THE LmeLayout SHALL use `bg-charcoal` as the default page background, maintaining the shared dark surface convention.
7. WHEN a user views any LME page on a device with a viewport of 768px or narrower, THE LmeLayout SHALL display a Sticky_Bar with call and WhatsApp CTA links using LME_Brand colours, unless the Sticky_Bar is suppressed by page-specific configuration.
8. WHEN a visitor views the LME site, THE LME_Brand SHALL produce a visually distinct appearance from the STP site such that a user can identify each site as belonging to a different brand without reading the company name.

---

### Requirement 4: WCAG AA Colour Contrast Compliance

**User Story:** As a user who relies on sufficient colour contrast, I want all text and interactive elements on both sites to meet WCAG AA contrast requirements, so that the content is readable regardless of visual ability.

#### Acceptance Criteria

1. WHEN text is rendered on a dark surface (`bg-charcoal` or `bg-slate`), THE Design_System SHALL ensure body text colours achieve a minimum contrast ratio of 4.5:1 against the background.
2. WHEN STP_Brand safety-orange (`#ff9f1c`) is used as a text or icon colour on `bg-charcoal`, THE StpLayout SHALL use only large text (≥18px bold or ≥24px regular) for that colour combination, meeting the 3:1 large-text threshold.
3. WHEN LME_Brand teal-blue (`#0898c8`) is used as a text or icon colour on `bg-charcoal`, THE LmeLayout SHALL use only large text or non-text UI components (icons, borders) for that colour combination, meeting the 3:1 threshold for UI components.
4. WHEN LME_Brand amber (`#f59e0b`) is used as a CTA button background, THE LmeLayout SHALL use `text-charcoal` (`#1e1e24`) as the foreground colour on those buttons.
5. IF a new colour combination is introduced in either site, THEN THE developer SHALL verify the combination against WCAG AA before merging.

---

### Requirement 5: Shared Typography Conventions

**User Story:** As a developer building pages for either site, I want a consistent typographic hierarchy, so that headings, body copy, and labels follow the same structural conventions across both brands.

#### Acceptance Criteria

1. THE Design_System SHALL define `font-sans` as Inter (with system-ui fallback) applied globally via `BaseLayout`.
2. THE Design_System SHALL define a Section_Label pattern: `text-sm font-semibold tracking-wider uppercase` coloured with `--color-brand`, used as the overline above section headings on both sites.
3. THE Design_System SHALL define page-level h1 as `text-4xl font-bold tracking-tight md:text-5xl`.
4. THE Design_System SHALL define section h2 as `text-3xl font-bold`.
5. THE Design_System SHALL define card/item h3 as `text-xl font-semibold` (STP) or `text-xl font-bold` (LME, reflecting LME's more formal register).
6. THE Design_System SHALL define body copy as `text-base leading-relaxed` with `text-neutral-400` on dark surfaces.
7. WHEN either site renders a page, THE BaseLayout SHALL load Inter via Google Fonts with `display=swap` to prevent layout shift.

---

### Requirement 6: STP Homepage Redesign

**User Story:** As a potential client visiting the STP homepage, I want clear visual hierarchy and compelling content sections, so that I can quickly understand what STP offers and take action to get a quote or call.

#### Acceptance Criteria

1. THE STP homepage Hero_Section SHALL display a headline communicating equipment-on-site availability, a supporting paragraph referencing CIDB registration and service area, and three CTAs: "Call now", "Browse plant hire", and "WhatsApp dispatch".
2. THE STP homepage Hero_Section SHALL display Trust_Badge pills below the CTAs listing CIDB grades (6CE, 6EP, 6SH, 5GB, 4SK), COIDA registration, and public liability insurance.
3. THE STP homepage SHALL include a "Featured contracts" section displaying ProjectShowcase cards sourced from `apps/stp/src/data/projects.ts`, showing however many featured projects are available (including none if the data is empty).
4. THE STP homepage SHALL include a "Our services" section with cards linking to `/plant-hire`, `/services/grass-cutting`, and `/services/desludging`.
5. THE STP homepage SHALL include a Testimonials section.
6. WHEN a user scrolls the STP homepage, THE STP homepage SHALL maintain a logical reading flow: Hero → Trust/Badges → Featured Contracts → Services → Testimonials → Footer.
7. WHEN the STP homepage is rendered on a viewport narrower than 768px, THE STP homepage SHALL stack all grid columns to a single column. At exactly 768px, the multi-column layout SHALL be retained.
8. THE STP homepage Hero_Section SHALL use a subtle repeating SVG texture overlay at low opacity (≤6%) for visual depth without distracting from the headline.

---

### Requirement 7: LME Homepage Redesign

**User Story:** As a potential client or tender officer visiting the LME homepage, I want to immediately understand LME's credentials, active contracts, and service scope, so that I can assess LME's suitability as a contractor.

#### Acceptance Criteria

1. THE LME homepage Hero_Section SHALL display a headline referencing LME's construction and civil engineering services, a sub-headline listing CIDB grades (1CE, 1GB, 1EP), and three CTAs: "Call now" (amber, primary), "View our services" (outlined), and "WhatsApp us" (outlined).
2. THE LME homepage Hero_Section SHALL display Trust_Badge pills for each CIDB grade, SARS compliance status, and founding year — coloured with LME_Brand teal-blue.
3. THE LME homepage SHALL include a "Services" section with three cards (Civil Engineering 1CE, General Building 1GB, Electrical Engineering 1EP) with teal-blue icon backgrounds.
4. WHEN `LME.fleet` contains one or more items, THE LME homepage SHALL include a "Fleet & Equipment" section listing all items in a responsive grid with teal-blue check icons. IF `LME.fleet` is empty, THEN THE LME homepage SHALL omit the fleet section entirely.
5. THE LME homepage SHALL include a "Why LME" section displaying all four `LME.values` items with icon cards.
6. THE LME homepage SHALL include a "Current & Past Projects" section listing all items from `LME.contracts` with check-circle icons.
7. THE LME homepage SHALL include a contact section with cards for phone, email, and address.
8. WHEN the LME homepage is rendered on a viewport narrower than 768px, THE LME homepage SHALL stack all grid columns to a single column.
9. WHEN a user scrolls the LME homepage, THE LME homepage SHALL maintain a logical reading flow: Hero → Services → Fleet → Why LME → Projects → Contact → Footer.

---

### Requirement 8: LME About Page

**User Story:** As a tender officer or potential client, I want an About page for LME, so that I can learn about the company's history, founding story, values, and credentials before making contact.

#### Acceptance Criteria

1. THE LME site SHALL include an `/about` page accessible via navigation.
2. THE LME About page SHALL display LME's founding year (2014), founder name (Johannes Mduduzi Mahlangu), employee count (10+), and region.
3. THE LME About page SHALL display LME's four core values from `LME.values` with supporting explanatory copy.
4. THE LME About page SHALL display LME's CIDB grades (1CE, 1GB, 1EP) with descriptions of what each grade permits.
5. THE LME About page SHALL include a CTA section with at least one link to the services page (`/services`) or the contact section (`#contact`), or both.
6. WHEN a user navigates to `/about` on the LME site, THE LmeLayout SHALL highlight the "About" navigation item as active.

---

### Requirement 9: LME Services Page

**User Story:** As a potential client, I want a dedicated Services page for LME, so that I can explore each service category in depth before contacting LME for a tender or quote.

#### Acceptance Criteria

1. THE LME site SHALL include a `/services` page accessible via navigation.
2. THE LME Services page SHALL display all three service categories (Civil Engineering, General Building, Electrical Engineering) with expanded descriptions drawn from `LME.services`.
3. THE LME Services page SHALL list representative project types or deliverables for each service category.
4. THE LME Services page SHALL display the relevant CIDB grade badge alongside each service category.
5. THE LME Services page SHALL include a contact/inquiry CTA at the bottom of each service section.
6. WHEN a user navigates to `/services` on the LME site, THE LmeLayout SHALL apply the active state to the "Services" navigation link; a brief delay during page load before the active state is visible is acceptable.

---

### Requirement 10: LME Projects Page

**User Story:** As a tender evaluation officer, I want a Projects page for LME listing contract awards, so that I can verify LME's track record with municipal and private-sector clients.

#### Acceptance Criteria

1. THE LME site SHALL include a `/projects` page accessible via navigation.
2. THE LME Projects page SHALL display all contract award items from `LME.contracts` with client attribution (City of Tshwane Metropolitan Municipality).
3. THE LME Projects page SHALL categorise contracts by type: Water & Sanitation, Emergency Services, Electrical, Equipment Hire.
4. THE LME Projects page SHALL include a credibility statement referencing LME's CIDB registration and SARS compliance.
5. THE LME Projects page SHALL include a CTA encouraging tender officers to contact LME for new contracts.
6. WHEN a user navigates to `/projects` on the LME site, THE LmeLayout SHALL highlight the "Projects" navigation item as active.

---

### Requirement 11: LME Navigation Update

**User Story:** As a visitor to the LME site, I want a navigation menu that reflects all available pages, so that I can move between Home, About, Services, and Projects without confusion.

#### Acceptance Criteria

1. THE LmeLayout SHALL render a desktop navigation menu containing links to: Home (`/`), About (`/about`), Services (`/services`), Projects (`/projects`), and a "Contact" anchor (`#contact`).
2. THE LmeLayout SHALL render a mobile navigation menu containing the same links as the desktop navigation.
3. WHEN a user is on a page matching a navigation link's href, THE LmeLayout SHALL apply the active state style (teal-blue, font-semibold) to exactly that one link and remove the active state from all other links.
4. WHEN the mobile navigation is open, THE LmeLayout SHALL display an overlay or slide-down panel with all navigation links.
5. THE LmeLayout desktop navigation SHALL include a primary CTA button ("Call now") using LME_Brand amber styling.

---

### Requirement 12: STP Navigation — No Structural Change

**User Story:** As a visitor to the STP site, I want the navigation to continue reflecting STP's current page structure, so that existing users and search engines are not disrupted by this redesign.

#### Acceptance Criteria

1. THE StpLayout SHALL retain navigation links to: Plant Hire (`/plant-hire`), Services (`/services`), Grass Cutting (`/services/grass-cutting`), Desludging (`/services/desludging`), and About (`/about`).
2. THE StpLayout SHALL retain its current active-state logic (path-based matching) with safety-orange highlighting.
3. THE StpLayout SHALL retain "Get a quote" (outlined border) and "Call now" (filled safety-orange background) as the two desktop header CTAs, with "Call now" as the primary filled action.

---

### Requirement 13: Responsive Layout and Mobile Experience

**User Story:** As a mobile user visiting either site, I want a fully functional and readable experience on a small screen, so that I can contact the company or find information without requiring a desktop device.

#### Acceptance Criteria

1. THE Design_System SHALL define a mobile-first breakpoint strategy: base styles for mobile (< 768px), `md:` for tablet and above (≥ 768px), `lg:` for desktop (≥ 1024px).
2. WHEN either site is viewed on a viewport narrower than 768px, THE site SHALL render a single-column layout for all grid sections.
3. WHEN either site is viewed on a device with a viewport of 768px or narrower, THE site SHALL display the Sticky_Bar with at minimum a "Call" and a "WhatsApp" CTA, unless suppressed by page-specific configuration.
4. WHEN either site is viewed on a viewport narrower than 768px, THE desktop navigation SHALL be hidden and replaced by the hamburger-toggle mobile navigation panel.
5. THE Sticky_Bar on STP SHALL include a "Get a quote" link that resolves to the relevant quote form anchor for the current page (as per existing logic in StpLayout).
6. WHEN a mobile user taps a navigation link in the mobile menu, THE mobile navigation panel SHALL close automatically. Tapping outside the panel or pressing Escape does not need to close it.

---

### Requirement 14: Shared Component Patterns — Cards and Sections

**User Story:** As a developer, I want consistent card and section patterns shared between sites, so that new pages on either site can be built by composing known building blocks rather than writing ad-hoc styles.

#### Acceptance Criteria

1. THE Design_System SHALL document (via theme comments or a pattern guide) a standard service card pattern: `rounded-xl border border-white/10 bg-slate p-8` with hover lift (`hover:-translate-y-1`) and border highlight (`hover:border-brand/30`).
2. THE Design_System SHALL document a standard section-wrapper pattern: `mx-auto max-w-content px-4 py-16 md:px-6` for consistent horizontal padding and max-width.
3. THE Design_System SHALL document a Trust_Badge pill pattern: `flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium`.
4. WHEN LME uses a service card component, THE component SHALL substitute `border-brand/30` with LME_Brand teal-blue at hover state.
5. WHEN STP uses a service card component, THE component SHALL substitute `border-brand/30` with STP_Brand safety-orange at hover state.

---

### Requirement 15: Performance and Core Web Vitals

**User Story:** As a user on a mobile connection, I want both sites to load quickly, so that I do not abandon the page before finding contact information.

#### Acceptance Criteria

1. THE BaseLayout SHALL load the Inter font using `rel="preconnect"` for `fonts.googleapis.com` and `fonts.gstatic.com` before the stylesheet link to reduce font load latency.
2. THE BaseLayout SHALL set `display=swap` on the Google Fonts request to prevent render-blocking.
3. WHEN either site embeds an iframe (e.g. OpenStreetMap in the STP footer), THE iframe SHALL carry `loading="lazy"` to defer off-screen loading.
4. THE Design_System SHALL include a `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration`, `transition-duration`, and `animation-iteration-count` to minimal values for all animations — including essential UI feedback such as loading indicators and form validation — for users who have opted out of motion.
5. WHEN images are used in either site, THE image elements SHALL include an `alt` attribute on every `<img>` element (using an empty string `alt=""` for purely decorative images), and where appropriate carry `loading="lazy"` and explicit `width`/`height` attributes.

---

### Requirement 16: Structured Data and SEO

**User Story:** As a business owner, I want both sites to output correct structured data and meta tags, so that Google can understand each company's identity and display rich results in local search.

#### Acceptance Criteria

1. THE STP site SHALL output a `LocalBusiness` JSON-LD schema on every page via `LocalBusinessSchema.astro` with correct `name`, `telephone`, `email`, `address`, `geo`, `areaServed`, `openingHours`, and `url` fields drawn from `SITE`.
2. THE LME site SHALL output a `LocalBusiness` JSON-LD schema on every page via `LocalBusinessSchema.astro` with correct fields drawn from `LME`.
3. THE STP homepage SHALL output an `Organization` JSON-LD schema with `name`, `legalName`, `url`, `logo`, `telephone`, `email`, `areaServed`, `foundingDate`, and `sameAs` (social links).
4. WHEN a page has a canonical URL, THE BaseLayout SHALL render a `<link rel="canonical">` tag with that URL.
5. THE BaseLayout SHALL render Open Graph `og:title`, `og:description`, `og:image`, and `og:url` meta tags on every page; if any individual tag value is unavailable, THE BaseLayout SHALL render the remaining available tags rather than omitting all Open Graph tags.
6. WHEN a new LME page is created (About, Services, Projects), THE page SHALL provide a unique `title` and `description` prop to LmeLayout for correct per-page meta tags.

---

### Requirement 17: Accessibility — Keyboard and Screen Reader Support

**User Story:** As a user who navigates by keyboard or uses a screen reader, I want both sites to be fully operable without a mouse, so that the sites are inclusive and legally compliant.

#### Acceptance Criteria

1. THE StpLayout and LmeLayout SHALL implement a skip-to-content link as the first focusable element in the DOM, allowing keyboard users to bypass the navigation.
2. WHEN a keyboard user presses Tab, THE navigation SHALL be reachable and all interactive elements SHALL have a visible focus ring (at minimum `outline` style with sufficient contrast).
3. THE mobile navigation toggle button SHALL carry `aria-expanded` (true/false) and `aria-controls` referencing the mobile nav panel ID.
4. WHEN the mobile navigation panel is closed, THE panel SHALL be hidden from assistive technology (e.g. `visibility: hidden` or equivalent).
5. ALL decorative SVG icons used in both sites SHALL carry `aria-hidden="true"` to prevent screen readers from announcing SVG path data.
6. ALL interactive image links SHALL carry descriptive `alt` text on the `<img>` element (e.g. logo links).
7. THE colour contrast of focus rings on both sites SHALL meet the WCAG AA 3:1 minimum for non-text UI components against adjacent colours.
