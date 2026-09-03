# Database Design — Operations Platform

**Project:** STP Group Operations Platform
**Version:** 1.0
**Status:** Proposed
**Database:** Neon PostgreSQL
**ORM:** Drizzle ORM
**Application:** Next.js / TypeScript
**Authentication:** Better Auth

---

## 1. Overview

The Operations Platform database provides the central data layer for the STP Group inventory, equipment hire and operational administration system.

The database is designed to support:

* Multiple operating companies
* Equipment types and catalogue information
* Individual physical assets
* Equipment ownership and management
* Customers
* Customer enquiries
* Enquiry items
* Quotes and quote versions
* Equipment allocations
* Maintenance
* Administration users
* Audit logging

The database acts as the **single source of truth** for operational information.

STP and LME public websites must not connect directly to the database. They consume approved information through the Operations API.

---

# 2. Database Architecture

```text
                    ┌─────────────────────┐
                    │     STP Website     │
                    │       Astro         │
                    └──────────┬──────────┘
                               │
                               │
                    ┌──────────▼──────────┐
                    │                     │
                    │   Operations API    │
                    │      Next.js        │
                    │                     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │                     │
                    │    Drizzle ORM      │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │ SQL
                               ▼
                    ┌─────────────────────┐
                    │  Neon PostgreSQL    │
                    │                     │
                    │  Operations Data    │
                    └─────────────────────┘
                               ▲
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    │    LME Website      │
                    │       Astro         │
                    │                     │
                    └─────────────────────┘
```

### Database Access Rule

Only the Operations application should have direct database access.

```text
STP ──────┐
          │
LME ──────┼──► Operations API ──► Drizzle ──► PostgreSQL
          │
Admin ────┘
```

This keeps business rules, validation and security within the API layer.

---

# 3. Design Principles

The database follows these principles:

1. **Single source of truth**
2. **Separation of catalogue and physical assets**
3. **Separation of ownership and management**
4. **Customers are reusable entities**
5. **Enquiries and quotes are separate entities**
6. **Allocations represent actual equipment bookings**
7. **Availability is determined by operational data**
8. **Maintenance can block equipment availability**
9. **Internal information is not exposed through public APIs**
10. **Relationships are enforced using foreign keys**
11. **Operational records contain timestamps**
12. **Important changes can be audited**
13. **Schema and migrations are version controlled**
14. **The database must support future expansion**

---

# 4. Entity Relationship Overview

```text
                         ┌──────────────┐
                         │  companies   │
                         └──────┬───────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
             users          assets        enquiries
                                │              │
                                │              │
                                ▼              ▼
                          maintenance    enquiry_items
                                               │
                                               ▼
                                            quotes
                                               │
                                               ▼
                                         quote_lines


equipment_types
       │
       ├──────────────► assets
       │
       ├──────────────► enquiry_items
       │
       └──────────────► quote_lines


customers
    │
    └──────────────► enquiries
                         │
                         ├──────────────► quotes
                         │
                         └──────────────► allocations
                                              │
                                              ▼
                                            assets


users
  │
  └──────────────► audit_logs
```

---

# 5. Tables

## 5.1 `companies`

Stores companies that own or manage equipment and operate within the platform.

### Columns

| Column       | Type      | Constraints      | Description               |
| ------------ | --------- | ---------------- | ------------------------- |
| `id`         | UUID      | PK               | Unique company ID         |
| `name`       | VARCHAR   | NOT NULL         | Company name              |
| `code`       | VARCHAR   | UNIQUE, NOT NULL | Short company code        |
| `active`     | BOOLEAN   | NOT NULL         | Whether company is active |
| `created_at` | TIMESTAMP | NOT NULL         | Creation timestamp        |
| `updated_at` | TIMESTAMP | NOT NULL         | Last update timestamp     |

### Initial Companies

```text
STP
LME
```

The schema should not prevent additional companies from being added later.

---

# 6. `users`

Stores application-level information for authenticated administration users.

Better Auth will manage authentication and session-related information.

### Columns

