from django.db.models import Count, Q
from rest_framework import serializers

from apps.core.constants import Gender, Roles

from .models import Jumuia


class JumuiaListSerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(read_only=True, default=0)
    chairperson_name = serializers.SerializerMethodField()

    class Meta:
        model = Jumuia
        fields = [
            "id", "name", "code", "description", "meeting_day", "meeting_location",
            "member_count", "chairperson_name", "is_active", "created_at",
        ]

    def get_chairperson_name(self, obj):
        chairperson = obj.staff_users.filter(role=Roles.CHAIRPERSON, is_active=True).first()
        return chairperson.get_full_name() if chairperson else None


class JumuiaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jumuia
        fields = ["id", "church", "name", "code", "description", "meeting_day", "meeting_location"]
        read_only_fields = ["id"]
        extra_kwargs = {"church": {"required": False}}

    def create(self, validated_data):
        if not validated_data.get("church"):
            validated_data["church"] = self.context["church"]
        return super().create(validated_data)


class JumuiaStatsSerializer(serializers.Serializer):
    total_members = serializers.IntegerField()
    male_members = serializers.IntegerField()
    female_members = serializers.IntegerField()

    @staticmethod
    def build(jumuia):
        counts = jumuia.members.active().aggregate(
            total=Count("id"),
            male=Count("id", filter=Q(gender=Gender.MALE)),
            female=Count("id", filter=Q(gender=Gender.FEMALE)),
        )
        return {
            "total_members": counts["total"],
            "male_members": counts["male"],
            "female_members": counts["female"],
        }
