# Content management guide (Django Admin)

Sign in at `https://<api-host>/<admin path>` (locally: http://localhost:8000/manage-nexgate/).

## Publication status vs listing status

- **Publication status** (Draft, Published, Archived) controls whether something appears on the website.
- **Listing status** (Available, Under offer, Reserved, Sold, Off market) describes the property. A sold property can stay published as a past listing.
- Only staff with the publish permission can publish, unpublish or feature content. Others can prepare drafts.

## Properties

1. Properties → Add. Choose a category (Residential/Commercial) and a matching property type.
2. Price: enter a number and currency. Choose **Show price** or **Price on request**. Hidden prices are never shown or searchable.
3. Measurements only appear once **Measurements verified** is ticked.
4. Features and amenities are lists, e.g. `["Fitted kitchen", "Parking for 2 cars"]`.
5. Add a featured image and gallery images with descriptive alt text. Use the order field to sort. JPG, PNG, WebP or AVIF, up to 8 MB.
6. Use **Publish selected** from the list page, or set the status to Published.
7. Changing the slug of a published listing automatically keeps the old URL working with a permanent redirect.

Search filters only show options that exist in published listings.

## Projects

Describe Nexgate Properties’ actual role in **Our role**. Timeline dates appear only when **Timeline verified** is ticked. Tick **Artist’s impression** on renderings so visitors can tell them apart from photographs. Purchase and investment enquiry options appear only when enabled.

## Articles (Insights)

Write the body with `## ` and `### ` for headings, a blank line between paragraphs, and `- ` for bullet lists. Links: `[text](https://example.com)`. Add references one per line as `Title | https://url`. Eight proposed topics have been created as drafts.

## Service pages

Service content lets you override the headline, summary, body, image and SEO text of each service page. Untick **Is published** to fall back to the default copy.

## FAQs, legal pages, markets

- FAQs are grouped by category; unpublished questions are hidden.
- Legal pages show a “draft pending legal review” notice and are hidden from search engines until **Legal review complete** is ticked.
- Markets lists the countries shown on the International Property page. Add only confirmed markets.

## Site settings

Company description, email, WhatsApp number, offices, phone numbers (E.164 format, e.g. `+2347017461957`), verified social links and group company links. Phone numbers that are not valid E.164 are never rendered as links.

## Enquiries

- Every submission gets a reference (e.g. `NXP-1A2B3C4D`), stored with the consent text and time.
- Filter by status, category and assignee. Actions: **Assign to me**, **Mark as contacted**, **Close selected**.
- Submitted details are read-only; staff update status, assignee and internal notes.
- Enquiries are never available through the public API.
