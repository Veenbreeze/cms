import pytest

from apps.content.models import Announcement, PrayerRequest
from apps.core.constants import Roles

from .conftest import _make_user, authed_client

pytestmark = pytest.mark.django_db


@pytest.fixture
def member_user():
    return _make_user(email="member@example.com", first_name="Plain", role=Roles.MEMBER)


def test_staff_can_create_announcement(chairperson_a):
    client = authed_client(chairperson_a)
    response = client.post("/api/v1/announcements/", {"title": "Choir practice", "body": "This Saturday at 4pm."})
    assert response.status_code == 201
    assert Announcement.objects.filter(title="Choir practice").exists()


def test_member_role_can_read_but_not_write_announcements(member_user, chairperson_a):
    staff_client = authed_client(chairperson_a)
    staff_client.post("/api/v1/announcements/", {"title": "Everyone welcome", "body": "Details here."})

    member_client = authed_client(member_user)
    list_response = member_client.get("/api/v1/announcements/")
    assert list_response.status_code == 200
    assert list_response.data["count"] == 1

    write_response = member_client.post("/api/v1/announcements/", {"title": "Not allowed", "body": "..."})
    assert write_response.status_code == 403


def test_unauthenticated_request_is_rejected(api_client):
    response = api_client.get("/api/v1/announcements/")
    assert response.status_code == 401


def test_public_visitor_can_submit_private_prayer_request(api_client):
    response = api_client.post(
        "/api/v1/prayer-requests/",
        {"name": "Visitor", "email": "visitor@example.com", "message": "Please pray for my family."},
    )

    assert response.status_code == 201
    assert not PrayerRequest.objects.get().submitted_by_id
    assert "internal_notes" not in response.data
    assert response.data["message"] == "Please pray for my family."


def test_member_can_only_read_own_prayer_requests(member_user, chairperson_a):
    own_request = PrayerRequest.objects.create(
        name="Plain", email=member_user.email, message="Please pray for me.", submitted_by=member_user
    )
    PrayerRequest.objects.create(
        name="Chair", email=chairperson_a.email, message="Private request.", submitted_by=chairperson_a
    )
    client = authed_client(member_user)

    response = client.get("/api/v1/prayer-requests/mine/")

    assert response.status_code == 200
    assert response.data["count"] == 1
    assert response.data["results"][0]["id"] == str(own_request.id)
    assert "internal_notes" not in response.data["results"][0]


def test_staff_cannot_access_prayer_request_admin_inbox(member_user):
    response = authed_client(member_user).get("/api/v1/prayer-requests/")

    assert response.status_code == 403


def test_church_admin_can_update_prayer_request_status_and_private_notes(super_admin):
    prayer_request = PrayerRequest.objects.create(name="Visitor", message="Please pray for my family.")
    client = authed_client(super_admin)

    response = client.patch(
        f"/api/v1/prayer-requests/{prayer_request.id}/",
        {"status": "PRAYING", "internal_notes": "Added to the prayer list."},
    )

    prayer_request.refresh_from_db()
    assert response.status_code == 200
    assert prayer_request.status == "PRAYING"
    assert prayer_request.internal_notes == "Added to the prayer list."
    assert "internal_notes" in response.data