| Column       | Type      | Constraints       | Description            |
| ------------ | --------- | ----------------- | ---------------------- |
| `id`         | UUID      | PK                | User ID                |
| `company_id` | UUID      | FK → companies.id | User's company         |
| `name`       | VARCHAR   | NOT NULL          | User name              |
| `email`      | VARCHAR   | UNIQUE, NOT NULL  | Email address          |
| `role`       | VARCHAR   | NOT NULL          | Application role       |
| `active`     | BOOLEAN   | NOT NULL          | Whether user is active |
| `created_at` | TIMESTAMP | NOT NULL          | Creation timestamp     |
| `updated_at` | TIMESTAMP | NOT NULL          | Last update timestamp  |

### Initial Roles

```text
admin
manager
operations
sales
viewer
```

Role-based access can be expanded as the system grows.

---

# 7. `equipment_types`

Represents the equipment catalogue.

An equipment type is **not** an individual physical machine.

### Columns

| Column           | Type      | Constraints      | Description              |
| ---------------- | --------- | ---------------- | ------------------------ |
| `id`             | UUID      | PK               | Equipment type ID        |
| `name`           | VARCHAR   | NOT NULL         | Equipment name           |
| `slug`           | VARCHAR   | UNIQUE, NOT NULL | Public URL identifier    |
| `category`       | VARCHAR   | NOT NULL         | Equipment category       |
| `description`    | TEXT      | NULL             | Public description       |
| `specifications` | JSONB     | NULL             | Technical specifications |
| `images`         | JSONB     | NULL             | Image references         |
| `active`         | BOOLEAN   | NOT NULL         | Catalogue visibility     |
| `created_at`     | TIMESTAMP | NOT NULL         | Creation timestamp       |
| `updated_at`     | TIMESTAMP | NOT NULL         | Last update timestamp    |

### Example

```text
Equipment Type
└── Excavator
    ├── Asset STP-EXC-001
    ├── Asset STP-EXC-002
    └── Asset LME-EXC-001
```

---

# 8. `assets`

Represents individual physical equipment.

This is the primary operational equipment table.

### Columns

| Column                  | Type      | Constraints      | Description                |
| ----------------------- | --------- | ---------------- | -------------------------- |
| `id`                    | UUID      | PK               | Asset ID                   |
| `asset_number`          | VARCHAR   | UNIQUE, NOT NULL | Internal asset identifier  |
| `equipment_type_id`     | UUID      | FK               | Equipment type             |
| `owner_company_id`      | UUID      | FK               | Legal/economic owner       |
| `managed_by_company_id` | UUID      | FK               | Company managing the asset |
| `status`                | ENUM      | NOT NULL         | Current asset status       |
| `location`              | VARCHAR   | NULL             | Current location           |
| `condition`             | VARCHAR   | NULL             | Current condition          |
| `notes`                 | TEXT      | NULL             | Internal notes             |
| `created_at`            | TIMESTAMP | NOT NULL         | Creation timestamp         |
| `updated_at`            | TIMESTAMP | NOT NULL         | Last update timestamp      |

### Asset Status

```text
available
reserved
on_hire
maintenance
retired
```

### Ownership vs Management

These fields must remain separate:

```text
owner_company_id
managed_by_company_id
```

Example:

```text
Asset: LME-EXC-001

Owner:
LME

Managed By:
STP
```

This allows STP to manage or market equipment owned by LME.

---

# 9. `customers`

Represents customers who submit enquiries or hire equipment.

### Columns

| Column         | Type      | Constraints | Description           |
| -------------- | --------- | ----------- | --------------------- |
| `id`           | UUID      | PK          | Customer ID           |
| `name`         | VARCHAR   | NOT NULL    | Contact/person name   |
| `company_name` | VARCHAR   | NULL        | Customer company      |
| `email`        | VARCHAR   | NULL        | Email address         |
| `phone`        | VARCHAR   | NULL        | Telephone number      |
| `address`      | TEXT      | NULL        | Customer address      |
| `notes`        | TEXT      | NULL        | Internal notes        |
| `created_at`   | TIMESTAMP | NOT NULL    | Creation timestamp    |
| `updated_at`   | TIMESTAMP | NOT NULL    | Last update timestamp |

