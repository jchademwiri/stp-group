# Data Dictionary — STP Group Operations Platform

**Version:** 1.0  
**Status:** Proposed

This document defines the meaning and intended use of the core operational fields. The database design remains the authoritative structural reference for tables, keys and relationships.

---

## 1. Companies

| Field | Meaning |
|---|---|
| `id` | Internal UUID identifying the company |
| `name` | Registered/business name |
| `code` | Short unique operational code |
| `active` | Whether the company is operationally active |
| `created_at` | Record creation timestamp |
| `updated_at` | Last modification timestamp |

---

## 2. Users

| Field | Meaning |
|---|---|
| `id` | Internal user UUID |
| `company_id` | Company associated with the user |
| `name` | User's display/full name |
| `email` | Login/contact email |
| `role` | Authorization role |
| `active` | Whether the user may operate the system |
| `created_at` | Creation timestamp |
| `updated_at` | Last modification timestamp |

Initial roles: `admin`, `manager`, `operations`, `sales`, `viewer`.

---

## 3. Equipment Types

| Field | Meaning |
|---|---|
| `id` | Internal UUID |
| `name` | Commercial/equipment name |
| `slug` | Public URL-safe identifier |
| `category` | Equipment category |
| `description` | Public or internal description depending on DTO |
| `specifications` | Structured equipment specifications stored as JSONB |
| `images` | Approved image references stored as JSONB |
| `active` | Whether the record remains active |
| `created_at` | Creation timestamp |
| `updated_at` | Last modification timestamp |

Equipment type represents **what is offered**, not a physical unit.

---

## 4. Assets

| Field | Meaning |
|---|---|
| `id` | Internal UUID |
| `asset_number` | Human-readable unique asset identifier |
| `equipment_type_id` | Equipment type represented by the asset |
| `owner_company_id` | Company that owns the asset |
| `managed_by_company_id` | Company responsible for operational management |
| `status` | Current operational status |
| `location` | Current/operational location |
| `condition` | Current recorded condition |
| `notes` | Internal operational notes |
| `created_at` | Creation timestamp |
| `updated_at` | Last modification timestamp |

An asset represents **a physical item the business can allocate**.

---

## 5. Customers

| Field | Meaning |
|---|---|
| `id` | Internal customer UUID |
| `name` | Customer/contact name |
| `company_name` | Customer organisation where applicable |
| `email` | Customer email |
| `phone` | Customer telephone number |
| `address` | Customer address/location information |
| `notes` | Internal customer notes |
| `created_at` | Creation timestamp |
| `updated_at` | Last modification timestamp |

Customer records should be retained for historical relationships.

---

## 6. Enquiries

| Field | Meaning |
|---|---|
| `id` | Internal enquiry UUID |
| `customer_id` | Customer making the request |
| `assigned_company_id` | Company responsible for handling the enquiry |
| `location` | Requested service/hire location |
| `start_date` | Requested start date |
| `end_date` | Requested end date |
| `duration` | Requested hire/service duration |
| `status` | Current enquiry lifecycle state |
| `notes` | Operational or customer-provided notes |
| `created_at` | Creation timestamp |
| `updated_at` | Last modification timestamp |

Human-readable enquiry numbers may be generated separately, e.g. `ENQ-2026-001`.

---

## 7. Enquiry Items

| Field | Meaning |
|---|---|
| `id` | Internal UUID |
| `enquiry_id` | Parent enquiry |
| `equipment_type_id` | Equipment requested |
| `quantity` | Number of units requested |
| `notes` | Item-specific requirements |

Quantity must be greater than zero.

---

## 8. Quotes

| Field | Meaning |
|---|---|
| `id` | Internal quote UUID |
| `enquiry_id` | Enquiry from which the quote originated |
| `quote_number` | Human-readable quote identifier |
| `version` | Revision number of the quote |
| `status` | Quote lifecycle state |
| `subtotal` | Sum before discount and VAT |
| `discount` | Applied discount |
| `vat` | Applicable VAT amount |
| `total` | Authoritative final quote amount |
| `valid_until` | Quote validity date |
| `terms` | Commercial terms |
| `notes` | Quote notes |
| `created_at` | Creation timestamp |
| `updated_at` | Last modification timestamp |

Example identifier:

```text
Q-2026-001 v2
```

---

## 9. Quote Lines

| Field | Meaning |
|---|---|
| `id` | Internal UUID |
| `quote_id` | Parent quote |
| `equipment_type_id` | Equipment type being quoted |
| `asset_id` | Specific asset where the quote has been asset-specific; nullable |
| `description` | Quoted line description |
| `quantity` | Number of units |
| `unit_price` | Price per unit |
| `duration` | Charged duration |
| `total` | Calculated line total |

The server remains authoritative for calculations.

---

## 10. Allocations

| Field | Meaning |
|---|---|
| `id` | Internal allocation UUID |
| `asset_id` | Specific physical asset committed |
| `enquiry_id` | Related customer request |
| `customer_id` | Customer receiving the allocation |
| `company_id` | Operating company responsible for the allocation |
| `start_date` | Allocation start |
| `end_date` | Allocation end |
| `status` | Allocation lifecycle state |
| `notes` | Operational notes |
| `created_at` | Creation timestamp |
| `updated_at` | Last modification timestamp |

Allocation represents **what is committed**, not merely what is available.

---

## 11. Maintenance

| Field | Meaning |
|---|---|
| `id` | Internal maintenance UUID |
| `asset_id` | Asset undergoing maintenance |
| `type` | Maintenance category/type |
| `description` | Work description |
| `start_date` | Maintenance start |
| `end_date` | Maintenance end |
| `status` | Maintenance lifecycle state |
| `notes` | Maintenance notes |
| `created_at` | Creation timestamp |
| `updated_at` | Last modification timestamp |

Maintenance periods affect asset availability.

---

## 12. Audit Logs

| Field | Meaning |
|---|---|
| `id` | Internal audit record UUID |
| `user_id` | User responsible for the action |
| `action` | Action performed |
| `entity_type` | Type of affected record |
| `entity_id` | ID of affected record |
| `old_values` | Previous values where relevant |
| `new_values` | New values where relevant |
| `created_at` | Time the event occurred |

Audit logs preserve operational accountability.

---

## 13. Status Vocabulary

### Asset

```text
available
reserved
on_hire
maintenance
retired
```

### Enquiry

```text
new
reviewing
quoted
awaiting_customer
confirmed
declined
cancelled
```

### Quote

```text
draft
issued
awaiting_customer
accepted
rejected
expired
cancelled
```

### Allocation

```text
requested
reserved
confirmed
active
completed
cancelled
```

### Maintenance

```text
scheduled
in_progress
completed
cancelled
```

---

## 14. Identifier Convention

Database primary keys use UUIDs.

Human-readable identifiers are used for operational communication, for example:

```text
STP-EXC-001
ENQ-2026-001
Q-2026-001
```

Human identifiers must not replace UUIDs as database primary keys.

---

## 15. Date and Time Convention

- Database timestamps use UTC.
- Business dates such as hire start/end dates are date values unless a time is explicitly required.
- API timestamps use ISO 8601 format.
- Display timezone is determined by the application/user context.

---

## 16. JSONB Usage

JSONB is appropriate for flexible attributes such as:

- equipment specifications;
- image metadata;
- audit snapshots.

Core relational business relationships must remain normalised and must not be hidden inside JSONB.
