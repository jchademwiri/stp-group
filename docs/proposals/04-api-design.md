# API Design — Operations Platform

**Project:** STP Group Operations Platform
**Version:** 1.0
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

* Equipment catalogue
* Equipment types
* Physical assets
* Companies
* Customers
* Enquiries
* Quotes
* Allocations
* Maintenance
* Availability
* Authentication and authorization
* Operational business rules

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

All API endpoints will use a version prefix:

```text
/api/v1
```

Example:

```text
GET /api/v1/catalogue
```

Future breaking changes can be introduced as:

```text
/api/v2
```

Existing consumers can continue using `/api/v1` during migration.

---

# 5. API Consumers

The API will have three primary consumers.

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

The API should be designed so future applications can consume the same services.

Potential integrations:

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

Better Auth will provide authentication for administration users.

Public endpoints do not require authentication unless specifically configured otherwise.

Private endpoints require an authenticated session.

```text
Public Request
      │
      ▼
 API Route
      │
      ▼
 Public Data
```

Authenticated request:

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

| Role       | Catalogue | Assets | Enquiries | Quotes | Allocations | Maintenance |
| ---------- | --------: | -----: | --------: | -----: | ----------: | ----------: |
| Admin      |      Full |   Full |      Full |   Full |        Full |        Full |
| Manager    |      Full |   Full |      Full |   Full |        Full |        Full |
| Operations |      View | Manage |    Manage |   View |      Manage |      Manage |
| Sales      |      View |   View |    Manage | Manage |        View |        View |
| Viewer     |      View |   View |      View |   View |        View |        View |

Authorization rules will be enforced by the API.

---

# 8. API Structure

```text
/api/v1
│
├── catalogue
│
├── enquiries
│
├── auth
│
└── admin
    │
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

---

# 9. Public Catalogue API

## List Catalogue

```http
GET /api/v1/catalogue
```

Returns equipment available for public catalogue display.

### Query Parameters

```text
category
search
location
page
limit
```

Example:

```http
GET /api/v1/catalogue?category=earthmoving&page=1&limit=20
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

Internal ownership and operational information must not be returned.

---

# 10. Catalogue Details

```http
GET /api/v1/catalogue/:slug
```

Example:

```http
GET /api/v1/catalogue/excavator
```

Returns the public representation of an equipment type.

The response must contain only customer-safe information.

---

# 11. Public Enquiries

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

The public API should not expose internal assignment, ownership or operational notes.

---

# 12. Administration — Companies

## List Companies

```http
GET /api/v1/admin/companies
```

## Create Company

```http
POST /api/v1/admin/companies
```

## Get Company

```http
GET /api/v1/admin/companies/:id
```

## Update Company

```http
PATCH /api/v1/admin/companies/:id
```

Example:

```json
{
  "name": "Sithembe Transportation & Projects",
  "code": "STP",
  "active": true
}
```

---

# 13. Administration — Customers

## List Customers

```http
GET /api/v1/admin/customers
```

### Filters

```text
search
companyName
email
page
limit
```

## Create Customer

```http
POST /api/v1/admin/customers
```

## Get Customer

```http
GET /api/v1/admin/customers/:id
```

## Update Customer

```http
PATCH /api/v1/admin/customers/:id
```

---

# 14. Administration — Equipment Types

## List Equipment Types

```http
GET /api/v1/admin/equipment-types
```

### Filters

```text
search
category
active
page
limit
```

## Create Equipment Type

```http
POST /api/v1/admin/equipment-types
```

### Request

```json
{
  "name": "Excavator",
  "slug": "excavator",
  "category": "earthmoving",
  "description": "Heavy-duty excavator.",
  "specifications": {},
  "images": [],
  "active": true
}
```

## Get Equipment Type

```http
GET /api/v1/admin/equipment-types/:id
```

## Update Equipment Type

```http
PATCH /api/v1/admin/equipment-types/:id
```

---

