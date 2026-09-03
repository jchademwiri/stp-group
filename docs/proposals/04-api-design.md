# API Design — Operations Platform

**Project:** STP Group Operations Platform  
**Version:** 1.1  
**Status:** Proposed  
**API:** REST  
**Framework:** Next.js  
**Language:** TypeScript  
**Authentication:** Better Auth  
**Database:** Neon PostgreSQL  
**ORM:** Drizzle ORM  
**Validation:** Zod  
**Hosting:** Vercel

---

# 1. Overview

The Operations API provides the central application interface between the STP/LME public websites, the Operations Administration application and the Operations database.

The API is responsible for:

- Equipment catalogue
- Equipment types
- Physical assets
- Companies
- Customers
- Enquiries
- Quotes
- Allocations
- Maintenance
- Availability
- Authentication and authorization
- Operational business rules
- Resource lifecycle management
- Auditability of important operational changes

The API is the **business and security boundary** between applications and the database.

```text
STP Website ──────┐
                  │
LME Website ──────┼──► Operations API ──► Drizzle ──► Neon
                  │
Admin Application ┘
```

Public applications must not connect directly to Neon PostgreSQL.

---

# 2. API Principles

The API follows these principles:

1. RESTful resource-based endpoints
2. Versioned API paths
3. JSON request and response bodies
4. Server-side validation
5. Authentication for private endpoints
6. Authorization for administrative operations
7. Consistent error responses
8. Business rules enforced server-side
9. Public and private data separated
10. Database access isolated behind the API
11. Typed request and response contracts
12. Pagination for collection endpoints
13. Filtering and sorting for administration endpoints
14. Auditability of important operational changes
15. Explicit lifecycle operations for business state transitions
16. Transactions for multi-record business operations
17. Concurrency protection for availability and allocation

---

# 3. Base URL

Development:

```text
http://localhost:3000/api/v1
```

Production:

```text
https://operations.example.com/api/v1
```

The production domain will be finalised during deployment.

---

# 4. API Versioning

All API endpoints use a version prefix:

```text
/api/v1
```

Example:

```http
GET /api/v1/catalogue
```

Future breaking changes can be introduced as:

```text
/api/v2
```

Existing consumers can continue using `/api/v1` during migration.

---

# 5. API Consumers

## Public Websites

```text
STP Website
LME Website
```

Public websites can access approved catalogue and enquiry functionality.

## Operations Administration

```text
Operations Admin
```

Authenticated staff use the API to manage operational data.

## Future Integrations

Potential consumers include:

```text
Mobile Application
Customer Portal
Finance System
Reporting System
Dispatch System
Third-Party Integrations
```

---

# 6. Authentication

Better Auth provides authentication for administration users.

Public endpoints do not require authentication unless specifically configured otherwise.

Private endpoints require an authenticated session.

```text
Admin User
    │
    ▼
Better Auth
    │
    ▼
Session
    │
    ▼
Authorization
    │
    ▼
API Route
```

---

# 7. Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Initial roles:

```text
admin
manager
operations
sales
viewer
```

Example permissions:

| Role | Catalogue | Assets | Enquiries | Quotes | Allocations | Maintenance |
|---|---|---|---|---|---|---|
| Admin | Full | Full | Full | Full | Full | Full |
| Manager | Full | Full | Full | Full | Full | Full |
| Operations | View | Manage | Manage | View | Manage | Manage |
| Sales | View | View | Manage | Manage | View | View |
| Viewer | View | View | View | View | View | View |

Authorization rules are enforced by the API.

---

# 8. API Structure

```text
/api/v1
│
├── catalogue
├── enquiries
├── availability
├── auth
│
└── admin
    ├── companies
    ├── users
    ├── customers
    ├── equipment-types
    ├── assets
    ├── enquiries
    ├── quotes
    ├── allocations
    ├── maintenance
    └── audit-logs
```

Lifecycle actions are exposed under the relevant resource rather than allowing clients to arbitrarily change status fields.

