# Nexgate Properties website

The public website and content management system for **Nexgate Properties**, the real estate business of Nexgate Group.

| Part | Stack | Folder |
| --- | --- | --- |
| Public website | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 | `frontend/` |
| API and admin | Django 6.1, Django REST Framework 3.18, PostgreSQL 16 | `backend/` |

Next.js renders every page on the server and reads content from the Django API. Visitors never call Django directly: enquiry forms post to a Next.js route handler (`/api/enquiries/`), which forwards them to Django with a shared key. Staff manage everything in Django Admin.

## Quick start (local development)

Prerequisites: Python 3.12+, Node.js 20.9+, PostgreSQL 14+.

```bash
# 1. Database
createuser nexgate --pwprompt          # choose a password
createdb nexgate --owner nexgate

# 2. Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DJANGO_DEBUG=1 POSTGRES_PASSWORD=<your password>
python manage.py migrate
python manage.py seed_site_content      # contact details, FAQs, legal drafts, article drafts
python manage.py createsuperuser
python manage.py load_demo_data         # optional, DEBUG only: clearly labelled DEMO records
python manage.py runserver              # http://localhost:8000/manage-nexgate/

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev                             # http://localhost:3000
```

Remove demo records with `python manage.py load_demo_data --remove`.

## Checks

```bash
cd backend && DJANGO_DEBUG=1 POSTGRES_PASSWORD=... python manage.py test tests   # 25 API, validation and permission tests
cd frontend && npm run lint && npx tsc --noEmit && npm run build
```

## Documentation

- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): environment variables, production setup, first admin user, backups, launch checklist
- [docs/CONTENT_MANAGEMENT.md](docs/CONTENT_MANAGEMENT.md): how staff add listings, projects, articles and manage enquiries
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): colours, typography, spacing, components and motion
- [docs/STATUS.md](docs/STATUS.md): what is built, what is pending and what needs management input

## Project structure

```
backend/
  config/            settings, URLs
  apps/core/         site settings, FAQs, legal pages, service copy, markets, slug redirects
  apps/properties/   property listings, images, search filters and facets
  apps/projects/     development projects, galleries, project FAQs
  apps/insights/     articles and categories
  apps/enquiries/    enquiry storage, validation, spam controls, admin workflow
  tests/             API and permission tests
frontend/src/
  app/               one folder per route (20 page types), sitemap, robots, API route handlers
  components/        layout, ui, motion, content, property, project, forms, insights, home
  lib/               API client, types, services, formatting, SEO helpers
```
