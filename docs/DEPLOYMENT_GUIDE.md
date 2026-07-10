# Deployment Guide

## Overview

This document serves as the authoritative, comprehensive deployment guide for the Enterprise Workforce Management Platform (EWMP) backend API server. The EWMP backend is implemented as a modular Node.js and Express application utilizing MongoDB Atlas for persistence, Cloudinary for secure media storage, Google Gemini for artificial intelligence operations, and Nodemailer for SMTP transactional email delivery.

This guide provides DevOps engineers, cloud architects, and system administrators with exact instructions for installing, configuring, deploying, monitoring, and troubleshooting the EWMP backend across supported operating environments.

### Supported Deployment Environments

The EWMP backend natively supports three runtime environments governed by the `NODE_ENV` environment variable within `server/config/config.js` and `server/config/logger.js`:

* **development**: Engineered for local feature development and engineering testing. In this mode, the server enables colored console logging via Winston, includes full error stack traces in API JSON error responses, outputs debug-level diagnostic logs, permits fallback default JWT secret placeholders (while emitting startup console warnings), and stubs outbound SMTP emails to server logs when email credentials are omitted or configured for test relays.
* **production**: Engineered for enterprise staging and live customer-facing production infrastructure. In this mode, the server enforces strict startup environment validation, terminates process execution immediately if default JWT placeholder secrets are detected, sets the logging threshold to `info`, writes structured JSON log records exclusively to rotating filesystem file transports (`error.log` and `combined.log`), suppresses verbose console output, and suppresses sensitive internal stack traces from client-facing API responses.
* **test**: Engineered for automated regression testing, integration test suites, and CI execution. In this mode, the server suppresses console logging output and automatically intercepts and stubs all outbound SMTP email transmission requests within `server/utils/sendEmail.js` to prevent unwanted email delivery during test runs.

### System Requirements

To ensure reliable performance, cryptographic processing, and connection pooling, hosting infrastructure for the EWMP Node.js backend must meet the following minimum and recommended system specifications:

| Resource | Minimum Requirement | Recommended Specification | Notes & Utilization |
| :--- | :--- | :--- | :--- |
| **CPU** | 2 Cores | 4+ Cores | Required for Express concurrency, JSON payload parsing, and CPU-intensive Bcrypt cryptographic hashing (`bcryptjs`). |
| **Memory (RAM)** | 2 GB | 4 GB+ | Required to support Express process execution, Multer in-memory file upload buffering, `express-rate-limit` counters, and `cacheManager.js` AI prompt caching. |
| **Storage (Disk)** | 10 GB | 25 GB+ Solid State Drive (SSD) | Accommodates application source code, `node_modules` dependencies, temporary staging in `server/uploads/`, and rotating Winston log files (`server/logs/`). |
| **Network** | 100 Mbps Ethernet | 1 Gbps+ Dedicated Interface | Requires reliable outbound HTTPS (TCP port 443) access to MongoDB Atlas, Cloudinary APIs, and Google AI Studio, plus SMTP (TCP port 587/465) egress. |

---

## Prerequisites

Before initiating server deployment, target infrastructure must be provisioned with the following software packages, cloud database accounts, and third-party service credentials:

### Node.js Version

The runtime environment must have Node.js version **18.0.0 or higher** installed. This requirement is explicitly declared and enforced by the `"engines": { "node": ">=18.0.0" }` specification in both the root `package.json` and `server/package.json` manifests. Node.js LTS releases (such as Node.js 20 LTS or Node.js 22 LTS) are strongly recommended for production deployments.

### npm Version

The package manager must be npm version **9.0.0 or higher**, corresponding to the `"engines": { "npm": ">=9.0.0" }` specification defined in the workspace root manifest. This ensures deterministic dependency resolution and workspace script execution across frontend and backend modules.

### MongoDB

The server requires access to a MongoDB database engine (version 5.0+ recommended). For enterprise production deployments and full operation of core domain workflows, the database **must be deployed as a MongoDB Replica Set** (such as a managed MongoDB Atlas cloud cluster or a configured multi-node local replica set). Replica set topology is mandatory because core business logic in `server/services/employeeService.js` (employee onboarding/offboarding) and `server/services/payrollService.js` (salary structure and payslip generation) executes multi-document ACID transactions via `mongoose.startSession()` and `session.startTransaction()`.

### Cloudinary

An active Cloudinary cloud storage account (supporting the Cloudinary v2 SDK) is required. Cloudinary offloads heavy multipart file storage, CDN distribution, and bandwidth consumption from the backend server. Administrators must retrieve their Cloud Name, API Key, and API Secret from the Cloudinary Management Console to enable image, resume, and identification document uploads.

### Gemini API

To enable the AI Operations Assistant module (`server/ai/*`), administrators must obtain a valid Google Gemini API key from Google AI Studio (`https://aistudio.google.com/apikey`). The platform utilizes the `@google/generative-ai` and `@google/genai` SDKs to power natural language querying, analytical insights, and workflow planning.

### SMTP

Outbound transactional email delivery (including new user onboarding greetings and password reset tokens) requires an accessible SMTP mail server or relay service. For development and testing environments, Mailtrap (`https://mailtrap.io`) is supported and recommended. For live production environments, an enterprise SMTP relay (such as SendGrid, Amazon SES, Mailgun, or Google Workspace SMTP) supporting implicit TLS (port 465) or explicit STARTTLS (port 587) must be provisioned.

### Operating Systems

The EWMP backend is platform-agnostic and executes reliably on any cross-platform operating system that supports Node.js 18+, including:
* Microsoft Windows Server (2019 / 2022) and Windows 10 / 11 64-bit
* Linux distributions including Ubuntu LTS (20.04 / 22.04 / 24.04), Debian, Alpine Linux, Red Hat Enterprise Linux (RHEL), and CentOS
* Apple macOS (Intel and Apple Silicon M-series architectures)

---

## Project Structure

The EWMP codebase is organized into distinct functional directories separating server logic, client applications, automation scripts, and configuration assets.

### Deployment Folders

The primary directories relevant to backend server deployment and execution include:

```
EWMP/
├── server/                     # Backend API server root directory
│   ├── ai/                     # AI Operations Assistant module (providers, router, controllers, optimization)
│   ├── config/                 # Centralized configuration, database, logger, and external service setup
│   ├── controllers/            # Express route controllers handling HTTP request/response formatting
│   ├── logs/                   # Runtime directory for Winston rotating filesystem log files
│   ├── middleware/             # Global and route-specific security, auth, validation, and error middleware
│   ├── models/                 # Mongoose data models and schema validation definitions
│   ├── repositories/           # Data access layer abstracting Mongoose database queries
│   ├── routes/                 # Express API router definitions mapped by functional domain
│   ├── scripts/                # Database seeding, verification, and administrative automation scripts
│   ├── services/               # Core business logic layer implementing domain rules and transactions
│   ├── uploads/                # Temporary local disk buffer directory for incoming multipart file uploads
│   ├── utils/                  # Shared helper utilities (email sender, response formatting, query builders)
│   ├── validators/             # Zod declarative schema validation definitions
│   ├── app.js                  # Express application pipeline configuration and middleware assembly
│   ├── package.json            # Backend dependency manifest and runtime script definitions
│   └── server.js               # Application bootstrap entry point, cluster connection, and lifecycle manager
├── client/                     # Frontend Vite / React web application root directory
├── docs/                       # Architectural, API, and database specification documentation
├── package.json                # Workspace root dependency manifest and master automation scripts
└── .env.example                # Workspace root reference environment configuration template
```

### Environment Files

Runtime configuration is injected into the application via environment files located in the workspace and server roots:

* `.env.example` (Root): Provides a high-level reference template documenting standard port allocations for both the backend server (5000) and frontend client (5173).
* `server/.env.example`: The authoritative backend configuration template. Contains every implemented system environment variable key accompanied by developer-friendly documentation and sample local configuration values.
* `server/.env`: The active runtime environment file (generated by copying `server/.env.example` during installation). This file stores sensitive production secrets, database URIs, and API keys. It is explicitly excluded from source control via `.gitignore`.

### Configuration Files

The backend centralized configuration subsystem resides within `server/config/` and is governed by explicit architectural standards:

* `server/config/config.js`: The central configuration manager. Parses, types, and exports environment variables from `process.env`. Exposes `validateConfig()`, which enforces mandatory variable presence and strict production JWT secret rules during server startup.
* `server/config/db.js`: Establishes and manages Mongoose database connectivity to MongoDB Atlas. Configures custom DNS servers (`8.8.8.8`, `1.1.1.1`), applies connection timeout and pooling parameters, and registers connection lifecycle event handlers.
* `server/config/cloudinary.js`: Initializes the Cloudinary v2 SDK using configured API credentials and enforces HTTPS secure URL generation (`secure: true`).
* `server/config/gemini.js`: Instantiates the Google Generative AI client and exposes the `getGeminiClient()` getter method consumed by AI domain services.
* `server/config/env.js`: Exposes the `validateEnv()` delegation method invoked as the first step during server initialization.
* `server/config/logger.js`: Configures Winston logging formatting (timestamps, error stack traces, JSON structure) and defines rotating filesystem transports writing to `server/logs/`.
* `server/config/constants.js`: Centralizes system-wide enumeration constants, including RBAC user roles (`ROLES`), standard HTTP status codes (`HTTP_STATUS`), machine-readable error codes (`ERROR_CODES`), pagination limits (`PAGINATION`), and file upload size thresholds (`FILE_UPLOAD_LIMITS`).

---

## Environment Variables

The EWMP backend implements exactly 19 environment variables that control runtime behavior, authentication security, database connectivity, and external service integrations.

Every implemented variable is documented in the matrix below:

| Variable Name | Purpose | Required | Default Value | Example Value | Security Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Governs runtime execution environment and logging verbosity. | No | `development` | `production` | Set to `production` in live deployments to suppress stack traces and enforce strict secret validation. |
| `PORT` | Network port bound by the backend HTTP server. | Yes | `5000` | `5000` | Verified during startup validation; application terminates if undefined or unbindable. |
| `CLIENT_URL` | Allowed origin URL enforced by CORS middleware. | Yes | `http://localhost:5173` | `https://app.ewmp.com` | Prevents unauthorized cross-origin browser requests from unverified domains. |
| `MONGODB_URI` | MongoDB Atlas / replica set connection string. | Yes | `mongodb://127.0.0.1:27017/ewmp` | `mongodb+srv://admin:sec@cluster.mongodb.net/ewmp?retryWrites=true&w=majority` | Must include database username, password, cluster hostname, and target database name. |
| `JWT_SECRET` | Secret key used to sign and verify user access tokens. | Yes | `ewmp_dev_jwt_secret_key_change_in_production_2026` | `a8f5f167f44f4964e6c998dee827110c...` (64-byte hex string) | In `production`, using the default placeholder causes immediate startup termination. Generate via high-entropy random bytes. |
| `JWT_REFRESH_SECRET` | Secret key used to sign and verify long-lived refresh tokens. | Yes | `ewmp_dev_refresh_secret_key_change_in_production_2026` | `c4ca4238a0b923820dcc509a6f75849b...` (64-byte hex string) | Must be set to a cryptographically secure random string distinct from `JWT_SECRET`. |
| `JWT_ACCESS_EXPIRY` | Lifespan duration for short-lived access tokens. | No | `15m` | `15m` | Short lifespan minimizes replay attack vulnerability windows. |
| `JWT_REFRESH_EXPIRY` | Lifespan duration for persistent refresh tokens. | No | `7d` | `7d` | Governs maximum session persistence duration before requiring re-authentication. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud identifier for asset storage. | Optional | `undefined` | `ewmp-enterprise-cloud` | Required for file upload operations. If omitted, Cloudinary SDK initialization is bypassed. |
| `CLOUDINARY_API_KEY` | Public API key for Cloudinary authentication. | Optional | `undefined` | `491827364519283` | Required alongside secret key for signing cloud storage upload requests. |
| `CLOUDINARY_API_SECRET` | Private API secret key for Cloudinary authentication. | Optional | `undefined` | `bf8d7e6f5a4b3c2d1e0f9a8b7c6d` | Highly sensitive credential; never expose in client code or commit to source repositories. |
| `AI_PROVIDER` | Selects active artificial intelligence backend provider engine. | No | `gemini` | `gemini` | Evaluated dynamically by `providerFactory.js` to route AI feature requests. |
| `GEMINI_API_KEY` | API key for Google Gemini AI Studio authentication. | Optional | `undefined` | `AIzaSyD9e8f7g6h5j4k3l2m1n0p...` | Required for AI Assistant functionality. If missing, AI endpoints log warnings and report degraded status. |
| `GEMINI_MODEL` | Specific Gemini large language model version identifier. | No | `gemini-2.5-flash` | `gemini-2.5-flash` | Specifies the exact generative AI model invoked during prompt execution. |
| `EMAIL_HOST` | Hostname of SMTP mail server or relay provider. | Optional | `undefined` | `smtp.mailtrap.io` | If missing or when `NODE_ENV=test`, email sending is stubbed to server logs without network egress. |
| `EMAIL_PORT` | Network port for SMTP server connection. | No | `587` | `587` or `465` | Port `465` automatically initializes implicit SSL/TLS; port `587` initializes explicit STARTTLS upgrade. |
| `EMAIL_USER` | Username for SMTP relay authentication. | Optional | `undefined` | `api_user_id` | Required if the target SMTP server enforces credential authentication. |
| `EMAIL_PASS` | Password or API token for SMTP relay authentication. | Optional | `undefined` | `secret_smtp_password` | Highly sensitive credential used by Nodemailer transport. |
| `EMAIL_FROM` | Default sender email address for automated notifications. | No | `noreply@ewmp.local` | `no-reply@ewmp-enterprise.com` | Should match verified domain sender identities on enterprise SMTP relays. |