---

# 9. Public Catalogue API

## List Catalogue

```http
GET /api/v1/catalogue
```

### Query Parameters

```text
category
search
location
page
limit
```

### Response

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Excavator",
      "slug": "excavator",
      "category": "earthmoving",
      "description": "Heavy-duty excavator.",
      "specifications": {},
      "images": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

Internal ownership, costs, operational notes and other restricted information must not be returned.

## Catalogue Details

```http
GET /api/v1/catalogue/:slug
```

Returns the public representation of an equipment type.

---

# 10. Public Enquiries

## Create Enquiry

```http
POST /api/v1/enquiries
```

### Request

```json
{
  "customer": {
    "name": "John Doe",
    "companyName": "ABC Construction",
    "email": "john@example.com",
    "phone": "+27 00 000 0000"
  },
  "location": "Pretoria",
  "startDate": "2026-10-01",
  "endDate": "2026-10-15",
  "items": [
    {
      "equipmentTypeId": "uuid",
      "quantity": 2
    }
  ],
  "notes": "Delivery required."
}
```

### Response

```json
{
  "data": {
    "id": "uuid",
    "status": "new",
    "createdAt": "2026-09-03T10:00:00Z"
  }
}
```

The public API must not expose internal assignment, ownership or operational notes.

---

# 11. Administration — Companies

```http
GET   /api/v1/admin/companies
POST  /api/v1/admin/companies
GET   /api/v1/admin/companies/:id
PATCH /api/v1/admin/companies/:id
```

Companies may be deactivated and reactivated through lifecycle operations.

```http
POST /api/v1/admin/companies/:id/deactivate
POST /api/v1/admin/companies/:id/reactivate
```

Deactivated companies cannot receive new assignments. Historical records remain intact.

---

# 12. Administration — Customers

```http
GET   /api/v1/admin/customers
POST  /api/v1/admin/customers
GET   /api/v1/admin/customers/:id
PATCH /api/v1/admin/customers/:id
```

Filters:

```text
search
companyName
email
page
limit
```

Customer records should normally be archived rather than physically deleted.

```http
POST /api/v1/admin/customers/:id/archive
```

---

# 13. Administration — Equipment Types

```http
GET   /api/v1/admin/equipment-types
POST  /api/v1/admin/equipment-types
GET   /api/v1/admin/equipment-types/:id
PATCH /api/v1/admin/equipment-types/:id
```

Lifecycle operations:

```http
POST /api/v1/admin/equipment-types/:id/publish
POST /api/v1/admin/equipment-types/:id/unpublish
POST /api/v1/admin/equipment-types/:id/archive
```

An archived equipment type is removed from the public catalogue and cannot be used for new enquiries or allocations.

---

# 14. Administration — Assets

```http
GET   /api/v1/admin/assets
POST  /api/v1/admin/assets
GET   /api/v1/admin/assets/:id
PATCH /api/v1/admin/assets/:id
```

### Filters

```text
search
equipmentTypeId
ownerCompanyId
managedByCompanyId
status
location
condition
page
limit
```

### Asset Lifecycle

```text
available
   │
   ▼
reserved
   │
   ▼
on_hire
   │
   ▼
available
```

Alternative terminal state:

```text
retired
```

Lifecycle actions:

```http
POST /api/v1/admin/assets/:id/reserve
POST /api/v1/admin/assets/:id/release
POST /api/v1/admin/assets/:id/retire
POST /api/v1/admin/assets/:id/restore
```

An asset cannot be retired while on hire, actively allocated or subject to an unresolved operational commitment.

Ownership and management changes must be audited.

---

# 15. Administration — Enquiries

```http
GET   /api/v1/admin/enquiries
GET   /api/v1/admin/enquiries/:id
PATCH /api/v1/admin/enquiries/:id
```

### Enquiry Lifecycle

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

### Lifecycle Operations

