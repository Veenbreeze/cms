import pytest

from apps.notifications.models import Notification

from .conftest import authed_client

pytestmark = pytest.mark.django_db


def test_announcement_targeted_at_jumuia_notifies_only_that_jumuia(chairperson_a, secretary_b):
    client = authed_client(chairperson_a)
    response = client.post(
        "/api/v1/announcements/",
        {
            "title": "Jumuia A meeting moved",
            "body": "New venue this week.",
            "target_audience": "JUMUIA",
            "target_jumuia": str(chairperson_a.jumuia_id),
            "published_at": "2026-09-01T08:00:00Z",
        },
    )
    assert response.status_code == 201

    assert Notification.objects.filter(recipient=chairperson_a).exists()
    assert not Notification.objects.filter(recipient=secretary_b).exists()


def test_mark_read_and_unread_count_are_scoped_to_requesting_user(chairperson_a, secretary_b):
    Notification.objects.create(recipient=chairperson_a, title="For A")
    Notification.objects.create(recipient=secretary_b, title="For B")

    client_a = authed_client(chairperson_a)
    unread = client_a.get("/api/v1/notifications/unread-count/")
    assert unread.data["unread_count"] == 1

    notification_a = Notification.objects.get(recipient=chairperson_a)
    mark_response = client_a.post(f"/api/v1/notifications/{notification_a.id}/mark-read/")
    assert mark_response.status_code == 200
    assert mark_response.data["is_read"] is True

    client_b = authed_client(secretary_b)
    unread_b = client_b.get("/api/v1/notifications/unread-count/")
    assert unread_b.data["unread_count"] == 1

    list_response = client_a.get("/api/v1/notifications/")
    assert list_response.data["count"] == 1
