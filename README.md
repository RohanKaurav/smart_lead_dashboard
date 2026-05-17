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

## Development phases

- [x] **Phase 0** — Tooling, monorepo scaffold, health route
- [x] **Phase 1** — MongoDB, error handling, validation
- [ ] **Phase 2** — JWT authentication
- [ ] **Phase 3** — Role-based access control
- [ ] **Phase 4** — Leads CRUD, filters, pagination
- [ ] **Phase 5** — CSV export
- [ ] **Phase 6+** — Dashboard UI, Docker, deployment

## License

MIT (assignment submission)
