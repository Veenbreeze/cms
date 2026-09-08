from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import JumuiaViewSet

router = DefaultRouter()
router.register("jumuia", JumuiaViewSet, basename="jumuia")

urlpatterns = [
    path("", include(router.urls)),
]
