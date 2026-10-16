from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from apps.core.constants import JUMUIA_SCOPED_ROLES, Roles
from apps.members.models import Member

from .models import User


class UserSerializer(serializers.ModelSerializer):
    jumuia_name = serializers.CharField(source="jumuia.name", read_only=True, default=None)
    member_name = serializers.CharField(source="member.full_name", read_only=True, default=None)
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name", "full_name", "phone",
            "role", "jumuia", "jumuia_name", "member", "member_name", "is_active", "is_staff", "created_at",
        ]
        read_only_fields = ["id", "is_staff", "created_at"]


class UserWriteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    member = serializers.PrimaryKeyRelatedField(queryset=Member.objects.active(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "phone", "role", "jumuia", "member", "password"]
        read_only_fields = ["id"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance is None:
            self.fields["password"].required = True

    def validate_role(self, role):
        requester = self.context["request"].user
        if role == Roles.SUPER_ADMIN and not requester.is_superuser and requester.role != Roles.SUPER_ADMIN:
            raise serializers.ValidationError("Only a Super Admin can create another Super Admin account.")
        return role

    def validate_member(self, member):
        if member and User.objects.filter(member=member).exclude(pk=getattr(self.instance, "pk", None)).exists():
            raise serializers.ValidationError("This member is already linked to another account.")
        return member

    def validate(self, attrs):
        role = attrs.get("role", getattr(self.instance, "role", None))
        jumuia = attrs.get("jumuia", getattr(self.instance, "jumuia", None))
        if role in JUMUIA_SCOPED_ROLES and jumuia is None:
            raise serializers.ValidationError(
                {"jumuia": "A Jumuia must be assigned for the Chairperson/Secretary role."}
            )
        member = attrs.get("member", getattr(self.instance, "member", None))
        if member is not None and role != Roles.MEMBER:
            raise serializers.ValidationError({"member": "Only a Member account can be linked to a member record."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class MeSerializer(serializers.ModelSerializer):
    jumuia_name = serializers.CharField(source="jumuia.name", read_only=True, default=None)
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "full_name", "phone", "role", "jumuia", "jumuia_name"]
        read_only_fields = fields


class MemberAccountOptionSerializer(serializers.ModelSerializer):
    jumuia_name = serializers.CharField(source="jumuia.name", read_only=True)

    class Meta:
        model = Member
        fields = ["id", "member_no", "full_name", "jumuia_name"]
        read_only_fields = fields


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value
