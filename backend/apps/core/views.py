from django.db.models import Prefetch
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FAQ, FAQCategory, LegalPage, MarketOption, ServiceContent, SiteSettings, SlugRedirect
from .serializers import (
    FAQCategorySerializer,
    LegalPageSerializer,
    MarketOptionSerializer,
    ServiceContentSerializer,
    SiteSettingsSerializer,
)


class SiteSettingsView(APIView):
    def get(self, request):
        settings_obj = SiteSettings.objects.prefetch_related("offices", "phone_numbers", "social_links", "affiliates").get_or_create(pk=1)[0]
        return Response(SiteSettingsSerializer(settings_obj, context={"request": request}).data)


class FAQListView(generics.ListAPIView):
    serializer_class = FAQCategorySerializer
    pagination_class = None

    def get_queryset(self):
        return FAQCategory.objects.prefetch_related(
            Prefetch("faqs", queryset=FAQ.objects.filter(is_published=True))
        ).filter(faqs__is_published=True).distinct()


class LegalPageView(generics.RetrieveAPIView):
    serializer_class = LegalPageSerializer
    queryset = LegalPage.objects.all()
    lookup_field = "kind"


class ServiceContentListView(generics.ListAPIView):
    serializer_class = ServiceContentSerializer
    pagination_class = None
    queryset = ServiceContent.objects.filter(is_published=True)


class MarketOptionListView(generics.ListAPIView):
    serializer_class = MarketOptionSerializer
    pagination_class = None
    queryset = MarketOption.objects.filter(is_published=True)


class RedirectLookupView(APIView):
    """Lets the frontend 301-redirect old slugs: /api/redirects/<kind>/<slug>/"""

    def get(self, request, kind, slug):
        target = SlugRedirect.objects.filter(kind=kind, old_slug=slug).values_list("new_slug", flat=True).first()
        if not target:
            return Response({"detail": "Not found."}, status=404)
        return Response({"new_slug": target})
