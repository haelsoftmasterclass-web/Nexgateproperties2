from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify

from apps.core.models import PublicationStatus, PublishableModel, SlugRedirect, record_slug_change
from apps.core.validators import validate_image_upload


class Currency(models.TextChoices):
    NGN = "NGN", "Nigerian naira (₦)"
    USD = "USD", "US dollar ($)"
    GBP = "GBP", "British pound (£)"
    EUR = "EUR", "Euro (€)"
    AED = "AED", "UAE dirham"


class PropertyCategory(models.TextChoices):
    RESIDENTIAL = "residential", "Residential"
    COMMERCIAL = "commercial", "Commercial"


class PropertyType(models.TextChoices):
    # Residential
    APARTMENT = "apartment", "Apartment"
    DETACHED = "detached-house", "Detached house"
    SEMI_DETACHED = "semi-detached-house", "Semi-detached house"
    TERRACE = "terrace", "Terrace"
    DUPLEX = "duplex", "Duplex"
    RESIDENTIAL_DEVELOPMENT = "residential-development", "Residential development"
    LAND_RESIDENTIAL = "residential-land", "Residential land"
    # Commercial
    OFFICE = "office", "Office space"
    RETAIL = "retail", "Retail unit"
    COMMERCIAL_BUILDING = "commercial-building", "Commercial building"
    WAREHOUSE = "warehouse", "Warehouse"
    INDUSTRIAL = "industrial", "Industrial premises"
    MIXED_USE = "mixed-use", "Mixed-use property"
    LAND_COMMERCIAL = "commercial-land", "Commercial land"


RESIDENTIAL_TYPES = {
    PropertyType.APARTMENT,
    PropertyType.DETACHED,
    PropertyType.SEMI_DETACHED,
    PropertyType.TERRACE,
    PropertyType.DUPLEX,
    PropertyType.RESIDENTIAL_DEVELOPMENT,
    PropertyType.LAND_RESIDENTIAL,
}


class ListingStatus(models.TextChoices):
    AVAILABLE = "available", "Available"
    UNDER_OFFER = "under-offer", "Under offer"
    RESERVED = "reserved", "Reserved"
    SOLD = "sold", "Sold"
    OFF_MARKET = "off-market", "Off market"


class PriceVisibility(models.TextChoices):
    SHOW = "show", "Show price"
    ON_REQUEST = "on-request", "Price on request"


class Property(PublishableModel):
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    category = models.CharField(max_length=12, choices=PropertyCategory.choices, db_index=True)
    property_type = models.CharField(max_length=30, choices=PropertyType.choices, db_index=True)
    summary = models.CharField(max_length=280, blank=True, help_text="Short card summary.")
    description = models.TextField(blank=True)

    country = models.CharField(max_length=80, default="Nigeria", db_index=True)
    state_region = models.CharField("State or region", max_length=80, blank=True, db_index=True)
    city = models.CharField(max_length=80, blank=True, db_index=True)
    address = models.CharField(
        max_length=255, blank=True, help_text="Full or generalised address. Shown publicly."
    )

    price = models.DecimalField(
        max_digits=16, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.NGN)
    price_visibility = models.CharField(
        max_length=12, choices=PriceVisibility.choices, default=PriceVisibility.ON_REQUEST
    )
    price_qualifier = models.CharField(
        max_length=60, blank=True, help_text="Optional, e.g. 'per annum' or 'outright sale'."
    )
    listing_status = models.CharField(
        max_length=12, choices=ListingStatus.choices, default=ListingStatus.AVAILABLE, db_index=True
    )

    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    bathrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    land_area_sqm = models.DecimalField(
        "Land area (m²)", max_digits=12, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)]
    )
    floor_area_sqm = models.DecimalField(
        "Floor area (m²)", max_digits=12, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)]
    )
    measurements_verified = models.BooleanField(
        default=False, help_text="Measurements are only shown publicly once verified."
    )
    units = models.PositiveIntegerField("Units or spaces", null=True, blank=True)

    features = models.JSONField(default=list, blank=True, help_text='List of strings, e.g. ["Fitted kitchen"]')
    amenities = models.JSONField(default=list, blank=True, help_text="List of strings.")
    location_notes = models.TextField(blank=True, help_text="Neighbourhood and access information.")
    documentation_notes = models.TextField(
        blank=True, help_text="Title/documentation information that may be shared publicly."
    )

    featured_image = models.ImageField(upload_to="properties/", blank=True, validators=[validate_image_upload])
    featured_image_alt = models.CharField(max_length=160, blank=True)

    project = models.ForeignKey(
        "projects.Project", null=True, blank=True, related_name="properties", on_delete=models.SET_NULL
    )

    class Meta:
        ordering = ["-is_featured", "-published_at", "-created_at"]
        verbose_name_plural = "properties"
        indexes = [
            models.Index(fields=["publication_status", "category", "listing_status"]),
            models.Index(fields=["price"]),
        ]
        permissions = [("publish_property", "Can publish, unpublish and feature properties")]

    def __str__(self):
        return self.title

    def clean(self):
        errors = {}
        if self.category and self.property_type:
            is_residential_type = self.property_type in RESIDENTIAL_TYPES
            if (self.category == PropertyCategory.RESIDENTIAL) != is_residential_type:
                errors["property_type"] = "This property type does not match the selected category."
        if self.price_visibility == PriceVisibility.SHOW and self.price is None:
            errors["price"] = "Enter a price, or set price visibility to 'Price on request'."
        if self.publication_status == PublicationStatus.PUBLISHED and not self.description:
            errors["description"] = "A description is required before publishing."
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(Property, self.title, self.pk)
        if self.pk:
            previous = Property.objects.filter(pk=self.pk).values("slug", "publication_status").first()
            if previous:
                record_slug_change(
                    SlugRedirect.Kind.PROPERTY,
                    previous["slug"],
                    self.slug,
                    previous["publication_status"] == PublicationStatus.PUBLISHED,
                )
        super().save(*args, **kwargs)


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="properties/gallery/", validators=[validate_image_upload])
    alt_text = models.CharField(max_length=160)
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.alt_text


def _unique_slug(model, value: str, pk=None) -> str:
    base = slugify(value)[:180] or "item"
    slug = base
    n = 2
    while model.objects.filter(slug=slug).exclude(pk=pk).exists():
        slug = f"{base}-{n}"
        n += 1
    return slug
