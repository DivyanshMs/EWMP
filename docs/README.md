# Enterprise Workforce Management Platform (EWMP)

An enterprise-grade, full-stack Human Resources and Workforce Management platform engineered with Node.js, Express, MongoDB, and an integrated 16-phase Artificial Intelligence architecture powered by Google Gemini. EWMP provides organizations with multi-tenant isolation, role-based access control, atomic financial payroll processing, automated workflow orchestration, and deep analytical insights across the entire employee lifecycle.

## Project Goals

- **Enterprise Governance & Security**: Provide strict multi-tenant organization isolation, granular role-based access control (RBAC), centralized NoSQL injection mitigation, and immutable compliance audit trails.
- **Atomic Data Integrity**: Guarantee ACID compliance across multi-document financial state transitions (such as payroll calculation, payslip generation, and disbursement) using MongoDB replica set transactions.
- **Autonomous & Safe AI Integration**: Deliver intelligent recommendations, conversational data querying, and multi-step workflow planning through a standardized AI plugin framework without risking prompt leakage, PII exposure, or unauthorized action execution.
- **Developer & Operational Ergonomics**: Implement strict layered separation of concerns, Zod schema request validation, standardized API response envelopes, and comprehensive API documentation via Bruno collections.

## Key Features

- **Multi-Tenant Organization Management**: Isolated department and designation hierarchies, dynamic work shifts, holiday calendars, and customizable organization settings.
- **Full Lifecycle Employee Administration**: Centralized employee profiles, compensation structure mapping, document repositories with MIME validation, and lifecycle status tracking.
- **Time, Attendance & Leave Management**: Biometric and manual attendance punching, overtime calculation, attendance regularization workflows, and multi-tier leave approval pipelines.
- **Atomic Payroll Processing**: Automated monthly salary calculation, tax and deduction computation, payslip document generation, and finance payment marking scoped within atomic database transactions.
- **Talent & Operational Management**: Integrated performance appraisals, recruitment pipelines, project and task assignment tracking, asset allocation management, and helpdesk ticketing.
- **Integrated Enterprise AI Subsystem**: Context-aware natural language querying, proactive workforce recommendations, predictive turnover insights, and multi-step workflow orchestration protected by a dedicated AI Security Layer.

---

## Technology Stack

### Core Backend Stack
- **Runtime Environment**: Node.js (v18+)
- **Web Framework**: Express.js (v5.0.0)
- **Database & ODM**: MongoDB Atlas with Mongoose ODM (v9.7.3)
- **Authentication**: JSON Web Tokens (jsonwebtoken v9.0.3) with HTTP-only refresh cookies and bcryptjs (v3.0.3) password hashing
- **Cloud Storage**: Cloudinary SDK (v2.10.0) with Multer (v2.2.0) file upload handling
- **Artificial Intelligence**: Google GenAI SDK (`@google/genai` v2.10.0 / `@google/generative-ai` v0.24.1) using Gemini 2.0 Flash
- **API Testing & Documentation**: Bruno REST API Collections

### Enterprise Libraries & Utilities
- **Request Validation**: Zod (v4.4.3)
- **Security & Hardening**: Helmet (v8.2.0), CORS (v2.8.6), Express Rate Limit (v8.5.2), Express Mongo Sanitize (v2.2.0), Cookie Parser (v1.4.7)
- **Logging & Monitoring**: Winston (v3.19.0) structured JSON logger and Morgan (v1.11.0) HTTP request logging
- **Performance & Networking**: Compression (v1.8.1) response compression
- **Messaging & Notifications**: Nodemailer (v9.0.3) SMTP client and UUID (v14.0.1) unique identifier generation

---

## Architecture

EWMP follows a strict **Layered Architecture** designed for high maintainability, testability, and clear separation of concerns. Business logic is strictly decoupled from HTTP transport layers.

```
+-----------------------------------------------------------------------+
|                        HTTP / REST Client                             |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                          Express Routes                               |
|   (Authentication -> RBAC Authorization -> Zod Request Validation)    |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                        Controller Layer                               |
|       (HTTP Request Parsing, Response Formatting, Status Codes)       |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                         Service Layer                                 |
|     (Core Business Logic, Atomic Transactions, AI Module Plugins)     |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                     Data Access Layer (Mongoose)                      |
|       (Schemas, Indexes, Soft Deletes, Tenant Query Scoping)          |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    MongoDB / Cloudinary / Gemini AI                   |
+-----------------------------------------------------------------------+
```

### Layer Responsibilities

