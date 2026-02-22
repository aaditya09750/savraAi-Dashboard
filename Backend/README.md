# SAVRA Backend

Production-ready Express + MongoDB backend for the existing SAVRA admin frontend.

## Repository

- `https://github.com/aaditya09750/savraAi-Dashboard`

## Tech Stack

- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT authentication
- Joi request validation
- Helmet, CORS, rate limiting, Mongo sanitize, HPP

## Folder Structure

```txt
Backend/
  src/
    app.js
    server.js
    config/
    controllers/
    services/
    models/
    routes/
    middlewares/
    validations/
    utils/
    data/
    scripts/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB Atlas connection string and JWT secret.

4. Seed baseline data and admin user:

```bash
npm run seed
```

Optional reset + reseed:

```bash
npm run seed:reset
```

5. Start server:

```bash
npm run dev
```

## Default Seeded Login

- Username: `Admin`
- Password: `Savra@321`

## Base URL

- Local: `http://localhost:5000`
- Local API prefix: `/api/v1`
- Live API: `https://savra-server.vercel.app/api/v1`
- Live Dashboard: `https://savra-ai-dashboard.vercel.app`

## API Endpoints

### Health

- `GET /api/v1/health`

### Auth

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Dashboard

- `GET /api/v1/dashboard?timeRange=week|month|year&class=All|<class>&subject=All|<subject>&search=<text>`

Dashboard response includes:
- KPI metrics
- Weekly trend chart data
- `pulseData` with AI-generated insight cards from live activity comparisons
- `aiSummary` narrative summary text

### Metadata

- `GET /api/v1/meta/filters`

### Teachers

- `GET /api/v1/teachers?search=<text>&class=All|<class>&subject=All|<subject>&page=1&limit=50`
- `GET /api/v1/teachers/:teacherId?timeRange=week|month|year&class=All|<class>&subject=All|<subject>`
- `GET /api/v1/teachers/:teacherId/report.csv`

## Response Format

Successful JSON response:

```json
{
  "success": true,
  "message": "Request processed successfully.",
  "data": {},
  "requestId": "..."
}
```

Error response:

```json
{
  "success": false,
  "message": "Request validation failed.",
  "errors": [],
  "requestId": "..."
}
```
