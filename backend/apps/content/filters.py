import django_filters

from .models import Announcement, Event, GalleryImage, Song, WeeklyLesson


class AnnouncementFilterSet(django_filters.FilterSet):
    class Meta:
        model = Announcement
        fields = ["category", "priority", "is_pinned"]


class WeeklyLessonFilterSet(django_filters.FilterSet):
    week_from = django_filters.DateFilter(field_name="week_start_date", lookup_expr="gte")
    week_to = django_filters.DateFilter(field_name="week_start_date", lookup_expr="lte")

    class Meta:
        model = WeeklyLesson
        fields = ["week_from", "week_to"]


class SongFilterSet(django_filters.FilterSet):
    class Meta:
        model = Song
        fields = ["category", "language"]


class GalleryImageFilterSet(django_filters.FilterSet):
    class Meta:
        model = GalleryImage
        fields = ["category"]


class EventFilterSet(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name="start_datetime", lookup_expr="date__gte")
    date_to = django_filters.DateFilter(field_name="start_datetime", lookup_expr="date__lte")

    class Meta:
        model = Event
        fields = ["category", "date_from", "date_to"]
