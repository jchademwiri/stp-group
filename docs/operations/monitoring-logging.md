# Monitoring & Logging — Operations Platform

**Project:** STP Group Operations Platform  
**Status:** Proposed

---

## 1. Purpose

This document defines the monitoring, logging, alerting and operational observability requirements for the Operations Platform.

The objective is to detect failures early, diagnose operational problems quickly and maintain an auditable record of important business actions without exposing sensitive information.

---

## 2. Observability Model

The platform should provide three complementary signals:

```text
Logs
  ↓
What happened?

Metrics
  ↓
How often / how much?

Traces / Request Context
  ↓
Where did it happen?
```

These signals should be correlated using a request or correlation identifier where practical.

---

## 3. Monitoring Layers

Monitor the platform at four levels:

```text
Infrastructure
      ↓
Application
      ↓
API / Database
      ↓
Business Operations
```

### Infrastructure

Monitor:

- deployment status
- application availability
- runtime failures
- database connectivity

### Application

Monitor:

- exceptions
- failed requests
- response times
- authentication failures

### API / Database

Monitor:

- API error rates
- slow requests
- database errors
- connection failures
- migration failures

### Business Operations

Monitor:

- enquiries received
- quotes issued
- allocations created
- allocation conflicts
- maintenance activity
- failed notifications

---

## 4. Structured Logging

Application logs should be structured rather than relying exclusively on free-form text.

Example:

```json
{
  "level": "error",
  "timestamp": "2026-09-03T10:00:00Z",
  "service": "operations-api",
  "requestId": "request-id",
  "event": "allocation_conflict",
  "entityType": "allocation",
  "entityId": "uuid",
  "code": "ASSET_ALLOCATION_CONFLICT"
}
```

Structured logs make searching, filtering and alerting more reliable.

---

## 5. Log Levels

Use consistent log levels:

```text
DEBUG
INFO
WARN
ERROR
```

### DEBUG

Development diagnostics that are not normally required in production.

### INFO

Normal significant application events.

Examples:

- API request completed
- enquiry created
- quote issued
- allocation confirmed

### WARN

Unexpected conditions that do not necessarily stop an operation.

Examples:

- external service temporarily unavailable
- repeated validation failures
- unusual but recoverable condition

### ERROR

A failure requiring investigation.

Examples:

- database failure
- unhandled exception
- failed transaction
- migration failure

---

## 6. Sensitive Data Rules

Logs must not contain:

- passwords
- authentication secrets
- API keys
- session tokens
- full payment credentials
- unnecessary personal information
- database credentials

Customer data should only be logged when necessary for diagnosis and should be minimized.

---

## 7. Request Correlation

Each API request should have a correlation/request identifier where practical.

```text
Incoming Request
      ↓
requestId
      ↓
API Handler
      ↓
Service
      ↓
Database / Integration
```

The same identifier should be included in relevant logs so a failed operation can be traced across application layers.

---

## 8. API Metrics

Track at minimum:

- request count
- response time
- 2xx responses
- 4xx responses
- 5xx responses
- rate-limit responses
- authentication failures
- authorization failures

Break down important metrics by endpoint where practical.

---

## 9. Database Metrics

Monitor:

- connection failures
- query latency
- query errors
- connection utilization
- transaction failures
- migration failures
- abnormal database load

Slow queries affecting availability or administration searches should be investigated.

---

## 10. Availability Monitoring

Availability is a critical business function.

Monitor:

- availability query failures
- slow availability requests
- allocation conflict frequency
- transaction failures
- database errors during reservation

A sudden increase in allocation conflicts may indicate either legitimate demand or an application/data problem and should be investigated.

---

## 11. Business Metrics

Recommended operational metrics:

```text
Enquiries received
Quotes created
Quotes issued
Quotes accepted
Quotes rejected
Allocations reserved
Allocations confirmed
Allocations cancelled
Allocations completed
Maintenance events
Available assets
Assets on hire
Assets under maintenance
```

These metrics can later support management reporting and utilization analysis.

---

