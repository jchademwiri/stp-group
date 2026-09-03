# Proposal 01: Static Catalogue and Quote Enquiries

**Status:** Recommended for immediate implementation  
**Delivery target:** First public release  
**Application:** Existing `apps/stp` Astro application

## 1. Purpose

Launch a Plant & Logistics catalogue quickly while the shared inventory API and
admin system are being designed. Customers should get a shopping-style
experience for browsing equipment and assembling a quote enquiry, without
introducing a database or online checkout at this stage.

## 2. Scope

### Public catalogue

- Add a Plant & Logistics section to the STP website.
- Show equipment by category:
  - Water tanks
  - Transport
  - Mowing
  - Sanitation
- Provide a catalogue landing page and individual equipment detail pages.
- Include descriptions, specifications, quantity currently listed, images, and
  a clear request-a-quote action.
- Keep the layout responsive and suitable for mobile visitors.

### Enquiry journey

1. Customer browses the catalogue.
2. Customer selects equipment and requested quantities.
3. Customer reviews an enquiry list.
4. Customer submits contact and project details.
5. STP receives the enquiry and responds with a quotation.

The form should collect the customer's name, company, email, phone, required
equipment, quantity, start date, duration, location, and additional
requirements. Existing quote-email infrastructure may be reused where it fits.

### Initial inventory

| Equipment | Quantity |
| --- | ---: |
| 10,000-litre water tanks | 4 |
| 14,000-litre water tanks | 2 |
| 8-ton dropside trucks | 8 |
| Ride-on mowers | 5 |
| Walk-behind mowers | 6 |
| Honey suckers | 4 |

This represents 29 listed assets or units. The catalogue must avoid implying
real-time availability; use wording such as “subject to confirmation” or
“request a quote”.

## 3. Data approach

Create one typed catalogue data module, for example:

```text
apps/stp/src/data/plant-hire.ts
```

Each item should include an API-compatible shape:

```text
id
slug
name
category
description
specifications
quantity
ownerCompany
status
images
```

Use local images under:

```text
apps/stp/public/images/plant-hire/
```

Include `ownerCompany` and `status` from the beginning, even though the first
release may only show STP-owned equipment. This keeps the UI compatible with
the future shared inventory service.

## 4. Out of scope

- Customer accounts
- Online payment
- Automatic availability calculation
- Asset-level maintenance tracking
- Admin dashboard
- Database or API
- Automatic booking confirmation
- Guaranteed pricing shown publicly

## 5. Acceptance criteria

- A visitor can browse all six equipment types.
- Each equipment type has a useful detail page and image.
- A visitor can create an enquiry containing one or more equipment items.
- The enquiry includes dates, duration, location, and contact details.
- The team receives a complete enquiry that can be turned into a quotation.
- Catalogue content can be updated in one data file.
- The public pages make no unsupported real-time availability promises.
- The build and existing STP routes continue to pass.

## 6. Benefits

- Fastest route to market.
- No database or hosting complexity added immediately.
- Provides real catalogue content and customer feedback.
- Establishes the public component and data contract for the future API.

## 7. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Static quantities become outdated | Label them as indicative and review the data regularly. |
| Enquiries arrive through different channels | Use one standard enquiry form and message format. |
| Future API migration requires UI rewrites | Keep catalogue fields typed and API-compatible now. |
| Placeholder imagery reduces trust | Replace or supplement images with approved equipment photography. |