A customer can have multiple enquiries.

```text
Customer
   │
   ├── Enquiry 001
   ├── Enquiry 002
   └── Enquiry 003
```

---

# 10. `enquiries`

Represents an equipment or service request submitted by a customer.

### Columns

| Column                | Type      | Constraints | Description                 |
| --------------------- | --------- | ----------- | --------------------------- |
| `id`                  | UUID      | PK          | Enquiry ID                  |
| `customer_id`         | UUID      | FK          | Customer                    |
| `assigned_company_id` | UUID      | FK          | STP/LME responsible company |
| `location`            | VARCHAR   | NOT NULL    | Hire/project location       |
| `start_date`          | DATE      | NOT NULL    | Requested start             |
| `end_date`            | DATE      | NULL        | Requested end               |
| `duration`            | INTEGER   | NULL        | Requested duration          |
| `status`              | ENUM      | NOT NULL    | Enquiry status              |
| `notes`               | TEXT      | NULL        | Internal notes              |
| `created_at`          | TIMESTAMP | NOT NULL    | Creation timestamp          |
| `updated_at`          | TIMESTAMP | NOT NULL    | Last update timestamp       |

### Enquiry Status

```text
new
reviewing
quoted
awaiting_customer
confirmed
declined
cancelled
```

---

# 11. `enquiry_items`

Stores the equipment requested within an enquiry.

This should be a separate table rather than storing all requested equipment inside the enquiry as JSON.

### Columns

| Column              | Type    | Constraints | Description             |
| ------------------- | ------- | ----------- | ----------------------- |
| `id`                | UUID    | PK          | Enquiry item ID         |
| `enquiry_id`        | UUID    | FK          | Parent enquiry          |
| `equipment_type_id` | UUID    | FK          | Requested equipment     |
| `quantity`          | INTEGER | NOT NULL    | Quantity requested      |
| `notes`             | TEXT    | NULL        | Additional requirements |

### Example

```text
Enquiry #1001

2 × Excavators
1 × Grader
2 × Tipper Trucks
```

---

# 12. `quotes`

Represents a formal quotation generated from an enquiry.

One enquiry may have multiple quote versions.

### Columns

| Column         | Type      | Constraints | Description           |
| -------------- | --------- | ----------- | --------------------- |
| `id`           | UUID      | PK          | Quote ID              |
| `enquiry_id`   | UUID      | FK          | Related enquiry       |
| `quote_number` | VARCHAR   | UNIQUE      | Quote number          |
| `version`      | INTEGER   | NOT NULL    | Quote version         |
| `status`       | ENUM      | NOT NULL    | Quote status          |
| `subtotal`     | NUMERIC   | NOT NULL    | Subtotal              |
| `discount`     | NUMERIC   | NOT NULL    | Discount              |
| `vat`          | NUMERIC   | NOT NULL    | VAT amount            |
| `total`        | NUMERIC   | NOT NULL    | Final total           |
| `valid_until`  | DATE      | NULL        | Quote expiry          |
| `terms`        | TEXT      | NULL        | Terms and conditions  |
| `notes`        | TEXT      | NULL        | Internal notes        |
| `created_at`   | TIMESTAMP | NOT NULL    | Creation timestamp    |
| `updated_at`   | TIMESTAMP | NOT NULL    | Last update timestamp |

### Quote Status

```text
draft
issued
accepted
rejected
expired
cancelled
```

### Quote Versioning

```text
Enquiry #1001
     │
     ├── Quote 1001-V1
     ├── Quote 1001-V2
     └── Quote 1001-V3
```

---

# 13. `quote_lines`

Stores individual items and charges within a quote.

### Columns

