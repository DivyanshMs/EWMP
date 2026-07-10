const fs = require('fs');
const path = require('path');
const outputPath = path.join(__dirname, 'API_DOCUMENTATION.md');
const content = `# API Documentation
## 1. Overview & REST Conventions
The Enterprise Workforce Management Platform (EWMP) REST API provides a robust, enterprise-grade programmatic interface for managing the complete employee lifecycle, organization hierarchies, attendance tracking, leave processing, payroll execution, project/task allocation, asset distribution, help desk ticketing, corporate documentation, notifications, executive reporting, performance appraisals, recruitment pipelines, and autonomous AI assistant workflows.
### 1.1 Base URL & Routing Architecture
All REST API endpoints are served over HTTPS and prefixed with the API versioning routing path:
* **Local Development Environment:** \`http://localhost:5000/api\`
* **Production Enterprise Environment:** \`https://api.ewmp.local/api/v1\`
The Express application mounts modular domain routers onto dedicated base URL paths as defined in \`server/app.js\`:
| Module Name | Base Route Prefix | Associated Router Module | Authority / Phase |
| :--- | :--- | :--- | :--- |
| **Authentication** | \`/api/auth\` | \`server/routes/authRoutes.js\` | Phase 3 |
| **Organization & Settings** | \`/api/organizations\` & \`/api/settings\` | \`server/routes/organizationRoutes.js\` | Phase 4A |
| **Departments** | \`/api/departments\` | \`server/routes/departmentRoutes.js\` | Phase 4A |
| **Designations** | \`/api/designations\` | \`server/routes/designationRoutes.js\` | Phase 4A |
| **Work Locations** | \`/api/locations\` | \`server/routes/locationRoutes.js\` | Phase 4A |
| **Work Shifts** | \`/api/shifts\` | \`server/routes/shiftRoutes.js\` | Phase 4A |
| **Holidays** | \`/api/holidays\` | \`server/routes/holidayRoutes.js\` | Phase 4B |
| **Employees** | \`/api/employees\` | \`server/routes/employeeRoutes.js\` | Phase 4A |
| **Attendance** | \`/api/attendance\` | \`server/routes/attendanceRoutes.js\` | Phase 4B |
| **Leave Management** | \`/api/leave-types\`, \`/api/leave-balances\`, \`/api/leave-requests\` | \`server/routes/leaveRoutes.js\` | Phase 4B |
| **Payroll Management** | \`/api/payroll\` | \`server/routes/payrollRoutes.js\` | Phase 4C |
| **Payslips** | \`/api/payslips\` | \`server/routes/payslipRoutes.js\` | Phase 4C |
| **Projects** | \`/api/projects\` | \`server/routes/projectRoutes.js\` | Phase 5A |
| **Tasks** | \`/api/tasks\` | \`server/routes/taskRoutes.js\` | Phase 5A |
| **Assets & Inventory** | \`/api/assets\` | \`server/routes/assetRoutes.js\` | Phase 5B |
| **Asset Allocations** | \`/api/asset-allocations\` | \`server/routes/assetAllocationRoutes.js\` | Phase 5B |
| **Documents & Policies** | \`/api/documents\` | \`server/routes/documentRoutes.js\` | Phase 5C |
| **Notifications & Announcements** | \`/api/notifications\` & \`/api/announcements\` | \`server/routes/notificationRoutes.js\` | Phase 5C |
| **Help Desk Tickets** | \`/api/tickets\` | \`server/routes/helpdeskRoutes.js\` | Phase 5B |
| **Reports & Analytics Dashboard** | \`/api/dashboard\` & \`/api/reports\` | \`server/routes/reportRoutes.js\` | Phase 6B |
| **Performance Appraisals** | \`/api/performance\` | \`server/routes/performanceRoutes.js\` | Phase 6C |
| **Recruitment & ATS** | \`/api/recruitment\` | \`server/routes/recruitmentRoutes.js\` | Phase 6C |
| **AI Assistant & Workflows** | \`/api/ai\` | \`server/ai/routes/aiRoutes.js\` | Phase 6A |
---
### 1.2 REST architectural Conventions
1. **Resource Naming:** Standardized lowercase kebab-case URI paths representing plural domain nouns (e.g., \`/leave-requests\`, \`/asset-allocations\`).
2. **Stateless Operations:** Endpoints do not maintain client session state on the server. Every authenticated request must carry a valid JSON Web Token (JWT).
3. **HTTP Methods:**
   * \`GET\`: Retrieve a resource or paginated collection of resources without modifying server state.
   * \`POST\`: Create a new resource, trigger a stateful operational workflow (e.g., clock-in, payroll processing), or submit complex analytical queries.
   * \`PUT\`: Complete replacement of an existing resource by ID.
   * \`PATCH\`: Partial update of resource attributes or specific lifecycle state transition (e.g., status updates, document verification, leave approval).
   * \`DELETE\`: Remove or soft-archive a resource from active operational views.
4. **Content Types:**
   * Request Payloads: \`application/json\` (enforced with a 10MB limit in Express).
   * File Uploads: \`multipart/form-data\` (handled via specialized multer upload middleware).
   * Response Payloads: Standardized JSON envelope formatted by \`formatResponse.js\`.
---
## 2. Authentication & Authorization Overview
The EWMP platform implements a multi-layered security architecture combining stateless JSON Web Tokens (JWT) for authentication with hierarchical Role-Based Access Control (RBAC) for authorization.
### 2.1 Dual-Token JWT Mechanism
Upon successful login at \`/api/auth/login\`, the server issues two tokens:
1. **Access Token:** A short-lived, cryptographically signed JWT containing user credentials (\`id\`, \`role\`, \`email\`, \`organizationId\`, \`employeeId\`). Must be passed in the HTTP request header:
   \`\`\`http
   Authorization: Bearer <access_token>
   \`\`\`
2. **Refresh Token:** A long-lived, rotating renewal token transmitted via an HTTP-only, secure, \`SameSite=Strict\` cookie (\`refreshToken\`) or in the payload of renewal requests to \`/api/auth/refresh\`.
### 2.2 Role-Based Access Control (RBAC) Matrix & Enumerable Roles
Every endpoint enforces authorization via the \`checkRole([...allowedRoles])\` middleware. The system defines 9 discrete operational user roles in \`server/config/constants.js\` in accordance with \`PROJECT_MASTER.md\`:
| Role Identifier | Title & Operational Scope | Key Permissions |
| :--- | :--- | :--- |
| \`SUPER_ADMIN\` | System Super Administrator | Unrestricted system access, multi-tenant governance, global configurations. |
| \`ORG_ADMIN\` | Tenant Organization Administrator | Full control over tenant organization settings, departments, designations, and employee archiving. |
| \`HR_MANAGER\` | Human Resources Manager | Employee onboarding, document verification, attendance approval, leave management, recruitment, and performance review governance. |
| \`FINANCE\` | Finance & Payroll Controller | Payroll generation, processing, approval, disbursement marking, and financial auditing. |
| \`MANAGER\` | Department / Operational Manager | Team attendance oversight, leave approval, project management, task assignment, and employee performance appraisal. |
| \`TEAM_LEAD\` | Project Team Leader | Task assignment, attendance correction oversight, and interview feedback submission. |
| \`EMPLOYEE\` | Regular Workforce Employee | Self-service attendance clocking, leave applications, ticket raising, asset viewing, and self-assessments. |
| \`IT_ADMIN\` | Information Technology Administrator | Help desk ticket management and IT asset inventory governance. |
| \`AUDITOR\` | Compliance & Security Auditor | Read-only access across compliance reports, audit logs, employee timelines, and financial summaries. |
---
## 3. Standard Response Format
All REST API responses are enveloped in a consistent JSON structure generated by the centralized response formatter (\`server/utils/formatResponse.js\`).
### 3.1 Success Response Envelope (200 OK / 201 Created)
\`\`\`json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {
    "id": "64b8f0123456789012345678",
    "status": "Active",
    "createdAt": "2026-07-07T10:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-07-07T10:00:00.123Z",
    "version": "1.0.0"
  }
}
\`\`\`
### 3.2 Operational Error Response (400 Bad Request)
\`\`\`json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid date range specified for report generation",
  "errorCode": "VALIDATION_ERROR",
  "meta": {
    "timestamp": "2026-07-07T10:00:01.000Z",
    "path": "/api/reports/attendance"
  }
}
\`\`\`
### 3.3 Validation Error Response (422 Unprocessable Entity)
When request payload validation fails Zod schema verification in \`validationMiddleware.js\`:
\`\`\`json
{
  "success": false,
  "statusCode": 422,
  "error": "Validation Error",
  "message": "Request validation failed",
  "errorCode": "VALIDATION_ERROR",
  "fields": {
    "email": "Invalid email address format",
    "basicSalary": "Basic salary must be a positive numeric value"
  },
  "meta": {
    "timestamp": "2026-07-07T10:00:02.000Z",
    "path": "/api/employees"
  }
}
\`\`\`
### 3.4 Unauthorized Response (401 Unauthorized)
\`\`\`json
{
  "success": false,
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Access token is missing or expired",
  "errorCode": "TOKEN_EXPIRED",
  "meta": {
    "timestamp": "2026-07-07T10:00:03.000Z",
    "path": "/api/attendance/my"
  }
}
\`\`\`
### 3.5 Forbidden Response (403 Forbidden)
\`\`\`json
{
  "success": false,
  "statusCode": 403,
  "error": "Forbidden",
  "message": "You do not have permission to perform this action",
  "errorCode": "INSUFFICIENT_ROLE",
  "meta": {
    "timestamp": "2026-07-07T10:00:04.000Z",
    "path": "/api/payroll/process"
  }
}
\`\`\`
### 3.6 Resource Not Found Response (404 Not Found)
\`\`\`json
{
  "success": false,
  "statusCode": 404,
  "error": "Not Found",
  "message": "Employee record not found with the specified ID",
  "errorCode": "ROUTE_NOT_FOUND",
  "meta": {
    "timestamp": "2026-07-07T10:00:05.000Z",
    "path": "/api/employees/64b8f0000000000000000000"
  }
}
\`\`\`
### 3.7 Duplicate Resource Conflict Response (409 Conflict)
\`\`\`json
{
  "success": false,
  "statusCode": 409,
  "error": "Conflict",
  "message": "An employee with this email address already exists in the organization",
  "errorCode": "DUPLICATE_RESOURCE",
  "meta": {
    "timestamp": "2026-07-07T10:00:06.000Z",
    "path": "/api/employees"
  }
}
\`\`\`
### 3.8 Rate Limit Exceeded Response (429 Too Many Requests)
\`\`\`json
{
  "success": false,
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Too many login attempts from this IP address. Please try again after 15 minutes.",
  "errorCode": "RATE_LIMIT_EXCEEDED",
  "meta": {
    "timestamp": "2026-07-07T10:00:07.000Z",
    "path": "/api/auth/login"
  }
}
\`\`\`
### 3.9 Internal Server Error Response (500 Internal Server Error)
\`\`\`json
{
  "success": false,
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An unexpected system error occurred during database processing",
  "errorCode": "INTERNAL_SERVER_ERROR",
  "meta": {
    "timestamp": "2026-07-07T10:00:08.000Z",
    "path": "/api/ai/chat"
  }
}
\`\`\`
---
## 4. Pagination, Filtering, and Sorting
Collection GET endpoints implement standardized query parameters for pagination, field filtering, sorting, and full-text searching, enforced by \`paginationQuerySchema\` in \`server/validators/validationFramework.js\`.
### 4.1 Pagination Parameters
* \`page\` (integer, optional): The 1-indexed page number to retrieve. Default is \`1\`.
* \`limit\` (integer, optional): Number of records per page. Default is \`10\`, maximum allowed value is \`100\`.
When pagination is active, the success response envelope includes structured pagination metadata:
\`\`\`json
{
  "success": true,
  "statusCode": 200,
  "message": "Employees retrieved successfully",
  "data": [
    { "id": "64b8f0111111111111111111", "firstName": "Jane", "lastName": "Doe" }
  ],
  "meta": {
    "pagination": {
      "total": 142,
      "page": 1,
      "limit": 10,
      "totalPages": 15,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "timestamp": "2026-07-07T10:00:09.000Z"
  }
}
\`\`\`
### 4.2 Filtering & Searching
Endpoints support domain-specific exact match filters and text search via query strings:
* \`search\` (string, optional): Search term matched against indexed fields (e.g., employee name, email, project title, document title).
* Domain Filters: Implemented filters include \`department\`, \`designation\`, \`status\`, \`employmentStatus\`, \`type\`, \`priority\`, \`category\`, \`month\`, \`year\`, \`assignee\`, and \`project\`.
### 4.3 Sorting
* \`sort\` (string, optional): Name of the field to sort by (e.g., \`createdAt\`, \`basicSalary\`, \`title\`, \`date\`). Default is typically \`-createdAt\` (newest first).
* \`order\` (string, optional): Sort direction, either \`asc\` (ascending) or \`desc\` (descending).
---
## 5. Module Endpoints
This section defines the complete implemented REST API across all 16 operational modules. Every endpoint documented below is extracted directly from physical route definitions in \`server/routes/\`, controller handlers in \`server/controllers/\`, and validator definitions in \`server/validators/\`.
---
### 5.1 Authentication Module (\`/api/auth\`)
Managed by \`server/routes/authRoutes.js\` and \`server/controllers/authController.js\`.
#### 1. User Login
* **Method:** \`POST\`
* **URL:** \`/api/auth/login\`
* **Purpose:** Authenticate user credentials and issue JWT access and refresh tokens.
* **Authentication Required:** No (Public endpoint protected by strict rate limiting: max 5 requests per 15 minutes).
* **Required Roles:** None (Public).
* **Request Body:**
  \`\`\`json
  {
    "email": "admin@ewmp.local",
    "password": "Admin@123456"
  }
  \`\`\`
* **Request Params / Query Params:** None.
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "message": "Login successful",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "d8f9a0b1c2d3e4f5a6b7c8d9e0f1...",
      "user": {
        "_id": "64b8f0000000000000000001",
        "email": "admin@ewmp.local",
        "role": "SUPER_ADMIN",
        "organization": "64b8e0000000000000000001"
      }
    }
  }
  \`\`\`
* **Possible Errors:** \`400 Bad Request\` (Validation failed), \`401 Unauthorized\` (Invalid email or password), \`429 Too Many Requests\` (Rate limit exceeded).
* **Validation Rules:** Enforced by \`loginSchema\`: \`email\` must be a valid email string; \`password\` is required.
#### 2. Forgot Password Request
* **Method:** \`POST\`
* **URL:** \`/api/auth/forgot-password\`
* **Purpose:** Initiate password reset workflow by generating a time-limited recovery token.
* **Authentication Required:** No (Public endpoint protected by rate limiting).
* **Required Roles:** None.
* **Request Body:**
  \`\`\`json
  { "email": "employee@ewmp.local" }
  \`\`\`
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "message": "Password reset instructions sent to email",
    "data": { "resetTokenSent": true }
  }
  \`\`\`
* **Possible Errors:** \`400 Bad Request\`, \`404 Not Found\` (If user email does not exist), \`429 Too Many Requests\`.
* **Validation Rules:** Enforced by \`forgotPasswordSchema\`: valid \`email\` string required.
#### 3. Reset Password
* **Method:** \`POST\`
* **URL:** \`/api/auth/reset-password/:token\`
* **Purpose:** Set a new password using a valid cryptographic reset token.
* **Authentication Required:** No (Public).
* **Required Roles:** None.
* **Request Params:** \`token\` (URL parameter containing hexadecimal recovery token).
* **Request Body:**
  \`\`\`json
  { "newPassword": "NewSecurePassword@2026!" }
  \`\`\`
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "message": "Password has been reset successfully",
    "data": { "passwordReset": true }
  }
  \`\`\`
* **Possible Errors:** \`400 Bad Request\` (Weak password or expired token), \`401 Unauthorized\` (Invalid token).
* **Validation Rules:** Enforced by \`resetPasswordSchema\`: \`newPassword\` must be at least 8 characters with numbers and symbols.
#### 4. Refresh Access Token
* **Method:** \`POST\`
* **URL:** \`/api/auth/refresh\`
* **Purpose:** Renew short-lived access token using a valid rotating refresh token.
* **Authentication Required:** No (Token provided via body or secure cookie).
* **Required Roles:** None.
* **Request Body:**
  \`\`\`json
  { "refreshToken": "d8f9a0b1c2d3e4f5a6b7c8d9e0f1..." }
  \`\`\`
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "new_rotating_refresh_token_hex..."
    }
  }
  \`\`\`
* **Possible Errors:** \`401 Unauthorized\` (Token expired, revoked, or missing).
* **Validation Rules:** Valid refresh token required in request body or \`refreshToken\` cookie.
#### 5. User Logout
* **Method:** \`POST\`
* **URL:** \`/api/auth/logout\`
* **Purpose:** Invalidate refresh token session and clear authentication cookies.
* **Authentication Required:** Yes (\`verifyToken\`).
* **Required Roles:** All Authenticated Roles.
* **Request Body:** None.
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "message": "Logged out successfully",
    "data": null
  }
  \`\`\`
* **Possible Errors:** \`401 Unauthorized\` (Missing or invalid access token).
#### 6. Change Password
* **Method:** \`PUT\`
* **URL:** \`/api/auth/change-password\`
* **Purpose:** Update the authenticated user's account password.
* **Authentication Required:** Yes (\`verifyToken\`).
* **Required Roles:** All Authenticated Roles.
* **Request Body:**
  \`\`\`json
  {
    "currentPassword": "OldPassword123!",
    "newPassword": "NewSecurePassword123!"
  }
  \`\`\`
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "message": "Password updated successfully",
    "data": { "updated": true }
  }
  \`\`\`
* **Possible Errors:** \`400 Bad Request\` (New password same as old), \`401 Unauthorized\` (Current password incorrect).
* **Validation Rules:** Enforced by \`changePasswordSchema\`: both fields required; new password must meet complexity rules.
#### 7. Get Current User Profile
* **Method:** \`GET\`
* **URL:** \`/api/auth/me\`
* **Purpose:** Retrieve full profile, organization context, and role permissions of the currently authenticated user.
* **Authentication Required:** Yes (\`verifyToken\`).
* **Required Roles:** All Authenticated Roles.
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "message": "Profile retrieved successfully",
    "data": {
      "_id": "64b8f0000000000000000001",
      "email": "admin@ewmp.local",
      "role": "SUPER_ADMIN",
      "organization": { "_id": "64b8e0000000000000000001", "name": "EWMP Corp" },
      "employee": "64b8f0111111111111111111"
    }
  }
  \`\`\`
* **Possible Errors:** \`401 Unauthorized\`, \`404 Not Found\`.
---
### 5.2 Organization & System Settings Module
Managed by \`organizationRoutes.js\`, \`departmentRoutes.js\`, \`designationRoutes.js\`, \`locationRoutes.js\`, \`shiftRoutes.js\`, and \`holidayRoutes.js\`.
#### 1. Get Current Organization
* **Method:** \`GET\`
* **URL:** \`/api/organizations/current\`
* **Purpose:** Fetch detailed profile and subscription configurations of the authenticated tenant organization.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "_id": "64b8e0000000000000000001",
      "name": "EWMP Corp",
      "code": "EWMP",
      "email": "contact@ewmp.local",
      "phone": "+1-800-555-0199"
    }
  }
  \`\`\`
#### 2. Update Current Organization
* **Method:** \`PUT\`
* **URL:** \`/api/organizations/current\`
* **Purpose:** Update tenant organization profile, contact details, and branding.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
* **Request Body:**
  \`\`\`json
  {
    "name": "EWMP Enterprise Corp",
    "email": "admin@ewmp.local",
    "phone": "+1-800-555-0200"
  }
  \`\`\`
* **Response Example (200 OK):** Returns updated organization profile object.
* **Validation Rules:** Enforced by \`updateOrganizationSchema\`.
#### 3. Get System & Organization Settings
* **Method:** \`GET\`
* **URL:** \`/api/organizations/settings\` (Also mounted at \`/api/settings\`)
* **Purpose:** Retrieve system-wide preferences including timezone, working days, currency, and attendance rules.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "timezone": "Asia/Kolkata",
      "currency": "INR",
      "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "attendanceRules": { "gracePeriodMinutes": 15, "requireGeoLock": true }
    }
  }
  \`\`\`
#### 4. Update System & Organization Settings
* **Method:** \`PUT\`
* **URL:** \`/api/organizations/settings\` (Also mounted at \`/api/settings\`)
* **Purpose:** Modify system settings, work week calendars, and automated compliance rules.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
* **Request Body:**
  \`\`\`json
  {
    "timezone": "UTC",
    "currency": "USD",
    "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  }
  \`\`\`
* **Validation Rules:** Enforced by \`updateSettingsSchema\`.
#### 5. ID-Based Organization Operations
* **Method:** \`GET\` / \`PUT\`
* **URL:** \`/api/organizations/:id\`
* **Purpose:** Retrieve or update a specific organization record by MongoDB ObjectId.
* **Authentication Required:** Yes.
* **Required Roles:** \`GET\`: All Roles; \`PUT\`: \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
#### 6. Department Submodule (\`/api/departments\`)
* \`GET /api/departments\`: List departments. Roles: All. Query: \`page\`, \`limit\`, \`search\`.
* \`POST /api/departments\`: Create department. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ name, code, description }\`. Enforced by \`createDepartmentSchema\`.
* \`GET /api/departments/:id\`: Get department by ID. Roles: All.
* \`PUT /api/departments/:id\`: Update department. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ name, code, description }\`. Enforced by \`updateDepartmentSchema\`.
* \`DELETE /api/departments/:id\`: Archive department. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
#### 7. Designation Submodule (\`/api/designations\`)
* \`GET /api/designations\`: List designations. Roles: All. Query: \`page\`, \`limit\`, \`departmentId\`.
* \`POST /api/designations\`: Create designation. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ title, level, departmentId }\`. Enforced by \`createDesignationSchema\`.
* \`GET /api/designations/:id\`: Get designation by ID. Roles: All.
* \`PUT /api/designations/:id\`: Update designation. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ title, level, departmentId }\`.
* \`DELETE /api/designations/:id\`: Archive designation. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
#### 8. Work Location Submodule (\`/api/locations\`)
* \`GET /api/locations\`: List work locations. Roles: All. Query: \`page\`, \`limit\`.
* \`POST /api/locations\`: Create location. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ name, address: { city, country }, timezone }\`. Enforced by \`createLocationSchema\`.
* \`GET /api/locations/:id\`: Get location by ID. Roles: All.
* \`PUT /api/locations/:id\`: Update location. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* \`DELETE /api/locations/:id\`: Archive location. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
#### 9. Work Shift Submodule (\`/api/shifts\`)
* \`GET /api/shifts\`: List shifts. Roles: All. Query: \`page\`, \`limit\`.
* \`POST /api/shifts\`: Create work shift. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ name, startTime: "09:00", endTime: "18:00", workingDays: [] }\`. Enforced by \`createShiftSchema\`.
* \`GET /api/shifts/:id\`: Get shift by ID. Roles: All.
* \`PUT /api/shifts/:id\`: Update shift. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* \`DELETE /api/shifts/:id\`: Archive shift. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
#### 10. Holiday Calendar Submodule (\`/api/holidays\`)
* \`GET /api/holidays\`: List holidays. Roles: All. Query: \`year\`, \`page\`, \`limit\`.
* \`POST /api/holidays\`: Add holiday. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ name, date: "2027-01-01", type: "Public" }\`. Enforced by \`createHolidaySchema\`.
* \`GET /api/holidays/:id\`: Get holiday by ID. Roles: All.
* \`PUT /api/holidays/:id\`: Update holiday. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* \`DELETE /api/holidays/:id\`: Remove holiday. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
---
### 5.3 Employee Management Module (\`/api/employees\`)
Managed by \`server/routes/employeeRoutes.js\` and \`server/controllers/employeeController.js\`.
#### 1. List Employees
* **Method:** \`GET\`
* **URL:** \`/api/employees\`
* **Purpose:** Retrieve paginated workforce directory with multi-field filtering.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`FINANCE\`, \`AUDITOR\`.
* **Query Params:** \`page\`, \`limit\`, \`department\`, \`designation\`, \`status\`, \`search\`.
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "data": [
      {
        "_id": "64b8f0111111111111111111",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@ewmp.local",
        "designation": { "_id": "...", "title": "Senior Engineer" },
        "department": { "_id": "...", "name": "Engineering" },
        "employmentStatus": "Active"
      }
    ],
    "meta": { "pagination": { "total": 45, "page": 1, "limit": 10, "totalPages": 5 } }
  }
  \`\`\`
#### 2. Create & Onboard Employee
* **Method:** \`POST\`
* **URL:** \`/api/employees\`
* **Purpose:** Onboard a new workforce employee, generating authentication credentials and HR profile.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* **Request Body:**
  \`\`\`json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@ewmp.local",
    "password": "Password@123",
    "gender": "Female",
    "dateOfBirth": "1992-05-15",
    "dateOfJoining": "2023-01-01",
    "role": "EMPLOYEE",
    "department": "64b8e0111111111111111111",
    "designation": "64b8e0222222222222222222",
    "workLocation": "64b8e0333333333333333333",
    "shift": "64b8e0444444444444444444",
    "employmentStatus": "Active",
    "employmentType": "Full-Time",
    "contactNumber": "+1-202-555-0144",
    "basicSalary": 65000
  }
  \`\`\`
* **Validation Rules:** Enforced by \`createEmployeeSchema\`: checks valid ObjectId references, email uniqueness, salary positiveness, and role valid enumeration.
#### 3. Get Employee Profile by ID
* **Method:** \`GET\`
* **URL:** \`/api/employees/:id\`
* **Purpose:** Retrieve full employee profile details, compensation structures, and organization mapping.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles (Employees can view their own profile or team peers).
* **Request Params:** \`id\` (Employee ObjectId).
#### 4. Update Employee Profile
* **Method:** \`PUT\`
* **URL:** \`/api/employees/:id\`
* **Purpose:** Modify employee personal information, department assignment, or compensation figures.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* **Request Body:** Partial or complete employee attribute payload. Enforced by \`updateEmployeeSchema\`.
#### 5. Archive Employee Profile
* **Method:** \`DELETE\`
* **URL:** \`/api/employees/:id\`
* **Purpose:** Soft-archive an employee record upon offboarding or termination.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
#### 6. Update Employment Status
* **Method:** \`PATCH\`
* **URL:** \`/api/employees/:id/status\`
* **Purpose:** Transition employee lifecycle state (e.g., Active -> Suspended -> Terminated -> Archived).
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* **Request Body:**
  \`\`\`json
  { "employmentStatus": "Terminated", "reason": "Voluntary resignation" }
  \`\`\`
* **Validation Rules:** Enforced by \`updateStatusSchema\`.
#### 7. Get Employee Career Timeline
* **Method:** \`GET\`
* **URL:** \`/api/employees/:id/timeline\`
* **Purpose:** Retrieve historical audit trail of employee role changes, promotions, salary revisions, and document verifications.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`.
#### 8. Upload / Update Profile Photo
* **Method:** \`PATCH\`
* **URL:** \`/api/employees/:id/photo\`
* **Purpose:** Upload and attach an avatar image file to the employee profile.
* **Authentication Required:** Yes.
* **Required Roles:** All Roles (User updating self or HR updating employee).
* **Request Format:** \`multipart/form-data\` with field \`file\` (\`image/jpeg\` or \`image/png\`, maximum 5MB).
#### 9. Employee Compliance Document Management
* \`GET /api/employees/:id/documents\`: List compliance documents uploaded for employee. Roles: All Roles.
* \`POST /api/employees/:id/documents\`: Upload compliance file. Roles: All Roles. \`multipart/form-data\` (\`file\`, \`documentType\`, \`title\`, max 10MB). Enforced by \`uploadDocumentSchema\`.
* \`PATCH /api/employees/:id/documents/:docId/verify\`: Verify or reject compliance document. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ status: "Verified", remarks: "All good" }\`. Enforced by \`verifyDocumentSchema\`.
* \`DELETE /api/employees/:id/documents/:docId\`: Remove compliance document. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
---
### 5.4 Attendance Management Module (\`/api/attendance\`)
Managed by \`server/routes/attendanceRoutes.js\` and \`server/controllers/attendanceController.js\`.
#### 1. Clock In
* **Method:** \`POST\`
* **URL:** \`/api/attendance/clock-in\`
* **Purpose:** Record daily work start timestamp and geospatial location coordinates.
* **Authentication Required:** Yes.
* **Required Roles:** \`EMPLOYEE\`, \`MANAGER\`, \`TEAM_LEAD\`.
* **Request Body:**
  \`\`\`json
  {
    "clockInLocation": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716]
    },
    "deviceId": "mobile-client-v1",
    "ipAddress": "192.168.1.100"
  }
  \`\`\`
* **Response Example (201 Created):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 201,
    "message": "Clocked in successfully",
    "data": {
      "_id": "64b8f0555555555555555555",
      "employee": "64b8f0111111111111111111",
      "date": "2026-07-07T00:00:00.000Z",
      "clockIn": "2026-07-07T09:01:12.000Z",
      "status": "Present"
    }
  }
  \`\`\`
* **Validation Rules:** Enforced by \`clockInSchema\`: valid GeoJSON Point coordinates required if geofencing is enabled.
#### 2. Clock Out
* **Method:** \`PATCH\`
* **URL:** \`/api/attendance/clock-out\`
* **Purpose:** Record work completion timestamp, compute net working hours, and determine overtime or deficit.
* **Authentication Required:** Yes.
* **Required Roles:** \`EMPLOYEE\`, \`MANAGER\`, \`TEAM_LEAD\`.
* **Request Body:**
  \`\`\`json
  {
    "clockOutLocation": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716]
    }
  }
  \`\`\`
* **Validation Rules:** Enforced by \`clockOutSchema\`.
#### 3. List Organization Attendance
* **Method:** \`GET\`
* **URL:** \`/api/attendance\`
* **Purpose:** Retrieve organization-wide attendance logs with date filtering and status breakdowns.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`FINANCE\`, \`AUDITOR\`.
* **Query Params:** \`page\`, \`limit\`, \`employeeId\`, \`startDate\`, \`endDate\`, \`status\`.
#### 4. Get My Attendance History
* **Method:** \`GET\`
* **URL:** \`/api/attendance/my\`
* **Purpose:** Fetch authenticated employee's personal attendance logs and monthly summaries.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Query Params:** \`page\`, \`limit\`, \`month\`, \`year\`.
#### 5. Get Attendance Record by ID
* **Method:** \`GET\`
* **URL:** \`/api/attendance/:id\`
* **Purpose:** Inspect detailed punch logs, coordinates, and device IDs for a specific attendance entry.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`AUDITOR\`.
#### 6. Request Attendance Correction
* **Method:** \`POST\`
* **URL:** \`/api/attendance/:id/correction\`
* **Purpose:** Submit a regularized punch request when an employee misses a clock-in or clock-out punch.
* **Authentication Required:** Yes.
* **Required Roles:** \`EMPLOYEE\`, \`MANAGER\`, \`TEAM_LEAD\`.
* **Request Body:**
  \`\`\`json
  {
    "type": "ClockOut",
    "suggestedTime": "2026-07-06T18:00:00.000Z",
    "reason": "System connectivity failure during departure"
  }
  \`\`\`
* **Validation Rules:** Enforced by \`correctionRequestSchema\`.
#### 7. Approve / Reject Correction Request
* **Method:** \`PATCH\`
* **URL:** \`/api/attendance/:id/correction/approve\`
* **Purpose:** Authorize or deny a pending attendance regularization request.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`.
* **Request Body:**
  \`\`\`json
  { "status": "Approved", "adminRemarks": "Verified with security gate logs" }
  \`\`\`
* **Validation Rules:** Enforced by \`correctionApproveSchema\`.
---
### 5.5 Leave Management Module
Managed by \`server/routes/leaveRoutes.js\` and \`server/controllers/leaveController.js\`.
#### 1. Leave Types Submodule (\`/api/leave-types\`)
* \`GET /api/leave-types\`: List available leave categories (e.g., Sick Leave, Annual Leave, Maternity). Roles: All. Query: \`page\`, \`limit\`.
* \`POST /api/leave-types\`: Create leave category. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ name: "Sick Leave", code: "SL", description: "Illness", daysPerYear: 10, isPaid: true }\`. Enforced by \`createLeaveTypeSchema\`.
* \`GET /api/leave-types/:id\`: Get leave type by ID. Roles: All.
* \`PUT /api/leave-types/:id\`: Update leave type definitions. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Enforced by \`updateLeaveTypeSchema\`.
* \`DELETE /api/leave-types/:id\`: Archive leave type. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
#### 2. Leave Balances Submodule (\`/api/leave-balances\`)
* \`GET /api/leave-balances/my\`: Retrieve authenticated user's current leave quotas, taken days, and remaining balances for the fiscal year. Roles: All. Query: \`year\`.
* \`GET /api/leave-balances\`: List leave balance allocations across all employees. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`. Query: \`page\`, \`limit\`, \`employeeId\`, \`year\`.
#### 3. Leave Requests Submodule (\`/api/leave-requests\`)
* \`GET /api/leave-requests/my\`: List authenticated user's submitted leave applications. Roles: All. Query: \`page\`, \`limit\`, \`status\`.
* \`GET /api/leave-requests\`: List organization-wide leave applications for managerial review. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`FINANCE\`, \`AUDITOR\`. Query: \`page\`, \`limit\`, \`employeeId\`, \`status\`, \`leaveType\`.
* \`POST /api/leave-requests\`: Apply for leave. Roles: All. Body: \`{ leaveType: "64b8f0...", startDate: "2026-08-01", endDate: "2026-08-05", reason: "Family vacation" }\`. Enforced by \`submitLeaveRequestSchema\`.
* \`GET /api/leave-requests/:id\`: Inspect leave request details and workflow approval history. Roles: All.
* \`PATCH /api/leave-requests/:id/approve\`: Authorize leave application and deduct balance. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`. Body: \`{ status: "Approved", adminRemarks: "Enjoy your leave" }\`. Enforced by \`approveLeaveRequestSchema\`.
* \`PATCH /api/leave-requests/:id/reject\`: Deny leave application. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`. Body: \`{ status: "Rejected", adminRemarks: "Critical project deadline during period" }\`. Enforced by \`rejectLeaveRequestSchema\`.
* \`PATCH /api/leave-requests/:id/cancel\`: Cancel pending application or revoke approved leave. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`. Body: \`{ reason: "Plans changed" }\`. Enforced by \`cancelLeaveRequestSchema\`.
---
### 5.6 Payroll Management Module
Managed by \`server/routes/payrollRoutes.js\`, \`server/routes/payslipRoutes.js\`, and \`server/controllers/payrollController.js\`.
#### 1. Process Monthly Payroll Run
* **Method:** \`POST\`
* **URL:** \`/api/payroll/process\`
* **Purpose:** Execute automated payroll computation engine for a specified month/year. Aggregates active employee basic salaries, attendance deductions, leave without pay (LOP), and statutory allowances into immutable payroll structures.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`FINANCE\`.
* **Request Body:**
  \`\`\`json
  {
    "month": 7,
    "year": 2026,
    "type": "Regular"
  }
  \`\`\`
* **Response Example (201 Created):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 201,
    "message": "Payroll run processed successfully",
    "data": {
      "_id": "64b8f0666666666666666666",
      "month": 7,
      "year": 2026,
      "totalEmployees": 45,
      "totalNetDisbursement": 2925000,
      "status": "Processed"
    }
  }
  \`\`\`
* **Validation Rules:** Enforced by \`processPayrollSchema\`: \`month\` must be 1-12; \`year\` must be valid 4-digit fiscal year.
#### 2. Get My Payroll Runs
* **Method:** \`GET\`
* **URL:** \`/api/payroll/my\`
* **Purpose:** List payroll cycles associated with the authenticated employee.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Query Params:** \`page\`, \`limit\`, \`year\`.
#### 3. List Organization Payroll Runs
* **Method:** \`GET\`
* **URL:** \`/api/payroll\`
* **Purpose:** Retrieve historical payroll batches and executive summary figures across periods.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`FINANCE\`, \`AUDITOR\`.
* **Query Params:** \`page\`, \`limit\`, \`month\`, \`year\`, \`status\`.
#### 4. Get Payroll Run by ID
* **Method:** \`GET\`
* **URL:** \`/api/payroll/:id\`
* **Purpose:** Fetch detailed breakdown of a specific monthly payroll batch.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`HR_MANAGER\`, \`FINANCE\`, \`EMPLOYEE\`, \`AUDITOR\`.
#### 5. Approve Payroll Run
* **Method:** \`PATCH\`
* **URL:** \`/api/payroll/:id/approve\`
* **Purpose:** Authorize and lock processed payroll batch, enabling payslip generation and banking disbursement.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`FINANCE\`.
#### 6. Mark Payroll as Paid / Disbursed
* **Method:** \`PATCH\`
* **URL:** \`/api/payroll/:id/mark-paid\`
* **Purpose:** Record banking transaction completion timestamp and reference numbers against payroll run.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`FINANCE\`.
* **Request Body:**
  \`\`\`json
  { "paymentDate": "2026-07-30", "paymentReference": "WIRE-202607-00192" }
  \`\`\`
#### 7. Payslip Submodule (\`/api/payslips\`)
* \`GET /api/payslips/my\`: Retrieve paginated list of personal monthly payslip earnings, allowances, and tax deductions. Roles: All Roles. Query: \`page\`, \`limit\`, \`year\`.
* \`GET /api/payslips/:id\`: Download or view comprehensive itemized breakdown of a specific monthly payslip by ID. Roles: \`SUPER_ADMIN\`, \`HR_MANAGER\`, \`FINANCE\`, \`EMPLOYEE\`, \`AUDITOR\`.
---
### 5.7 Project Management Module (\`/api/projects\`)
Managed by \`server/routes/projectRoutes.js\` and \`server/controllers/projectController.js\`.
#### 1. List Projects
* **Method:** \`GET\`
* **URL:** \`/api/projects\`
* **Purpose:** Retrieve directory of corporate projects with status and priority filtering.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`, \`AUDITOR\`.
* **Query Params:** \`page\`, \`limit\`, \`status\`, \`priority\`, \`search\`.
#### 2. Create Project
* **Method:** \`POST\`
* **URL:** \`/api/projects\`
* **Purpose:** Initialize a new corporate project and allocate team members.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`.
* **Request Body:**
  \`\`\`json
  {
    "name": "EWMP Implementation",
    "description": "Rollout of new HRMS platform across enterprise",
    "clientName": "Internal Operations",
    "startDate": "2026-07-01",
    "endDate": "2026-12-31",
    "status": "Planning",
    "priority": "High",
    "budget": 100000,
    "teamMembers": ["64b8f0111111111111111111"]
  }
  \`\`\`
* **Validation Rules:** Enforced by \`createProjectSchema\`.
#### 3. Get Project by ID
* **Method:** \`GET\`
* **URL:** \`/api/projects/:id\`
* **Purpose:** Retrieve comprehensive project profile, budget utilization, and assigned team members.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles (Excluding IT_ADMIN).
#### 4. Update Project Specifications
* **Method:** \`PUT\`
* **URL:** \`/api/projects/:id\`
* **Purpose:** Modify project scope, dates, budgets, or team member allocations.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`.
* **Validation Rules:** Enforced by \`updateProjectSchema\`.
#### 5. Update Project Lifecycle Status
* **Method:** \`PATCH\`
* **URL:** \`/api/projects/:id/status\`
* **Purpose:** Transition project phase (e.g., Planning -> Active -> OnHold -> Completed -> Cancelled).
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`.
* **Request Body:**
  \`\`\`json
  { "status": "Active" }
  \`\`\`
* **Validation Rules:** Enforced by \`updateStatusSchema\`.
#### 6. Archive / Delete Project
* **Method:** \`DELETE\`
* **URL:** \`/api/projects/:id\`
* **Purpose:** Remove project from active operational dashboards.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`.
---
### 5.8 Task Management Module (\`/api/tasks\`)
Managed by \`server/routes/taskRoutes.js\` and \`server/controllers/taskController.js\`.
#### 1. Get My Assigned Tasks
* **Method:** \`GET\`
* **URL:** \`/api/tasks/my\`
* **Purpose:** Retrieve personal task list assigned to the authenticated user.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Query Params:** \`page\`, \`limit\`, \`status\`, \`priority\`.
#### 2. List All Project Tasks
* **Method:** \`GET\`
* **URL:** \`/api/tasks\`
* **Purpose:** Search and filter tasks across project teams and assignees.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`, \`AUDITOR\`.
* **Query Params:** \`page\`, \`limit\`, \`project\`, \`assignee\`, \`status\`.
#### 3. Create Task
* **Method:** \`POST\`
* **URL:** \`/api/tasks\`
* **Purpose:** Assign a new task deliverable within an active project.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`, \`TEAM_LEAD\`.
* **Request Body:**
  \`\`\`json
  {
    "title": "Configure MongoDB Replica Set",
    "description": "Set up 3-node replica set with automated backups",
    "project": "64b8f0777777777777777777",
    "assignee": "64b8f0111111111111111111",
    "priority": "High",
    "status": "Todo",
    "dueDate": "2026-07-15"
  }
  \`\`\`
* **Validation Rules:** Enforced by \`createTaskSchema\`.
#### 4. Get Task by ID
* **Method:** \`GET\`
* **URL:** \`/api/tasks/:id\`
* **Purpose:** Retrieve task details, activity logs, and discussion comments.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles (Excluding IT_ADMIN).
#### 5. Update Task Specifications
* **Method:** \`PUT\`
* **URL:** \`/api/tasks/:id\`
* **Purpose:** Modify task description, due dates, priority, or reassign to another employee.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`.
* **Validation Rules:** Enforced by \`updateTaskSchema\`.
#### 6. Transition Task Status
* **Method:** \`PATCH\`
* **URL:** \`/api/tasks/:id/status\`
* **Purpose:** Move task across agile board columns (\`Todo\` -> \`InProgress\` -> \`Review\` -> \`Completed\`).
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`.
* **Request Body:**
  \`\`\`json
  { "status": "InProgress" }
  \`\`\`
* **Validation Rules:** Enforced by \`updateTaskStatusSchema\`.
#### 7. Add Task Discussion Comment
* **Method:** \`POST\`
* **URL:** \`/api/tasks/:id/comments\`
* **Purpose:** Post progress update or collaboration note on task thread.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`.
* **Request Body:**
  \`\`\`json
  { "comment": "Database deployment completed on staging server." }
  \`\`\`
* **Validation Rules:** Enforced by \`addCommentSchema\`.
#### 8. Delete Task
* **Method:** \`DELETE\`
* **URL:** \`/api/tasks/:id\`
* **Purpose:** Remove task from project board.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`, \`TEAM_LEAD\`.
---
### 5.9 Asset Management Module
Managed by \`server/routes/assetRoutes.js\`, \`server/routes/assetAllocationRoutes.js\`, and \`server/controllers/assetController.js\`.
#### 1. Get My Allocated Assets
* **Method:** \`GET\`
* **URL:** \`/api/assets/my\`
* **Purpose:** List IT equipment (laptops, monitors, access cards) currently allocated to authenticated employee.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
#### 2. List Inventory Assets
* **Method:** \`GET\`
* **URL:** \`/api/assets\`
* **Purpose:** Search enterprise asset inventory with category and condition filtering.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`, \`AUDITOR\`.
* **Query Params:** \`page\`, \`limit\`, \`type\`, \`status\`, \`search\`.
#### 3. Register New Inventory Asset
* **Method:** \`POST\`
* **URL:** \`/api/assets\`
* **Purpose:** Add new IT equipment or capital hardware into corporate asset database.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* **Request Body:**
  \`\`\`json
  {
    "name": "MacBook Pro 16-inch M3 Max",
    "type": "Laptop",
    "serialNumber": "MBP-2026-998877",
    "purchaseDate": "2026-01-10",
    "cost": 3200,
    "status": "Available"
  }
  \`\`\`
* **Validation Rules:** Enforced by \`createAssetSchema\`.
#### 4. Get Asset Details by ID
* **Method:** \`GET\`
* **URL:** \`/api/assets/:id\`
* **Purpose:** Retrieve hardware specifications, warranty dates, and allocation history of an asset.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`, \`AUDITOR\`.
#### 5. Update Asset Specifications
* **Method:** \`PUT\`
* **URL:** \`/api/assets/:id\`
* **Purpose:** Update asset hardware status, valuation cost, or repair notes.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* **Validation Rules:** Enforced by \`updateAssetSchema\`.
#### 6. Allocate Asset to Employee
* **Method:** \`POST\`
* **URL:** \`/api/assets/:id/allocate\`
* **Purpose:** Assign hardware asset to an active employee and create allocation custody record.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* **Request Body:**
  \`\`\`json
  {
    "employee": "64b8f0111111111111111111",
    "allocationDate": "2026-07-07",
    "condition": "New - Factory Sealed"
  }
  \`\`\`
* **Validation Rules:** Enforced by \`allocateAssetSchema\`.
#### 7. Remove Asset from Inventory
* **Method:** \`DELETE\`
* **URL:** \`/api/assets/:id\`
* **Purpose:** Retire or write-off damaged/obsolete asset from inventory.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
#### 8. Asset Allocations Submodule (\`/api/asset-allocations\`)
* \`GET /api/asset-allocations\`: Retrieve historical log of all asset allocations and returns. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`AUDITOR\`. Query: \`page\`, \`limit\`, \`asset\`, \`employee\`.
* \`PATCH /api/asset-allocations/:id/return\`: Record return of custody for an allocated asset. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ returnDate: "2026-07-30", conditionOnReturn: "Good", remarks: "No damage" }\`. Enforced by \`returnAssetSchema\`.
---
### 5.10 Document Management Module (\`/api/documents\`)
Managed by \`server/routes/documentRoutes.js\` and \`server/controllers/documentController.js\`.
#### 1. Search Enterprise Documents
* **Method:** \`GET\`
* **URL:** \`/api/documents\`
* **Purpose:** Retrieve corporate policies, handbooks, and employee records with type and keyword filtering.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`, \`AUDITOR\`.
* **Query Params:** \`page\`, \`limit\`, \`documentType\`, \`search\`.
#### 2. Upload Corporate Document
* **Method:** \`POST\`
* **URL:** \`/api/documents\`
* **Purpose:** Upload new policy document or HR attachment into secure object storage.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`.
* **Request Format:** \`multipart/form-data\` with file payload (\`file\`, max 10MB) and body attributes \`{ title, documentType, employee }\`.
* **Validation Rules:** Enforced by \`uploadDocumentSchema\`.
#### 3. Get Document Details by ID
* **Method:** \`GET\`
* **URL:** \`/api/documents/:id\`
* **Purpose:** Retrieve document metadata and secure download URL.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`, \`AUDITOR\`.
#### 4. Replace Document Content
* **Method:** \`PUT\`
* **URL:** \`/api/documents/:id/replace\`
* **Purpose:** Replace underlying binary file of an existing document while preserving metadata ID.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`.
* **Request Format:** \`multipart/form-data\` (\`file\`).
#### 5. Update Document Metadata
* **Method:** \`PATCH\`
* **URL:** \`/api/documents/:id\`
* **Purpose:** Update document title, categorization type, or visibility scopes.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`.
* **Request Body:** \`{ title, documentType }\`. Enforced by \`updateDocumentSchema\`.
#### 6. Soft Delete Document
* **Method:** \`DELETE\`
* **URL:** \`/api/documents/:id\`
* **Purpose:** Mark document as deleted without permanent physical purging.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`.
#### 7. Restore Soft-Deleted Document
* **Method:** \`POST\`
* **URL:** \`/api/documents/:id/restore\`
* **Purpose:** Recover an accidentally archived document back into active circulation.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`.
#### 8. Permanently Purge Document
* **Method:** \`DELETE\`
* **URL:** \`/api/documents/:id/permanent\`
* **Purpose:** Irreversibly delete document metadata and destroy underlying cloud file storage.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`.
---
### 5.11 Notifications & Announcements Module
Managed by \`server/routes/notificationRoutes.js\` and \`server/controllers/notificationController.js\`. Mounted at both \`/api/notifications\` and \`/api/announcements\`.
#### 1. Get My Notification Inbox
* **Method:** \`GET\`
* **URL:** \`/api/notifications\`
* **Purpose:** Retrieve personal unread/read notification alerts for the authenticated user.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Query Params:** \`page\`, \`limit\`, \`isRead\`.
#### 2. Get Organization Notification Feed
* **Method:** \`GET\`
* **URL:** \`/api/notifications/org\`
* **Purpose:** Administrative audit feed of all system alerts dispatched across tenant organization.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`.
#### 3. Get Public Announcements
* **Method:** \`GET\`
* **URL:** \`/api/notifications/announcements\` (Also \`/api/announcements\`)
* **Purpose:** Retrieve organization-wide broadcast bulletins and holiday notices.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
#### 4. Send Targeted Notification
* **Method:** \`POST\`
* **URL:** \`/api/notifications/send\`
* **Purpose:** Dispatch specific system alert to an individual employee or department group.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`.
* **Request Body:**
  \`\`\`json
  {
    "recipientId": "64b8f0111111111111111111",
    "title": "Attendance Regularization Approved",
    "content": "Your correction request for July 6th has been approved by your manager.",
    "priority": "Normal",
    "type": "Attendance"
  }
  \`\`\`
* **Validation Rules:** Enforced by \`sendNotificationSchema\`.
#### 5. Broadcast Announcement Bulletin
* **Method:** \`POST\`
* **URL:** \`/api/notifications/broadcast\` (Also \`/api/announcements/broadcast\`)
* **Purpose:** Publish enterprise-wide broadcast bulletin to all active employees.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
* **Request Body:**
  \`\`\`json
  {
    "title": "Annual Company Townhall 2026",
    "content": "Join us this Friday at 3 PM UTC for our Q3 strategic updates.",
    "priority": "High"
  }
  \`\`\`
* **Validation Rules:** Enforced by \`broadcastNotificationSchema\`.
#### 6. Mark Notification as Read
* **Method:** \`PATCH\`
* **URL:** \`/api/notifications/:id/read\`
* **Purpose:** Acknowledge specific alert and transition status to read.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
#### 7. Mark All Notifications as Read
* **Method:** \`POST\`
* **URL:** \`/api/notifications/read-all\`
* **Purpose:** Bulk acknowledge all pending unread alerts in user inbox.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
#### 8. Bulk Delete Notifications
* **Method:** \`POST\`
* **URL:** \`/api/notifications/bulk-delete\`
* **Purpose:** Bulk purge selected alerts from personal inbox.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Body:**
  \`\`\`json
  { "notificationIds": ["64b8f0888888888888888888", "64b8f0999999999999999999"] }
  \`\`\`
* **Validation Rules:** Enforced by \`bulkDeleteSchema\`.
#### 9. Delete Individual Notification
* **Method:** \`DELETE\`
* **URL:** \`/api/notifications/:id\`
* **Purpose:** Remove single notification from inbox.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
#### 10. Get Notification Preferences
* **Method:** \`GET\`
* **URL:** \`/api/notifications/preferences\`
* **Purpose:** Retrieve user preferences regarding email vs in-app alert delivery channels.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
---
### 5.12 Help Desk Module (\`/api/tickets\`)
Managed by \`server/routes/helpdeskRoutes.js\` and \`server/controllers/helpDeskController.js\`.
#### 1. Get My Help Desk Tickets
* **Method:** \`GET\`
* **URL:** \`/api/tickets/my\`
* **Purpose:** List IT and HR support tickets raised by the currently authenticated user.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Query Params:** \`page\`, \`limit\`, \`status\`.
#### 2. Search Organization Tickets
* **Method:** \`GET\`
* **URL:** \`/api/tickets\`
* **Purpose:** Retrieve administrative queue of support tickets across departments.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`, \`AUDITOR\`.
* **Query Params:** \`page\`, \`limit\`, \`category\`, \`status\`, \`priority\`, \`search\`.
* **Validation Rules:** Enforced by \`searchTicketSchema\`.
#### 3. Raise Support Ticket
* **Method:** \`POST\`
* **URL:** \`/api/tickets\`
* **Purpose:** Submit a new IT hardware or HR policy assistance request.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`.
* **Request Body:**
  \`\`\`json
  {
    "title": "VPN access failure after OS update",
    "description": "Unable to connect to enterprise gateway from remote laptop.",
    "category": "IT",
    "priority": "High"
  }
  \`\`\`
* **Validation Rules:** Enforced by \`createTicketSchema\`.
#### 4. Get Ticket Thread by ID
* **Method:** \`GET\`
* **URL:** \`/api/tickets/:id\`
* **Purpose:** Retrieve ticket metadata, assignment status, and chronological comment discussion thread.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`, \`AUDITOR\`.
#### 5. Update Ticket Details
* **Method:** \`PUT\`
* **URL:** \`/api/tickets/:id\`
* **Purpose:** Modify ticket title, category, or priority level.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`.
* **Validation Rules:** Enforced by \`updateTicketSchema\`.
#### 6. Assign Ticket to Support Staff
* **Method:** \`PATCH\`
* **URL:** \`/api/tickets/:id/assign\`
* **Purpose:** Allocate ticket resolution responsibility to a specific IT or HR administrator.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`.
* **Request Body:**
  \`\`\`json
  { "assignedTo": "64b8f0111111111111111111" }
  \`\`\`
* **Validation Rules:** Enforced by \`assignTicketSchema\`.
#### 7. Transition Ticket Status
* **Method:** \`PATCH\`
* **URL:** \`/api/tickets/:id/status\`
* **Purpose:** Advance ticket lifecycle stage (\`Open\` -> \`InProgress\` -> \`Resolved\` -> \`Closed\`).
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`.
* **Request Body:**
  \`\`\`json
  { "status": "Resolved", "resolutionNotes": "Reinstalled Cisco AnyConnect client and reset SSL certificates." }
  \`\`\`
* **Validation Rules:** Enforced by \`changeStatusSchema\`.
#### 8. Post Comment to Ticket Thread
* **Method:** \`POST\`
* **URL:** \`/api/tickets/:id/comments\`
* **Purpose:** Append diagnostic reply or clarification message to ticket discussion.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`.
* **Request Body:**
  \`\`\`json
  { "comment": "Please verify if the gateway port 443 is open on your home router." }
  \`\`\`
* **Validation Rules:** Enforced by \`addCommentSchema\`.
#### 9. Delete Ticket
* **Method:** \`DELETE\`
* **URL:** \`/api/tickets/:id\`
* **Purpose:** Remove invalid or duplicate support ticket.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
---
### 5.13 Reports & Analytics Dashboard Module
Managed by \`server/routes/reportRoutes.js\` and \`server/controllers/reportController.js\`. Mounted at \`/api/dashboard\` and \`/api/reports\`.
#### 1. Executive Leadership Dashboard (\`/api/dashboard/executive\`)
* **Method:** \`GET\`
* **URL:** \`/api/dashboard/executive\`
* **Purpose:** Deliver C-suite KPI metrics including headcount growth, total payroll liabilities, attrition rates, and attendance compliance.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`AUDITOR\`.
#### 2. HR Operational Dashboard (\`/api/dashboard/hr\`)
* **Method:** \`GET\`
* **URL:** \`/api/dashboard/hr\`
* **Purpose:** Deliver HR metrics including open recruitment requisitions, pending leave applications, document verification queues, and daily absenteeism.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`.
#### 3. Manager Team Dashboard (\`/api/dashboard/manager\`)
* **Method:** \`GET\`
* **URL:** \`/api/dashboard/manager\`
* **Purpose:** Deliver managerial metrics including team attendance presence, pending task deliverables, project sprint progress, and team leave schedules.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`.
#### 4. Self-Service Employee Dashboard (\`/api/dashboard/employee\`)
* **Method:** \`GET\`
* **URL:** \`/api/dashboard/employee\`
* **Purpose:** Deliver personal employee metrics including remaining leave balances, current month punch logs, assigned open tasks, and latest payslip summary.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`.
#### 5. Generate Attendance Compliance Report (\`/api/reports/attendance\`)
* **Method:** \`GET\`
* **URL:** \`/api/reports/attendance\`
* **Purpose:** Synthesize multi-department attendance compliance, late punch frequencies, and overtime hours across date ranges.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\`.
* **Query Params:** \`startDate\`, \`endDate\`, \`departmentId\`. Enforced by \`dateRangeSchema\`.
#### 6. Generate Leave Liability Report (\`/api/reports/leave\`)
* **Method:** \`GET\`
* **URL:** \`/api/reports/leave\`
* **Purpose:** Calculate organization leave utilization trends, absenteeism patterns, and fiscal year financial leave encashment liabilities.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\`.
* **Query Params:** \`startDate\`, \`endDate\`, \`departmentId\`. Enforced by \`dateRangeSchema\`.
#### 7. Generate Payroll Disbursement Report (\`/api/reports/payroll\`)
* **Method:** \`GET\`
* **URL:** \`/api/reports/payroll\`
* **Purpose:** Assemble executive summary of gross salary expenses, tax withholdings, net banking disbursements, and department cost allocations.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`.
* **Query Params:** \`startDate\`, \`endDate\`, \`month\`, \`year\`. Enforced by \`dateRangeSchema\`.
#### 8. Generate Project Variance Report (\`/api/reports/projects\`)
* **Method:** \`GET\`
* **URL:** \`/api/reports/projects\`
* **Purpose:** Analyze project milestone completion velocity, budget burn rates, and resource utilization efficiency.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\`.
* **Query Params:** \`startDate\`, \`endDate\`, \`status\`. Enforced by \`dateRangeSchema\`.
#### 9. Generate Task Productivity Report (\`/api/reports/tasks\`)
* **Method:** \`GET\`
* **URL:** \`/api/reports/tasks\`
* **Purpose:** Track employee sprint velocity, overdue task ratios, and project deliverable completion timelines.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\`.
* **Query Params:** \`startDate\`, \`endDate\`, \`projectId\`. Enforced by \`dateRangeSchema\`.
#### 10. Generate Help Desk SLA Report (\`/api/reports/helpdesk\`)
* **Method:** \`GET\`
* **URL:** \`/api/reports/helpdesk\`
* **Purpose:** Measure IT and HR support SLA compliance, mean time to resolution (MTTR), and ticket volume distribution by category.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\`.
* **Query Params:** \`startDate\`, \`endDate\`, \`category\`. Enforced by \`dateRangeSchema\`.
#### 11. Generate Asset Inventory Report (\`/api/reports/assets\`)
* **Method:** \`GET\`
* **URL:** \`/api/reports/assets\`
* **Purpose:** Audit enterprise hardware asset valuation, depreciation figures, unallocated equipment ratios, and repair histories.
* **Authentication Required:** Yes.
* **Required Roles:** \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\`.
* **Query Params:** \`startDate\`, \`endDate\`, \`type\`. Enforced by \`dateRangeSchema\`.
---
### 5.14 Performance Management Module (\`/api/performance\`)
Managed by \`server/routes/performanceRoutes.js\` and \`server/controllers/performanceController.js\`.
#### 1. Performance Goals Submodule (\`/api/performance/goals\`)
* \`GET /api/performance/goals\`: Search performance goals and KPIs. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`. Query: \`page\`, \`limit\`, \`employeeId\`, \`reviewPeriod\`, \`status\`. Enforced by \`searchGoalSchema\`.
* \`POST /api/performance/goals\`: Create employee performance goal. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`. Body: \`{ title: "Ship V1 Release", description: "Deliver core HR modules", targetDate: "2026-09-30", weightage: 50, reviewPeriod: "Q3 2026", employee: "64b8f011..." }\`. Enforced by \`createGoalSchema\`.
* \`PATCH /api/performance/goals/:id/progress\`: Update completion percentage on a goal. Roles: All Roles. Body: \`{ progress: 75, status: "InProgress" }\`. Enforced by \`updateGoalProgressSchema\`.
* \`PATCH /api/performance/goals/:id/evaluate\`: Evaluate goal and assign achievement score. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`. Body: \`{ score: 90, managerComments: "Exceeded performance targets" }\`. Enforced by \`evaluateGoalSchema\`.
* \`DELETE /api/performance/goals/:id\`: Delete performance goal. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`.
#### 2. Performance Reviews Submodule (\`/api/performance/reviews\`)
* \`GET /api/performance/reviews\`: Search formal appraisal review records. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`. Query: \`page\`, \`limit\`, \`employee\`, \`reviewer\`, \`reviewPeriod\`, \`status\`. Enforced by \`searchReviewSchema\`.
* \`GET /api/performance/reviews/:id\`: Get detailed appraisal ratings and feedback by ID. Roles: All Roles.
* \`POST /api/performance/reviews\`: Initiate formal performance appraisal cycle. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`. Body: \`{ employee: "64b8f011...", reviewer: "64b8f022...", reviewPeriod: "Q2 2026", goals: [{ title: "Ship V1", weightage: 100 }] }\`. Enforced by \`createReviewSchema\`.
* \`PATCH /api/performance/reviews/:id/self-assessment\`: Submit employee self-appraisal ratings and narrative comments. Roles: \`EMPLOYEE\`, \`MANAGER\`, \`TEAM_LEAD\`. Body: \`{ selfRatings: [{ goalId: "...", rating: 4 }], selfComments: "Delivered all features ahead of schedule." }\`. Enforced by \`selfAssessmentSchema\`.
* \`PATCH /api/performance/reviews/:id/manager-assessment\`: Submit managerial evaluation ratings and promotion recommendations. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`. Body: \`{ managerRatings: [{ goalId: "...", rating: 5 }], managerComments: "Outstanding leadership", recommendedPromotion: true }\`. Enforced by \`managerAssessmentSchema\`.
* \`PATCH /api/performance/reviews/:id/finalize\`: Finalize and lock appraisal review by HR/Admin. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ finalScore: 92.5, finalRating: "Exceeds Expectations", hrComments: "Approved for annual bonus", status: "Completed" }\`. Enforced by \`hrAssessmentSchema\`.
* \`DELETE /api/performance/reviews/:id\`: Delete appraisal review record. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
---
### 5.15 Recruitment Module (\`/api/recruitment\`)
Managed by \`server/routes/recruitmentRoutes.js\` and \`server/controllers/recruitmentController.js\`.
#### 1. Job Requisition Submodule (\`/api/recruitment/jobs\`)
* \`GET /api/recruitment/jobs\`: Search open job postings. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`. Query: \`page\`, \`limit\`, \`department\`, \`location\`, \`status\`. Enforced by \`searchJobSchema\`.
* \`POST /api/recruitment/jobs\`: Publish new job requisition. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ title: "Senior Frontend Developer", department: "64b8e011...", location: "64b8e033...", type: "Full-Time", experience: "5-8 years", requirements: "React, TypeScript, Next.js", description: "Lead frontend architecture" }\`. Enforced by \`createJobSchema\`.
* \`PUT /api/recruitment/jobs/:id\`: Update job posting specifications or close vacancy. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Enforced by \`updateJobSchema\`.
* \`DELETE /api/recruitment/jobs/:id\`: Archive job posting. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`.
#### 2. Candidate Applicant Submodule (\`/api/recruitment/candidates\`)
* \`GET /api/recruitment/candidates\`: Search applicant tracking system (ATS) database. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`. Query: \`page\`, \`limit\`, \`job\`, \`status\`, \`search\`. Enforced by \`searchCandidateSchema\`.
* \`POST /api/recruitment/candidates\`: Submit candidate application and resume link. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ job: "64b8f0...", firstName: "Alice", lastName: "Wonder", email: "alice@example.com", phone: "+1-555-0199", resumeUrl: "https://storage.ewmp.local/resumes/alice.pdf" }\`. Enforced by \`createCandidateSchema\`.
* \`PATCH /api/recruitment/candidates/:id/status\`: Transition candidate hiring pipeline stage (\`Applied\` -> \`Screened\` -> \`Interviewing\` -> \`Offered\` -> \`Hired\` -> \`Rejected\`). Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ status: "Interviewing" }\`. Enforced by \`changeCandidateStatusSchema\`.
#### 3. Interview Scheduling Submodule (\`/api/recruitment/interviews\`)
* \`GET /api/recruitment/candidates/:id/interviews\`: List all interview rounds scheduled for a candidate. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`.
* \`POST /api/recruitment/interviews\`: Schedule an interview session. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`. Body: \`{ candidate: "64b8f0...", job: "64b8f0...", interviewer: "64b8f011...", scheduledTime: "2026-07-15T14:00:00.000Z", mode: "Video", locationOrLink: "https://meet.ewmp.local/int-123" }\`. Enforced by \`scheduleInterviewSchema\`.
* \`PATCH /api/recruitment/interviews/:id/feedback\`: Submit interviewer evaluation score and hiring recommendation. Roles: \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`. Body: \`{ rating: 5, feedback: "Strong technical communication and architecture skills", recommendation: "Hire" }\`. Enforced by \`interviewFeedbackSchema\`.
---
### 5.16 AI Assistant Module (\`/api/ai\`)
Managed by \`server/ai/routes/aiRoutes.js\`, \`server/controllers/aiController.js\`, and \`server/ai/security/securityMiddleware.js\`. Enforces automated prompt injection sanitization and NoSQL operator stripping.
#### 1. AI Pipeline Diagnostic Health Check
* **Method:** \`GET\`
* **URL:** \`/api/ai/health\`
* **Purpose:** Verify connectivity with Google Gemini LLM API endpoints and check AI service readiness.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "status": "Operational",
      "model": "gemini-1.5-pro",
      "latencyMs": 142,
      "pluginsRegistered": 12
    }
  }
  \`\`\`
#### 2. List Registered AI Capabilities & Plugins
* **Method:** \`GET\`
* **URL:** \`/api/ai/plugins\`
* **Purpose:** Enumerate active AI function calling tools available to the autonomous workflow engine.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "data": [
      { "name": "getEmployeeAttendance", "description": "Fetch attendance records for analysis", "module": "Attendance" },
      { "name": "calculatePayrollTax", "description": "Estimate tax withholding brackets", "module": "Payroll" }
    ]
  }
  \`\`\`
#### 3. AI Plugins Health Diagnostic
* **Method:** \`GET\`
* **URL:** \`/api/ai/plugins/health\`
* **Purpose:** Execute deep diagnostic checks across all registered AI plugin capability bindings.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
#### 4. Plan Autonomous AI Workflow
* **Method:** \`POST\`
* **URL:** \`/api/ai/workflow\`
* **Purpose:** Synthesize multi-step execution workflow from natural language intent using enterprise context.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Body:**
  \`\`\`json
  {
    "intent": "Audit Q2 attendance anomalies and generate warning notifications for chronic absenteeism",
    "context": { "departmentId": "64b8e0111111111111111111" }
  }
  \`\`\`
#### 5. Simulate AI Workflow (Dry-Run)
* **Method:** \`POST\`
* **URL:** \`/api/ai/workflow/simulate\`
* **Purpose:** Perform dry-run simulation of planned AI automation steps without committing state mutations to MongoDB.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Body:**
  \`\`\`json
  { "workflowId": "wf_202607_9988", "steps": ["query_attendance", "draft_warning"] }
  \`\`\`
#### 6. List Predefined AI Workflows
* **Method:** \`GET\`
* **URL:** \`/api/ai/workflows\`
* **Purpose:** Retrieve directory of saved enterprise AI automation workflows.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
#### 7. Get AI Workflow by ID
* **Method:** \`GET\`
* **URL:** \`/api/ai/workflows/:id\`
* **Purpose:** Fetch execution history, step definitions, and audit logs of a specific AI workflow.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
#### 8. Conversational AI Chat
* **Method:** \`POST\`
* **URL:** \`/api/ai/chat\`
* **Purpose:** Execute natural language query interaction with enterprise AI assistant. Enforces prompt injection filtering via \`validateAiRequest\`.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Body:**
  \`\`\`json
  {
    "message": "What is my remaining annual leave balance for 2026?",
    "conversationId": "64b8f0aa0000000000000001",
    "context": { "currentModule": "Leave" }
  }
  \`\`\`
* **Response Example (200 OK):**
  \`\`\`json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "response": "You currently have 12 days of Annual Leave and 5 days of Sick Leave remaining for the fiscal year 2026.",
      "conversationId": "64b8f0aa0000000000000001",
      "model": "gemini-1.5-pro"
    }
  }
  \`\`\`
* **Validation Rules:** Enforced by \`chatRequestSchema\`.
#### 9. Enterprise Data Summarization
* **Method:** \`POST\`
* **URL:** \`/api/ai/summarize\`
* **Purpose:** Synthesize concise executive summaries from verbose compliance documents, project logs, or performance appraisals.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Body:**
  \`\`\`json
  {
    "text": "Extensive 50-page corporate travel policy document text...",
    "type": "document"
  }
  \`\`\`
* **Validation Rules:** Enforced by \`summarizeRequestSchema\`.
#### 10. Generate Analytical Insights
* **Method:** \`POST\`
* **URL:** \`/api/ai/insights\`
* **Purpose:** Produce predictive analytics and trend insights from operational attendance, payroll, or task data.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Body:**
  \`\`\`json
  { "context": "Attendance records for Engineering department Q2 2026...", "module": "attendance" }
  \`\`\`
* **Validation Rules:** Enforced by \`insightsRequestSchema\`.
#### 11. Generate Managerial Recommendations
* **Method:** \`POST\`
* **URL:** \`/api/ai/recommendations\`
* **Purpose:** Deliver actionable managerial recommendations for employee retention, training allocation, or salary adjustments.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Body:**
  \`\`\`json
  { "context": "Employee performance review scores and task completion velocity...", "targetEmployeeId": "64b8f011..." }
  \`\`\`
* **Validation Rules:** Enforced by \`recommendationsRequestSchema\`.
#### 12. Construct Strategic Action Plan
* **Method:** \`POST\`
* **URL:** \`/api/ai/action-plan\`
* **Purpose:** Generate phased implementation roadmaps and milestone checklists for complex HR or IT initiatives.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Body:**
  \`\`\`json
  { "objective": "Transition enterprise team to hybrid 3-day work model", "constraints": ["Office seating capacity 50%"], "timeline": "30 days" }
  \`\`\`
* **Validation Rules:** Enforced by \`actionPlanRequestSchema\`.
#### 13. List AI Conversation History (Conversation & Memory APIs)
* **Method:** \`GET\`
* **URL:** \`/api/ai/history\`
* **Purpose:** Retrieve paginated directory of past AI conversation sessions and context memory summaries for the authenticated user.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Query Params:** \`page\`, \`limit\`.
#### 14. Get AI Conversation Session by ID
* **Method:** \`GET\`
* **URL:** \`/api/ai/history/:id\`
* **Purpose:** Retrieve complete dialogue history, tool execution traces, and context memory for a specific AI conversation session.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Params:** \`id\` (Conversation ObjectId).
#### 15. Delete AI Conversation Session
* **Method:** \`DELETE\`
* **URL:** \`/api/ai/history/:id\`
* **Purpose:** Permanently purge AI conversation dialogue and memory context from database storage.
* **Authentication Required:** Yes.
* **Required Roles:** All Authenticated Roles.
* **Request Params:** \`id\`.
---
## 6. RBAC Access Matrix
The following enterprise authorization matrix maps every implemented REST API endpoint to the specific enumerable user roles permitted by the route middleware pipeline.
| Endpoint Path | HTTP Method | Allowed Roles | Authority Module |
| :--- | :--- | :--- | :--- |
| \`/api/auth/login\` | \`POST\` | Public (All Roles) | Authentication |
| \`/api/auth/forgot-password\` | \`POST\` | Public (All Roles) | Authentication |
| \`/api/auth/reset-password/:token\` | \`POST\` | Public (All Roles) | Authentication |
| \`/api/auth/refresh\` | \`POST\` | Public (All Roles) | Authentication |
| \`/api/auth/logout\` | \`POST\` | All Authenticated Roles | Authentication |
| \`/api/auth/change-password\` | \`PUT\` | All Authenticated Roles | Authentication |
| \`/api/auth/me\` | \`GET\` | All Authenticated Roles | Authentication |
| \`/api/organizations/current\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/organizations/current\` | \`PUT\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Organization |
| \`/api/organizations/settings\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/organizations/settings\` | \`PUT\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Organization |
| \`/api/organizations/:id\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/organizations/:id\` | \`PUT\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Organization |
| \`/api/departments\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/departments\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/departments/:id\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/departments/:id\` | \`PUT\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/departments/:id\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Organization |
| \`/api/designations\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/designations\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/designations/:id\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/designations/:id\` | \`PUT\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/designations/:id\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Organization |
| \`/api/locations\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/locations\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/locations/:id\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/locations/:id\` | \`PUT\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/locations/:id\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Organization |
| \`/api/shifts\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/shifts\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/shifts/:id\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/shifts/:id\` | \`PUT\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/shifts/:id\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Organization |
| \`/api/holidays\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/holidays\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/holidays/:id\` | \`GET\` | All Authenticated Roles | Organization |
| \`/api/holidays/:id\` | \`PUT\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Organization |
| \`/api/holidays/:id\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Organization |
| \`/api/employees\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`FINANCE\`, \`AUDITOR\` | Employee |
| \`/api/employees\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Employee |
| \`/api/employees/:id\` | \`GET\` | All Authenticated Roles | Employee |
| \`/api/employees/:id\` | \`PUT\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Employee |
| \`/api/employees/:id\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Employee |
| \`/api/employees/:id/status\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Employee |
| \`/api/employees/:id/timeline\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\` | Employee |
| \`/api/employees/:id/photo\` | \`PATCH\` | All Authenticated Roles | Employee |
| \`/api/employees/:id/documents\` | \`GET\`, \`POST\` | All Authenticated Roles | Employee |
| \`/api/employees/:id/documents/:docId/verify\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Employee |
| \`/api/employees/:id/documents/:docId\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Employee |
| \`/api/attendance/clock-in\` | \`POST\` | \`EMPLOYEE\`, \`MANAGER\`, \`TEAM_LEAD\` | Attendance |
| \`/api/attendance/clock-out\` | \`PATCH\` | \`EMPLOYEE\`, \`MANAGER\`, \`TEAM_LEAD\` | Attendance |
| \`/api/attendance\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`FINANCE\`, \`AUDITOR\` | Attendance |
| \`/api/attendance/my\` | \`GET\` | All Authenticated Roles | Attendance |
| \`/api/attendance/:id\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`AUDITOR\` | Attendance |
| \`/api/attendance/:id/correction\` | \`POST\` | \`EMPLOYEE\`, \`MANAGER\`, \`TEAM_LEAD\` | Attendance |
| \`/api/attendance/:id/correction/approve\` | \`PATCH\` | \`SUPER_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Attendance |
| \`/api/leave-types\` | \`GET\`, \`GET /:id\` | All Authenticated Roles | Leave |
| \`/api/leave-types\` | \`POST\`, \`PUT /:id\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Leave |
| \`/api/leave-types/:id\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Leave |
| \`/api/leave-balances/my\` | \`GET\` | All Authenticated Roles | Leave |
| \`/api/leave-balances\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Leave |
| \`/api/leave-requests/my\` | \`GET\` | All Authenticated Roles | Leave |
| \`/api/leave-requests\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`FINANCE\`, \`AUDITOR\` | Leave |
| \`/api/leave-requests\` | \`POST\`, \`GET /:id\` | All Authenticated Roles | Leave |
| \`/api/leave-requests/:id/approve\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Leave |
| \`/api/leave-requests/:id/reject\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Leave |
| \`/api/leave-requests/:id/cancel\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\` | Leave |
| \`/api/payroll/process\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`FINANCE\` | Payroll |
| \`/api/payroll/my\` | \`GET\` | All Authenticated Roles | Payroll |
| \`/api/payroll\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`FINANCE\`, \`AUDITOR\` | Payroll |
| \`/api/payroll/:id\` | \`GET\` | \`SUPER_ADMIN\`, \`HR_MANAGER\`, \`FINANCE\`, \`EMPLOYEE\`, \`AUDITOR\` | Payroll |
| \`/api/payroll/:id/approve\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`FINANCE\` | Payroll |
| \`/api/payroll/:id/mark-paid\` | \`PATCH\` | \`SUPER_ADMIN\`, \`FINANCE\` | Payroll |
| \`/api/payslips/my\` | \`GET\` | All Authenticated Roles | Payslip |
| \`/api/payslips/:id\` | \`GET\` | \`SUPER_ADMIN\`, \`HR_MANAGER\`, \`FINANCE\`, \`EMPLOYEE\`, \`AUDITOR\` | Payslip |
| \`/api/projects\` | \`GET\`, \`GET /:id\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`, \`AUDITOR\` | Projects |
| \`/api/projects\` | \`POST\`, \`PUT\`, \`PATCH\`, \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\` | Projects |
| \`/api/tasks/my\` | \`GET\` | All Authenticated Roles | Tasks |
| \`/api/tasks\` | \`GET\`, \`GET /:id\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\`, \`AUDITOR\` | Tasks |
| \`/api/tasks\` | \`POST\`, \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`, \`TEAM_LEAD\` | Tasks |
| \`/api/tasks/:id\` | \`PUT\`, \`PATCH /status\`, \`POST /comments\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\` | Tasks |
| \`/api/assets/my\` | \`GET\` | All Authenticated Roles | Assets |
| \`/api/assets\` | \`GET\`, \`GET /:id\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`, \`AUDITOR\` | Assets |
| \`/api/assets\` | \`POST\`, \`PUT\`, \`POST /allocate\`, \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Assets |
| \`/api/asset-allocations\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`AUDITOR\` | Assets |
| \`/api/asset-allocations/:id/return\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Assets |
| \`/api/documents\` | \`GET\`, \`GET /:id\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`, \`AUDITOR\` | Documents |
| \`/api/documents\` | \`POST\`, \`PUT\`, \`PATCH\`, \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\` | Documents |
| \`/api/documents/:id/restore\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Documents |
| \`/api/documents/:id/permanent\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\` | Documents |
| \`/api/notifications\` | \`GET\`, \`PATCH /read\`, \`POST /read-all\`, \`POST /bulk-delete\`, \`DELETE\`, \`GET /preferences\` | All Authenticated Roles | Notifications |
| \`/api/notifications/org\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\` | Notifications |
| \`/api/notifications/announcements\` | \`GET\` | All Authenticated Roles | Notifications |
| \`/api/notifications/send\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Notifications |
| \`/api/notifications/broadcast\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Notifications |
| \`/api/tickets/my\` | \`GET\` | All Authenticated Roles | Help Desk |
| \`/api/tickets\` | \`GET\`, \`GET /:id\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\`, \`AUDITOR\` | Help Desk |
| \`/api/tickets\` | \`POST\`, \`PUT\`, \`PATCH /status\`, \`POST /comments\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\` | Help Desk |
| \`/api/tickets/:id/assign\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Help Desk |
| \`/api/tickets/:id\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Help Desk |
| \`/api/dashboard/executive\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`AUDITOR\` | Reports |
| \`/api/dashboard/hr\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\` | Reports |
| \`/api/dashboard/manager\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\` | Reports |
| \`/api/dashboard/employee\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\` | Reports |
| \`/api/reports/attendance\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\` | Reports |
| \`/api/reports/leave\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\` | Reports |
| \`/api/reports/payroll\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\` | Reports |
| \`/api/reports/projects\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\` | Reports |
| \`/api/reports/tasks\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\` | Reports |
| \`/api/reports/helpdesk\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\` | Reports |
| \`/api/reports/assets\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`AUDITOR\`, \`MANAGER\` | Reports |
| \`/api/performance/goals\` | \`GET\`, \`POST\`, \`PATCH /progress\` | All Authenticated Roles | Performance |
| \`/api/performance/goals/:id/evaluate\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\` | Performance |
| \`/api/performance/goals/:id\` | \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Performance |
| \`/api/performance/reviews\` | \`GET\`, \`GET /:id\` | All Authenticated Roles | Performance |
| \`/api/performance/reviews\` | \`POST\`, \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Performance |
| \`/api/performance/reviews/:id/self-assessment\` | \`PATCH\` | \`EMPLOYEE\`, \`MANAGER\`, \`TEAM_LEAD\` | Performance |
| \`/api/performance/reviews/:id/manager-assessment\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\` | Performance |
| \`/api/performance/reviews/:id/finalize\` | \`PATCH\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Performance |
| \`/api/recruitment/jobs\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`EMPLOYEE\` | Recruitment |
| \`/api/recruitment/jobs\` | \`POST\`, \`PUT\`, \`DELETE\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Recruitment |
| \`/api/recruitment/candidates\` | \`GET\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\` | Recruitment |
| \`/api/recruitment/candidates\` | \`POST\`, \`PATCH /status\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Recruitment |
| \`/api/recruitment/interviews\` | \`GET /candidates/:id/interviews\`, \`PATCH /feedback\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\`, \`MANAGER\`, \`TEAM_LEAD\`, \`EMPLOYEE\` | Recruitment |
| \`/api/recruitment/interviews\` | \`POST\` | \`SUPER_ADMIN\`, \`ORG_ADMIN\`, \`HR_MANAGER\` | Recruitment |
| \`/api/ai/*\` | \`GET\`, \`POST\`, \`DELETE\` | All Authenticated Roles | AI Assistant |
---
## 7. HTTP Status Codes & Machine-Readable Error Codes
### 7.1 HTTP Status Codes Used
The application strictly limits its HTTP responses to standard semantic codes defined in \`server/config/constants.js\`:
* \`200 OK\`: Request succeeded; response contains requested data or update confirmation.
* \`201 Created\`: Resource creation succeeded (e.g., employee onboarding, clock-in, task creation).
* \`202 Accepted\`: Request accepted for background processing (used in simulation workflows).
* \`204 No Content\`: Resource deleted successfully with no response body returned.
* \`400 Bad Request\`: Malformed JSON syntax, business rule violation, or file upload constraint error.
* \`401 Unauthorized\`: Access token is missing, malformed, revoked, or expired.
* \`403 Forbidden\`: Authenticated user lacks required RBAC role permissions for the endpoint.
* \`404 Not Found\`: Resource ID does not exist in MongoDB or route URL path is invalid.
* \`405 Method Not Allowed\`: HTTP verb not supported on the target endpoint path.
* \`409 Conflict\`: Resource uniqueness constraint violated (e.g., duplicate email or department code).
* \`422 Unprocessable Entity\`: Payload failed Zod schema validation rules in middleware.
* \`429 Too Many Requests\`: IP address or user exceeded rate limiter thresholds.
* \`500 Internal Server Error\`: Unhandled server exception or database connectivity failure.
* \`503 Service Unavailable\`: External dependency (e.g., Gemini LLM API or Cloudinary) temporarily unreachable.
### 7.2 AppError Machine-Readable Error Codes
Every operational error thrown via \`AppError.js\` includes a standardized, machine-readable \`errorCode\` string:
* \`OPERATIONAL_ERROR\`: General application logic failure.
* \`VALIDATION_ERROR\`: Payload or query parameter failed Zod schema verification.
* \`TOKEN_MISSING\`: Authorization header absent or Bearer scheme omitted.
* \`TOKEN_INVALID\`: JWT signature verification failed or token malformed.
* \`TOKEN_EXPIRED\`: JWT access token validity period elapsed.
* \`DUPLICATE_RESOURCE\`: Database uniqueness violation (MongoDB error 11000).
* \`INVALID_ID\`: Parameter string failed MongoDB 24-character hex ObjectId verification.
* \`INSUFFICIENT_ROLE\`: User role not enumerated in endpoint's allowed RBAC array.
* \`ROUTE_NOT_FOUND\`: Express router unmatched path handler triggered.
* \`INTERNAL_SERVER_ERROR\`: Global catch-all for unhandled exceptions.
* \`RATE_LIMIT_EXCEEDED\`: Express rate-limiter window quota exceeded.
* \`FILE_UPLOAD_ERROR\`: Multer middleware file transmission or disk write failure.
* \`INVALID_FILE_TYPE\`: Uploaded file MIME type not present in \`ALLOWED_MIME_TYPES\`.
* \`FILE_TOO_LARGE\`: Uploaded file exceeds \`FILE_UPLOAD_LIMITS\` (10MB documents, 5MB photos).
---
## 8. Bruno Testing Collection & Implementation Cross-Check Report
The project includes an enterprise-grade API testing suite structured as a Bruno Collection located in \`d:\\EWMP\\bruno\\\`, generated programmatically via \`build_all_bruno.js\`.
### 8.1 Bruno Collection Folder Mapping
The Bruno workspace is partitioned into 16 module folders mapping directly to backend domain routers:
1. \`Authentication/\`: Login, token refresh, profile retrieval, password change, logout, and 401 negative tests.
2. \`Organization/\`: Tenant profile, departments, designations, locations, shifts, and holiday calendars.
3. \`Employee/\`: Employee onboarding, directory listing, profile updates, and ID retrieval.
4. \`Attendance/\`: Geo-fenced clock-in/out, personal punch logs, administrative listing, and correction requests.
5. \`Leave/\`: Leave type configuration, leave application submission, managerial approval, and balance queries.
6. \`Payroll/\`: Payroll run processing, payslip generation, and disbursement tracking.
7. \`Projects/\`: Corporate project creation, team allocation, and lifecycle status tracking.
8. \`Tasks/\`: Agile task assignment, status progression, and comment thread collaboration.
9. \`Assets/\`: Inventory registration, hardware allocation custody, and asset return logging.
10. \`Documents/\`: Policy file upload, search directory, and document deletion.
11. \`Notifications/\`: Announcement broadcasts, personal inbox retrieval, and read status marking.
12. \`Help Desk/\`: IT/HR support ticket submission, staff assignment, and resolution tracking.
13. \`Reports/\`: Dashboard data aggregation and module-specific compliance reporting.
14. \`Performance/\`: Performance goal creation, review initiation, and appraisal evaluation.
15. \`Recruitment/\`: Job posting management, candidate ATS tracking, and interview scheduling.
16. \`AI/\`: Gemini health checks, conversational chat, summarization, analytical insights, recommendations, and history.
---
### 8.2 Comprehensive Implementation vs. Bruno Collection Cross-Check Report
A rigorous audit was conducted comparing physical HTTP endpoint handlers defined in \`server/routes/*.js\` against the test definitions generated by \`build_all_bruno.js\`. The results confirm that while the Bruno collection serves as an exhaustive automated smoke testing suite covering core happy paths and negative tests across all 16 modules, the physical backend implementation provides a broader, enterprise-complete feature set.
#### A. Endpoints Implemented in Routes but Omitted in Bruno Smoke Tests
The following implemented endpoints are fully operational and validated in the codebase but were omitted from the baseline \`build_all_bruno.js\` smoke testing script to maintain test execution speed and avoid complex mock data dependencies:
1. **Authentication Module:**
   * \`POST /api/auth/forgot-password\` (Password recovery email dispatch)
   * \`POST /api/auth/reset-password/:token\` (Token-based password reset)
2. **Organization Module:**
   * \`GET /api/organizations/settings\` & \`PUT /api/organizations/settings\` (System-wide preferences)
   * \`GET /api/organizations/:id\` & \`PUT /api/organizations/:id\` (ID-based tenant lookup)
   * Subresource CRUD: \`GET /:id\`, \`PUT /:id\`, \`DELETE /:id\` across Departments, Designations, Locations, Shifts, and Holidays.
3. **Employee Management Module:**
   * \`PATCH /api/employees/:id/status\` (Lifecycle status transitions)
   * \`GET /api/employees/:id/timeline\` (Career audit timeline)
   * \`PATCH /api/employees/:id/photo\` (Avatar image upload)
   * \`GET /api/employees/:id/documents\`, \`POST /api/employees/:id/documents\`, \`PATCH .../verify\`, \`DELETE .../:docId\` (Compliance document governance)
   * \`DELETE /api/employees/:id\` (Soft archive profile)
4. **Attendance Module:**
   * \`GET /api/attendance/:id\` (Single attendance log inspection)
5. **Leave Module:**
   * Leave Types: \`GET /api/leave-types/:id\`, \`PUT /api/leave-types/:id\`, \`DELETE /api/leave-types/:id\`
   * Leave Balances: \`GET /api/leave-balances/my\` (Personal quota lookup)
   * Leave Requests: \`GET /api/leave-requests/my\`, \`GET /api/leave-requests/:id\`, \`PATCH /:id/reject\`, \`PATCH /:id/cancel\`
6. **Payroll Module:**
   * \`PATCH /api/payroll/:id/mark-paid\` (Banking disbursement recording)
   * \`GET /api/payslips/my\` & \`GET /api/payslips/:id\` (Individual payslip access)
7. **Projects & Tasks Modules:**
   * Projects: \`PATCH /api/projects/:id/status\`, \`DELETE /api/projects/:id\`
   * Tasks: \`GET /api/tasks/my\`, \`GET /api/tasks/:id\`, \`PUT /api/tasks/:id\`, \`POST /api/tasks/:id/comments\`, \`DELETE /api/tasks/:id\`
8. **Assets & Help Desk Modules:**
   * Assets: \`GET /api/assets/my\`, \`GET /api/assets/:id\`, \`PUT /api/assets/:id\`, \`DELETE /api/assets/:id\`
   * Help Desk: \`GET /api/tickets/my\`, \`GET /api/tickets/:id\`, \`PUT /api/tickets/:id\`, \`PATCH /api/tickets/:id/assign\`, \`POST /api/tickets/:id/comments\`, \`DELETE /api/tickets/:id\`
9. **Documents & Notifications Modules:**
   * Documents: \`GET /api/documents/:id\`, \`PUT /api/documents/:id/replace\`, \`PATCH /api/documents/:id\`, \`POST /api/documents/:id/restore\`, \`DELETE /api/documents/:id/permanent\`
   * Notifications: \`GET /api/notifications/org\`, \`POST /api/notifications/send\`, \`PATCH /api/notifications/:id/read\`, \`POST /api/notifications/read-all\`, \`POST /api/notifications/bulk-delete\`, \`DELETE /api/notifications/:id\`, \`GET /api/notifications/preferences\`
10. **Reports & Analytics Dashboard Module:**
    * Dashboard: Dedicated leadership endpoints (\`/dashboard/executive\`, \`/dashboard/hr\`, \`/dashboard/manager\`, \`/dashboard/employee\`).
    * Reports: Dedicated GET compliance endpoints (\`/api/reports/leave\`, \`/api/reports/payroll\`, \`/api/reports/projects\`, \`/api/reports/tasks\`, \`/api/reports/helpdesk\`, \`/api/reports/assets\`).
11. **Performance & Recruitment Modules:**
    * Performance: Goal management CRUD (\`/goals\`) and 3-stage review appraisal workflow (\`/self-assessment\`, \`/manager-assessment\`, \`/finalize\`).
    * Recruitment: Full Job CRUD (\`PUT\`, \`DELETE\`), Candidate status transitions (\`PATCH /status\`), and Interview scheduling/feedback (\`/interviews\`).
12. **AI Assistant Module:**
    * Enterprise capabilities: \`GET /api/ai/plugins\`, \`GET /api/ai/plugins/health\`, \`POST /api/ai/workflow\`, \`POST /api/ai/workflow/simulate\`, \`GET /api/ai/workflows\`, \`GET /api/ai/workflows/:id\`, \`POST /api/ai/action-plan\`.
#### B. Endpoints in Bruno with Divergent Path / Verb Mappings in Routes
In a few instances, \`build_all_bruno.js\` simplifies route structures for chained automated testing. The cross-check identified the following structural mappings between Bruno test definitions and authoritative route implementations:
* **Payroll Processing:** Bruno defines \`POST /api/payroll\` (01 Run Payroll) and \`PATCH /api/payroll/:id/process\` (03 Process Payroll). In physical implementation (\`payrollRoutes.js\`), payroll run generation and computation is unified under \`POST /api/payroll/process\`, while authorization is handled via \`PATCH /api/payroll/:id/approve\`.
* **Payslip Generation:** Bruno includes \`POST /api/payslips\` (04 Generate Payslip) and \`GET /api/payslips\` (05 Get Payslips). In authoritative implementation (\`payslipRoutes.js\`), payslips are generated automatically during payroll processing; retrieval is handled via \`GET /api/payslips/my\` or \`GET /api/payslips/:id\`.
* **Asset Allocation:** Bruno defines standalone \`POST /api/asset-allocations\` (03 Allocate Asset). In authoritative implementation (\`assetRoutes.js\`), allocation is mounted as a subresource action: \`POST /api/assets/:id/allocate\`.
* **Announcements & Notifications:** Bruno defines \`POST /api/announcements\` (01 Create Announcement) and \`PATCH /api/notifications/mark-read\` (03 Mark As Read). In authoritative implementation (\`notificationRoutes.js\`), broadcast creation is handled via \`POST /api/notifications/broadcast\` (or \`/api/announcements/broadcast\`), and reading is handled via \`PATCH /api/notifications/:id/read\` or \`POST /api/notifications/read-all\`.
* **Reports Dashboard:** Bruno tests \`GET /api/dashboard\` (01 Get Dashboard Data) and \`POST /api/reports/attendance\` (02 Generate Attendance Report). In authoritative implementation (\`reportRoutes.js\`), dashboards are scoped by role (\`/dashboard/executive\`, \`/dashboard/hr\`, etc.), and all reports are stateless \`GET\` requests with query string parameters (e.g., \`GET /api/reports/attendance?startDate=...&endDate=...\`).
* **Performance Reviews:** Bruno defines \`POST /api/performance\` and \`GET /api/performance\`. In authoritative implementation (\`performanceRoutes.js\`), these are explicitly mounted under \`/reviews\` (\`POST /api/performance/reviews\`, \`GET /api/performance/reviews\`).
---
## 9. Security & Architecture Notes
### 9.1 Stateless JWT & Token Expiration Defense
To prevent token replay attacks and unauthorized persistence, EWMP enforces strict JWT lifespans: access tokens expire rapidly, requiring automatic client renewal via HTTP-only refresh cookies. When an employee is terminated or suspended, their refresh token token family is revoked in MongoDB, instantly severing system access upon the next access token expiry window.
### 9.2 Enterprise RBAC Enforcement
Role authorization is evaluated statically before route handler execution. The middleware \`checkRole([...roles])\` verifies that \`req.user.role\` exists within the whitelist. Attempts to access endpoints outside assigned operational boundaries immediately throw an \`AppError(403, 'Permission denied', 'INSUFFICIENT_ROLE')\`, logged by the audit system.
### 9.3 Multi-Layered Rate Limiting
To defend against brute-force credential stuffing and denial-of-service (DoS) attempts, the backend mounts specialized Express rate limiters:
* **Global API Limiter (\`apiRateLimiter\`):** Caps general traffic to 100 requests per 15-minute window per IP address across \`/api/*\`.
* **Authentication Limiter (\`authRateLimiter\`):** Restricts login and password reset endpoints to a strict 5 requests per 15-minute window per IP address.
### 9.4 Global NoSQL Injection Protection
MongoDB operator injection is neutralized globally by \`mongoSanitizeMiddleware.js\`. This pipeline intercepts incoming Express payloads (\`req.body\`, \`req.query\`, \`req.params\`) and strips any keys beginning with the \`$\` character or containing \`.\` notation (e.g., \`{"$ne": null}\`, \`{"$gt": ""}\`, \`{"$regex": ".*"}\`), ensuring malicious query selectors never reach Mongoose database drivers.
### 9.5 Zod Schema Validation Pipeline
Every mutating endpoint passes its request payload through declarative Zod validation schemas compiled in \`server/validators/\`. The \`validateRequest\`, \`validateQuery\`, and \`validateParams\` middleware ensure strict type safety, field length boundaries, regex pattern matching (e.g., phone numbers, email formats), and MongoDB ObjectId verification before executing controller business logic.
`;
fs.writeFileSync(outputPath, content, 'utf8');
console.log('Successfully generated comprehensive API_DOCUMENTATION.md without emojis or placeholders.');