# 15. Administration — Assets

## List Assets

```http
GET /api/v1/admin/assets
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

Example:

```http
GET /api/v1/admin/assets?status=available&ownerCompanyId=uuid
```

## Create Asset

```http
POST /api/v1/admin/assets
```

### Request

```json
{
  "assetNumber": "STP-EXC-001",
  "equipmentTypeId": "uuid",
  "ownerCompanyId": "uuid",
  "managedByCompanyId": "uuid",
  "status": "available",
  "location": "Pretoria",
  "condition": "good",
  "notes": "Ready for hire."
}
```

## Get Asset

```http
GET /api/v1/admin/assets/:id
```

## Update Asset

```http
PATCH /api/v1/admin/assets/:id
```

---

# 16. Administration — Enquiries

## List Enquiries

```http
GET /api/v1/admin/enquiries
```

### Filters

```text
status
customerId
assignedCompanyId
startDate
endDate
search
page
limit
```

## Get Enquiry

```http
GET /api/v1/admin/enquiries/:id
```

## Update Enquiry

```http
PATCH /api/v1/admin/enquiries/:id
```

Example:

```json
{
  "status": "reviewing",
  "assignedCompanyId": "uuid",
  "notes": "Assigned to STP operations."
}
```

---

# 17. Administration — Quotes

## List Quotes

```http
GET /api/v1/admin/quotes
```

## Create Quote

```http
POST /api/v1/admin/quotes
```

### Request

```json
{
  "enquiryId": "uuid",
  "version": 1,
  "validUntil": "2026-09-30",
  "lines": [
    {
      "equipmentTypeId": "uuid",
      "assetId": "uuid",
      "description": "Excavator hire",
      "quantity": 1,
      "unitPrice": 15000,
      "duration": 5
    }
  ],
  "discount": 0,
  "vat": 0,
  "terms": "Payment terms..."
}
```

The server calculates quote totals.

The client must not be trusted to calculate authoritative totals.

## Get Quote

```http
GET /api/v1/admin/quotes/:id
```

## Update Quote

```http
PATCH /api/v1/admin/quotes/:id
```

---

# 18. Quote Calculation

The API should calculate:

```text
Line Total
    =
Quantity × Unit Price × Duration
```

Then:

```text
Subtotal
    =
Sum of Line Totals
```

Then:

```text
Total
    =
Subtotal - Discount + VAT
```

The API is responsible for the final authoritative values.

---

# 19. Administration — Allocations

## List Allocations

```http
GET /api/v1/admin/allocations
```

### Filters

```text
assetId
customerId
companyId
status
startDate
endDate
```

## Create Allocation

```http
POST /api/v1/admin/allocations
```

### Request

```json
{
  "assetId": "uuid",
  "enquiryId": "uuid",
  "customerId": "uuid",
  "companyId": "uuid",
  "startDate": "2026-10-01",
  "endDate": "2026-10-15",
  "status": "confirmed",
  "notes": "Confirmed hire."
}
```

Before creating a confirmed allocation, the API must check:

```text
Asset exists
      AND
Asset is not retired
      AND
No conflicting allocation
      AND