| Column              | Type    | Constraints | Description                |
| ------------------- | ------- | ----------- | -------------------------- |
| `id`                | UUID    | PK          | Quote line ID              |
| `quote_id`          | UUID    | FK          | Parent quote               |
| `equipment_type_id` | UUID    | FK          | Equipment type             |
| `asset_id`          | UUID    | FK, NULL    | Specific asset if assigned |
| `description`       | TEXT    | NOT NULL    | Line description           |
| `quantity`          | NUMERIC | NOT NULL    | Quantity                   |
| `unit_price`        | NUMERIC | NOT NULL    | Price per unit             |
| `duration`          | NUMERIC | NULL        | Hire duration              |
| `total`             | NUMERIC | NOT NULL    | Line total                 |

An asset may remain `NULL` until a specific physical asset is allocated.

---

# 14. `allocations`

Represents an operational reservation or hire allocation against a physical asset.

This table is responsible for linking:

```text
Customer
    ↓
Enquiry
    ↓
Allocation
    ↓
Physical Asset
```

### Columns

| Column        | Type      | Constraints | Description           |
| ------------- | --------- | ----------- | --------------------- |
| `id`          | UUID      | PK          | Allocation ID         |
| `asset_id`    | UUID      | FK          | Physical asset        |
| `enquiry_id`  | UUID      | FK          | Related enquiry       |
| `customer_id` | UUID      | FK          | Customer              |
| `company_id`  | UUID      | FK          | Responsible company   |
| `start_date`  | DATE      | NOT NULL    | Allocation start      |
| `end_date`    | DATE      | NOT NULL    | Allocation end        |
| `status`      | ENUM      | NOT NULL    | Allocation status     |
| `notes`       | TEXT      | NULL        | Operational notes     |
| `created_at`  | TIMESTAMP | NOT NULL    | Creation timestamp    |
| `updated_at`  | TIMESTAMP | NOT NULL    | Last update timestamp |

### Allocation Status

```text
requested
reserved
confirmed
active
completed
cancelled
```

---

# 15. `maintenance`

Stores periods where an asset is unavailable because of maintenance or repair.

### Columns

| Column        | Type      | Constraints | Description           |
| ------------- | --------- | ----------- | --------------------- |
| `id`          | UUID      | PK          | Maintenance record    |
| `asset_id`    | UUID      | FK          | Asset                 |
| `type`        | ENUM      | NOT NULL    | Maintenance type      |
| `description` | TEXT      | NULL        | Work description      |
| `start_date`  | DATE      | NOT NULL    | Maintenance start     |
| `end_date`    | DATE      | NULL        | Maintenance end       |
| `status`      | ENUM      | NOT NULL    | Maintenance status    |
| `notes`       | TEXT      | NULL        | Additional notes      |
| `created_at`  | TIMESTAMP | NOT NULL    | Creation timestamp    |
| `updated_at`  | TIMESTAMP | NOT NULL    | Last update timestamp |

### Maintenance Types

```text
service
repair
inspection
breakdown
scheduled_maintenance
```

---

# 16. `audit_logs`

Records important changes made within the administration system.

### Columns

| Column        | Type      | Constraints | Description               |
| ------------- | --------- | ----------- | ------------------------- |
| `id`          | UUID      | PK          | Audit record              |
| `user_id`     | UUID      | FK          | User who performed action |
| `action`      | VARCHAR   | NOT NULL    | Action performed          |
| `entity_type` | VARCHAR   | NOT NULL    | Affected entity           |
| `entity_id`   | UUID      | NOT NULL    | Affected record           |
| `old_values`  | JSONB     | NULL        | Previous values           |
| `new_values`  | JSONB     | NULL        | New values                |
| `created_at`  | TIMESTAMP | NOT NULL    | Action timestamp          |

### Example

```text
User:
Admin User

Action:
UPDATE

Entity:
Asset

Asset:
STP-EXC-001

Old:
status = available

New:
status = maintenance
```

---

# 17. Relationships

## Company Relationships

```text
companies
    │
    ├── users
    │
    ├── owned assets
    │
    ├── managed assets
    │
    └── assigned enquiries
```

---

## Equipment Relationships

```text
equipment_types
      │
      ├── assets
      │
      ├── enquiry_items
      │
      └── quote_lines
```

---

## Customer Relationships

