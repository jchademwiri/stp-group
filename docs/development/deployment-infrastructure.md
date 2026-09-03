# Deployment & Infrastructure — Operations Platform

**Project:** STP Group Operations Platform  
**Status:** Proposed  
**Primary Hosting:** Vercel  
**Database:** Neon PostgreSQL

---

## 1. Purpose

This document defines the deployment model, infrastructure boundaries, environment configuration and operational requirements for the STP Group Operations Platform.

The deployment architecture must support the STP website, LME website, Operations application/API and shared PostgreSQL database while keeping operational data secure and deployments repeatable.

---

## 2. Target Infrastructure

```text
                         ┌──────────────────┐
                         │   Public Users   │
                         └────────┬─────────┘
                                  │
                         HTTPS / Internet
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
        ┌───────▼────────┐                  ┌───────▼────────┐
        │   STP Website  │                  │   LME Website  │
        │     Astro      │                  │     Astro      │
        └───────┬────────┘                  └───────┬────────┘
                │                                   │
                └────────────────┬──────────────────┘
                                 │ HTTPS / REST
                         ┌───────▼────────┐
                         │ Operations App │
                         │    Next.js     │
                         │ API + Admin UI │
                         └───────┬────────┘
                                 │
                           Drizzle ORM
                                 │
                         ┌───────▼────────┐
                         │ Neon PostgreSQL│
                         └────────────────┘
```

Authentication is handled by Better Auth within the Operations application.

---

## 3. Applications

### STP Website

Technology:

```text
Astro
TypeScript
Tailwind CSS
```

Responsibilities:

- public STP pages
- equipment catalogue presentation
- service pages
- enquiry forms
- SEO and public content

The website does not directly access Neon.

### LME Website

Technology:

```text
Astro
TypeScript
Tailwind CSS
```

Responsibilities:

- public LME pages
- equipment catalogue presentation
- enquiry forms
- SEO and public content

The website does not directly access Neon.

### Operations Platform

Technology:

```text
Next.js
TypeScript
Better Auth
Zod
Drizzle ORM
```

Responsibilities:

- REST API
- authentication
- authorization
- business rules
- operational administration
- availability
- lifecycle operations
- audit logging

### Database

Neon PostgreSQL is the authoritative operational database.

Only the Operations application should connect directly to the database.

---

## 4. Environment Model

Use separate environments for development, preview and production.

```text
Development
    ↓
Preview / Staging
    ↓
Production
```

### Development

Used for local implementation and testing.

Typical configuration:

```text
DATABASE_URL=<development database>
BETTER_AUTH_SECRET=<development secret>
BETTER_AUTH_URL=http://localhost:3000
```

### Preview

Used for pull-request and integration validation.

Preview environments must not use production credentials or production secrets unless explicitly required and protected.

### Production

Production contains live operational data and must use production-only credentials and secrets.

---

## 5. Vercel Deployment

Vercel is the target hosting platform for the web applications and Operations application.

Deployments should be connected to the Git repository.

Recommended model:

```text
Git Push
   ↓
Vercel Build
   ↓
Checks
   ↓
Deployment
```

Production deployment should be associated with the production branch/process approved by the project team.

---

## 6. Turborepo Deployment

The repository is a Turborepo monorepo containing multiple applications.

```text
apps/
├── stp
├── lme
└── operations

packages/
├── inventory-types
├── api-client
├── validation
└── tailwind
```

Each application should have its own Vercel project when independent deployment is required.

Shared packages are built as part of the relevant application deployment.

---

## 7. Database Infrastructure

Neon PostgreSQL is the production database.

Requirements:

- SSL/TLS database connections
- production database isolation
- restricted credentials
- automated backups/point-in-time recovery according to the selected Neon plan
- migration history
- monitoring of database health

The application must not embed database credentials in client-side code.

---

## 8. Database Migrations

Database schema changes are managed through Drizzle migrations.

```text
Schema Change
     ↓
Drizzle Migration
     ↓
Review
     ↓
Preview/Test
     ↓
Production Migration
```

Production migrations must be reviewed before execution.

Never modify the production schema manually when the change can be represented by a version-controlled migration.

---

## 9. Environment Variables

Core Operations variables include:

```text
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
```

Additional integrations may introduce variables for:

```text
Email provider
Monitoring
Storage
External APIs
```

Secrets must be stored in the hosting platform's secret/environment-variable system.

Do not commit:

- `.env`
- production credentials
- API keys
- authentication secrets
- database passwords

`.env.example` should document required variable names without real secret values.

---