No conflicting maintenance
```

## Get Allocation

```http
GET /api/v1/admin/allocations/:id
```

## Update Allocation

```http
PATCH /api/v1/admin/allocations/:id
```

---

# 20. Availability API

Availability should be exposed as a dedicated API operation rather than requiring clients to reproduce business rules.

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

### Response

```json
{
  "data": {
    "available": true,
    "quantityRequested": 2,
    "quantityAvailable": 4
  }
}
```

The API remains the authoritative source for availability.

---

# 21. Administration — Maintenance

## List Maintenance

```http
GET /api/v1/admin/maintenance
```

## Create Maintenance

```http
POST /api/v1/admin/maintenance
```

### Request

```json
{
  "assetId": "uuid",
  "type": "scheduled_maintenance",
  "description": "500-hour service",
  "startDate": "2026-10-05",
  "endDate": "2026-10-07",
  "status": "scheduled",
  "notes": "Workshop service."
}
```

## Get Maintenance

```http
GET /api/v1/admin/maintenance/:id
```

## Update Maintenance

```http
PATCH /api/v1/admin/maintenance/:id
```

---

# 22. Authentication Endpoints

Better Auth will manage authentication endpoints.

Conceptually:

```text
/api/auth/*
```

Authentication implementation should follow Better Auth's configured route structure.

The Operations API should use the authenticated session when processing private requests.

---

# 23. Request Validation

All incoming request data must be validated server-side using Zod.

Example:

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

# 24. Response Structure

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

# 25. Error Response

All API errors should use a consistent structure.

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

# 26. HTTP Status Codes

| Status | Meaning                                  |
| -----: | ---------------------------------------- |
|  `200` | Successful request                       |
|  `201` | Resource created                         |
|  `204` | Successful request with no response body |
|  `400` | Invalid request                          |
|  `401` | Authentication required                  |
|  `403` | Insufficient permissions                 |
|  `404` | Resource not found                       |
|  `409` | Conflict                                 |
|  `422` | Validation/business rule failure         |
|  `429` | Too many requests                        |
|  `500` | Internal server error                    |

---

# 27. Business Rule Errors

Business conflicts should return `409 Conflict` where appropriate.

Example:

```json
{
  "error": {
    "code": "ASSET_ALLOCATION_CONFLICT",
    "message": "The selected asset is already allocated during the requested period."
  }
}
```

Maintenance conflict:

```json
{
  "error": {
    "code": "ASSET_MAINTENANCE_CONFLICT",
    "message": "The selected asset is scheduled for maintenance during the requested period."
  }
}
```

---

# 28. Pagination

Collection endpoints should support:

```text
page
limit
```

Example:

```http
GET /api/v1/admin/assets?page=2&limit=25
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

---

# 29. Sorting

Administration endpoints may support:

```text
sortBy
sortOrder
```

Example:

```http
GET /api/v1/admin/assets?sortBy=createdAt&sortOrder=desc
```

Allowed sort fields must be explicitly defined by each endpoint.

---

# 30. Filtering

Filtering should use query parameters.

Example:

```http
GET /api/v1/admin/assets
    ?status=available
    &location=Pretoria
    &equipmentTypeId=uuid
```

The API must validate filter parameters before querying the database.

---

# 31. Search

Search should support relevant human-readable fields.

Example:

```http
GET /api/v1/admin/assets?search=STP-EXC
```

Potential searchable fields:

```text
Asset Number
Equipment Name
Customer Name
Customer Company
Quote Number
Enquiry Number
Location
```

---

# 32. API Security

The API must implement:

* HTTPS in production
* Better Auth sessions
* Server-side authorization
* Input validation
* Rate limiting for public endpoints
* Request size limits
* Secure environment variables
* Safe error messages
* Database parameterization through Drizzle
* Protection against unauthorized data exposure

Sensitive values must never be returned in public API responses.

---

# 33. Public API Data Boundary

The public catalogue API should return a deliberately defined DTO.

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

It should **not** return the complete database `Asset` model.

This prevents accidental exposure of internal fields.

---

# 34. API Business Logic

Business logic should not be implemented directly inside individual page components.

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

Example:

```text
POST /api/v1/admin/allocations
              │
              ▼
       Validate Request
              │
              ▼
      Check Authorization
              │
              ▼
      Check Asset Status
              │
              ▼
    Check Allocation Conflict
              │
              ▼
    Check Maintenance Conflict
              │
              ▼
       Create Allocation
              │
              ▼
       Write Audit Log
```

---

# 35. API Modules

The API should be organised by domain.

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

Each module should contain its own:

```text
schemas
services
queries
types
business rules
```

where appropriate.

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

The shared types package should contain API-facing contracts, not direct database models.

---

# 37. API Client

STP and LME should consume the API through:

```text
packages/api-client
```

Example:

```text
STP
 │
 └── @repo/api-client
          │
          ▼
     Operations API
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
                 │             │
                 │     API     │
                 │             │
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
Cancel Allocation
Create Quote
Update Quote
Accept Quote
Change Enquiry Status
Create Maintenance
Update Maintenance
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

# 40. API Caching

Public catalogue endpoints may be cached.

Potential strategy:

```text
GET /api/v1/catalogue
GET /api/v1/catalogue/:slug
```

can use appropriate caching/revalidation.

Operational endpoints should generally return current data and must not rely on stale cache for availability decisions.

Availability and allocation operations must always use current database state.

---

# 41. Transaction Requirements

Operations that modify multiple related records should use database transactions.

Example:

```text
Confirm Allocation
       │
       ├── Validate asset
       ├── Validate availability
       ├── Create allocation
       ├── Update asset status
       └── Create audit record
```

These operations should succeed or fail as a unit where appropriate.

---

# 42. Concurrency

Availability checks must account for concurrent requests.

Example:

```text
Admin A ──► Check Asset ──► Available
                              │
Admin B ──► Check Asset ──────┘
                              │
                         Both attempt
                         allocation
```

The database/API must prevent both requests from creating conflicting confirmed allocations.

PostgreSQL transactions and appropriate locking/exclusion constraints should be used where necessary.

---

# 43. API Deployment

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

Additional environment variables may be introduced for:

```text
Email
Storage
Monitoring
External Integrations
```

Secrets must never be committed to GitHub.

---

# 44. Proposed API Route Map

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
    │       └── PATCH
    │
    ├── /customers
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       └── PATCH
    │
    ├── /equipment-types
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       └── PATCH
    │
    ├── /assets
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       └── PATCH
    │
    ├── /enquiries
    │   ├── GET
    │   └── /:id
    │       ├── GET
    │       └── PATCH
    │
    ├── /quotes
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       └── PATCH
    │
    ├── /allocations
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       └── PATCH
    │
    ├── /maintenance
    │   ├── GET
    │   ├── POST
    │   └── /:id
    │       ├── GET
    │       └── PATCH
    │
    └── /audit-logs
        └── GET
```

---

# 45. Implementation Sequence

The API should be implemented in the following order:

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
15. Audit logging
       ↓
16. API client package
       ↓
17. STP integration
       ↓
18. LME integration
```

---

# 46. Acceptance Criteria

The API implementation is considered successful when:

* API is available under `/api/v1`.
* STP can retrieve public catalogue data.
* LME can retrieve public catalogue data.
* Public users can submit enquiries.
* Administration users can authenticate.
* Private endpoints require authentication.
* Authorization is enforced.
* Companies can be managed.
* Equipment types can be managed.
* Assets can be registered and managed.
* Ownership and management companies are separate.
* Customers can be managed.
* Enquiries can be reviewed and assigned.
* Quotes can be created and versioned.
* Quote totals are calculated server-side.
* Availability can be checked through the API.
* Allocations can be created.
* Conflicting allocations are rejected.
* Maintenance conflicts are rejected.
* Public API responses do not expose internal data.
* Important operational actions are audited.
* API validation is performed server-side.
* Database operations use Drizzle ORM.
* Production data is stored in Neon PostgreSQL.
* API can be deployed through Vercel.
* STP and LME do not directly access the database.

---

# 47. Final Architecture

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
                  │ Availability        │
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

# 48. Design Principle

The Operations API is the **authoritative business layer** of the STP Group platform.

```text
Websites
   ↓
API
   ↓
Business Rules
   ↓
Database
```

The websites should know **how to display and collect information**.

The API should know **how the business operates**.

The database should know **how the data is stored and related**.

This separation allows the STP and LME websites, Operations Administration and future applications to evolve independently while using the same operational data and business rules.
