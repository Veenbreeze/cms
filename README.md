# Church Management System (CMSA)

A cloud-ready, bilingual (English / Kiswahili) church management platform: a public
landing site plus a secure, role-based dashboard for managing members, Jumuia
(communities), spiritual records, and church content.

> Status: foundation + core modules (auth, RBAC, Jumuia, Members, Spiritual Records,
> Dashboard, Audit Log, public landing page). Content modules (announcements, weekly
> lessons, songs/QR, servant history, gallery, events, reports) are scaffolded in the
> database but not yet built — see `backend/apps/content`, `backend/apps/servants`,
> `backend/apps/notifications`.

## Stack

- **Frontend**: React (Vite, JavaScript) + Tailwind CSS + react-i18next
- **Backend**: Django + Django REST Framework + SimpleJWT
- **Database**: PostgreSQL
- **File storage**: S3-compatible (MinIO locally, works with AWS S3 / DO Spaces / R2 in production)
- **Local dev**: Docker Compose

## Quick start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

This starts Postgres, MinIO (+ automatic bucket creation), the Django API, and the
Vite dev server.

Once containers are healthy, run migrations and create demo data:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_demo
```

`seed_demo` prints a Super Admin email/password to the console — this is the only way
to get your first login, since there is no public self-registration.

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/v1
- Django admin: http://localhost:8000/admin
- MinIO console: http://localhost:9001

## Running without Docker

**Backend**

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate   # or `source .venv/bin/activate` on macOS/Linux
pip install -r requirements-dev.txt
cp ../.env.example ../.env   # edit POSTGRES_HOST=localhost, USE_S3=False if you don't run MinIO
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

**Frontend**

```bash
cd frontend
cp .env.example .env   # points at http://localhost:8000/api/v1 by default
npm install
npm run dev
```

## Environment variables

See `.env.example` for the full list. Key ones:

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Django secret key — generate a real one for any non-local environment |
| `POSTGRES_*` | Database connection |
| `USE_S3` | `True` to use S3-compatible storage (MinIO locally), `False` for local disk |
| `AWS_S3_ENDPOINT_URL` | MinIO/S3 endpoint |
| `CORS_ALLOWED_ORIGINS` | Frontend origin(s) allowed to call the API |
| `JUMUIA_ASSIGNMENT_STRATEGY` | Default strategy for automatic Jumuia assignment (`least_loaded`) |
| `VITE_API_BASE_URL` | API base URL the frontend calls |

## Project layout

```
backend/    Django project (apps: core, accounts, churches, jumuia, members, audit,
            content, servants, notifications)
frontend/   React + Vite app (components/ui, components/layout, features/*, pages, ...)
```

## Tests

```bash
docker compose exec backend pytest
```

## Roles

| Role | Access |
|---|---|
| Super Admin | Everything, church-wide |
| Church Admin | Everything except creating other Super Admins |
| Chairperson | Members & spiritual records within their own Jumuia only |
| Secretary | Members & spiritual records within their own Jumuia only |
| Member | Dashboard placeholder today; will gain a self-service view when that module ships |

There is no public "create account" flow anywhere in the app — every account (including
the first Super Admin) is created via `seed_demo` or by an existing admin from
**Users & Roles**.

## Production notes

- `frontend/Dockerfile` runs the Vite dev server, which is fine for local/demo use.
  For a real deployment, build static assets with `npm run build` and serve the
  `dist/` folder from nginx or a static host, pointing `VITE_API_BASE_URL` at your
  deployed API.
- `backend` already switches to Gunicorn automatically when `DJANGO_DEBUG=False`
  (see `entrypoint.sh`) and applies HSTS/SSL-redirect/secure-cookie settings from
  `config/settings/prod.py`.
- Swap `USE_S3=True` with real AWS S3 / DigitalOcean Spaces / Cloudflare R2
  credentials in production — no code changes needed, only `.env`.
