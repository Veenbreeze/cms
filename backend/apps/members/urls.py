from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MemberViewSet, SpiritualRecordViewSet

router = DefaultRouter()
router.register("members", MemberViewSet, basename="member")
router.register("spiritual-records", SpiritualRecordViewSet, basename="spiritual-record")

urlpatterns = [
    path("", include(router.urls)),
]
