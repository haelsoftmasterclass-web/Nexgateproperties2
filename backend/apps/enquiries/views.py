import hmac
import logging

from django.conf import settings
from django.db import DatabaseError
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .notifications import notify_staff
from .serializers import EnquiryCreateSerializer

logger = logging.getLogger(__name__)


class EnquiryCreateView(APIView):
    """Accepts enquiries. Responds only with a reference; submitted personal data is never echoed."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "enquiries"

    def post(self, request):
        expected_key = settings.ENQUIRY_API_KEY
        if expected_key:
            supplied = request.headers.get("X-Enquiry-Key", "")
            if not hmac.compare_digest(supplied, expected_key):
                raise PermissionDenied("Submission not accepted.")

        serializer = EnquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            enquiry = serializer.save()
        except DatabaseError:
            logger.exception("Could not store enquiry")
            return Response(
                {"detail": "We could not save your enquiry. Please try again or contact us by phone."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        notify_staff(enquiry)
        return Response({"reference": enquiry.reference, "status": "received"}, status=status.HTTP_201_CREATED)
