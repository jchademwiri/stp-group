# Product Requirements Document (PRD): STP Landing Page

**Site:** Sithembe Transportation and Projects (`apps/stp`)
**Also known as:** Sithembe Plant Hire (service division)
**Goal:** Rapidly develop a minimal yet modern, high-conversion landing page that serves as the primary entry point for Sithembe's plant hire, grass cutting, and desludging services.
**Status:** MVP / Phase 1

---

## 1. Company Overview (from Company Profile)

| Detail | Info |
| --- | --- |
| **Legal Name** | Sithembe Transportation and Projects (Pty) Ltd |
| **Trading As** | Sithembe Plant Hire (service brand for equipment rental) |
| **Focus Areas** | Built Environment, Civil Engineering, Electrical Engineering, Horticultural Services, Road Marking |
| **Service Regions** | Mpumalanga, Limpopo, Gauteng, North-West, Kwa-Zulu Natal |
| **CIDB Gradings** | 6 CE, 6 EP, 6 SH, 5 GB, 4 SK |
| **COIDA** | Registered |
| **Public Liability** | Insured |
| **Phone** | 079 758 1297 (Mobile/WhatsApp) |
| **Office Phone** | 012 880 3155 |
| **Email** | admin@sithembe.co.za |
| **Address** | 285 Erasmus Avenue, Raslow, A.H., Centurion, 0157, South Africa |
| **Business Hours** | Mon–Fri 07:00–17:00 · Sat 08:00–13:00 · Sun 08:00–12:00 |

### Key Differentiators
- Innovation-driven: implements advanced digital reporting software and technological solutions
- Projects completed across 5 provinces with plans for nationwide expansion
- Qualified professionals in Built Environment, Civil Engineering, Electrical Engineering, Horticultural services, and Road Marking

## 2. Product Goals

- **Primary:** Drive qualified leads via phone calls, WhatsApp messages, and quote form submissions.
- **Secondary:** Establish instant credibility by displaying CIDB grading, insurance, and operator credentials within the first scroll.
- **Tertiary:** Provide clear navigation to the three core service areas (Plant Hire, Grass Cutting, Desludging) and the About page.

## 2. Target Audience

| Segment | Intent | Device Split |
| --- | --- | --- |
| Site foremen / project managers | Need equipment delivered ASAP | Mobile-heavy |
| Estate managers / facilities teams | Recurring grass cutting or desludging | Desktop + Mobile |
| Homeowners (septic desludging) | Emergency / one-off service | Mobile-heavy |
| Municipal / government procurement | Compliance-check before engagement | Desktop |

## 3. Design Direction

### 3.1 Visual Identity (from existing `packages/tailwind/src/theme.css`)

| Token | Value | Usage |
| --- | --- | --- |
| `--color-charcoal` | `#1e1e24` | Main background |
| `--color-slate` | `#2a2a32` | Card / section backgrounds |
| `--color-safety` | `#ff9f1c` | CTAs, accents, active states |
| `--color-whatsapp` | `#25d366` | WhatsApp button |
| Font | Inter (sans-serif) | Body + headings |

### 3.2 Aesthetic Principles

- **Dark industrial**: Charcoal backgrounds with bright safety-orange CTAs - communicates ruggedness and professionalism.
- **Clean & minimal**: Ample whitespace (dark negative space), one primary CTA per section, no visual clutter.
- **Trust-first**: CIDB badges, insurance callouts, and response-time promises visible above the fold.
- **Performance-obsessed**: Lighthouse score target ≥ 95 on mobile. WebP images, lazy loading, minimal JS.

## 4. Page Sections (MVP)

### 4.1 Hero Section (Above the Fold)
- **Background**: Full-width gradient from `slate` to `charcoal` with subtle texture/pattern overlay.
- **Headline**: `"Equipment on site when you need it. Across Pretoria & Gauteng."`
- **Subheadline**: Brief value prop covering all three services + trust signals (CIDB, insured).
- **Primary CTA**: `"Call {phone}"` - tel link (highest converting action).
- **Secondary CTAs**: `"Browse plant hire"`, `"WhatsApp dispatch"`.
- **Trust badges row**: CIDB grades, COIDA, Public Liability Insurance - rendered as compact badge row directly below CTAs.

