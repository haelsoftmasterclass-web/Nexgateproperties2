from django.conf import settings
from django.db import models

from apps.core.models import PublicationStatus, PublishableModel, SlugRedirect, record_slug_change
from apps.core.validators import validate_image_upload
from apps.properties.models import _unique_slug


class ArticleCategory(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(unique=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "article categories"

    def __str__(self):
        return self.name


class Article(PublishableModel):
    class RelatedService(models.TextChoices):
        NONE = "", "None"
        SALES = "properties-for-sale", "Properties for sale"
        DEVELOPMENT = "property-development", "Property development"
        INVESTMENT = "real-estate-investment", "Real estate investment"
        MANAGEMENT = "property-facility-management", "Property and facility management"
        ADVISORY = "real-estate-advisory", "Real estate advisory"
        INTERNATIONAL = "international-property", "International property"

    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    category = models.ForeignKey(ArticleCategory, null=True, blank=True, related_name="articles", on_delete=models.SET_NULL)
    excerpt = models.CharField(max_length=300, blank=True)
    body = models.TextField(help_text="Use '## ' and '### ' for headings, blank lines between paragraphs, '- ' for lists.")
    references = models.TextField(blank=True, help_text="One reference per line: Title | https://url")
    author_name = models.CharField(max_length=120, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    featured_image = models.ImageField(upload_to="insights/", blank=True, validators=[validate_image_upload])
    featured_image_alt = models.CharField(max_length=160, blank=True)
    related_service = models.CharField(max_length=40, choices=RelatedService.choices, blank=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        permissions = [("publish_article", "Can publish, unpublish and feature articles")]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(Article, self.title, self.pk)
        if self.pk:
            previous = Article.objects.filter(pk=self.pk).values("slug", "publication_status").first()
            if previous:
                record_slug_change(
                    SlugRedirect.Kind.ARTICLE,
                    previous["slug"],
                    self.slug,
                    previous["publication_status"] == PublicationStatus.PUBLISHED,
                )
        super().save(*args, **kwargs)
