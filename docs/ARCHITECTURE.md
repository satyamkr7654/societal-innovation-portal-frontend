# Architecture

## Overview

```mermaid
flowchart LR
  B["Browser: React 19 app"] -->|"/api, session cookie + CSRF header"| S["Spring Boot 4 API"]
  S -->|"JPA / Hibernate"| D[("MySQL 8")]
  S --> P["Photo folder"]
  F["Flyway migrations"] --> D
  B -->|"map tiles"| O["OpenStreetMap"]
```

The browser always talks to one origin. In development Vite forwards `/api` to the backend. In a
deployment the backend can serve the built React files itself (`FRONTEND_DIR`).

| Layer | Where | Job |
|---|---|---|
| Pages and components | `src/pages`, `src/components` | What people see |
| Services | `src/services` | The only code that calls the API |
| Controllers | `com.sip.portal.*Controller` | Read the request, check its shape |
| Services | `com.sip.portal.*Service` | Business rules and transactions |
| Repositories | `com.sip.portal.*Repository` | Database queries |

## Workflow

```mermaid
stateDiagram-v2
  [*] --> SUBMITTED: citizen reports
  SUBMITTED --> VALIDATED: admin verifies
  SUBMITTED --> REJECTED: admin rejects, reason required
  VALIDATED --> ASSIGNED: admin chooses a university
  ASSIGNED --> IN_PROGRESS: university accepts
  ASSIGNED --> VALIDATED: university declines
  IN_PROGRESS --> SOLVED: admin confirms completion
  SOLVED --> [*]: citizen rates the solution
```

Inside IN_PROGRESS: the university submits a proposal, an admin approves it or asks for changes,
industry offers support, the university completes four ordered milestones and then requests
completion. Solved needs an approved proposal **and** all four milestones.

## Database

```mermaid
erDiagram
  ORGANIZATIONS ||--o{ USERS : "employs"
  USERS ||--o{ PROBLEMS : "reports"
  PROBLEMS ||--o{ STATUS_HISTORY : "records"
  PROBLEMS ||--o| ASSIGNMENTS : "has"
  ORGANIZATIONS ||--o{ ASSIGNMENTS : "works on"
  ASSIGNMENTS ||--o{ MILESTONES : "has 4"
  ASSIGNMENTS ||--o| PROPOSALS : "has"
  PROPOSALS ||--|{ PROPOSAL_ITEMS : "budget"
  PROBLEMS ||--o{ PLEDGES : "receives"
  ORGANIZATIONS ||--o{ PLEDGES : "offers"
  PROBLEMS ||--o| FEEDBACK : "rated by citizen"
  USERS ||--o{ NOTIFICATIONS : "receives"
  PROBLEMS |o--o{ NOTIFICATIONS : "about"
```

## One request, step by step

```mermaid
sequenceDiagram
  participant A as Admin's browser
  participant F as Security filters
  participant S as ReviewService
  participant D as MySQL
  A->>F: POST /api/admin/problems/{id}/validate
  F->>F: CSRF token matches?
  F->>D: load user from the session token
  F->>F: account active, session current, role ADMIN?
  F->>S: validate(id)
  S->>D: lock the problem row
  S->>S: is it still SUBMITTED?
  S->>D: save status, history and notification together
  S-->>A: updated problem
```

## Who can see what

| Data | Visitor | Any signed-in user | Author and admins |
|---|---|---|---|
| Verified report: title, category, status, rough location | yes | yes | yes |
| Verified report: description, photo, exact place, reporter's name | no | yes | yes |
| Unverified or rejected report | no | no | yes |

Phone numbers and emails of citizens are never included in problem data. Admins see the email of an organisation
waiting for approval.
