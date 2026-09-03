# Migration Strategy — Operations Platform

**Project:** STP Group Operations Platform  
**Status:** Proposed  
**Scope:** STP and LME websites, operational inventory and enquiry workflows

---

## 1. Purpose

This document defines how the existing STP and LME operational data and public workflows will be migrated into the shared Operations Platform without disrupting current website functionality.

The migration must be incremental. Existing public services remain operational while the new API, database and administration application are introduced and validated.

---

## 2. Migration Principles

1. Do not perform a big-bang migration.
2. Preserve existing public website functionality during transition.
3. Establish the new database as the authoritative operational data store only after validation.
4. Never migrate data without defining ownership and source-of-truth rules.
5. Preserve historical operational records where they have business value.
6. Do not expose internal ownership, cost or operational data through public APIs.
7. Validate migrated records before enabling operational workflows.
8. Keep migrations repeatable and version controlled.
9. Back up source data before every production migration.
10. Record migration activities and exceptions.

---

## 3. Target State

```text
STP Website ─────┐
                 ├──► Operations API ──► Neon PostgreSQL
LME Website ─────┘             ▲
                               │
                       Operations Admin
```

The target state has one operational data source for:

- equipment types
- physical assets
- companies
- customers
- enquiries
- quotes
- allocations
- maintenance
- availability
- audit records

The websites consume approved API representations rather than maintaining independent operational inventories.

---

## 4. Migration Phases

### Phase 0 — Inventory Current Systems

Document the existing:

- STP catalogue
- LME catalogue
- equipment records
- enquiry forms
- quote processes
- customer records
- spreadsheets
- operational registers
- maintenance records
- existing APIs or integrations
- manually maintained data

Output:

```text
Current-State Data Inventory
```

### Phase 1 — Build Target Schema

Implement the approved Neon PostgreSQL schema using Drizzle ORM.

Create:

- tables
- indexes
- foreign keys
- constraints
- status fields
- migrations
- seed/reference data

No public website is switched yet.

### Phase 2 — Import Reference Data

Import relatively stable data first:

1. Companies
2. Equipment types
3. Assets
4. Locations
5. Reference/status data

Validate relationships and identifiers.

### Phase 3 — Import Customers and Historical Records

Migrate:

- customers
- enquiries
- quotes
- allocations
- maintenance history where available

Historical records should retain their original dates and references where possible.

### Phase 4 — Validate Operational Data

Perform reconciliation between the source systems and the Operations database.

Validation must cover:

- record counts
- equipment types
- asset identifiers
- ownership
- management responsibility
- customer records
- active enquiries
- active allocations
- maintenance periods
- date ranges
- duplicate records
- missing relationships

### Phase 5 — Introduce API Consumption

Switch public catalogue reads to the Operations API while keeping existing pages and presentation intact.

```text
Before:
Website → Local/Static Catalogue

After:
Website → Operations API → Neon
```

The website should continue to own presentation, SEO and public content while the API owns operational data.

### Phase 6 — Migrate Enquiry Submission

Replace existing operational enquiry handling with:

```text
Public Form
    ↓
POST /api/v1/enquiries
    ↓
Validation
    ↓
Customer
    ↓
Enquiry
    ↓
Operations Admin
```

The old workflow remains available until the new workflow has been validated in production.

### Phase 7 — Enable Administration

Enable authenticated staff to manage:

- customers
- enquiries
- equipment
- assets
- quotes
- allocations
- maintenance

Lifecycle operations must use the API's business rules.

### Phase 8 — Decommission Legacy Operational Storage

Only after successful validation should duplicated operational storage be retired.

Static/public website content that is not operational data may remain in the websites.

---

## 5. Data Mapping

Every migrated field must have an explicit mapping.

Example:

| Legacy Field | Target Field | Transformation |
|---|---|---|
| Equipment Name | `equipment_types.name` | Normalize name |
| Equipment Category | `equipment_types.category` | Map to approved category |
| Machine Number | `assets.asset_number` | Preserve if unique |
| Owner | `assets.owner_company_id` | Resolve company |
| Customer Name | `customers.name` | Normalize whitespace |
| Customer Email | `customers.email` | Validate format |
| Start Date | `enquiries.start_date` | Convert to ISO date |
| End Date | `enquiries.end_date` | Convert to ISO date |

The final mapping must be maintained as part of the migration implementation.

---

## 6. Identifier Strategy

Existing business identifiers should be preserved where they are unique and reliable.

New internal UUIDs are generated by the target system.

Example:

```text
Legacy Asset Number → assets.asset_number
Legacy Quote Number → quotes.quote_number
Legacy Enquiry Number → enquiries.id/reference
```

A migration reference may be retained when required for traceability.

Do not use human-readable business numbers as database primary keys.

---

## 7. Duplicate Handling

Duplicates must be identified before import.

Potential duplicate keys include:

