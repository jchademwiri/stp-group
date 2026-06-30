# Product Requirements Document (PRD): LME Landing Page

**Site:** Livhu & Musa Enterprise (`apps/lme`)
**Goal:** Rapidly develop a minimal yet modern, professional landing page from scratch that establishes LME's brand presence and generates inquiries.
**Status:** MVP / Phase 1 — Greenfield Development

---

## 1. Company Overview (from Company Profile)

| Detail | Info |
| --- | --- |
| **Legal Name** | Livhu and Musa Enterprise |
| **Founding Year** | 2014 |
| **Founder / CEO** | Johannes Mduduzi Mahlangu |
| **Employees** | 10+ |
| **Industry** | Construction — residential and commercial projects |
| **CIDB Gradings** | 1CE (Civil Engineering), 1GB (General Building), 1EP (Electrical Engineering) |
| **SARS Status** | Compliant |
| **Core Values** | Excellence, Partnership, Sustainability, Integrity |
| **Phone** | 012 880 1893 |
| **Email** | info@livhuandmusa.co.za |
| **Address** | 3138B Crane Street, Thatchfield Hills, Rua-Vista X13, Centurion, Gauteng, 0157 |

### Ongoing Contracts (City of Tshwane — credibility signals)
- Supply, delivery & offloading of manhole covers (Water & Sanitation)
- Hire of mobile drinking water tankers (10,000–15,000L) for informal settlements
- Supply & delivery of emergency services rope rescue equipment
- Supply & delivery of HAZMAT equipment
- Supply, delivery & offloading of electrical cables, wire & conductors
- Corporate hire of general construction machines & equipment
- Corporate hire of general construction vehicles & refuse removal vehicles

### Equipment Assets
4x 8-ton trucks, 3x 1000L water tankers, 2x LDV bakkies, 1x excavator, 2x tipper trucks, 1x TLB, 1x tractor, 2x lowbed trucks, 4x stump grinding machines, 3x graders, 20x brush cutters, 2x trailers, 3x ride-on mowers, 5x chainsaws, 4x pole pruners, 8x leaf blowers.

## 2. Product Goals

- **Primary:** Establish a credible, professional web presence for Livhu and Musa Enterprise.
- **Secondary:** Drive inquiries via phone, WhatsApp, and a contact form for construction tenders, equipment hire, and project partnerships.
- **Tertiary:** Showcase CIDB gradings, active City of Tshwane contracts, and equipment fleet to build trust with government and private-sector clients.

## 3. Target Audience

| Segment | Intent | Device Split |
| --- | --- | --- |
| Municipal / government procurement | Tender compliance checks, vetting CIDB grades | Desktop |
| Private construction firms | Sub-contracting or equipment hire | Mobile + Desktop |
| Property developers | Residential/commercial project partnerships | Desktop |
| Local businesses & homeowners | Construction, electrical, or related services | Mobile-heavy |

## 4. Design Direction

### 4.1 Visual Identity Options

| Option A (Dark industrial — matches STP) | Option B (Light professional — differentiated) |
| --- | --- |
| Charcoal background, safety orange accents | Clean white/light grey, blue or green accents |
| Same `@repo/tailwind` theme, minimal overrides | Custom theme tokens |
| Fast to implement | More distinctive brand identity |
| Risk: LME looks like a sub-brand of STP | Risk: Slightly more setup time |

### 4.2 Design Principles

- **Trust-first**: CIDB gradings, SARS compliance, and active municipal contracts visible early.
- **Professional & capable**: Clean layout, emphasis on credentials and fleet/equipment strength.
- **Mobile-first**: Single-column on mobile, multi-column on desktop.
- **CTA-driven**: Every section funnels toward contact (call, WhatsApp, or quote request).

## 5. Page Sections (MVP)

### 5.1 Hero Section (Above the Fold)

- **Background**: Full-width gradient or hero image (construction site or equipment).
- **Company name**: "Livhu and Musa Enterprise"
- **Tagline**: `"Reliable Construction & Civil Engineering — Since 2014"`
- **Subheadline**: "CIDB-registered contractor (1CE, 1GB, 1EP) serving Gauteng with excellence, integrity, and innovation."
- **Primary CTA**: `"Call 012 880 1893"` — tel link.
- **Secondary CTA**: `"View Our Services"` — scrolls to services section.
- **Trust badges row**: CIDB grades (1CE, 1GB, 1EP), SARS Compliant, 10+ years experience — compact badge row below CTAs.

### 5.2 Services / What We Do

- **Heading**: `"Our Services"`
- **Layout**: 3-card responsive grid.
- **Cards**:
  1. **Civil Engineering (1CE)** — "Design, construction, and maintenance of infrastructure including roads, earthworks, and structural projects."
  2. **General Building (1GB)** — "Residential and commercial construction — new builds, renovations, alterations, and maintenance."
  3. **Electrical Engineering (1EP)** — "Electrical installations, cabling, and infrastructure for municipal and private-sector projects."
