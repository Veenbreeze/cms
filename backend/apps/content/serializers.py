from rest_framework import serializers

from .models import (
    Announcement,
    DailySongCollection,
    DailySongCollectionItem,
    Event,
    GalleryCategory,
    GalleryImage,
    PrayerRequest,
    QRCodeRecord,
    Song,
    WeeklyLesson,
)


class PublicPrayerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrayerRequest
        fields = ["id", "name", "email", "message", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["submitted_by"] = request.user
        return super().create(validated_data)


class MemberPrayerRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = PrayerRequest
        fields = ["id", "message", "status", "status_display", "created_at"]
        read_only_fields = fields


class AdminPrayerRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    submitted_by_name = serializers.CharField(source="submitted_by.get_full_name", read_only=True, default=None)

    class Meta:
        model = PrayerRequest
        fields = [
            "id", "name", "email", "message", "submitted_by_name", "status", "status_display",
            "is_confidential", "internal_notes", "created_at",
        ]
        read_only_fields = ["id", "name", "email", "message", "submitted_by_name", "is_confidential", "created_at"]


class AnnouncementSerializer(serializers.ModelSerializer):
    target_jumuia_name = serializers.CharField(source="target_jumuia.name", read_only=True, default=None)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True, default=None)

    class Meta:
        model = Announcement
        fields = [
            "id", "title", "body", "category", "priority", "image", "is_pinned",
            "target_audience", "target_jumuia", "target_jumuia_name", "target_role",
            "published_at", "expires_at", "created_by_name", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["church"] = self.context["church"]
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class WeeklyLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLesson
        fields = [
            "id", "title", "scripture_reference", "content", "week_start_date",
            "document", "image", "author_name", "notes", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["church"] = self.context["church"]
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ["id", "number", "title", "lyrics", "category", "language", "notes"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        validated_data["church"] = self.context["church"]
        return super().create(validated_data)


class QRCodeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRCodeRecord
        fields = ["id", "daily_song_collection", "target_url", "qr_image", "scan_count", "created_at"]
        read_only_fields = fields


class DailySongCollectionItemSerializer(serializers.ModelSerializer):
    song_title = serializers.CharField(source="song.title", read_only=True)
    song_number = serializers.CharField(source="song.number", read_only=True)

    class Meta:
        model = DailySongCollectionItem
        fields = ["id", "song", "song_title", "song_number", "order"]


class DailySongCollectionSerializer(serializers.ModelSerializer):
    """
    Accepts a nested `items` list on write (`[{"song": <id>, "order": <int>}, ...]`)
    and fully replaces the collection's items on update — simpler and safer than
    diffing, since a "day's songs" list is always edited as a whole unit.
    """

    items = DailySongCollectionItemSerializer(many=True, required=False)
    qr_code = serializers.SerializerMethodField()

    class Meta:
        model = DailySongCollection
        fields = ["id", "date", "service_name", "items", "qr_code", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_qr_code(self, obj):
        record = obj.qr_codes.active().order_by("-created_at").first()
        if not record:
            return None
        return QRCodeRecordSerializer(record, context=self.context).data

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        validated_data["church"] = self.context["church"]
        validated_data["created_by"] = self.context["request"].user
        collection = super().create(validated_data)
        self._sync_items(collection, items_data)
        return collection

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        collection = super().update(instance, validated_data)
        if items_data is not None:
            collection.items.all().delete()
            self._sync_items(collection, items_data)
        return collection

    def _sync_items(self, collection, items_data):
        DailySongCollectionItem.objects.bulk_create(
            [
                DailySongCollectionItem(collection=collection, song=item["song"], order=item.get("order", index))
                for index, item in enumerate(items_data)
            ]
        )


class GalleryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryCategory
        fields = ["id", "name"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        validated_data["church"] = self.context["church"]
        return super().create(validated_data)


class GalleryImageSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True, default=None)

    class Meta:
        model = GalleryImage
        fields = ["id", "category", "category_name", "image", "caption", "taken_on", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["uploaded_by"] = self.context["request"].user
        return super().create(validated_data)


class EventSerializer(serializers.ModelSerializer):
    target_jumuia_name = serializers.CharField(source="target_jumuia.name", read_only=True, default=None)

    class Meta:
        model = Event
        fields = [
            "id", "title", "description", "start_datetime", "end_datetime", "location",
            "category", "image", "video_url", "target_audience", "target_jumuia", "target_jumuia_name",
            "target_role", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["church"] = self.context["church"]
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class PublicSongCollectionSerializer(serializers.ModelSerializer):
    """Used by the unauthenticated song-sheet page a QR code opens."""

    items = DailySongCollectionItemSerializer(many=True, read_only=True)
    songs = serializers.SerializerMethodField()

    class Meta:
        model = DailySongCollection
        fields = ["id", "date", "service_name", "items", "songs"]

    def get_songs(self, obj):
        return SongSerializer([item.song for item in obj.items.select_related("song").order_by("order")], many=True).data
