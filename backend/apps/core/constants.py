"""
Shared enums used across apps. Deliberately free of model imports so that any
app (including accounts, which the User model lives in) can import this
without creating circular dependencies.
"""
from django.db import models


class Roles(models.TextChoices):
    SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
    CHURCH_ADMIN = "CHURCH_ADMIN", "Church Admin"
    CHAIRPERSON = "CHAIRPERSON", "Chairperson"
    SECRETARY = "SECRETARY", "Secretary"
    MEMBER = "MEMBER", "Member"


# Roles that manage church operations and staff (as opposed to a plain MEMBER login)
STAFF_ROLES = (
    Roles.SUPER_ADMIN,
    Roles.CHURCH_ADMIN,
    Roles.CHAIRPERSON,
    Roles.SECRETARY,
)

# Roles whose data access is scoped to their assigned Jumuia only
JUMUIA_SCOPED_ROLES = (Roles.CHAIRPERSON, Roles.SECRETARY)

# Roles with full, church-wide administrative access
ADMIN_ROLES = (Roles.SUPER_ADMIN, Roles.CHURCH_ADMIN)


class Gender(models.TextChoices):
    MALE = "MALE", "Male"
    FEMALE = "FEMALE", "Female"
    OTHER = "OTHER", "Other"


class MilestoneType(models.TextChoices):
    BAPTISM = "BAPTISM", "Baptism"
    FIRST_COMMUNION = "FIRST_COMMUNION", "First Holy Communion"
    CONFIRMATION = "CONFIRMATION", "Confirmation"
    MARRIAGE = "MARRIAGE", "Church Marriage"
    OTHER = "OTHER", "Other"


class MilestoneStatus(models.TextChoices):
    SCHEDULED = "SCHEDULED", "Scheduled"
    COMPLETED = "COMPLETED", "Completed"


class AuditAction(models.TextChoices):
    CREATE = "CREATE", "Create"
    UPDATE = "UPDATE", "Update"
    DELETE = "DELETE", "Delete"
