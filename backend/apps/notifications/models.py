"""
Schema-only stub. Recipients are always in-app for now (is_read/read_at);
notification_type is future-proofing so SMS/email/push senders can be
plugged in later without a schema change — sending isn't implemented yet.
"""
from django.db import models


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        SYSTEM = "SYSTEM", "In-app"
        SMS = "SMS", "SMS"
        EMAIL = "EMAIL", "Email"
        PUSH = "PUSH", "Push"

    recipient = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    notification_type = models.CharField(max_length=10, choices=NotificationType.choices, default=NotificationType.SYSTEM)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} -> {self.recipient}"
