from rest_framework import serializers

from apps.core.serializers import ImageURLField

from .models import PriceVisibility, Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    image = ImageURLField()

    class Meta:
        model = PropertyImage
        fields = ["image", "alt_text", "caption"]


class PropertyListSerializer(serializers.ModelSerializer):
    featured_image = ImageURLField()
    price = serializers.SerializerMethodField()
    category_label = serializers.CharField(source="get_category_display", read_only=True)
    property_type_label = serializers.CharField(source="get_property_type_display", read_only=True)
    listing_status_label = serializers.CharField(source="get_listing_status_display", read_only=True)
    floor_area_sqm = serializers.SerializerMethodField()
    land_area_sqm = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "slug",
            "title",
            "summary",
            "category",
            "category_label",
            "property_type",
            "property_type_label",
            "country",
            "state_region",
            "city",
            "price",
            "currency",
            "price_visibility",
            "price_qualifier",
            "listing_status",
            "listing_status_label",
            "bedrooms",
            "bathrooms",
            "floor_area_sqm",
            "land_area_sqm",
            "featured_image",
            "featured_image_alt",
            "is_featured",
        ]

    def get_price(self, obj):
        if obj.price_visibility != PriceVisibility.SHOW or obj.price is None:
            return None
        return str(obj.price)

    def _measure(self, obj, value):
        return str(value) if obj.measurements_verified and value is not None else None

    def get_floor_area_sqm(self, obj):
        return self._measure(obj, obj.floor_area_sqm)

    def get_land_area_sqm(self, obj):
        return self._measure(obj, obj.land_area_sqm)


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    project = serializers.SerializerMethodField()

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + [
            "description",
            "address",
            "units",
            "features",
            "amenities",
            "location_notes",
            "documentation_notes",
            "images",
            "project",
            "seo_title",
            "meta_description",
            "published_at",
            "updated_at",
        ]

    def get_project(self, obj):
        if obj.project and obj.project.publication_status == "published":
            return {"slug": obj.project.slug, "name": obj.project.name}
        return None