```text
customers
    │
    └── enquiries
          │
          ├── enquiry_items
          │
          ├── quotes
          │
          └── allocations
```

---

## Asset Relationships

```text
assets
  │
  ├── equipment_type
  │
  ├── owner_company
  │
  ├── managed_by_company
  │
  ├── maintenance
  │
  └── allocations
```

---

# 18. Availability Model

Asset availability must not rely exclusively on the `assets.status` field.

An asset can only be considered available for a requested period when:

```text
Asset is active
        AND
Asset status permits hiring
        AND
No conflicting confirmed allocation exists
        AND
No conflicting maintenance exists
```

### Example

```text
Requested:

01 October → 15 October


Asset:
STP-EXC-001


Existing Allocation:
05 October → 10 October
Status: confirmed
```

Result:

```text
NOT AVAILABLE
```

The API must perform this validation before creating a confirmed allocation.

---

# 19. Allocation Conflict Rule

The system must prevent overlapping allocations for the same physical asset.

Conceptually:

```text
Existing:
01 Oct ───────── 15 Oct
       CONFIRMED


Requested:
10 Oct ───────── 20 Oct
       CONFIRMED
```

Result:

```text
REJECT
```

The conflict check must occur server-side.

Where appropriate, PostgreSQL date-range/exclusion constraints should be considered to provide database-level protection in addition to application-level validation.

---

# 20. Ownership Model

Ownership is deliberately separated from management.

```text
                    ASSET
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
    OWNER COMPANY          MANAGED BY COMPANY
          │                       │
          ▼                       ▼
         LME                     STP
```

This supports cross-company equipment operations without duplicating assets.

---

# 21. Public vs Internal Data

The database may contain information that must never be exposed through the public API.

### Public

```text
Equipment name
Equipment category
Description
Specifications
Images
General availability
```

### Internal

```text
Owner
Management company
Purchase cost
Internal cost
Internal margin
Operational notes
Maintenance details
Customer records
Allocation details
Internal revenue
```

The API layer determines what information can be returned publicly.

---

# 22. Indexing Strategy

Indexes should be created for commonly searched fields.

### Companies

```text
companies.code
companies.active
```

### Equipment Types

```text
equipment_types.slug
equipment_types.category
equipment_types.active
```

### Assets

```text
assets.asset_number
assets.equipment_type_id
assets.owner_company_id
assets.managed_by_company_id
assets.status
assets.location
```

### Customers

```text
customers.email
customers.company_name
```

### Enquiries

```text
enquiries.customer_id
enquiries.status
enquiries.assigned_company_id
enquiries.start_date
```

### Allocations

```text
allocations.asset_id
allocations.enquiry_id
allocations.customer_id
allocations.company_id
allocations.start_date
allocations.end_date
allocations.status
```

### Maintenance

```text
maintenance.asset_id
maintenance.start_date
maintenance.end_date
maintenance.status
```

---

# 23. Primary Keys

UUIDs should be used as primary keys.

Example:

```text
id = 550e8400-e29b-41d4-a716-446655440000
```

Benefits:

* Safe for distributed systems
* Difficult to enumerate
* Suitable for API resources
* Avoids exposing sequential database IDs
* Works well with future integrations

Human-readable identifiers should still be used where useful.

Example:

```text
Asset:
STP-EXC-001

Quote:
STP-Q-2026-001

Enquiry:
ENQ-2026-001
```

---

# 24. Timestamps

Operational tables should include:

```text
created_at
updated_at
```

Where required, additional timestamps can be introduced:

```text
confirmed_at
cancelled_at
completed_at
```

All timestamps should be stored consistently in UTC at the database/application level.

---

# 25. Data Integrity

Foreign keys should be enforced at database level.

Examples:

```text
assets.equipment_type_id
    → equipment_types.id

assets.owner_company_id
    → companies.id

assets.managed_by_company_id
    → companies.id

enquiries.customer_id
    → customers.id

quotes.enquiry_id
    → enquiries.id

allocations.asset_id
    → assets.id
```

Records should not be deleted when doing so would break operational history.

