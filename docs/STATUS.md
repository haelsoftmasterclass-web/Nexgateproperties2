# Project status

Last updated: 2026-10-13

## Phase summary

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Project setup, design tokens, layout, navigation, footer | Done |
| 2 | Django models, admin, publish permissions, seed content | Done |
| 3 | Public REST API (properties, projects, insights, FAQs, legal, settings) | Done |
| 4 | Property and project listings, filters, detail pages, galleries | Done |
| 5 | Service pages, about, contact, consultation, sell/partner | Done |
| 6 | Enquiry capture (validation, consent, spam controls, rate limits) | Done |
| 7 | SEO (metadata, sitemap, robots, JSON-LD, slug redirects), accessibility | Done |
| 8 | Hosting, real content, launch checks | Waiting on Nexgate (see below) |

## What works now

- All 21 page types render, including empty states when no listings are published.
- Property search and filters (category, type, location, price, bedrooms, status, currency); filter options come from published data only.
- Property and project detail pages with galleries, specs, related items and enquiry forms.
- Enquiry forms on contact, consultation, sell/partner, service pages, and each property/project. Submissions are stored in the database and appear in Django Admin with a reference number. Success is shown only after the server confirms storage.
- Insights list, categories and article pages (articles are drafts until approved).
- FAQ page from the CMS with FAQPage structured data.
- Privacy policy and terms pages, clearly marked as drafts pending legal review.
- Django Admin for editing listings, projects, articles, FAQs, legal pages, site settings, offices, phone numbers, social links and enquiries, with publish permissions.
- Pages refresh automatically after an admin edit (on-demand revalidation).

## Tests and checks

- Backend: 25 automated API tests pass (`python manage.py test tests`).
- Frontend: `next build`, ESLint and TypeScript all pass.
- Browser checks at 1440px and 390px: every route loads, unknown slugs return 404, renamed slugs redirect (308), no horizontal overflow, one H1 per page, mobile menu, form validation and successful submission, API-down behaviour (forms show an error instead of false success).

## Needs Nexgate input before launch

1. **Contact details**: confirm addresses, phone numbers and email, then tick "contact details confirmed" in Site settings. Until then the site shows them but omits them from structured data.
2. **Office map**: tick "address verified" per office to show its map.
3. **Logo**: a vector logo (SVG/AI/PDF). Current PNGs were cut from a compressed JPEG.
4. **Photography**: 7 site photos are on the home and property development pages, and 6 design renders illustrate the demo homes (2026-10-13). Still needed: photos of real listings, projects and the team.
5. **Listings and projects**: real listings with confirmed prices and details. No listings have been invented.
6. **About copy**: vision, mission and company story, then tick "about copy approved".
7. **Legal**: privacy policy and terms reviewed by a lawyer; placeholders are marked "[To be confirmed]".
8. **Social media**: real account URLs, if any. None are shown until added and marked verified.
9. **Email**: an SMTP provider for enquiry notifications.
10. **Hosting**: a host for the Django backend + PostgreSQL, and a domain. See DEPLOYMENT.md.

## Known limitations

- The eulerhq.com reference could not be loaded from the build environment, so its motion was recreated from its page structure (word reveals, scroll fades, line drawing, marquee, count-ups), not copied.
- Demo data (`load_demo_data`) is for development only, prefixed "DEMO", and refuses to run when DEBUG is off.
- No payments or investor fund collection, by design.
