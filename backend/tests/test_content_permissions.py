import pytest

from apps.content.models import Announcement
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
