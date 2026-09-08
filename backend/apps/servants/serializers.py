from rest_framework import serializers

from .models import ChurchServant


class ChurchServantSerializer(serializers.ModelSerializer):
    jumuia_name = serializers.CharField(source="jumuia.name", read_only=True, default=None)

    class Meta:
        model = ChurchServant
        fields = [
            "id", "full_name", "position_title", "jumuia", "jumuia_name", "photo",
            "start_year", "end_year", "biography", "achievements", "notes", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["church"] = self.context["church"]
        return super().create(validated_data)


class PublicChurchServantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchServant
        fields = ["id", "full_name", "position_title", "photo", "start_year", "end_year", "biography", "achievements"]
        read_only_fields = fields
