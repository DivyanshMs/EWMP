# System Architecture

## Overview
The Enterprise Workforce Management Platform (EWMP) is an enterprise-grade, multi-tenant Human Resources and Workforce Management software system built upon a strict layered backend architecture. Engineered to support complex organizational hierarchies and high-volume operations, EWMP provides end-to-end employee lifecycle management, time and attendance tracking, atomic payroll calculation, and an integrated 16-phase Artificial Intelligence subsystem.

## Architecture Philosophy
The system design is anchored in strict structural decoupling, defensive security programming, and zero-trust multi-tenancy. Every component is developed to ensure boundary isolation between HTTP transport mechanics, domain business rules, and persistent data storage. By rejecting ad-hoc code placement and enforcing standardized request/response envelopes, EWMP guarantees long-term maintainability, predictable horizontal scaling, and audit-ready data integrity.

## Design Goals
- **Strict Separation of Concerns**: Isolate routing, validation, controller mechanics, domain business services, and database schemas into autonomous layers.
- **Zero-Trust Organization Isolation**: Enforce mandatory tenant scoping across all database reads and writes to eliminate cross-tenant data leakage.
- **ACID Financial Integrity**: Ensure atomic execution of multi-document state transitions (such as payroll calculation and payslip generation) using MongoDB replica set transactions.
- **Defensive Security by Default**: Implement centralized NoSQL injection mitigation, Zod schema request validation, role-based access control (RBAC), and immutable compliance audit logging across all operational modules.
- **Modular AI Subsystem**: Integrate generative AI capabilities through a standardized plugin interface and provider abstraction layer without exposing raw database credentials, prompt templates, or Personally Identifiable Information (PII).

---

## System Overview

### Frontend
The client presentation layer is implemented as a Single Page Application (SPA) using React 18 and Vite, utilizing TanStack Query for remote state management and caching, and Tailwind CSS for responsive UI design. It communicates with the backend exclusively over RESTful JSON APIs over HTTPS.

### Backend
The application server is engineered in Node.js (v18+) using the Express.js (v5.0.0) web framework. It handles identity verification, request validation, business logic execution, data orchestration, and automated workflow planning.

### MongoDB
Data persistence is provided by MongoDB Atlas, managed through the Mongoose Object Data Modeling (ODM) library (v9.7.3). MongoDB stores enterprise entities, tenant configuration settings, employee timelines, financial payroll records, AI conversation memory, and immutable compliance audit logs.

### Cloudinary
External cloud storage is handled via the Cloudinary SDK (v2.10.0), which stores employee profile images and uploaded organizational documents (resumes, contracts, identity proofs) after local Multer MIME-type and size validation.

### Gemini AI
Generative AI intelligence is powered by Google Gemini 2.0 Flash (`gemini-2.0-flash`) via the `@google/genai` and `@google/generative-ai` SDKs. It provides conversational natural language querying, proactive workforce recommendations, analytical anomaly detection, and workflow sequence generation.

### Email
Transactional outbound notifications—such as onboarding invitations, password reset tokens, leave decision alerts, and payslip notifications—are dispatched via Nodemailer (v9.0.3) connecting to SMTP mail servers.

### Bruno
Comprehensive API testing and documentation are maintained using Bruno REST API collections located in the repository root (`bruno/`), providing structured environment mappings and executable request definitions for all 100+ endpoints.

### Verification Scripts
Automated integration test suites reside in `server/scripts/`, executing standalone Node.js processes against live MongoDB databases to verify atomic transactions, RBAC boundaries, NoSQL injection defenses, and AI routing integrity.

---

## High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                           Client Layer (React SPA / Bruno API)                    |
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTPS / REST JSON
                                         v
+-----------------------------------------------------------------------------------+
|                             Express Web Server (app.js)                           |
|  +-----------------------------------------------------------------------------+  |
|  | Helmet Security -> CORS -> Rate Limiter -> Cookie Parser -> Body Parser     |  |
|  +-----------------------------------------------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  | Request Pipeline: Zod Validation -> NoSQL Sanitization -> JWT & RBAC Auth   |  |
|  +-----------------------------------------------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  | Controller Layer (HTTP Request Extraction & Response Formatting)            |  |
|  +-----------------------------------------------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  | Service Layer (Business Domain Rules, Atomic Transactions, AI Plugins)      |  |
|  +-----------------------------------------------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  | Data Access Layer (Mongoose ODM / Tenant Query Scoping / Soft Deletes)      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
           |                             |                             |
           v                             v                             v
