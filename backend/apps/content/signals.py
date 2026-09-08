"""
Fans out in-app Notification rows when church-wide content is published, so
the Notifications module has real data instead of shipping an always-empty
inbox. Announcements notify on the transition into "published" (creation
with published_at already set, or a later edit that sets it); Events notify
once, on creation, since they have no draft/publish concept.
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.accounts.models import User
from apps.notifications.models import Notification

from .models import Announcement, Event


def _recipients_for(target_audience, target_jumuia_id, target_role):
    users = User.objects.filter(is_active=True)
    if target_audience == Announcement.Audience.JUMUIA:
        return users.filter(jumuia_id=target_jumuia_id) if target_jumuia_id else User.objects.none()
    if target_audience == Announcement.Audience.ROLE:
        return users.filter(role=target_role) if target_role else User.objects.none()
    return users


def _notify(title, body, target_audience, target_jumuia_id, target_role):
    recipients = _recipients_for(target_audience, target_jumuia_id, target_role)
    Notification.objects.bulk_create([Notification(recipient=user, title=title, body=body) for user in recipients])


@receiver(pre_save, sender=Announcement)
def capture_original_published_state(sender, instance, **kwargs):
    if not instance.pk:
        instance._was_published = False
        return
    try:
        instance._was_published = sender.objects.get(pk=instance.pk).published_at is not None
    except sender.DoesNotExist:
        instance._was_published = False


@receiver(post_save, sender=Announcement)
def notify_on_announcement_publish(sender, instance, created, **kwargs):
    was_published = getattr(instance, "_was_published", False)
    is_published = instance.published_at is not None
    if is_published and (created or not was_published):
        _notify(
            title=instance.title,
            body=instance.body[:200],
            target_audience=instance.target_audience,
            target_jumuia_id=instance.target_jumuia_id,
            target_role=instance.target_role,
        )


@receiver(post_save, sender=Event)
def notify_on_event_created(sender, instance, created, **kwargs):
    if not created:
        return
    _notify(
        title=f"Upcoming event: {instance.title}",
        body=instance.description[:200],
        target_audience=instance.target_audience,
        target_jumuia_id=instance.target_jumuia_id,
        target_role=instance.target_role,
    )
