# Proposal 02: Shared Inventory API and Operations Administration

**Status:** Follow-on Implementation
**Dependency:** Proposal 01 — Public Catalogue and Enquiry Flow
**Consumers:** STP Website, LME Website, Shared Operations Administration

---

## 1. Objective

The objective of this proposal is to establish a **centralised inventory and operations platform** for STP and LME.

The platform will provide a single source of truth for:

* Equipment types and specifications
* Individual equipment assets
* Ownership and management
* Equipment availability
* Customers
* Enquiries
* Quotes
* Allocations and reservations
* Maintenance
* Operational administration

The public STP and LME websites will consume the same central API while maintaining their separate branding and customer-facing experiences.

---

## 2. Proposed Technology

| Layer                  | Technology          |
| ---------------------- | ------------------- |
| Public Websites        | Astro               |
| Operations Application | Next.js             |
| Language               | TypeScript          |
| Authentication         | Better Auth         |
| Database               | Neon PostgreSQL     |
| ORM                    | Drizzle ORM         |
| Validation             | Zod                 |
| Hosting                | Vercel              |
| API                    | Next.js API Routes  |
| Monorepo               | Turborepo           |
| Shared Types           | TypeScript packages |

---

## 3. Proposed Architecture

```text
                         ┌──────────────────┐
                         │   Neon PostgreSQL │
                         │   Single Source   │
                         │     of Truth      │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │ Operations API    │
                         │    Next.js        │
                         │                   │
                         │ Auth / Validation │
                         │ Business Logic    │
                         │ Drizzle ORM       │
                         └───────┬─────┬─────┘
                                 │     │
                    ┌────────────┘     └────────────┐
                    │                               │
             ┌──────▼──────┐                 ┌──────▼──────┐
             │ STP Website │                 │ LME Website │
             │   Astro     │                 │   Astro     │
             └─────────────┘                 └─────────────┘

                         ┌──────────────────┐
                         │ Operations Admin │
                         │     Next.js      │
                         └──────────────────┘
```

### Architectural Rule

Only the **Operations application/API** should communicate directly with Neon.

The public STP and LME applications must consume inventory and enquiry information through the API rather than connecting directly to the database.

---

## 4. Monorepo Structure

```text
apps/
  stp/
  lme/
  operations/

packages/
  inventory-types/
  api-client/
  validation/
  tailwind/
```

### Applications

* `stp` — STP public website
* `lme` — LME public website
* `operations` — Shared administration, authentication, API and business logic

### Shared Packages

* `inventory-types` — Shared TypeScript interfaces/types
* `api-client` — Typed API client used by STP and LME
* `validation` — Shared Zod schemas and validation rules
* `tailwind` — Shared design system and Tailwind configuration

---

# 5. Core Data Model

## 5.1 Companies

Companies represent the businesses participating in equipment ownership and management.

```text
Company
---------
id
name
code
active
createdAt
updatedAt
```

Initial company codes:

```text
STP
LME
```

The database should remain flexible enough to support additional companies later.

---

## 5.2 Users

Users are authenticated staff members who access the Operations application.

```text
User
---------
id
name
email
active
createdAt
updatedAt
```

Better Auth will manage authentication.

Role-based access control can be introduced as the administration platform grows.

Potential future roles:

```text
Admin
Manager
Operations
Sales
Viewer
```

---

## 5.3 Equipment Types

An equipment type represents a category/model of equipment rather than an individual physical asset.

```text
EquipmentType
--------------
id
name
slug
category
description
specifications
images
active
createdAt
updatedAt
```

Examples:

```text
Excavator
Backhoe Loader
Grader
Tipper Truck
Roller
Crane
```

Specifications may initially use PostgreSQL JSONB to allow different equipment categories to have different technical specifications.

Images should be stored using external/object storage rather than directly in the database.

---

## 5.4 Assets

An asset represents an individual physical piece of equipment.

```text
Asset
------
id
assetNumber
equipmentTypeId
ownerCompanyId
managedByCompanyId
status
location
condition
notes
createdAt
updatedAt
```

Example:

