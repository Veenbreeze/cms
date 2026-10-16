from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MemberViewSet, MyMemberView, ParticipationRecordViewSet, SpiritualRecordViewSet

router = DefaultRouter()
router.register("members", MemberViewSet, basename="member")
router.register("spiritual-records", SpiritualRecordViewSet, basename="spiritual-record")
router.register("participation-records", ParticipationRecordViewSet, basename="participation-record")

urlpatterns = [
    path("members/me/", MyMemberView.as_view(), name="my-member"),
    path("", include(router.urls)),
]