---

## Installation

Follow these exact sequential instructions to install dependencies, configure environment secrets, initialize database schemas, and prepare the backend for execution.

### Clone Repository

Clone the project repository from the remote Git origin and navigate into the workspace root directory:

```bash
git clone <repository_url> ewmp
cd ewmp
```

### Install Dependencies

The workspace root `package.json` provides automated scripts to install dependencies across the platform. To install backend dependencies, execute either the root automated script or navigate directly to the server directory:

```bash
# Option A: Install all workspace dependencies (server and client) from root
npm run install:all

# Option B: Install backend server dependencies directly
cd server
npm install
```

### Environment Setup

Create the active backend runtime environment configuration file by copying the reference template:

```bash
# On Linux / macOS
cp server/.env.example server/.env

# On Windows Command Prompt / PowerShell
copy server\.env.example server\.env
```

Open `server/.env` in a text editor and populate all mandatory configuration variables (`PORT`, `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`). Ensure cryptographically random hexadecimal strings are generated for JWT secrets.

### Database Setup

1. Ensure your target MongoDB Atlas cluster or local MongoDB replica set is operational and accessible from your deployment host.
2. Verify that `MONGODB_URI` in `server/.env` contains the correct connection string, including authenticated database user credentials and the target database name (e.g., `/ewmp`).
3. Execute the database seeding automation script to populate initial system roles, default organizational structures, administrative user accounts, and demonstration employees:

```bash
cd server
npm run seed:auth
# Optional: Run demonstration data seed for full module testing
npm run seed:demo
```

### Cloudinary Setup

1. Log into the Cloudinary Management Console (`https://console.cloudinary.com/`).
2. Navigate to **Dashboard** -> **Account Details** and copy your **Cloud Name**, **API Key**, and **API Secret**.
3. Assign these exact values to `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` within `server/.env`.

### Gemini Setup

1. Navigate to Google AI Studio (`https://aistudio.google.com/apikey`).
2. Generate a new API key bound to your Google Cloud project.
3. Assign the generated key to `GEMINI_API_KEY` within `server/.env`. Verify that `GEMINI_MODEL` is set to `gemini-2.5-flash` or your preferred supported model identifier.

### SMTP Setup

1. For local development testing, create a inbox on Mailtrap (`https://mailtrap.io`) and navigate to **SMTP Settings**.
2. Assign the provided credentials to `EMAIL_HOST` (`smtp.mailtrap.io`), `EMAIL_PORT` (`587`), `EMAIL_USER`, and `EMAIL_PASS`.
3. For staging or production deployments, replace these values with your enterprise SMTP relay provider credentials (such as Amazon SES or SendGrid) and set a valid sender address in `EMAIL_FROM`.

---

## Running Locally

The EWMP backend provides distinct operational modes for local developer iteration and simulated production execution.

### Development Mode

Development mode leverages `nodemon` to monitor filesystem changes and automatically restart the server process during active code development.

To launch the backend server in development mode, execute:

```bash
# From workspace root
npm run dev:server

# Or directly from within the server directory
cd server
npm run dev
```

**Development Mode Operational Characteristics:**
* Executes `nodemon server.js`, watching all `.js` and `.json` files within `server/`.
* Winston logging outputs colored, human-readable text directly to the console stdout/stderr.
* API error responses (`errorMiddleware.js`) return detailed JSON payloads including full exception stack traces to aid debugging.
* If `JWT_SECRET` or `JWT_REFRESH_SECRET` remain set to default placeholder strings, the server logs a warning message but permits application startup to proceed.
* If `EMAIL_HOST` is unconfigured, Nodemailer operates in stub mode, printing outbound email targets and subject lines to the console without transmitting network packets.

### Production Mode

Production mode runs the application using the standard Node.js runtime process without filesystem monitoring overhead, enforcing strict security and performance optimizations.

To launch the backend server in production mode locally, execute:

```bash
# Set environment variable and run server directly
cd server
NODE_ENV=production npm start
```

**Production Mode Operational Characteristics:**
* Executes `node server.js` directly.
* Enforces strict environment variable validation via `validateConfig()`. If placeholder JWT secrets are detected, the server logs an error and terminates immediately (`process.exit(1)`).
* Console logging is suppressed. All structured JSON log events are written exclusively to rotating disk files: `server/logs/error.log` and `server/logs/combined.log`.
* Error stack traces are stripped from API JSON responses, returning sanitized, user-facing error descriptions.
* Enforces standard API rate limiting thresholds across all `/api` endpoints via `express-rate-limit`.

---

## Production Deployment

Deploying the EWMP backend to enterprise staging or production infrastructure requires understanding the server's architectural initialization, validation rules, and lifecycle management.

### Explain

In production environments, the EWMP backend is deployed as a stateless Node.js HTTP application server. Because Express operates within a single-threaded event loop, production deployments should execute under an enterprise process manager (such as PM2, systemd, or native runtime supervisors) capable of monitoring process health, restarting failed instances, and managing environment variable injection.

The backend is designed to terminate TLS/HTTPS encryption at an upstream reverse proxy or load balancer (such as Nginx, AWS Application Load Balancer, or Cloudflare), receiving unencrypted HTTP traffic on configured `PORT` (default 5000) while enforcing strict security headers and CORS boundaries.

### Environment Validation

When `server.js` executes, its immediate first instruction is invoking `validateEnv()`, which delegates to `config.validateConfig()` (`server/config/config.js`). This validation mechanism acts as a fail-fast security gate before any network bindings or database connections are initialized.

The validator inspects `process.env` and pushes structural formatting errors to an internal array if:
* `MONGODB_URI` is missing or contains an empty string.
* `PORT` is missing or evaluates to NaN.
* `CLIENT_URL` is missing or contains an empty string.

If any validation errors occur, the server prints each error description to console and Winston loggers, emitting `Application terminated.`, and aborts execution immediately via `process.exit(1)`.

### JWT Validation

To prevent cryptographic hijacking and session forgery, `config.validateConfig()` enforces strict conditional security rules on authentication secrets when `config.env === 'production'`:

1. **Presence Verification**: Verifies that both `JWT_SECRET` and `JWT_REFRESH_SECRET` exist in `process.env` and are not empty strings.
2. **Placeholder Rejection**: Verifies that `JWT_SECRET` does not equal `ewmp_dev_jwt_secret_key_change_in_production_2026` and `JWT_REFRESH_SECRET` does not equal `ewmp_dev_refresh_secret_key_change_in_production_2026`.

If default development placeholders are detected during a production boot attempt, the validator logs explicit security violation errors and terminates server execution (`process.exit(1)`).

### Startup Sequence

The backend initialization sequence follows an exact, synchronized chronological order defined in `server/server.js`:

```
[Step 1] Load Environment Variables
    └── Execute dotenv.config() to populate process.env from server/.env file.
[Step 2] Validate Environment & Security Secrets
    └── Execute validateEnv() -> config.validateConfig(). Terminate on failure.
[Step 3] Register Synchronous Exception Handler
    └── Bind process.on('uncaughtException') to intercept fatal synchronous errors.
[Step 4] Establish MongoDB Database Connectivity
    └── Invoke connectDB() -> mongoose.connect() with connection pooling options.
[Step 5] Configure Cloudinary Media SDK
    └── Invoke configureCloudinary() to initialize v2 SDK with secure HTTPS URLs.
[Step 6] Configure Google Gemini AI SDK
    └── Invoke configureGemini() to instantiate GoogleGenerativeAI client.
[Step 7] Assemble Express Application Pipeline
    └── Import app.js, executing security headers, CORS, body parsers, and routers.
[Step 8] Bind HTTP Listener
    └── Execute app.listen(PORT), opening TCP socket and accepting incoming HTTP traffic.
[Step 9] Register Asynchronous Exception & Signal Handlers
    └── Bind process.on('unhandledRejection'), SIGTERM, and SIGINT shutdown handlers.
```

### Database Connection

Database connectivity is managed within `server/config/db.js`. To ensure reliable domain name resolution across cloud hosting environments, the module explicitly overrides native DNS lookup servers using `dns.setServers(['8.8.8.8', '1.1.1.1'])`.

The connection is established via `mongoose.connect(config.db.uri, config.db.options)` utilizing explicit Mongoose network options:
* `maxPoolSize: 10`: Maintains up to 10 concurrent TCP socket connections within the connection pool.
* `serverSelectionTimeoutMS: 5000`: Fails fast if the target MongoDB cluster cannot be selected within 5 seconds.
* `socketTimeoutMS: 45000`: Terminates idle or stalled TCP network sockets after 45 seconds of inactivity.

If initial connection establishment fails, `db.js` logs the full error stack and terminates the process (`process.exit(1)`). During runtime, Mongoose connection event listeners actively monitor socket state, logging warning alerts when `disconnected` events occur and informational confirmations upon successful `reconnected` events.

### Logger Initialization

The structured server logging architecture is initialized in `server/config/logger.js` utilizing the `winston` library. The logger is configured with a default service metadata tag (`{ service: 'ewmp-api' }`) and formats all entries by combining timestamps (`YYYY-MM-DD HH:mm:ss`), error stack trace serialization (`winston.format.errors({ stack: true })`), and structured JSON rendering (`winston.format.json()`).

In production mode (`NODE_ENV === 'production'`), console output is completely suppressed. Logs are written exclusively to two persistent filesystem transports:
1. **Error Transport**: Writes exclusively error-level records to `server/logs/error.log`. Configured with automatic file rotation triggered at `maxsize: 5242880` bytes (5 MB) and retaining a historical window of `maxFiles: 5` rotated archives.
2. **Combined Transport**: Writes all operational log levels (`error`, `warn`, `info`) to `server/logs/combined.log`. Enforces identical 5 MB rotation and 5-file retention limits.

In non-production modes (`development` and `test`), the logger dynamically attaches a Winston Console transport formatting output with colorized headers and readable string interpolation.

### Express Startup

The Express application pipeline (`server/app.js`) organizes middleware execution into a strict sequential hierarchy designed to sanitize requests before they reach domain routing logic:

1. **Security Headers**: Invokes `helmet()` to set protective HTTP response headers (HSTS, X-Content-Type-Options, X-Frame-Options, DNS Prefetch Control).
2. **Payload Compression**: Invokes `compression()` to compress HTTP response bodies via Gzip/Deflate.
3. **CORS Enforcement**: Configures Cross-Origin Resource Sharing allowing requests strictly from `config.clientUrl`, enabling `credentials: true` for HTTP-only cookie transmission, and whitelisting standard REST methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
4. **Body & Cookie Parsing**: Configures `express.json()` and `express.urlencoded()` with a generous `limit: '10mb'` payload size threshold to accommodate base64 documents and large JSON payloads, followed by `cookieParser()`.
5. **NoSQL Injection Defense**: Applies `express-mongo-sanitize()` globally across all incoming traffic, recursively stripping prohibited NoSQL operator characters (`$` and `.`) from request bodies, query parameters, and HTTP headers.
6. **HTTP Traffic Logging**: Registers `requestLogger` to log inbound request method, URL, and status codes.
7. **Global Rate Limiting**: Mounts `apiRateLimiter` across the `/api` path prefix to regulate request frequency and prevent brute-force attacks.
8. **Health Endpoints**: Registers unauthenticated uptime probes at `/health` and `/api/health`.
9. **Domain Route Registration**: Mounts modular domain routers (Authentication, Organizations, Employees, Attendance, Leave, Payroll, Projects, Assets, Documents, Notifications, AI Assistant, Reports, Performance, and Settings) onto their respective `/api/*` prefixes.
10. **Terminal Error Pipeline**: Registers `notFoundMiddleware` to catch unmatched URIs (returning HTTP 404), followed by `errorMiddleware` as the final error handler responsible for rendering Zod, Mongoose, and operational exceptions into standardized JSON responses.

---

## Deployment Architecture

The Mermaid diagram below illustrates the physical and logical deployment architecture of the EWMP backend, detailing network boundaries, middleware pipelines, data persistence layers, and external cloud integrations:

```mermaid
graph TD
    subgraph ClientLayer [Client Access Layer]
        Browser["Web Browser / Vite React Client<br/>Origin: CLIENT_URL"]
    end

    subgraph ServerInfrastructure [Backend Node.js Server Infrastructure]
        ReverseProxy["HTTPS Reverse Proxy / Load Balancer<br/>TLS Termination - Port 443"]
        
        subgraph ExpressApp [EWMP Express Application Process - Port 5000]
            SecurityPipe["Security & Parsing Middleware<br/>Helmet | CORS | BodyParser | MongoSanitize"]
            RateLimit["Rate Limiter Middleware<br/>apiRateLimiter /express-rate-limit/"]
            Router["API Router & Controllers<br/>/api/* & /health Probes"]
            Services["Domain Business Logic & Services<br/>RBAC | Transactions | AI Service"]
        end
        
        LogStorage["Local Filesystem Rotating Logs<br/>server/logs/combined.log<br/>server/logs/error.log"]
    end

    subgraph CloudServices [External Cloud Infrastructure]
        Atlas["MongoDB Atlas Cloud Database<br/>Multi-Region Replica Set - Port 27017"]
        Cloudinary["Cloudinary CDN Storage<br/>Media & Document Asset Storage"]
        Gemini["Google AI Studio API<br/>Gemini Large Language Model Engine"]
        SMTP["SMTP Mail Relay Server<br/>Mailtrap / Production SMTP - Port 587 or 465"]
    end

    Browser -->|HTTPS REST API Requests| ReverseProxy
    ReverseProxy -->|Forwarded HTTP Traffic - Port 5000| SecurityPipe
    SecurityPipe --> RateLimit
    RateLimit --> Router
    Router --> Services
    Services -->|Mongoose TCP/TLS Connection Pool| Atlas
    Services -->|HTTPS REST SDK Asset Uploads| Cloudinary
    Services -->|HTTPS REST AI Prompt Requests| Gemini
    Services -->|SMTP TLS / STARTTLS Transmission| SMTP
    Services -->|Winston File Transports| LogStorage
```

---

## Database Deployment

### MongoDB Atlas

The EWMP backend is architected to operate against MongoDB Atlas, MongoDB's fully managed cloud database service. Production deployments should provision an Atlas cluster deployed within the same cloud cloud region (e.g., AWS us-east-1 or GCP us-central1) as the Node.js application server to minimize network latency.

### Connection

Database connection strings must follow the standard DNS Seedlist Connection Format (`mongodb+srv://`) or standard replica set URI format. The connection URI must be assigned to `MONGODB_URI` in `server/.env`.

To ensure secure network communication, verify that:
1. Database user credentials embedded in `MONGODB_URI` possess least-privilege read/write role access scoped strictly to the `ewmp` database.
2. The MongoDB Atlas Network Access security group is configured to whitelist the specific static public IP addresses or NAT Gateway IPs of the deployment host servers (avoid using `0.0.0.0/0` in production).

### Transactions

EWMP domain services rely heavily on Mongoose multi-document ACID transactions to maintain data integrity across complex relational updates. For example:
* `server/services/employeeService.js`: Wraps employee onboarding, role assignment, and initial document record creation within an atomic transaction. If document linking fails, the entire employee creation rolls back.
* `server/services/payrollService.js`: Executes monthly payroll calculations, salary structure modifications, and payslip generation within atomic transactions to prevent partial salary disbursements or orphaned financial records.

**CRITICAL DEPLOYMENT REQUIREMENT**: Multi-document transactions in MongoDB are supported **exclusively on Replica Set and Sharded Cluster topologies**. Attempting to run the EWMP backend against a standalone, single-node MongoDB instance will cause transaction execution failures (`Transaction numbers are only allowed on a replica set member or mongos`). Verify that your target MongoDB Atlas cluster operates as a minimum 3-node replica set.

### Indexes

Database schema performance is maintained via declarative index definitions within Mongoose model schemas (`server/models/`). These include:
* **Unique Indexes**: Enforced on user authentication identifiers (`User.email`), employee codes (`Employee.employeeId`), and organization registration domains to prevent duplicate data insertion.
* **Compound Indexes**: Defined on high-frequency relational query paths, such as `[{ organizationId: 1, departmentId: 1 }]` on employees, `[{ employeeId: 1, date: -1 }]` on attendance records, and `[{ organizationId: 1, status: 1 }]` on leave requests and payroll records.
* **AI Telemetry Indexes**: Indexed on `[{ userId: 1, createdAt: -1 }]` within `AIConversation` and `AIMessage` schemas to accelerate historical chat retrieval.

In production deployments, ensure that Mongoose index creation is validated during deployment staging or execute automated indexing scripts prior to live traffic redirection.

---

## AI Deployment

The AI Operations Assistant module (`server/ai/*`) enhances enterprise workforce management with conversational querying, summarization, analytical insights, and workflow simulation.

### Gemini Configuration

The artificial intelligence engine is powered by Google Gemini, configured within `server/config/gemini.js`. The module initializes the `GoogleGenerativeAI` client SDK utilizing the secret `GEMINI_API_KEY` and targets the model specified in `GEMINI_MODEL` (defaulting to `gemini-2.5-flash`).

To protect application stability, `configureGemini()` wraps SDK initialization in a try-catch block. If `GEMINI_API_KEY` is undefined or invalid, the module logs an operational warning (`GEMINI_API_KEY is not configured. AI features will be unavailable.`) without crashing the application server. Domain controllers accessing AI capabilities invoke `getGeminiClient()`, which throws a caught operational exception if called when AI infrastructure is unconfigured.

### Provider Selection

The backend implements an abstracted provider factory architecture (`server/ai/providers/providerFactory.js`) designed to support interchangeable LLM provider backends. During request routing, the factory resolves the active provider by evaluating `config.ai.provider` (populated via the `AI_PROVIDER` environment variable, defaulting to `'gemini'`).

When `'gemini'` is selected, the factory instantiates `GeminiProvider`, which translates standardized EWMP system prompts and user chat contexts into Gemini-compatible payload structures.

### Health Endpoint

The AI module exposes a dedicated diagnostic monitoring endpoint to verify artificial intelligence infrastructure availability and subsystem health:

* **Endpoint**: `GET /api/ai/health`
* **Authentication**: Requires valid JWT Access Token (`verifyToken`) and verified user role (`checkRole(ALL_ROLES)`).
* **Controller**: `aiController.getHealthStatus` -> invokes `aiService.getHealthStatus()`.

**Response Payload Structure:**
The endpoint aggregates telemetry across AI providers, caching layers, optimization metrics, and registered plugins, returning an HTTP 200 JSON structure:
```json
{
  "success": true,
  "message": "AI Infrastructure Ready",
  "data": {
    "status": "healthy",
    "provider": "gemini",
    "model": "gemini-2.5-flash",
    "optimization": {
      "metrics": {
        "totalRequests": 142,
        "successfulRequests": 140,
        "failedRequests": 2,
        "averageLatencyMs": 412
      },
      "cache": {
        "hits": 38,
        "misses": 104,
        "size": 15
      },
      "healthMonitor": {
        "state": "CLOSED",
        "failures": 0
      }
    },
    "plugins": [
      { "name": "AttendancePlugin", "status": "active" },
      { "name": "PayrollPlugin", "status": "active" },
      { "name": "LeavePlugin", "status": "active" }
    ]
  }
}
```