```text
Asset Number: STP-EXC-001
Equipment: Excavator
Owner: LME
Managed By: STP
Status: Available
Location: Pretoria
```

### Ownership vs Management

Ownership and management must remain separate.

For example:

```text
Owner:
LME

Managed / Marketed By:
STP
```

This allows equipment belonging to one company to be managed or made available by another company.

---

# 6. Asset Status

Initial asset statuses:

```text
available
reserved
on-hire
maintenance
retired
```

Status must not be used as the only mechanism for determining availability.

Actual availability must consider:

1. Asset status
2. Existing allocations
3. Maintenance periods
4. Requested hire dates

---

# 7. Customers

Customers should be a first-class entity rather than being stored only inside an enquiry.

```text
Customer
---------
id
name
companyName
email
phone
address
notes
createdAt
updatedAt
```

This allows the same customer to have multiple enquiries, quotes and future hire agreements.

---

# 8. Enquiries

An enquiry represents a customer's request for equipment or services.

```text
Enquiry
---------
id
customerId
location
startDate
endDate
duration
status
assignedCompanyId
notes
createdAt
updatedAt
```

Suggested statuses:

```text
new
reviewing
quoted
awaiting-customer
confirmed
declined
cancelled
```

An enquiry may request multiple equipment items.

---

# 9. Quote

Quotes should be separate from enquiries.

One enquiry may produce multiple quote versions.

```text
Quote
------
id
enquiryId
quoteNumber
version
status
subtotal
discount
vat
total
validUntil
terms
notes
createdAt
updatedAt
```

Quote statuses:

```text
draft
issued
accepted
rejected
expired
cancelled
```

A future quote line structure can support:

```text
QuoteLine
---------
id
quoteId
equipmentTypeId
assetId
description
quantity
unitPrice
duration
total
```

---

# 10. Allocations

Allocation is the operational link between an enquiry/customer and a specific asset.

```text
Allocation
-----------
id
assetId
enquiryId
customerId
companyId
startDate
endDate
status
notes
createdAt
updatedAt
```

Suggested statuses:

```text
requested
reserved
confirmed
active
completed
cancelled
```

The allocation system must prevent an asset from being allocated to overlapping confirmed hires.

---

# 11. Availability Rules

An asset is considered available when:

```text
Asset Status = available
```

AND:

```text
No overlapping confirmed/active allocation
```

AND:

```text
No overlapping maintenance period
```

Conceptually:

```text
Available Asset
       │
       ├── Asset status available?
       │
       ├── Existing allocation?
       │       └── Overlap?
       │
       └── Maintenance?
               └── Overlap?
```

This rule must be enforced by the API/business logic rather than relying only on frontend checks.

---

# 12. Maintenance

Maintenance records will track periods during which an asset cannot be allocated.

```text
Maintenance
------------
id
assetId
type
description
startDate
endDate
status
notes
createdAt
updatedAt
```

Possible maintenance types:

```text
service
repair
inspection
breakdown
scheduled-maintenance
```

Maintenance will be expanded in a later phase to include:

* Service history
* Maintenance schedules
* Costs
* Documents
* Service providers
* Parts
* Maintenance notifications

---

# 13. API

The Operations application will expose a versioned API.

Base path:

```text
/api/v1
```

## Public API

```text
GET    /api/v1/catalogue
GET    /api/v1/catalogue/:slug

POST   /api/v1/enquiries
```

Public responses must contain only customer-safe information.

They must not expose:

* Internal ownership notes
* Purchase costs
* Internal margins
* Internal operational notes
* Sensitive customer information
* Internal allocation information
* Private maintenance information

---

## Administration API

### Enquiries

```text
GET    /api/v1/admin/enquiries
GET    /api/v1/admin/enquiries/:id
PATCH  /api/v1/admin/enquiries/:id
```

### Customers

```text
GET    /api/v1/admin/customers
GET    /api/v1/admin/customers/:id
POST   /api/v1/admin/customers
PATCH  /api/v1/admin/customers/:id
```

### Equipment Types