+---------------------+       +---------------------+       +---------------------+
|    MongoDB Atlas    |       |   Cloudinary Cloud  |       |  Google Gemini AI   |
| (Collections/Logs)  |       | (Documents/Images)  |       |   (2.0 Flash LLM)   |
+---------------------+       +---------------------+       +---------------------+
```

---

## Backend Layered Architecture

EWMP strictly enforces a layered architectural pattern. Each layer is encapsulated with distinct operational boundaries and strict dependency rules.

### 1. Routes (`server/routes/`)
- **Responsibilities**: Map HTTP verbs (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`) and URL paths to specific controller handler methods. Assemble and execute route-specific middleware chains sequentially (e.g., JWT authentication, role verification, and Zod request validation).
- **MUST NOT Do**: Execute business logic, perform database queries, interact with Mongoose models, or construct raw HTTP response payloads.

### 2. Controllers (`server/controllers/`)
- **Responsibilities**: Extract HTTP headers, query parameters, URL parameters, and validated body payloads from Express `req` objects. Pass clean variables to appropriate domain service methods. Capture service return values or caught exceptions, set appropriate HTTP status codes (200, 201, 204), and format responses using standard utility wrappers (`sendSuccess`, `sendPaginatedSuccess`).
- **MUST NOT Do**: Contain domain business rules, perform direct database operations, execute complex financial calculations, or manage transaction lifecycles.

### 3. Services (`server/services/`)
- **Responsibilities**: Implement enterprise business rules, orchestrate multi-model data workflows, calculate salary and overtime metrics, trigger compliance audit logs, and manage Mongoose atomic transaction sessions (`startTransactionIfPossible`, `commitOrAbort`). Integrate with AI module plugins to expose domain data to the intelligence engine.
- **MUST NOT Do**: Reference Express HTTP objects (`req`, `res`, `next`), manipulate HTTP status codes directly, or handle HTTP response formatting.

### 4. Middleware (`server/middleware/`)
- **Responsibilities**: Intercept incoming HTTP requests to perform cross-cutting security and formatting tasks. Verify JSON Web Tokens (`authMiddleware.js`), validate user roles against endpoint access control matrices (`rbacMiddleware.js`), execute Zod schema parsing (`validationMiddleware.js`), strip NoSQL injection operator payloads (`mongoSanitizeMiddleware.js`), process multipart file uploads (`uploadMiddleware.js`), and catch application exceptions for standardized formatting (`errorMiddleware.js`).
- **MUST NOT Do**: Execute module-specific business logic or bypass error-handling chains.

### 5. Validators (`server/validators/`)
- **Responsibilities**: Define strict Zod validation schemas for request bodies, query parameters, and URL path parameters across all domain modules. Ensure data types, string formatting, numeric bounds, and enum structures conform to specifications prior to controller execution.
- **MUST NOT Do**: Access the database directly or execute asynchronous validation calls against external services.

### 6. Models (`server/models/`)
- **Responsibilities**: Define MongoDB document structures using Mongoose schemas. Enforce field data types, required attributes, unique indexes, compound indexes, and default values. Implement schema lifecycle hooks (pre/post save) and standardize soft-delete capabilities via `isDeleted` and `deletedAt` fields.
- **MUST NOT Do**: Handle HTTP request validation, formatting, or external API communication.

### 7. Utilities (`server/utils/`)
- **Responsibilities**: Provide stateless helper functions shared across layers. Include structured error classes (`AppError.js`), standard response envelopes (`formatResponse.js`), pagination calculation logic (`pagination.js`), file upload helpers (`fileUploadUtil.js`), and email dispatch wrappers (`sendEmail.js`).
- **MUST NOT Do**: Maintain application state or introduce circular dependencies with service or controller modules.

### 8. Configuration (`server/config/`)
- **Responsibilities**: Centralize environment variable loading and startup validation (`config.js`), establish Mongoose database connection parameters (`db.js`), configure Winston structured logging transports (`logger.js`), define rate-limiting windows (`rateLimiter.js`), and export application-wide constant enumerations (`constants.js`).
- **MUST NOT Do**: Hardcode secret credentials or execute domain business logic.

### 9. Scripts (`server/scripts/`)
- **Responsibilities**: Execute standalone administrative tasks outside the HTTP server lifecycle. Populate databases with demonstration data (`seedDemo.js`), seed initial administrative accounts (`seedAuth.js`), and run end-to-end integration verification suites (`verifyEmployeeModule.js`, `verifyPayrollModule.js`, etc.).
- **MUST NOT Do**: Be imported or executed within the active Express runtime application.

---

## Directory Structure

