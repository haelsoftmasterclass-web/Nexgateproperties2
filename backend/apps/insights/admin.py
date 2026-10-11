from django.contrib import admin

from apps.core.admin_actions import PublishPermissionMixin, archive, publish, unpublish

from .models import Article, ArticleCategory


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "order"]
    prepopulated_fields = {"slug": ["name"]}


@admin.register(Article)
class ArticleAdmin(PublishPermissionMixin, admin.ModelAdmin):
    list_display = ["title", "category", "publication_status", "is_featured", "published_at"]
    list_filter = ["publication_status", "category", "is_featured"]
    search_fields = ["title", "excerpt", "body"]
    prepopulated_fields = {"slug": ["title"]}
    actions = [publish, unpublish, archive]
    autocomplete_fields = []
    fieldsets = [
        ("Article", {"fields": ["title", "slug", "category", "excerpt", "body", "references", "related_service"]}),
        ("Author", {"fields": ["author_name", "author"]}),
        ("Publication", {"fields": ["publication_status", "published_at", "is_featured"]}),
        ("Featured image", {"fields": ["featured_image", "featured_image_alt"]}),
        ("SEO", {"fields": ["seo_title", "meta_description"], "classes": ["collapse"]}),
    ]