```http
POST /api/v1/admin/enquiries/:id/start-review
POST /api/v1/admin/enquiries/:id/assign
POST /api/v1/admin/enquiries/:id/convert-to-quote
POST /api/v1/admin/enquiries/:id/decline
POST /api/v1/admin/enquiries/:id/cancel
```

Assignment request:

```json
{
  "companyId": "uuid",
  "userId": "uuid"
}
```

---

# 16. Administration — Quotes

```http
GET   /api/v1/admin/quotes
POST  /api/v1/admin/quotes
GET   /api/v1/admin/quotes/:id
PATCH /api/v1/admin/quotes/:id
```

### Quote Lifecycle

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

### Lifecycle Operations

```http
POST /api/v1/admin/quotes/:id/issue
POST /api/v1/admin/quotes/:id/accept
POST /api/v1/admin/quotes/:id/reject
POST /api/v1/admin/quotes/:id/cancel
POST /api/v1/admin/quotes/:id/expire
POST /api/v1/admin/quotes/:id/revise
```

Only draft quotes may be directly edited. Issued quotes must be revised through versioning.

Example:

```text
Q-2026-001 v1
Q-2026-001 v2
Q-2026-001 v3
```

### Quote Calculation

```text
Line Total = Quantity × Unit Price × Duration

Subtotal = Sum of Line Totals

Total = Subtotal - Discount + VAT
```

The server calculates authoritative quote totals.

---

# 17. Administration — Allocations

An allocation represents the operational commitment of a specific asset to a customer/request.

```http
GET   /api/v1/admin/allocations
POST  /api/v1/admin/allocations
GET   /api/v1/admin/allocations/:id
PATCH /api/v1/admin/allocations/:id
```

### Allocation Lifecycle

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

Alternative terminal state:

```text
cancelled
```

### Lifecycle Operations

```http
POST /api/v1/admin/allocations/:id/reserve
POST /api/v1/admin/allocations/:id/confirm
POST /api/v1/admin/allocations/:id/start
POST /api/v1/admin/allocations/:id/complete
POST /api/v1/admin/allocations/:id/cancel
```

Before reservation or confirmation, the API must verify:

```text
Asset exists
AND
Asset is not retired
AND
No overlapping allocation
AND
No overlapping maintenance
```

Conflicts return:

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

Starting a hire should transactionally update:

```text
allocation.status = active
asset.status = on_hire
```

Completing a hire should transactionally update:

```text
allocation.status = completed
asset.status = available
```

The API should also record completion timestamp, return condition and operational notes where applicable.

---

# 18. Availability API

Availability is calculated rather than stored as a permanent independent state.

```http
GET /api/v1/availability
```

### Parameters

```text
equipmentTypeId
location
startDate
endDate
quantity
```

Example:

```http
GET /api/v1/availability?equipmentTypeId=uuid&startDate=2026-10-01&endDate=2026-10-15&quantity=2
```

An asset is available for a requested period when:

```text
Asset status allows hire
AND
No overlapping allocation
AND
No overlapping maintenance
```

Availability must always use current database state and must not rely on stale cache.

---

# 19. Administration — Maintenance

```http
GET   /api/v1/admin/maintenance
POST  /api/v1/admin/maintenance
GET   /api/v1/admin/maintenance/:id
PATCH /api/v1/admin/maintenance/:id
```

### Maintenance Lifecycle

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

### Lifecycle Operations

```http
POST /api/v1/admin/maintenance/:id/start
POST /api/v1/admin/maintenance/:id/complete
POST /api/v1/admin/maintenance/:id/cancel
```

Starting maintenance should update:

```text
maintenance.status = in_progress
asset.status = maintenance
```

Completing maintenance should update the asset to `available` only when no other active operational condition prevents availability.

Maintenance scheduling must check for conflicting allocations.

---

# 20. Authentication Endpoints

Better Auth manages authentication endpoints.

Conceptually:

```text
/api/auth/*
```

