import pytest

from apps.members.models import Member

from .conftest import authed_client

pytestmark = pytest.mark.django_db


@pytest.fixture
def member_in_a(jumuia_a):
    return Member.objects.create(full_name="Member A", gender="FEMALE", jumuia=jumuia_a, member_no="TC-2026-0001")


@pytest.fixture
def member_in_b(jumuia_b):
    return Member.objects.create(full_name="Member B", gender="MALE", jumuia=jumuia_b, member_no="TC-2026-0002")


def test_chairperson_only_sees_own_jumuia_members(chairperson_a, member_in_a, member_in_b):
    client = authed_client(chairperson_a)
    response = client.get("/api/v1/members/")
    ids = [m["id"] for m in response.data["results"]]
    assert str(member_in_a.id) in ids
    assert str(member_in_b.id) not in ids


def test_chairperson_cannot_retrieve_other_jumuia_member_by_id(chairperson_a, member_in_b):
    client = authed_client(chairperson_a)
    response = client.get(f"/api/v1/members/{member_in_b.id}/")
    assert response.status_code == 404


def test_chairperson_can_retrieve_own_jumuia_member(chairperson_a, member_in_a):
    client = authed_client(chairperson_a)
    response = client.get(f"/api/v1/members/{member_in_a.id}/")
    assert response.status_code == 200


def test_secretary_registering_member_is_forced_into_own_jumuia(secretary_b, jumuia_a):
    """Even if the client sends a different jumuia, the server must override it."""
    client = authed_client(secretary_b)
    response = client.post("/api/v1/members/", {"full_name": "New Member", "gender": "MALE", "jumuia": str(jumuia_a.id)})
    assert response.status_code == 201
    created = Member.objects.get(id=response.data["id"])
    assert created.jumuia_id == secretary_b.jumuia_id


def test_super_admin_sees_all_members(super_admin, member_in_a, member_in_b):
    client = authed_client(super_admin)
    response = client.get("/api/v1/members/")
    assert response.data["count"] == 2


def test_chairperson_cannot_access_users_endpoint(chairperson_a):
    client = authed_client(chairperson_a)
    response = client.get("/api/v1/users/")
    assert response.status_code == 403


def test_chairperson_cannot_deactivate_member(chairperson_a, member_in_a):
    client = authed_client(chairperson_a)
    response = client.post(f"/api/v1/members/{member_in_a.id}/deactivate/")
    assert response.status_code == 403


def test_jumuia_scoping_also_applies_to_jumuia_list(chairperson_a, jumuia_a, jumuia_b):
    client = authed_client(chairperson_a)
    response = client.get("/api/v1/jumuia/")
    ids = [j["id"] for j in response.data["results"]]
    assert str(jumuia_a.id) in ids
    assert str(jumuia_b.id) not in ids
