from django.db import models

from apps.core.models import BaseModel


class Jumuia(BaseModel):
    """
    A church community/small-group. Deliberately has no chairperson/secretary
    FK here — that would create a circular dependency with accounts.User
    (which itself references Jumuia). Instead, "who leads this Jumuia" is
    derived via User.objects.filter(jumuia=this, role=Roles.CHAIRPERSON).
    """

    church = models.ForeignKey("churches.Church", on_delete=models.PROTECT, related_name="jumuia_list")
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    meeting_day = models.CharField(max_length=20, blank=True)
    meeting_location = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Jumuia"
        verbose_name_plural = "Jumuia"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(fields=["church", "name"], name="unique_jumuia_name_per_church"),
        ]
        indexes = [models.Index(fields=["is_active"]), models.Index(fields=["code"])]

    def __str__(self):
        return self.name
