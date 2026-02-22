# SAVRA - Insights Dashboard

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

A production-style full-stack analytics platform for school administrators. This system converts teacher activity logs into actionable insights with KPI cards, weekly trends, per-teacher analysis, CSV exports, AI-generated pulse summaries, and secure JWT authentication.

## Live Preview

**Experience the application live:** [Coming Soon]

![Live Demo](https://img.shields.io/badge/Live%20Demo-Coming%20Soon-yellow?style=for-the-badge&logo=vercel&logoColor=white)

## Core Features

**Secure Admin Authentication** - JWT-based login flow with bcrypt password hashing, protected routes, startup bootstrap for admin user availability, and automatic session validation on frontend startup.

**Teacher Insights Dashboard** - Aggregated KPI cards for active teachers, lessons created, assessments made, quizzes conducted, and submission rate across configurable time ranges (week, month, year).

**Weekly Activity Trends** - Chart-ready weekly activity data generation with class and subject filters, optimized for fast visualization in the admin dashboard.

**Per Teacher Analysis** - Dedicated teacher view with activity statistics, class-wise breakdown, recent activity timeline, and contextual performance note for low-engagement patterns.

**Filterable Data Exploration** - Dynamic class and subject filter metadata from backend, search support, and real-time filtered analytics for both dashboard and teacher views.

**CSV Report Export** - One-click downloadable teacher activity report from backend endpoint with normalized record formatting.

**AI-Generated Insight Summaries (Bonus)** - Backend computes natural-language pulse summaries by comparing current period vs previous period activity trends and sends both summary cards and narrative text to frontend.

**Duplicate Entry Handling (Hidden Twist)** - Signature-based deduplication with unique index enforcement and idempotent upsert ingestion ensures duplicate logs are handled gracefully.

## Technology Stack

| Technology | Version | Purpose | Implementation |
|------------|---------|---------|----------------|
| React | 19.x | Frontend UI | Functional components with hooks and route guards |
| TypeScript | 5.x | Type safety | Shared interfaces for API contracts and UI state |
| Vite | 6.x | Frontend build tool | Fast local dev server and optimized production build |
| Express | 4.x | Backend API server | Modular routes/controllers/services architecture |
| Node.js | 18+ | Runtime | Asynchronous API and scripting runtime |
| MongoDB Atlas | Cloud | Persistent data store | Activity and user data storage |
| Mongoose | 8.x | ODM | Schema modeling, indexing, and query optimization |
| JWT | 9.x | Authentication | Bearer token auth for protected API access |
| Joi | 17.x | Validation | Request payload/query/params validation |
| Helmet + Rate Limit + HPP | Latest | Security hardening | Secure headers, throttling, and query pollution protection |
| Axios | 1.x | HTTP client | Frontend API service layer with auth interceptor |
| Recharts | 3.x | Data visualization | Weekly trend and class breakdown charts |
| Tailwind CSS | 3.x | Styling | Responsive dashboard UI |

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- MongoDB Atlas cluster (recommended) or local MongoDB
- Git

### Step-by-Step Installation

#### Step 1: Clone Repository

```bash
git clone <your-repository-url>
cd savraAi-admin
```

#### Step 2: Install Backend Dependencies

```bash
cd Backend
npm install
```

#### Step 3: Configure Backend Environment

Create `Backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/savra_admin?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_minimum_32_character_secret_value
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
BCRYPT_SALT_ROUNDS=12
LOG_LEVEL=info
SEED_ADMIN_USERNAME=Admin
SEED_ADMIN_PASSWORD=Savra@321
SEED_ADMIN_ROLE=ADMIN
```

#### Step 4: Seed Data

```bash
npm run seed
```

For clean reseed:

```bash
npm run seed:reset
```

#### Step 5: Start Backend

```bash
npm run dev
```

#### Step 6: Install Frontend Dependencies

```bash
cd ..
cd Frontend
npm install
```

#### Step 7: Configure Frontend Environment

Create `Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

#### Step 8: Start Frontend

```bash
npm run dev
```

### Access URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`
- Health check: `http://localhost:5000/api/v1/health`

### Default Admin Credentials

- Username: `Admin`
- Password: `Savra@321`

## Application Usage

### Dashboard Flow

1. Login as admin.
2. View KPI cards for current selected time range.
3. Analyze weekly trend chart.
4. Apply class and subject filters.
5. Review AI pulse summary cards and narrative insights.

### Teacher Flow

1. Open teacher list.
2. Search or filter teachers.
3. Open teacher detail page.
4. Review lessons/quizzes/assessments and class distribution.
5. Export activity CSV report.

## API Documentation

### Health

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/v1/health` | GET | Service health status | No |

### Authentication

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/v1/auth/login` | POST | Admin login and token issue | No |
| `/api/v1/auth/me` | GET | Current authenticated profile | Yes |

### Dashboard

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/v1/dashboard` | GET | Metrics, weekly trend, AI pulse data, AI summary | Yes |

Query params:
- `timeRange=week|month|year`
- `class=All|<class>`
- `subject=All|<subject>`
- `search=<text>`

### Metadata

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/v1/meta/filters` | GET | Available classes and subjects | Yes |

### Teachers

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/v1/teachers` | GET | Teacher directory with pagination/filter | Yes |
| `/api/v1/teachers/:teacherId` | GET | Teacher overview analytics | Yes |
| `/api/v1/teachers/:teacherId/report.csv` | GET | Download teacher activity report | Yes |

## System Architecture

```txt
Frontend (React + TypeScript + Vite)
  -> components/pages/hooks/services/context
  -> Axios API client with auth token interceptor
  -> Protected routes and session bootstrap
         |
         v
Backend (Express + MongoDB + Mongoose)
  -> routes
  -> controllers
  -> services
  -> models
  -> middleware (auth, validation, error, security)
  -> utilities (JWT, CSV, date, logger, signature)
         |
         v
MongoDB Atlas
  -> users
  -> activitylogs
```

## Data Modeling and Duplicate Strategy

### Activity Log Record Fields

- `teacherId`
- `teacherName`
- `activityType` (`Lesson Plan`, `Quiz`, `Question Paper`)
- `createdAt`
- `subject`
- `class`
- `signature` (composite unique fingerprint)

### Duplicate Handling

- Every record gets a deterministic signature:
  - `teacherId-createdAt-activityType-subject-class`
- Signature has a unique index in MongoDB.
- Seed/bootstrap uses upsert by signature.
- Duplicate inserts return graceful conflict handling where relevant.

## Architecture Decisions

1. **Layered architecture** for maintainability and testability:
   - Routes -> Controllers -> Services -> Models.
2. **Mongoose indexing strategy** to optimize analytics queries by teacher, class, subject, activity type, and time.
3. **Request validation at boundary** using Joi middleware for stable API contracts.
4. **Centralized error handling** for consistent API response shape and operational logging.
5. **Security-first middleware stack** with Helmet, rate limiting, sanitize, and HPP.
6. **Frontend API abstraction** with dedicated service modules and typed responses.
7. **Auth context + route guards** for clean access control and user state handling.
8. **AI insights implemented server-side** to keep business logic centralized and frontend simple.

## Future Scalability Improvements

1. Add Redis caching for dashboard aggregates and filter metadata.
2. Precompute analytics in background jobs for high-volume schools.
3. Add refresh tokens and secure cookie strategy for hardened auth.
4. Introduce multi-tenant schema boundaries for district-level isolation.
5. Add audit trails and event sourcing for critical admin actions.
6. Add queue-backed export generation for large CSV workloads.
7. Add observability stack (OpenTelemetry + metrics dashboards + alerts).
8. Add automated test suite (unit, integration, and API contract tests).

## Project Structure

```txt
savraAi-admin/
├── Backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── validations/
│   │   ├── utils/
│   │   ├── scripts/
│   │   └── data/
│   └── README.md
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── types/
│   │   └── layouts/
│   └── vite.config.ts
└── README.md
```

## Deployment Guide

### Frontend Deployment (Vercel/Netlify)

- Build command: `npm run build`
- Output directory: `dist`
- Env var:
  - `VITE_API_BASE_URL=https://<your-backend-domain>/api/v1`

### Backend Deployment (Render/Railway/Fly)

- Start command: `npm start`
- Required env vars:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CORS_ORIGIN`
  - plus remaining variables from `Backend/.env.example`

## Contact

For assignment review and discussion:
- Email: `aadigunjal0975@gmail.com`
- GitHub: `https://github.com/aaditya09750`

---

**SAVRA - Teacher Insights Dashboard** is designed as a production-minded analytics system focused on clean architecture, secure APIs, scalable data modeling, and actionable insights for academic administrators.

