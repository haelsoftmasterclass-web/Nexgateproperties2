# Deployment guide

## Architecture in production

```
Browser ──HTTPS──> Next.js server (Node 20+)  ──server-to-server──> Django API (gunicorn) ──> PostgreSQL
                         │                                              │
                         └── /api/enquiries/ forwards form posts ───────┘   Media files on disk or object storage/CDN
```

Run the two apps as separate services (for example: Vercel or a Node host for `frontend/`, and a VPS, Render, Railway, Fly.io or similar for `backend/` with managed PostgreSQL). Keep the Django admin on its own hostname (for example `api.nexgateproperties.com`).

## Environment variables

Copy `backend/.env.example` and `frontend/.env.example`. Never commit real values.

### Backend (Django)

| Variable | Required | Purpose |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Yes | Long random string. The app refuses to start without it when debug is off. |
| `DJANGO_DEBUG` | No | `false` in production (default). |
| `DJANGO_ALLOWED_HOSTS` | Yes | Comma-separated API hostnames. |
| `DJANGO_ADMIN_PATH` | No | Admin URL path, default `manage-nexgate/`. Choose a non-obvious value. |
| `API_PUBLIC_URL` | Yes | Public base URL of the API, used in notification emails. |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_SSLMODE` | Yes | Database connection. Use `require` for managed databases. |
| `CORS_ALLOWED_ORIGINS` | Yes | The website origin. |
| `CSRF_TRUSTED_ORIGINS` | Yes | The API/admin origin (for admin logins over HTTPS). |
| `API_NUM_PROXIES` | Yes | Number of proxies in front of Django, so rate limits use the visitor’s real IP. Usually `1` (Next.js) or `2` (Next.js + load balancer). |
| `API_THROTTLE_ENQUIRIES` | No | Enquiry rate limit per visitor, default `5/hour`. |
| `ENQUIRY_API_KEY` | Yes | Shared secret; enquiries without it are rejected. Must match the frontend. |
| `FRONTEND_REVALIDATE_URL`, `REVALIDATE_SECRET` | Recommended | Refreshes website pages immediately after admin edits. |
| `MEDIA_PUBLIC_BASE_URL`, `DJANGO_MEDIA_ROOT` | Recommended | Where uploaded images are stored and served from. |
| `EMAIL_HOST` etc., `ENQUIRY_NOTIFICATION_EMAILS` | Optional | Staff email alerts for new enquiries. Alerts are only sent when both are set. |
| `REDIS_URL` | Recommended with more than one API process | Shared cache so rate limits apply across processes. |

### Frontend (Next.js)

| Variable | Required | Purpose |
| --- | --- | --- |
| `API_URL` | Yes | Internal URL of the Django API. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public website URL (canonical links, sitemap, Open Graph). |
| `ENQUIRY_API_KEY` | Yes | Same value as the backend. |
| `REVALIDATE_SECRET` | Recommended | Same value as the backend. |
| `MEDIA_PUBLIC_BASE_URL` | If media is on a CDN | Allows Next.js image optimisation for that host. |
| `ALLOW_INDEXING` | Yes on live site | Set to `true` only on the production domain. Every other environment tells search engines not to index. |

## First deployment

```bash
# Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py seed_site_content
python manage.py createsuperuser        # see "First admin user" below
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3

# Frontend
npm ci
npm run build
npm run start                           # or deploy to your Node/Vercel host
```

Serve `/static/` (Django admin assets) and `/media/` from the web server or object storage. Do **not** run `load_demo_data` in production; it refuses to run when debug is off.

### Migrations on later releases

```bash
python manage.py migrate --plan   # review
python manage.py migrate
```

Take a database backup before every migration.

## First admin user

1. Run `python manage.py createsuperuser` on the server, over SSH, with a unique username and a password of at least 12 characters.
2. Sign in at `https://<api-host>/<DJANGO_ADMIN_PATH>`.
3. For each staff member, create a normal **staff** user (not superuser) and assign only the permissions they need. Suggested groups:
   - **Editors**: add/change/view properties, projects, images, articles, FAQs, service content. No publish permission, so they cannot publish or feature content.
   - **Publishers**: editors plus `Can publish, unpublish and feature …` for properties, projects and articles.
   - **Enquiry handlers**: view/change enquiries; add `Can assign enquiries to staff` for team leads.
4. Keep superuser accounts to one or two people.

## Backups and recovery

- Use managed PostgreSQL with automated daily backups and point-in-time recovery, kept for at least 14 days.
- Also take a nightly logical backup off the database host: `pg_dump --format=custom --no-owner "$DATABASE" > nexgate-$(date +%F).dump`.
- Back up the media folder or bucket (versioning on).
- Test a restore every quarter: `pg_restore --clean --no-owner -d <new_db> nexgate-YYYY-MM-DD.dump`.
- Enquiries contain personal data. Encrypt backups and restrict who can access them.

## Security checklist

- Debug off, strong secret key, HTTPS everywhere (HSTS is enabled automatically when debug is off).
- `ENQUIRY_API_KEY` set on both sides.
- Admin on a non-obvious path; consider IP allow-listing or a VPN/Cloudflare Access in front of it.
- Database not exposed to the internet.
- Security headers are set by both apps (nosniff, frame denial, referrer policy, HSTS in production).
- Error logs never include enquiry bodies.

## Launch checklist

- [ ] Management confirms the contact details are approved for Nexgate Properties, then ticks “Contact details confirmed” in Site settings.
- [ ] Office addresses verified (tick “Address verified” to show a map).
- [ ] WhatsApp number added in Site settings (digits only), if WhatsApp is to be offered.
- [ ] Official social media links added and marked verified.
- [ ] Official URLs for Nexgate Group, Nexgate Construction and Valdo Interiors added.
- [ ] Vision, mission and values approved and “About copy approved” ticked.
- [ ] Privacy policy and terms reviewed by a lawyer, replaced, and “Legal review complete” ticked.
- [ ] Real listings and projects added with approved photography and verified details.
- [ ] Demo data removed (`load_demo_data --remove`) from any environment that had it.
- [ ] Vector (SVG) version of the logo supplied and swapped in.
- [ ] Email notifications configured and tested.
- [ ] `ALLOW_INDEXING=true` set on production only; sitemap submitted to Google Search Console.
- [ ] Analytics and cookie consent decided (none is installed yet).
- [ ] Test every form on the live site and confirm the enquiry appears in the admin.
