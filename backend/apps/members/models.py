import uuid

from django.db import models

from apps.core.constants import Gender, MilestoneStatus, MilestoneType, ParticipationCategory, ParticipationStatus
from apps.core.models import BaseModel
from apps.core.validators import validate_document_file, validate_image_file


def member_photo_path(instance, filename):
    ext = filename.rsplit(".", 1)[-1].lower()
    return f"members/photos/{instance.id or uuid.uuid4()}.{ext}"


def spiritual_record_document_path(instance, filename):
    ext = filename.rsplit(".", 1)[-1].lower()
    return f"members/spiritual-records/{instance.id or uuid.uuid4()}.{ext}"


class MemberIdSequence(models.Model):
    """
    Internal counter used to atomically generate member_no values
    (`{church.short_name}-{year}-{seq:04d}`). A dedicated row with
    select_for_update() avoids the race condition and post-soft-delete gaps
    a naive `Member.objects.count() + 1` would produce under concurrent
    registrations.
    """

    church = models.ForeignKey("churches.Church", on_delete=models.CASCADE, related_name="member_id_sequences")
    year = models.PositiveIntegerField()
    last_value = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["church", "year"], name="unique_sequence_per_church_year")]


class Member(BaseModel):
    member_no = models.CharField(max_length=30, unique=True, editable=False)
    full_name = models.CharField(max_length=150, db_index=True)
    gender = models.CharField(max_length=10, choices=Gender.choices)
    date_of_birth = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True, db_index=True)
    email = models.EmailField(blank=True)
    jumuia = models.ForeignKey("jumuia.Jumuia", on_delete=models.PROTECT, related_name="members")
    residential_address = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=150, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    profile_photo = models.ImageField(
        upload_to=member_photo_path, blank=True, null=True, validators=[validate_image_file]
    )
    date_joined_church = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="members_registered"
    )

    class Meta:
        ordering = ["full_name"]
        indexes = [
            models.Index(fields=["member_no"]),
            models.Index(fields=["phone"]),
            models.Index(fields=["jumuia", "is_active"]),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.member_no})"


class MemberSpiritualRecord(BaseModel):
    """
    Append-only history of a member's spiritual milestones. No DB uniqueness
    constraint on (member, milestone_type): a second MARRIAGE or CONFIRMATION
    record is a legitimate pastoral scenario (remarriage, re-confirmation),
    so the profile timeline simply shows the latest record per type by date.
    """

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="spiritual_records")
    milestone_type = models.CharField(max_length=20, choices=MilestoneType.choices)
    custom_label = models.CharField(max_length=100, blank=True, help_text="Used when milestone_type is OTHER.")
    status = models.CharField(max_length=15, choices=MilestoneStatus.choices, default=MilestoneStatus.COMPLETED)
    date = models.DateField(null=True, blank=True)
    place = models.CharField(max_length=200, blank=True)
    minister_name = models.CharField(max_length=150, blank=True)
    notes = models.TextField(blank=True)
    supporting_document = models.FileField(
        upload_to=spiritual_record_document_path, blank=True, null=True, validators=[validate_document_file]
    )
    recorded_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [models.Index(fields=["member", "milestone_type"])]

    def __str__(self):
        label = self.custom_label or self.get_milestone_type_display()
        return f"{label} — {self.member.full_name}"


class MemberParticipation(BaseModel):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="participation_records")
    category = models.CharField(max_length=20, choices=ParticipationCategory.choices)
    activity_name = models.CharField(max_length=200)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=ParticipationStatus.choices, default=ParticipationStatus.ATTENDED)
    notes = models.TextField(blank=True)
    recorded_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="participation_records"
    )

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [models.Index(fields=["member", "date"]), models.Index(fields=["category", "date"])]

    def __str__(self):
        return f"{self.activity_name} — {self.member.full_name} ({self.date})"