```
ewmp/
├── client/                      React 18 Single Page Application
├── docs/                        Enterprise specifications and blueprints
├── bruno/                       REST API test request collections
└── server/                      Node.js backend application root
    ├── ai/                      16-Phase Artificial Intelligence Subsystem
    │   ├── config/              AI constants, intent schemas, and prompt rules
    │   ├── engine/              Intent Engine, Context Builder, Prompt Builder, Response Builder
    │   ├── memory/              Short-term session and long-term conversation storage
    │   ├── optimization/        In-memory cache manager, retry mechanics, health monitors
    │   ├── plugins/             12 standardized domain module AI plugins
    │   ├── providers/           Google Gemini LLM provider abstraction factory
    │   ├── router/              AI Service Router directing validated prompts to intent handlers
    │   ├── security/            Input sanitization, PII redaction, prompt injection defense
    │   ├── services/            Recommendations, insights, and action plan generation
    │   └── workflow/            Multi-step enterprise workflow orchestration engine
    ├── config/                  Application configurations, logger, constants, db connection
    ├── controllers/             16 domain module HTTP request/response handlers
    ├── middleware/              Auth, RBAC, validation, sanitization, upload, error handlers
    ├── models/                  Mongoose schemas, relationships, indexes, soft-delete rules
    ├── routes/                  Express API route definitions and middleware assembly
    ├── scripts/                 Database seeders and automated verification test suites
    ├── services/                Domain business logic, transaction boundaries, audit triggers
    ├── utils/                   AppError, response formatters, pagination, email senders
    ├── validators/              Zod request validation schemas for all routes
    ├── app.js                   Express application setup and global middleware mounting
    └── server.js                Server initialization, database bootstrap, env validation
```

---

## Request Lifecycle

Every HTTP request traversing the EWMP backend undergoes a strict sequence of validation and security gates before executing domain logic.

```
Client
  |
  | 1. HTTP Request (JSON payload / Authorization Bearer Token)
  v
Express Web Server (app.js)
  |
  | 2. Global Security Middleware (Helmet, CORS, Rate Limiter, Cookie Parser, JSON Body Parser)
  v
Route Middleware Chain (routes/*.js)
  |
  | 3. Authentication (authMiddleware.js -> verifyToken)
  |    - Extracts JWT from Authorization header
  |    - Verifies token signature and expiration
  |    - Attaches decoded user object to req.user
  v
  | 4. Authorization (rbacMiddleware.js -> checkRole)
  |    - Verifies req.user.role against allowed endpoint roles
  v
  | 5. Request Validation (validationMiddleware.js -> validateRequest)
  |    - Validates req.body, req.query, req.params against Zod schema
  |    - Rejects invalid structures with 400 Bad Request field mappings
  v
  | 6. NoSQL Sanitization (mongoSanitizeMiddleware.js)
  |    - Strips MongoDB operator expressions ($ne, $gt, $regex) from request data
  v
Controller Layer (controllers/*.js)
  |
  | 7. Request Parsing & Parameter Extraction
  |    - Extracts clean variables and req.user.organizationId
  |    - Invokes domain service method
  v
Service Layer (services/*.js)
  |
  | 8. Business Rule Execution & Transaction Orchestration
  |    - Applies tenant scoping to Mongoose queries
  |    - Executes atomic transactions (startTransactionIfPossible / commitOrAbort)
  |    - Writes immutable compliance entries to AuditLog
  v
Database Layer (models/*.js -> MongoDB Atlas)
  |
  | 9. Database Operations & Document Persistence
  v
Controller Layer
  |
  | 10. Output Formatting (utils/formatResponse.js -> sendSuccess / sendPaginatedSuccess)
  v
Client (Standard JSON Response Envelope)
```

---

## Authentication Flow

Authentication utilizes a dual-token security architecture combining short-lived access tokens with long-lived, HTTP-only refresh cookies.

