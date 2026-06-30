# Product Requirements Document (PRD): SRL Landing Page

**Site:** SRL Property and Projects Pty (Ltd) - new app (`apps/srl`)
**Goal:** Rapidly develop a minimal yet modern, professional landing page from scratch that showcases SRL's capabilities and generates client inquiries.
**Status:** MVP / Phase 1 - Greenfield Development

---

## 1. Company Overview (from Company Profile)

| Detail | Info |
| --- | --- |
| **Legal Name** | SRL Property and Projects Pty (Ltd) |
| **Founding Year** | 2017 |
| **Founder / CEO** | Kagiso Namolela Isaac Choeu |
| **Employees** | 4 (core team) |
| **Industry** | Construction, Supply, Delivery, Transportation & Projects |
| **BBBEE Status** | Level 1 Contributor |
| **SARS Status** | Compliant |
| **CIDB Registration** | Civil Engineering (CE) & General Building (GB) |
| **Phone** | 082 369 5294 |
| **Email** | info@srlproperty.co.za |
| **Website** | www.srlproperty.co.za |
| **Address** | 3131A Crane Street, Thatchfield Hills, Rua Vista X13, Centurion, Gauteng, 0157 |

### Core Values
- **Reliability** - Dependable services, on time, every time.
- **Integrity** - Honesty, transparency, and ethical practices.
- **Excellence** - Highest standards of quality.
- **Customer Focus** - Clients' goals shape our approach.
- **Innovation** - Continuous improvement and smarter methods.
- **Community** - Level 1 BBBEE contributor committed to transformation.

### Past Project Experience (credibility signals)
1. **City of Ekurhuleni** (sub-contract under Sithembe) - Supply & delivery of PPE, 2020–2023
2. **Bela-Bela Local Municipality** - Supply & delivery of PPE for EPWP participants, 2019–2022
3. **Thabazimbi Municipality** - Supply, delivery & distribution of PPE, 2021–2024
4. **Capricorn District Municipality** - Specialised PPE for Energy Department, 2015–2018

## 2. Product Goals

- **Primary:** Establish a credible, professional web presence for SRL Property and Projects.
- **Secondary:** Generate leads via phone, WhatsApp, and email for tenders, supply & delivery contracts, and construction projects.
- **Tertiary:** Showcase BBBEE Level 1 status, CIDB registration, and past municipal experience to build trust.

## 3. Target Audience

| Segment | Intent | Device Split |
| --- | --- | --- |
| Municipal / government procurement | Tender compliance, BBBEE verification, CIDB checks | Desktop |
| Private sector contractors | Sub-contracting, supply chain partnerships | Desktop + Mobile |
| Property owners / developers | Construction, building, or cleaning services | Mobile |
| Facilities managers | Cleaning services, road markings, general building | Mobile |

## 4. Design Direction

### 4.1 Visual Identity

| Token | Suggestion | Rationale |
| --- | --- | --- |
| Palette | Clean professional - whites, warm greys, deep navy or forest green accent | Trust, stability, quality - distinct from STP's dark industrial |
| Font | Inter (sans-serif) - shared via `@repo/tailwind` | Consistency across the monorepo |
| CTAs | Bold accent colour on clean backgrounds | High contrast for conversion |

**Design Principle:** "Trusted & Capable" - clean, professional layout emphasising credentials (BBBEE, CIDB) and past municipal clients.

### 4.2 Design Personality

| Attribute | How It Manifests |
| --- | --- |
| Trustworthy | BBBEE Level 1 badge, CIDB registration, SARS compliance visible early |
| Capable | Past projects with municipalities, clear service descriptions |
| Professional | Clean layouts, minimal copy, consistent spacing |
| Local | Centurion / Gauteng focused |

## 5. Page Sections (MVP)

### 5.1 Hero Section (Above the Fold)

- **Background**: Full-width gradient or hero image (construction/cleaning services visual).
- **Company name**: `"SRL Property and Projects"`
- **Tagline**: `"Reliable Construction, Supply & Cleaning Services - Since 2017"`
- **Subheadline**: "BBBEE Level 1 | CIDB Registered (CE & GB) | SARS Compliant - Serving Gauteng with integrity and excellence."
- **Primary CTA**: `"Call 082 369 5294"` - tel link.
- **Secondary CTA**: `"Our Services"` - scrolls to services.
- **Trust badges row**: BBBEE Level 1, CIDB CE+GB, SARS Compliant, 7+ Years Experience - compact row below CTAs.

### 5.2 Services / What We Do

- **Heading**: `"Our Services"`
- **Layout**: 5-card responsive grid (2 rows on desktop, 1 column on mobile).
- **Cards**:
  1. 🏗️ **Civil Engineering (CE)** - "Design, construction, and maintenance of roads, bridges, water systems, earthworks, and infrastructure."
  2. 🏠 **General Building (GB)** - "Residential, commercial, and industrial construction - new builds, renovations, and maintenance."
  3. 🚚 **Supply & Delivery** - "Efficient procurement, supply, and timely delivery of quality materials, equipment, and goods."
  4. 🧹 **Cleaning Services** - "Professional cleaning for municipalities, government facilities, and public spaces - street cleaning, waste management, park upkeep."
  5. 🛣️ **Road Markings** - "High-quality road markings for highways, streets, parking lots, and municipal roads - safety and durability compliant."

### 5.3 Why Choose SRL