The Operations API uses the authenticated session when processing private requests.

---

# 21. Lifecycle Operation Pattern

Standard resource operations use:

```http
GET     /api/v1/resource
GET     /api/v1/resource/:id
POST    /api/v1/resource
PATCH   /api/v1/resource/:id
```

Business lifecycle operations use explicit action endpoints:

```http
POST /api/v1/resource/:id/{action}
```

For administration resources, the actual route is normally:

```http
POST /api/v1/admin/resource/:id/{action}
```

Examples:

```text
POST /api/v1/admin/enquiries/:id/assign
POST /api/v1/admin/enquiries/:id/convert-to-quote
POST /api/v1/admin/quotes/:id/issue
POST /api/v1/admin/quotes/:id/accept
POST /api/v1/admin/allocations/:id/reserve
POST /api/v1/admin/allocations/:id/start
POST /api/v1/admin/allocations/:id/complete
POST /api/v1/admin/maintenance/:id/start
POST /api/v1/admin/maintenance/:id/complete
```

Clients must not bypass lifecycle rules by directly setting arbitrary status values.

---

# 22. Delete vs Archive

The API should avoid physical deletion of operational records.

Prefer archive/deactivate for:

- companies
- customers
- equipment types
- assets
- users

Avoid deletion for:

- enquiries
- quotes
- allocations
- maintenance records
- audit logs

Historical operational records form part of the audit trail.

Where deletion is technically required, it must be authenticated, authorized, audited and protected by foreign-key constraints.

---

# 23. Lifecycle Transition Validation

Every lifecycle action must validate the current state.

Example:

```text
POST /api/v1/admin/quotes/:id/accept
```

is valid only when:

```text
status = issued
```

It must reject:

```text
draft
rejected
expired
cancelled
```

Similarly:

```text
POST /api/v1/admin/allocations/:id/start
```

must verify:

```text
allocation.status = confirmed
asset.status = reserved
```

Invalid transitions return:

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

# 24. Idempotency

Lifecycle operations that may be retried should be idempotent where practical.

Examples:

```text
POST /quotes/:id/accept
POST /allocations/:id/confirm
POST /allocations/:id/complete
```

For externally initiated operations, the API may support:

```http
Idempotency-Key: <unique-request-id>
```

Repeated requests must not create duplicate business effects.

---

# 25. Bulk Operations

Bulk operations may be introduced where operational efficiency requires them.

Examples:

```http
POST /api/v1/admin/assets/bulk-import
POST /api/v1/admin/assets/bulk-update
POST /api/v1/admin/enquiries/bulk-assign
POST /api/v1/admin/maintenance/bulk-schedule
```

Bulk operations must:

- validate every record
- execute transactionally where appropriate
- return per-record errors
- create audit records
- explicitly document partial-failure behavior

---

# 26. Request Validation

All incoming request data must be validated server-side using Zod.

```text
HTTP Request
     │
     ▼
Route Handler
     │
     ▼
Zod Validation
     │
     ├── Invalid → 400
     │
     ▼
Authorization
     │
     ├── Unauthorized → 401
     │
     ├── Forbidden → 403
     │
     ▼
Business Logic
     │
     ▼
Database
```

Frontend validation improves user experience but is not a security mechanism.

---

# 27. Response Structure

Successful single-resource response:

```json
{
  "data": {
    "id": "uuid",
    "name": "Excavator"
  }
}
```

Successful collection response:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

# 28. Error Response

