from django.db import models

from apps.core.models import BaseModel

ASSIGNMENT_STRATEGY_CHOICES = [
    ("least_loaded", "Least loaded Jumuia"),
]

LANGUAGE_CHOICES = [
    ("en", "English"),
    ("sw", "Kiswahili"),
]


class Church(BaseModel):
    """
    Represents one church organization. Modeled as a table (rather than
    global settings) so the platform can support multiple branches later,
    even though this build assumes a single active row.
    """

    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=50, blank=True, help_text="Used as the Member ID prefix, e.g. 'SMP'.")
    logo = models.ImageField(upload_to="church/logo/", blank=True, null=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    denomination = models.CharField(max_length=120, blank=True)
    timezone = models.CharField(max_length=64, default="Africa/Nairobi")
    default_language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default="en")
    jumuia_assignment_strategy = models.CharField(max_length=50, choices=ASSIGNMENT_STRATEGY_CHOICES, default="least_loaded")

    # Social links + short public description, editable from Settings later
    description = models.TextField(blank=True)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)

    # Mobile-money giving/control numbers (e.g. Tanzania "Lipa Namba"), each with a short label
    giving_number_1 = models.CharField(max_length=50, blank=True)
    giving_number_1_label = models.CharField(max_length=100, blank=True)
    giving_number_2 = models.CharField(max_length=50, blank=True)
    giving_number_2_label = models.CharField(max_length=100, blank=True)

    class Meta:
        verbose_name = "Church"
        verbose_name_plural = "Churches"
        ordering = ["name"]

    def __str__(self):
        return self.name