## 12. Authentication Monitoring

Monitor:

- failed login attempts
- successful logins
- session failures
- unusual authentication activity
- repeated access failures

A high volume of failed authentication attempts should generate an operational/security alert according to configured thresholds.

---

## 13. Authorization Monitoring

Monitor denied access to sensitive operations.

Examples:

```text
403 Forbidden
Role mismatch
Company scope violation
Unauthorized lifecycle operation
```

Repeated authorization failures may indicate either configuration problems or suspicious activity.

---

## 14. External Integration Monitoring

External services may include:

- email provider
- future document storage
- future finance integration
- future dispatch systems

Monitor:

- request failures
- timeout rates
- authentication failures
- response errors
- retry behaviour

External integration failures should not silently corrupt operational state.

---

## 15. Alerting

Alerts should focus on actionable conditions.

Priority levels:

```text
Critical
High
Medium
Informational
```

### Critical

Examples:

- Operations API unavailable
- production database unavailable
- severe authentication failure
- data integrity failure

### High

Examples:

- sustained 5xx errors
- repeated transaction failures
- migration failure
- major external integration outage

### Medium

Examples:

- elevated latency
- increased validation failures
- moderate integration failures

### Informational

Normal operational events that may be useful for reporting but do not require immediate action.

---

## 16. Health Checks

The Operations application should expose an appropriate health endpoint.

Conceptually:

```http
GET /api/health
```

The health check should verify application readiness and, where appropriate, required database connectivity.

Do not expose sensitive infrastructure details in public health responses.

---

## 17. Deployment Monitoring

Every deployment should be monitored after release.

Recommended sequence:

```text
Deploy
  ↓
Health Check
  ↓
Smoke Test
  ↓
Monitor Error Rate
  ↓
Confirm Normal Operation
```

A sudden increase in errors after deployment should trigger investigation or rollback according to release procedures.

---

## 18. Audit Logging vs Application Logging

These are different concerns.

### Application Logs

Used primarily for technical diagnosis.

### Audit Logs

Used to record important business actions.

Examples:

```text
Asset ownership changed
Asset retired
Quote issued
Quote accepted
Allocation confirmed
Allocation cancelled
Maintenance completed
User permission changed
```

Audit records are part of the operational data model and should follow the business rules defined for auditability.

---

## 19. Retention

Log retention should be defined according to operational, security and legal requirements.

Audit retention should generally be longer than technical diagnostic logs where business history requires it.

Retention policies must be documented rather than relying on indefinite storage by default.

---

## 20. Incident Investigation

When an incident occurs, investigation should follow:

```text
Identify
   ↓
Contain
   ↓
Investigate
   ↓
Recover
   ↓
Validate
   ↓
Document
   ↓
Prevent recurrence
```

Use request IDs, timestamps, deployment history, application logs and audit records to reconstruct important events.

---

## 21. Operational Dashboards

The Operations application should eventually provide dashboards for business users.

Potential dashboard metrics:

- open enquiries
- pending quotes
- active allocations
- upcoming allocations
- assets currently on hire
- assets under maintenance
- available assets
- recent operational activity

Technical infrastructure monitoring should remain separate from the business dashboard where appropriate.

---

## 22. Performance Thresholds

Initial thresholds should be established during production testing rather than arbitrarily fixed before realistic workload data exists.

Track:

- p50 latency
- p95 latency
- p99 latency
- error rate
- database query latency

Thresholds should be reviewed as production usage grows.

---

## 23. Monitoring Acceptance Criteria

Monitoring is considered production-ready when:

- application errors are captured
- structured logs are available
- request correlation exists
- API errors are measurable
- database failures are detectable
- authentication failures are monitored
- deployment health is monitored
- health checks exist
- actionable alerts are configured
- sensitive values are excluded from logs
- audit events are retained according to policy
- incident investigation can reconstruct important operational events

---

## 24. Final Principle

> **Monitoring tells us when the system is unhealthy; logging tells us what happened; audit records tell us what the business changed. These three must remain distinct but connected.**
