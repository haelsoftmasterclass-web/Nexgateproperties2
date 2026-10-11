"""Loads clearly labelled DEMO records for local development and QA only.

Refuses to run unless DJANGO_DEBUG is on. Never run this against production.
"""

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.core.models import PublicationStatus
from apps.insights.models import Article
from apps.projects.models import Project
from apps.properties.models import Property

PUBLISHED = PublicationStatus.PUBLISHED


class Command(BaseCommand):
    help = "Create DEMO properties, projects and an article for local testing (DEBUG only)."

    def add_arguments(self, parser):
        parser.add_argument("--remove", action="store_true", help="Delete all DEMO records instead.")

    def handle(self, *args, **options):
        if not settings.DEBUG:
            raise CommandError("Demo data can only be loaded when DJANGO_DEBUG is on.")
        if options["remove"]:
            Property.objects.filter(title__startswith="DEMO").delete()
            Project.objects.filter(name__startswith="DEMO").delete()
            Article.objects.filter(title__startswith="DEMO").delete()
            self.stdout.write("Demo records removed.")
            return

        project, _ = Project.objects.get_or_create(
            name="DEMO Residential Development",
            defaults=dict(
                category="residential", status="planning", city="Lagos", state_region="Lagos",
                summary="Demo project used for testing the website. Not a real development.",
                description="This is demo content for local testing only.",
                key_features=["Demo feature one", "Demo feature two"], publication_status=PUBLISHED, is_featured=True,
            ),
        )
        Project.objects.get_or_create(
            name="DEMO Commercial Development",
            defaults=dict(category="commercial", status="under-construction", city="Abuja", state_region="FCT",
                          summary="Demo project used for testing.", description="Demo content.",
                          publication_status=PUBLISHED),
        )
        demo = [
            ("DEMO Four-Bedroom Duplex", "residential", "duplex", "Lagos", "Lagos", 4, 250000000, "NGN", "show", True),
            ("DEMO Three-Bedroom Apartment", "residential", "apartment", "Lagos", "Lagos", 3, 120000000, "NGN", "show", False),
            ("DEMO Terrace Home", "residential", "terrace", "Abuja", "FCT", 3, None, "NGN", "on-request", False),
            ("DEMO Office Floor", "commercial", "office", "Lagos", "Lagos", None, 450000000, "NGN", "show", True),
            ("DEMO Warehouse", "commercial", "warehouse", "Ogun", "Ogun", None, None, "NGN", "on-request", False),
        ]
        for title, cat, ptype, city, state, beds, price, cur, vis, featured in demo:
            Property.objects.get_or_create(
                title=title,
                defaults=dict(
                    category=cat, property_type=ptype, city=city, state_region=state, bedrooms=beds,
                    bathrooms=beds, price=price, currency=cur, price_visibility=vis, is_featured=featured,
                    summary="Demo listing for testing only. Not a real property.",
                    description="This is demo content for local testing only.",
                    features=["Demo feature"], amenities=["Demo amenity"], publication_status=PUBLISHED,
                    project=project if cat == "residential" and featured else None,
                ),
            )
        Article.objects.get_or_create(
            title="DEMO Article for Testing",
            defaults=dict(body="## Heading\n\nDemo paragraph.\n\n- One\n- Two", excerpt="Demo article.",
                          publication_status=PUBLISHED, is_featured=True),
        )
        self.stdout.write(self.style.SUCCESS("Demo records created. Remove them with --remove."))
