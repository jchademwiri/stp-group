# Proposal 02: Shared Inventory API and Administration

**Status:** Follow-on implementation  
**Dependency:** Proposal 01 validates the public catalogue and enquiry flow  
**Consumers:** STP website, LME website, shared admin application

## 1. Purpose

Create one operational source of truth for plant and equipment used by both STP
and LME. The two brands remain separate on the public web, but the same people
manage stock, enquiries, quotations, allocations, and maintenance from one
admin application.

## 2. Target architecture

```text
STP website ───────┐
                    ├── Inventory and Enquiry API ─── Database
LME website ───────┘                  │
                                     └── Shared admin application
```

Recommended monorepo shape:

```text
apps/
  stp/
  lme/
  admin/
  inventory-api/

packages/
  inventory-types/
  api-client/
  validation/
  tailwind/
```

The API should be a database-backed application with explicit endpoints. It
does not need to begin as a separately deployed microservice; it can be
deployed with the admin application initially if that keeps operations simpler.
The boundary should remain clear so it can be separated later.

## 3. Core domain model

### Companies

```text
id
name
code: STP | LME
active
```

### Equipment types

```text
id
name
slug
category
description
specifications
images
```

### Assets

```text
id
assetNumber
equipmentTypeId
ownerCompanyId
managedByCompanyId
status
location
condition
notes
```

Ownership must not be confused with availability. An LME-owned asset may be
marketed or managed through STP, subject to the agreed operating rules.

### Enquiries and quotes

```text
enquiry
customer
requestedItems
location
startDate
duration
status
assignedCompanyId
```

Suggested enquiry statuses:

```text
new → reviewing → quoted → awaiting-customer → confirmed
                         └→ declined
```

### Maintenance and allocations

Add maintenance records and hire allocations so availability can eventually be
calculated from asset status, maintenance periods, and confirmed hires.

## 4. Admin capabilities

### Initial release

- Secure staff authentication.
- Register and edit companies, equipment types, and individual assets.
- Assign the owning company during asset registration.
- Set status: available, reserved, on-hire, maintenance, or retired.
- Review enquiries in one inbox.
- Prepare and record quotations.
- Assign an enquiry or hire to STP or LME.
- Search and filter by equipment, owner, status, and location.

### Later releases

- Maintenance schedules and service history.
- Hire agreements and document uploads.
- Delivery and collection scheduling.
- Deposits, invoices, and payment status.
- Utilisation and revenue reports by company.
- Audit trail for stock and quote changes.
- Role-based permissions.

## 5. API responsibilities

The API should provide typed, validated operations for:

- Listing public catalogue items.
- Reading equipment details.
- Creating enquiries.
- Reading and updating enquiries in admin.
- Managing companies, equipment types, and assets.
- Managing availability and maintenance.
- Creating and updating allocations.

Public consumers should receive only fields intended for customers. Internal
ownership notes, costs, and operational details must stay behind authenticated
admin endpoints.

## 6. Migration from Proposal 01

1. Preserve the public catalogue component interfaces.
2. Replace the local data import with the typed API client.
3. Map API responses to the existing public view model.
4. Import the initial static inventory as equipment types and individual assets.
5. Keep the existing enquiry experience while routing submissions to the API.
6. Add admin workflows incrementally without blocking the public catalogue.

The migration should not require a redesign of the STP or LME customer
experience.

## 7. Out of scope for the first backend release

- Marketplace access for external suppliers.
- Automatic dynamic pricing.
- Customer self-service accounts.
- Full accounting replacement.
- Automatic dispatch optimisation.
- Public exposure of company ownership.

## 8. Acceptance criteria

- STP and LME can consume the same catalogue and enquiry API.
- Staff can register an individual asset and assign its owning company.
- Staff can distinguish ownership, management responsibility, and availability.
- A customer enquiry can be reviewed, assigned, quoted, and confirmed.
- Confirmed allocations prevent the same asset being assigned twice for
  overlapping dates.
- Public responses do not expose internal fields.
- Existing static catalogue pages continue to work during migration.

## 9. Benefits

- One source of truth for shared equipment.
- No duplicated admin work between STP and LME.
- Clear ownership and accountability for every asset.
- Foundation for maintenance, scheduling, reporting, and finance integrations.
- Incremental migration rather than a disruptive rewrite.
