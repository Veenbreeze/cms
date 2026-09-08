import threading

_request_context = threading.local()


def get_current_request():
    return getattr(_request_context, "request", None)


def get_current_user():
    request = get_current_request()
    if request is not None and getattr(request, "user", None) and request.user.is_authenticated:
        return request.user
    return None


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


class RequestContextMiddleware:
    """
    Stashes the current request in thread-local storage so model signal
    receivers (apps.audit.signals) can capture the acting user and IP
    address without every call site having to thread the request through.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _request_context.request = request
        try:
            response = self.get_response(request)
        finally:
            _request_context.request = None
        return response