All API errors use a consistent structure.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "details": {
      "startDate": "Start date is required."
    }
  }
}
```

---

# 29. HTTP Status Codes

| Status | Meaning |
|---:|---|
| `200` | Successful request |
| `201` | Resource created |
| `204` | Successful request with no response body |
| `400` | Invalid request |
| `401` | Authentication required |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `409` | Resource or lifecycle conflict |
| `422` | Validation/business rule failure |
| `429` | Too many requests |
| `500` | Internal server error |

---

# 30. Pagination, Filtering and Sorting

Collection endpoints support pagination where appropriate:

```text
page
limit
```

Default:

```text
page = 1
limit = 20
```

Maximum:

```text
limit = 100
```

Filtering uses query parameters, for example:

```http
GET /api/v1/admin/assets?status=available&location=Pretoria
```

Sorting may use:

```text
sortBy
sortOrder
```

Allowed fields must be explicitly defined by each endpoint.

---

# 31. Search

Search should support relevant human-readable fields such as:

```text
Asset Number
Equipment Name
Customer Name
Customer Company
Quote Number
Enquiry Number
Location
```

Example:

```http
GET /api/v1/admin/assets?search=STP-EXC
```

---

# 32. API Security

The API must implement:

- HTTPS in production
- Better Auth sessions
- Server-side authorization
- Input validation
- Rate limiting for public endpoints
- Request size limits
- Secure environment variables
- Safe error messages
- Parameterized database access through Drizzle
- Protection against unauthorized data exposure

Sensitive internal values must never be returned in public API responses.

---

# 33. Public API Data Boundary

Public DTOs must be explicitly defined.

Example:

```text
PublicEquipment
----------------
id
name
slug
category
description
specifications
images
```

The public API must not expose the complete internal `Asset` model.

---

# 34. Business Logic Architecture

Business logic must not be implemented directly inside frontend page components.

Recommended structure:

```text
API Route
    │
    ▼
Controller / Handler
    │
    ▼
Validation
    │
    ▼
Service
    │
    ▼
Repository / Data Access
    │
    ▼
Drizzle ORM
    │
    ▼
PostgreSQL
```

Example allocation operation:

```text
POST /api/v1/admin/allocations/:id/start
              │
              ▼
       Validate Request
              │
              ▼
      Check Authorization
              │
              ▼
      Validate Lifecycle
              │
              ▼
       Check Asset State
              │
              ▼
      Execute Transaction
              │
              ├── Update Allocation
              ├── Update Asset
              └── Write Audit Log
```

---

# 35. API Modules

The API should be organised by domain:

```text
modules/
├── auth/
├── companies/
├── users/
├── equipment/
├── assets/
├── customers/
├── enquiries/
├── quotes/
├── allocations/
├── availability/
├── maintenance/
└── audit/
```

Each module should contain its own schemas, services, queries, types and business rules where appropriate.

---

# 36. Shared Types

Public applications should use shared TypeScript contracts where practical.

```text
packages/
└── inventory-types/
```

Example:

```typescript
type PublicEquipment = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  specifications: Record<string, unknown>;
  images: string[];
};
```

Shared types should contain API-facing contracts, not direct database models.

---

# 37. API Client

STP and LME should consume the API through:

```text
packages/api-client
```

This avoids duplicating API request logic across applications.

---

# 38. API and Database Separation

The following architecture is required:

```text
                 ┌─────────────┐
                 │ STP Website │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │     API     │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │   Service   │
                 │    Layer    │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │   Drizzle   │
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │    Neon     │
                 └─────────────┘
```

Neither STP nor LME should import the database schema.

---

# 39. Audit Requirements

The following operations should generate audit records:

```text
Create Asset
Update Asset
Change Asset Status
Change Ownership
Change Management Company
Create Allocation
Reserve Allocation
Cancel Allocation
Create Quote
Update Quote
Issue Quote
Accept Quote
Change Enquiry Status
Assign Enquiry
Create Maintenance
Update Maintenance
Start Maintenance
Complete Maintenance
Retire Asset
```

Audit records should capture:

```text
User
Action
Entity
Entity ID
Previous Values
New Values
Timestamp
```

---

# 40. Notification Hooks

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

Notification delivery may use Resend or another provider behind an internal service boundary.

---

# 41. Lifecycle Events

Important transitions should produce domain events where appropriate.

Examples:

```text
ENQUIRY_CREATED
ENQUIRY_ASSIGNED
QUOTE_ISSUED
QUOTE_ACCEPTED
QUOTE_REJECTED
ALLOCATION_RESERVED
ALLOCATION_CONFIRMED
HIRE_STARTED
HIRE_COMPLETED
MAINTENANCE_STARTED
MAINTENANCE_COMPLETED
ASSET_RETIRED
```

This provides a foundation for notifications, reporting and future integrations.

---

# 42. Transactions

Operations that modify multiple related records must use database transactions.

Example:

```text
Accept Quote
    │
    ├── Update Quote
    ├── Update Enquiry
    ├── Create/confirm Allocation
    ├── Reserve Asset
    └── Create Audit Log
