import os

from django.core.exceptions import ValidationError

MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_DOCUMENT_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | {".pdf"}


def _validate_file(value, allowed_extensions, max_size_bytes, kind_label):
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in allowed_extensions:
        raise ValidationError(
            f"Unsupported {kind_label} type '{ext}'. Allowed types: {', '.join(sorted(allowed_extensions))}."
        )
    if value.size > max_size_bytes:
        raise ValidationError(f"This {kind_label} is too large. Maximum size is {max_size_bytes // (1024 * 1024)} MB.")


def validate_image_file(value):
    _validate_file(value, ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE_BYTES, "image")


def validate_document_file(value):
    _validate_file(value, ALLOWED_DOCUMENT_EXTENSIONS, MAX_DOCUMENT_SIZE_BYTES, "document")
