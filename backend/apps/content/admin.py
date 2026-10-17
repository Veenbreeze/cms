from django.contrib import admin

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


class DailySongCollectionItemInline(admin.TabularInline):
    model = DailySongCollectionItem
    extra = 1


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "priority", "is_pinned", "published_at", "expires_at")
    list_filter = ("category", "priority", "target_audience")
    search_fields = ("title",)


@admin.register(WeeklyLesson)
class WeeklyLessonAdmin(admin.ModelAdmin):
    list_display = ("title", "week_start_date", "author_name")
    search_fields = ("title",)


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ("title", "number", "category", "language")
    search_fields = ("title", "number")


@admin.register(DailySongCollection)
class DailySongCollectionAdmin(admin.ModelAdmin):
    list_display = ("date", "service_name", "church")
    inlines = [DailySongCollectionItemInline]


@admin.register(QRCodeRecord)
class QRCodeRecordAdmin(admin.ModelAdmin):
    list_display = ("target_url", "scan_count", "created_at")


@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "church")


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("caption", "category", "taken_on")
    list_filter = ("category",)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "start_datetime", "location", "category")
    list_filter = ("category",)
    search_fields = ("title",)


@admin.register(PrayerRequest)
class PrayerRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "status", "is_confidential", "created_at")
    list_filter = ("status", "is_confidential", "created_at")
    search_fields = ("name", "email", "message")
    readonly_fields = ("name", "email", "message", "submitted_by", "created_at")
