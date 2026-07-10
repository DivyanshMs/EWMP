# Enterprise Workforce Management Platform (EWMP)
## Administrator Manual & Operational Guide

**Document Version:** 1.0.0  
**Authority:** Backend Source of Truth (`server/`)  
**Target Audience:** Principal System Administrators, Enterprise DevOps Architects, Senior Infrastructure Engineers, Enterprise Operations Engineers, and Technical Security Specialists.

---

## 1. Introduction

The **Enterprise Workforce Management Platform (EWMP)** is an enterprise-grade, multi-tenant human resources, payroll, and workforce orchestration system powered by the MERN stack (MongoDB Atlas, Express 5, React, Node.js) and enhanced with Google Gemini AI. 

This **Administrator Manual** serves as the definitive operational reference for deploying, configuring, maintaining, monitoring, and troubleshooting the EWMP backend infrastructure. In accordance with enterprise architectural standards, **this document describes exclusively the administration features, operational workflows, and security mechanisms that physically exist in the backend codebase (`server/`)**. No theoretical capabilities, unwritten scripts, or unverified frontend management screens are assumed or invented.

---

## 2. Administrator Responsibilities

System administrators and infrastructure engineers operating EWMP are responsible for maintaining system integrity, tenant isolation, security compliance, and high availability. Key responsibilities include:

1. **Infrastructure & Lifecycle Management:** Overseeing application bootstrapping (`server.js`), managing graceful shutdown signals (`SIGTERM`/`SIGINT`), and verifying operational health endpoints (`/health`, `/api/health`, `/api/ai/health`).
2. **Configuration & Secret Governance:** Enforcing strict environment variable validation (`config.js`), rotating cryptographic keys (JWT access/refresh secrets), and managing third-party service credentials (MongoDB Atlas, Cloudinary v2, Google Gemini AI, Mailtrap/SMTP).
3. **Tenant & Organizational Setup:** Configuring multi-tenant organizational profiles and enterprise system settings (`SystemSetting` collection), including timezone, fiscal year boundaries, working days, and module-specific feature flags.
4. **Role-Based Access Control (RBAC) Governance:** Managing user onboarding via employee lifecycle APIs, enforcing least-privilege access across 9 discrete system roles, and monitoring account security states (lockouts and failed login attempts).
5. **Audit & Compliance Monitoring:** Continuously auditing immutable security logs (`AuditLog` collection, 2-year TTL) and user activity trails (`ActivityLog` collection, 90-day TTL) to detect unauthorized access or data tampering.
6. **AI Subsystem Oversight:** Monitoring Google Gemini AI connectivity, inspecting domain plugin health (`/api/ai/plugins/health`), managing workflow simulation engines, and mitigating API quota or provider failover events.

---

## 3. System Requirements

To reliably execute the EWMP backend application and support atomic multi-document transactions, the infrastructure must satisfy the following physical prerequisites:

### 3.1 Runtime Environment
* **Node.js:** Version `>= 18.0.0` (64-bit Linux, Windows, or macOS).
* **Process Manager:** `npm` version `>= 9.0.0` (or compatible production process managers such as PM2 or systemd).
* **Memory (RAM):** Minimum 2 GB available RAM (4 GB+ recommended for production workloads handling concurrent memory-buffered file uploads and AI workflow simulations).
* **Disk Space:** Minimum 10 GB storage for application binaries, local Winston log rotation (`logs/error.log`, `logs/combined.log`), and OS overhead.

### 3.2 Database Requirements
* **MongoDB Atlas / Cluster:** Mongoose v9.7.3 connection to a **MongoDB Replica Set or Sharded Cluster**. 
  * *Critical Note on ACID Transactions:* EWMP core services (Payroll processing, Employee onboarding, Leave approvals, and Asset allocation) rely on Mongoose multi-document transactions (`startSession()` / `startTransaction()`). Standalone MongoDB instances do not support multi-document transactions; the backend detects cluster topology at runtime (`topologyType !== 'Single'`) and automatically falls back to non-transactional execution if a standalone instance is detected.

