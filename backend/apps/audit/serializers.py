from rest_framework import serializers

from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.get_full_name", read_only=True, default=None)
    actor_email = serializers.CharField(source="actor.email", read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = [
            "id", "actor", "actor_name", "actor_email", "action", "model_name",
            "object_id", "object_repr", "changes", "ip_address", "created_at",
        ]
