from django.contrib import admin
from django.utils.html import format_html

from apps.core.admin_actions import PublishPermissionMixin, archive, publish, unpublish

from .models import Property, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ["preview", "image", "alt_text", "caption", "order"]
    readonly_fields = ["preview"]
    ordering = ["order"]

    @admin.display(description="Preview")
    def preview(self, obj):
        if obj.pk and obj.image:
            return format_html('<img src="{}" style="height:60px;border-radius:4px" alt="">', obj.image.url)
        return "—"


@admin.register(Property)
class PropertyAdmin(PublishPermissionMixin, admin.ModelAdmin):
    list_display = [
        "title",
        "category",
        "property_type",
        "city",
        "listing_status",
        "publication_status",
        "is_featured",
        "updated_at",
    ]
    list_filter = ["publication_status", "listing_status", "category", "property_type", "is_featured", "country"]
    search_fields = ["title", "city", "state_region", "address"]
    prepopulated_fields = {"slug": ["title"]}
    inlines = [PropertyImageInline]
    actions = [publish, unpublish, archive]
    readonly_fields = ["created_at", "updated_at"]
    fieldsets = [
        ("Listing", {"fields": ["title", "slug", "category", "property_type", "summary", "description", "project"]}),
        ("Status", {"fields": ["publication_status", "published_at", "listing_status", "is_featured"],
                    "description": "Listing status (e.g. Sold) is separate from publication. A sold property can stay published."}),
        ("Location", {"fields": ["country", "state_region", "city", "address", "location_notes"]}),
        ("Price", {"fields": ["price", "currency", "price_visibility", "price_qualifier"]}),
        ("Specifications", {"fields": ["bedrooms", "bathrooms", "units", "land_area_sqm", "floor_area_sqm", "measurements_verified"]}),
        ("Features", {"fields": ["features", "amenities", "documentation_notes"]}),
        ("Featured image", {"fields": ["featured_image", "featured_image_alt"]}),
        ("SEO", {"fields": ["seo_title", "meta_description"], "classes": ["collapse"]}),
        ("Timestamps", {"fields": ["created_at", "updated_at"], "classes": ["collapse"]}),
    ]