```text
GET    /api/v1/admin/equipment-types
POST   /api/v1/admin/equipment-types
GET    /api/v1/admin/equipment-types/:id
PATCH  /api/v1/admin/equipment-types/:id
```

### Assets

```text
GET    /api/v1/admin/assets
POST   /api/v1/admin/assets
GET    /api/v1/admin/assets/:id
PATCH  /api/v1/admin/assets/:id
```

### Quotes

```text
GET    /api/v1/admin/quotes
POST   /api/v1/admin/quotes
GET    /api/v1/admin/quotes/:id
PATCH  /api/v1/admin/quotes/:id
```

### Allocations

```text
GET    /api/v1/admin/allocations
POST   /api/v1/admin/allocations
GET    /api/v1/admin/allocations/:id
PATCH  /api/v1/admin/allocations/:id
```

### Maintenance

```text
GET    /api/v1/admin/maintenance
POST   /api/v1/admin/maintenance
GET    /api/v1/admin/maintenance/:id
PATCH  /api/v1/admin/maintenance/:id
```

---

# 14. Authentication and Security

Better Auth will protect the Operations application and private API endpoints.

Public endpoints:

```text
GET /api/v1/catalogue
GET /api/v1/catalogue/:slug
POST /api/v1/enquiries
```

Administrative endpoints require authentication.

```text
/api/v1/admin/*
```

The API must perform server-side authorization and validation.

Frontend visibility must never be treated as a security boundary.

---

# 15. Audit Fields

Operational entities should include:

```text
createdAt
updatedAt
createdBy
updatedBy
```

This creates the foundation for a future audit trail.

A dedicated audit-log system can be introduced later.

---

# 16. Operations Administration

The Operations application will initially provide:

## Dashboard

* New enquiries
* Enquiries awaiting action
* Upcoming allocations
* Equipment currently on hire
* Equipment in maintenance
* Available equipment
* Basic operational summaries

## Equipment

* Equipment type management
* Asset registration
* Asset ownership
* Asset management company
* Status management
* Location
* Condition
* Search and filtering

## Enquiries

* View enquiries
* Review customer requests
* Assign enquiries
* Change status
* Create quotes
* Confirm bookings

## Customers

* Customer records
* Customer enquiry history
* Contact details
* Notes

## Quotes

* Prepare quotes
* Quote versions
* Quote lines
* Pricing
* Discounts
* VAT
* Terms
* Quote status

## Allocations

* Reserve equipment
* Confirm allocation
* Track hire period
* Prevent double allocation
* Complete/cancel allocations

## Maintenance

* Register maintenance
* Block equipment availability
* View maintenance periods
* Record maintenance history

---

# 17. Search and Filtering

The Operations application should support filtering by:

```text
Equipment Type
Asset Number
Owner
Managing Company
Status
Location
Condition
Customer
Enquiry Status
Allocation Status
Date Range
```

---

# 18. Data Relationships

The initial relationship model is:

```text
Company
  │
  ├── Equipment Type
  │       │
  │       └── Asset
  │             ├── Maintenance
  │             └── Allocation
  │
  └── Users


Customer
  │
  └── Enquiry
        │
        └── Quote
              │
              └── Allocation
                    │
                    └── Asset
```

---

# 19. Migration Strategy

The migration must preserve the existing public website experience.

### Step 1 — Preserve Existing Interfaces

Existing STP and LME catalogue interfaces remain functional.

### Step 2 — Introduce Typed API Client

Create:

```text
@repo/api-client
```

The websites will consume the API through the shared client.

### Step 3 — Map API Responses

Map API responses to the existing public catalogue view models.

This prevents the frontend from becoming tightly coupled to the database schema.

### Step 4 — Import Inventory

Existing/static catalogue data is imported into:

```text
Equipment Types
Assets
Companies
```

### Step 5 — Connect Enquiries

Existing enquiry forms are updated to submit to:

```text
POST /api/v1/enquiries
```

### Step 6 — Introduce Administration

The Operations application is introduced incrementally.

### Step 7 — Move Operational Data

Inventory, customers, enquiries, quotes, allocations and maintenance progressively become managed through Operations.

---

# 20. Database and API Rules

