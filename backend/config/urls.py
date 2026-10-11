from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

from apps.core import views as core
from apps.enquiries.views import EnquiryCreateView
from apps.insights import views as insights
from apps.projects import views as projects
from apps.properties import views as properties

admin.site.site_header = "Nexgate Properties administration"
admin.site.site_title = "Nexgate Properties admin"
admin.site.index_title = "Website content and enquiries"


def health(request):
    return JsonResponse({"status": "ok"})


api = [
    path("health/", health),
    path("site-settings/", core.SiteSettingsView.as_view()),
    path("faqs/", core.FAQListView.as_view()),
    path("legal/<slug:kind>/", core.LegalPageView.as_view()),
    path("services/", core.ServiceContentListView.as_view()),
    path("markets/", core.MarketOptionListView.as_view()),
    path("redirects/<str:kind>/<slug:slug>/", core.RedirectLookupView.as_view()),
    path("properties/", properties.PropertyListView.as_view()),
    path("properties/facets/", properties.PropertyFacetsView.as_view()),
    path("properties/<slug:slug>/", properties.PropertyDetailView.as_view()),
    path("properties/<slug:slug>/related/", properties.RelatedPropertiesView.as_view()),
    path("projects/", projects.ProjectListView.as_view()),
    path("projects/facets/", projects.ProjectFacetsView.as_view()),
    path("projects/<slug:slug>/", projects.ProjectDetailView.as_view()),
    path("projects/<slug:slug>/related/", projects.RelatedProjectsView.as_view()),
    path("articles/", insights.ArticleListView.as_view()),
    path("articles/categories/", insights.ArticleCategoryListView.as_view()),
    path("articles/<slug:slug>/", insights.ArticleDetailView.as_view()),
    path("articles/<slug:slug>/related/", insights.RelatedArticlesView.as_view()),
    path("enquiries/", EnquiryCreateView.as_view()),
]

urlpatterns = [
    path(settings.ADMIN_URL_PATH, admin.site.urls),
    path("api/", include(api)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