### 4.2 Services Overview
- **Layout**: 3-column card grid (stacks on mobile).
- **Cards**:
  1. **Plant Hire** - "Dropside trucks, bobcats, tractors, mowers, and handheld tools - with wet hire operators where required." → `/plant-hire`
  2. **Grass Cutting & Clearing** - "Commercial estates, highway verges, and overgrown plot reclamation." → `/services/grass-cutting`
  3. **Septic & Desludging** - "Septic tank emptying, grease trap cleaning, liquid waste extraction." → `/services/desludging`
- **Card styling**: Dark slate background, subtle border, safety-orange link/hover state.

### 4.3 Testimonials / Social Proof
- **Component**: `Testimonials.astro` (already exists).
- **Content**: Rotating or grid of 2–3 quotes from real clients.
- **Placement**: Below Services, before footer.

### 4.4 Footer
- **Col 1**: Business name, service area, business hours, phone, email, CIDB footer line.
- **Col 2**: Embedded OpenStreetMap showing Gauteng service area.
- **Sticky mobile bar**: Fixed-bottom bar with `"Get a quote"` and `"Call now"` buttons.

### 4.5 Global Overlays (already implemented)
- **Floating WhatsApp button**: Fixed bottom-right, pre-filled message.
- **Mobile nav**: Slide-down hamburger menu.

## 5. Technical Requirements

### 5.1 Stack (existing)

| Layer | Technology |
| --- | --- |
| Framework | Astro v6 |
| Styling | Tailwind CSS v4 (`@repo/tailwind`) |
| Email | Resend (`POST /api/quote`) |
| Icons | Inline SVGs (no icon library dependency) |
| Fonts | Inter (self-hosted or CDN) |
| Maps | OpenStreetMap embed (no Google Maps API key needed) |

### 5.2 Performance Budget

| Metric | Target |
| --- | --- |
| LCP | ≤ 1.5s |
| TBT | ≤ 100ms |
| CLS | ≤ 0.05 |
| Page weight | ≤ 300 KB (excluding fonts) |
| Lighthouse score | ≥ 95 (Mobile) |

### 5.3 SEO

- Unique `<title>` and `<meta description>` per route.
- JSON-LD `LocalBusiness` schema injected in `<head>` (already implemented in `LocalBusinessSchema.astro`).
- Semantic HTML: `<section>`, `<article>`, `<nav>`, `<footer>`.
- Open Graph / Twitter Card meta tags for social sharing.

## 6. Component Inventory (reuse existing)

| Component | File | Status |
| --- | --- | --- |
| `StpLayout.astro` | `src/layouts/StpLayout.astro` | ✅ Reuse |
| `BaseLayout.astro` | `@repo/tailwind/layouts/BaseLayout.astro` | ✅ Reuse |
| `TrustBadges.astro` | `src/components/TrustBadges.astro` | ✅ Reuse |
| `Testimonials.astro` | `src/components/Testimonials.astro` | ✅ Reuse |
| `WhatsAppButton.astro` | `src/components/WhatsAppButton.astro` | ✅ Reuse |
| `StickyMobileBar.astro` | `src/components/StickyMobileBar.astro` | ✅ Reuse |
| `LocalBusinessSchema.astro` | `src/components/LocalBusinessSchema.astro` | ✅ Reuse |

## 7. Acceptance Criteria

1. Hero section loads with trust badges visible without scrolling on mobile (viewport height ≤ 900px).
2. All three service cards link to correct internal routes.
3. Clicking "Call" button initiates a phone call on mobile devices.
4. WhatsApp button opens `wa.me` with pre-filled dispatch message.
5. Lighthouse score ≥ 95 on mobile for Performance, Accessibility, Best Practices.
6. JSON-LD structured data validates with Google Rich Results Test.
7. Mobile nav opens/closes smoothly with no CLS impact.

## 8. Post-MVP Enhancements (Explicitly Out of Scope)

- Interactive cost estimator for grass cutting.
- Live fleet availability badges.
- Before/after image comparison slider.
- Blog / articles section.
- Multi-language support.
- Client portal / account system.

---

## Implementation Notes

The landing page (`src/pages/index.astro`) already exists with hero, services grid, and testimonials. The PRD above codifies the current implementation as the MVP standard and provides a reference for any future redesign or optimization. Changes to the page should be measured against Lighthouse scores and conversion metrics (call clicks, WhatsApp opens, form starts).
