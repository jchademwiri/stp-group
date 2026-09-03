# Public Website / API Integration

**Project:** STP Group Operations Platform  
**Consumers:** STP Website, LME Website  
**Frontend:** Astro  
**API:** Operations REST API  
**Status:** Proposed

---

## 1. Purpose

The STP and LME public websites provide the customer-facing catalogue and enquiry experience.

They consume the Operations API and must not connect directly to the Operations database.

```text
Customer
   ↓
STP Website / LME Website
   ↓ HTTPS
Operations API
   ↓
Business Logic
   ↓
Neon PostgreSQL
```

The websites are presentation and acquisition channels. They are not the system of record for inventory or operational state.

---

## 2. Responsibilities

### Public Websites

The websites are responsible for:

- Presenting equipment and services
- Presenting approved public equipment information
- Collecting customer enquiries
- Client-side form validation
- User experience
- SEO and content presentation
- Displaying API responses
- Handling API loading and error states

### Operations API

The API is responsible for:

- Authoritative catalogue data
- Customer creation or matching
- Enquiry creation
- Validation
- Availability rules
- Business rules
- Authentication for private operations
- Authorization
- Database access
- Auditability

---

## 3. Public Data Boundary

Only approved public fields may be returned to the websites.

Public catalogue data may include:

```text
id
name
slug
category
description
specifications
images
```

The public API must not expose:

```text
purchase cost
internal rental cost
owner company
management notes
internal notes
supplier information
profit margins
internal operational comments
staff information
private customer information
```

This boundary must be enforced by server-side DTOs rather than by relying on the frontend to hide fields.

---

## 4. Catalogue Integration

The websites retrieve catalogue information through:

```http
GET /api/v1/catalogue
GET /api/v1/catalogue/:slug
```

Example flow:

```text
Astro Page
   ↓
API Client
   ↓
GET /api/v1/catalogue/:slug
   ↓
Operations API
   ↓
Public Equipment DTO
   ↓
Astro Page
```

The website should not reproduce equipment data in multiple hard-coded locations when that data belongs to the operational catalogue.

Static marketing content may remain within the website repositories.

---

## 5. Public Catalogue Caching

Catalogue information changes less frequently than operational availability.

Therefore:

- Public catalogue responses may be cached.
- Cache duration should be configured centrally.
- Published/unpublished changes must invalidate or expire the relevant cache.
- Equipment availability must not use stale catalogue caching as a substitute for a live availability check.

```text
Catalogue → Cacheable
Availability → Current API/database state
```

---

## 6. Enquiry Integration

The public enquiry form submits to:

```http
POST /api/v1/enquiries
```

The request should contain only information required to create the enquiry.

Example:

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

The API returns an enquiry identifier and initial status.

The website should not attempt to create quotes, allocate assets or change operational statuses directly from the public form.

---

## 7. API Client

Both public websites should consume the API through a shared typed API client where practical.

Suggested package:

```text
packages/api-client
```

Conceptually:

```text
apps/stp ──┐
          ├──► @repo/api-client ──► Operations API
apps/lme ──┘
```

The shared client should provide:

- Typed request methods
- Typed responses
- Common error handling
- Base URL configuration
- Request timeout handling
- Optional retry policy for safe requests

Public applications should not duplicate API request implementations unnecessarily.

---

## 8. Environment Configuration

The websites should use environment variables for API configuration.

Example:

```text
PUBLIC_OPERATIONS_API_URL
```

Private API credentials or secrets must never be exposed through public frontend environment variables.

If a secret is required for server-to-server communication, the request must be made from a trusted server-side environment.

---

## 9. Request Security

Public API endpoints are internet-facing and must assume that all requests are untrusted.

The API should enforce:

- Schema validation
- Input length limits
- Allowed date ranges
- Quantity limits
- Email validation
- Rate limiting
- Abuse protection
- CORS policy where applicable
- Server-side business validation

The website's validation improves user experience but is not a security control.

---

## 10. Enquiry Abuse Protection

Public enquiry submission should be protected against automated abuse.

Potential controls include:

- Rate limiting by IP and/or request fingerprint
- Honeypot fields
- CAPTCHA or equivalent challenge when required
- Request size limits
- Duplicate submission detection
- Email/phone validation

The initial implementation should avoid excessive friction for legitimate customers.

---

## 11. Availability on Public Websites