```
Client                                     Express API                                  MongoDB
  |                                             |                                          |
  | 1. POST /api/auth/login (email, password)  |                                          |
  |-------------------------------------------->|                                          |
  |                                             | 2. Query User by Email                   |
  |                                             |----------------------------------------->|
  |                                             | 3. Return User Document & Password Hash  |
  |                                             |<-----------------------------------------|
  |                                             |                                          |
  |                                             | 4. Verify Password (bcrypt.compare)       |
  |                                             | 5. Generate Access Token (JWT, 15m)      |
  |                                             | 6. Generate Refresh Token (JWT, 7d)      |
  |                                             | 7. Store Refresh Token Hash in DB        |
  |                                             |----------------------------------------->|
  |                                             |                                          |
  | 8. 200 OK (AccessToken in JSON,             |                                          |
  |    RefreshToken in HTTP-Only Secure Cookie) |                                          |
  |<--------------------------------------------|                                          |
  |                                             |                                          |
  | 9. GET /api/employee/my                     |                                          |
  |    (Header: Authorization Bearer <Token>)   |                                          |
  |-------------------------------------------->|                                          |
  |                                             | 10. Verify JWT Signature & Expiration    |
  |                                             | 11. Attach req.user (id, role, orgId)    |
  |                                             | 12. Execute Protected Service Query      |
  |                                             |----------------------------------------->|
  |                                             | 13. Return Tenant-Scoped Records         |
  |                                             |<-----------------------------------------|
  | 14. 200 OK (Standard JSON Response)         |                                          |
  |<--------------------------------------------|                                          |
```

---

## Authorization Architecture

Authorization is enforced through a two-tiered security model: **Role-Based Access Control (RBAC)** for functional capabilities, and **Organization Tenant Isolation** for data access boundaries.

### Role-Based Access Control (RBAC)
The system defines nine distinct enterprise roles in `server/config/constants.js`:
- `SUPER_ADMIN`: Global platform administrator with unrestricted multi-tenant access.
- `ORG_ADMIN`: Tenant administrator with full administrative capabilities within their organization.
- `HR_MANAGER`: Functional administrator managing employee records, attendance, leave, and recruitment within their organization.
- `FINANCE`: Financial officer with exclusive authority to calculate payroll, approve payslips, and mark salary disbursements.
- `MANAGER`: Departmental supervisor managing direct reports, approving leave, and reviewing performance evaluations.
- `TEAM_LEAD`: Operational team leader managing project assignments and task Kanban boards.
- `EMPLOYEE`: Standard workforce member restricted to self-service operations (viewing personal profile, punching attendance, applying for leave, viewing personal payslips).
- `IT_ADMIN`: Infrastructure officer managing physical and digital asset inventory allocations.
- `AUDITOR`: Read-only compliance auditor with broad inspection access across organizational records and audit logs.

Endpoint authorization is enforced via the `checkRole` middleware:
```javascript
router.post('/process', checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.FINANCE]), validateRequest(schema), controller.processPayroll);
```

### Organization Tenant Isolation
To prevent horizontal data privilege escalation across organizations, every domain service method strictly enforces tenant scoping. When a controller invokes a service, it passes `req.user.organizationId` as a mandatory parameter. The service embeds this parameter into all Mongoose database queries:
```javascript
const employees = await Employee.find({
  organizationId: userOrgId,
  isDeleted: false
});
```
Even if an authenticated user guesses or obtains an ObjectId belonging to another organization, queries scoped with `organizationId: userOrgId` will evaluate to null or empty sets, guaranteeing absolute multi-tenant boundary isolation.

---

## Database Architecture

EWMP utilizes MongoDB Atlas as its primary persistence engine, structured through Mongoose schemas with strict validation rules.

### Collections & Entity Relationships
The database schema consists of 18 core collections linked via ObjectId references:
- **Core Tenant & Governance**: `Organization`, `Department`, `Designation`, `SystemSetting`, `User`.
- **Workforce & Operations**: `Employee`, `Attendance`, `Leave`, `Shift`, `Holiday`, `PerformanceReview`, `Recruitment`, `Project`, `Task`, `Asset`, `Document`, `Notification`, `HelpDesk`.
- **Accounting & Compliance**: `Payroll`, `Payslip`, `AuditLog`.

Relationships are modeled via direct `mongoose.Schema.Types.ObjectId` references with mandatory `ref` declarations, enabling targeted Mongoose `.populate()` queries where appropriate while avoiding unbounded document nesting.

### Soft Deletion Architecture
To comply with enterprise data retention and compliance audit rules, core transactional entities (`Employee`, `Project`, `Task`, `Asset`, `Document`) implement a soft-delete architecture. Schmeas define two standardized properties:
```javascript
isDeleted: { type: Boolean, default: false, index: true },
deletedAt: { type: Date, default: null }
```
When an administrator archives or deletes a record, domain services execute an atomic update setting `isDeleted: true` and `deletedAt: new Date()`. Standard listing queries include `isDeleted: false` filters by default, preserving historical integrity without cluttering active operational views.

