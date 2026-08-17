# ImCam Hub — Backend API

Node.js / Express REST API for the ImCam Hub immigration case management SaaS.

## Tech Stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express 4
- **Database:** PostgreSQL (via `pg` driver — raw SQL, no ORM)
- **Auth:** JWT (`jsonwebtoken`) + bcryptjs
- **Validation:** express-validator

## Local Setup

### Prerequisites

- Node.js ≥ 18
- PostgreSQL (local or a Neon free-tier database)

### 1. Clone & install

```bash
cd imcam-hub-backend
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Example |
|---|---|
| `PORT` | `5000` |
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/imcamhub?sslmode=require` |
| `JWT_SECRET` | any long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `http://localhost:5173` (comma-separate multiple origins) |

### 3. Run the migration

```bash
psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### 4. Start the server

```bash
npm run dev    # development (auto-restart via --watch)
npm start      # production
```

The API runs at `http://localhost:5000` by default.

## API Endpoints

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Returns `{ status: "ok" }` |

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in, returns JWT |
| GET | `/api/auth/me` | Bearer token | Get current user |

**Register body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Jane Doe",
  "role": "client"
}
```
`role` is optional, defaults to `client`. Allowed values: `admin`, `caseworker`, `candidate`, `client`.

**Login response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "...", "fullName": "...", "role": "client", "createdAt": "..." }
}
```

### Demo Requests

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/demo-requests` | No | Submit the Book a Demo form |
| GET | `/api/demo-requests` | Admin | List all leads (paginated) |
| GET | `/api/demo-requests/:id` | Admin | Get a single lead |
| PATCH | `/api/demo-requests/:id` | Admin | Update lead status |

**POST body:**
```json
{
  "company": "Acme Immigration Law",
  "fullName": "Jane Doe",
  "email": "jane@acme.com",
  "phone": "+1 555 123 4567",
  "firmSize": "11-50",
  "message": "We need better case tracking."
}
```

`phone` and `message` are optional. `firmSize` must be one of: `1-10`, `11-50`, `51-200`, `201-1000`, `1000+`.

**GET list response (admin):**
```json
{
  "data": [ ... ],
  "pagination": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 }
}
```
Filter by status: `GET /api/demo-requests?status=new&page=1&limit=10`

**PATCH body:**
```json
{ "status": "contacted" }
```
Allowed values: `new`, `contacted`, `scheduled`, `closed`.

### Error Responses

| Status | When |
|---|---|
| 400 | Validation failure (missing/invalid fields) |
| 401 | Missing or invalid JWT |
| 403 | Authenticated but wrong role |
| 404 | Resource not found |
| 409 | Duplicate email on registration |
| 500 | Unexpected server error |

## Logout

This is a stateless JWT setup — logout is client-side only (discard the token). No server-side token blacklist.

## Postman Collection

Import `postman_collection.json` into Postman. It covers every endpoint with happy-path and key error-case tests. Set the `baseUrl` variable in the collection to your local or deployed URL.

## Deploy to Render + Neon

### Neon (Database)

1. Create a free-tier project at [neon.tech](https://neon.tech).
2. Copy the connection string (with `?sslmode=require`).
3. Run the migration against it:
   ```bash
   psql "postgresql://..." -f migrations/001_initial_schema.sql
   ```

### Render (Backend)

1. Push this repo to GitHub.
2. On Render → **New Web Service** → connect the repo.
3. Settings:
   - **Root Directory:** `imcam-hub-backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables in Render's dashboard:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = your Neon connection string
   - `JWT_SECRET` = a strong random secret
   - `JWT_EXPIRES_IN` = `7d`
   - `FRONTEND_URL` = your Vercel URL (e.g. `https://imcam-hub.vercel.app`)
5. Deploy. Render gives you a `https://xxx.onrender.com` URL.
6. Update `VITE_API_URL` in your Vercel project settings to point to this URL.
7. Update `FRONTEND_URL` in Render to include both `https://xxx.onrender.com` and your Vercel URL if needed.

### CORS

`FRONTEND_URL` accepts comma-separated origins:
```
FRONTEND_URL=https://imcam-hub.vercel.app,http://localhost:5173
```
