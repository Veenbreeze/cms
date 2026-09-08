import logging

from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import exceptions as drf_exceptions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger("django")

FRIENDLY_MESSAGES = {
    status.HTTP_400_BAD_REQUEST: "Some information is missing or invalid. Please check the form and try again.",
    status.HTTP_401_UNAUTHORIZED: "Your session has expired. Please log in again.",
    status.HTTP_403_FORBIDDEN: "You don't have permission to do that.",
    status.HTTP_404_NOT_FOUND: "We couldn't find what you were looking for.",
    status.HTTP_405_METHOD_NOT_ALLOWED: "That action isn't available here.",
    status.HTTP_429_TOO_MANY_REQUESTS: "Too many attempts. Please wait a moment and try again.",
    status.HTTP_500_INTERNAL_SERVER_ERROR: "Something went wrong on our end. Please try again.",
}


def friendly_exception_handler(exc, context):
    """
    Wraps DRF's default handler so every error response has a consistent,
    human-readable `detail` message alongside the field-level `errors` a
    form needs — never a raw stack trace or "Internal Server Error" string.
    """
    if isinstance(exc, Http404):
        exc = drf_exceptions.NotFound()
    elif isinstance(exc, PermissionDenied):
        exc = drf_exceptions.PermissionDenied()

    response = exception_handler(exc, context)

    if response is None:
        logger.exception("Unhandled exception", exc_info=exc)
        return Response(
            {"detail": FRIENDLY_MESSAGES[status.HTTP_500_INTERNAL_SERVER_ERROR], "errors": None},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    field_errors = response.data if isinstance(response.data, dict) else None
    detail = FRIENDLY_MESSAGES.get(response.status_code, "Something went wrong. Please try again.")
    if isinstance(response.data, dict) and "detail" in response.data:
        detail = str(response.data["detail"])

    response.data = {"detail": detail, "errors": field_errors}
    return response
