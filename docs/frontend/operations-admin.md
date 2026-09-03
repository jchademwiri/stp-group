# Operations Admin Design

**Project:** STP Group Operations Platform  
**Application:** Operations Administration  
**Status:** Proposed

---

## 1. Purpose

The Operations Administration application is the internal interface used by authorised staff to operate the STP Group equipment-hire and logistics platform.

The application consumes the Operations API. It does not connect directly to Neon PostgreSQL.

```text
Staff User
    ↓
Operations Admin (Next.js)
    ↓
Operations API
    ↓
Business Rules
    ↓
Drizzle ORM
    ↓
Neon PostgreSQL
```

The Admin application is responsible for presentation, navigation, forms, workflow interaction and operational visibility. The API remains authoritative for validation, permissions, lifecycle transitions and business rules.

---

## 2. Design Principles

1. API-first architecture
2. Server-authoritative business rules
3. Role-based access control
4. Clear separation between viewing and mutation
5. Lifecycle actions instead of arbitrary status editing
6. Confirmation for destructive or consequential operations
7. Audit visibility for important changes
8. Responsive desktop-first administration interface
9. Consistent loading, empty, error and success states
10. No direct database access from the browser

---

## 3. Primary Navigation

The initial navigation should include:

```text
Dashboard

Operations
├── Enquiries
├── Quotes
├── Allocations
└── Availability

Inventory
├── Equipment Types
├── Assets
└── Maintenance

Customers

Companies

Administration
├── Users
└── Audit Logs
```

Navigation items must be filtered according to the authenticated user's permissions.

---

## 4. Dashboard

The dashboard provides an operational summary rather than replacing detailed modules.

Initial dashboard information:

- New enquiries
- Enquiries requiring review
- Quotes awaiting customer response
- Upcoming allocations
- Active hires
- Assets currently unavailable
- Maintenance in progress
- Equipment availability warnings

The dashboard should link directly to the relevant records or filtered module views.

---

## 5. Enquiry Management

The enquiry list should support:

- Search
- Status filtering
- Date filtering
- Assignment filtering
- Customer filtering
- Equipment filtering
- Pagination

The enquiry detail view should display:

- Customer information
- Requested equipment
- Hire dates
- Location
- Notes
- Assignment
- Current status
- Related quotes
- Related allocations
- Audit history where permitted

Available actions depend on lifecycle state and permissions.

```text
New
 ↓
Start Review
 ↓
Assign
 ↓
Convert to Quote
```

Decline and cancel actions require confirmation.

---

## 6. Quote Management

Quote creation should be driven from an enquiry where possible.

Quote screens should provide:

- Customer details
- Equipment lines
- Quantity
- Duration
- Unit price
- Discount
- VAT configuration
- Total
- Validity date
- Terms and notes
- Quote version

The server calculates authoritative totals.

Issued quotes must not be silently edited. Changes require a new quote version.

```text
Q-2026-001 v1
       ↓ revise
Q-2026-001 v2
```

---

## 7. Asset Management

The asset list should provide operational visibility of physical equipment.

Columns should include, where permitted:

- Asset number
- Equipment type
- Owner company
- Managing company
- Status
- Location
- Condition
- Current allocation
- Maintenance status

Asset detail should provide:

- Identity
- Equipment type
- Ownership
- Management responsibility
- Operational status
- Location
- Condition
- Allocation history
- Maintenance history
- Audit history

Asset status changes must use lifecycle actions exposed by the API.

---

## 8. Availability

Availability is an operational query, not a manually maintained field.

The interface should allow staff to enter:

- Equipment type
- Quantity
- Start date
- End date
- Location where applicable

The API returns current availability based on allocations, maintenance and asset status.

The UI must clearly distinguish:

```text
Available
Partially Available
Unavailable
```

Availability results should not be treated as a permanent reservation. Reservation or allocation must be performed through the appropriate lifecycle operation.

---

## 9. Allocation Management

Allocation management is one of the highest-risk operational areas.

The interface should display:

- Customer
- Enquiry
- Equipment type
- Specific asset
- Start date
- End date
- Status
- Responsible company
- Operational notes

Before reserving or confirming an asset, the API performs the authoritative conflict check.

A conflict must be displayed clearly and must not be silently overridden by the UI.

```text
Requested
   ↓
Reserved
   ↓
Confirmed
   ↓
Active
   ↓
Completed
```

Cancellation requires confirmation and an appropriate reason where required by business rules.

