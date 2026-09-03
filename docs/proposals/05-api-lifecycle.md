# API Lifecycle Operations

## 1. Purpose

The API must support the complete lifecycle of operational resources.

CRUD endpoints alone are not sufficient because several resources have business-driven state transitions that require validation, authorization, transactions, and audit logging.

The API therefore distinguishes between:

* **Resource operations** — create, read, update, archive
* **Lifecycle operations** — explicit state transitions
* **Action operations** — business actions that may affect multiple resources
* **Query operations** — availability, search, filtering, reporting

The API owns all lifecycle rules. Clients must not directly manipulate lifecycle state when a business transition requires validation.

---

## 2. Lifecycle Operation Pattern

Standard resource operations use:

```text
GET     /api/v1/resource
GET     /api/v1/resource/:id
POST    /api/v1/resource
PATCH   /api/v1/resource/:id
DELETE  /api/v1/resource/:id
```

Business lifecycle operations use explicit action endpoints:

```text
POST /api/v1/resource/:id/{action}
```

Examples:

```text
POST /api/v1/enquiries/:id/assign
POST /api/v1/enquiries/:id/convert-to-quote

POST /api/v1/quotes/:id/issue
POST /api/v1/quotes/:id/accept
POST /api/v1/quotes/:id/reject
POST /api/v1/quotes/:id/cancel

POST /api/v1/allocations/:id/reserve
POST /api/v1/allocations/:id/confirm
POST /api/v1/allocations/:id/start
POST /api/v1/allocations/:id/complete
POST /api/v1/allocations/:id/cancel

POST /api/v1/maintenance/:id/start
POST /api/v1/maintenance/:id/complete
POST /api/v1/maintenance/:id/cancel
```

This prevents clients from bypassing business rules by sending arbitrary status values.

---

# 3. Company Lifecycle

## Create Company

```http
POST /api/v1/companies
```

Creates a company that can own or manage assets and enquiries.

### Required

```json
{
  "name": "Example Construction",
  "code": "EXC"
}
```

### Response

```http
201 Created
```

---

## Update Company

```http
PATCH /api/v1/companies/:id
```

Updates editable company information.

---

## Deactivate Company

```http
POST /api/v1/companies/:id/deactivate
```

A company should normally be deactivated rather than physically deleted if historical records reference it.

### Rules

* Company cannot be deleted if referenced by historical records.
* Deactivated companies cannot receive new assignments.
* Existing historical records remain intact.

---

## Reactivate Company

```http
POST /api/v1/companies/:id/reactivate
```

Re-enables the company for operational use.

---

# 4. Equipment Type Lifecycle

## Create Equipment Type

```http
POST /api/v1/equipment-types
```

Creates a catalogue equipment type.

---

## Update Equipment Type

```http
PATCH /api/v1/equipment-types/:id
```

Updates catalogue information.

---

## Publish Equipment Type

```http
POST /api/v1/equipment-types/:id/publish
```

Makes the equipment type available to public catalogue consumers.

---

## Unpublish Equipment Type

```http
POST /api/v1/equipment-types/:id/unpublish
```

Removes the equipment type from the public catalogue without deleting historical records.

---

## Archive Equipment Type

```http
POST /api/v1/equipment-types/:id/archive
```

Archives an equipment type that is no longer offered.

### Rules

An archived equipment type:

* is not shown in the public catalogue
* cannot be used for new enquiries
* cannot be used for new allocations
* remains available to historical records

---

# 5. Asset Lifecycle

Assets represent physical equipment.

## Create Asset

```http
POST /api/v1/assets
```

Example:

```json
{
  "assetNumber": "STP-EXC-001",
  "equipmentTypeId": "uuid",
  "ownerCompanyId": "uuid",
  "managedByCompanyId": "uuid",
  "location": "Pretoria",
  "condition": "good"
}
```

New assets normally start as:

```text
available
```

---

## Update Asset

```http
PATCH /api/v1/assets/:id
```

Updates operational metadata such as:

* location
* condition
* owner
* manager
* notes

Ownership and management changes must be audited.

---

## Reserve Asset

```http
POST /api/v1/assets/:id/reserve
```

Reserves an asset for an approved operational allocation.

The API must verify that the asset is currently available.

---

## Release Asset

```http
POST /api/v1/assets/:id/release
```

Releases a reserved asset back into the available pool.

---

## Retire Asset

```http
POST /api/v1/assets/:id/retire
```

Marks an asset as permanently retired.

### Rules

An asset cannot be retired while:

* on hire
* actively allocated
* under an unresolved operational commitment