- Each card: icon (construction/building/electrical), title, 1–2 sentence description.

### 5.3 Equipment Fleet (Optional / Post-MVP)

- **Heading**: `"Our Fleet & Equipment"`
- **Content**: Key equipment highlights (8-ton trucks, excavator, TLB, graders, water tankers, etc.) as a compact grid or list showing capability.
- **MVP note**: Can be text list; Post-MVP could become an interactive gallery.

### 5.4 Why Choose LME

- **Heading**: `"Why Livhu and Musa Enterprise?"`
- **Layout**: 4 value props as icon + text items:
  - 🏗️ **10+ Years Experience** — Established 2014, 10+ employees
  - ✅ **CIDB Registered** — 1CE, 1GB, 1EP — fully compliant for public tenders
  - 🏛️ **Active Municipal Contracts** — City of Tshwane preferred supplier
  - 🤝 **Core Values** — Excellence, Partnership, Sustainability, Integrity

### 5.5 Active Projects / Credibility

- **Heading**: `"Current & Past Projects"`
- **Content**: List key City of Tshwane contracts as credibility markers (compact list, no detail pages).
- Can include a "View our company profile →" link if a downloadable PDF is available.

### 5.6 Contact Section

- **Heading**: `"Get in Touch"`
- **Subtext**: "Call, WhatsApp, or email us for tenders, equipment hire, or project inquiries."
- **Contact methods**:
  - Phone: `012 880 1893`
  - Email: `info@livhuandmusa.co.za`
  - Address: 3138B Crane Street, Thatchfield Hills, Centurion, Gauteng
- **Optional**: Simple contact form (Post-MVP for speed).

### 5.7 Footer

- Business name: Livhu and Musa Enterprise
- Phone, email, address
- Service area: Gauteng & beyond
- CIDB grades summary line

## 6. Technical Requirements

### 6.1 Stack

| Layer | Technology |
| --- | --- |
| Framework | Astro v6 |
| Styling | Tailwind CSS v4 (`@repo/tailwind`) |
| Email (if form) | Resend (shared pattern from STP) |
| Icons | Inline SVGs or emoji |
| Fonts | Inter (via existing theme) |
| Deployment | Static (SSG) — no server needed for MVP |

### 6.2 Files to Create

```
apps/lme/src/
├── data/
│   └── site.ts              # LME contact info, CIDB grades, services
├── layouts/
│   └── LmeLayout.astro      # LME layout (extend BaseLayout)
├── pages/
│   └── index.astro          # Landing page
└── components/              # Section components as needed
```

### 6.3 Performance Budget

| Metric | Target |
| --- | --- |
| LCP | ≤ 1.5s |
| TBT | ≤ 100ms |
| CLS | ≤ 0.05 |
| Page weight | ≤ 200 KB (no images) |
| Lighthouse score | ≥ 95 (Mobile) |

### 6.4 SEO (MVP)

- `<title>`: `"Livhu and Musa Enterprise | Construction & Civil Engineering — Centurion, Gauteng"`
- `<meta description>`: Descriptive summary incorporating CIDB grades, services, and location.
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

1. Landing page loads fully in ≤ 2s on 3G mobile.
2. All contact methods (phone, email) are functional with correct links.
3. CIDB grades and SARS compliance status are visible without scrolling.
4. Page is fully responsive (320px–1920px).
5. Lighthouse score ≥ 90 on Mobile for Performance, Accessibility, Best Practices.
6. JSON-LD structured data validates with Google Rich Results Test.
7. No JavaScript console errors.

## 9. Implementation Order (Rapid Development)

| Step | Task | Est. Time |
| --- | --- | --- |
| 1 | Create `apps/lme/src/data/site.ts` with contact info, CIDB, services | 10 min |
| 2 | Create `LmeLayout.astro` extending `BaseLayout` with header/footer | 30 min |
| 3 | Build hero section with trust badges | 25 min |
| 4 | Build services section (3 cards) | 20 min |
| 5 | Build "Why LME" section | 15 min |
| 6 | Build projects/credibility section (municipal contracts list) | 15 min |
| 7 | Build contact section + footer | 20 min |
| 8 | Add WhatsApp button + sticky mobile bar (patterns from STP) | 15 min |
| 9 | Add `LocalBusiness` JSON-LD schema + SEO meta | 10 min |
| 10 | Test Lighthouse, responsiveness, and links | 15 min |
| | **Total** | **~2.5 hours** |

## 10. Post-MVP Enhancements (Explicitly Out of Scope)

- Equipment fleet gallery with images
- Contact form with Resend integration
- Individual project / tender detail pages
- Blog / company news
- Downloadable company profile PDF
- Client testimonials
