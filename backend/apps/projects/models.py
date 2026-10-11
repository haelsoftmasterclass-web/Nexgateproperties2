from django.db import models

from apps.core.models import PublicationStatus, PublishableModel, SlugRedirect, record_slug_change
from apps.core.validators import validate_image_upload
from apps.properties.models import _unique_slug


class ProjectCategory(models.TextChoices):
    RESIDENTIAL = "residential", "Residential development"
    COMMERCIAL = "commercial", "Commercial development"
    MIXED_USE = "mixed-use", "Mixed-use development"


class ProjectStatus(models.TextChoices):
    PLANNING = "planning", "Planning"
    PRE_LAUNCH = "pre-launch", "Pre-launch"
    UNDER_CONSTRUCTION = "under-construction", "Under construction"
    SELLING = "selling", "Now selling"
    COMPLETED = "completed", "Completed"
    ON_HOLD = "on-hold", "On hold"


class Project(PublishableModel):
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    category = models.CharField(max_length=12, choices=ProjectCategory.choices, db_index=True)
    status = models.CharField(max_length=24, choices=ProjectStatus.choices, default=ProjectStatus.PLANNING, db_index=True)
    summary = models.CharField(max_length=280, blank=True)
    description = models.TextField(blank=True)
    country = models.CharField(max_length=80, default="Nigeria")
    state_region = models.CharField("State or region", max_length=80, blank=True)
    city = models.CharField(max_length=80, blank=True)
    location_description = models.CharField(max_length=255, blank=True)
    key_features = models.JSONField(default=list, blank=True, help_text="Confirmed features only. List of strings.")
    nexgate_role = models.CharField(
        max_length=255,
        blank=True,
        help_text="Describe Nexgate Properties' actual role, e.g. 'Sales and marketing partner'.",
    )
    start_date = models.DateField(null=True, blank=True, help_text="Only enter verified dates.")
    expected_completion = models.CharField(max_length=60, blank=True, help_text="Verified only, e.g. 'Q4 2027'.")
    timeline_verified = models.BooleanField(default=False)
    accepts_purchase_enquiries = models.BooleanField(default=False)
    accepts_investment_enquiries = models.BooleanField(default=False)
    hero_image = models.ImageField(upload_to="projects/", blank=True, validators=[validate_image_upload])
    hero_image_alt = models.CharField(max_length=160, blank=True)
    hero_image_is_rendering = models.BooleanField(
        default=True, help_text="Tick if the hero image is an architectural rendering rather than a photograph."
    )

    class Meta:
        ordering = ["-is_featured", "-published_at", "-created_at"]
        permissions = [("publish_project", "Can publish, unpublish and feature projects")]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(Project, self.name, self.pk)
        if self.pk:
            previous = Project.objects.filter(pk=self.pk).values("slug", "publication_status").first()
            if previous:
                record_slug_change(
                    SlugRedirect.Kind.PROJECT,
                    previous["slug"],
                    self.slug,
                    previous["publication_status"] == PublicationStatus.PUBLISHED,
                )
        super().save(*args, **kwargs)


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="projects/gallery/", validators=[validate_image_upload])
    alt_text = models.CharField(max_length=160)
    caption = models.CharField(max_length=200, blank=True)
    is_rendering = models.BooleanField(default=False, help_text="Architectural rendering, not a photograph.")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.alt_text


class ProjectFAQ(models.Model):
    project = models.ForeignKey(Project, related_name="faqs", on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    answer = models.TextField()
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Project FAQ"

    def __str__(self):
        return self.question
