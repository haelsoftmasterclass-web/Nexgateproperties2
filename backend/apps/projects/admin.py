from django.contrib import admin

from apps.core.admin_actions import PublishPermissionMixin, archive, publish, unpublish

from .models import Project, ProjectFAQ, ProjectImage


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ["image", "alt_text", "caption", "is_rendering", "order"]


class ProjectFAQInline(admin.StackedInline):
    model = ProjectFAQ
    extra = 0


@admin.register(Project)
class ProjectAdmin(PublishPermissionMixin, admin.ModelAdmin):
    list_display = ["name", "category", "status", "city", "publication_status", "is_featured", "updated_at"]
    list_filter = ["publication_status", "status", "category", "is_featured"]
    search_fields = ["name", "city", "location_description"]
    prepopulated_fields = {"slug": ["name"]}
    inlines = [ProjectImageInline, ProjectFAQInline]
    actions = [publish, unpublish, archive]
    fieldsets = [
        ("Project", {"fields": ["name", "slug", "category", "status", "summary", "description", "nexgate_role", "key_features"]}),
        ("Publication", {"fields": ["publication_status", "published_at", "is_featured"]}),
        ("Location", {"fields": ["country", "state_region", "city", "location_description"]}),
        ("Timeline", {"fields": ["start_date", "expected_completion", "timeline_verified"]}),
        ("Enquiries", {"fields": ["accepts_purchase_enquiries", "accepts_investment_enquiries"]}),
        ("Hero image", {"fields": ["hero_image", "hero_image_alt", "hero_image_is_rendering"]}),
        ("SEO", {"fields": ["seo_title", "meta_description"], "classes": ["collapse"]}),
    ]
