# Authentication & Authorization — STP Group Operations Platform

**Version:** 1.0  
**Status:** Proposed

---

## 1. Purpose

This document defines how users authenticate to the Operations Platform and how the API determines what authenticated users are permitted to do.

---

## 2. Security Model

```text
User
 ↓
Better Auth
 ↓
Authenticated Session
 ↓
API Request
 ↓
Authentication Check
 ↓
Authorization / RBAC
 ↓
Business Rule Validation
 ↓
Service
 ↓
Database
```

Authentication and authorization are enforced server-side.

---

## 3. Authentication

Better Auth is the authentication framework for Operations users.

The initial system is intended for internal staff rather than public customer accounts.

The API must reject private requests when no valid authenticated session exists.

```text
401 Unauthorized
```

Public catalogue and enquiry endpoints may be unauthenticated where explicitly configured.

---

## 4. Authorization

Authorization determines whether an authenticated user may perform a specific operation.

Initial roles:

| Role | Purpose |
|---|---|
| `admin` | Full system administration |
| `manager` | Operational and management control |
| `operations` | Inventory, allocations and maintenance |
| `sales` | Customers, enquiries and quotes |
| `viewer` | Read-only access |

Authorization must be checked by the API and must not rely on UI restrictions.

---

## 5. Permission Model

The initial permission model is resource/action based.

```text
catalogue.read
assets.read
assets.manage
enquiries.read
enquiries.manage
quotes.read
quotes.manage
allocations.read
allocations.manage
maintenance.read
maintenance.manage
customers.read
customers.manage
companies.manage
users.manage
audit.read
```

Roles map to permissions. The permission model may later become more granular.

---

## 6. Role Expectations

### Admin

Can manage users, companies, inventory, operational records, configuration and audit-sensitive functions.

### Manager

Can manage operational resources and business workflows within the manager's permitted scope.

### Operations

Can manage assets, availability-related operations, allocations and maintenance.

### Sales

Can manage customers, enquiries and quotes, with limited visibility into operational information.

### Viewer

Read-only access to permitted operational information.

---

## 7. Scope Restrictions

A role alone does not necessarily grant access to every record.

The API may apply scope restrictions based on:

- company;
- assigned company;
- managed-by company;
- ownership;
- operational responsibility.

For example, a user may have permission to manage assets but only assets within their operational company scope.

---

## 8. Public vs Private Data

Public applications receive explicit public DTOs.

They must not receive unrestricted database objects.

### Public

- published catalogue information;
- approved equipment specifications;
- approved images;
- enquiry submission.

### Private

- ownership information;
- internal costs;
- operational notes;
- assignments;
- customer records;
- allocations;
- maintenance details;
- audit logs.

---

## 9. API Security Requirements

Private API routes must:

1. validate the session;
2. determine the user and role;
3. check resource/action permission;
4. enforce company/scope restrictions;
5. validate the request;
6. apply business rules;
7. perform the operation;
8. record required audit information.

---

## 10. Unauthorized and Forbidden Responses

No valid session:

```http
401 Unauthorized
```

Valid session but insufficient permission:

```http
403 Forbidden
```

Do not expose sensitive information through error messages.

---

## 11. Session Security

Session handling must follow Better Auth's supported secure configuration.

Production requirements include:

- HTTPS;
- secure cookies;
- appropriate cookie scope;
- protected session secrets;
- no secrets committed to Git;
- session invalidation when required;
- controlled administrative access.

---

## 12. Password and Credential Handling

The application must not implement custom password storage when Better Auth provides the authentication mechanism.

Credentials and secrets must be managed through the authentication system and deployment environment configuration.

---

## 13. Administrative Security

Administrative actions must be treated as privileged operations.

At minimum, the system should audit:

- user creation/deactivation;
- role changes;
- company changes;
- ownership changes;
- management changes;
- lifecycle actions;
- other security-sensitive configuration changes.

---

## 14. Rate Limiting and Abuse Protection

Public endpoints, particularly enquiry submission, should have rate limiting and abuse protection.

The exact provider/implementation may be selected during deployment.

Private endpoints should also have appropriate throttling for sensitive operations where required.

---

## 15. Data Access Principle

```text
Public Website
      │
      ▼
 Public API DTO
      │
      ▼
 Business Rules
      │
      ▼
 Authorised Data Access
      │
      ▼
 Neon PostgreSQL
```

Applications must not bypass authorization by accessing the database directly.

---

## 16. Security Configuration

Core deployment secrets/configuration include:

```text
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
```

Secrets must be configured through environment variables or the deployment platform's secret-management facilities.

---

## 17. Security Failure Principle

When authorization or security state cannot be established reliably, the operation must fail closed rather than proceeding with assumed permissions.

---

## 18. Future Security Enhancements

Potential future requirements:

- MFA;
- stronger administrative policies;
- session/device management;
- IP/risk controls;
- customer authentication;
- API keys for external integrations;
- service-to-service authentication;
- security event monitoring.

These should be introduced through explicit architecture decisions.
