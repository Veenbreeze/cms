from rest_framework import serializers

from apps.core.constants import JUMUIA_SCOPED_ROLES
from apps.jumuia.models import Jumuia
from apps.jumuia.services.assignment import suggest_jumuia_for

from .models import Member, MemberSpiritualRecord
from .utils import generate_member_no


class SpiritualRecordSerializer(serializers.ModelSerializer):
    milestone_type_display = serializers.CharField(source="get_milestone_type_display", read_only=True)

    class Meta:
        model = MemberSpiritualRecord
        fields = [
            "id", "member", "milestone_type", "milestone_type_display", "custom_label", "status",
            "date", "place", "minister_name", "notes", "supporting_document", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["recorded_by"] = request.user
        return super().create(validated_data)


class MemberListSerializer(serializers.ModelSerializer):
    jumuia_name = serializers.CharField(source="jumuia.name", read_only=True)

    class Meta:
        model = Member
        fields = [
            "id", "member_no", "full_name", "gender", "phone", "jumuia", "jumuia_name",
            "profile_photo", "date_joined_church", "is_active",
        ]


class MemberDetailSerializer(serializers.ModelSerializer):
    jumuia_name = serializers.CharField(source="jumuia.name", read_only=True)
    spiritual_records = SpiritualRecordSerializer(many=True, read_only=True)

    class Meta:
        model = Member
        fields = [
            "id", "member_no", "full_name", "gender", "date_of_birth", "phone", "email",
            "jumuia", "jumuia_name", "residential_address", "emergency_contact_name",
            "emergency_contact_phone", "profile_photo", "date_joined_church",
            "spiritual_records", "is_active", "created_at",
        ]


class MemberWriteSerializer(serializers.ModelSerializer):
    jumuia = serializers.PrimaryKeyRelatedField(queryset=Jumuia.objects.active(), required=False, allow_null=True)

    class Meta:
        model = Member
        fields = [
            "id", "full_name", "gender", "date_of_birth", "phone", "email", "jumuia",
            "residential_address", "emergency_contact_name", "emergency_contact_phone",
            "profile_photo", "date_joined_church",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user
        # Chairperson/Secretary can only ever register into their own Jumuia,
        # regardless of what the client sends.
        if user.jumuia_id and user.role in JUMUIA_SCOPED_ROLES:
            attrs["jumuia"] = user.jumuia
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        church = self.context["church"]

        if not validated_data.get("jumuia"):
            validated_data["jumuia"] = suggest_jumuia_for(church)
            if validated_data["jumuia"] is None:
                raise serializers.ValidationError(
                    {"jumuia": "No active Jumuia is available. Please create one first."}
                )

        validated_data["created_by"] = request.user
        validated_data["member_no"] = generate_member_no(church)
        return super().create(validated_data)