### Transaction Management
Multi-document database operations that require ACID consistency—specifically payroll calculation (`processPayrollRun`), payslip approval (`approvePayroll`), and status marking (`markPaid`)—are wrapped in Mongoose session transactions.
Service methods utilize dynamic transaction utilities from `payrollService.js` and `employeeService.js`:
```javascript
const session = await startTransactionIfPossible();
try {
  // Phase 1: Long-running calculations outside transaction scope
  // Phase 2: Atomic database write operations inside transaction scope
  await Payroll.create([payload], { session });
  await AuditLog.create([auditPayload], { session });
  await commitOrAbort(session, true);
} catch (error) {
  await commitOrAbort(session, false);
  throw error;
}
```
When executing on standalone development topologies (`Topology: Single`), transaction initiation is safely bypassed while maintaining sequential write integrity. When executing on MongoDB Replica Sets or Sharded Clusters in staging and production, any write failure automatically aborts the session, rolling back all intermediate insertions and preventing orphaned accounting records.

### Indexes & Performance
Collections utilize strategic database indexing to ensure sub-millisecond query execution across high-volume operational paths:
- **Unique Indexes**: Applied to natural domain identifiers to enforce data integrity (`user.email`, `organization.code`, `employee.employeeId`, `department.code`, `designation.code`).
- **Compound Indexes**: Engineered for frequent multi-field filtering criteria (e.g., `{ organizationId: 1, isDeleted: 1 }`, `{ employeeId: 1, payPeriodYear: 1, payPeriodMonth: 1 }`, `{ organizationId: 1, status: 1 }`).
- **Time-Series / Sorting Indexes**: Applied to chronological tracking fields (`createdAt: -1`, `attendanceDate: -1`).

### Audit Log Architecture
The `AuditLog` collection serves as an append-only, immutable compliance ledger. Domain services trigger asynchronous or transaction-scoped writes to `AuditLog` whenever significant state changes occur (e.g., `PAYROLL_GENERATED`, `PAYROLL_APPROVED`, `EMPLOYEE_CREATED`, `EMPLOYEE_ARCHIVED`). Each audit record captures the actor (`userId`), tenant (`organizationId`), target entity (`entityId`, `entityType`), action classification, and a timestamp.

---

## AI Architecture Integration

The EWMP AI subsystem is built as a modular 16-phase architecture under `server/ai/`, designed to integrate generative AI safely into enterprise workflows without compromising core business decoupling or data privacy.

```
+-----------------------------------------------------------------------------------+
|                        AI Service Router (ai/router/)                             |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                      AI Security Layer (ai/security/)                             |
|       (Prompt Injection Scrubbing -> PII Redaction -> Regex Sanitization)         |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                       Intent Engine (ai/engine/intentEngine)                      |
|           (Classifies prompt into domain intent via Regex & NLP Rules)            |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|               AI Plugin Framework (ai/plugins/ -> 12 Core Modules)                |
|      (Exposes standardized getQueryData, getRecommendations, getInsights)         |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                   Context Builder & Prompt Builder (ai/engine/)                   |
|       (Aggregates tenant-scoped DB records -> Builds secure LLM payload)          |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                  Optimization Layer (ai/optimization/)                            |
|       (In-Memory Cache Check -> Exponential Backoff Retry -> Latency Metrics)      |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                    Provider Factory (ai/providers/providerFactory)                |
|               (Connects to Google Gemini 2.0 Flash SDK / LLM API)                 |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                     Response Builder & Conversation Memory                        |
|       (Validates JSON output schema -> Saves dialogue in Mongoose Memory)         |
+-----------------------------------------------------------------------------------+
```

- **AI Provider & Factory**: `providerFactory.js` encapsulates LLM vendor SDK specifics, managing connection initialization and execution against Google Gemini 2.0 Flash (`gemini-2.0-flash`).
- **Intent Engine**: Classifies incoming natural language requests into actionable domain intents (e.g., `PAYROLL_QUERY`, `ATTENDANCE_INSIGHT`, `LEAVE_ACTION`, `WORKFLOW_PLAN`) using optimized regex pattern matching and semantic classification rules.
- **Context Builder**: Communicates with the AI Plugin Framework to fetch real-time, tenant-scoped operational data from core business modules, constructing a factual context window without exposing raw database credentials.
- **Plugin Framework**: Decouples core business modules from AI mechanics. Each module (`attendancePlugin.js`, `payrollPlugin.js`, etc.) exposes a standardized interface implementing `getQueryData`, `getRecommendations`, `getInsights`, and `getActions`.
- **Workflow Engine**: Orchestrates multi-step enterprise sequences (e.g., employee onboarding pipelines requiring department assignment, asset allocation, and document verification), producing structured dependency graphs and step-by-step execution plans without executing direct autonomous write operations.
- **Security Layer**: Protects the intelligence pipeline by evaluating incoming prompts against known prompt injection and jailbreak patterns, stripping sensitive Personally Identifiable Information (PII) before vendor API transmission, and verifying that model responses strictly adhere to requested JSON schemas.
- **Response Builder**: Transforms raw LLM generation text into standardized, client-ready JSON structures containing markdown summaries, structured data tables, and actionable workflow metadata.