---

## Cloudinary Configuration

### Explain

The EWMP backend integrates Cloudinary (`server/config/cloudinary.js`) to serve as an external cloud storage CDN for all user-generated files and media assets. In an enterprise workforce management platform, employees frequently upload profile photographs, identification documents, medical leave certificates, and candidate resumes. 

Storing large binary blobs directly within MongoDB databases or local server filesystems degrades database performance, consumes local disk space, and prevents horizontal server scaling. Offloading file storage to Cloudinary ensures secure CDN asset delivery, automatic image optimization, and robust storage redundancy.

### Credentials

Cloudinary SDK initialization requires configuring three environment variables in `server/.env`:
* `CLOUDINARY_CLOUD_NAME`: The unique cloud identifier assigned to your Cloudinary account.
* `CLOUDINARY_API_KEY`: The public API authentication key.
* `CLOUDINARY_API_SECRET`: The secret API cryptographic key used to sign upload payloads.

When `configureCloudinary()` executes during startup, it passes these credentials to `cloudinary.config()` alongside `secure: true`, guaranteeing that all generated media URLs enforce SSL/HTTPS encryption.

### Upload Flow

The file upload architecture (`API_SPECIFICATION.md Section 14`) implements a structured, multi-stage processing pipeline:

1. **Multipart Ingestion**: An authenticated client transmits a multipart form-data request containing file attachments to an upload endpoint (e.g., `/api/documents/upload` or `/api/recruitment/candidates`).
2. **Multer Interception & Validation**: Multer middleware (`multer`) intercepts the incoming request buffer. Before storage processing occurs, Multer validates the attachment against strict system constraints defined in `server/config/constants.js`:
   * *File Size Thresholds*: Enforces `FILE_UPLOAD_LIMITS` (Documents: 10 MB max; Resumes: 10 MB max; Profile Photos: 5 MB max). If an upload exceeds these limits, Multer throws a `FILE_TOO_LARGE` exception.
   * *MIME-Type Whitelisting*: Verifies file format against `ALLOWED_MIME_TYPES` (`application/pdf`, `image/jpeg`, `image/png`, and `.docx` for documents). Invalid formats trigger an `INVALID_FILE_TYPE` error.
3. **Cloudinary SDK Transfer**: Validated file buffers are streamed from memory directly to Cloudinary via programmatic SDK upload methods.
4. **Metadata Persistence**: Cloudinary stores the file and returns a structured asset confirmation containing a secure CDN URL (`secure_url`) and a unique asset identifier (`public_id`).
5. **Database Record Creation**: The domain controller extracts `secure_url` and `public_id`, saving these strings inside the corresponding Mongoose document record (`Document`, `EmployeeDocument`, or `Candidate`). The physical file blob is never saved to the database.

---

## Email Configuration

### SMTP