- email address
- phone number
- company registration/reference
- asset number
- equipment serial number
- quote number
- enquiry reference

Duplicates must be classified as:

```text
Exact duplicate
Possible duplicate
Valid separate record
```

Possible duplicates require review before consolidation.

---

## 8. Data Quality Rules

Migration must reject or quarantine records with critical problems such as:

- missing required fields
- invalid dates
- invalid email addresses
- unknown companies
- unknown equipment types
- duplicate asset identifiers
- impossible allocation periods
- invalid lifecycle states

Do not silently discard invalid data.

Use a migration exception report.

---

## 9. Ownership and Management Migration

Asset ownership and operational management are separate concepts.

```text
owner_company_id
managed_by_company_id
```

Migration must resolve both independently.

If ownership or management cannot be determined reliably, the asset must be flagged for review rather than assigning an assumed company.

---

## 10. Availability Migration

Availability is not imported as a permanent boolean state.

It is derived from:

```text
Asset status
+
Allocations
+
Maintenance
```

During migration, active allocations and maintenance periods must be imported before the new availability API is enabled.

Otherwise the platform may incorrectly show equipment as available.

---

## 11. Historical Data

Historical operational records should normally be retained when they provide:

- customer history
- quote history
- asset history
- maintenance history
- allocation history
- auditability
- commercial reference

Historical records should not be rewritten simply to fit current workflows.

Where the legacy lifecycle does not map exactly to the new lifecycle, retain the original reference/status information where appropriate and document the mapping.

---

## 12. Cutover Strategy

Production cutover should use a controlled sequence:

```text
Backup
  ↓
Freeze critical legacy changes
  ↓
Final migration
  ↓
Reconciliation
  ↓
API verification
  ↓
Enable new workflow
  ↓
Monitor
```

The cutover window should be as short as practical.

---

## 13. Rollback Strategy

Every production migration must have a rollback plan.

Rollback may involve:

- restoring the legacy website workflow
- disabling new API consumption
- reverting feature flags/configuration
- restoring database state from backup where required
- preserving new records created during the transition for later reconciliation

A rollback must not result in silent loss of enquiries, quotes, allocations or customer records.

---

## 14. Dual-Run Period

Where practical, critical workflows should operate under controlled dual validation for a limited period.

Example:

```text
Public Enquiry
      ↓
New Operations API
      ↓
Admin Workflow
      ↓
Validation against legacy process
```

Dual writing should be avoided unless there is a specific reconciliation mechanism because it increases the risk of divergent data.

Prefer one write source with temporary reporting/reconciliation against the legacy system.

---

## 15. Migration Tooling

Migration scripts should be version controlled and repeatable.

Recommended structure:

```text
scripts/
└── migration/
    ├── extract
    ├── transform
    ├── validate
    ├── load
    └── reconcile
```

The exact implementation may differ based on the source systems.

Migration scripts must never contain production credentials.

---

## 16. Reconciliation

After each migration stage, generate reconciliation results.

Minimum checks:

```text
Source record count
Target record count
Imported count
Rejected count
Duplicate count
Exception count
```

For operational entities, also reconcile important totals and active records.

Example:

```text
Source active assets:       84
Target active assets:       84
Difference:                  0
```

A migration stage is not complete until discrepancies are explained.

---

## 17. Migration Acceptance Criteria

Migration is accepted when:

- required source data has been mapped
- target schema is deployed
- reference data is valid
- assets have correct ownership/management
- customers are reconciled
- active enquiries are reconciled
- active allocations are reconciled
- maintenance conflicts are resolved
- availability produces expected results
- public catalogue data is correct
- enquiry submission succeeds through the API
- administration workflows operate correctly
- audit records are generated for relevant changes
- rollback procedures have been tested
- migration exceptions are documented

---

## 18. Migration Risks

| Risk | Mitigation |
|---|---|
| Duplicate records | Pre-migration duplicate detection |
| Incorrect asset ownership | Explicit ownership mapping and review |
| Lost historical data | Preserve source records and backups |
| Incorrect availability | Migrate allocations and maintenance first |
| Website outage | Incremental cutover |
| Divergent systems | Establish a single operational write source |
| Invalid legacy data | Validation and exception reporting |
| Failed migration | Tested rollback and backups |
| API failure after cutover | Controlled fallback and monitoring |

---

## 19. Migration Completion

Migration is complete when the Operations Platform is the authoritative operational source for STP and LME and legacy operational storage is no longer required for normal business operation.

The final state is:

```text
STP Website ─────┐
                 │
LME Website ─────┼──► Operations API ──► Neon
                 │
Operations Admin ┘
```

There should be one authoritative operational data model, one business-rule layer and one controlled path for operational writes.

---

## 20. Final Principle

> **Migration is not simply moving data from one database to another. It is the controlled transition from fragmented operational processes to one authoritative operational platform.**
