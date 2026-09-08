from rest_framework import serializers

from .models import Church


class ChurchSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Church
        fields = [
            "id", "name", "short_name", "logo", "address", "phone", "email",
            "denomination", "timezone", "default_language", "jumuia_assignment_strategy",
            "description", "facebook_url", "instagram_url", "youtube_url",
            "giving_number_1", "giving_number_1_label", "giving_number_2", "giving_number_2_label",
        ]
        read_only_fields = ["id"]


class PublicChurchInfoSerializer(serializers.ModelSerializer):
    """Only the subset of Church fields that are safe to expose without auth."""

    class Meta:
        model = Church
        fields = [
            "name", "logo", "address", "phone", "email", "denomination",
            "description", "facebook_url", "instagram_url", "youtube_url",
            "giving_number_1", "giving_number_1_label", "giving_number_2", "giving_number_2_label",
        ]
