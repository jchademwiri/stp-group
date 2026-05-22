# Development & Implementation Plan (Legacy — Next.js)

> **Use [implementation_plan_astro.md](./implementation_plan_astro.md)** for the active Astro build in `apps/stp`. This file is kept for reference only.

This document outlines the phased development plan for the Sithembe website expansion, mapping technical details, folder layouts, and implementation boundaries.

---

## 1. Technical Architecture & Next.js Structure

The development will follow Next.js (App Router) routing and component layouts:

```
src/
├── app/
│   └── (site)/
│       ├── plant-hire/
│       │   ├── page.tsx               # Fleet Listing (Landing) Page
│       │   └── [slug]/
│       │       └── page.tsx           # Dynamic Equipment Details Page
│       └── services/
│           └── grass-cutting/
│               └── page.tsx           # Grass Cutting Services Page
├── components/
│   ├── plant-hire/
│   │   ├── GallerySlider.tsx          # Gallery Display (Post-MVP: slider; MVP: grid)
│   │   ├── QuoteForm.tsx              # Fleet Inquiry Form
│   │   └── CostEstimator.tsx          # (Post-MVP) Grass Cutting Calculator
│   └── ui/
│       └── WhatsAppButton.tsx         # Floating WhatsApp CTA
└── data/
    └── plantFleet.ts                  # Static Equipment Data Source
```

---

## 2. Phase 1: MVP Technical Implementation Details

### A. Fleet Data Source (`src/data/plantFleet.ts`)
*   **Source of Truth**: Maps directly to the definitions in [data-schema.md](./data-schema.md#3-fleet-inventory-data-the-8-items).
*   **Properties**: `id`, `slug`, `title`, `category`, `shortDescription`, `longDescription`, `primaryImage`, `galleryImages`, `rates`, `specifications`, `availability`.
*   **Implementation**: Create this file at `src/data/plantFleet.ts` exporting the array of 8 equipment types exactly as defined.

### B. Inquiry Form Integration (`QuoteForm.tsx`)
*   **Form Action / Endpoint**:
    *   Since the current website lacks a backend email server/API route, the MVP form will submit requests using **Web3Forms** (a free developer tier form handler requiring only a client-side POST to `https://api.web3forms.com/submit`).
    *   **Fallback Method**: A client-side submission wrapper that opens the client's mail application using a formatted `mailto:` redirect containing the form parameters in the email body:
        ```text
        mailto:admin@sithembe.co.za?subject=New Plant Hire Inquiry - [Equipment]&body=Name: [Name]%0D%0APhone: [Phone]%0D%0ALocation: [Location]%0D%0AStart Date: [Date]%0D%0ADuration: [Duration]
        ```
*   **Fields expected**:
    *   `access_key` (Web3Forms API key)
    *   `name` (String, required)
    *   `email` (String, required)
    *   `phone` (String, required)
    *   `equipment` (String, required dropdown)
    *   `duration` (String, required dropdown)
    *   `location` (String, required)
    *   `message` (String, optional)

### C. Floating WhatsApp Component (`src/components/ui/WhatsAppButton.tsx`)
*   **Link Generation**:
    *   Renders a static floating anchor element.
    *   Constructs the URL using the pre-filled template from [copy.md](./copy.md#1-global-components-copy):
        `https://wa.me/27128803155?text=[EncodedMessage]`
*   **Styling**: Fixed positioning (`fixed bottom-6 right-6`), `z-index: 50`, `bg-[#25D366]` (WhatsApp Green), custom hover pulses, and a sliding text tooltip on hover.

### D. Image Configurations
*   **Format**: Convert all generated plant photography into `.webp` format.
*   **Image Components**: Use Next.js `<Image />` tags (or standard `<img>` if working framework-agnostically) configured with `width`, `height`, `priority` (for LCP optimizations on primary views), and `alt` properties configured as: `[Equipment Title] for hire in Pretoria, Gauteng - Sithembe Plant Hire`.

---

## 3. Phase 2: Post-MVP Technical Roadmap

### A. Dynamic Gallery Slider (`GallerySlider.tsx`)
*   **Packages**: Install `embla-carousel-react`.
*   **Logic**:
    *   Imports parent Carousel from shadcn/ui.
    *   Stores `activeIndex` state to control the main slide.
    *   Maps thumbnails in a sub-grid; clicking any index triggers `api.scrollTo(index)`.

### B. Interactive Cost Estimator (`CostEstimator.tsx`)
*   **Pricing Logic (Placeholder Formula)**:
    *   *Base Clearing Rate*: $R 5,000$ per hectare.
    *   *Light Mowing Rate*: $R 2,500$ per hectare.
    *   *Firebreak Rate*: $R 3,500$ per hectare.
    *   *Multipliers*:
        *   `Once-off`: $1.0\times$
        *   `Monthly`: $0.85\times$ (15% discount contract rate)
*   **State Management**: React state hooks capturing slider value changes and applying formula logic to output updated estimates instantly.

---

## 4. Verification & Deployment Checks

1. **Static compilation**: Verify clean TypeScript compiles by running:
   ```bash
   npx tsc --noEmit
   ```
2. **Dynamic Routing Validation**:
   *   Confirm each individual slug in [data-schema.md](./data-schema.md#3-fleet-inventory-data-the-8-items) builds correctly.
   *   Verify metadata output matches the values in [routes.md](./routes.md#2-seo-metadata-specifications).
3. **Core Web Vitals**: Test LCP and CLS on the plant listing and detail pages, ensuring webp assets keep PageSpeed scores above 90.
