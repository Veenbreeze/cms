"""Schema-only stub for the future Church Servants History module."""
from django.db import models

from apps.core.models import BaseModel
from apps.core.validators import validate_image_file


class ChurchServant(BaseModel):
    church = models.ForeignKey("churches.Church", on_delete=models.CASCADE, related_name="servants")
    member = models.ForeignKey("members.Member", on_delete=models.SET_NULL, null=True, blank=True, related_name="servant_history")
    full_name = models.CharField(max_length=150, help_text="Kept independently of Member so history survives even if the member record is later removed.")
    position_title = models.CharField(max_length=150, help_text="e.g. Parish Priest, Chairperson, Secretary")
    jumuia = models.ForeignKey("jumuia.Jumuia", on_delete=models.SET_NULL, null=True, blank=True)
    photo = models.ImageField(upload_to="servants/", blank=True, null=True, validators=[validate_image_file])
    start_year = models.PositiveIntegerField(null=True, blank=True)
    end_year = models.PositiveIntegerField(null=True, blank=True, help_text="Blank means currently serving.")
    title_confirmed = models.BooleanField(default=True)
    biography = models.TextField(blank=True)
    achievements = models.TextField(blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-start_year"]

    def __str__(self):
        years = f"{self.start_year}–{self.end_year or 'present'}"
        return f"{self.full_name} — {self.position_title} ({years})"
