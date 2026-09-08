from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChurchServantViewSet, PublicServantListView

router = DefaultRouter()
router.register("servants", ChurchServantViewSet, basename="servant")

public_urlpatterns = [
    path("public/leadership/", PublicServantListView.as_view(), name="public-leadership"),
]

urlpatterns = [
    path("", include(router.urls)),
]