The following rules should be treated as architectural requirements:

1. STP and LME must not access Neon directly.
2. Operations owns the database schema and migrations.
3. All API input must be validated server-side.
4. Public APIs expose customer-safe information only.
5. Internal operational data requires authentication.
6. Asset ownership must be separate from management.
7. Asset availability must consider allocations and maintenance.
8. Confirmed allocations cannot overlap.
9. Enquiries and quotes must remain separate entities.
10. Customers must be reusable across multiple enquiries.
11. Database migrations must be version-controlled.
12. Production credentials must be stored in Vercel environment variables.
13. API contracts must use shared TypeScript types where appropriate.
14. Business rules must live in the API/service layer rather than only in the frontend.

---

# 21. Future Extensions

The architecture should allow the following without requiring a major redesign:

### Operations

* Delivery and collection
* Driver assignment
* Dispatch
* Hire agreements
* Equipment handover
* Equipment returns
* Damage reports

### Maintenance

* Service schedules
* Maintenance costs
* Parts
* Workshop management
* Service providers

### Finance

* Deposits
* Invoices
* Payments
* Customer balances
* Revenue reporting
* Equipment profitability

### Reporting

* Equipment utilisation
* Revenue by company
* Revenue by asset
* Revenue by equipment type
* Maintenance costs
* Asset performance
* Enquiry conversion
* Quote conversion

### Administration

* Role-based access control
* Audit trail
* Notifications
* Document management
* Activity history

---

# 22. Out of Scope

The following are not included in the initial implementation:

* Supplier marketplace
* Dynamic pricing engine
* Customer portal/accounts
* Full accounting system replacement
* Advanced dispatch optimisation
* Public ownership information
* Advanced fleet telematics
* Automated financial reconciliation

These may be considered in future proposals.

---

# 23. Acceptance Criteria

The implementation will be considered successful when:

* STP and LME consume a shared catalogue API.
* STP and LME can submit enquiries to the central system.
* Equipment types can be created and managed.
* Individual assets can be registered.
* Each asset has an identifiable owner.
* Ownership and management can be different companies.
* Asset availability can be determined from operational data.
* Overlapping confirmed allocations are prevented.
* Maintenance can block equipment availability.
* Customers can be stored and reused.
* Enquiries can be reviewed and assigned.
* Quotes can be created against enquiries.
* Allocations can be created against assets.
* Public API responses do not expose internal information.
* Better Auth protects administrative functionality.
* Neon PostgreSQL provides persistent storage.
* Drizzle manages the database layer and migrations.
* Operations can be deployed independently to Vercel.
* Existing public catalogue pages remain functional during migration.
* The architecture supports future maintenance, scheduling, finance and reporting modules.

---

# 24. Recommended Implementation Order

```text
Phase 1
Database schema
        ↓
Phase 2
API + validation
        ↓
Phase 3
Authentication
        ↓
Phase 4
Operations dashboard
        ↓
Phase 5
Equipment & asset management
        ↓
Phase 6
Customers & enquiries
        ↓
Phase 7
Quotes
        ↓
Phase 8
Allocations & availability
        ↓
Phase 9
Maintenance
        ↓
Phase 10
STP + LME API migration
        ↓
Phase 11
Reporting & operational enhancements
```

---

# 25. Final Architecture

The proposed system establishes the following structure:

```text
                     STP Website
                         │
                         │
                         ▼
                    Shared API
                         ▲
                         │
                     LME Website
                         │
                         │
                         ▼
              ┌─────────────────────┐
              │ Operations Platform │
              │      Next.js        │
              ├─────────────────────┤
              │ Authentication      │
              │ API                 │
              │ Business Logic      │
              │ Administration      │
              │ Validation          │
              └──────────┬──────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Neon PostgreSQL  │
                │  + Drizzle ORM  │
                └──────────────────┘
```

The result is a **central Operations Platform** that provides STP and LME with a shared, controlled inventory and enquiry infrastructure while keeping the public websites independent.

This architecture also provides the foundation for future equipment hire, maintenance, dispatch, finance and reporting functionality without requiring the public websites to be redesigned around the backend.
