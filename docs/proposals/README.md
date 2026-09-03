# Plant & Logistics Proposals

These proposals describe the staged delivery of STP's plant and equipment hire
capability.

## Proposals

1. [Proposal 01: Static Catalogue and Quote Enquiries](./01-static-catalogue-and-enquiries.md)
   - Launches the customer-facing experience now.
   - Uses typed local catalogue data and static marketing images.
   - Does not require a database or administration application.

2. [Proposal 02: Shared Inventory API and Administration](./02-shared-inventory-api-and-admin.md)
   - Adds the shared backend and admin application.
   - Supports equipment owned by STP or LME.
   - Uses Next.js, Better Auth, Neon Postgres, Drizzle ORM, and Vercel.
   - Replaces the static data source without requiring a redesign of the public catalogue.

## Recommended sequence

Deliver Proposal 01 first to begin marketing and collecting real customer
requirements. Build Proposal 02 once the catalogue, enquiry volume, operating
rules, and ownership requirements have been validated.

## Working principles

- STP and LME remain separate customer-facing brands.
- Inventory is managed from one shared operational system.
- Every asset has an owning company.
- Availability, ownership, and the company handling an enquiry are separate concepts.
- The initial customer action is requesting a quote, not completing online payment.
