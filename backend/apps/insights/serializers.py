from rest_framework import serializers

from apps.core.serializers import ImageURLField

from .models import Article, ArticleCategory


class ArticleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        fields = ["name", "slug"]


class ArticleListSerializer(serializers.ModelSerializer):
    category = ArticleCategorySerializer(read_only=True)
    featured_image = ImageURLField()

    class Meta:
        model = Article
        fields = ["slug", "title", "excerpt", "category", "author_name", "published_at", "featured_image", "featured_image_alt", "is_featured"]


class ArticleDetailSerializer(ArticleListSerializer):
    references = serializers.SerializerMethodField()

    class Meta(ArticleListSerializer.Meta):
        fields = ArticleListSerializer.Meta.fields + ["body", "references", "related_service", "seo_title", "meta_description", "updated_at"]

    def get_references(self, obj):
        refs = []
        for line in obj.references.splitlines():
            if "|" in line:
                title, url = (part.strip() for part in line.split("|", 1))
                if url.startswith(("http://", "https://")):
                    refs.append({"title": title or url, "url": url})
        return refs
