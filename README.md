# Enterprise Workforce Management Platform (EWMP)

> A full-stack HR and workforce management solution built with the MERN stack, AI-assisted operations, and enterprise-grade architecture.

---

## Technology Stack

| Layer       | Technology                                 |
|-------------|---------------------------------------------|
| Frontend    | React 18 + Vite + TanStack Query + Tailwind CSS |
| Backend     | Node.js + Express.js                        |
| Database    | MongoDB Atlas (Mongoose ODM)                |
| Auth        | JWT (access token + HTTP-only refresh cookie) |
| File Storage| Cloudinary                                  |
| AI          | Google Gemini 2.0 Flash                    |
| Email       | Nodemailer (SMTP)                           |

---

## Project Structure

```
ewmp/
├── client/          React + Vite frontend
├── server/          Node.js + Express backend
├── docs/            All specification documents
├── scripts/         Utility scripts (seed, migrate)
└── .github/         CI/CD workflows
```

---

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

### 1. Clone and install

```bash
git clone https://github.com/divya6394mishra12/EWMP.git
cd ewmp

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Configure environment

```bash
# Backend
cp server/.env.example server/.env
# Edit server/.env with your actual credentials

# Frontend
cp client/.env.example client/.env.local
# Edit client/.env.local with your API URL
```

### 3. Run development servers

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

### 4. Verify installation

Open `http://localhost:5000/api/health` — should return:
```json
{ "success": true, "status": "healthy", "database": "connected" }
```

---

## API Documentation

See [`docs/API_SPECIFICATION.md`](docs/API_SPECIFICATION.md) for the complete REST API contract.

## Architecture

See [`docs/ARCHITECTURE_REVISION.md`](docs/ARCHITECTURE_REVISION.md) for the definitive technical architecture.

## Development Order

See [`docs/DEVELOPMENT_ORDER.md`](docs/DEVELOPMENT_ORDER.md) for the implementation roadmap.

---

## User Roles

| Role         | Description                          |
|--------------|--------------------------------------|
| SUPER_ADMIN  | Platform administrator               |
| ORG_ADMIN    | Organization administrator           |
| HR_MANAGER   | Human resources manager              |
| FINANCE      | Finance and payroll officer          |
| MANAGER      | Department manager                   |
| TEAM_LEAD    | Team lead                            |
| EMPLOYEE     | Standard employee                    |
| IT_ADMIN     | IT and asset administrator           |
| AUDITOR      | Read-only auditor                    |

---

## License

MIT License — see [LICENSE](LICENSE)
