import uuid

from django.db import models
from django.utils import timezone


class SoftDeleteQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def delete(self):
        """Bulk queryset delete soft-deletes instead of removing rows."""
        return self.update(is_active=False, deleted_at=timezone.now())

    def hard_delete(self):
        return super().delete()


class BaseModel(models.Model):
    """
    Abstract base for every domain model: UUID primary key, created/updated
    timestamps, and soft delete via is_active + deleted_at. AuditLog is the
    one deliberate exception (see apps.audit.models) since it must be an
    immutable, append-only log rather than a soft-deletable record.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteQuerySet.as_manager()

    class Meta:
        abstract = True

    # NOTE: intentionally no default `ordering` here. Django does not reliably
    # carry Meta options from an abstract base into a subclass that declares
    # its own Meta unless it explicitly subclasses `BaseModel.Meta` (and doing
    # so re-inherits `abstract = True`, a well-known footgun). Each concrete
    # model below sets its own explicit `ordering` instead.

    def delete(self, using=None, keep_parents=False, hard=False):
        if hard:
            return super().delete(using=using, keep_parents=keep_parents)
        self.is_active = False
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_active", "deleted_at"])
        return None