- **Routes (`server/routes/`)**: Register HTTP methods and URL paths. Mount global and route-specific middleware sequentially: JSON Web Token verification, Role-Based Access Control checks, and Zod schema request validators.
- **Controllers (`server/controllers/`)**: Handle HTTP request and response mechanics. Extract query parameters, URL parameters, and validated payloads. Invoke domain services and format output using standardized response envelopes (`sendSuccess`, `sendPaginatedSuccess`).
- **Services (`server/services/`)**: Enforce core domain rules, execute multi-document transactions, calculate complex payroll metrics, and trigger audit logging. Services remain entirely ignorant of HTTP objects (`req`/`res`).
- **Validators (`server/validators/`)**: Define strict Zod schemas for request body, query parameter, and URL parameter structures. Prevent malformed data from entering the controller layer.
- **Middleware (`server/middleware/`)**: Intercept cross-cutting concerns including JWT authentication, RBAC authorization, Zod schema validation, NoSQL operator sanitization, file upload processing, and global error formatting.
- **Models (`server/models/`)**: Define MongoDB document structures using Mongoose schemas. Enforce data types, enum restrictions, index definitions, and soft-delete capabilities (`isDeleted`).

---

## Project Structure

```
ewmp/
├── client/                     React frontend application
├── docs/                       Enterprise engineering specifications and architectural blueprints
├── bruno/                      Bruno API request collections structured by domain module
├── server/                     Node.js backend application root
│   ├── ai/                     Integrated 16-phase Artificial Intelligence subsystem
│   │   ├── config/             AI constants, intent classifications, and model parameters
│   │   ├── engine/             Intent Engine, Context Builder, Prompt Builder, and Response Builder
│   │   ├── memory/             Long-term and short-term conversation memory managers
│   │   ├── optimization/       Cache manager, retry mechanism, and provider health monitors
│   │   ├── plugins/            12 standardized domain module AI plugins (Attendance, Payroll, etc.)
│   │   ├── providers/          Gemini provider integration and provider abstraction factory
│   │   ├── router/             AI Service Router directing validated prompts to intent handlers
│   │   ├── security/           Input sanitization, PII scrubbing, and prompt injection defense
│   │   ├── services/           Core AI services for recommendations, insights, and action planning
│   │   └── workflow/           Multi-step enterprise workflow orchestration engine
│   ├── config/                 Application constants, database connection, logging, and rate limiters
│   ├── controllers/            HTTP endpoint handlers for all 16 business modules
│   ├── middleware/             Authentication, RBAC, validation, sanitization, and error handling
│   ├── models/                 Mongoose schemas and database models
│   ├── routes/                 Express API route registrations
│   ├── scripts/                Database seeding and automated integration verification suites
│   ├── services/               Domain business logic and transaction orchestration
│   ├── utils/                  Error classes, response formatters, pagination, and calculation helpers
│   ├── validators/             Zod request validation schemas
│   ├── app.js                  Express application initialization and global middleware setup
│   └── server.js               HTTP server bootstrap and environment validation
```

---

## Implemented Modules

### 1. Authentication (`auth`)
- **Purpose**: Manage identity verification, session security, and credential lifecycle.
- **Major Capabilities**: Secure user login with bcrypt password hashing, JWT access token issuance, HTTP-only refresh cookie rotation, password reset workflows via SMTP email tokens, and user profile retrieval.

### 2. Organization (`organization`)
- **Purpose**: Establish multi-tenant boundaries and structural hierarchies.
- **Major Capabilities**: Create and manage organizations, departments, and designations. Configure work shifts, location branches, and annual holiday calendars. Manage global system settings with strict tenant scoping.

### 3. Employee (`employee`)
- **Purpose**: Centralize workforce demographic, professional, and financial records.
- **Major Capabilities**: Employee CRUD operations, automatic alphanumeric employee ID generation, salary structure binding, profile photo upload to Cloudinary, soft-delete archiving, and employment status transitions.

### 4. Attendance (`attendance`)
- **Purpose**: Track daily workforce hours, punctuality, and attendance anomalies.
- **Major Capabilities**: Biometric and manual attendance clock-in/clock-out, calculation of working and overtime hours, status marking (Present, Absent, Half Day, Late), and automated attendance regularization request workflows.

### 5. Leave (`leave`)
- **Purpose**: Handle employee time-off requests, leave balances, and approval chains.
- **Major Capabilities**: Leave type definition, automated annual leave balance accrual, leave application submission, multi-tier HR/Manager approval or rejection workflows, and leave history auditing.

### 6. Payroll (`payroll`)
- **Purpose**: Calculate monthly compensation, statutory deductions, and net salary disbursement.
- **Major Capabilities**: Batch salary calculation based on basic pay, attendance records, and approved leaves. Generation of draft and approved payroll records, payslip document creation, finance paid status tracking, and atomic MongoDB transaction rollback on write failure.

