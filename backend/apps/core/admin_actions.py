from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import PublicationStatus


def _set_status(modeladmin, request, queryset, status):
    if not request.user.has_perm(f"{queryset.model._meta.app_label}.publish_{queryset.model._meta.model_name}"):
        modeladmin.message_user(request, "You do not have permission to publish or unpublish content.", messages.ERROR)
        return
    changed, failed = 0, []
    for obj in queryset:
        obj.publication_status = status
        try:
            obj.full_clean()
        except ValidationError as exc:
            failed.append(f"{obj}: {'; '.join(exc.messages)}")
            continue
        if status == PublicationStatus.PUBLISHED and not obj.published_at:
            obj.published_at = timezone.now()
        obj.save()
        changed += 1
    if changed:
        modeladmin.message_user(request, f"Updated {changed} item(s).", messages.SUCCESS)
    for msg in failed:
        modeladmin.message_user(request, msg, messages.ERROR)


@admin.action(description="Publish selected")
def publish(modeladmin, request, queryset):
    _set_status(modeladmin, request, queryset, PublicationStatus.PUBLISHED)


@admin.action(description="Unpublish selected (back to draft)")
def unpublish(modeladmin, request, queryset):
    _set_status(modeladmin, request, queryset, PublicationStatus.DRAFT)


@admin.action(description="Archive selected")
def archive(modeladmin, request, queryset):
    _set_status(modeladmin, request, queryset, PublicationStatus.ARCHIVED)


class PublishPermissionMixin:
    """Staff without the publish permission can edit drafts but cannot change publication status."""

    def get_readonly_fields(self, request, obj=None):
        fields = list(super().get_readonly_fields(request, obj))
        perm = f"{self.model._meta.app_label}.publish_{self.model._meta.model_name}"
        if not request.user.has_perm(perm):
            fields += ["publication_status", "published_at", "is_featured"]
        return fields
