# System Architecture — STP Group Operations Platform

**Project:** STP Group Operations Platform  
**Version:** 1.0  
**Status:** Proposed  
**Applications:** STP, LME, Operations Admin  
**Primary Stack:** Astro, Next.js, TypeScript, Better Auth, Drizzle ORM, Neon PostgreSQL, Vercel

---

## 1. Purpose

This document defines the target architecture for the shared STP/LME operations platform. It establishes application boundaries, data ownership, authentication, integration patterns and the relationship between public websites and the internal Operations Platform.

The architecture is designed to centralise operational business rules while allowing STP and LME to maintain independent public-facing websites.

---

## 2. Architectural Principle

> **Websites consume the API. The Operations Platform operates the business. The API owns business rules. Neon stores the data.**

Public websites must not connect directly to the operational database.

---

## 3. High-Level Architecture

```text
                         PUBLIC USERS
                              │
              ┌───────────────┴───────────────┐
              │                               │
        STP Website                       LME Website
          (Astro)                           (Astro)
              │                               │
              └──────────── HTTPS / REST ─────┘
                              │
                              ▼
                 OPERATIONS PLATFORM
                       (Next.js)
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
     Authentication       Business Logic      API Layer
      Better Auth       Availability, Quotes,   REST / v1
                        Enquiries, Allocations
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                        Data Access Layer
                          Drizzle ORM
                              │
                              ▼
                       Neon PostgreSQL
```

The Operations Admin UI is part of the Operations Platform and uses the same application/API boundary.

---

## 4. Applications

### STP Website

Public-facing Astro application for STP services, plant/equipment catalogue pages, enquiries and marketing content.

### LME Website

Public-facing Astro application for LME services and equipment offerings.

### Operations Platform

Next.js application responsible for:

- administration
- authentication
- operational workflows
- API endpoints
- validation
- business rules
- availability
- quote calculations
- allocations
- maintenance
- audit logging

---

## 5. Data Ownership

Neon PostgreSQL is the authoritative operational datastore.

Only the Operations Platform may access the operational database directly.

```text
STP ──┐
      ├──► API ──► Drizzle ──► Neon
LME ──┤
      │
Admin ┘
```

This prevents business rules from being duplicated across websites and protects internal data from public applications.

---

## 6. Application Boundaries

| Component | Responsibility | Direct DB Access |
|---|---|---:|
| STP Website | Public presentation and enquiry capture | No |
| LME Website | Public presentation and enquiry capture | No |
| Operations Admin | Internal administration | Through API/application services |
| Operations API | Business rules and data access | Yes, through Drizzle |
| Drizzle ORM | Database access and query mapping | Yes |
| Neon PostgreSQL | Persistent operational data | N/A |

---

## 7. Repository Structure

```text
apps/
├── stp/          # STP public website
├── lme/          # LME public website
└── operations/   # Operations Platform and API

packages/
├── inventory-types/
├── api-client/
├── validation/
└── tailwind/

docs/
├── architecture/
├── database/
├── api/
├── operations/
├── frontend/
├── security/
└── development/
```

The exact package structure may evolve, but application responsibilities must remain separated.

---

## 8. Request Flow

### Public Catalogue

```text
User
 ↓
STP/LME Website
 ↓
GET /api/v1/catalogue
 ↓
Validation / business rules
 ↓
Drizzle
 ↓
Neon
 ↓
Public DTO
 ↓
Website
```

### Public Enquiry

```text
Customer
 ↓
STP/LME Website
 ↓
POST /api/v1/enquiries
 ↓
Validate request
 ↓
Create/update customer
 ↓
Create enquiry
 ↓
Create enquiry items
 ↓
Audit
 ↓
Response
```

### Internal Allocation

```text
Staff
 ↓
Operations Admin
 ↓
Authenticated API
 ↓
Authorization
 ↓
Availability check
 ↓
Allocation service
 ↓
Transaction
 ↓
Neon
 ↓
Audit event
```

---

## 9. Security Boundary

Better Auth provides authentication for internal users. Authorization is enforced by the Operations API using role and permission rules.

Public DTOs must be explicitly constructed and must never expose internal database records wholesale.

Restricted information includes, where applicable:

- ownership details
- internal costs
- operational notes
- internal assignments
- audit records
- management information

---

## 10. Business Logic Boundary

Business rules belong in the Operations Platform, not in the public websites.

Examples:

- asset availability
- allocation overlap detection
- maintenance conflicts
- quote calculations
- lifecycle transitions
- ownership restrictions
- authorization
- audit requirements

This prevents STP and LME from implementing different versions of the same business rule.

---

## 11. Availability and Concurrency

Availability is calculated from current operational state.

An asset is available only when its current status permits hire and there is no conflicting allocation or maintenance period.

Allocation and reservation operations must use database transactions and appropriate concurrency controls to prevent two users from committing the same asset to overlapping periods.

---

## 12. Integration Strategy

The primary integration mechanism is versioned REST over HTTPS.

```text
/api/v1/...
```

Shared TypeScript types and an API client package should be used by internal applications where practical.

Future integrations may include:

- finance/accounting systems
- customer portals
- mobile applications
- reporting systems
- dispatch/logistics systems
- document services
- notification providers

Future integrations must consume supported APIs rather than bypassing the business layer.

---

## 13. Deployment

Target hosting:

- Astro websites: Vercel-compatible deployment
- Operations Platform: Vercel
- Database: Neon PostgreSQL

Environment-specific configuration must be stored through deployment environment variables and must never be committed to Git.

Core environment variables include:

```text
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
```

---

## 14. Failure and Recovery Principles

The system must:

1. fail closed for unauthorized operations;
2. reject invalid state transitions;
3. use transactions for multi-record changes;
4. preserve operational history;
5. log important state changes;
6. avoid relying on stale availability information;
7. keep database migrations version controlled.

Backup, disaster recovery, monitoring and alerting will be documented separately.

---

## 15. Architecture Decisions

### Decision 1 — Shared Operations Platform

STP and LME use a common operational platform rather than maintaining separate inventory databases.

### Decision 2 — API as Business Boundary

Public applications consume an API and do not implement operational business rules independently.

### Decision 3 — Single Operational Database

Neon PostgreSQL is the shared source of truth for operational entities.

### Decision 4 — Ownership and Management Separation

Asset ownership and operational management are separate concepts and must remain separate in the data model.

### Decision 5 — Lifecycle Operations

Important state changes use explicit business operations rather than unrestricted status updates.

---

## 16. Non-Goals

This architecture does not initially provide:

- supplier marketplace functionality
- customer self-service accounts
- dynamic pricing engine
- full accounting replacement
- automated dispatch optimisation
- public exposure of ownership information

These may be added later through explicit architecture decisions.

---

## 17. Final Principle

> **The API is not simply a CRUD interface to the database. It is the authoritative operational layer that controls how the business moves from one state to another.**
