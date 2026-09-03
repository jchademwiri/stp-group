# Disaster Recovery & Backup — Operations Platform

**Project:** STP Group Operations Platform  
**Status:** Proposed

---

## 1. Purpose

This document defines the backup, recovery and disaster-recovery requirements for the STP Group Operations Platform.

The primary objective is to protect operational data and restore business-critical services after infrastructure failure, data corruption, accidental deletion, security incidents or deployment failures.

---

## 2. Recovery Objectives

The project must define two primary recovery objectives:

```text
RPO — Recovery Point Objective
RTO — Recovery Time Objective
```

### RPO

The maximum acceptable amount of recent data that may be lost after a failure.

### RTO

The maximum acceptable time required to restore the affected service.

Final numeric targets should be agreed before production launch based on business requirements and hosting capabilities.

---

## 3. Critical Data

The following data is considered operationally important:

- companies
- users
- equipment types
- assets
- customers
- enquiries
- quotes
- quote versions
- allocations
- maintenance records
- audit logs

Particular priority should be given to active enquiries, quotes, allocations and asset status because these directly affect current operations.

---

## 4. Backup Architecture

```text
Operations Application
        ↓
   Neon PostgreSQL
        ↓
Managed Database Backups
        ↓
Recovery / Restore Process
```

Database backups and point-in-time recovery should use the capabilities provided by the selected Neon production configuration.

Application source code is separately protected by Git and the remote repository.

---

## 5. Database Recovery

Recovery procedures should support restoration after:

- accidental data deletion
- data corruption
- failed migration
- application defect
- database outage
- infrastructure failure

Database restoration must be performed using an approved recovery procedure rather than ad-hoc manipulation of production records.

---

## 6. Point-in-Time Recovery

Where supported by the production database configuration, point-in-time recovery should be used when only a portion of recent database history needs to be restored.

Example:

```text
09:00 — Normal operation
09:30 — Incorrect migration
09:45 — Problem discovered

Restore target → known-good point before 09:30
```

The exact recovery capability depends on the production Neon plan/configuration.

---

## 7. Backup Verification

A backup is not considered reliable merely because it exists.

Recovery procedures must periodically verify that backups can actually be restored.

Recommended process:

```text
Backup
  ↓
Restore to isolated environment
  ↓
Validate schema
  ↓
Validate records
  ↓
Run application checks
  ↓
Record result
```

Restore testing should not modify the production database.

---

## 8. Application Recovery

The applications should be recoverable from source control and deployment configuration.

```text
Git Repository
      ↓
Build
      ↓
Vercel Deployment
      ↓
Application Restored
```

Required application configuration must be documented and reproducible.

Secrets must be restored through the secure environment-variable system rather than stored in source control.

---

## 9. Infrastructure Failure

If the Operations application becomes unavailable:

1. Confirm the scope of the outage.
2. Check hosting/deployment status.
3. Check database availability.
4. Check recent deployments.
5. Roll back the application where appropriate.
6. Restore database state only if required.
7. Verify API health.
8. Verify critical operational workflows.
9. Document the incident.

---

## 10. Failed Database Migration

Database migrations are high-risk recovery events.

Before a production migration:

```text
Backup
  ↓
Migration Review
  ↓
Preview/Test
  ↓
Production Migration
  ↓
Validation
```

If a migration fails:

- stop further dependent deployments
- preserve error information
- determine whether the schema is partially changed
- restore or repair using the approved migration strategy
- validate data integrity
- document the outcome

Avoid destructive migrations where a compatible staged migration is possible.

---

## 11. Accidental Data Deletion

For accidental deletion of operational records:

1. Stop further destructive activity.
2. Identify the affected records and time window.
3. Determine whether records can be safely restored from audit/history.
4. If necessary, restore a database copy to an isolated environment.
5. Extract the required records.
6. Validate relationships.
7. Restore into production using a controlled process.
8. Record the recovery operation.

Do not overwrite the entire production database when only a small number of records require recovery.

---

## 12. Security Incident Recovery

If credentials or infrastructure access are compromised:

```text
Contain
   ↓
Revoke / Rotate Credentials
   ↓
Assess Access
   ↓
Preserve Evidence
   ↓
Recover
   ↓
Validate
   ↓
Monitor
```

Affected secrets should be rotated immediately.

The incident must be investigated for unauthorized changes to operational data.

Audit logs should be reviewed for:

- user changes
- ownership changes
- asset changes
- quote changes
- allocation changes
- permission changes

---

## 13. Disaster Scenarios

The recovery plan should cover at least:

| Scenario | Primary Recovery Approach |
|---|---|
| Application outage | Vercel deployment recovery/rollback |
| Failed deployment | Roll back application deployment |
| Database outage | Database provider recovery procedure |
| Failed migration | Controlled migration recovery |
| Accidental deletion | Restore/recover affected data |
| Data corruption | Point-in-time/database recovery |
| Credential compromise | Revoke/rotate and investigate |
| Complete application rebuild | Git + environment configuration |

---

## 14. Business Continuity

During a temporary Operations Platform outage, the business needs a controlled fallback process.

The fallback must not create uncontrolled duplicate operational records.

For example:

```text
Operations Platform unavailable
        ↓
Temporary controlled enquiry register
        ↓
Platform restored
        ↓
Reconcile and import
```

Any manual fallback records must be clearly identified and reconciled after recovery.

---

## 15. Recovery Validation

After recovery, validate at minimum:

- application availability
- database connectivity
- authentication
- authorization
- equipment catalogue
- asset records
- customer records
- active enquiries
- quotes
- active allocations
- maintenance records
- availability calculations
- audit logging
- public enquiry submission

Critical operational workflows should be smoke-tested before normal operations resume.

---

## 16. Recovery Runbook

A production recovery runbook should contain:

```text
Incident identification
Contact/escalation information
Hosting recovery steps
Database recovery steps
Migration recovery steps
Credential rotation steps
Validation checklist
Rollback procedure
Post-incident documentation
```

The runbook should be stored in a location accessible when the primary application is unavailable.

---

## 17. Recovery Testing

Recovery procedures should be tested periodically.

Testing should include:

- database restore
- application redeployment
- failed migration scenario
- backup verification
- credential rotation
- operational smoke testing

The result of each exercise should be documented, including any recovery-time gaps.

---

## 18. Data Integrity After Recovery

Recovery is not complete merely because the application starts.

The recovered system must preserve relationships such as:

```text
Customer
   ↓
Enquiry
   ↓
Quote
   ↓
Allocation
   ↓
Asset
```

And:

```text
Asset
 ├── Allocations
 └── Maintenance
```

Availability must be recalculated from the recovered operational records.

---

## 19. Backup Security

Backups and recovery environments must be protected from unauthorized access.

Do not expose backup credentials or recovery access through source code.

Access to recovery operations should be restricted to authorized personnel.

---

## 20. Recovery Logging

Recovery activities must be documented.

Record:

- incident identifier
- date/time
- affected systems
- recovery action
- operator
- recovery point
- validation results
- outstanding issues

Where technically appropriate, recovery events should also be represented in audit or operational records.

---

## 21. Recovery Acceptance Criteria

The disaster-recovery plan is considered production-ready when:

- RPO is defined
- RTO is defined
- database backups are configured
- recovery capabilities are understood
- restore testing has been completed
- application redeployment is repeatable
- migration recovery is documented
- credential rotation is documented
- critical workflows have a recovery validation checklist
- business continuity procedures exist
- recovery responsibilities are assigned

---

## 22. Final Principle

> **A production system is not resilient because it has backups; it is resilient when the business can reliably restore the system, validate its integrity and resume operations.**
