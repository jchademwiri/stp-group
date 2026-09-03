# Testing Strategy — Operations Platform

**Project:** STP Group Operations Platform  
**Status:** Proposed

---

## 1. Purpose

This document defines the testing strategy for the STP Group Operations Platform, covering the STP and LME websites, Operations application/API, database interactions and operational business rules.

The objective is to prevent regressions while protecting the most critical business behaviour: availability, allocation, quotations, asset status, authentication and data integrity.

---

## 2. Testing Principles

1. Test business rules independently of the UI.
2. Validate API contracts at the boundary.
3. Treat availability and allocation as high-risk functionality.
4. Test authorization independently from authentication.
5. Test database constraints and transactions.
6. Test lifecycle transitions explicitly.
7. Keep tests deterministic and repeatable.
8. Use realistic operational scenarios.
9. Run automated checks before production deployment.
10. Do not rely exclusively on end-to-end tests.

---

## 3. Testing Pyramid

```text
                 ┌───────────────┐
                 │  E2E Tests    │
                 └───────┬───────┘
                         │
              ┌──────────▼──────────┐
              │ Integration Tests   │
              └──────────┬──────────┘
                         │
           ┌─────────────▼─────────────┐
           │       Unit Tests          │
           └───────────────────────────┘
```

Most business logic should be covered by fast unit tests, with integration and end-to-end tests validating the complete system boundaries.

---

## 4. Unit Testing

Unit tests should cover isolated business logic without requiring a production database.

Priority areas:

- quote calculations
- duration calculations
- date validation
- lifecycle transitions
- availability rules
- permission checks
- validation schemas
- data transformations
- public DTO mapping
- status transition rules

Example:

```text
Quantity = 2
Unit Price = 1,000
Duration = 5

Expected Line Total = 10,000
```

Quote calculation tests should include discounts and applicable VAT rules.

---

## 5. Business Rule Tests

Business rules are authoritative and must have direct test coverage.

### Asset Availability

Test that an asset is unavailable when:

```text
retired
OR
conflicting allocation exists
OR
conflicting maintenance exists
```

Test that an asset is available when none of those conditions apply.

### Ownership

Test that owner and management company are stored independently.

### Lifecycle

Test valid and invalid transitions for:

- companies
- equipment types
- assets
- enquiries
- quotes
- allocations
- maintenance

Invalid transitions should return the documented business error.

---

## 6. API Integration Testing

Integration tests should exercise the API against a test database or isolated database environment.

Test:

- request validation
- authentication
- authorization
- database persistence
- foreign keys
- transactions
- lifecycle endpoints
- API error responses
- pagination/filtering
- public/private DTO boundaries

Example:

```http
POST /api/v1/admin/allocations/:id/reserve
```

The test must verify both the response and resulting database state.

---

## 7. Availability and Allocation Testing

This is a critical test area because incorrect availability can cause double booking.

Minimum scenarios:

| Scenario | Expected |
|---|---|
| No allocation, no maintenance | Available |
| Existing overlapping allocation | Unavailable |
| Existing non-overlapping allocation | Available |
| Overlapping maintenance | Unavailable |
| Retired asset | Unavailable |
| Concurrent reservation | Only one succeeds |
| Completed allocation | Asset can become available |
| Cancelled allocation | Availability restored where appropriate |

Boundary dates must also be tested.

Examples:

```text
Existing: 01–10 October
Request: 10–15 October
Request: 11–15 October
```

The exact overlap rule must be consistent throughout the system.

---

## 8. Concurrency Testing

Concurrency tests must verify that two users cannot successfully reserve the same asset for the same conflicting period.

Example:

```text
User A ──► Reserve Asset 001 ──┐
                               ├──► Database
User B ──► Reserve Asset 001 ──┘
```

Expected result:

```text
One reservation succeeds.
One reservation receives a conflict.
```

This must be enforced at the server/database level, not only in the browser.

---

## 9. Authentication Testing

Test:

- successful login
- invalid credentials
- session creation
- session expiration
- logout
- protected route access
- unauthenticated API requests
- invalid/expired sessions

Private endpoints must never become accessible simply because a user knows the endpoint URL.

---

## 10. Authorization Testing

Each protected operation must be tested against the permission model.

Example:

```text
Admin       → allowed
Manager     → allowed
Operations  → according to permission
Sales       → according to permission
Viewer      → read-only
Anonymous   → denied
```

Also test company/scope restrictions where applicable.

A valid session must not automatically imply permission to perform every operation.

---

## 11. Public API Testing

Public endpoints should verify that only approved information is returned.

Test that responses do not expose:

- ownership information
- internal costs
- operational notes
- internal user information
- audit records
- internal database identifiers where not required

Test:

```http
GET /api/v1/catalogue
GET /api/v1/catalogue/:slug
POST /api/v1/enquiries
```

---

## 12. Website Testing

STP and LME should be tested for:

- page rendering
- catalogue rendering
- equipment detail pages
- enquiry form validation
- successful enquiry submission
- API failure handling
- responsive layouts
- navigation
- SEO-critical pages

The websites should not contain duplicated business logic that conflicts with the Operations API.

---

## 13. End-to-End Testing

End-to-end tests should validate critical user journeys.

### Enquiry to Quote

```text
Public Website
    ↓
Submit Enquiry
    ↓
Operations Admin
    ↓
Review Enquiry
    ↓
Create Quote
    ↓
Issue Quote
```

### Quote to Allocation

```text
Quote
  ↓
Accepted
  ↓
Select Available Asset
  ↓
Reserve
  ↓
Confirm
  ↓
Start Hire
```

### Maintenance

```text
Schedule Maintenance
        ↓
Start Maintenance
        ↓
Asset Unavailable
        ↓
Complete Maintenance
        ↓
Asset Available
```

---

## 14. Database Testing

Database tests should verify:

- required fields
- foreign keys
- unique constraints
- indexes where relevant
- valid status values
- relationship integrity
- migration correctness
- transaction behaviour

Destructive migrations should be tested against a representative copy of the schema/data before production execution.

---

## 15. Migration Testing

Migration scripts must be tested using representative source data.

Validate:

- record counts
- field mappings
- duplicates
- missing relationships
- ownership
- historical dates
- active allocations
- maintenance periods
- reconciliation results

Migration tests should confirm that repeated execution does not unexpectedly duplicate records where the migration is designed to be repeatable.

---

## 16. Regression Testing

Every significant feature or bug fix should include regression coverage where practical.

High-risk regression areas:

- availability
- allocations
- quote totals
- lifecycle transitions
- authentication
- authorization
- public enquiry submission
- database migrations

A bug that reaches production should result in a test that prevents the same failure from silently returning.

---

## 17. Test Data

Test data must be synthetic and must not contain unnecessary production customer information.

Recommended fixtures:

```text
Companies
Equipment Types
Assets
Customers
Enquiries
Quotes
Allocations
Maintenance Records
Users/Roles
```

Fixtures should represent both valid and edge-case scenarios.

---

## 18. Test Environments

Recommended environments:

```text
Local
  ↓
CI
  ↓
Preview/Test
  ↓
Production
```

Production data must not be used in automated tests unless explicitly approved and appropriately anonymized.

---

## 19. CI Checks

Pull requests should run automated checks including:

```text
Install dependencies
      ↓
Type checking
      ↓
Linting
      ↓
Unit tests
      ↓
Integration tests
      ↓
Build
```

End-to-end tests may run as a separate CI stage where their execution time or environment requirements justify it.

---

## 20. Coverage

Coverage should be measured, but percentage alone must not determine quality.

Priority should be given to meaningful coverage of:

1. Business rules
2. Security rules
3. Financial calculations
4. Availability
5. Allocation concurrency
6. Lifecycle transitions
7. Data integrity

Critical business logic should have significantly stronger coverage than presentation-only code.

---

## 21. Error Testing

Test documented error responses, including:

```text
400 Validation Error
401 Unauthenticated
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Rate Limited
500 Internal Error
```

Business conflicts should return stable machine-readable error codes.

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

## 22. Performance Testing

Performance testing should focus on operationally important endpoints.

Priority endpoints:

- catalogue listing
- catalogue detail
- availability
- enquiry submission
- administration searches
- allocation operations

Test realistic data volumes before production launch.

Availability queries should remain performant as allocations and maintenance records grow.

---

## 23. Security Testing

Security testing should include:

- authentication bypass attempts
- authorization bypass attempts
- invalid input
- injection attempts
- rate limiting
- session handling
- public/private data leakage
- insecure direct object access
- sensitive error leakage

Security testing must be performed against the API as well as the UI.

---

## 24. Release Gate

A production release should require:

- automated checks passing
- critical business-rule tests passing
- database migration validated
- authentication/authorization tests passing
- allocation/availability tests passing
- production build successful
- no unresolved critical defects

For high-risk releases, manual acceptance testing should also be completed.

---

## 25. Testing Acceptance Criteria

The testing strategy is considered implemented when:

- unit test infrastructure exists
- API integration tests exist
- database test environment exists
- authentication is tested
- authorization is tested
- lifecycle transitions are tested
- availability is tested
- allocation concurrency is tested
- public API boundaries are tested
- critical website journeys are tested
- CI executes automated checks
- production releases have defined quality gates

---

## 26. Final Principle

> **Testing is not only about proving that the application works; it is about proving that the business cannot easily be put into an invalid operational state.**
