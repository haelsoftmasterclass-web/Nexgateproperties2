from django.contrib import admin

from .models import (
    FAQ,
    AffiliateBrand,
    FAQCategory,
    LegalPage,
    MarketOption,
    Office,
    PhoneNumber,
    ServiceContent,
    SiteSettings,
    SlugRedirect,
    SocialLink,
)


class OfficeInline(admin.StackedInline):
    model = Office
    extra = 0


class PhoneInline(admin.TabularInline):
    model = PhoneNumber
    extra = 0


class SocialInline(admin.TabularInline):
    model = SocialLink
    extra = 0


class AffiliateInline(admin.TabularInline):
    model = AffiliateBrand
    extra = 0


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    inlines = [OfficeInline, PhoneInline, SocialInline, AffiliateInline]

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class FAQInline(admin.StackedInline):
    model = FAQ
    extra = 0


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "order"]
    list_editable = ["order"]
    prepopulated_fields = {"slug": ["name"]}
    inlines = [FAQInline]


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ["question", "category", "is_published", "order"]
    list_filter = ["category", "is_published"]
    list_editable = ["is_published", "order"]
    search_fields = ["question", "answer"]


@admin.register(LegalPage)
class LegalPageAdmin(admin.ModelAdmin):
    list_display = ["title", "kind", "legal_review_complete", "effective_date", "updated_at"]


@admin.register(ServiceContent)
class ServiceContentAdmin(admin.ModelAdmin):
    list_display = ["service", "headline", "is_published", "updated_at"]
    list_filter = ["is_published"]


@admin.register(MarketOption)
class MarketOptionAdmin(admin.ModelAdmin):
    list_display = ["name", "is_published", "order"]
    list_editable = ["is_published", "order"]


@admin.register(SlugRedirect)
class SlugRedirectAdmin(admin.ModelAdmin):
    list_display = ["kind", "old_slug", "new_slug", "created_at"]
    list_filter = ["kind"]
    search_fields = ["old_slug", "new_slug"]
