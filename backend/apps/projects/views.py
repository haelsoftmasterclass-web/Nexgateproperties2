from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
import django_filters

from .models import Project, ProjectCategory, ProjectStatus
from .serializers import ProjectDetailSerializer, ProjectListSerializer


class ProjectFilter(django_filters.FilterSet):
    category = django_filters.ChoiceFilter(choices=ProjectCategory.choices)
    status = django_filters.ChoiceFilter(choices=ProjectStatus.choices)
    featured = django_filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = Project
        fields = []


class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    filterset_class = ProjectFilter

    def get_queryset(self):
        return Project.objects.published()


class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Project.objects.published().prefetch_related("images", "faqs")


class RelatedProjectsView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    pagination_class = None

    def get_queryset(self):
        current = Project.objects.published().filter(slug=self.kwargs["slug"]).first()
        if not current:
            return Project.objects.none()
        return Project.objects.published().exclude(pk=current.pk).order_by("-is_featured", "-published_at")[:3]


class ProjectFacetsView(APIView):
    def get(self, request):
        qs = Project.objects.published()
        cat_labels = dict(ProjectCategory.choices)
        status_labels = dict(ProjectStatus.choices)
        cats = qs.values("category").annotate(n=Count("id")).order_by("category")
        statuses = qs.values("status").annotate(n=Count("id")).order_by("status")
        return Response(
            {
                "total": qs.count(),
                "categories": [{"value": c["category"], "label": cat_labels[c["category"]], "count": c["n"]} for c in cats],
                "statuses": [{"value": s["status"], "label": status_labels[s["status"]], "count": s["n"]} for s in statuses],
            }
        )
