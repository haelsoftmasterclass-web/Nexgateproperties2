import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def notify_staff(enquiry) -> None:
    """Email staff about a new enquiry, only when an email service and recipients are configured.

    The email intentionally omits personal details; staff open the admin to see them.
    """
    if not (settings.EMAIL_HOST and settings.ENQUIRY_NOTIFICATION_EMAILS):
        return
    try:
        send_mail(
            subject=f"New {enquiry.get_category_display().lower()} ({enquiry.reference})",
            message=(
                f"A new enquiry was received on the Nexgate Properties website.\n\n"
                f"Reference: {enquiry.reference}\nCategory: {enquiry.get_category_display()}\n\n"
                f"Review it in the admin: {settings.SITE_ADMIN_URL}enquiries/enquiry/{enquiry.pk}/change/\n"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=settings.ENQUIRY_NOTIFICATION_EMAILS,
            fail_silently=False,
        )
    except Exception:  # noqa: BLE001 - the enquiry is already stored; log and carry on
        logger.exception("Enquiry notification email failed for %s", enquiry.reference)
