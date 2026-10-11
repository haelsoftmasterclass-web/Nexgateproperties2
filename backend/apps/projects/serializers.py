from rest_framework import serializers

from apps.core.serializers import ImageURLField

from .models import Project, ProjectFAQ, ProjectImage


class ProjectImageSerializer(serializers.ModelSerializer):
    image = ImageURLField()

    class Meta:
        model = ProjectImage
        fields = ["image", "alt_text", "caption", "is_rendering"]


class ProjectFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFAQ
        fields = ["question", "answer"]


class ProjectListSerializer(serializers.ModelSerializer):
    hero_image = ImageURLField()
    category_label = serializers.CharField(source="get_category_display", read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Project
        fields = [
            "slug",
            "name",
            "summary",
            "category",
            "category_label",
            "status",
            "status_label",
            "country",
            "state_region",
            "city",
            "location_description",
            "hero_image",
            "hero_image_alt",
            "hero_image_is_rendering",
            "is_featured",
        ]


class ProjectDetailSerializer(ProjectListSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    faqs = ProjectFAQSerializer(many=True, read_only=True)
    start_date = serializers.SerializerMethodField()
    expected_completion = serializers.SerializerMethodField()

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + [
            "description",
            "key_features",
            "nexgate_role",
            "start_date",
            "expected_completion",
            "accepts_purchase_enquiries",
            "accepts_investment_enquiries",
            "images",
            "faqs",
            "seo_title",
            "meta_description",
            "published_at",
            "updated_at",
        ]

    def get_start_date(self, obj):
        return obj.start_date.isoformat() if obj.timeline_verified and obj.start_date else None

    def get_expected_completion(self, obj):
        return obj.expected_completion if obj.timeline_verified and obj.expected_completion else None
