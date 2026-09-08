import pytest
from rest_framework.test import APIClient

from apps.churches.models import Church
from apps.core.constants import Roles
from apps.jumuia.models import Jumuia

pytestmark = pytest.mark.django_db


@pytest.fixture
def church():
    return Church.objects.create(name="Test Church", short_name="TC")


@pytest.fixture
def jumuia_a(church):
    return Jumuia.objects.create(church=church, name="Jumuia A", code="JA")


@pytest.fixture
def jumuia_b(church):
    return Jumuia.objects.create(church=church, name="Jumuia B", code="JB")


def _make_user(**kwargs):
    from apps.accounts.models import User

    kwargs.setdefault("password", "TestPass123!")
    password = kwargs.pop("password")
    user = User(**kwargs)
    user.set_password(password)
    user.save()
    return user


@pytest.fixture
def super_admin():
    return _make_user(email="super@example.com", first_name="Super", role=Roles.SUPER_ADMIN, is_staff=True, is_superuser=True)


@pytest.fixture
def chairperson_a(jumuia_a):
    return _make_user(email="chair.a@example.com", first_name="Chair A", role=Roles.CHAIRPERSON, jumuia=jumuia_a)


@pytest.fixture
def secretary_b(jumuia_b):
    return _make_user(email="sec.b@example.com", first_name="Sec B", role=Roles.SECRETARY, jumuia=jumuia_b)


@pytest.fixture
def api_client():
    return APIClient()


def authed_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client