---

## Security Architecture

EWMP implements comprehensive defensive security engineering across all layers:

- **JSON Web Tokens (JWT)**: Stateless access tokens signed with HMAC SHA-256 (default 15-minute expiration) authenticate HTTP requests. Long-lived refresh tokens (default 7-day expiration) are transmitted exclusively via HTTP-only, `SameSite=Strict`, secure cookies to neutralize Cross-Site Scripting (XSS) token theft.
- **Helmet Security Headers**: Mounted globally in `app.js` via `helmet()`, configuring HTTP response headers to protect against clickjacking (`X-Frame-Options: DENY`), MIME-type sniffing (`X-Content-Type-Options: nosniff`), and XSS payloads (`Content-Security-Policy`).
- **CORS Configuration**: Restricts cross-origin HTTP requests via `cors()`, permitting only verified frontend client origins (`process.env.CLIENT_URL`) and explicitly whitelisting acceptable HTTP headers and credentials.
- **API Rate Limiting**: Mounted via `express-rate-limit` to throttle aggressive traffic. General endpoints are bounded by global sliding windows, while authentication endpoints (`/api/auth/login`) enforce strict rate limits (e.g., 5 attempts per 15 minutes) to defeat brute-force credential stuffing.
- **Global NoSQL Injection Protection**: Centralized middleware (`express-mongo-sanitize`) intercepts incoming request payloads, query parameter strings, and URL path parameters, stripping all MongoDB operator expressions (`$ne`, `$gt`, `$regex`) before query evaluation.
- **Request Validation**: Zod schemas enforce strict syntax, type, and boundary checks on all endpoint inputs, immediately rejecting malformed payloads with 400 Bad Request status codes.
- **Audit Logging**: Mandatory asynchronous logging of security lifecycle events and financial data modifications ensures compliance with enterprise governance standards.
- **Transaction Safety**: Multi-document database writes in financial modules are executed within Mongoose ACID transaction boundaries, preventing data corruption during system faults.

---

## Error Handling Architecture

Error handling is unified across the backend through a centralized, exception-trapping architecture.

### AppError Class
Domain services, utilities, and middleware instantiate errors using the custom `AppError` class (`server/utils/AppError.js`):
```javascript
throw new AppError(404, 'Employee record not found', ERROR_CODES.RESOURCE_NOT_FOUND);
```
`AppError` encapsulates the HTTP status code, a human-readable message, a standardized enterprise error code string, and an optional object containing field-level validation failure mappings.

### Global Error Middleware
All Express route chains terminate at the centralized error handler (`server/middleware/errorMiddleware.js`). This middleware intercepts thrown exceptions, logs them with full stack traces via Winston, and formats a standardized JSON error response envelope:
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "fields": {
      "email": "Invalid email address format",
      "basicSalary": "Salary must be a positive number"
    }
  }
}
```
In production environments (`NODE_ENV=production`), stack traces and internal Mongoose error structures are cleanly suppressed from client HTTP responses to prevent infrastructure information leakage.

---

## Configuration Management

System configuration is managed centrally under `server/config/`, adhering to the twelve-factor app methodology.

- **Environment Loading (`config.js`)**: Utilizes `dotenv` to ingest environment variables from `.env` files. Implements a mandatory startup validation routine (`validateEnv`) that checks for the presence and validity of critical keys (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GEMINI_API_KEY`). If `NODE_ENV=production` is active and insecure default fallback secrets are detected, the validation routine throws a fatal error, preventing server bootstrap.
- **Database Connection (`db.js`)**: Asynchronously connects to MongoDB Atlas using Mongoose, configuring connection event listeners for connection loss, reconnection, and graceful shutdown upon process termination signals (`SIGINT`, `SIGTERM`).
- **Structured Logging (`logger.js`)**: Implements a Winston logging instance configured with multi-transport routing. In development, logs output to the console with colorized formatting. In production, logs output to structured JSON file transports (`logs/error.log`, `logs/combined.log`) timestamped for ingestion into external SIEM tools.
- **Application Constants (`constants.js`)**: Exports immutable system enumerations, including RBAC role definitions (`ROLES`), employment types, leave classifications, project Kanban statuses, and standardized HTTP error codes (`ERROR_CODES`).
- **External Service Clients**: Cloudinary upload SDK credentials and Nodemailer SMTP transporter configurations are instantiated via centralized utilities (`fileUploadUtil.js`, `sendEmail.js`), ensuring unified credential loading and connection pooling.

