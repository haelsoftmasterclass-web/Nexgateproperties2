import time
from decimal import Decimal

from django.contrib.auth.models import Permission, User
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.core.models import FAQ, FAQCategory, PublicationStatus, SiteSettings, SlugRedirect
from apps.enquiries.models import Enquiry
from apps.projects.models import Project
from apps.properties.models import Property

PUBLISHED = PublicationStatus.PUBLISHED


def make_property(**kw):
    defaults = dict(
        title="Test Home", category="residential", property_type="duplex", city="Lagos", state_region="Lagos",
        description="Desc", publication_status=PUBLISHED, price=Decimal("1000000"), price_visibility="show",
    )
    defaults.update(kw)
    return Property.objects.create(**defaults)


def enquiry_payload(**kw):
    data = {
        "category": "general",
        "full_name": "Ada Obi",
        "email": "ada@example.com",
        "phone": "+234 701 746 1957",
        "message": "Hello",
        "consent": True,
        "consent_text": "I agree to the privacy policy.",
        "form_started_at": int(time.time() * 1000) - 10_000,
        "website": "",
    }
    data.update(kw)
    return data


class PropertyAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        cache.clear()

    def test_only_published_properties_are_listed(self):
        make_property(title="Live")
        make_property(title="Draft", publication_status=PublicationStatus.DRAFT)
        make_property(title="Archived", publication_status=PublicationStatus.ARCHIVED)
        res = self.client.get("/api/properties/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual([p["title"] for p in res.json()["results"]], ["Live"])

    def test_draft_detail_returns_404(self):
        p = make_property(publication_status=PublicationStatus.DRAFT)
        self.assertEqual(self.client.get(f"/api/properties/{p.slug}/").status_code, 404)

    def test_sold_property_stays_published(self):
        p = make_property(listing_status="sold")
        res = self.client.get(f"/api/properties/{p.slug}/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["listing_status"], "sold")

    def test_filters(self):
        make_property(title="Cheap Lagos", price=Decimal("100"), bedrooms=2)
        make_property(title="Dear Lagos", price=Decimal("900"), bedrooms=5)
        make_property(title="Abuja Office", category="commercial", property_type="office", city="Abuja", price=Decimal("500"))
        r = self.client.get("/api/properties/", {"category": "residential", "min_price": 200}).json()
        self.assertEqual([p["title"] for p in r["results"]], ["Dear Lagos"])
        r = self.client.get("/api/properties/", {"city": "abuja"}).json()
        self.assertEqual(r["count"], 1)
        r = self.client.get("/api/properties/", {"bedrooms": 3}).json()
        self.assertEqual([p["title"] for p in r["results"]], ["Dear Lagos"])
        r = self.client.get("/api/properties/", {"q": "office"}).json()
        self.assertEqual(r["count"], 1)

    def test_invalid_filter_is_rejected(self):
        res = self.client.get("/api/properties/", {"category": "castle"})
        self.assertEqual(res.status_code, 400)

    def test_hidden_price_not_exposed_or_filterable(self):
        make_property(title="Hidden", price=Decimal("500"), price_visibility="on-request")
        r = self.client.get("/api/properties/").json()
        self.assertIsNone(r["results"][0]["price"])
        r = self.client.get("/api/properties/", {"min_price": 400, "max_price": 600}).json()
        self.assertEqual(r["count"], 0)

    def test_unverified_measurements_hidden(self):
        p = make_property(floor_area_sqm=Decimal("200"), measurements_verified=False)
        self.assertIsNone(self.client.get(f"/api/properties/{p.slug}/").json()["floor_area_sqm"])
        p.measurements_verified = True
        p.save()
        self.assertEqual(self.client.get(f"/api/properties/{p.slug}/").json()["floor_area_sqm"], "200.00")

    def test_facets_only_list_types_with_results(self):
        make_property(property_type="duplex")
        facets = self.client.get("/api/properties/facets/", {"category": "residential"}).json()
        self.assertEqual([t["value"] for t in facets["property_types"]], ["duplex"])

    def test_slug_change_creates_redirect(self):
        p = make_property(title="Old Name")
        old = p.slug
        p.slug = "new-name"
        p.save()
        self.assertTrue(SlugRedirect.objects.filter(kind="property", old_slug=old, new_slug="new-name").exists())
        self.assertEqual(self.client.get(f"/api/redirects/property/{old}/").json()["new_slug"], "new-name")

    def test_category_type_mismatch_fails_validation(self):
        from django.core.exceptions import ValidationError

        p = Property(title="X", category="residential", property_type="office", description="d")
        with self.assertRaises(ValidationError):
            p.full_clean()


class ProjectAPITests(TestCase):
    def test_unverified_timeline_hidden(self):
        pr = Project.objects.create(name="P", category="residential", publication_status=PUBLISHED,
                                    expected_completion="2030", timeline_verified=False)
        data = APIClient().get(f"/api/projects/{pr.slug}/").json()
        self.assertIsNone(data["expected_completion"])


@override_settings(ENQUIRY_API_KEY="")
class EnquiryAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        cache.clear()

    def test_valid_enquiry_is_stored_without_echoing_pii(self):
        res = self.client.post("/api/enquiries/", enquiry_payload(), format="json")
        self.assertEqual(res.status_code, 201, res.content)
        body = res.json()
        self.assertEqual(set(body), {"reference", "status"})
        self.assertNotIn("ada@example.com", res.content.decode())
        e = Enquiry.objects.get()
        self.assertTrue(e.consent_given)
        self.assertEqual(e.status, "new")

    def test_missing_consent_rejected(self):
        res = self.client.post("/api/enquiries/", enquiry_payload(consent=False), format="json")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_honeypot_rejected(self):
        res = self.client.post("/api/enquiries/", enquiry_payload(website="http://spam"), format="json")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_too_fast_rejected(self):
        res = self.client.post("/api/enquiries/", enquiry_payload(form_started_at=int(time.time() * 1000)), format="json")
        self.assertEqual(res.status_code, 400)

    def test_bad_phone_and_unknown_detail_rejected(self):
        self.assertEqual(self.client.post("/api/enquiries/", enquiry_payload(phone="abc"), format="json").status_code, 400)
        res = self.client.post("/api/enquiries/", enquiry_payload(details={"evil": "x"}), format="json")
        self.assertEqual(res.status_code, 400)

    def test_past_preferred_date_rejected(self):
        res = self.client.post("/api/enquiries/", enquiry_payload(category="consultation", details={"preferred_date": "2000-01-01"}), format="json")
        self.assertEqual(res.status_code, 400)

    def test_property_enquiry_links_published_property_only(self):
        p = make_property()
        draft = make_property(title="Draft", publication_status=PublicationStatus.DRAFT)
        res = self.client.post("/api/enquiries/", enquiry_payload(category="property", property_slug=p.slug), format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Enquiry.objects.get().property, p)
        res = self.client.post("/api/enquiries/", enquiry_payload(category="property", property_slug=draft.slug), format="json")
        self.assertEqual(res.status_code, 400)

    def test_enquiries_cannot_be_listed_publicly(self):
        self.client.post("/api/enquiries/", enquiry_payload(), format="json")
        self.assertEqual(self.client.get("/api/enquiries/").status_code, 405)

    @override_settings(ENQUIRY_API_KEY="secret")
    def test_api_key_required_when_configured(self):
        self.assertEqual(self.client.post("/api/enquiries/", enquiry_payload(), format="json").status_code, 403)
        res = self.client.post("/api/enquiries/", enquiry_payload(), format="json", HTTP_X_ENQUIRY_KEY="secret")
        self.assertEqual(res.status_code, 201)

    def test_rate_limited(self):
        codes = [self.client.post("/api/enquiries/", enquiry_payload(), format="json").status_code for _ in range(7)]
        self.assertIn(429, codes)


class SiteContentTests(TestCase):
    def test_site_settings_hide_unverified_socials(self):
        s = SiteSettings.load()
        s.social_links.create(platform="Instagram", url="https://instagram.com/x", verified=False)
        s.phone_numbers.create(number_e164="+2347017461957", display="+234 701 746 1957")
        data = APIClient().get("/api/site-settings/").json()
        self.assertEqual(data["social_links"], [])
        self.assertEqual(data["phone_numbers"][0]["number_e164"], "+2347017461957")

    def test_faqs_only_published(self):
        cat = FAQCategory.objects.create(name="General", slug="general")
        FAQ.objects.create(category=cat, question="Q1", answer="A", is_published=True)
        FAQ.objects.create(category=cat, question="Q2", answer="A", is_published=False)
        data = APIClient().get("/api/faqs/").json()
        self.assertEqual([f["question"] for f in data[0]["faqs"]], ["Q1"])


class AdminPermissionTests(TestCase):
    def test_staff_without_publish_permission_cannot_publish(self):
        user = User.objects.create_user("editor", password="x-very-long-pass", is_staff=True)
        user.user_permissions.add(*Permission.objects.filter(codename__in=["change_property", "view_property"]))
        p = make_property(publication_status=PublicationStatus.DRAFT)
        self.client.force_login(user)
        from django.conf import settings

        res = self.client.post(
            f"/{settings.ADMIN_URL_PATH}properties/property/",
            {"action": "publish", "_selected_action": [p.pk]},
            follow=True,
        )
        self.assertEqual(res.status_code, 200)
        p.refresh_from_db()
        self.assertEqual(p.publication_status, PublicationStatus.DRAFT)

    def test_enquiries_admin_requires_login(self):
        from django.conf import settings

        res = self.client.get(f"/{settings.ADMIN_URL_PATH}enquiries/enquiry/")
        self.assertEqual(res.status_code, 302)
