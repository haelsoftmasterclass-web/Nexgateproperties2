from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"]
_extension_validator = FileExtensionValidator(ALLOWED_IMAGE_EXTENSIONS)


def validate_image_upload(file):
    """Reject oversized or non-image uploads. ImageField already verifies the content with Pillow."""
    _extension_validator(file)
    limit = settings.MAX_IMAGE_UPLOAD_BYTES
    if limit and file.size > limit:
        raise ValidationError(f"Images must be {limit // (1024 * 1024)} MB or smaller.")