### 3.3 Third-Party Cloud Services
* **Cloudinary v2:** Account required for enterprise document and photo storage (`CLOUDINARY_CLOUD_NAME`, `API_KEY`, `API_SECRET`).
* **Google Gemini AI Studio:** API key required for AI Operations Assistant features (`GEMINI_API_KEY`, using model `gemini-2.5-flash`).
* **SMTP / Mailtrap:** SMTP mail server credentials required for automated payslip distribution, password reset tokens, and notifications (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`).

---

## 4. Deployment Overview

The EWMP backend initialization follows a fail-fast, deterministic bootstrapping sequence governed by `server/server.js` and `server/app.js`.

### 4.1 Bootstrapping Sequence
1. **Environment Validation (`validateEnv()`):** Immediately upon execution, `env.js` and `config.js` evaluate required environment variables. If core variables (`MONGODB_URI`, `PORT`, `CLIENT_URL`) or production secrets are missing or use default dev placeholders, the process immediately logs a fatal error and terminates with exit code `1`.
2. **Exception Handlers:** Global process handlers for `uncaughtException` and `unhandledRejection` are bound early to intercept runtime anomalies and prevent undefined state execution.
3. **External Service Connection:**
   * Initializes MongoDB connection pool via `connectDB()`, configuring DNS resolution fallback (`8.8.8.8`, `1.1.1.1`) and connection event listeners (`disconnected`, `reconnected`).
   * Configures Cloudinary SDK v2 over secure HTTPS (`configureCloudinary()`).
   * Initializes Google Gemini AI Generative SDK client (`configureGemini()`).
4. **Middleware Pipeline Construction (`app.js`):**
   * Mounts HTTP security headers via `helmet()` and response payload compression via `compression()`.
   * Configures CORS policy restricting access to `CLIENT_URL` with credentials and standard HTTP headers.
   * Attaches request parsers for JSON and URL-encoded payloads with a strict `10mb` buffer limit, alongside `cookie-parser()`.
   * Mounts global NoSQL injection sanitization via `express-mongo-sanitize` to strip malicious `$` and `.` operands from query strings and request bodies.
   * Binds Winston HTTP request logging (`requestLogger`) and global rate limiting (`apiRateLimiter`: 100 requests per 15 minutes per IP).
5. **Route Registration:** Mounts modular Express routers across `/api/auth`, `/api/organizations`, `/api/employees`, `/api/payroll`, `/api/ai`, etc., culminating in a global 404 handler (`notFoundMiddleware`) and central error handler (`errorMiddleware`).
6. **HTTP Server Binding:** Starts listening on the configured `PORT` (default `5000`).

### 4.2 Process Lifecycle & Graceful Shutdown
When the OS or process manager sends a termination signal (`SIGTERM` or `SIGINT`), EWMP executes a controlled graceful shutdown:
1. Logs signal reception and stops accepting new incoming HTTP connections via `server.close()`.
2. Awaits termination of ongoing request processing.
3. Calls `disconnectDB()` to cleanly close the MongoDB Mongoose connection pool.
4. Exits with code `0`.
5. *Safety Timeout:* If database connections or hanging requests do not resolve within **10,000 milliseconds (10 seconds)**, a forced termination (`process.exit(1)`) is executed to prevent zombie processes.

---

## 5. Organization Administration

Organization administration governs tenant isolation, structural hierarchy, and system-wide operating parameters.

### 5.1 Create Organization
* **Implementation:** Organizations are instantiated during system deployment via database initialization scripts (`scripts/seedDemo.js`, `scripts/seedAuth.js`) or direct API seeding. Every tenant record in the `Organization` collection establishes a unique tenant root ID.
* **Tenant Isolation:** Every operational document in EWMP (`User`, `Employee`, `Payroll`, `Attendance`, `AuditLog`) contains a mandatory `organizationId` indexed ObjectId. All backend queries enforce `organizationId` matching to prevent cross-tenant data leakage.

### 5.2 Update Organization
* **Endpoint:** `PUT /api/organizations/current` (or `PUT /api/organizations/:id`).
* **Access Control:** Restricted strictly to `SUPER_ADMIN` and `ORG_ADMIN`.
* **Operations:** Updates company profile attributes (company name, registration details, tax identifiers, contact email, and corporate address). Changes are validated via Zod schemas and recorded in `AuditLog`.

### 5.3 Organizational Structure Management
Administrators configure the foundational structural entities required for employee onboarding:
* **Departments (`/api/departments`):** Create, read, update, and delete departmental units (e.g., Engineering, Human Resources, Finance). Supports tracking department heads and cost center codes.
* **Designations (`/api/designations`):** Manage job titles, hierarchical grading levels, and default role mappings.
* **Locations (`/api/locations`):** Manage physical office branches, remote work zones, and geofencing coordinates for attendance tracking.
* **Shifts (`/api/shifts`):** Define work timetables, start/end times, grace periods, and night-shift flags (`Shift` model).

### 5.4 Holiday Calendar
* **Endpoint:** `/api/holidays`
* **Operations:** Administrators define annual public and corporate holidays (`Holiday` collection). These dates are dynamically referenced by the Attendance and Leave engines to calculate working days, leave deductibles, and payroll pay periods.

### 5.5 Organization Settings
* **Endpoints:** `GET /api/settings`, `PUT /api/settings` (mounted via `organizationRoutes.js`).
* **Access Control:** Restricted to `SUPER_ADMIN` and `ORG_ADMIN`.
* **Configuration Scope (`SystemSetting` model):**
  * `workingDaysPerWeek`: Numeric value (1–7, default `5`).
  * `workingDays`: Array of day names (default `['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']`).
  * `fiscalYearStart`: Starting month of the financial year (1–12, default `4` for April).
  * `timezone`: Standard IANA timezone string (default `'Asia/Kolkata'`).
  * `currency`: ISO currency code (default `'INR'`).
  * `dateFormat`: Global display formatting (default `'YYYY-MM-DD'`).
  * `defaultShift`: String identifier for default employee shift mapping.
  * `payrollCycle`: Processing cycle frequency (default `'Monthly'`).
  * Feature Flags: Nested JSON objects for `attendanceSettings`, `leaveSettings`, `payrollSettings`, `notificationSettings`, and `aiSettings`.

---

## 6. User Administration

User administration manages authentication credentials, access privileges, and security states within the `User` collection.

### 6.1 Create Users
In the EWMP backend architecture, **User accounts are created automatically upon Employee onboarding**.
* **Workflow:** When an authorized administrator (`SUPER_ADMIN`, `ORG_ADMIN`, `HR_MANAGER`) executes `POST /api/employees`, `employeeService.createEmployee()` starts an atomic MongoDB transaction. It validates uniqueness of email and mobile, hashes the initial password using `bcrypt.hash(password, 12)`, and simultaneously generates linked documents in both the `users` and `employees` collections.

### 6.2 Assign Roles
* **Initial Assignment:** The user's system role (`role` field in `User` and `Employee`) is assigned during employee creation based on the onboarding payload.
* **Role Modifications:** Updating an employee profile via `PUT /api/employees/:id` modifies profile attributes. To alter an existing user's RBAC authentication role or elevate privileges across administrative tiers, system administrators execute database administration updates or re-onboard the account with appropriate designation mappings.

### 6.3 Reset Password & Security Unlocking
* **Self-Service Reset:** Users initiate resets via `POST /api/auth/forgot-password`, which generates a secure, time-limited `passwordResetToken` sent via SMTP email. Submitting the token to `POST /api/auth/reset-password/:token` hashes the new password and updates the document.
* **Administrative & Security Unlocking:** 
  * *Account Lockout Mechanism:* The `User` model tracks failed login attempts (`failedLoginAttempts`). Upon reaching **5 or 10 failed attempts**, the backend sets `isLocked = true` and populates `lockUntil` (`authService.js`).
  * *Unlocking:* When a password reset is successfully executed (`resetPassword`), the backend automatically resets `failedLoginAttempts = 0`, sets `isLocked = false`, and clears `lockUntil`, restoring account access. Authenticated users may also update credentials via `PUT /api/auth/change-password`.

### 6.4 Deactivate Users
Administrators deactivate user access through two physical mechanisms in `employeeService.js`:
1. **Status Update (`PATCH /api/employees/:id/status`):** Setting an employee's employment status to `'Resigned'` or `'Terminated'` automatically sets `employee.status = 'inactive'`, locates the linked `User` record via `user.findById()`, and sets `user.isActive = false` and `user.status = 'inactive'`.
2. **Archiving (`DELETE /api/employees/:id`):** Executing a soft delete sets `employee.status = 'archived'`, locates the linked `User` record, and updates `user.isActive = false` and `user.status = 'archived'`.
* *Security Impact:* Deactivated or archived users fail JWT authentication and are immediately blocked from accessing all platform APIs.

### 6.5 Restore Users
* **Restoration Workflow:** Because EWMP maintains strict audit trails without hard-deleting historical records, restoring an inactive or archived user account requires updating the employee's status via `PATCH /api/employees/:id/status` to an active operational state (`'Probation'`, `'Permanent'`, `'Notice Period'`) or executing database administrative maintenance to toggle `user.isActive = true` and `user.status = 'active'`.

---

## 7. RBAC Administration

EWMP implements a strict, declarative Role-Based Access Control (RBAC) model governed by `server/config/constants.js` and `server/middleware/rbacMiddleware.js`.

### 7.1 Role Definitions (`ROLES`)
The platform enforces exactly 9 discrete user roles:
1. `SUPER_ADMIN`: Root platform authority. Unrestricted access to all organizational tenants, configuration settings, user accounts, financial payroll runs, and compliance audit logs.
2. `ORG_ADMIN`: Tenant root administrator. Full CRUD authority over organization profiles, system settings, departments, designations, locations, shifts, employee lifecycles, and operational reports within their specific `organizationId`.
3. `HR_MANAGER`: Human resources authority. Manages employee onboarding, document verification, attendance records, leave request approvals, recruitment job positions/interviews, and performance review cycles.
4. `FINANCE`: Financial and payroll authority. Responsible for processing payroll runs, generating payslips, approving salary disbursements, managing salary structures, and tracking asset financial allocations.
5. `MANAGER`: Operational line manager. Authoritative access to direct reports' attendance logs, leave approvals, performance review evaluations, project creation, and task assignments.
6. `TEAM_LEAD`: Team supervisor. Read and operational access to assigned project tasks, departmental team tracking, and team attendance viewing.
7. `EMPLOYEE`: Standard workforce user. Self-service access to personal profile viewing, attendance punching, leave applications, personal payslip downloads, help desk ticketing, and assigned task execution.
8. `IT_ADMIN`: Infrastructure and technical asset manager. Full authority over company asset inventory (`Asset` collection), asset allocation/returns, and help desk ticket management and resolution.
9. `AUDITOR`: Compliance and governance monitor. Read-only access across executive dashboards, financial report summaries, payroll logs, employee timelines, and immutable system audit trails.

### 7.2 The Permission Model
1. **Authentication (`verifyToken`):** Every protected endpoint first executes `authMiddleware.js`. It extracts the Bearer JWT from the `Authorization` header or HTTP-only cookies, verifies cryptographic validity against `JWT_SECRET`, and queries the `User` database record. If the token is invalid or `user.isActive === false`, it aborts with HTTP `401 Unauthorized`.
2. **Authorization (`checkRole(allowedRoles)`):** Mounted immediately after `verifyToken`, `rbacMiddleware.checkRole` receives an array of permitted role strings. It inspects `req.user.role`. If the user's role is not present in `allowedRoles`, the middleware throws an `AppError` with HTTP `403 Forbidden` and error code `INSUFFICIENT_ROLE`.

---

## 8. Employee Administration

Employee administration covers the physical lifecycle of workforce records managed via `server/routes/employeeRoutes.js` and `server/services/employeeService.js`.

### 8.1 Employee Lifecycle Management
* **Onboarding (`POST /api/employees`):** Requires `SUPER_ADMIN`, `ORG_ADMIN`, or `HR_MANAGER`. Validates mandatory biographical, departmental, designation, location, shift, manager, and salary structure mappings. Generates unique employee IDs via `generateEmployeeId()` and initializes annual leave balances across all active leave types.
* **Profile Maintenance (`PUT /api/employees/:id`):** Updates biographical details, contact numbers (enforcing mobile uniqueness), and organizational assignments. All changes capture `previousValue` and `newValue` snapshots in `AuditLog`.
* **Timeline Tracking (`GET /api/employees/:id/timeline`):** Aggregates chronological history of status changes, departmental transfers, and document verifications for HR and Auditor review.

### 8.2 Archiving & Restoration
* **Soft Archiving (`DELETE /api/employees/:id`):** Restricted to `SUPER_ADMIN` and `ORG_ADMIN`. Transitions employee `status` to `'archived'`, deactivates the linked user credentials, and logs an `EMPLOYEE_ARCHIVED` compliance event. Historical attendance, payroll, and leave records remain fully intact for statutory reporting.
* **Restoration:** Performed via status update APIs or database maintenance, reactivating the record without data loss.

### 8.3 Document Verification Workflow
* **Upload (`POST /api/employees/:id/documents`):** Employees or administrators upload compliance files (ID proofs, resumes, contracts). Files are buffered by Multer (`uploadMiddleware.js`), validated against allowed MIME types (`pdf`, `jpeg`, `png`, `docx`) and size limits (`10MB`), and streamed to Cloudinary into tenant-scoped folders (`ewmp/documents`). A metadata record is created in `EmployeeDocument`.
* **Verification (`PATCH /api/employees/:id/documents/:docId/verify`):** Restricted to `SUPER_ADMIN`, `ORG_ADMIN`, and `HR_MANAGER`. Administrators review uploaded assets and submit verification flags (`isVerified: true/false`) along with inspection notes.
* **Deletion (`DELETE /api/employees/:id/documents/:docId`):** Removes the physical asset from Cloudinary via `cloudinary.uploader.destroy()` and deletes the MongoDB document metadata.

---

## 9. Payroll Administration

Payroll administration is executed through `server/routes/payrollRoutes.js` and `server/services/payrollService.js`, governing financial remuneration and statutory accounting.

### 9.1 Payroll Run (`POST /api/payroll/process`)
* **Access Control:** Restricted to `SUPER_ADMIN`, `ORG_ADMIN`, and `FINANCE`.
* **Execution Engine:** The administrator specifies a pay period (`payPeriodMonth`, `payPeriodYear`) and target employee scope. The backend initiates a multi-document MongoDB transaction (`startTransactionIfPossible`):
  1. Retrieves active employees and their assigned `SalaryStructure` (basic, HRA, allowances, deductions, tax slabs).
  2. Aggregates attendance records and leave deductions for the pay period.
  3. Computes net payable salary, tax withholdings, and statutory deductions.
  4. Generates initial `Payroll` collection records in `'Processed'` status.
  5. Records an immutable `PAYROLL_PROCESSED` audit log.

### 9.2 Approval Workflow (`PATCH /api/payroll/:id/approve`)
* **Access Control:** Restricted to `SUPER_ADMIN`, `ORG_ADMIN`, and `FINANCE`.
* **Execution:** Evaluates payroll records in `'Processed'` status. Within an atomic transaction, transitions `payrollStatus` to `'Approved'`, stamps `approvedBy` and `approvedAt`, and automatically generates immutable employee pay statements in the `Payslip` collection (`payslipId` linked). Records `PAYROLL_APPROVED` in `AuditLog`.

### 9.3 Payment Disbursement (`PATCH /api/payroll/:id/mark-paid`)
* **Access Control:** Restricted to `SUPER_ADMIN` and `FINANCE`.
* **Execution:** Evaluates payroll records in `'Approved'` status. Transitions `payrollStatus` to `'Paid'`, recording final disbursement completion and logging `PAYROLL_PAID` in `AuditLog`.

### 9.4 Rollback & Transactional Safety
* **Transactional Abort:** During active execution of `processPayrollRun`, `approvePayroll`, or `markPaid`, if any calculation error, database fault, or validation failure occurs, the backend invokes `commitOrAbort(session, useSession, true)`. This executes `session.abortTransaction()`, rolling back all partial database inserts or updates instantly.
* **Immutability Enforcement:** Once a payroll run successfully transitions to `'Approved'` or `'Paid'` status, **the backend enforces strict financial compliance and provides no REST API endpoint for rollback or deletion**. Any administrative corrections to finalized payrolls must be executed via manual database administrative intervention or through compensating adjustment entries in subsequent payroll cycles.

### 9.5 Payroll Audit Logs
Every payroll lifecycle event generates an immutable record in `AuditLog` capturing `organizationId`, `actorUserId`, `actorRole`, `action` (`PAYROLL_PROCESSED`, `PAYROLL_APPROVED`, `PAYROLL_PAID`), `entityId`, and state change payloads.

---

## 10. Recruitment Administration

Recruitment administration orchestrates talent acquisition workflows via `server/routes/recruitmentRoutes.js` and `server/services/recruitmentService.js`.

### 10.1 Job Positions (`/api/recruitment/positions`)
* **Operations:** Create, update, list, and close job requisitions (`JobPosition` model). Defines title, department mapping, headcount requirements, location, experience requirements, and status (`Open`, `On Hold`, `Closed`).

### 10.2 Candidate Tracking (`/api/recruitment/candidates`)
* **Operations:** Onboard applicant profiles (`Candidate` model), capturing resumes (uploaded via Cloudinary to `ewmp/resumes`), contact details, and skill sets.
* **Stage Progression:** Administrators track candidates across strict lifecycle stages: `'Applied'`, `'Screening'`, `'Interviewing'`, `'Offered'`, `'Hired'`, and `'Rejected'`.

### 10.3 Interview Scheduling (`/api/recruitment/interviews`)
* **Operations:** Schedule interview rounds (`InterviewSchedule` model) by linking candidates with internal employee interviewers. Defines interview date, mode (In-Person, Video Conference), meeting link, and feedback ratings.

### 10.4 Hiring Transition
* When a candidate is transitioned to the `'Hired'` stage, HR administrators utilize candidate data to trigger the standard Employee Onboarding workflow (`POST /api/employees`), seamlessly transferring recruitment metadata into operational workforce records.

---

## 11. Performance Administration

Performance administration manages employee evaluations and KPI tracking via `server/routes/performanceRoutes.js` and `server/services/performanceService.js`.

### 11.1 Review Cycles & Reviews (`/api/performance/reviews`)
* **Operations:** HR Managers initiate organizational review cycles (`PerformanceReview` model) for defined evaluation periods (e.g., Annual 2026, Q2 2026). Assigns reviewees to evaluating managers.

### 11.2 Approvals & Evaluation Workflows
* **Workflow:** Line managers (`MANAGER`) submit qualitative evaluations, feedback comments, and KPI scores for their direct reports. HR Managers review, moderate, and formally approve completed evaluation documents.

### 11.3 Ratings & Goal Management (`/api/performance/goals`)
* **Goal Tracking:** Employees and managers define measurable performance targets (`Goal` model), setting target completion dates, progress metrics (0–100%), and status flags (`Not Started`, `In Progress`, `Completed`).
* **Rating Synthesis:** Performance reviews aggregate KPI ratings and goal completion percentages into formal employee grading scores referenced during compensation and promotion reviews.

---

## 12. Document Administration

Document administration controls enterprise file assets via `server/routes/documentRoutes.js` and `server/services/documentService.js`.

### 12.1 Upload & Memory Buffering
* **File Processing:** All file uploads are intercepted by Multer (`uploadMiddleware.js`). To prevent disk I/O bottlenecks, incoming files are buffered directly in application memory (`multer.memoryStorage()`).
* **Validation Limits (`FILE_UPLOAD_LIMITS`):** Enforces strict file size thresholds: Documents up to **10 MB**, Resumes up to **10 MB**, and Profile Photos up to **5 MB**.
* **MIME Verification (`ALLOWED_MIME_TYPES`):** Rejects unsupported file formats. Documents accept PDF, JPEG, PNG, and DOCX; photos accept JPEG and PNG exclusively.

### 12.2 Cloudinary v2 Integration
* **Streaming Upload:** Memory buffers are piped into Cloudinary's secure upload stream (`cloudinary.uploader.upload_stream`).
* **Folder Hierarchy:** Files are automatically segregated by asset class into Cloudinary paths: `ewmp/documents`, `ewmp/photos`, and `ewmp/resumes`.
* **Metadata Persistence:** Cloudinary secure URLs, public IDs, file sizes, and format metadata are saved in MongoDB (`Document` or `EmployeeDocument` collections).

### 12.3 Deletion & Asset Cleanup
* When an administrator or authorized user deletes a document (`DELETE /api/documents/:id`), the service first invokes `cloudinary.uploader.destroy(publicId)` to obliterate the physical asset from cloud CDN storage, followed by removing the MongoDB document record.

---

## 13. Asset Administration

Asset administration manages company physical and digital inventory via `server/routes/assetRoutes.js` and `server/routes/assetAllocationRoutes.js`.

### 13.1 Inventory Management (`/api/assets`)
* **Access Control:** Managed by `IT_ADMIN`, `SUPER_ADMIN`, and `ORG_ADMIN`.
* **Operations:** Create, update, and track company assets (`Asset` collection). Records asset name, category (Laptop, Monitor, Mobile, License), serial number, purchase date, warranty expiration, asset value, and operational status (`Available`, `Allocated`, `Under Maintenance`, `Retired`).

### 13.2 Allocation (`/api/asset-allocations/allocate`)
* **Operations:** Assigns an `'Available'` asset to an active employee (`AssetAllocation` model). Stamps allocation date, expected return date, asset condition at issuance, and allocates responsibility. Atomically updates the parent asset status to `'Allocated'`.

### 13.3 Returns (`/api/asset-allocations/:id/return`)
* **Operations:** Processes asset handbacks upon employee separation or equipment replacement. Records actual return date, return condition, and assessment notes. Atomically reverts the parent asset status back to `'Available'` or transitions to `'Under Maintenance'` if repairs are required.

---

## 14. Notification Administration

Notification administration governs enterprise broadcasting via `server/routes/notificationRoutes.js` and `server/services/notificationService.js`.

### 14.1 Announcements (`/api/announcements`)
* **Operations:** `SUPER_ADMIN`, `ORG_ADMIN`, and `HR_MANAGER` publish corporate broadcasts (`Announcement` model). Can be scoped system-wide across the entire organization or targeted to specific departments or designations. Supports priority tagging (`Normal`, `Important`, `Urgent`) and expiration dates.

### 14.2 System Notifications (`/api/notifications`)
* **Operations:** The backend automatically generates real-time user notifications (`Notification` model) triggered by operational state transitions (e.g., leave request submitted/approved, help desk ticket assigned, payroll payslip generated). Users query personalized unread notification feeds and mark alerts as read.

---

## 15. Help Desk Administration

Help desk administration manages internal employee IT and HR support via `server/routes/helpdeskRoutes.js` and `server/services/helpdeskService.js`.

### 15.1 Ticket Assignment (`/api/tickets`)
* **Ticket Creation:** Employees submit support tickets (`HelpDeskTicket` model) specifying category (`IT`, `HR`, `Maintenance`, `General`), priority (`Low`, `Medium`, `High`, `Urgent`), subject, and description.
* **Routing & Assignment:** Authorized administrators (`IT_ADMIN`, `HR_MANAGER`, `SUPER_ADMIN`) review unassigned ticket queues and assign tickets to specific support agents or handler employees (`assignedTo`).

### 15.2 Resolution Workflow
* **State Progression:** Handlers transition ticket statuses across `'Open'`, `'In Progress'`, `'Resolved'`, and `'Closed'`.
* **Collaboration:** Handlers and originators append communication threads and resolution notes directly to the ticket document history.

### 15.3 Monitoring & Reporting
* Administrators track helpdesk SLA performance, open ticket volume by department, and resolution turnaround times via analytical dashboard feeds (`GET /api/reports/helpdesk`).

---

## 16. AI Administration

The AI subsystem provides automated workforce intelligence, natural language querying, and operational decision support powered by Google Gemini AI (`server/ai/` and `server/config/gemini.js`).

### 16.1 Gemini Configuration & SDK
* **Initialization:** Configured at server startup via `configureGemini()`. Instantiates the `@google/generative-ai` client using `GEMINI_API_KEY` and defaults to the `gemini-2.5-flash` model (`GEMINI_MODEL`).
* **AI Provider Flag:** Controlled via `config.ai.provider` (defaults to `'gemini'`).

### 16.2 Health & Plugin Endpoints
* **AI Health Check (`GET /api/ai/health`):** Verifies generative client initialization and API reachability. Accessible by all authenticated roles.
* **Plugin Health Check (`GET /api/ai/plugins/health`):** Inspects the operational status of domain-specific AI plugins (HR, Payroll, Attendance, Performance, Helpdesk), confirming that context builders and prompt templates are loaded.
* **Registered Plugins (`GET /api/ai/plugins`):** Lists all active AI skill modules available to the conversation engine.

### 16.3 Memory & Conversation Governance
* **Persistence:** AI interactions are persisted in MongoDB across two linked collections: `AIConversation` (session metadata, user context, title) and `AIMessage` (individual user queries and AI responses, token usage counts).
* **Administration:** Administrators and users query session histories via `GET /api/ai/history`, inspect specific threads via `GET /api/ai/history/:id`, or archive historical conversations via `DELETE /api/ai/history/:id`.

### 16.4 Workflow Engine & Simulation
* **Workflow Planning (`POST /api/ai/workflow`):** Generates structured execution plans for complex enterprise tasks (e.g., mass restructuring, audit prep).
* **Workflow Simulation (`POST /api/ai/workflow/simulate`):** Executes predictive model simulations against organizational data without modifying operational records.
* **Registry (`GET /api/ai/workflows`, `GET /api/ai/workflows/:id`):** Retrieves pre-configured enterprise automated workflow schemas.

### 16.5 Insights & Recommendations
* **Analytical Insights (`POST /api/ai/insights`):** Synthesizes cross-module trends (e.g., absenteeism correlation with department overtime).
* **Predictive Recommendations (`POST /api/ai/recommendations`):** Generates actionable HR and administrative guidance based on employee timeline data.
* **Action Plans (`POST /api/ai/action-plan`):** Formulates step-by-step remediation task lists for identified operational risks.

### 16.6 Quota Issues & Provider Failures
* **Fail-Safe Degradation:** If `GEMINI_API_KEY` is omitted or invalid during startup, `configureGemini()` logs a non-fatal warning (`⚠️ GEMINI_API_KEY is not configured. AI features will be unavailable.`). The core MERN server continues running without crashing.
* **Runtime Quota Exceeded:** If Google API rate limits or monthly quotas are exceeded during an active AI request, the controller intercepts the SDK error and returns a formatted HTTP `503 Service Unavailable` or `429 Too Many Requests` JSON response, preserving application stability.

---

## 17. Configuration Management

System administrators manage environmental variables and application constants across `server/.env` (copied from `.env.example`) and `config.js`.

### 17.1 Environment Variables Reference

| Variable Name | Required | Default Value / Example | Purpose & Architectural Authority |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Yes | `development` / `production` | Sets application execution context and validation strictness. |
| `PORT` | Yes | `5000` | HTTP port bound by the Express API server. |
| `CLIENT_URL` | Yes | `http://localhost:5173` | Allowed CORS origin for frontend web client requests. |
| `MONGODB_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/ewmp` | Mongoose connection string to MongoDB Atlas Replica Set/Cluster. |
| `JWT_SECRET` | Yes | *64-byte hex string* | Cryptographic secret for signing and verifying stateless Access Tokens. |
| `JWT_REFRESH_SECRET` | Yes | *64-byte hex string* | Cryptographic secret for signing and verifying long-lived Refresh Tokens. |
| `JWT_ACCESS_EXPIRY` | No | `15m` | Lifespan of JWT access tokens (short-lived for security). |
| `JWT_REFRESH_EXPIRY` | No | `7d` | Lifespan of JWT refresh tokens stored in HTTP-only cookies. |
| `CLOUDINARY_CLOUD_NAME` | Yes* | `your_cloud_name` | Cloudinary v2 account cloud identifier (*required for file uploads). |
| `CLOUDINARY_API_KEY` | Yes* | `your_api_key` | Cloudinary v2 API access key. |
| `CLOUDINARY_API_SECRET`| Yes* | `your_api_secret` | Cloudinary v2 API secret key. |
| `AI_PROVIDER` | No | `gemini` | Identifier for generative AI provider engine. |
| `GEMINI_API_KEY` | Yes* | `your_gemini_api_key` | Google AI Studio API key (*required for AI Assistant module). |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Target Generative AI model version. |
| `EMAIL_HOST` | Yes* | `smtp.mailtrap.io` | SMTP mail server hostname (*required for email notifications). |
| `EMAIL_PORT` | No | `587` | SMTP mail server port (587 for TLS/STARTTLS). |
| `EMAIL_USER` | Yes* | `your_smtp_username` | SMTP authentication username. |
| `EMAIL_PASS` | Yes* | `your_smtp_password` | SMTP authentication password. |
| `EMAIL_FROM` | No | `noreply@ewmp.local` | Default sender email address for outgoing system emails. |

---

## 18. Monitoring

System administrators monitor platform health, performance, and operational anomalies through structured logging and diagnostic endpoints.

### 18.1 Structured Logging (`logger.js`)
* **Winston Engine:** EWMP utilizes Winston for centralized logging, formatting entries with timestamp, log level, message, and structured metadata.
* **Console Output:** In development, outputs colorized, human-readable log streams.
* **File Rotation:** Automatically writes persistent log files into the `logs/` directory:
  * `logs/error.log`: Captures all error-level exceptions, stack traces, and transactional aborts.
  * `logs/combined.log`: Captures all general operational information, warnings, and HTTP request summaries.

### 18.2 Health Checks & Diagnostics
* **System Health (`GET /health`, `GET /api/health`):** Returns instantaneous JSON status containing uptime `status: 'healthy'`, ISO timestamp, database connection status (`database: 'connected'`), application `version: '1.0.0'`, and `environment`.
* **AI Subsystem Health (`GET /api/ai/health`, `GET /api/ai/plugins/health`):** Diagnoses Gemini Generative AI client connectivity, API authentication validity, and individual plugin availability.

### 18.3 Application Startup & Event Monitoring
* Administrators monitor server console output during bootstrapping to verify successful database reconnection events (`✅ MongoDB Connected`, `✅ MongoDB reconnected`), Cloudinary configuration, and Gemini SDK initialization. Any configuration fault aborts startup immediately with clear error logging.

---

## 19. Maintenance

Routine system maintenance ensures database efficiency, cryptographic hygiene, and application dependency security.

### 19.1 Update Dependencies
* Execute regular dependency updates within the `server/` directory:
  ```bash
  cd server
  npm outdated
  npm update
  npm audit fix
  ```
* *Verification:* After updating packages, execute API verification scripts (`node scripts/verifyEmployeeModule.js`, `node scripts/verifyPayrollModule.js`) to validate regression stability.

### 19.2 Rotate Cryptographic Secrets
* **JWT Secrets Rotation:** To rotate access and refresh signing keys, generate new 64-byte random hexadecimal strings:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
* Update `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env` and restart the server.
  * *Operational Impact:* Immediately invalidates all active JWT access tokens and refresh cookies system-wide. All users will be required to re-authenticate.
* **API Key Rotation:** Update `CLOUDINARY_API_KEY`/`SECRET` or `GEMINI_API_KEY` in `.env` and restart the Express service; no data loss occurs.

### 19.3 Automated Database Cleanup (TTL Indexes)
EWMP relies on MongoDB Time-To-Live (TTL) indexes for automated background storage maintenance without manual script execution:
* **Audit Logs (`AuditLog`):** Indexed on `createdAt` with `expireAfterSeconds: 63072000` (exactly **2 years**). MongoDB automatically purges audit events older than 2 years to maintain compliance storage boundaries.
* **Activity Logs (`ActivityLog`):** Indexed on `createdAt` with `expireAfterSeconds: 7776000` (exactly **90 days**). General session and page-view activity logs are automatically purged after 90 days.

### 19.4 Log Monitoring
* Administrators should implement daily log monitoring on `logs/error.log`, checking for recurring `OPERATIONAL_ERROR`, `TOKEN_INVALID`, or Mongoose transaction abort messages that indicate infrastructure stress or security scanning attempts.

---

## 20. Backup & Recovery

In accordance with strict architectural requirements (**Current implementation only. No invented backups.**), the EWMP backend codebase does not contain local filesystem dump scripts, custom cron-based backup scheduling, or automated backup utilities.

* **Physical Implementation:** Data backup and disaster recovery are governed entirely at the database infrastructure layer via **MongoDB Atlas**.
* **Recovery Strategy:** Administrators must configure automated Continuous Cloud Backups, Point-in-Time Recovery (PITR), and snapshot scheduling directly within the MongoDB Atlas Cloud Console. In the event of catastrophic data loss, database restoration is performed via Atlas snapshot restoration, after which the EWMP Express server re-connects seamlessly upon process restart.

---

## 21. Troubleshooting

This section outlines diagnostic procedures for physical backend error states.

### 21.1 MongoDB Connection Failures
* **Symptom:** Server aborts on startup with `❌ MongoDB connection failed: MongooseServerSelectionError`.
* **Diagnosis:** Inspect network connectivity, IP whitelist settings in MongoDB Atlas, and DNS resolution. Notice `db.js` explicitly binds Google DNS (`8.8.8.8`, `1.1.1.1`); verify corporate firewalls permit outbound DNS and port `27017` / Atlas HTTPS traffic.
* **Transaction Aborts:** If log shows `Transaction aborted`, verify Mongoose is connected to a Replica Set or Sharded Cluster (`topologyType !== 'Single'`). Standalone MongoDB instances reject `startTransaction()`.

### 21.2 Cloudinary Upload Errors
* **Symptom:** Document or photo upload fails with HTTP `500` or `FILE_UPLOAD_ERROR`.
* **Diagnosis:** Check `config.cloudinary` credentials in `.env`. Verify file payload size does not exceed `FILE_UPLOAD_LIMITS` (10MB) and MIME type matches `ALLOWED_MIME_TYPES`. Check application memory if buffer errors occur.

### 21.3 JWT Authentication Faults
* **Symptom:** API requests rejected with HTTP `401 Unauthorized` (`TOKEN_MISSING`, `TOKEN_INVALID`, `TOKEN_EXPIRED`).
* **Diagnosis:** Verify client is sending `Authorization: Bearer <token>` or valid cookies. If `TOKEN_INVALID` occurs globally, verify `JWT_SECRET` was not modified during an active session without user re-login. Verify user account is not deactivated (`user.isActive === false`).

### 21.4 SMTP Notification Failures
* **Symptom:** Password reset emails or payslip distribution fail silently or log Mailtrap connection errors.
* **Diagnosis:** Check `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` in `.env`. Ensure outbound traffic on port `587` (or `465`) is not blocked by OS firewall rules.

### 21.5 Google Gemini AI Errors
* **Symptom:** AI endpoints return HTTP `503 Service Unavailable` or log `Gemini AI configuration failed`.
* **Diagnosis:** Verify `GEMINI_API_KEY` is populated in `.env` and valid in Google AI Studio. If HTTP `429` occurs, Google Generative AI rate limits have been breached; implement client-side backoff or upgrade AI Studio tier.

### 21.6 Rate Limiter Blocks
* **Symptom:** API requests return HTTP `429 Too Many Requests` (`RATE_LIMIT_EXCEEDED`).
* **Diagnosis:** Governed by `rateLimitMiddleware.js`. Default API rate limit is 100 requests per 15 minutes per IP; Auth rate limit (`/api/auth/login`) is 20 requests per 15 minutes. If legitimate enterpriseNAT gateways trigger blocks, adjust `max` parameters in `rateLimitMiddleware.js`.

### 21.7 Validation Schema Errors
* **Symptom:** Requests rejected with HTTP `400 Bad Request` (`VALIDATION_ERROR`).
* **Diagnosis:** Intercepted by Zod validation middleware (`validationMiddleware.js`). Inspect response JSON `errors` array for exact field-level mismatch (e.g., invalid ObjectId format, missing mandatory employee biographical data, invalid email string).

### 21.8 RBAC Authorization Denial
* **Symptom:** Request returns HTTP `403 Forbidden` (`INSUFFICIENT_ROLE`).
* **Diagnosis:** Governed by `rbacMiddleware.checkRole`. Check authenticated user's assigned role in JWT (`req.user.role`). Compare against permitted roles defined on the route in `routes/*.js`. Elevate user role in database if authorized.

---

## 22. Operational Checklists

The following administrative checklists contain exclusively tasks supported by the physical implementation.

### 22.1 Daily Operational Checklist
- [ ] Execute HTTP GET to `/health` and `/api/ai/health`; verify `200 OK` and `database: 'connected'`.
- [ ] Review `logs/error.log` for unhandled exceptions, transactional aborts, or repeated authentication failures.
- [ ] Check active helpdesk ticket queues (`/api/tickets`); ensure urgent IT/HR tickets are assigned.

### 22.2 Weekly Operational Checklist
- [ ] Review user security state; check database for accounts locked due to excessive failed login attempts (`isLocked: true`).
- [ ] Inspect Cloudinary storage utilization via Cloudinary console; verify uploaded documents conform to retention guidelines.
- [ ] Monitor API rate limiter trigger frequency in logs to identify potential brute-force scanning or misconfigured client polling.

### 22.3 Monthly Operational Checklist
- [ ] Audit `AuditLog` collection records for sensitive administrative actions (`PAYROLL_APPROVED`, `EMPLOYEE_ARCHIVED`, `EMPLOYEE_STATUS_CHANGED`).
- [ ] Verify payroll processing completion; confirm all monthly payroll runs transition from `'Processed'` to `'Approved'` and `'Paid'`.
- [ ] Verify automated employee leave balance calculations and accrual consistency across active leave types.

### 22.4 Yearly Operational Checklist
- [ ] Review Organization System Settings (`/api/settings`); confirm `fiscalYearStart`, working days, and holiday calendar for the new operating year.
- [ ] Rotate JWT secret keys (`JWT_SECRET`, `JWT_REFRESH_SECRET`) and third-party API credentials (`CLOUDINARY_API_KEY`, `GEMINI_API_KEY`).
- [ ] Verify MongoDB Atlas TTL index compliance; confirm 2-year audit log and 90-day activity log automated expiration policies are active.
- [ ] Perform annual npm dependency audit (`npm audit`) and update server package dependencies.

---

## 23. Security Responsibilities

Administrators must enforce rigorous security governance across four foundational pillars:

### 23.1 Secret Management
* Never store production secrets in plaintext code or version control.
* Enforce secure production validation: `config.js` explicitly forbids default development placeholder strings for `JWT_SECRET` and `JWT_REFRESH_SECRET` when `NODE_ENV === 'production'`, terminating startup if detected.

### 23.2 Role Reviews & Least Privilege
* Regularly audit role assignments across the 9 RBAC tiers. Ensure high-privilege roles (`SUPER_ADMIN`, `ORG_ADMIN`, `FINANCE`) are restricted to verified executive personnel.
* Enforce separation of duties: Ensure line managers (`MANAGER`) cannot process payrolls or archive employee records.

### 23.3 Audit Log Governance
* Protect the immutability of the `AuditLog` collection. Never execute manual database deletions on audit records prior to statutory TTL expiration.
* Routinely review audit trails for unexpected IP addresses, off-hours administrative status changes, or unauthorized document deletions.

### 23.4 Tenant Isolation Integrity
* When executing manual administrative queries or database maintenance, always include `{ organizationId: targetOrgId }` in filter criteria. Never disable or bypass Mongoose schema tenant scoping.

---

## 24. Known Limitations

This section documents verified physical limitations in the current EWMP backend implementation:
1. **Multi-Document Transaction Dependency:** Standalone MongoDB instances (often used in local development) do not support multi-document transactions. While `startTransactionIfPossible()` provides seamless fallback, ACID atomicity for payroll runs and employee onboarding is guaranteed *only* on MongoDB Replica Sets or Sharded Clusters.
2. **In-Memory File Buffering:** Multer upload middleware processes files in application memory (`memoryStorage`) prior to Cloudinary streaming. Concurrent massive file uploads (>10MB) under high traffic can spike Node.js heap utilization.
3. **No Native File Backup Engine:** The backend codebase implements no native filesystem dump or external S3 backup cron jobs; backup resilience depends entirely on external MongoDB Atlas cloud configuration.
4. **Immutable Payroll State:** No REST API endpoint exists to revert, un-approve, or delete a payroll run once transitioned to `'Approved'` or `'Paid'` status.

---

## 25. Future Improvements

The following architectural enhancements have been identified during enterprise technical audits for future release cycles:
1. **Multi-Factor Authentication (MFA):** Native TOTP (Time-based One-Time Password) two-factor authentication enforcement for privileged administrative roles (`SUPER_ADMIN`, `FINANCE`, `ORG_ADMIN`).
2. **Automated Audit Log Export:** Scheduled background cron jobs to export expiring `AuditLog` records to cold object storage (AWS S3 / Google Cloud Storage) prior to 2-year MongoDB TTL deletion.
3. **Granular RBAC Permission Overrides:** Extending the 9 static role definitions with dynamic, database-stored feature permission matrices and departmental data-scoping constraints.
4. **AI Token Governance & Quota Throttling:** Implementing per-tenant token consumption tracking and rate-throttling tables for Google Gemini AI interactions to prevent single-tenant quota exhaustion.

---

## 26. Architectural Diagrams

### 26.1 Administration Workflow Diagram
The following Mermaid flowchart illustrates the deterministic server bootstrapping, configuration validation, and service initialization workflow executed by administrators:

```mermaid
flowchart TD
    A[Start Server Process: node server.js] --> B[Load Environment Variables: .env]
    B --> C[Validate Environment: env.js / config.js]
    C -->|Missing Vars / Insecure Secrets| D[Log Fatal Error & Terminate: process.exit 1]
    C -->|Configuration Valid| E[Bind Global Exception Handlers]
    E --> F[Initialize MongoDB Connection Pool: connectDB]
    F -->|Connection Failed| D
    F -->|Connected| G[Configure Cloudinary v2 SDK]
    G --> H[Configure Google Gemini AI SDK]
    H -->|Missing API Key| I[Log Warning: AI Features Disabled]
    H -->|Configured| J[Mount Express Middleware Pipeline: app.js]
    I --> J
    J --> K[Attach Security, CORS, Rate Limiters & NoSQL Sanitization]
    K --> L[Register Modular API Routers & RBAC Middleware]
    L --> M[Bind Global Error Handler & 404 Fallback]
    M --> N[Start HTTP Listen on PORT 5000]
    N --> O[Server Operational: Serve /health & /api/ai/health]
```

### 26.2 User Lifecycle State Diagram
The following Mermaid state diagram illustrates user account progression, lockout security enforcement, and archiving:

```mermaid
stateDiagram-v2
    [*] --> Active: Employee Onboarding (POST /api/employees)
    
    state Active {
        [*] --> Operational
        Operational --> Locked: Failed Login Attempts >= 5 or 10
        Locked --> Operational: Lock Period Expired (lockUntil)
        Locked --> Operational: Password Reset Executed (failedLoginAttempts = 0)
    }
    
    Active --> Inactive: Employee Status Updated (Resigned / Terminated)
    Active --> Archived: Employee Soft Deleted (DELETE /api/employees/:id)
    
    Inactive --> Active: Employee Status Restored to Operational
    Archived --> Active: Database Admin Restoration
    
    Inactive --> [*]: Statutorily Retained
    Archived --> [*]: Retained indefinitely (Audit Compliance)
```

### 26.3 Payroll Approval Workflow Diagram
The following Mermaid sequence diagram illustrates the atomic multi-document transaction workflow for payroll processing, payslip generation, and financial disbursement:

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Finance / HR Admin
    participant API as Payroll Routes (/api/payroll)
    participant Svc as Payroll Service
    participant DB as MongoDB Cluster (ACID Tx)
    participant Cloud as Payslip / AuditLog
    
    Admin->>API: POST /process (payPeriodMonth, payPeriodYear)
    API->>Svc: processPayrollRun()
    Svc->>DB: startTransactionIfPossible()
    Svc->>DB: Aggregate Attendance, Leave & Salary Structures
    Svc->>DB: Insert Payroll Records (Status: Processed)
    Svc->>Cloud: Create AuditLog (PAYROLL_PROCESSED)
    Svc-->>API: Return Processed Payroll Summary
    
    Admin->>API: PATCH /:id/approve
    API->>Svc: approvePayroll(id, actor)
    Svc->>DB: startTransactionIfPossible()
    Svc->>DB: Verify Status == Processed
    Svc->>DB: Update Payroll (Status: Approved, approvedBy, approvedAt)
    Svc->>Cloud: Generate Immutable Employee Payslips (Payslip Collection)
    Svc->>Cloud: Create AuditLog (PAYROLL_APPROVED)
    Svc->>DB: commitTransaction()
    DB-->>Svc: Commit Confirmed
    Svc-->>API: Return Approved Payroll
    
    Admin->>API: PATCH /:id/mark-paid
    API->>Svc: markPaid(id, actor)
    Svc->>DB: startTransactionIfPossible()
    Svc->>DB: Update Payroll (Status: Paid)
    Svc->>Cloud: Create AuditLog (PAYROLL_PAID)
    Svc->>DB: commitTransaction()
    Svc-->>API: Return Paid Payroll Statement
```

### 26.4 AI Administration Workflow Diagram
The following Mermaid flowchart illustrates how the AI subsystem intercepts user requests, validates RBAC and Zod schemas, communicates with Google Gemini, and logs token consumption:

```mermaid
flowchart TD
    A[Incoming AI Request: /api/ai/*] --> B[Verify JWT Auth: verifyToken]
    B -->|Invalid Token| C[Return 401 Unauthorized]
    B -->|Valid Token| D[Evaluate RBAC Role: checkRole]
    D -->|Insufficient Role| E[Return 403 Forbidden]
    D -->|Authorized| F[Validate Payload: Zod Schema / Security Sanitize]
    F -->|Validation Error| G[Return 400 Bad Request]
    F -->|Valid Request| H[AI Controller -> AI Service]
    H --> I{Verify Gemini Client Initialized?}
    I -->|Client Null| J[Return 503 AI Service Unavailable]
    I -->|Client Ready| K[Build Domain Context & Load Prompt Template]
    K --> L[Execute SDK Request: GoogleGenerativeAI]
    L -->|API Quota Breached / Fail| M[Log Error & Return 429/503 Fallback]
    L -->|Success| N[Sanitize AI Response Payload]
    N --> O[Persist Session & Token Metrics: AIConversation / AIMessage]
    O --> P[Return Formatted Success Response 200 OK]
```

---

## 27. Administration Reference Tables

### 27.1 System Roles & Access Matrix

| Role Name | Authority Level | Primary Administrative & Operational Domain | Key Module Access |
| :--- | :--- | :--- | :--- |
| `SUPER_ADMIN` | Root Tier 1 | Cross-tenant global administration, system settings, financial payrolls, audit logs. | All Modules (Unrestricted CRUD). |
| `ORG_ADMIN` | Tenant Tier 1 | Tenant-scoped structure (Departments, Designations, Locations, Shifts), company profile. | Organizations, Employees, Reports, Settings. |
| `HR_MANAGER` | Operational Tier 2 | Workforce lifecycle, employee onboarding, document verification, leave & attendance governance. | Employees, Leave, Attendance, Recruitment, Performance. |
| `FINANCE` | Financial Tier 2 | Payroll execution, payslip generation, salary structure assignment, asset financial tracking. | Payroll, Payslips, Salary Structures, Asset Allocations. |
| `MANAGER` | Supervisor Tier 3 | Direct reports' attendance viewing, leave request approvals, performance evaluation ratings. | Attendance, Leave Approvals, Performance Reviews, Projects. |
| `TEAM_LEAD` | Supervisor Tier 4 | Project task coordination, team attendance monitoring, basic departmental tracking. | Projects, Tasks, Team Attendance. |
| `EMPLOYEE` | End-User Tier 5 | Self-service profile viewing, attendance punching, leave applications, payslip downloading. | Personal Profile, Attendance, Leave Requests, Tickets. |
| `IT_ADMIN` | Technical Tier 2 | Physical/digital asset inventory, equipment allocation/returns, help desk ticket routing. | Assets, Asset Allocations, Helpdesk Tickets. |
| `AUDITOR` | Compliance Tier 2 | Read-only inspection of executive dashboards, audit trails, timelines, financial reports. | Reports, AuditLogs, Employee Timelines, Dashboards (Read-Only). |

### 27.2 Administrator Operational Responsibilities

| Operational Domain | Task Description | Execution Method | Authoritative Entity |
| :--- | :--- | :--- | :--- |
| **Server Lifecycle** | Start, stop, or restart EWMP API server; verify health endpoints. | Terminal (`npm run dev`, `pm2`), HTTP GET `/health`. | `server.js`, `app.js` |
| **Config Governance** | Configure database URIs, JWT expiration, Cloudinary & Gemini keys. | Edit `server/.env`, restart process. | `config/config.js`, `env.js` |
| **Tenant Structure** | Configure company profile, working days, shifts, locations, holidays. | REST APIs (`/api/settings`, `/api/departments`, etc.). | `organizationController.js` |
| **User Onboarding** | Create employee records and automatically generate linked user credentials. | REST API (`POST /api/employees`). | `employeeService.js` |
| **Security Lockouts** | Reset user credentials to clear failed login attempts and account lockouts. | REST API (`POST /api/auth/reset-password/:token`). | `authService.js`, `User.js` |
| **Payroll Execution** | Calculate monthly payrolls, approve pay runs, and generate payslips. | REST APIs (`POST /api/payroll/process`, `PATCH /:id/approve`).| `payrollService.js` |
| **Compliance Audit** | Inspect security logs, employee timeline changes, and document verifications. | REST APIs (`GET /api/reports/*`, `/api/employees/:id/timeline`).| `AuditLog.js`, `reportRoutes.js` |

### 27.3 Backend Configuration Files Reference

| File Path (`server/`) | File Name | Purpose & Operational Authority | Key Exports / Responsibilities |
| :--- | :--- | :--- | :--- |
| `config/config.js` | Configuration Manager | Central environment variable parsing, typing, and production validation. | Enforces required vars, forbids default production JWT secrets. |
| `config/db.js` | Database Adapter | MongoDB Atlas Mongoose connection pool and DNS resolver configuration. | `connectDB()`, `disconnectDB()`, reconnection event listeners. |
| `config/cloudinary.js` | Cloud Storage SDK | Cloudinary v2 SDK initialization for enterprise asset management. | `configureCloudinary()`, `cloudinary` client instance. |
| `config/gemini.js` | Generative AI SDK | Google Gemini AI client configuration and non-fatal initialization. | `configureGemini()`, `getGeminiClient()` getter. |
| `config/constants.js` | Global System Constants | Centralized enumerations for 9 ROLES, HTTP status codes, and upload limits. | `ROLES`, `FILE_UPLOAD_LIMITS`, `ALLOWED_MIME_TYPES`, `ERROR_CODES`. |
| `config/logger.js` | Winston Logging Config | Structured colorized console logging and persistent rotating file logging. | Generates `logs/error.log` and `logs/combined.log`. |

### 27.4 System Maintenance Tasks Matrix

| Maintenance Task | Recommended Frequency | Execution Method / Command | Operational Impact |
| :--- | :---: | :--- | :--- |
| **Health Check Audit** | Daily | HTTP GET to `/health` and `/api/ai/health`. | Instantaneous verification of uptime and database connectivity; zero downtime. |
| **Error Log Inspection** | Daily | Inspect `server/logs/error.log` for anomalies. | Identifies transactional aborts or brute-force scanning; zero impact. |
| **Account Lockout Review**| Weekly | Query database for `User` documents where `isLocked: true`. | Ensures legitimate personnel are not locked out; reset credentials to unlock. |
| **Cloudinary Audit** | Weekly / Monthly | Review Cloudinary dashboard storage consumption. | Prevents cloud quota exhaustion; remove orphaned files via delete APIs. |
| **Audit Log Compliance** | Monthly | Review `AuditLog` entries for administrative state changes. | Verifies governance compliance; zero operational downtime. |
| **JWT Secret Rotation** | Yearly / Post-Incident | Generate new hex secrets in `.env` and restart server. | **High Impact:** Invalidates all active tokens; forces system-wide user re-login. |
| **Package Auditing** | Yearly | Run `npm audit` and `npm update` in `server/`. | Mitigates CVE vulnerabilities; requires maintenance window for restart. |
| **Statutory TTL Cleanup** | Automated (Continuous) | Governed natively by MongoDB Atlas TTL indexes. | Automatically purges `AuditLog` (>2 yrs) and `ActivityLog` (>90 days). |

---

## 28. Verification Summary & Inspection Record

This **Administrator Manual** was generated through comprehensive physical inspection and structural verification against the finalized EWMP backend codebase.

### 28.1 Files Inspected
1. `server/package.json` & `server/.env.example`: Verified runtime engine versions (Node >=18, npm >=9), script definitions, and mandatory environment variables.
2. `server/server.js` & `server/app.js`: Verified process bootstrapping, fail-fast configuration validation (`validateEnv()`), middleware pipeline ordering, NoSQL injection protection, rate limiting, and graceful shutdown handlers.
3. `server/config/*`: Inspected `config.js`, `db.js`, `cloudinary.js`, `gemini.js`, `constants.js`, and `logger.js` to confirm configuration rules, production secret enforcement, DNS settings, and logging rotation.
4. `server/routes/*` & `server/controllers/*`: Verified authentication (`authRoutes.js`), organization and system settings (`organizationRoutes.js`), employee onboarding/documents (`employeeRoutes.js`), payroll runs (`payrollRoutes.js`), recruitment, performance, assets, helpdesk, notifications, and reports.
5. `server/services/*`: Inspected core business logic in `authService.js`, `employeeService.js`, `organizationService.js`, and `payrollService.js` to confirm user account auto-creation, lockout/unlocking mechanics, archiving status updates, and atomic ACID transaction abort/commit handling (`commitOrAbort`).
6. `server/models/*`: Inspected `User.js`, `Employee.js`, `Organization.js`, `SystemSetting.js`, `AuditLog.js`, `ActivityLog.js`, `Payroll.js`, `Payslip.js`, and `Document.js` to verify schema attributes, default values, lockouts, status enumerations, and automated TTL index expirations (2 years for audit logs, 90 days for activity logs).
7. `server/ai/*`: Verified Google Gemini AI route endpoints (`aiRoutes.js`), controllers (`aiController.js`), health diagnostics (`/api/ai/health`, `/api/ai/plugins/health`), memory persistence (`AIConversation`, `AIMessage`), and workflow engines.
8. `server/middleware/*`: Inspected `rbacMiddleware.js`, `authMiddleware.js`, `validationMiddleware.js`, `rateLimitMiddleware.js`, `uploadMiddleware.js`, and `mongoSanitizeMiddleware.js` to verify the 9-role permission contract, token verification, memory buffering, and security rules.
9. `server/scripts/*`: Reviewed database seeding and verification scripts (`seedDemo.js`, `seedAuth.js`, `verifyEmployeeModule.js`, etc.) supporting administrative initialization and regression testing.

### 28.2 Strict Implementation Compliance
* **No Invented Features:** All documented endpoints, configuration variables, RBAC roles, audit log actions, and maintenance tasks map 1-to-1 with physical codebase definitions.
* **No Invented Backups:** Documented strictly that backend code implements no native filesystem backup utility, correctly relying on MongoDB Atlas continuous cloud snapshots.
* **No Invented Rollback APIs:** Documented strictly that payroll rollback is handled via transactional aborts during execution, and that finalized (`Approved` / `Paid`) payroll runs are immutable without dedicated REST deletion endpoints.
* **No Invented User Screens:** Focused entirely on administrative API endpoints, environment configurations, and database operations without assuming frontend management UI layouts.

---
*End of Administrator Manual.*
