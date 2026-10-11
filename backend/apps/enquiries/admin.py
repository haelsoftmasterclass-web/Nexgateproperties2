from django.contrib import admin, messages

from .models import Enquiry, EnquiryStatus


@admin.action(description="Mark as contacted")
def mark_contacted(modeladmin, request, queryset):
    updated = queryset.update(status=EnquiryStatus.CONTACTED)
    modeladmin.message_user(request, f"{updated} enquiry(ies) marked as contacted.", messages.SUCCESS)


@admin.action(description="Assign to me")
def assign_to_me(modeladmin, request, queryset):
    if not request.user.has_perm("enquiries.assign_enquiry"):
        modeladmin.message_user(request, "You do not have permission to assign enquiries.", messages.ERROR)
        return
    updated = queryset.update(assigned_to=request.user)
    modeladmin.message_user(request, f"{updated} enquiry(ies) assigned to you.", messages.SUCCESS)


@admin.action(description="Close selected")
def close(modeladmin, request, queryset):
    updated = queryset.update(status=EnquiryStatus.CLOSED)
    modeladmin.message_user(request, f"{updated} enquiry(ies) closed.", messages.SUCCESS)


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ["reference", "created_at", "category", "full_name", "status", "assigned_to", "property", "project"]
    list_filter = ["status", "category", "assigned_to", "created_at"]
    search_fields = ["reference", "full_name", "email", "phone"]
    date_hierarchy = "created_at"
    actions = [mark_contacted, assign_to_me, close]
    list_select_related = ["assigned_to", "property", "project"]
    readonly_fields = [
        "reference",
        "category",
        "full_name",
        "email",
        "phone",
        "message",
        "property",
        "project",
        "details",
        "preferred_contact_method",
        "source_page",
        "consent_given",
        "consent_text",
        "consent_at",
        "created_at",
        "updated_at",
    ]
    fieldsets = [
        ("Submission", {"fields": ["reference", "created_at", "category", "property", "project", "source_page"]}),
        ("Contact", {"fields": ["full_name", "email", "phone", "preferred_contact_method"]}),
        ("Request", {"fields": ["message", "details"]}),
        ("Consent", {"fields": ["consent_given", "consent_text", "consent_at"]}),
        ("Handling", {"fields": ["status", "assigned_to", "internal_notes", "updated_at"]}),
    ]

    def has_add_permission(self, request):
        # Enquiries come from the website only.
        return False

    def get_readonly_fields(self, request, obj=None):
        fields = list(super().get_readonly_fields(request, obj))
        if not request.user.has_perm("enquiries.assign_enquiry"):
            fields.append("assigned_to")
        return fields