Outbound email communications are managed by the transactional email utility located in `server/utils/sendEmail.js`. This module instantiates a Nodemailer transport configured dynamically via system environment variables (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`).

The transport automatically adjusts its cryptographic handshake based on the configured network port:
* If `EMAIL_PORT` evaluates to `465`, the transport enables implicit SSL/TLS encryption (`secure: true`).
* If `EMAIL_PORT` evaluates to `587` (or any other standard relay port), the transport initiates an unencrypted connection and upgrades to TLS via explicit STARTTLS negotiation (`secure: false`).

### Mailtrap

For development engineering and integration testing, Mailtrap (`https://mailtrap.io`) is the supported email sandbox environment. Mailtrap intercepts outbound emails and displays them within a web-based inbox, preventing test messages from accidentally reaching real employee email addresses.

To configure Mailtrap in `server/.env`:
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USER=your_mailtrap_inbox_username
EMAIL_PASS=your_mailtrap_inbox_password
EMAIL_FROM=noreply@ewmp.local
```

**Stub Mode Safety Feature**: To prevent application crashes during local development when internet connectivity or email accounts are unavailable, `sendEmail.js` checks if `config.env === 'test'` or if `config.email.host` is undefined. If either condition is true, the function logs the email metadata (`[Email Stub] To: <recipient> | Subject: <subject>`) to Winston loggers and returns successfully without attempting network transmission.

### Production SMTP

For live production infrastructure, replace Mailtrap settings with credentials from a high-deliverability enterprise SMTP relay service (such as Amazon SES, SendGrid, Mailgun, or Google Workspace).

To ensure reliable email delivery and prevent spam folder routing in production:
1. Verify that the domain specified in `EMAIL_FROM` (e.g., `no-reply@ewmp-enterprise.com`) has valid SPF, DKIM, and DMARC cryptographic DNS records published in your domain registrar.
2. Ensure network security groups and cloud firewalls permit outbound egress on TCP port 587 or 465.
3. Note that in production mode (`NODE_ENV === 'production'`), if SMTP network transmission fails during a transaction, `sendEmail.js` explicitly re-throws the underlying exception, ensuring calling services can log or handle the delivery failure appropriately.

---

## Production Security Checklist

Prior to signing off on an enterprise production deployment, DevOps engineers must execute and verify every item in the comprehensive security hardening checklist below:

| Security Domain | Verification Item | Technical Implementation & Enforcement | Status |
| :--- | :--- | :--- | :--- |
| **HTTPS Encryption** | Enforce TLS/HTTPS termination across all public endpoints. | Configure an upstream reverse proxy (Nginx, AWS ALB, Cloudflare) to terminate TLS 1.2+ encryption on TCP port 443 and forward decrypted traffic to Express on port 5000. | `[ ]` |
| **JWT Access Secrets** | Provision high-entropy cryptographic access token secrets. | Verify `JWT_SECRET` in `server/.env` is a random 64-byte hexadecimal string. Confirm `validateConfig()` terminates boot if default placeholders are present. | `[ ]` |
| **JWT Refresh Secrets** | Provision distinct, high-entropy refresh token secrets. | Verify `JWT_REFRESH_SECRET` is a random 64-byte hex string completely unique from `JWT_SECRET`. Confirm default placeholder rejection in production. | `[ ]` |
| **Environment Variables** | Protect sensitive API keys and database connection URIs. | Ensure `server/.env` file permissions are restricted to OS read-only (`chmod 600`). Verify `.env` files are ignored in `.gitignore` and never committed to Git. | `[ ]` |
| **Rate Limiting** | Prevent brute-force login and Denial-of-Service attacks. | Confirm `apiRateLimiter` (`express-rate-limit`) is actively mounted on `/api` routes in `app.js` to restrict repetitive client request frequencies. | `[ ]` |
| **Helmet Headers** | Inject protective HTTP response security headers. | Confirm `app.use(helmet())` executes as the first middleware in `app.js`, enforcing HSTS, X-Frame-Options (DENY), and X-Content-Type-Options (nosniff). | `[ ]` |
| **CORS Access Rules** | Restrict cross-origin browser requests to verified domains. | Confirm `cors()` middleware in `app.js` strictly restricts allowed origins to `CLIENT_URL`, enables `credentials: true`, and whitelists standard REST methods. | `[ ]` |

---

## Monitoring

### Logs

The EWMP backend implements structured, persistent filesystem logging via Winston (`server/config/logger.js`) and HTTP request tracking via Morgan/custom request middleware (`server/middleware/requestLogger.js`).

All application events, exceptions, database state transitions, and security alerts are recorded to rotating filesystem logs stored inside `server/logs/`:
* `server/logs/error.log`: Records exclusively error-level events, unhandled promise rejections, uncaught exceptions, and stack traces.
* `server/logs/combined.log`: Records all operational log events across informational, warning, and error severity levels.

**Log Rotation Configuration:** Both filesystem transports enforce automated log rotation configured with `maxsize: 5242880` bytes (5 MB per log file) and `maxFiles: 5`. Once a log file reaches 5 MB, Winston automatically rotates and archives the file, maintaining up to 5 historical archives (25 MB total per transport) to prevent disk space exhaustion.

### Health Endpoints

To support automated load balancer health checks, Kubernetes liveness probes, and uptime monitoring services, the Express application registers two unauthenticated, high-performance health endpoints in `app.js`:

* **Endpoints**: `GET /health` and `GET /api/health`
* **Authentication**: None required (publicly accessible).
* **Behavior**: Returns an immediate HTTP 200 OK JSON response confirming server operational status, database connectivity, and environment metadata:

```json
{
  "success": true,
  "message": "EWMP API is running",
  "data": {
    "status": "healthy",
    "timestamp": "2026-07-07T11:50:52.000Z",
    "database": "connected",
    "version": "1.0.0",
    "environment": "production"
  }
}
```

### AI Health Endpoint

To monitor the operational integrity of the generative AI subsystem, system administrators can query the specialized AI diagnostic endpoint:

* **Endpoint**: `GET /api/ai/health`
* **Authentication**: Requires valid JWT token and verified user role.
* **Behavior**: Aggregates real-time diagnostic metrics from the Gemini AI provider, prompt optimization cache statistics, provider circuit breaker health, and AI module plugin initialization states.

---

## Troubleshooting

This section provides authoritative diagnostic analysis and step-by-step resolution workflows for operational failures that may occur during EWMP backend deployment or runtime execution.

### Common Startup Failures

#### Port Address Already in Use (`EADDRINUSE`)
* **Symptom**: Server crashes immediately upon running `npm start` with log output: `Error: listen EADDRINUSE: address already in use :::5000`.
* **Root Cause**: Another application process or an orphaned background instance of the EWMP server is already bound to TCP port 5000.
* **Resolution**:
  1. Identify the process ID (PID) occupying port 5000:
     * On Linux / macOS: `lsof -i :5000` or `netstat -tulpn | grep :5000`
     * On Windows PowerShell / CMD: `netstat -ano | findstr :5000`
  2. Terminate the conflicting process using its PID:
     * On Linux / macOS: `kill -9 <PID>`
     * On Windows: `taskkill /F /PID <PID>`
  3. Alternatively, update `PORT` in `server/.env` to an available network port (e.g., `PORT=5001`).

#### Fatal Uncaught Exception / Unhandled Promise Rejection
* **Symptom**: Process terminates unexpectedly with log record: `UNCAUGHT EXCEPTION! Shutting down...` or `UNHANDLED REJECTION! Shutting down...`.
* **Root Cause**: A syntax error, missing dependency, or unhandled asynchronous database timeout occurred during top-level module evaluation.
* **Resolution**: Inspect the stack trace recorded in `server/logs/error.log`. Verify that all dependencies are installed via `npm install` and confirm that target cloud infrastructure (MongoDB Atlas) is network accessible.

### Mongo Connection Failures

#### Mongoose Server Selection Timeout Error
* **Symptom**: Process aborts startup with error: `MongoDB connection failed: MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster`.
* **Root Cause**: The application server cannot establish a TCP network connection to the MongoDB Atlas cluster within the configured 5000ms timeout window.
* **Resolution**:
  1. Verify that `MONGODB_URI` in `server/.env` is formatted correctly and contains valid database credentials.
  2. Log into the MongoDB Atlas Console, navigate to **Security** -> **Network Access**, and confirm that the deployment host's public IP address is whitelisted. For testing, add temporary access rule `0.0.0.0/0`.
  3. Verify that outbound TCP port 27017 is not blocked by local OS firewalls (`iptables`, UFW, or Windows Firewall) or cloud VPC security groups.
  4. Check local DNS resolution to ensure cluster hostnames resolve properly.

### JWT Validation Failures

#### Production Secret Placeholder Termination
* **Symptom**: Server terminates immediately during boot in production with console log: `JWT_SECRET cannot use insecure default placeholder values in production. Application terminated.`
* **Root Cause**: The application was launched with `NODE_ENV=production`, but `server/.env` still contains default placeholder strings (`ewmp_dev_jwt_secret_key_...`).
* **Resolution**: Generate secure 64-byte hexadecimal strings using Node.js crypto (`node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) and assign them to `JWT_SECRET` and `JWT_REFRESH_SECRET` in `server/.env`.

#### Client Authentication HTTP 401 Unauthorized Errors
* **Symptom**: API endpoints reject client requests with `401 Unauthorized - Token expired or invalid`.
* **Root Cause**: The client access token has exceeded its lifespan (`JWT_ACCESS_EXPIRY=15m`), or system clock drift exists between the server and token issuer.
* **Resolution**: Ensure deployment server system time is synchronized via NTP. Verify that the frontend client correctly implements the automated refresh token exchange flow against `/api/auth/refresh`.

### Missing Env Variables

* **Symptom**: Server aborts execution during initialization with log entry: `[VAR_NAME] is missing. Application terminated.`
* **Root Cause**: `config.validateConfig()` detected that a core required environment variable (`PORT`, `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`, or `JWT_REFRESH_SECRET`) is undefined or empty.
* **Resolution**: Cross-reference `server/.env` against `server/.env.example` and ensure every mandatory variable key is defined and assigned a valid configuration value.

### Gemini Failures

