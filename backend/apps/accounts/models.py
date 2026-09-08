from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models

from apps.core.constants import JUMUIA_SCOPED_ROLES, Roles
from apps.core.models import BaseModel


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", Roles.MEMBER)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", Roles.SUPER_ADMIN)
        extra_fields["is_staff"] = True
        extra_fields["is_superuser"] = True
        return self._create_user(email, password, **extra_fields)


class User(BaseModel, AbstractBaseUser, PermissionsMixin):
    """
    Custom user model. There is deliberately no public self-registration
    endpoint — every account is created by a Super Admin/Church Admin (or a
    Secretary/Chairperson within their own Jumuia, if later delegated).
    `is_active` (from BaseModel) doubles as "account enabled/disabled".
    """

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.MEMBER, db_index=True)
    jumuia = models.ForeignKey(
        "jumuia.Jumuia", on_delete=models.SET_NULL, null=True, blank=True, related_name="staff_users"
    )
    is_staff = models.BooleanField(default=False, help_text="Required for Django admin access.")

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name"]

    class Meta:
        ordering = ["first_name", "last_name"]
        indexes = [models.Index(fields=["role"])]

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    def clean(self):
        super().clean()
        if self.role in JUMUIA_SCOPED_ROLES and not self.jumuia_id:
            raise ValidationError({"jumuia": "A Jumuia must be assigned for the Chairperson/Secretary role."})