```

These changes should succeed or fail as a unit where appropriate.

The API must never leave the system in a partially transitioned state.

---

# 43. Concurrency

Availability checks must account for concurrent requests.

The API/database must prevent two concurrent requests from creating conflicting confirmed allocations for the same asset and period.

PostgreSQL transactions and appropriate locking or exclusion constraints should be used where necessary.

---

# 44. Caching

Public catalogue endpoints may be cached:

```text
GET /api/v1/catalogue
GET /api/v1/catalogue/:slug
```

Operational endpoints should generally return current data.

Availability, allocation and lifecycle operations must always use current database state.

---

# 45. Deployment

The Operations API will be deployed with the Operations Next.js application.

```text
GitHub
   │
   ▼
Vercel
   │
   ├── Operations Application
   │
   └── API
         │
         ▼
      Neon DB
```

Environment variables:

```text
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
```

Additional variables may be introduced for email, storage, monitoring and integrations.

Secrets must never be committed to GitHub.

---

# 46. Proposed API Route Map

```text
/api/v1
│
├── /catalogue
│   ├── GET
│   └── /:slug
│       └── GET
│
├── /enquiries
│   └── POST
│
├── /availability
│   └── GET
│
└── /admin
    │
    ├── /companies
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       ├── PATCH
    │       ├── /deactivate
    │       └── /reactivate
    │
    ├── /customers
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       ├── PATCH
    │       └── /archive
    │
    ├── /equipment-types
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       ├── PATCH
    │       ├── /publish
    │       ├── /unpublish
    │       └── /archive
    │
    ├── /assets
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       ├── PATCH
    │       ├── /reserve
    │       ├── /release
    │       ├── /retire
    │       └── /restore
    │
    ├── /enquiries
    │   ├── GET
    │   └── /:id
    │       ├── GET
    │       ├── PATCH
    │       ├── /start-review
    │       ├── /assign
    │       ├── /convert-to-quote
    │       ├── /decline
    │       └── /cancel
    │
    ├── /quotes
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       ├── PATCH
    │       ├── /issue
    │       ├── /accept
    │       ├── /reject
    │       ├── /cancel
    │       ├── /expire
    │       └── /revise
    │
    ├── /allocations
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       ├── PATCH
    │       ├── /reserve
    │       ├── /confirm
    │       ├── /start
    │       ├── /complete
    │       └── /cancel
    │
    ├── /maintenance
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       ├── PATCH
    │       ├── /start
    │       ├── /complete
    │       └── /cancel
    │
    └── /audit-logs
        └── GET
```

---

# 47. Implementation Sequence

The API should be implemented in this order:

```text
1. Database schema
       ↓
2. Drizzle configuration
       ↓
3. Better Auth
       ↓
4. Shared validation schemas
       ↓
5. API response/error utilities
       ↓
6. Companies API
       ↓
7. Equipment Types API
       ↓
8. Assets API
       ↓
9. Customers API
       ↓
10. Enquiries API
       ↓
11. Quotes API
       ↓
12. Availability API
       ↓
13. Allocations API
       ↓
14. Maintenance API
       ↓
15. Lifecycle services
       ↓
16. Audit logging
       ↓
17. API client package
       ↓
18. STP integration
       ↓