---

## Module Architecture

The EWMP backend is partitioned into 16 autonomous business modules. Each module maintains absolute boundary isolation by interacting with peer modules strictly through exported domain service methods rather than cross-controller HTTP calls or direct database cross-collection manipulation.

1. **Authentication (`auth`)**: Manages identity verification, password hashing, JWT token generation, refresh token cookie rotation, and SMTP password reset token lifecycles.
2. **Organization (`organization`)**: Manages multi-tenant boundaries, department and designation trees, location branches, work shift schedules, annual holiday calendars, and system settings.
3. **Employee (`employee`)**: Manages workforce profiles, alphanumeric ID generation (`EMP0001`), salary structure binding, Cloudinary photo uploads, soft deletion, and timeline event auditing.
4. **Attendance (`attendance`)**: Manages daily clock-in/clock-out punching, working/overtime hour calculations, attendance status evaluation, and regularization workflow requests.
5. **Leave (`leave`)**: Manages leave policy definitions, annual leave balance accrual calculations, leave application submissions, and multi-tier approval/rejection workflows.
6. **Payroll (`payroll`)**: Manages monthly salary calculations, tax and statutory deduction computing, draft/approved payroll generation, payslip document creation, and atomic financial transactions.
7. **Performance (`performance`)**: Manages review cycle scheduling, KPI evaluation criteria, employee self-assessments, manager ratings, and analytical score distributions.
8. **Recruitment (`recruitment`)**: Manages job requisition postings, applicant demographic tracking, interview scheduling, and hiring pipeline stage transitions.
9. **Projects (`projects`)**: Manages client project allocations, budget and timeline milestones, team assignments, and delivery status progression.
10. **Tasks (`tasks`)**: Manages operational task Kanban boards, task prioritization, employee deliverable assignments, and progress tracking under parent projects.
11. **Assets (`assets`)**: Manages corporate equipment inventory catalogs, asset allocation/return tracking to employees, condition logging, and serial number indexing.
12. **Documents (`documents`)**: Manages corporate and employee document storage, Cloudinary multipart file uploads, MIME type validation, and verification status tracking.
13. **Notifications (`notifications`)**: Manages user-specific system alerts, automated workflow notifications (e.g., leave decisions, payslip availability), and read status toggling.
14. **Help Desk (`helpdesk`)**: Manages internal employee support ticketing, department assignment, priority categorization, resolution tracking, and comment threads.
15. **Reports (`reports`)**: Aggregates cross-module operational metrics, generating headcount summaries, absenteeism averages, payroll expenditure reports, and recruitment conversion statistics.
16. **AI Assistant (`ai`)**: Houses the 16-phase artificial intelligence subsystem, providing conversational querying, anomaly detection, recommendations, and workflow planning across all modules.

---

## Scalability Considerations

EWMP is architected to scale seamlessly from single-instance local deployments to highly distributed cloud infrastructure clusters.

- **Layered Decoupling & Statelessness**: Because domain business logic is completely detached from Express HTTP request mechanics and session state is maintained statelessly via JWTs, the Node.js application server can be horizontally scaled across hundreds of Kubernetes containers or AWS ECS pods behind an HTTP load balancer without session stickiness requirements.
- **Provider Abstraction**: The AI subsystem utilizes an abstracted `providerFactory.js`. Adding future large language model providers (e.g., OpenAI GPT-4o, Anthropic Claude 3.5, or local Ollama instances) requires implementing a single provider adapter class without refactoring intent engines, context builders, or domain plugins.
- **Plugin Architecture**: The AI Plugin Framework allows new business modules to be integrated into the platform simply by dropping a standardized plugin file into `server/ai/plugins/`, automatically exposing the new domain to natural language querying and recommendation engines.
- **Distributed Caching & Rate Limiting Readiness**: While rate limiter counters (`rateLimiter.js`) and AI prompt/response caches (`cacheManager.js`) currently operate in Node.js instance memory for local simplicity, their data access interfaces are engineered to support drop-in replacement with Redis adapters (`ioredis`) for shared distributed state across multi-node cluster deployments.

---

## Design Principles

The backend architecture strictly adheres to established software engineering principles:

