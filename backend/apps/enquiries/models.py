import uuid

from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class EnquiryCategory(models.TextChoices):
    PROPERTY = "property", "Property enquiry"
    INVESTMENT = "investment", "Investment enquiry"
    PROJECT = "project", "Project enquiry"
    MANAGEMENT = "management", "Property management enquiry"
    ADVISORY = "advisory", "Advisory consultation"
    INTERNATIONAL = "international", "International property enquiry"
    SELL_PARTNER = "sell-partner", "Sell or partner enquiry"
    CONSULTATION = "consultation", "Consultation request"
    GENERAL = "general", "General contact enquiry"


class EnquiryStatus(models.TextChoices):
    NEW = "new", "New"
    CONTACTED = "contacted", "Contacted"
    QUALIFIED = "qualified", "Qualified"
    IN_PROGRESS = "in-progress", "In progress"
    CONVERTED = "converted", "Converted"
    CLOSED = "closed", "Closed"


class ContactMethod(models.TextChoices):
    PHONE = "phone", "Phone call"
    WHATSAPP = "whatsapp", "WhatsApp"
    EMAIL = "email", "Email"
    VIDEO = "video", "Video call"
    IN_PERSON = "in-person", "In person"


class Enquiry(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(max_length=16, unique=True, editable=False)
    category = models.CharField(max_length=20, choices=EnquiryCategory.choices, db_index=True)
    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    message = models.TextField(blank=True)
    property = models.ForeignKey(
        "properties.Property", null=True, blank=True, related_name="enquiries", on_delete=models.SET_NULL
    )
    project = models.ForeignKey(
        "projects.Project", null=True, blank=True, related_name="enquiries", on_delete=models.SET_NULL
    )
    details = models.JSONField(default=dict, blank=True, help_text="Structured answers specific to the form.")
    preferred_contact_method = models.CharField(max_length=12, choices=ContactMethod.choices, blank=True)
    source_page = models.CharField(max_length=255, blank=True)

    consent_given = models.BooleanField(default=False)
    consent_text = models.CharField(max_length=500, blank=True)
    consent_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=12, choices=EnquiryStatus.choices, default=EnquiryStatus.NEW, db_index=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, related_name="assigned_enquiries", on_delete=models.SET_NULL
    )
    internal_notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "enquiries"
        permissions = [("assign_enquiry", "Can assign enquiries to staff")]

    def __str__(self):
        return f"{self.reference} · {self.get_category_display()}"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = "NXP-" + uuid.uuid4().hex[:8].upper()
        super().save(*args, **kwargs)