Where appropriate, use:

```text
active = false
```

or status changes instead of destructive deletion.

---

# 26. Soft Deletion

For important operational entities, soft deletion should be preferred.

Potential field:

```text
deleted_at
```

This can be used for:

```text
customers
equipment_types
assets
users
```

Historical records such as quotes, allocations and maintenance records should generally remain available for reporting and audit purposes.

---

# 27. Database Migration Strategy

All schema changes must be managed through Drizzle migrations.

```text
Schema Change
     │
     ▼
Drizzle Schema
     │
     ▼
Migration Generated
     │
     ▼
Git Commit
     │
     ▼
Development Database
     │
     ▼
Testing
     │
     ▼
Production Migration
```

Migration files must be committed to GitHub.

Production database changes must never depend on manually editing the production database.

---

# 28. Proposed Project Structure

```text
apps/
  operations/
    app/
      api/
      admin/

    db/
      schema/
        companies.ts
        users.ts
        equipment-types.ts
        assets.ts
        customers.ts
        enquiries.ts
        enquiry-items.ts
        quotes.ts
        quote-lines.ts
        allocations.ts
        maintenance.ts
        audit-logs.ts

      index.ts
      migrations/

    auth/
    modules/
      inventory/
      customers/
      enquiries/
      quotes/
      allocations/
      maintenance/

packages/
  inventory-types/
  validation/
  api-client/
```

---

# 29. Future Database Extensions

The initial schema is intentionally designed to allow future modules.

Potential future tables include:

```text
hire_agreements
hire_agreement_items
deliveries
collections
drivers
vehicles
depots
documents
payments
invoices
deposits
suppliers
maintenance_costs
parts
service_providers
notifications
activity_logs
```

These should be introduced as separate modules rather than overloading the initial schema.

---

# 30. Future Finance Relationship

The Operations database is **not intended to replace the accounting system**.

Future financial functionality may connect to:

```text
Customer
    │
    ▼
Enquiry
    │
    ▼
Quote
    │
    ▼
Allocation / Hire
    │
    ▼
Invoice
    │
    ▼
Payment
```

Financial functionality should be introduced as a separate module when required.

---

# 31. Core Data Flow

The primary operational flow is:

```text
PUBLIC WEBSITE
      │
      │ Enquiry
      ▼
CUSTOMER
      │
      ▼
ENQUIRY
      │
      ├──────────────► ENQUIRY ITEMS
      │
      ▼
QUOTE
      │
      ▼
QUOTE ACCEPTED
      │
      ▼
AVAILABILITY CHECK
      │
      ├── Allocation conflict?
      │          │
      │          └── YES → Reject
      │
      ├── Maintenance conflict?
      │          │
      │          └── YES → Reject
      │
      ▼
ALLOCATION
      │
      ▼
ASSET
      │
      ▼
ON HIRE
      │
      ▼
COMPLETED
```

---

# 32. Database Design Summary

The database is centred around the following operational model:

```text
                 COMPANY
                    │
          ┌─────────┴─────────┐
          │                   │
       USERS                ASSETS
                              │
                    ┌─────────┴─────────┐
                    │                   │
              MAINTENANCE          ALLOCATION
                                        │
                                        │
CUSTOMER ───────► ENQUIRY ───────► QUOTE
                     │
                     ▼
               ENQUIRY ITEMS
                     │
                     ▼
              EQUIPMENT TYPE
```

The key separation is:

```text
EQUIPMENT TYPE
     ↓
WHAT WE OFFER


ASSET
     ↓
WHAT WE PHYSICALLY HAVE


ALLOCATION
     ↓
WHAT IS COMMITTED


MAINTENANCE
     ↓
WHAT IS UNAVAILABLE


ENQUIRY
     ↓
WHAT THE CUSTOMER REQUESTED


QUOTE
     ↓
WHAT WE OFFERED TO THE CUSTOMER
```

This structure provides a clean foundation for the STP/LME Operations Platform while allowing future expansion into hire agreements, dispatch, maintenance management, finance and reporting without redesigning the core inventory model.