### 7. Performance (`performance`)
- **Purpose**: Evaluate employee productivity, goal achievement, and review cycles.
- **Major Capabilities**: Create performance review cycles, assign evaluator key performance indicators (KPIs), submit self-assessments and manager ratings, and generate performance distribution summaries.

### 8. Recruitment (`recruitment`)
- **Purpose**: Streamline talent acquisition, job postings, and applicant tracking.
- **Major Capabilities**: Job requisition creation, candidate profile management, application stage tracking (Screening, Interview, Offered, Hired, Rejected), and interview scheduling.

### 9. Projects (`projects`)
- **Purpose**: Track enterprise initiatives, client deliverables, and project timelines.
- **Major Capabilities**: Project creation, client allocation, budget and deadline tracking, status updates, and assigning project managers and team members.

### 10. Tasks (`tasks`)
- **Purpose**: Manage day-to-day operational assignments and deliverable tracking.
- **Major Capabilities**: Task creation under parent projects, priority setting (Low, Medium, High, Urgent), Kanban status progression (To Do, In Progress, Review, Completed), and deadline monitoring.

### 11. Assets (`assets`)
- **Purpose**: Inventory and track corporate physical and digital equipment.
- **Major Capabilities**: Asset catalog management, inventory categorization, allocation and return tracking to specific employees, condition logging, and serial number indexing.

### 12. Documents (`documents`)
- **Purpose**: Securely store and organize corporate and employee-specific documentation.
- **Major Capabilities**: Document metadata indexing, file upload to Cloudinary with MIME type restriction, document type categorization (Resume, Contract, ID Proof, Policy), and verification status marking.

### 13. Notifications (`notifications`)
- **Purpose**: Deliver system alerts, workflow updates, and administrative notices.
- **Major Capabilities**: User-specific notification dispatch, read/unread status toggling, bulk mark-as-read operations, and automated alerts for leave approvals and payroll generation.

### 14. Help Desk (`helpdesk`)
- **Purpose**: Resolve internal employee technical, HR, and facility support inquiries.
- **Major Capabilities**: Ticket creation with priority severity levels, department categorization, ticket assignment to support agents, resolution tracking, and internal comment threads.

### 15. Reports (`reports`)
- **Purpose**: Provide analytical summaries and operational metrics across all modules.
- **Major Capabilities**: Generation of headcount summaries, department attendance averages, monthly payroll expenditure breakdowns, leave utilization metrics, and recruitment conversion statistics.

### 16. AI Assistant (`ai`)
- **Purpose**: Deliver conversational data access, proactive recommendations, and workflow planning.
- **Major Capabilities**: Natural language querying across all 12 core business modules, automated insight discovery, predictive employee turnover analysis, and structured action plan generation without direct autonomous write execution.

---

## AI Architecture Summary

The EWMP AI subsystem is built as a self-contained 16-phase architecture located under `server/ai/`, designed to integrate generative AI safely into enterprise workflows:

- **Intent Engine (`ai/engine/`)**: Classifies incoming user prompts into structured domain intents (e.g., `PAYROLL_QUERY`, `LEAVE_ACTION`, `RECOMMENDATION`) using regular expression heuristics and NLP semantic mapping.
- **Context Builder (`ai/engine/`)**: Aggregates tenant-scoped database records, user profile permissions, and relevant historical data to construct a rich ground-truth context window.
- **Prompt Builder (`ai/engine/`)**: Combines system instructions, formatting constraints, domain context, and user queries into secure, structured prompt payloads.
- **Provider Factory (`ai/providers/`)**: Abstracts LLM vendor integration, managing connection pooling and authentication for Google Gemini 2.0 Flash (`gemini-2.0-flash`).
- **Conversation Memory (`ai/memory/`)**: Maintains short-term session context and long-term historical interactions in MongoDB, enabling coherent multi-turn dialogue.
- **Recommendation Engine (`ai/services/`)**: Analyzes workforce patterns to generate proactive suggestions (e.g., reallocating tasks from overburdened employees or suggesting attendance regularizations).
- **Insight Engine (`ai/services/`)**: Identifies organizational anomalies, such as rising department absenteeism or payroll expenditure spikes, delivering structured analytical summaries.
- **Response Builder (`ai/engine/`)**: Parses LLM outputs into standardized JSON envelopes containing textual explanations, structured data tables, and actionable metadata.
- **Plugin Framework (`ai/plugins/`)**: Exposes standardized AI interfaces (`getQueryData`, `getRecommendations`, `getInsights`, `getActions`) across 12 core business modules, isolating module logic from the AI core.
- **Workflow Engine (`ai/workflow/`)**: Plans multi-step enterprise sequences (e.g., onboarding workflows requiring employee creation, asset allocation, and document verification) producing dependency-ordered execution plans.
- **Security Layer (`ai/security/`)**: Validates input prompts against injection attacks, redacts Personally Identifiable Information (PII) before transmission to external LLM providers, and sanitizes model output.
- **Optimization Layer (`ai/optimization/`)**: Manages in-memory caching for prompt templates and responses, implements exponential backoff retry algorithms, and monitors provider latency and token usage.

