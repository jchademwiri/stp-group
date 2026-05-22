# Product Requirements Document (PRD): Sithembe Plant Hire & Grass Cutting Services

This document details the functional, design, content, and search optimization requirements for the Sithembe Plant Hire and Grass Cutting digital sections. It is structured to be framework-agnostic, defining what the application must do, and separates immediate MVP requirements from Post-MVP enhancements.

---

## 1. Product Goals & Core Objectives
*   **Primary Objective**: Generate qualified leads for Sithembe by driving phone calls, direct WhatsApp messages, and online form submissions.
*   **Secondary Objective**: Establish industry authority by displaying compliance, licensing, active CIDB grades, and specialized machinery specs.

---

## 2. Shared Specifications (MVP)

### A. General Design & Aesthetic Guide
*   **Theme & Colors**: Sleek industrial aesthetic. Charcoal backgrounds (`#1E1E24` or similar), dark slate components, clean white body text, and bright safety orange/yellow highlights (`#FF9F1C` or similar) for active states and CTAs.
*   **Typography**: Highly readable modern sans-serif typeface (e.g., Inter, Outfit, or Roboto).
*   **Trust Anchors**: Every page must render the standardized trust markers defined in the Copy Document:
    1.  *Accredited Operators Included* (where applicable).
    2.  *Public Liability Insured*.
    3.  *COIDA Registered*.
    4.  *CIDB Grading status* (Grades 6 CE, 6 EP, 6 SH, 5 GB, 4 SK).

### B. Image Specifications
*   **Format**: WebP (`.webp`) format required for all production assets to optimize page load speeds.
*   **Resolution**: Minimum `1200px` width by `800px` height (3:2 aspect ratio).
*   **File Naming**: Descriptive lower-case names separated by hyphens (e.g., `8-ton-dropside-truck.webp`).
*   **Alt Tags**: Every asset must carry descriptive alt text mapping to local search intent: `[Equipment Title] for hire in Pretoria, Gauteng - Sithembe Plant Hire`.

---

## 3. Page Requirements

### A. Plant Hire Marketing Page (Landing)
*Goal: Display the rental catalog clearly and funnel users to contact portals.*

*   **Hero Block**:
    *   Industrial background visual.
    *   Header strings and buttons matching the specifications in [copy.md](file:///d:/dev/websites/sithembe-official-website/docs/copy.md#2-plant-hire-landing-page-copy).
*   **Fleet Category Display**:
    *   Responsive layout rendering cards for the 8 fleet items detailed in [data-schema.md](file:///d:/dev/websites/sithembe-official-website/docs/data-schema.md#3-fleet-inventory-data-the-8-items).
    *   Each card displays: Primary WebP image, Title, Short Description, Availability Badge, and a CTA button linking to that item's details.
*   **Central Inquiry Form**:
    *   Positioned at the base of the page.
    *   Collects: Name, Phone, Email, Selected Equipment, Start Date, Duration, and Location.
*   **Floating WhatsApp Icon**:
    *   Static widget in the viewport corner linking to the primary WhatsApp line, pre-filled with the message template in [copy.md](file:///d:/dev/websites/sithembe-official-website/docs/copy.md#1-global-components-copy).

### B. Plant Details Page
*Goal: Provide detailed specifications to enterprise and municipal buyers.*

*   **Layout Elements**:
    *   **Main Media Area**: Large viewport rendering the primary image of the equipment.
    *   **Static Grid Gallery**: Render a layout grid of 2-3 supporting static photos directly underneath the main image (no complex carousels in MVP).
    *   **Technical Specifications Table**: Clean table listing key mechanical capacities (weight, reach, horsepower) as specified in [data-schema.md](file:///d:/dev/websites/sithembe-official-website/docs/data-schema.md#3-fleet-inventory-data-the-8-items).
    *   **Inquiry Anchor**: CTA buttons that load the contact form or trigger a custom WhatsApp chat for that specific item.

### C. Grass Cutting Services Page
*Goal: Showcase clearing and grounds maintenance capabilities.*

*   **Service Matrix**: Statically outlines the segments: Commercial Estates, Roadside Mowing, and Overgrown Land Reclamation.
*   **Machinery Grid**: Showcases the equipment deployed (Tractors, Ride-on mowers, and Brush cutters).
*   **Estimation Request Form**: Field elements capturing the estimated plot size (in hectares or square meters) and maintenance frequency.

---

## 4. Release Phase & Acceptance Criteria

### MVP Phase (Immediate Release)
*   **Scope**:
    *   Static plant hire catalog page listing all 8 equipment types.
    *   Dynamic detail pages for each equipment piece displaying specifications, static galleries, and custom WhatsApp links.
    *   Static Grass Cutting service page with custom quote inquiry forms.
    *   Floating WhatsApp action button active across all pages.
*   **Acceptance Criteria**:
    1.  All routing matches the paths defined in [routes.md](file:///d:/dev/websites/sithembe-official-website/docs/routes.md#1-canonical-url-map-navigation-structure).
    2.  All visual copies match the exact strings specified in [copy.md](file:///d:/dev/websites/sithembe-official-website/docs/copy.md).
    3.  All images are WebP format and load under 250ms on mobile viewports.
    4.  Forms validate required fields (Name, Phone, Location) before submission.
    5.  Clicking WhatsApp links launches a chat with the correct pre-filled query text.

### Post-MVP Phase (Iterative Rollout)
*   **Features & Acceptance Criteria**:
    1.  **Interactive Cost Estimator**:
        *   *Criteria*: Users must be able to slide a range input (Acreage) and select cutting type to output a calculated estimated range using the pricing logic:
            *   *Base rate per hectare*: $R_{\text{base}}$ (formula defined prior to code rollout).
    2.  **Interactive Thumbnail Carousels**:
        *   *Criteria*: The detail page gallery replaces static grids with a sliding thumbnail reel. Clicking thumbnails swaps the main display instantly without page reload.
    3.  **Before/After Split Image Slider**:
        *   *Criteria*: Horizontal slider showing overgrown vs. cleared properties. Must support touch/drag gestures.
    4.  **Live Status Indicators**:
        *   *Criteria*: System displays dynamic booking status badges based on state-flag variables in the data schema.