#### AI Features Report Degraded Status or Unavailable Warnings
* **Symptom**: Server logs warning during boot: `GEMINI_API_KEY is not configured. AI features will be unavailable.` Requests to `/api/ai/*` endpoints return HTTP 503 or operational errors.
* **Root Cause**: `GEMINI_API_KEY` is missing in `server/.env`, the provided API key is invalid, or Google AI Studio project quota limits have been exceeded.
* **Resolution**:
  1. Verify that `GEMINI_API_KEY` contains a valid API key generated from Google AI Studio.
  2. Confirm that the target model specified in `GEMINI_MODEL` (default `gemini-2.5-flash`) is supported and active in your Google Cloud project.
  3. Check Google AI Studio usage dashboards to verify API request quotas and billing status.

### Cloudinary Failures

#### Multipart File Upload Rejection or HTTP 500 Errors
* **Symptom**: Requests to file upload endpoints fail with HTTP 500 errors or Zod/Multer validation exceptions (`FILE_TOO_LARGE` or `INVALID_FILE_TYPE`).
* **Root Cause**: Cloudinary credentials are missing in `server/.env`, or the uploaded attachment violates Multer size and format restrictions.
* **Resolution**:
  1. Confirm `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are assigned valid console credentials in `server/.env`.
  2. Verify that the uploaded attachment complies with `FILE_UPLOAD_LIMITS` defined in `constants.js` (10 MB maximum for documents and resumes; 5 MB maximum for employee profile photos).
  3. Ensure the attachment file extension and MIME type match allowed specifications (`application/pdf`, `image/jpeg`, `image/png`, or `.docx`).

### SMTP Failures

#### Transactional Email Transmission Authentication Errors
* **Symptom**: Server logs error during onboarding or password reset workflows: `Failed to send email to <recipient>: Error: Invalid login: 535 Authentication failed`.
* **Root Cause**: SMTP relay credentials in `EMAIL_USER` and `EMAIL_PASS` are incorrect, or the mail relay provider forbids unauthenticated SMTP connections.
* **Resolution**:
  1. Verify `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` against your mail provider's SMTP configuration settings.
  2. If using Gmail or Google Workspace SMTP, ensure 2-Step Verification is enabled and generate an **App Password**; standard account passwords are rejected by Google SMTP relays.
  3. For debugging, temporarily comment out `EMAIL_HOST` or set `NODE_ENV=test` to enable Nodemailer stub logging mode, confirming whether the failure is caused by network transmission or application logic.

---

## Backup

Per the authoritative database specifications documented in `DATABASE_DESIGN.md Section 9 (Backup & Recovery)`, the EWMP backend currently relies on MongoDB Atlas managed cloud infrastructure for automated data protection, backup retention, and disaster recovery.

### Current Implementation & Cloud Assumptions

* **Automated Continuous Snapshots**: MongoDB Atlas automatically captures continuous cluster disk snapshots every 24 hours, maintaining a rolling retention window of 7 to 30 days based on corporate tier configurations.
* **Point-in-Time Recovery (PITR)**: Production clusters utilize MongoDB Atlas oplog (operations log) journaling to enable point-in-time recovery. This allows database administrators to restore cluster databases to any exact second within the retention window prior to an accidental data deletion or infrastructure fault.
* **Replica Set High Availability**: All production database deployments operate across multi-region MongoDB Replica Sets (minimum 1 Primary and 2 Secondary nodes). If a primary database node experiences hardware failure or network partition, an automated failover election promotes a secondary node to primary within milliseconds without data loss or application downtime.

**Implementation Scope Note**: The current project codebase implements strictly application-level data persistence and transaction management. No automated custom database dump scripts, local filesystem backup cron jobs, or external backup scheduling tools are implemented within the project repository. Do not invent or deploy unsupported automated local backup scripts without formal architectural review.

---

## Known Limitations

The following architectural and operational limitations reflect the exact implemented capabilities of the current EWMP backend, as identified in `SYSTEM_ARCHITECTURE.md Section 8` and `DATABASE_DESIGN.md Section 10`:

1. **In-Memory Rate Limiting and AI Caching**: API rate limiting counters (`express-rate-limit`) and AI response caches (`server/ai/optimization/cacheManager.js`) currently utilize Node.js local instance memory. In horizontally scaled multi-node deployments running behind a load balancer, rate limit counters and cached LLM responses are not currently synchronized across independent server processes or pods.
2. **Unbounded Audit Log Accumulation**: The `AuditLog` and `ActivityLog` collections record system compliance and user activity events indefinitely. There is currently no automated background archiving task or MongoDB Time-To-Live (TTL) index configuration implemented to prune older non-regulatory audit events over time.
3. **Absence of Asynchronous Cloud Antivirus Scanning**: While uploaded employee resumes and corporate documents undergo strict Multer MIME-type and file size threshold enforcement before uploading to Cloudinary, `Document` and `EmployeeDocument` schemas do not currently store metadata fields tracking asynchronous cloud antivirus scan statuses (`scanStatus`, `scannedAt`, `virusSignature`), nor is an automated malware scanning pipeline currently integrated prior to file serving.

---

## Future Improvements

The following architectural enhancements and infrastructure optimizations were formally identified during the enterprise post-remediation audit for scheduled implementation during future DevOps hardening cycles, as documented in `SYSTEM_ARCHITECTURE.md Section 9` and `DATABASE_DESIGN.md Section 11`:

1. **Distributed Redis Adapter Integration**: Implement an optional `ioredis` storage adapter for `server/config/rateLimiter.js` and `server/ai/optimization/cacheManager.js` to enable synchronized rate-limiting counters and shared AI prompt/response caching across horizontally scaled production server clusters.
2. **Automated Audit Log Pruning & Archiving**: Configure an automated monthly background archiving cron job or establish MongoDB Time-To-Live (TTL) indexes (`{ expireAfterSeconds: 157680000 }`) on non-regulatory `AuditLog` and `ActivityLog` entries older than 3 to 7 years in alignment with corporate compliance retention schedules.
3. **Cloud Antivirus Webhook Pipeline**: Integrate an asynchronous virus scanning webhook (such as a ClamAV daemon or AWS Lambda cloud storage virus scanning service) inside the file upload pipeline (`uploadMiddleware.js` and `fileUploadUtil.js`) to scan uploaded resumes and corporate documents before marking them as active in database records.
4. **Explicit Mongoose Network Failover Thresholds**: Explicitly define advanced network failover thresholds (`serverSelectionTimeoutMS: 5000`, `socketTimeoutMS: 45000`, `maxPoolSize: 50`) within the Mongoose connection options array in `server/config/db.js` to ensure predictable failover behavior during cloud network latency spikes.