---

## Security Features

- **JSON Web Token (JWT) Security**: Enforces short-lived access tokens (15-minute default) paired with long-lived refresh tokens stored exclusively in HTTP-only, secure cookies. Startup validation prevents server initialization in production if fallback default secrets are detected.
- **Role-Based Access Control (RBAC)**: Enforces granular role restrictions (`SUPER_ADMIN`, `ORG_ADMIN`, `HR_MANAGER`, `FINANCE`, `MANAGER`, `TEAM_LEAD`, `EMPLOYEE`, `IT_ADMIN`, `AUDITOR`) across every route endpoint via `checkRole` middleware.
- **Organization Tenant Isolation**: Intercepts every database query to ensure mandatory matching against `req.user.organizationId`, preventing cross-organization data leakage.
- **Global NoSQL Injection Protection**: Centralized middleware (`express-mongo-sanitize`) strips all MongoDB operator expressions (`$ne`, `$gt`, `$regex`, etc.) from request bodies, query strings, and URL parameters before routing.
- **Strict Request Validation**: Validates all incoming payloads against exhaustive Zod schemas, returning detailed 400 Bad Request field-level error mappings on schema violation.
- **Atomic Database Transactions**: Wraps multi-document write operations in Mongoose session transactions on replica set topologies, ensuring automatic rollback on failure and preventing orphaned records.
- **Compliance Audit Logging**: Automatically records immutable audit trail records in the `AuditLog` collection for all critical domain events (e.g., payroll approval, salary disbursement, employee archiving).
- **AI Security & Scrubbing**: Intercepts all AI prompts to detect jailbreak attempts, strip sensitive financial/biometric fields before API transmission, and enforce strictly structured JSON output schemas.

---

## Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm v9.0.0 or higher
- **MongoDB**: MongoDB Atlas cluster or local MongoDB instance (Replica Set required for transaction support)
- **Cloudinary**: Account for cloud document and image storage
- **Google AI Studio**: API key for Gemini LLM integration

### 1. Clone the Repository
```bash
git clone https://github.com/divya6394mishra12/EWMP.git
cd ewmp/server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the template configuration file and populate your specific database, authentication, and service credentials:
```bash
cp .env.example .env
```

### 4. Run in Development Mode
Starts the server with Nodemon for automated live-reloading on file changes:
```bash
npm run dev
```
The backend API server will initialize on `http://localhost:5000`.

### 5. Run in Production Mode
Starts the server in production mode with full startup security and environment validation:
```bash
export NODE_ENV=production
npm start
```

---

## Environment Variables

| Variable Name | Description |
| :--- | :--- |
| `NODE_ENV` | Execution environment profile (`development`, `production`, `test`). |
| `PORT` | TCP port on which the Express HTTP server listens (default: `5000`). |
| `CLIENT_URL` | Allowed CORS origin URL for the frontend application (default: `http://localhost:5173`). |
| `MONGODB_URI` | MongoDB connection string URI including authentication credentials and database name. |
| `JWT_SECRET` | Cryptographic secret key used to sign and verify short-lived JSON Web access tokens. |
| `JWT_REFRESH_SECRET` | Cryptographic secret key used to sign and verify long-lived refresh tokens stored in HTTP-only cookies. |
| `JWT_ACCESS_EXPIRY` | Expiration time duration for access tokens (e.g., `15m`, `1h`). |
| `JWT_REFRESH_EXPIRY` | Expiration time duration for refresh tokens (e.g., `7d`, `30d`). |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud identifier for file storage integration. |
| `CLOUDINARY_API_KEY` | Cloudinary REST API public authentication key. |
| `CLOUDINARY_API_SECRET` | Cloudinary REST API secret authentication key. |
| `GEMINI_API_KEY` | Google GenAI API key for accessing Gemini LLM models. |
| `EMAIL_HOST` | SMTP server hostname for outbound transactional email dispatch. |
| `EMAIL_PORT` | SMTP server port number (typically `587` for TLS or `465` for SSL). |
| `EMAIL_USER` | Username credential for SMTP server authentication. |
| `EMAIL_PASS` | Password or application-specific token for SMTP server authentication. |
| `EMAIL_FROM` | Default sender email address formatted in outbound notifications. |

