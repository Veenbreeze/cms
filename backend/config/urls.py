from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apps.content.urls import public_urlpatterns as content_public_urlpatterns
from apps.servants.urls import public_urlpatterns as servants_public_urlpatterns

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.core.urls")),
    path("api/v1/", include("apps.accounts.urls")),
    path("api/v1/", include("apps.churches.urls")),
    path("api/v1/", include("apps.jumuia.urls")),
    path("api/v1/", include("apps.members.urls")),
    path("api/v1/", include("apps.audit.urls")),
    path("api/v1/", include("apps.content.urls")),
    path("api/v1/", include("apps.servants.urls")),
    path("api/v1/", include("apps.notifications.urls")),
    path("api/v1/", include(content_public_urlpatterns)),
    path("api/v1/", include(servants_public_urlpatterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