- **Heading**: `"Why SRL Property and Projects?"`
- **Layout**: 6 compact value props (icon + short text):
  - 🏆 **BBBEE Level 1** - Maximum procurement recognition
  - ✅ **CIDB Registered** - CE & GB classes
  - 🏛️ **Municipal Experience** - City of Ekurhuleni, Bela-Bela, Thabazimbi, Capricorn
  - 👥 **Skilled Team** - Small team, big accountability
  - 🗣️ **Transparent Communication** - Regular updates, honest reporting
  - 📍 **Centurion Based** - Serving all Gauteng

### 5.4 Past Projects / Track Record

- **Heading**: `"Our Track Record"`
- **Content**: List key past municipal contracts (compact, no detail pages).
- Each entry: Municipality name, project type, contract years.
- **MVP note**: Simple text list. Post-MVP could become case studies.

### 5.5 Contact Section

- **Heading**: `"Get in Touch"`
- **Subtext**: "Interested in a tender partnership, need construction services, or have a supply requirement? Let's talk."
- **Contact methods**:
  - Phone: `082 369 5294`
  - Email: `info@srlproperty.co.za`
  - Website: www.srlproperty.co.za
  - Address: 3131A Crane Street, Thatchfield Hills, Centurion, Gauteng

### 5.6 Footer

- Company name: SRL Property and Projects Pty (Ltd)
- Phone, email, website, address
- BBBEE Level 1 | CIDB CE & GB | SARS Compliant
- © SRL Property and Projects

## 6. Technical Requirements

### 6.1 Stack

| Layer | Technology |
| --- | --- |
| Framework | Astro v6 |
| Styling | Tailwind CSS v4 (`@repo/tailwind`) |
| Icons | Inline SVGs or emoji |
| Fonts | Inter (shared via `@repo/tailwind`) |
| Deployment | Static (SSG) - no server needed for MVP |

### 6.2 New App Scaffold

```
apps/srl/
├── astro.config.mjs        # port: 4324
├── package.json            # "name": "srl"
├── tsconfig.json
├── public/
│   └── favicon.svg
└── src/
    ├── data/
    │   └── site.ts          # Contact info, CIDB, services
    ├── layouts/
    │   └── SrlLayout.astro  # Extends BaseLayout
    ├── pages/
    │   └── index.astro      # Landing page
    └── components/          # Section components as needed
```

### 6.3 Performance Budget

| Metric | Target |
| --- | --- |
| LCP | ≤ 1.5s |
| TBT | ≤ 100ms |
| CLS | ≤ 0.05 |
| Page weight | ≤ 200 KB (no images) |
| Lighthouse score | ≥ 90 (Mobile) |

### 6.4 SEO (MVP)

- `<title>`: `"SRL Property and Projects | Construction, Supply & Cleaning - Centurion, Gauteng"`
- `<meta description>`: Summary of SRL's services, BBBEE Level 1, CIDB registration, and service area.
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`.
- JSON-LD `LocalBusiness` schema (reuse pattern from STP).
- Open Graph meta tags for social sharing.

## 7. Reusable Components (from `@repo/tailwind` and `apps/stp`)

| Component | Source | Purpose |
| --- | --- | --- |
| `BaseLayout.astro` | `@repo/tailwind/layouts/BaseLayout.astro` | HTML shell, font loading, meta |
| `WhatsAppButton.astro` | Copy pattern from STP | Floating WhatsApp CTA |
| `StickyMobileBar.astro` | Copy pattern from STP | Mobile sticky CTA bar |
| `LocalBusinessSchema.astro` | Copy pattern from STP | JSON-LD structured data |

## 8. Acceptance Criteria

1. Landing page loads fully in ≤ 2.5s on 3G mobile.
2. All contact methods (phone, email, website) are functional with correct links.
3. BBBEE Level 1 and CIDB registration badges visible without scrolling.
4. Page is fully responsive (320px–1920px).
5. Lighthouse ≥ 90 Mobile: Performance, Accessibility, Best Practices.
6. JSON-LD structured data validates with Google Rich Results Test.
7. No JavaScript console errors.

## 9. Implementation Order (Rapid Development)

| Step | Task | Est. Time |
| --- | --- | --- |
| 1 | Scaffold `apps/srl/` (copy `apps/lme/` structure, update config) | 15 min |
| 2 | Add `@source` paths for `apps/srl` in `packages/tailwind/src/styles.css` | 5 min |
| 3 | Create `src/data/site.ts` with contact info, CIDB, services | 10 min |
| 4 | Create `SrlLayout.astro` with branded header + footer | 30 min |
| 5 | Build hero section with trust badges | 20 min |
| 6 | Build services section (5 cards) | 25 min |
| 7 | Build "Why SRL" value props | 15 min |
| 8 | Build track record / past projects section | 15 min |
| 9 | Build contact section + footer | 15 min |
| 10 | Add WhatsApp button + sticky mobile bar | 15 min |
| 11 | Add JSON-LD schema + SEO meta | 10 min |
| 12 | Add `turbo.json` task for SRL if needed | 5 min |
| 13 | Test Lighthouse, responsiveness, links | 15 min |
| | **Total** | **~3 hours** |

## 10. Post-MVP Enhancements (Explicitly Out of Scope)

- Contact form with Resend integration
- Individual project / case study pages
- Service detail pages
- Image gallery for past projects
- Downloadable company profile PDF
- Client testimonials section
- Blog / company news
