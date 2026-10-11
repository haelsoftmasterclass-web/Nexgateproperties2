import django_filters
from rest_framework import generics

from .models import Article, ArticleCategory
from .serializers import ArticleCategorySerializer, ArticleDetailSerializer, ArticleListSerializer


class ArticleFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug", max_length=60)
    featured = django_filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = Article
        fields = []


class ArticleListView(generics.ListAPIView):
    serializer_class = ArticleListSerializer
    filterset_class = ArticleFilter

    def get_queryset(self):
        return Article.objects.published().select_related("category")


class ArticleDetailView(generics.RetrieveAPIView):
    serializer_class = ArticleDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Article.objects.published().select_related("category")


class RelatedArticlesView(generics.ListAPIView):
    serializer_class = ArticleListSerializer
    pagination_class = None

    def get_queryset(self):
        current = Article.objects.published().filter(slug=self.kwargs["slug"]).first()
        if not current:
            return Article.objects.none()
        qs = Article.objects.published().select_related("category").exclude(pk=current.pk)
        if current.category_id:
            same = list(qs.filter(category_id=current.category_id)[:3])
            if len(same) == 3:
                return same
            return same + list(qs.exclude(pk__in=[a.pk for a in same])[: 3 - len(same)])
        return qs[:3]


class ArticleCategoryListView(generics.ListAPIView):
    serializer_class = ArticleCategorySerializer
    pagination_class = None

    def get_queryset(self):
        return ArticleCategory.objects.filter(articles__publication_status="published").distinct()
