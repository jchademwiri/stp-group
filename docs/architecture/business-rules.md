# Business Rules — STP Group Operations Platform

**Project:** STP Group Operations Platform  
**Version:** 1.0  
**Status:** Proposed

---

## 1. Purpose

This document defines the operational rules that the Operations Platform must enforce regardless of which application or user initiates a request.

Business rules are authoritative at the API/service layer and must not depend on the behaviour of the STP or LME websites.

---

## 2. Core Domain Principles

1. An **equipment type** describes what can be offered.
2. An **asset** represents a physical item owned or managed by a company.
3. An **enquiry** represents what a customer requested.
4. A **quote** represents what the business offered.
5. An **allocation** represents an operational commitment of an asset.
6. **Maintenance** can make an asset unavailable.
7. **Availability** is calculated from current operational state.
8. Historical operational records must be preserved.
9. Lifecycle transitions must be validated by the API.
10. Important operational changes must be auditable.

---

## 3. Company Rules

- Every company must have a unique identifier and code.
- Inactive companies cannot receive new operational assignments.
- Historical records belonging to an inactive company remain intact.
- Company activation/deactivation must be audited.
- Ownership and management responsibilities must be represented separately.

---

## 4. Equipment Type Rules

- Every equipment type has a unique slug.
- An equipment type may be published or unpublished.
- Only published equipment types appear in the public catalogue.
- Archived equipment types cannot be used for new enquiries, quotes or allocations.
- Existing historical records may continue referencing archived equipment types.
- Public responses must contain only approved catalogue information.

---

## 5. Asset Rules

An asset must have:

- unique asset number;
- equipment type;
- owner company;
- managing company where applicable;
- operational status;
- location;
- condition where maintained by the business.

### Asset Status

```text
available
reserved
on_hire
maintenance
retired
```

Rules:

- A retired asset cannot be allocated.
- An asset on hire cannot be retired.
- An asset under unresolved operational commitment cannot be retired.
- Asset ownership changes must be audited.
- Management changes must be audited.
- Status changes must follow defined lifecycle operations.

---

## 6. Customer Rules

- Customers may be created through public enquiries or internal administration.
- Customer identity should be reused where a matching customer can be reliably identified.
- Customer records should normally be archived rather than physically deleted.
- Historical enquiries, quotes and allocations must retain their customer relationship.
- Sensitive customer information must not be exposed through public catalogue responses.

---

## 7. Enquiry Rules

### Lifecycle

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

Rules:

- A public enquiry must contain sufficient customer and request information to be processed.
- Enquiry dates must be valid and the end date must not precede the start date.
- Quantity must be greater than zero.
- Each enquiry item must reference an active equipment type.
- An enquiry may be assigned to a responsible company/user.
- Conversion to a quote must preserve the original enquiry.
- Declined and cancelled enquiries remain historical records.

---

## 8. Quote Rules

### Lifecycle

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

Rules:

- Only draft quotes may be directly edited.
- Issued quotes are immutable for historical purposes.
- Changes to an issued quote create a new version.
- Quote numbers identify the quote series; versions identify revisions.
- The server calculates authoritative totals.
- Clients must not be trusted to provide final subtotal, VAT or total values.
- An expired, rejected or cancelled quote cannot be accepted without an explicit revision/new quote process.

### Calculation

```text
Line Total = Quantity × Unit Price × Duration
Subtotal = Sum of Line Totals
Total = Subtotal - Discount + VAT
```

The applicable VAT treatment must be configurable according to the business's tax status and future requirements.

---

## 9. Allocation Rules

An allocation is the commitment of a specific asset to a customer/request for a defined period.

### Lifecycle

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

Before reservation or confirmation, the API must verify:

```text
Asset exists
AND
Asset is eligible for hire
AND
No overlapping allocation
AND
No overlapping maintenance
```

Rules:

- The same asset cannot have overlapping confirmed/active allocations.
- Allocation dates must be valid.
- A retired asset cannot be allocated.
- A maintenance conflict blocks allocation where the maintenance period overlaps the requested period.
- Starting an allocation changes the operational state to `active` and the asset to `on_hire` transactionally.
- Completing an allocation changes the allocation to `completed`; the asset becomes `available` only if no other condition prevents availability.
- Cancellation must preserve the allocation history.

Conflicts return `409 Conflict`.

---

## 10. Availability Rules

Availability is derived and must not be treated as a manually maintained permanent value.

An asset is available for a requested period only when:

```text
Asset status permits hire
AND
No conflicting allocation exists
AND
No conflicting maintenance exists
```

Availability checks must use current database state.

Cached catalogue data must never be used as the authoritative source for allocation decisions.

---

## 11. Maintenance Rules

### Lifecycle

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

Rules:

- Maintenance records belong to a specific asset.
- Maintenance periods must be valid.
- Starting maintenance makes the asset unavailable for hire.
- Maintenance that conflicts with an active/confirmed allocation must be rejected or explicitly handled through an approved operational process.
- Completing maintenance may return an asset to `available` only when no other operational condition prevents availability.
- Maintenance history must be retained.

---

## 12. Ownership and Management Rules

Ownership answers:

> Who owns the asset?

Management answers:

> Which company is responsible for operating/managing the asset?

These values must not be combined into one field.

Ownership and management changes must be permission-controlled and audited.

Public applications must not expose internal ownership information unless explicitly approved.

---

## 13. Authorization Rules

Authentication establishes identity. Authorization establishes permitted actions.

Initial roles:

```text
admin
manager
operations
sales
viewer
```

Rules:

- Every private API request requires an authenticated session.
- Permissions are checked server-side.
- UI visibility is not a security control.
- A user must not access or modify records outside their permitted scope.
- Restricted operational data must not be returned merely because a user can reach an endpoint.

---

## 14. Lifecycle Transition Rules

Clients must not arbitrarily change business status fields.

For example, an allocation should not accept:

```json
{
  "status": "active"
}
```

as a generic PATCH operation if the transition requires availability validation.

Instead, the API exposes explicit operations such as:

```text
/reserve
/confirm
/start
/complete
/cancel
```

Each operation validates:

1. current state;
2. user permission;
3. required data;
4. related resource state;
5. business constraints;
6. concurrency conditions;
7. audit requirements.

Invalid transitions return `409 Conflict` where the request conflicts with current business state.

---

## 15. Transactions

Operations affecting multiple related records must be atomic.

Examples:

### Start Hire

```text
allocation.status = active
asset.status = on_hire
```

Both changes succeed or neither is committed.

### Complete Hire

```text
allocation.status = completed
asset.status = available
```

The final asset status must still account for maintenance or other active constraints.

---

## 16. Concurrency Rules

Availability is inherently subject to concurrent requests.

The platform must prevent this scenario:

```text
User A checks asset → available
User B checks asset → available
User A reserves asset
User B reserves same asset
```

The reservation/confirmation operation must re-check availability within the transaction or use equivalent database concurrency protection.

The database is the authority for the final commitment.

---

## 17. Audit Rules

The following should be auditable at minimum:

- ownership changes;
- management changes;
- asset lifecycle changes;
- enquiry assignment;
- quote issuance and acceptance;
- quote revisions;
- allocation creation and lifecycle changes;
- maintenance lifecycle changes;
- permission-sensitive administrative changes.

Audit records should capture:

```text
user
action
entity type
entity id
previous values where applicable
new values where applicable
timestamp
```

Audit records should not be physically deleted as part of normal administration.

---

## 18. Public Data Rules

Public websites may access:

- published equipment types;
- public descriptions;
- public specifications;
- approved images;
- public enquiry functionality.

Public websites must not access by default:

- internal costs;
- ownership information;
- internal operational notes;
- staff assignments;
- audit logs;
- management reporting;
- private customer information belonging to other customers.

Public DTOs must be explicitly defined.

---

## 19. Delete and Archive Rules

Operational history is more important than physical deletion.

Prefer archive/deactivate for:

- companies;
- customers;
- equipment types;
- assets;
- users.

Avoid physical deletion of:

- enquiries;
- quotes;
- allocations;
- maintenance records;
- audit logs.

Deletion may be permitted only where there is a documented technical/legal reason and no historical integrity is compromised.

---

## 20. Error Handling Rules

Business-rule violations must return structured errors.

Example:

```json
{
  "error": {
    "code": "ASSET_ALLOCATION_CONFLICT",
    "message": "Asset is already allocated for the requested period."
  }
}
```

Common domain errors include:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
RESOURCE_NOT_FOUND
INVALID_STATE_TRANSITION
ASSET_ALLOCATION_CONFLICT
ASSET_MAINTENANCE_CONFLICT
QUOTE_NOT_EDITABLE
ASSET_NOT_AVAILABLE
```

---

## 21. Notification Hooks

Operational events should be capable of triggering future notifications without placing notification logic directly into public websites.

Potential events include:

```text
enquiry.created
enquiry.assigned
quote.issued
quote.accepted
allocation.confirmed
allocation.started
allocation.completed
maintenance.started
maintenance.completed
```

The initial implementation may log or queue these events without implementing every notification channel.

---

## 22. Rule Precedence

When rules conflict, apply the following order:

```text
Security / Authorization
        ↓
Data Integrity
        ↓
Lifecycle Rules
        ↓
Availability / Operational Rules
        ↓
Commercial Rules
        ↓
Presentation / UI Behaviour
```

The UI must never override a higher-level rule.

---

## 23. Final Principle

> **Business rules belong to the Operations Platform, not to individual websites, screens or users. The API must enforce the same operational truth regardless of where a request originates.**
