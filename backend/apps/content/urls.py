from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AnnouncementViewSet,
    DailySongCollectionViewSet,
    EventViewSet,
    GalleryCategoryViewSet,
    GalleryImageViewSet,
    PublicLandingFeedView,
    PublicSongCollectionScanView,
    PublicSongCollectionView,
    QRCodeRecordViewSet,
    SongViewSet,
    WeeklyLessonViewSet,
)

router = DefaultRouter()
router.register("announcements", AnnouncementViewSet, basename="announcement")
router.register("weekly-lessons", WeeklyLessonViewSet, basename="weekly-lesson")
router.register("songs", SongViewSet, basename="song")
router.register("song-collections", DailySongCollectionViewSet, basename="song-collection")
router.register("qr-codes", QRCodeRecordViewSet, basename="qr-code")
router.register("gallery-categories", GalleryCategoryViewSet, basename="gallery-category")
router.register("gallery-images", GalleryImageViewSet, basename="gallery-image")
router.register("events", EventViewSet, basename="event")

urlpatterns = [
    path("", include(router.urls)),
]

public_urlpatterns = [
    path("public/song-collections/<uuid:pk>/", PublicSongCollectionView.as_view(), name="public-song-collection"),
    path("public/song-collections/<uuid:pk>/scan/", PublicSongCollectionScanView.as_view(), name="public-song-collection-scan"),
    path("public/landing-feed/", PublicLandingFeedView.as_view(), name="public-landing-feed"),
]
