import django_filters
from django.db.models import Q

from .models import Currency, ListingStatus, Property, PropertyCategory, PropertyType


class PropertyFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="filter_keyword", max_length=100)
    category = django_filters.ChoiceFilter(choices=PropertyCategory.choices)
    type = django_filters.ChoiceFilter(field_name="property_type", choices=PropertyType.choices)
    country = django_filters.CharFilter(field_name="country", lookup_expr="iexact", max_length=80)
    state = django_filters.CharFilter(field_name="state_region", lookup_expr="iexact", max_length=80)
    city = django_filters.CharFilter(field_name="city", lookup_expr="iexact", max_length=80)
    currency = django_filters.ChoiceFilter(choices=Currency.choices)
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte", min_value=0)
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte", min_value=0)
    status = django_filters.ChoiceFilter(field_name="listing_status", choices=ListingStatus.choices)
    bedrooms = django_filters.NumberFilter(field_name="bedrooms", lookup_expr="gte", min_value=0)
    featured = django_filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = Property
        fields = []

    def filter_keyword(self, queryset, name, value):
        value = value.strip()
        if not value:
            return queryset
        return queryset.filter(
            Q(title__icontains=value)
            | Q(summary__icontains=value)
            | Q(city__icontains=value)
            | Q(state_region__icontains=value)
            | Q(country__icontains=value)
        )

    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)
        # Prices hidden from the public must not be revealed by price-range filtering.
        if self.form.cleaned_data.get("min_price") is not None or self.form.cleaned_data.get("max_price") is not None:
            qs = qs.filter(price_visibility="show")
        return qs
