from rest_framework.permissions import SAFE_METHODS, BasePermission

from apps.core.constants import STAFF_ROLES, Roles


class RoleInPermission(BasePermission):
    """
    Base class for role-gated permissions. Subclass and set `allowed_roles`.
    Superusers (created via createsuperuser) always pass, so Django admin
    access never gets locked out by an app-level role check.
    """

    allowed_roles = ()
    message = "You don't have permission to do that."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.is_superuser:
            return True
        return user.role in self.allowed_roles


class IsSuperAdmin(RoleInPermission):
    allowed_roles = (Roles.SUPER_ADMIN,)


class IsChurchAdminOrAbove(RoleInPermission):
    allowed_roles = (Roles.SUPER_ADMIN, Roles.CHURCH_ADMIN)


class IsStaffRole(RoleInPermission):
    """Any role that manages church operations (excludes plain MEMBER)."""

    allowed_roles = (Roles.SUPER_ADMIN, Roles.CHURCH_ADMIN, Roles.CHAIRPERSON, Roles.SECRETARY)


class IsStaffRoleOrReadOnly(BasePermission):
    """
    Content that every logged-in role (including MEMBER) can read, but only
    staff roles can create/update/delete — for church content modules
    (announcements, events, gallery, etc.) that members consume but don't manage.
    """

    message = "You don't have permission to do that."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        if user.is_superuser:
            return True
        return user.role in STAFF_ROLES
