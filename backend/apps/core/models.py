from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from .validators import validate_image_upload


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublicationStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


class PublishableQuerySet(models.QuerySet):
    def published(self):
        return self.filter(publication_status=PublicationStatus.PUBLISHED)


class SEOFields(models.Model):
    seo_title = models.CharField(max_length=70, blank=True, help_text="Up to 70 characters. Defaults to the title.")
    meta_description = models.CharField(
        max_length=170, blank=True, help_text="Up to 170 characters. Shown in search results."
    )

    class Meta:
        abstract = True


class PublishableModel(TimeStampedModel, SEOFields):
    publication_status = models.CharField(
        max_length=12, choices=PublicationStatus.choices, default=PublicationStatus.DRAFT, db_index=True
    )
    published_at = models.DateTimeField(null=True, blank=True)
    is_featured = models.BooleanField(default=False, db_index=True)

    objects = PublishableQuerySet.as_manager()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self.publication_status == PublicationStatus.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class SlugRedirect(TimeStampedModel):
    """Keeps old URLs working when a published slug changes."""

    class Kind(models.TextChoices):
        PROPERTY = "property", "Property"
        PROJECT = "project", "Project"
        ARTICLE = "article", "Article"

    kind = models.CharField(max_length=12, choices=Kind.choices)
    old_slug = models.SlugField(max_length=200)
    new_slug = models.SlugField(max_length=200)

    class Meta:
        unique_together = [("kind", "old_slug")]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.kind}: {self.old_slug} → {self.new_slug}"


def record_slug_change(kind: str, old_slug: str | None, new_slug: str, was_published: bool):
    if not old_slug or old_slug == new_slug or not was_published:
        return
    # Point any older redirects at the newest slug and avoid loops.
    SlugRedirect.objects.filter(kind=kind, new_slug=old_slug).update(new_slug=new_slug)
    SlugRedirect.objects.filter(kind=kind, old_slug=new_slug).delete()
    SlugRedirect.objects.update_or_create(kind=kind, old_slug=old_slug, defaults={"new_slug": new_slug})


class SiteSettings(TimeStampedModel):
    """Singleton holding company-wide details. Edit it in the admin; never hardcode contact data."""

    company_name = models.CharField(max_length=120, default="Nexgate Properties")
    tagline = models.CharField(max_length=200, blank=True, default="A Nexgate Group company")
    short_description = models.TextField(blank=True)
    primary_email = models.EmailField(blank=True)
    whatsapp_number = models.CharField(
        max_length=20,
        blank=True,
        help_text="International format digits only, e.g. 2347017461957. Leave blank to hide WhatsApp.",
    )
    vision = models.TextField(blank=True, help_text="About page vision statement. Leave blank to show the proposed wording.")
    mission = models.TextField(blank=True, help_text="About page mission statement. Leave blank to show the proposed wording.")
    about_copy_approved = models.BooleanField(
        default=False, help_text="Tick once management approves the vision, mission and values. Hides the 'proposed wording' notice."
    )
    contact_details_confirmed = models.BooleanField(
        default=False,
        help_text="Tick once management confirms these group contact details are approved for Nexgate Properties.",
    )

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return "Site settings"

    def clean(self):
        if self.whatsapp_number and not self.whatsapp_number.isdigit():
            raise ValidationError({"whatsapp_number": "Use digits only, including the country code."})

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("Site settings cannot be deleted.")

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Office(models.Model):
    settings = models.ForeignKey(SiteSettings, related_name="offices", on_delete=models.CASCADE)
    label = models.CharField(max_length=80, help_text="e.g. Nigeria office")
    address = models.TextField()
    country = models.CharField(max_length=80)
    address_verified = models.BooleanField(
        default=False, help_text="Only verified addresses show a map marker."
    )
    map_embed_query = models.CharField(
        max_length=255, blank=True, help_text="Optional address text used for the map once verified."
    )
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.label


class PhoneNumber(models.Model):
    settings = models.ForeignKey(SiteSettings, related_name="phone_numbers", on_delete=models.CASCADE)
    label = models.CharField(max_length=80, blank=True)
    number_e164 = models.CharField(
        max_length=16, help_text="E.164 format, e.g. +2347017461957. Used for click-to-call links."
    )
    display = models.CharField(max_length=32, help_text="How the number is shown, e.g. +234 701 746 1957")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.display

    def clean(self):
        import re

        if not re.fullmatch(r"\+[1-9]\d{6,14}", self.number_e164 or ""):
            raise ValidationError({"number_e164": "Enter a valid E.164 number such as +2347017461957."})


class SocialLink(models.Model):
    settings = models.ForeignKey(SiteSettings, related_name="social_links", on_delete=models.CASCADE)
    platform = models.CharField(max_length=40)
    url = models.URLField()
    verified = models.BooleanField(default=False, help_text="Only verified official profiles are shown.")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.platform


class AffiliateBrand(models.Model):
    settings = models.ForeignKey(SiteSettings, related_name="affiliates", on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    description = models.CharField(max_length=200, blank=True)
    url = models.URLField(blank=True, help_text="Leave blank until the official URL is confirmed.")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name


class FAQCategory(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(unique=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name_plural = "FAQ categories"

    def __str__(self):
        return self.name


class FAQ(TimeStampedModel):
    category = models.ForeignKey(FAQCategory, related_name="faqs", on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    answer = models.TextField()
    is_published = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["category__order", "order", "id"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question


class LegalPage(TimeStampedModel, SEOFields):
    class Kind(models.TextChoices):
        PRIVACY = "privacy-policy", "Privacy policy"
        TERMS = "terms-and-conditions", "Terms and conditions"

    kind = models.CharField(max_length=40, choices=Kind.choices, unique=True)
    title = models.CharField(max_length=120)
    body = models.TextField(help_text="Markdown-style plain text. Use '## ' for headings.")
    legal_review_complete = models.BooleanField(
        default=False, help_text="Tick only after legal review. Unreviewed pages show a draft notice."
    )
    effective_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title


class ServiceContent(TimeStampedModel, SEOFields):
    """Editable copy for each of the six confirmed services. The site falls back to default copy."""

    class Service(models.TextChoices):
        SALES = "properties-for-sale", "Residential and commercial properties for sale"
        DEVELOPMENT = "property-development", "Property development and new projects"
        INVESTMENT = "real-estate-investment", "Real estate investment opportunities"
        MANAGEMENT = "property-facility-management", "Property and facility management"
        ADVISORY = "real-estate-advisory", "Real estate advisory and consultancy"
        INTERNATIONAL = "international-property", "International property sales or investment"

    service = models.CharField(max_length=40, choices=Service.choices, unique=True)
    headline = models.CharField(max_length=160, blank=True)
    summary = models.TextField(blank=True)
    body = models.TextField(blank=True, help_text="Use '## ' for headings and blank lines between paragraphs.")
    image = models.ImageField(upload_to="services/", blank=True, validators=[validate_image_upload])
    image_alt = models.CharField(max_length=160, blank=True)
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.get_service_display()


class MarketOption(models.Model):
    """Countries/markets shown on the international property page. Add only confirmed markets."""

    name = models.CharField(max_length=80)
    note = models.CharField(max_length=200, blank=True)
    is_published = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name