If public users are allowed to check availability, the website should request current availability from the API.

```http
GET /api/v1/availability
```

The API must calculate availability using current allocation and maintenance state.

A public availability result does not constitute a reservation.

```text
Availability Check
      ↓
Customer Enquiry
      ↓
Internal Review
      ↓
Reservation / Allocation
```

The final reservation decision remains an internal operational action unless a future customer self-service workflow explicitly changes this model.

---

## 12. Error Handling

The websites should translate API errors into customer-appropriate messages.

Internal technical details must not be exposed to public users.

Example API error:

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

Customer-facing presentation might be:

```text
Please enter a start date before submitting your enquiry.
```

For unexpected failures:

```text
We could not submit your enquiry right now. Please try again shortly.
```

Detailed server errors should remain in server logs.

---

## 13. Request Flow

### Catalogue

```text
Browser
  ↓
Astro Website
  ↓
API Request
  ↓
Operations API
  ↓
Public DTO
  ↓
Website
```

### Enquiry

```text
Browser
  ↓
Astro Form
  ↓
Server/API Request
  ↓
Operations API
  ↓
Validation
  ↓
Customer
  ↓
Enquiry
  ↓
Database Transaction
  ↓
Response
  ↓
Website Confirmation
```

---

## 14. SSR / Server-Side Requests

Where practical, catalogue data should be fetched server-side during Astro page rendering or build/revalidation workflows.

This reduces unnecessary browser-to-API traffic and prevents exposing implementation details.

Interactive public actions, such as enquiry submission, may use a server endpoint or controlled browser request depending on the implementation.

The final implementation should favour the simplest secure architecture rather than adding unnecessary client-side state management.

---

## 15. STP and LME Differences

STP and LME may have different branding, content and customer-facing service descriptions while consuming the same operational data source.

```text
                 Operations API
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
         STP Website          LME Website
         Branding A           Branding B
         Content A            Content B
             │                   │
             └──── Shared API ───┘
```

The API should not become responsible for presentation-specific branding or page layout.

---

## 16. Static Content vs Operational Content

### Static Website Content

Keep in the website application:

- About pages
- Company information
- Marketing copy
- Service descriptions that are not operational records
- SEO metadata
- Contact page content
- Legal pages

### Operational Content

Retrieve from the Operations API:

- Equipment catalogue
- Equipment specifications managed operationally
- Published equipment status
- Customer enquiries
- Availability where exposed publicly

This prevents the websites from becoming independent inventory databases.

---

## 17. API Failure Behaviour

The websites must degrade gracefully when the Operations API is unavailable.

For catalogue pages:

- Use a suitable error/fallback state.
- Do not display stale availability as current availability.
- Where an approved cache exists, it may continue serving public catalogue content according to its configured policy.

For enquiry submission:

- Do not claim an enquiry was submitted unless the API confirms successful creation.
- Preserve entered form data where practical.
- Provide a clear retry path.

---

## 18. Observability

API integration failures should be traceable without exposing customer information unnecessarily.

Logs should capture appropriate technical information such as:

- Request route
- Response status
- Request correlation ID
- Duration
- Error category

Sensitive customer data should not be unnecessarily written to application logs.

---

## 19. Versioning

Public websites must use an explicit API version.

```text
/api/v1
```

Breaking API changes require a new version rather than silently changing the existing contract.

The shared API client should make the API version explicit in its configuration or implementation.

---

## 20. Future Integration Opportunities

The same API boundary can later support:

- Customer portal
- Online quote acceptance
- Customer account access
- Document submission
- Hire agreement workflows
- Online payments
- Delivery and collection requests
- Notifications
- Mobile applications

These capabilities should extend the existing API rather than introducing direct database integrations from individual applications.

---

## 21. Acceptance Criteria

The public integration is acceptable when:

- STP can display approved equipment from the Operations API.
- LME can display approved equipment from the Operations API.
- Public websites do not connect directly to Neon.
- Public DTOs do not expose internal operational information.
- Customers can submit enquiries through the API.
- API validation remains authoritative.
- Public catalogue caching does not affect live availability decisions.
- API failures produce appropriate customer-facing states.
- Public environment configuration does not expose secrets.
- Rate limiting and abuse controls protect public submission endpoints.
- API versioning is explicit.

---

# Final Principle

> **STP and LME are customer-facing channels; the Operations API is the shared operational source of truth.**
