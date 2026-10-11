import re
import time
from datetime import date

from django.utils import timezone
from rest_framework import serializers

from apps.projects.models import Project
from apps.properties.models import Property

from .models import ContactMethod, Enquiry, EnquiryCategory

PHONE_RE = re.compile(r"^\+?[0-9\s().-]{7,24}$")
MIN_FILL_SECONDS = 3
MAX_DETAIL_KEYS = 20
MAX_DETAIL_VALUE_LENGTH = 500

# Structured fields each form may send in `details`. Anything else is rejected.
ALLOWED_DETAIL_KEYS = {
    "budget",
    "budget_currency",
    "preferred_location",
    "preferred_date",
    "property_type",
    "property_category",
    "investment_focus",
    "investment_horizon",
    "management_scope",
    "property_address",
    "number_of_units",
    "advisory_topic",
    "country_of_interest",
    "client_location",
    "submission_type",
    "property_location",
    "asking_price",
    "land_size",
    "title_documents",
    "service",
    "organisation",
    "viewing_requested",
}


class EnquiryCreateSerializer(serializers.Serializer):
    category = serializers.ChoiceField(choices=EnquiryCategory.choices)
    full_name = serializers.CharField(max_length=120, min_length=2, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    message = serializers.CharField(max_length=4000, required=False, allow_blank=True)
    property_slug = serializers.SlugField(required=False, allow_blank=True)
    project_slug = serializers.SlugField(required=False, allow_blank=True)
    preferred_contact_method = serializers.ChoiceField(choices=ContactMethod.choices, required=False, allow_blank=True)
    details = serializers.DictField(required=False)
    source_page = serializers.CharField(max_length=255, required=False, allow_blank=True)
    consent = serializers.BooleanField()
    consent_text = serializers.CharField(max_length=500)
    # Spam controls: a hidden field bots tend to fill, and the time the form was rendered (ms epoch).
    website = serializers.CharField(required=False, allow_blank=True)
    form_started_at = serializers.IntegerField(required=False)

    def validate_full_name(self, value):
        if re.search(r"https?://|<|>", value):
            raise serializers.ValidationError("Please enter your name only.")
        return value

    def validate_phone(self, value):
        value = value.strip()
        if value and not PHONE_RE.match(value):
            raise serializers.ValidationError("Enter a valid phone number, including the country code.")
        digits = re.sub(r"\D", "", value)
        if value and not 7 <= len(digits) <= 15:
            raise serializers.ValidationError("Enter a valid phone number, including the country code.")
        return value

    def validate_consent(self, value):
        if value is not True:
            raise serializers.ValidationError("Please confirm you have read the privacy policy.")
        return value

    def validate_details(self, value):
        if len(value) > MAX_DETAIL_KEYS:
            raise serializers.ValidationError("Too many details supplied.")
        cleaned = {}
        for key, item in value.items():
            if key not in ALLOWED_DETAIL_KEYS:
                raise serializers.ValidationError(f"Unknown field: {key}.")
            if isinstance(item, bool) or item is None:
                cleaned[key] = item
            elif isinstance(item, (int, float)):
                cleaned[key] = item
            elif isinstance(item, str):
                if len(item) > MAX_DETAIL_VALUE_LENGTH:
                    raise serializers.ValidationError(f"{key} is too long.")
                cleaned[key] = item.strip()
            elif isinstance(item, list) and all(isinstance(v, str) and len(v) <= 100 for v in item) and len(item) <= 20:
                cleaned[key] = [v.strip() for v in item]
            else:
                raise serializers.ValidationError(f"{key} has an invalid value.")
        preferred = cleaned.get("preferred_date")
        if preferred:
            try:
                parsed = date.fromisoformat(preferred)
            except ValueError as exc:
                raise serializers.ValidationError("preferred_date must be a valid date (YYYY-MM-DD).") from exc
            if parsed < timezone.localdate():
                raise serializers.ValidationError("The preferred date cannot be in the past.")
        return cleaned

    def validate(self, attrs):
        if attrs.get("website"):
            raise serializers.ValidationError("Submission rejected.", code="spam")
        started = attrs.get("form_started_at")
        if started and (time.time() * 1000 - started) < MIN_FILL_SECONDS * 1000:
            raise serializers.ValidationError("Please take a moment to complete the form and try again.", code="spam")

        if attrs.get("property_slug"):
            prop = Property.objects.published().filter(slug=attrs["property_slug"]).first()
            if not prop:
                raise serializers.ValidationError({"property_slug": "This property is no longer available."})
            attrs["property"] = prop
        if attrs.get("project_slug"):
            project = Project.objects.published().filter(slug=attrs["project_slug"]).first()
            if not project:
                raise serializers.ValidationError({"project_slug": "This project is no longer available."})
            attrs["project"] = project

        if attrs["category"] in {EnquiryCategory.GENERAL, EnquiryCategory.ADVISORY} and not attrs.get("message"):
            raise serializers.ValidationError({"message": "Please tell us how we can help."})
        if attrs.get("preferred_contact_method") in {ContactMethod.PHONE, ContactMethod.WHATSAPP} and not attrs.get("phone"):
            raise serializers.ValidationError({"phone": "Add a phone number so we can call or message you."})
        return attrs

    def create(self, validated):
        return Enquiry.objects.create(
            category=validated["category"],
            full_name=validated["full_name"],
            email=validated["email"].lower(),
            phone=validated.get("phone", ""),
            message=validated.get("message", ""),
            property=validated.get("property"),
            project=validated.get("project"),
            details=validated.get("details", {}),
            preferred_contact_method=validated.get("preferred_contact_method", ""),
            source_page=validated.get("source_page", ""),
            consent_given=True,
            consent_text=validated["consent_text"],
            consent_at=timezone.now(),
        )
