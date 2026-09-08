from datetime import timedelta

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.generics import RetrieveAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import IsStaffRole, IsStaffRoleOrReadOnly

from .filters import AnnouncementFilterSet, EventFilterSet, GalleryImageFilterSet, SongFilterSet, WeeklyLessonFilterSet
from .models import (
    Announcement,
    DailySongCollection,
    Event,
    GalleryCategory,
    GalleryImage,
    QRCodeRecord,
    Song,
    WeeklyLesson,
)
from .serializers import (
    AnnouncementSerializer,
    DailySongCollectionSerializer,
    EventSerializer,
    GalleryCategorySerializer,
    GalleryImageSerializer,
    PublicSongCollectionSerializer,
    QRCodeRecordSerializer,
    SongSerializer,
    WeeklyLessonSerializer,
)
from .services.qrcode import generate_qr_for


def get_current_church():
    from apps.churches.models import Church

    church = Church.objects.active().first()
    if church is None:
        church = Church.objects.create(name="Church Name")
    return church


class ChurchScopedContextMixin:
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["church"] = get_current_church()
        return context


class AnnouncementViewSet(ChurchScopedContextMixin, viewsets.ModelViewSet):
    queryset = Announcement.objects.active().select_related("target_jumuia", "created_by")
    serializer_class = AnnouncementSerializer
    permission_classes = [IsStaffRoleOrReadOnly]
    filterset_class = AnnouncementFilterSet
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["title", "body"]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def perform_destroy(self, instance):
        instance.delete()


class WeeklyLessonViewSet(ChurchScopedContextMixin, viewsets.ModelViewSet):
    queryset = WeeklyLesson.objects.active()
    serializer_class = WeeklyLessonSerializer
    permission_classes = [IsStaffRoleOrReadOnly]
    filterset_class = WeeklyLessonFilterSet
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["title", "scripture_reference"]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def perform_destroy(self, instance):
        instance.delete()


class SongViewSet(ChurchScopedContextMixin, viewsets.ModelViewSet):
    queryset = Song.objects.active()
    serializer_class = SongSerializer
    permission_classes = [IsStaffRoleOrReadOnly]
    filterset_class = SongFilterSet
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["title", "number"]

    def perform_destroy(self, instance):
        instance.delete()


class DailySongCollectionViewSet(ChurchScopedContextMixin, viewsets.ModelViewSet):
    queryset = DailySongCollection.objects.active().prefetch_related("items__song", "qr_codes")
    serializer_class = DailySongCollectionSerializer
    permission_classes = [IsStaffRoleOrReadOnly]
    filterset_fields = ["date"]

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=True, methods=["post"], url_path="generate-qr")
    def generate_qr(self, request, pk=None):
        collection = self.get_object()
        record = generate_qr_for(collection)
        return Response(QRCodeRecordSerializer(record, context=self.get_serializer_context()).data)


class QRCodeRecordViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = QRCodeRecord.objects.active()
    serializer_class = QRCodeRecordSerializer
    permission_classes = [IsStaffRole]
    filterset_fields = ["daily_song_collection"]


class GalleryCategoryViewSet(ChurchScopedContextMixin, viewsets.ModelViewSet):
    queryset = GalleryCategory.objects.active()
    serializer_class = GalleryCategorySerializer
    permission_classes = [IsStaffRoleOrReadOnly]

    def perform_destroy(self, instance):
        instance.delete()


class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.active().select_related("category")
    serializer_class = GalleryImageSerializer
    permission_classes = [IsStaffRoleOrReadOnly]
    filterset_class = GalleryImageFilterSet
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def perform_destroy(self, instance):
        instance.delete()


class EventViewSet(ChurchScopedContextMixin, viewsets.ModelViewSet):
    queryset = Event.objects.active().select_related("target_jumuia", "created_by")
    serializer_class = EventSerializer
    permission_classes = [IsStaffRoleOrReadOnly]
    filterset_class = EventFilterSet
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["title", "location"]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def perform_destroy(self, instance):
        instance.delete()


# ---- Public (unauthenticated) endpoints ----

class PublicSongCollectionView(RetrieveAPIView):
    """Backs the song-sheet page a QR code opens — no login required."""

    queryset = DailySongCollection.objects.active().prefetch_related("items__song")
    serializer_class = PublicSongCollectionSerializer
    permission_classes = [AllowAny]


class PublicSongCollectionScanView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk=None):
        record = QRCodeRecord.objects.active().filter(daily_song_collection_id=pk).order_by("-created_at").first()
        if record:
            QRCodeRecord.objects.filter(pk=record.pk).update(scan_count=record.scan_count + 1)
        return Response({"detail": "ok"})


class PublicLandingFeedView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        today = timezone.localdate()
        now = timezone.now()

        announcements = (
            Announcement.objects.active()
            .filter(target_audience=Announcement.Audience.EVERYONE, published_at__isnull=False, published_at__lte=now)
            .exclude(expires_at__lt=now)
            .order_by("-is_pinned", "-published_at")[:3]
        )
        lesson = WeeklyLesson.objects.active().filter(week_start_date__lte=today).order_by("-week_start_date").first()
        collection = (
            DailySongCollection.objects.active()
            .filter(date=today)
            .prefetch_related("items__song")
            .order_by("-created_at")
            .first()
        )
        events = (
            Event.objects.active()
            .filter(target_audience=Announcement.Audience.EVERYONE, start_datetime__gte=now - timedelta(hours=6))
            .order_by("start_datetime")[:3]
        )
        photos = GalleryImage.objects.active().select_related("category").order_by("-created_at")[:6]
        context = {"request": request}

        return Response(
            {
                "announcements": AnnouncementSerializer(announcements, many=True, context=context).data,
                "lesson": WeeklyLessonSerializer(lesson, context=context).data if lesson else None,
                "song_collection": PublicSongCollectionSerializer(collection, context=context).data if collection else None,
                "events": EventSerializer(events, many=True, context=context).data,
                "photos": GalleryImageSerializer(photos, many=True, context=context).data,
            }
        )
