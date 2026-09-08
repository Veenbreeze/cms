import datetime

import pytest

from apps.jumuia.services.assignment import suggest_jumuia_for
from apps.members.models import Member
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
