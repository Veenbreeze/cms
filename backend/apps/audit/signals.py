import datetime
import decimal
import uuid

from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from apps.accounts.models import User
from apps.content.models import Announcement, Event, GalleryCategory, GalleryImage, Song, WeeklyLesson
from apps.core.constants import AuditAction
from apps.core.middleware import get_client_ip, get_current_request, get_current_user
from apps.jumuia.models import Jumuia
from apps.members.models import Member
from apps.servants.models import ChurchServant

from .models import AuditLog

TRACKED_MODELS = (
    User,
    Jumuia,
    Member,
    Announcement,
    WeeklyLesson,
    Song,
    GalleryCategory,
    GalleryImage,
    Event,
    ChurchServant,
)
EXCLUDED_FIELDS = {"password", "created_at", "updated_at", "deleted_at", "last_login"}


def _serializable(value):
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.isoformat()
    if isinstance(value, (uuid.UUID, decimal.Decimal)):
        return str(value)
    return str(value)


def _field_snapshot(instance):
    snapshot = {}
    for field in instance._meta.fields:
        if field.name in EXCLUDED_FIELDS:
            continue
        try:
            snapshot[field.name] = _serializable(getattr(instance, field.attname))
        except Exception:
            continue
    return snapshot


def _write_log(instance, action, changes=None):
    request = get_current_request()
    AuditLog.objects.create(
        actor=get_current_user(),
        action=action,
        model_name=instance.__class__.__name__,
        object_id=str(instance.pk),
        object_repr=str(instance)[:255],
        changes=changes,
        ip_address=get_client_ip(request) if request else None,
        user_agent=request.META.get("HTTP_USER_AGENT", "")[:255] if request else "",
    )


@receiver(pre_save, sender=User)
@receiver(pre_save, sender=Jumuia)
@receiver(pre_save, sender=Member)
@receiver(pre_save, sender=Announcement)
@receiver(pre_save, sender=WeeklyLesson)
@receiver(pre_save, sender=Song)
@receiver(pre_save, sender=GalleryCategory)
@receiver(pre_save, sender=GalleryImage)
@receiver(pre_save, sender=Event)
@receiver(pre_save, sender=ChurchServant)
def capture_original(sender, instance, **kwargs):
    """Stashes a pre-write field snapshot on the instance so post_save can diff it."""
    if not instance.pk:
        instance._audit_original = None
        return
    try:
        instance._audit_original = _field_snapshot(sender.objects.get(pk=instance.pk))
    except sender.DoesNotExist:
        instance._audit_original = None


@receiver(post_save, sender=User)
@receiver(post_save, sender=Jumuia)
@receiver(post_save, sender=Member)
@receiver(post_save, sender=Announcement)
@receiver(post_save, sender=WeeklyLesson)
@receiver(post_save, sender=Song)
@receiver(post_save, sender=GalleryCategory)
@receiver(post_save, sender=GalleryImage)
@receiver(post_save, sender=Event)
@receiver(post_save, sender=ChurchServant)
def log_save(sender, instance, created, **kwargs):
    if created:
        _write_log(instance, AuditAction.CREATE)
        return

    original = getattr(instance, "_audit_original", None)
    if original is None:
        return

    current = _field_snapshot(instance)
    diff = {key: [original.get(key), value] for key, value in current.items() if original.get(key) != value}
    if not diff:
        return

    # Soft-delete (is_active True -> False) is surfaced as DELETE, not UPDATE,
    # since that's the user-facing action a Church Admin actually performed.
    is_soft_delete = set(diff.keys()) == {"is_active"} and diff["is_active"] == [True, False]
    action = AuditAction.DELETE if is_soft_delete else AuditAction.UPDATE
    _write_log(instance, action, changes=diff)


@receiver(post_delete, sender=User)
@receiver(post_delete, sender=Jumuia)
@receiver(post_delete, sender=Member)
@receiver(post_delete, sender=Announcement)
@receiver(post_delete, sender=WeeklyLesson)
@receiver(post_delete, sender=Song)
@receiver(post_delete, sender=GalleryCategory)
@receiver(post_delete, sender=GalleryImage)
@receiver(post_delete, sender=Event)
@receiver(post_delete, sender=ChurchServant)
def log_hard_delete(sender, instance, **kwargs):
    """Covers the rare hard-delete path; the common soft-delete path is
    handled in log_save above since BaseModel.delete() is actually a save()."""
    _write_log(instance, AuditAction.DELETE)