---

## Available Scripts

All scripts are executed from within the `server/` directory using `npm run <script>`:

| Script Name | Command | Purpose |
| :--- | :--- | :--- |
| `start` | `node server.js` | Starts the backend HTTP server in standard execution mode. |
| `dev` | `nodemon server.js` | Starts the backend HTTP server with Nodemon for development auto-reloading. |
| `lint` | `eslint .` | Runs ESLint across all backend JavaScript files to check code style and syntax rules. |
| `lint:fix` | `eslint . --fix` | Runs ESLint and automatically attempts to fix fixable formatting and linting errors. |
| `format` | `prettier --write .` | Formats all codebase files according to rules specified in `.prettierrc`. |
| `seed` | `node scripts/seedDemo.js` | Clears test collections and populates the database with realistic demo enterprise data. |
| `seed:demo` | `node scripts/seedDemo.js` | Alias for `npm run seed`. |
| `seed:auth` | `node scripts/seedAuth.js` | Seeds initial Super Admin and HR Manager authentication credentials. |
| `verify:employee` | `node scripts/verifyEmployeeModule.js` | Executes the automated integration verification suite for the Employee management module. |

---

## API Overview

The EWMP backend exposes a RESTful API structured around standard HTTP verbs (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`). All endpoints are prefixed with `/api` and return a standardized JSON response envelope.

### Standard Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Paginated Response Format
```json
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

### Standard Error Format
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "fields": {
      "payPeriodMonth": "Number must be less than or equal to 12"
    }
  }
}
```

---

## Testing

### Bruno API Collections
The project includes a complete suite of API request definitions located in the `bruno/` directory at the repository root. Bruno collections are organized by domain module (`Authentication`, `Employee`, `Payroll`, `AI`, etc.) and come pre-configured with environment variable mappings for local development testing.

### Verification Scripts
Automated integration test suites are located in `server/scripts/` to verify domain logic, database transactions, and security rules against a running MongoDB instance:
- `verifyEmployeeModule.js`: Tests employee creation, pagination, profile updates, and soft-deletion archiving.
- `verifyOrganizationModule.js`: Tests department creation, holiday scheduling, and tenant isolation rules.
- `verifyLeaveModule.js`: Tests leave accrual calculations, application submission, and multi-tier approval chains.
- `verifyPayrollModule.js`: Verifies atomic MongoDB transactions during salary calculation, payslip creation, concurrent batch processing, and rollback on simulated write failure.
- `verifyNoSqlInjection.js`: Validates that global Express sanitization middleware intercepts and neutralizes MongoDB operator injection payloads.
- `verifyAiServiceRoutes.js`: Verifies that AI service route endpoints resolve cleanly to active AI service handlers without broken legacy proxy references.

---

## Documentation

Comprehensive architectural blueprints and engineering manuals are maintained within the `docs/` repository directory:

- `SYSTEM_ARCHITECTURE.md`: High-level system topology, layered architecture definitions, and data flow diagrams.
- `AI_ARCHITECTURE.md`: Deep dive into the 16-phase AI subsystem, plugin specifications, and prompt engineering rules.
- `DATABASE_DESIGN.md`: Detailed MongoDB collection schemas, index definitions, and entity-relationship models.
- `API_DOCUMENTATION.md`: Exhaustive REST API endpoint reference including headers, request bodies, and status codes.
- `SECURITY.md`: Security threat models, RBAC matrix, JWT lifecycle rules, and mitigation strategies.
- `DEPLOYMENT_GUIDE.md`: Step-by-step instructions for deploying EWMP to AWS, Docker containers, and Kubernetes clusters.
- `TESTING_GUIDE.md`: Guide to executing automated verification scripts, Bruno collections, and performance benchmarks.
- `USER_MANUAL.md`: Functional guide for employees, managers, and HR administrators using the platform.
- `ADMIN_MANUAL.md`: Operational manual for system administrators managing tenant configurations and RBAC roles.

---

## Contributors

- **Divyansh Mishra** — Layered Architecture Design, Security Hardening, RBAC Implementation, and AI Subsystem Engineering.
- **Bhavishya Kinger** — Core Domain Modules, Mongoose Database Design, Transaction Orchestration, and REST API Implementation.
- **Somya** — Gemini LLM Provider Integration, Intent Engine, Plugin Framework, and Workflow Orchestration Engine.

---

## License

This project is licensed under the MIT License.
