import datetime

import pytest

from apps.jumuia.services.assignment import suggest_jumuia_for
from apps.accounts.models import User
from apps.core.constants import Roles
from apps.members.models import Member, MemberParticipation
from apps.members.utils import generate_member_no

pytestmark = pytest.mark.django_db


def test_generate_member_no_format_and_uniqueness(church):
    first = generate_member_no(church)
    second = generate_member_no(church)
    year = datetime.date.today().year
    assert first == f"TC-{year}-0001"
    assert second == f"TC-{year}-0002"


def test_least_loaded_strategy_picks_smallest_jumuia(church, jumuia_a, jumuia_b):
    Member.objects.create(full_name="M1", gender="MALE", jumuia=jumuia_a, member_no="TC-X-0001")
    Member.objects.create(full_name="M2", gender="MALE", jumuia=jumuia_a, member_no="TC-X-0002")

    suggestion = suggest_jumuia_for(church)

    assert suggestion.id == jumuia_b.id


def test_least_loaded_strategy_ignores_inactive_members(church, jumuia_a, jumuia_b):
    Member.objects.create(full_name="M1", gender="MALE", jumuia=jumuia_a, member_no="TC-X-0001")
    inactive = Member.objects.create(full_name="M2", gender="MALE", jumuia=jumuia_b, member_no="TC-X-0002")
    inactive.delete()  # soft delete

    suggestion = suggest_jumuia_for(church)

    assert suggestion.id == jumuia_b.id


def test_linked_member_can_read_only_its_own_profile(api_client, jumuia_a):
    member = Member.objects.create(full_name="Linked Member", gender="MALE", jumuia=jumuia_a, member_no="TC-X-1001")
    user = User.objects.create_user(
        email="linked@example.com", password="TestPass123!", first_name="Linked", role=Roles.MEMBER, member=member
    )
    api_client.force_authenticate(user=user)

    response = api_client.get("/api/v1/members/me/")

    assert response.status_code == 200
    assert response.data["id"] == str(member.id)
    assert response.data["full_name"] == member.full_name


def test_unlinked_member_account_cannot_read_member_profile(api_client):
    user = User.objects.create_user(
        email="unlinked@example.com", password="TestPass123!", first_name="Unlinked", role=Roles.MEMBER
    )
    api_client.force_authenticate(user=user)

    response = api_client.get("/api/v1/members/me/")

    assert response.status_code == 404


def test_participation_records_are_jumuia_scoped(api_client, chairperson_a, jumuia_a, jumuia_b):
    own_member = Member.objects.create(full_name="Own Member", gender="MALE", jumuia=jumuia_a, member_no="TC-X-1002")
    other_member = Member.objects.create(full_name="Other Member", gender="FEMALE", jumuia=jumuia_b, member_no="TC-X-1003")
    api_client.force_authenticate(user=chairperson_a)

    own_response = api_client.post(
        "/api/v1/participation-records/",
        {
            "member": str(own_member.id),
            "category": "JUMUIA_MEETING",
            "activity_name": "Weekly meeting",
            "date": "2026-10-15",
        },
    )
    other_response = api_client.post(
        "/api/v1/participation-records/",
        {
            "member": str(other_member.id),
            "category": "EVENT",
            "activity_name": "Church gathering",
            "date": "2026-10-15",
        },
    )
    list_response = api_client.get("/api/v1/participation-records/")

    assert own_response.status_code == 201
    assert other_response.status_code == 400
    assert list_response.data["count"] == 1
    assert MemberParticipation.objects.filter(member=own_member).count() == 1
    assert not MemberParticipation.objects.filter(member=other_member).exists()