Historical allocations remain intact.

---

## Restore Asset

```http
POST /api/v1/assets/:id/restore
```

Restores a retired asset where permitted.

The API must determine the resulting operational status rather than allowing the client to arbitrarily choose it.

---

# 6. Customer Lifecycle

## Create Customer

```http
POST /api/v1/customers
```

Customers may be created:

* directly by staff
* during enquiry processing
* through the public enquiry flow

---

## Update Customer

```http
PATCH /api/v1/customers/:id
```

Updates customer information.

---

## Archive Customer

```http
POST /api/v1/customers/:id/archive
```

Customer records should generally be archived rather than deleted because enquiries, quotes, and allocations may reference them.

---

# 7. Enquiry Lifecycle

The enquiry lifecycle is:

```text
new
  ↓
reviewing
  ↓
quoted
  ↓
awaiting_customer
  ↓
confirmed
```

Alternative terminal states:

```text
declined
cancelled
```

## Create Enquiry

```http
POST /api/v1/enquiries
```

Public and authenticated clients may create enquiries depending on endpoint permissions.

---

## Start Review

```http
POST /api/v1/enquiries/:id/start-review
```

Transitions:

```text
new → reviewing
```

---

## Assign Enquiry

```http
POST /api/v1/enquiries/:id/assign
```

Example:

```json
{
  "companyId": "uuid",
  "userId": "uuid"
}
```

The API records both the assigned company and responsible staff member where applicable.

---

## Convert Enquiry to Quote

```http
POST /api/v1/enquiries/:id/convert-to-quote
```

Creates a draft quote from the enquiry.

Expected transition:

```text
reviewing → quoted
```

---

## Decline Enquiry

```http
POST /api/v1/enquiries/:id/decline
```

Example:

```json
{
  "reason": "Requested equipment unavailable for requested dates."
}
```

---

## Cancel Enquiry

```http
POST /api/v1/enquiries/:id/cancel
```

Used when the enquiry is withdrawn or no longer actionable.

---

# 8. Quote Lifecycle

Quote lifecycle:

```text
draft
  ↓
issued
  ↓
awaiting_customer
  ↓
accepted
```

Alternative states:

```text
rejected
expired
cancelled
```

## Create Quote

```http
POST /api/v1/quotes
```

Quotes should be generated from an enquiry.

---

## Update Draft Quote

```http
PATCH /api/v1/quotes/:id
```

Only editable while:

```text
status = draft
```

Once issued, financial terms should not be silently modified.

---

## Issue Quote

```http
POST /api/v1/quotes/:id/issue
```

Example:

```json
{
  "validUntil": "2026-10-15"
}
```

The API should:

1. validate quote lines
2. calculate totals
3. validate required customer information
4. assign/confirm quote number
5. record issue timestamp
6. audit the action
7. transition the quote to `issued`

---

## Accept Quote

```http
POST /api/v1/quotes/:id/accept
```

Acceptance should trigger the next operational stage.

Depending on the implementation, this may:

```text
Quote
  ↓ accepted
Enquiry
  ↓ confirmed
Allocation
  ↓ reserved
```

The operation should execute transactionally where multiple records are changed.

---

## Reject Quote

```http
POST /api/v1/quotes/:id/reject
```

Example:

```json
{
  "reason": "Customer selected another supplier."
}
```

---

## Cancel Quote

```http
POST /api/v1/quotes/:id/cancel
```

---

## Expire Quote

```http
POST /api/v1/quotes/:id/expire
```

Normally this should be triggered automatically by a scheduled process when:

```text
validUntil < currentDate
```

---

## Create Quote Version

```http
POST /api/v1/quotes/:id/revise
```

Creates a new quote version rather than modifying an issued quote.

Example:

```text
Q-2026-001 v1
Q-2026-001 v2
Q-2026-001 v3
```

This preserves historical pricing and terms.

---

# 9. Allocation Lifecycle

Allocation is the operational commitment of a specific asset to a customer/request.

Lifecycle:

```text
requested
  ↓
reserved
  ↓
confirmed
  ↓
active
  ↓
completed
```

Alternative:

```text
cancelled
```

## Create Allocation

```http
POST /api/v1/allocations
```

Example:

```json
{
  "assetId": "uuid",
  "enquiryId": "uuid",
  "customerId": "uuid",
  "companyId": "uuid",
  "startDate": "2026-10-01",
  "endDate": "2026-10-15"
}
```

---

## Reserve Allocation

```http
POST /api/v1/allocations/:id/reserve
```

Before reserving, the API must verify:

```text
asset.status = available
AND
no overlapping confirmed allocation
AND
no overlapping maintenance
```

If a conflict exists:

```http
409 Conflict
```

Example:

```json
{
  "error": {
    "code": "ASSET_ALLOCATION_CONFLICT",
    "message": "Asset is already allocated for the requested period."
  }
}
```

---

## Confirm Allocation

```http
POST /api/v1/allocations/:id/confirm
```

Confirms the operational commitment.

---

## Start Hire

```http
POST /api/v1/allocations/:id/start
```

Expected changes:

```text
allocation.status = active
asset.status = on_hire
```

These changes should occur within a database transaction.

---

## Complete Hire

```http
POST /api/v1/allocations/:id/complete
```

Expected changes:

```text
allocation.status = completed
asset.status = available
```

The API should also record:

* completion timestamp
* return condition where applicable
* operational notes

---

## Cancel Allocation

```http
POST /api/v1/allocations/:id/cancel
```

If the allocation had reserved an asset, the reservation must be released.

---

# 10. Maintenance Lifecycle

Maintenance lifecycle:

```text
scheduled
  ↓
in_progress
  ↓
completed
```

Alternative:

```text
cancelled
```

## Schedule Maintenance

```http
POST /api/v1/maintenance
```

Example:

```json
{
  "assetId": "uuid",
  "type": "service",
  "description": "500-hour service",
  "startDate": "2026-10-20",
  "endDate": "2026-10-22"
}
```

The API must check for conflicting allocations.

---

## Start Maintenance

```http
POST /api/v1/maintenance/:id/start
```

Expected:

```text
maintenance.status = in_progress
asset.status = maintenance
```

---

## Complete Maintenance

```http
POST /api/v1/maintenance/:id/complete
```

Expected:

```text
maintenance.status = completed
asset.status = available
```

The API must verify that no other active operational condition prevents the asset from becoming available.

---

## Cancel Maintenance

```http
POST /api/v1/maintenance/:id/cancel
```

---

# 11. Availability Lifecycle

Availability is calculated rather than stored as a permanent independent state.

For an asset to be available for a requested period:

```text
Asset status allows hire
AND
No overlapping allocation
AND
No overlapping maintenance
```

Endpoint:

```http
GET /api/v1/availability
```

Example:

```http
GET /api/v1/availability?equipmentTypeId=uuid&startDate=2026-10-01&endDate=2026-10-15&quantity=2
```

The response should identify suitable assets without exposing internal information to public clients.

---

# 12. Bulk Operations

Bulk operations may be introduced where operational efficiency requires them.

Examples:

```http
POST /api/v1/assets/bulk-import
POST /api/v1/assets/bulk-update
POST /api/v1/enquiries/bulk-assign
POST /api/v1/maintenance/bulk-schedule
```

Bulk operations must:

* validate every record
* execute transactionally where appropriate
* return per-record errors
* create audit records
* never partially modify data without explicitly documented behavior

Example response:

```json
{
  "processed": 10,
  "successful": 8,
  "failed": 2,
  "errors": [
    {
      "row": 4,
      "code": "INVALID_EQUIPMENT_TYPE"
    },
    {
      "row": 9,
      "code": "DUPLICATE_ASSET_NUMBER"
    }
  ]
}
```

---

# 13. Delete vs Archive

The API should avoid physical deletion of operational records.

### Prefer archive/deactivate for:

* companies
* customers
* equipment types
* assets
* users

### Avoid deletion for:

* enquiries
* quotes
* allocations
* maintenance records
* audit logs

Historical operational records form part of the system's audit trail.

Where deletion is technically required, it must be:

* authenticated
* authorized
* audited
* protected by foreign-key constraints
* restricted to records with no historical dependencies

---

# 14. Lifecycle Transition Validation

Every lifecycle action must validate the current state.

For example:

```text
POST /quotes/:id/accept
```

must reject:

```text
draft
rejected
expired
cancelled
```

and only permit:

```text
issued
```

Similarly:

```text
POST /allocations/:id/start
```

must verify:

```text
allocation.status = confirmed
asset.status = reserved
```

Invalid transitions should return:

```http
409 Conflict
```

Example:

```json
{
  "error": {
    "code": "INVALID_LIFECYCLE_TRANSITION",
    "message": "Allocation cannot be started from its current state."
  }
}
```

---

# 15. Idempotency

Lifecycle operations that may be retried by clients should be idempotent where practical.

Examples:

```text
POST /quotes/:id/accept
POST /allocations/:id/confirm
POST /allocations/:id/complete
```

Repeated requests should not create duplicate business effects.

For externally initiated operations, the API may support:

```http
Idempotency-Key: <unique-request-id>
```

This is particularly important for future:

* payment operations
* document generation
* notifications
* external integrations

---

# 16. Transactions

Lifecycle operations that modify multiple related records must use database transactions.

Example:

```text
Accept Quote
    ↓
Update Quote
    ↓
Update Enquiry
    ↓
Create/confirm Allocation
    ↓
Reserve Asset
    ↓
Create Audit Log
```

These changes should either all succeed or all roll back.

The API must never leave the system in a partially transitioned state.

---

# 17. Audit Requirements

The following actions must create audit records:

* create
* update
* archive/deactivate
* assignment
* ownership change
* quote issue
* quote acceptance/rejection
* allocation reservation
* allocation confirmation
* hire start
* hire completion
* cancellation
* maintenance start/completion
* asset retirement
* authentication/security-sensitive actions

Audit records should capture:

```text
userId
action
entityType
entityId
oldValues
newValues
timestamp
```

---

# 18. Notification Hooks

Notifications should be triggered by lifecycle events rather than directly from frontend clients.

Examples:

```text
Enquiry created
    → notify operations

Quote issued
    → notify customer

Quote accepted
    → notify operations

Allocation confirmed
    → notify responsible company

Hire completed
    → notify operations
```

The initial implementation may use Resend or another notification provider, while keeping notification dispatch behind an internal service boundary.

---

# 19. Lifecycle Event Model

The API should internally treat important transitions as domain events.

Example:

```text
QUOTE_ACCEPTED
ALLOCATION_RESERVED
ALLOCATION_CONFIRMED
HIRE_STARTED
HIRE_COMPLETED
MAINTENANCE_STARTED
MAINTENANCE_COMPLETED
ASSET_RETIRED
```

This provides a foundation for future integrations without coupling business logic directly to individual notification or reporting systems.

---

# 20. Lifecycle Architecture

The complete lifecycle flow is:

```text
PUBLIC ENQUIRY
      │
      ▼
  CUSTOMER
      │
      ▼
  ENQUIRY
      │
      ├── assign
      │
      ▼
    QUOTE
      │
      ├── issue
      ├── revise
      ├── accept
      └── reject
      │
      ▼
  ALLOCATION
      │
      ├── reserve
      ├── confirm
      ├── start
      ├── complete
      └── cancel
      │
      ▼
    ASSET
      │
      ├── available
      ├── reserved
      ├── on_hire
      ├── maintenance
      └── retired
```

Maintenance operates alongside allocation:

```text
ASSET
  │
  ├── ALLOCATION
  │
  └── MAINTENANCE
```

Both affect availability.

---

# 21. API Design Principle

The frontend must not be responsible for enforcing business lifecycle rules.

For example, the frontend should **not** implement:

```typescript
if (quote.status === "issued") {
  quote.status = "accepted";
}
```

Instead it should call:

```http
POST /api/v1/quotes/:id/accept
```

The API determines whether the transition is valid.

Therefore:

```text
Frontend
   ↓
API Action
   ↓
Authorization
   ↓
Validation
   ↓
Business Rule
   ↓
Transaction
   ↓
Database
   ↓
Audit Event
   ↓
Response
```

This keeps STP, LME, the Operations Admin application, and future integrations consistent.

---

# 22. Lifecycle Acceptance Criteria

The API design is considered complete when:

* [ ] Every major resource has create/read/update lifecycle operations.
* [ ] Resources that require historical preservation support archive/deactivate operations.
* [ ] Enquiry lifecycle is explicitly defined.
* [ ] Quote lifecycle is explicitly defined.
* [ ] Quote revision/versioning is supported.
* [ ] Allocation lifecycle is explicitly defined.
* [ ] Asset operational lifecycle is explicitly defined.
* [ ] Maintenance lifecycle is explicitly defined.
* [ ] Invalid lifecycle transitions return `409 Conflict`.
* [ ] Allocation conflicts are checked server-side.
* [ ] Maintenance conflicts are checked server-side.
* [ ] Multi-record transitions use database transactions.
* [ ] Lifecycle operations are audited.
* [ ] Important lifecycle operations are idempotent where appropriate.
* [ ] Public clients cannot invoke internal lifecycle operations.
* [ ] API clients cannot bypass business rules by directly changing status values.
* [ ] Lifecycle events provide a foundation for notifications and future integrations.

---

## Final Principle

> **CRUD manages resources. Lifecycle operations manage the business.**

The Operations API should therefore expose explicit business actions wherever a state transition has operational, financial, availability, authorization, or audit implications.
