from django.db import models

from apps.core.constants import AuditAction


class AuditLog(models.Model):
    """
    Immutable, append-only record of who did what. Deliberately does not
    inherit apps.core.models.BaseModel — an audit trail must never be
    soft-deleted or edited, so it gets its own minimal, uneditable shape.
    """

    actor = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_actions"
    )
    action = models.CharField(max_length=10, choices=AuditAction.choices)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=64)
    object_repr = models.CharField(max_length=255, blank=True)
    changes = models.JSONField(blank=True, null=True, help_text="{field: [old, new]}")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["model_name", "object_id"]),
            models.Index(fields=["actor"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["action"]),
        ]

    def __str__(self):
        return f"{self.action} {self.model_name}({self.object_id}) by {self.actor}"
