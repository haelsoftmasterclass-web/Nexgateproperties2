from django.db.models import Count
from rest_framework import generics
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .filters import PropertyFilter
from .models import Property
from .serializers import PropertyDetailSerializer, PropertyListSerializer


class PropertyListView(generics.ListAPIView):
    serializer_class = PropertyListSerializer
    filterset_class = PropertyFilter
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ["price", "published_at"]
    ordering = ["-is_featured", "-published_at"]

    def get_queryset(self):
        return Property.objects.published()


class PropertyDetailView(generics.RetrieveAPIView):
    serializer_class = PropertyDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Property.objects.published().select_related("project").prefetch_related("images")


class RelatedPropertiesView(generics.ListAPIView):
    serializer_class = PropertyListSerializer
    pagination_class = None

    def get_queryset(self):
        current = Property.objects.published().filter(slug=self.kwargs["slug"]).first()
        if not current:
            return Property.objects.none()
        return (
            Property.objects.published()
            .filter(category=current.category)
            .exclude(pk=current.pk)
            .order_by("-is_featured", "-published_at")[:3]
        )


class PropertyFacetsView(APIView):
    """Returns the filter options that can actually produce results, so the UI hides empty filters."""

    def get(self, request):
        qs = Property.objects.published()
        category = request.query_params.get("category")
        if category in {"residential", "commercial"}:
            qs = qs.filter(category=category)

        def values(field):
            return [
                {"value": row[field], "count": row["n"]}
                for row in qs.exclude(**{field: ""}).values(field).annotate(n=Count("id")).order_by(field)
            ]

        type_labels = dict(Property._meta.get_field("property_type").choices)
        status_labels = dict(Property._meta.get_field("listing_status").choices)
        types = [{**t, "label": type_labels.get(t["value"], t["value"])} for t in values("property_type")]
        statuses = [{**s, "label": status_labels.get(s["value"], s["value"])} for s in values("listing_status")]
        return Response(
            {
                "total": qs.count(),
                "property_types": types,
                "countries": values("country"),
                "states": values("state_region"),
                "cities": values("city"),
                "currencies": [c["value"] for c in values("currency")],
                "listing_statuses": statuses,
                "has_bedrooms": qs.filter(bedrooms__isnull=False).exists(),
                "has_visible_prices": qs.filter(price_visibility="show", price__isnull=False).exists(),
            }
        )
