from django.conf import settings
from rest_framework import serializers

from .models import FAQ, AffiliateBrand, FAQCategory, LegalPage, MarketOption, Office, PhoneNumber, ServiceContent, SiteSettings, SocialLink


def absolute_media_url(request, field) -> str | None:
    if not field:
        return None
    url = field.url
    base = getattr(settings, "MEDIA_PUBLIC_BASE_URL", "")
    if base:
        return base.rstrip("/") + "/" + url.lstrip("/") if not url.startswith("http") else url
    if url.startswith("http") or request is None:
        return url
    return request.build_absolute_uri(url)


class ImageURLField(serializers.Field):
    def __init__(self, **kwargs):
        kwargs["read_only"] = True
        super().__init__(**kwargs)

    def to_representation(self, value):
        return absolute_media_url(self.context.get("request"), value)


class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ["label", "address", "country", "address_verified", "map_embed_query"]


class PhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = ["label", "number_e164", "display"]


class SocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["platform", "url"]


class AffiliateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AffiliateBrand
        fields = ["name", "description", "url"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    offices = OfficeSerializer(many=True, read_only=True)
    phone_numbers = PhoneSerializer(many=True, read_only=True)
    social_links = serializers.SerializerMethodField()
    affiliates = AffiliateSerializer(many=True, read_only=True)

    class Meta:
        model = SiteSettings
        fields = [
            "company_name",
            "tagline",
            "short_description",
            "primary_email",
            "whatsapp_number",
            "vision",
            "mission",
            "about_copy_approved",
            "contact_details_confirmed",
            "offices",
            "phone_numbers",
            "social_links",
            "affiliates",
        ]

    def get_social_links(self, obj):
        return SocialSerializer(obj.social_links.filter(verified=True), many=True).data


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer"]


class FAQCategorySerializer(serializers.ModelSerializer):
    faqs = serializers.SerializerMethodField()

    class Meta:
        model = FAQCategory
        fields = ["name", "slug", "faqs"]

    def get_faqs(self, obj):
        return FAQSerializer([f for f in obj.faqs.all() if f.is_published], many=True).data


class LegalPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalPage
        fields = ["kind", "title", "body", "legal_review_complete", "effective_date", "seo_title", "meta_description", "updated_at"]


class ServiceContentSerializer(serializers.ModelSerializer):
    image = ImageURLField()

    class Meta:
        model = ServiceContent
        fields = ["service", "headline", "summary", "body", "image", "image_alt", "seo_title", "meta_description"]


class MarketOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketOption
        fields = ["name", "note"]