- **Single Responsibility Principle (SRP)**: Each class, module, and function has a single reason to change. Routes handle HTTP mapping, controllers format transport payloads, services execute domain logic, and models enforce schema rules.
- **Don't Repeat Yourself (DRY)**: Common operations—such as error formatting, pagination calculation, JWT verification, RBAC authorization, and NoSQL sanitization—are implemented once as centralized middleware or utility helpers and reused across all 100+ endpoints.
- **Separation of Concerns (SoC)**: HTTP transport protocols are completely isolated from domain business rules and database query mechanics.
- **Dependency Inversion & Abstraction**: High-level orchestration engines (such as the AI Service Router and Workflow Engine) depend on abstract interfaces (e.g., `providerFactory` and module AI plugins) rather than hardcoded implementation details.
- **Enterprise Modularity**: Business domains are partitioned into autonomous modules that interact through clean programmatic service interfaces, preventing monolithic codebase entanglement.

---

## Technology Decisions

- **Node.js & Express.js**: Selected for non-blocking, asynchronous I/O performance, enabling efficient handling of thousands of concurrent REST API requests, database queries, and external AI service calls within a unified JavaScript ecosystem.
- **MongoDB Atlas & Mongoose ODM**: Selected for flexible document schema modeling, seamless JSON data structure alignment, robust horizontal sharding capabilities, and native replica set multi-document ACID transaction support required for payroll accounting.
- **JSON Web Tokens (JWT) & HTTP-Only Cookies**: Selected to provide scalable, stateless authentication across horizontally scaled servers while neutralizing cross-site scripting (XSS) and cross-site request forgery (CSRF) attack vectors via secure HTTP-only refresh cookies.
- **Google Gemini 2.0 Flash**: Selected for state-of-the-art inference speed, massive context window capacity, low latency, and structured JSON generation capabilities required for real-time enterprise AI assistant dialogue and workflow planning.
- **Cloudinary SDK & Multer**: Selected to offload heavy multipart file processing, bandwidth utilization, and secure media storage from the primary application servers to a dedicated, CDN-backed cloud storage infrastructure.
- **Zod Validation**: Selected for TypeScript-aligned, declarative schema validation that provides compile-safe type checking and structured field-level error reporting, eliminating manual boilerplate validation checks in controllers.
- **Bruno API Collections**: Selected over proprietary Git-unfriendly GUI clients (such as Postman) to enable plain-text, version-controlled API request documentation that integrates cleanly into developer Git repositories and CI/CD pipelines.

---

## Known Limitations

- **In-Memory Caching and Rate Limiting**: API rate limiting counters (`express-rate-limit`) and AI optimization caching (`cacheManager.js`) currently utilize Node.js local instance memory. In horizontally scaled multi-node deployments, rate limit counters and cached LLM responses are not currently synchronized across pods.
- **Asynchronous Antivirus Scanning**: While file uploads undergo strict Multer MIME-type restrictions and file size threshold enforcement before uploading to Cloudinary, uploaded documents do not currently undergo automated asynchronous malware or virus macro scanning prior to becoming downloadable in the UI.
- **Unbounded Audit Log Accumulation**: The `AuditLog` collection records compliance events indefinitely without an automated background archiving task or MongoDB Time-To-Live (TTL) index configuration for older non-regulatory audit events.

---

## Future Improvements

The following architectural enhancements were identified during the enterprise post-remediation audit for scheduled implementation during future DevOps infrastructure hardening cycles:

1. **Distributed Redis Adapter Integration**: Implement an optional `ioredis` storage adapter for `server/config/rateLimiter.js` and `server/ai/optimization/cacheManager.js` to enable synchronized rate-limiting counters and shared AI prompt/response caching across horizontally scaled production Kubernetes clusters.
2. **Cloud Antivirus Webhook Pipeline**: Integrate an asynchronous virus scanning hook (such as a ClamAV daemon or AWS Lambda cloud storage virus scanning webhook) inside the file upload pipeline (`uploadMiddleware.js` and `fileUploadUtil.js`) to scan uploaded resumes and documents before marking them as active in database records.
3. **Automated Audit Log Pruning & Archiving**: Configure an automated monthly background archiving cron job or establish MongoDB Time-To-Live (TTL) indexes on non-regulatory `AuditLog` entries older than 3 to 7 years in alignment with corporate compliance retention schedules.
4. **Explicit Mongoose Network Failover Thresholds**: Explicitly define `serverSelectionTimeoutMS: 5000`, `socketTimeoutMS: 45000`, and `maxPoolSize: 50` within the Mongoose connection options array in `server/config/db.js` to ensure predictable failover behavior during cloud network latency spikes.
