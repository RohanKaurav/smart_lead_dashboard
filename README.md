# Smart Leads Dashboard

Full-stack Lead Management Dashboard (MERN + TypeScript) for the ServiceHive internship assignment.

## Tech stack

| Layer    | Stack                                      |
| -------- | ------------------------------------------ |
| Frontend | React, TypeScript, Vite, Tailwind CSS      |
| Backend  | Node.js, Express, TypeScript               |
| Database | MongoDB + Mongoose (Phase 1+)              |

## Project structure

```
smart-leads-dashboard/
├── client/          # React SPA
├── server/          # Express API
├── .env.example     # Environment variable reference
└── README.md
```

## Prerequisites

- **Node.js** 20+ (22+ recommended for latest Vite)
- **npm** 10+
- **MongoDB** local or [MongoDB Atlas](https://www.mongodb.com/atlas) (required from Phase 1)
- **Docker + Docker Compose** (optional, for Phase 8 containerized setup)

## Architecture

```text
Browser (localhost:8080 or 5173)
        │
        ├──> Client (React + Vite / nginx static)
        │         │
        │         └── HTTP calls to VITE_API_URL
        │
        └──> API Server (Express, localhost:4000)
                  │
                  └── MongoDB (localhost:27017 locally, "mongo" service in compose)
```

- API base path: `/api`
- Auth: JWT bearer token
- RBAC: `admin` and `sales`
- Detailed API reference: [`docs/API.md`](docs/API.md)

## Local setup (Phase 0)

### 1. Clone and install

```bash
# From repository root
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Environment variables

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

| Variable        | App    | Description                          |
| --------------- | ------ | ------------------------------------ |
| `PORT`          | server | API port (default `4000`)            |
| `CLIENT_URL`    | server | Frontend origin for CORS             |
| `MONGODB_URI`   | server | MongoDB connection string            |
| `JWT_SECRET`    | server | Secret for signing JWTs              |
| `JWT_EXPIRES_IN`| server | Token expiry (e.g. `7d`)             |
| `VITE_API_URL`  | client | Base API URL (e.g. `http://localhost:4000/api`) |

### 3. Run development servers

**Terminal 1 — API**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
```

### 4. Verify Phase 0

- Frontend: [http://localhost:5173](http://localhost:5173)
- Health check: [http://localhost:4000/api/health](http://localhost:4000/api/health)

Expected health response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "...",
    "environment": "development",
    "database": "connected"
  }
}
```

## Docker setup (Phase 8)

From repository root:

```bash
# set JWT secret once for your shell (required by docker-compose.yml)
export JWT_SECRET=replace_with_a_long_random_secret
docker compose up --build
```

Services started by compose:
- `mongo` (MongoDB)
- `server` (Express API built from TypeScript and started with `node dist/index.js`)
- `client` (production client build served by nginx)

Open:
- Client: [http://localhost:8080](http://localhost:8080)
- API health: [http://localhost:4000/api/health](http://localhost:4000/api/health)

### Important networking concept

- Inside containers, use **service names** (`mongo`, `server`, `client`) on the Docker network.
- In this repo, server uses `MONGODB_URI=mongodb://mongo:27017/smartleads` in compose.
- `VITE_API_URL` is a build-time client variable; it is baked into static files and used by the browser at runtime.
- Your browser runs on the host machine, so client-side API calls must use host ports like `http://localhost:4000/api` (not `http://server:4000/api`).
- `localhost` in a container means **that container itself**, not your host and not other containers.

## Auth API (Phase 2)

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/api/auth/register` | No | Register (`name`, `email`, `password`) — role defaults to `sales` |
| POST | `/api/auth/login` | No | Login — returns `{ user, token }` |
| GET | `/api/auth/me` | Bearer token | Current user profile |

**Example — register**

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Rahul\",\"email\":\"rahul@example.com\",\"password\":\"password123\"}"
```

**Example — protected route**

```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## RBAC (Phase 3)

| Role | Permissions |
| ---- | ----------- |
| `admin` | Full access; can delete leads (Phase 4); sees all users via admin API |
| `sales` | CRUD on own leads only (Phase 4); cannot delete leads |

**Create the first admin** (after MongoDB is running):

```bash
cd server
# Add ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD to server/.env (see .env.example)
npm run seed:admin
```

**Admin-only route** (requires admin JWT):

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/admin/overview` | User list + counts by role |

Sales users receive `403` on admin routes. Registration always assigns `sales`; sending `role` in the body is rejected (strict schema).

**Example — admin overview**

```bash
curl http://localhost:4000/api/admin/overview \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Leads API (Phase 4)

All routes require `Authorization: Bearer <token>`. Pagination is fixed at **10** per page.

| Method | Endpoint | Role | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/api/leads` | admin / sales | List with filters + pagination |
| GET | `/api/leads/:id` | admin / sales | Single lead (sales: own only) |
| POST | `/api/leads` | admin / sales | Create lead |
| PATCH | `/api/leads/:id` | admin / sales | Update lead (sales: own only) |
| DELETE | `/api/leads/:id` | **admin only** | Delete lead |

**Query params (combinable):** `page`, `status`, `source`, `search`, `sort` (`latest` \| `oldest`)

```bash
# Combined filters example
curl "http://localhost:4000/api/leads?status=qualified&source=instagram&search=Rahul&sort=latest&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create lead
curl -X POST http://localhost:4000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Rahul Sharma\",\"email\":\"rahul@example.com\",\"status\":\"new\",\"source\":\"instagram\"}"
```

## CSV export (Phase 5)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/leads/export` | Download CSV for current filters (no pagination — all matching rows) |

Uses the same query params as list (except `page`): `status`, `source`, `search`, `sort`. Respects RBAC (sales export only their leads).

```bash
curl "http://localhost:4000/api/leads/export?status=qualified&source=instagram&search=Rahul&sort=latest" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o leads.csv
```

## Scripts

### Client (`client/`)

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start Vite dev server    |
| `npm run build`| Production build         |
| `npm run lint` | Run ESLint               |

### Server (`server/`)

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start API with hot reload      |
| `npm run build`   | Compile TypeScript to `dist/`  |
| `npm start`       | Run compiled API               |
| `npm run typecheck` | Type-check without emitting  |
| `npm run seed:admin`| Create/promote admin user      |

## Development phases

- [x] **Phase 0** — Tooling, monorepo scaffold, health route
- [x] **Phase 1** — MongoDB, error handling, validation
- [x] **Phase 2** — JWT authentication
- [x] **Phase 3** — Role-based access control
- [x] **Phase 4** — Leads CRUD, filters, pagination
- [x] **Phase 5** — CSV export
- [ ] **Phase 6** — Dashboard UI
- [ ] **Phase 7** — Advanced UI features
- [x] **Phase 8** — Docker (compose + containerized server/client)
- [x] **Phase 9** — Docs, polish, deployment support

## Demo credentials

- Demo credentials are not included.
- Create test users with `POST /api/auth/register` (sales role).
- Create/promote an admin with `npm run seed:admin` in `server/` (script is defined in `server/package.json`, uses `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` from `.env.example`).

## Deployment notes (Phase 9)

### 1) MongoDB Atlas
- Create an Atlas cluster and database user.
- Allow only your API host IP in Atlas network access.
- Set `MONGODB_URI` in API host env vars to your Atlas connection string.

### 2) API hosting (Render or Railway)
- Deploy `server/` as a Node service.
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Required env vars: `NODE_ENV=production`, `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`.

### 3) Client hosting (Vercel or Netlify)
- Deploy `client/`.
- Build command: `npm run build`
- Publish directory: `dist`
- Set `VITE_API_URL` to your deployed API URL, e.g. `https://your-api.example.com/api`.

## License

MIT (assignment submission)
