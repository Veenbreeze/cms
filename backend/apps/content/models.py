"""
Schema-only stubs for modules deferred past this build pass (announcements,
weekly lessons, songs + QR, gallery, events). Fields follow the product spec
so future work is pure API/UI — no migrations rework. No serializers/views
yet; registered in admin only so content can be entered manually meanwhile.
"""
from django.db import models

from apps.core.models import BaseModel
from apps.core.validators import validate_document_file, validate_image_file


class Announcement(BaseModel):
    class Category(models.TextChoices):
        GENERAL = "GENERAL", "General"
        WEEKLY = "WEEKLY", "Weekly"
        IMPORTANT = "IMPORTANT", "Important"
        ANNUAL = "ANNUAL", "Annual"
        EMERGENCY = "EMERGENCY", "Emergency"

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        NORMAL = "NORMAL", "Normal"
        HIGH = "HIGH", "High"
        URGENT = "URGENT", "Urgent"

    class Audience(models.TextChoices):
        EVERYONE = "EVERYONE", "Everyone"
        JUMUIA = "JUMUIA", "Specific Jumuia"
        ROLE = "ROLE", "Specific Role"

    church = models.ForeignKey("churches.Church", on_delete=models.CASCADE, related_name="announcements")
    title = models.CharField(max_length=200)
    body = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.GENERAL)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.NORMAL)
    image = models.ImageField(upload_to="announcements/", blank=True, null=True, validators=[validate_image_file])
    is_pinned = models.BooleanField(default=False)
    target_audience = models.CharField(max_length=10, choices=Audience.choices, default=Audience.EVERYONE)
    target_jumuia = models.ForeignKey("jumuia.Jumuia", on_delete=models.SET_NULL, null=True, blank=True)
    target_role = models.CharField(max_length=20, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["-is_pinned", "-published_at"]

    def __str__(self):
        return self.title


class WeeklyLesson(BaseModel):
    church = models.ForeignKey("churches.Church", on_delete=models.CASCADE, related_name="weekly_lessons")
    title = models.CharField(max_length=200)
    scripture_reference = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    week_start_date = models.DateField()
    document = models.FileField(upload_to="lessons/documents/", blank=True, null=True, validators=[validate_document_file])
    image = models.ImageField(upload_to="lessons/images/", blank=True, null=True, validators=[validate_image_file])
    author_name = models.CharField(max_length=150, blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["-week_start_date"]

    def __str__(self):
        return f"{self.title} ({self.week_start_date})"


class Song(BaseModel):
    church = models.ForeignKey("churches.Church", on_delete=models.CASCADE, related_name="songs")
    number = models.CharField(max_length=20, blank=True)
    title = models.CharField(max_length=200)
    lyrics = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=5, default="sw")
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title


class DailySongCollection(BaseModel):
    church = models.ForeignKey("churches.Church", on_delete=models.CASCADE, related_name="song_collections")
    date = models.DateField()
    service_name = models.CharField(max_length=150, blank=True, help_text="e.g. Sunday Mass")
    created_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["-date"]
        constraints = [
            models.UniqueConstraint(fields=["church", "date", "service_name"], name="unique_collection_per_service")
        ]

    def __str__(self):
        return f"{self.service_name or 'Service'} — {self.date}"


class DailySongCollectionItem(models.Model):
    collection = models.ForeignKey(DailySongCollection, on_delete=models.CASCADE, related_name="items")
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        constraints = [models.UniqueConstraint(fields=["collection", "song"], name="unique_song_per_collection")]


class QRCodeRecord(BaseModel):
    daily_song_collection = models.ForeignKey(
        DailySongCollection, on_delete=models.CASCADE, related_name="qr_codes", null=True, blank=True
    )
    target_url = models.URLField()
    qr_image = models.ImageField(upload_to="qr-codes/", blank=True, null=True, validators=[validate_image_file])
    scan_count = models.PositiveIntegerField(default=0)
    generated_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"QR for {self.target_url}"


class GalleryCategory(BaseModel):
    church = models.ForeignKey("churches.Church", on_delete=models.CASCADE, related_name="gallery_categories")
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Gallery categories"
        constraints = [models.UniqueConstraint(fields=["church", "name"], name="unique_gallery_category_per_church")]

    def __str__(self):
        return self.name


class GalleryImage(BaseModel):
    category = models.ForeignKey(GalleryCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="images")
    image = models.ImageField(upload_to="gallery/", validators=[validate_image_file])
    caption = models.CharField(max_length=255, blank=True)
    taken_on = models.DateField(null=True, blank=True)
    uploaded_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.caption or f"Photo {self.id}"


class Event(BaseModel):
    church = models.ForeignKey("churches.Church", on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to="events/", blank=True, null=True, validators=[validate_image_file])
    video_url = models.URLField(blank=True, help_text="Optional YouTube link to a recording or livestream of this event.")
    target_audience = models.CharField(max_length=10, choices=Announcement.Audience.choices, default=Announcement.Audience.EVERYONE)
    target_jumuia = models.ForeignKey("jumuia.Jumuia", on_delete=models.SET_NULL, null=True, blank=True)
    target_role = models.CharField(max_length=20, blank=True)
    created_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["start_datetime"]

    def __str__(self):
        return self.title