19. LME integration
```

---

# 48. Acceptance Criteria

The API implementation is considered successful when:

- API is available under `/api/v1`.
- STP can retrieve public catalogue data.
- LME can retrieve public catalogue data.
- Public users can submit enquiries.
- Administration users can authenticate.
- Private endpoints require authentication.
- Authorization is enforced.
- Companies can be managed and deactivated/reactivated.
- Equipment types can be managed and published/unpublished/archived.
- Assets can be registered and managed.
- Ownership and management companies are separate.
- Assets can be reserved, released, retired and restored.
- Customers can be managed and archived.
- Enquiries can be reviewed, assigned, converted, declined and cancelled.
- Quotes can be created, issued, accepted, rejected, cancelled, expired and revised.
- Quote totals are calculated server-side.
- Availability can be checked through the API.
- Allocations can be reserved, confirmed, started, completed and cancelled.
- Conflicting allocations are rejected.
- Maintenance can be scheduled, started, completed and cancelled.
- Maintenance conflicts are rejected.
- Invalid lifecycle transitions return `409 Conflict`.
- Multi-record lifecycle operations use transactions.
- Important lifecycle operations are audited.
- Public API responses do not expose internal data.
- API validation is performed server-side.
- Database operations use Drizzle ORM.
- Production data is stored in Neon PostgreSQL.
- API can be deployed through Vercel.
- STP and LME do not directly access the database.
- Lifecycle operations are protected by authentication and authorization.
- Concurrent allocation attempts cannot create conflicting confirmed allocations.

---

# 49. Final Architecture

```text
                         PUBLIC USERS
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
        ┌──────────────┐            ┌──────────────┐
        │ STP Website  │            │ LME Website  │
        │    Astro     │            │    Astro     │
        └──────┬───────┘            └──────┬───────┘
               │                           │
               └─────────────┬─────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Operations API    │
                  │      Next.js        │
                  ├─────────────────────┤
                  │ Authentication      │
                  │ Authorization       │
                  │ Validation          │
                  │ Business Logic      │
                  │ Lifecycle Rules     │
                  │ Availability        │
                  │ Audit Events        │
                  │ API Responses       │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │     Drizzle ORM     │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Neon PostgreSQL   │
                  ├─────────────────────┤
                  │ Companies           │
                  │ Users               │
                  │ Equipment Types     │
                  │ Assets              │
                  │ Customers           │
                  │ Enquiries           │
                  │ Enquiry Items       │
                  │ Quotes              │
                  │ Quote Lines         │
                  │ Allocations         │
                  │ Maintenance         │
                  │ Audit Logs          │
                  └─────────────────────┘
                             ▲
                             │
                  ┌──────────┴──────────┐
                  │                     │
          ┌───────┴────────┐    ┌──────┴────────┐
          │ Operations     │    │ Future Clients │
          │ Administration │    │ / Integrations │
          │    Next.js     │    │                │
          └────────────────┘    └────────────────┘
```

---

# 50. Final Principle

> **CRUD manages resources. Lifecycle operations manage the business.**

CRUD answers:

```text
What data do we have?
How do we create it?
How do we read it?
How do we update it?
How do we archive it?
```

Lifecycle operations answer:

```text
What is happening to the resource?
Is this transition allowed?
What business rules must be checked?
What related records must change?
What must be audited?
```

For example:

```http
PATCH /api/v1/admin/assets/:id
```

can update asset information.

But:

```http
POST /api/v1/admin/assets/:id/reserve
```

represents a business operation because the API must check availability, conflicting allocations, maintenance, authorization and then perform the required state changes.

The API is therefore **not simply a CRUD interface to the database**. It is the authoritative operational layer that controls how the business moves from one state to another.

The final separation is:

```text
Websites
   ↓
API
   ↓
Business Rules
   ↓
Database
```

The websites know **how to display and collect information**.

The API knows **how the business operates**.

The database knows **how the data is stored and related**.