## 10. Domain Architecture

Production domains should separate public websites from the Operations application.

Conceptually:

```text
stp-domain
lme-domain
operations-domain
```

The final domains are determined during production setup.

API consumers should use a stable Operations API base URL.

Example:

```text
https://operations.example.com/api/v1
```

---

## 11. HTTPS

All production traffic must use HTTPS.

HTTP requests should redirect to HTTPS where supported.

The following must never be sent over plain HTTP in production:

- authentication credentials
- sessions
- customer information
- operational data
- API credentials

---

## 12. Authentication Infrastructure

Better Auth manages Operations user authentication.

```text
Browser
   ↓
Operations Application
   ↓
Better Auth
   ↓
Session
   ↓
Authorization
```

Authentication secrets must be environment-specific.

Session cookies should use secure production settings.

---

## 13. API Deployment Rules

The API is deployed together with the Operations application unless a separate service becomes necessary.

API routes must:

- validate input
- authenticate private requests
- authorize actions
- execute business rules
- use database transactions where required
- return consistent errors
- record important audit events

The API must not expose database internals directly.

---

## 14. Public Website Deployment Rules

STP and LME websites should remain independently deployable from the Operations application.

A public website deployment must not require a database migration unless the application explicitly depends on a changed API contract.

Public catalogue requests should tolerate temporary API failures gracefully.

Operational actions must not be simulated using stale client-side data.

---

## 15. Caching

Public catalogue data may be cached where appropriate.

Availability and allocation data must use sufficiently current database state.

Do not cache operational availability responses in a way that can result in conflicting bookings.

```text
Catalogue → Cache acceptable
Availability → Current data required
Allocation → Transactional write
```

---

## 16. Build and Deployment Checks

Before production deployment, validate:

- TypeScript compilation
- linting
- unit tests
- integration tests
- API contract checks
- database migration status
- environment variables
- authentication configuration
- build output

A failed build must not be promoted to production.

---

## 17. Deployment Workflow

Recommended workflow:

```text
Feature Branch
      ↓
Pull Request
      ↓
Automated Checks
      ↓
Preview Deployment
      ↓
Review / QA
      ↓
Merge
      ↓
Production Deployment
      ↓
Post-Deployment Verification
```

Database migrations should be handled as a controlled part of deployment.

---

## 18. Rollback

Application rollback should use the hosting platform's previous deployment/version mechanism.

Database rollback is more sensitive.

For destructive or incompatible migrations:

1. Back up data.
2. Deploy compatible application code.
3. Apply migration.
4. Validate.
5. Only then remove legacy fields/data.

Prefer forward-compatible migrations over destructive rollback strategies.

---

## 19. Observability

The Operations application should provide enough logging to diagnose:

- API failures
- authentication failures
- authorization failures
- database failures
- validation failures
- allocation conflicts
- migration failures
- external integration failures

Logs must not expose passwords, authentication secrets or unnecessary sensitive customer information.

Operationally important actions should also be represented in audit logs where defined by the business rules.

---

## 20. Monitoring

Monitor at minimum:

- application availability
- deployment failures
- API error rates
- database connectivity
- database performance
- authentication failures
- allocation conflict rates
- email/integration failures

Alert thresholds should be defined before production launch.

---

## 21. Backups and Recovery

Production database backups must be enabled according to the selected Neon configuration.

Recovery procedures must be documented and periodically tested.

Backup objectives should define:

```text
RPO — acceptable data loss window
RTO — acceptable recovery time
```

Operational records such as enquiries, quotes, allocations and audit records are business-critical and must be included in the recovery strategy.

---

## 22. Security Requirements

Production infrastructure must enforce:

- HTTPS
- secure secrets management
- least-privilege database access
- authenticated administrative access
- role-based authorization
- server-side validation
- rate limiting on public endpoints
- audit logging
- dependency updates
- protected deployment configuration

No client-side application should receive credentials that provide direct database access.

---

## 23. Infrastructure Acceptance Criteria

The infrastructure is ready for production when:

- STP deploys successfully
- LME deploys successfully
- Operations deploys successfully
- all applications use HTTPS
- production environment variables are configured
- Better Auth operates correctly
- Neon production database is accessible only through approved application paths
- Drizzle migrations execute successfully
- preview deployments work
- production rollback is understood
- backups/recovery are configured
- monitoring/logging is available
- secrets are not committed to Git
- API health and error handling have been tested

---

## 24. Final Principle

> **Infrastructure should make the application predictable to deploy, secure to operate and recoverable when something goes wrong.**
