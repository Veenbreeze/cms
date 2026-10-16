from rest_framework import serializers

from apps.core.constants import JUMUIA_SCOPED_ROLES
from apps.jumuia.models import Jumuia
from apps.jumuia.services.assignment import suggest_jumuia_for

from .models import Member, MemberParticipation, MemberSpiritualRecord
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


class MemberParticipationSerializer(serializers.ModelSerializer):
    member = serializers.PrimaryKeyRelatedField(queryset=Member.objects.active())
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    member_name = serializers.CharField(source="member.full_name", read_only=True)

    class Meta:
        model = MemberParticipation
        fields = [
            "id", "member", "member_name", "category", "category_display", "activity_name",
            "date", "status", "status_display", "notes", "recorded_by", "created_at",
        ]
        read_only_fields = ["id", "recorded_by", "created_at"]

    def validate_member(self, member):
        request = self.context.get("request")
        if request and request.user.role in JUMUIA_SCOPED_ROLES and member.jumuia_id != request.user.jumuia_id:
            raise serializers.ValidationError("You can only record participation for members in your Jumuia.")
        return member

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["recorded_by"] = request.user
        return super().create(validated_data)


class MemberDetailSerializer(serializers.ModelSerializer):
    jumuia_name = serializers.CharField(source="jumuia.name", read_only=True)
    spiritual_records = SpiritualRecordSerializer(many=True, read_only=True)
    participation_records = MemberParticipationSerializer(many=True, read_only=True)

    class Meta:
        model = Member
        fields = [
            "id", "member_no", "full_name", "gender", "date_of_birth", "phone", "email",
            "jumuia", "jumuia_name", "residential_address", "emergency_contact_name",
            "emergency_contact_phone", "profile_photo", "date_joined_church",
            "spiritual_records", "participation_records", "is_active", "created_at",
        ]


class MemberSelfSpiritualRecordSerializer(serializers.ModelSerializer):
    milestone_type_display = serializers.CharField(source="get_milestone_type_display", read_only=True)

    class Meta:
        model = MemberSpiritualRecord
        fields = ["id", "milestone_type", "milestone_type_display", "custom_label", "status", "date"]


class MemberSelfParticipationSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = MemberParticipation
        fields = ["id", "category", "category_display", "activity_name", "date", "status", "status_display"]


class MemberSelfServiceSerializer(serializers.ModelSerializer):
    jumuia_name = serializers.CharField(source="jumuia.name", read_only=True)
    spiritual_records = MemberSelfSpiritualRecordSerializer(many=True, read_only=True)
    participation_records = MemberSelfParticipationSerializer(many=True, read_only=True)

    class Meta:
        model = Member
        fields = [
            "id", "member_no", "full_name", "gender", "jumuia_name", "profile_photo",
            "date_joined_church", "spiritual_records", "participation_records",
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