---

## 10. Maintenance Management

Maintenance screens should provide:

- Asset
- Maintenance type
- Description
- Scheduled dates
- Status
- Notes

Lifecycle:

```text
Scheduled
   ↓
In Progress
   ↓
Completed
```

The system must prevent maintenance operations from creating an invalid availability state.

---

## 11. Customer Management

Customer management should provide:

- Search
- Contact details
- Company information
- Address
- Enquiry history
- Quote history
- Allocation history
- Notes where authorised

Customers should normally be archived rather than physically deleted.

---

## 12. Company Management

Company records support the distinction between:

- Ownership
- Operational management
- Assignment

The UI should make these responsibilities explicit wherever they appear.

Deactivation should require confirmation and should preserve historical records.

---

## 13. Forms and Validation

Client-side validation improves usability, but it does not replace server-side validation.

Form flow:

```text
User Input
   ↓
Client Validation
   ↓
API Request
   ↓
Server Validation
   ↓
Business Rules
   ↓
Database Transaction
```

Validation errors should identify the affected field where possible.

---

## 14. Lifecycle Actions

The UI should expose only actions valid for the current resource state.

Example:

```text
Draft Quote
├── Edit
└── Issue

Issued Quote
├── Revise
└── Cancel

Accepted Quote
└── View
```

The API remains the final authority and may reject an action even when it is displayed by the UI because another user may have changed the resource first.

---

## 15. Concurrency

The application must assume that multiple staff members can operate on the same records simultaneously.

Examples:

- Two users attempt to reserve the same asset.
- One user cancels an allocation while another attempts to start it.
- One user revises a quote while another is viewing an older version.

The API must resolve these conditions using transactions, state validation and appropriate conflict responses.

The UI should refresh or invalidate affected data after successful mutations.

---

## 16. Error Handling

Standard API errors should be converted into clear operational messages.

Example:

```text
Asset allocation conflict

The selected asset is already allocated for part of the requested period.
Please review availability and select another asset or date range.
```

The UI must distinguish between:

- Validation errors
- Authentication errors
- Authorization errors
- Not found
- Business conflicts
- Server errors
- Network failures

---

## 17. Audit Visibility

Important operational changes should be traceable.

Where the user's role permits, records should expose relevant audit information such as:

- User
- Action
- Date/time
- Previous state
- New state

Audit logs are read-only from the Admin application.

---

## 18. Permissions

The UI should use permissions to control access to modules and actions.

Initial roles:

| Role | General Access |
|---|---|
| Admin | Full administration and operational control |
| Manager | Full operational management within assigned scope |
| Operations | Inventory, availability, allocations and maintenance |
| Sales | Customers, enquiries and quotes |
| Viewer | Read-only access |

Hiding an action in the UI is a usability measure, not a security boundary. The API must enforce permissions independently.

---

## 19. Data Refresh Strategy

Use normal server/API fetching for operational records.

Suggested approach:

- Revalidate after mutations.
- Refresh availability after allocation changes.
- Refresh asset state after maintenance or allocation changes.
- Avoid long-lived client caches for availability.
- Use pagination for large datasets.

Real-time updates may be introduced later if operational requirements justify them.

---

## 20. Audit and UX Safety

Actions with operational or financial consequences should use confirmation dialogs where appropriate.

Examples:

- Retire asset
- Deactivate company
- Archive customer
- Cancel allocation
- Cancel quote
- Reject quote
- Complete hire

The interface should clearly identify the action and its consequence before confirmation.

---

## 21. Out of Scope for Initial Admin Release

The first release does not require:

- Customer self-service portal
- Supplier marketplace
- Automated dispatch optimisation
- Advanced route planning
- Full accounting replacement
- Automated dynamic pricing
- Mobile-native application

These may be added as separate modules later.

---

## 22. Acceptance Criteria

The Operations Admin application is acceptable when:

- Authenticated users can access authorised modules.
- Role restrictions are enforced by the API.
- Staff can manage customers, enquiries, quotes, assets, allocations and maintenance.
- Lifecycle actions are presented according to resource state.
- Availability uses current operational data.
- Allocation conflicts are clearly handled.
- Quote totals come from server-side calculations.
- Important changes are auditable.
- The browser never connects directly to Neon.
- Errors are presented in an understandable operational form.

---

# Final Principle

> **The Operations Admin application is the control surface for the business; the Operations API remains the authority that decides what the business is allowed to do.**
