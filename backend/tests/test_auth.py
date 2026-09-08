import pytest
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.audit.models import AuditLog
from apps.core.constants import Roles

pytestmark = pytest.mark.django_db


def test_login_success_sets_httponly_refresh_cookie(super_admin):
    client = APIClient()
    response = client.post("/api/v1/auth/login/", {"email": super_admin.email, "password": "TestPass123!"})
    assert response.status_code == 200
    assert "access" in response.data
    assert "cmsa_refresh_token" in response.cookies
    assert response.cookies["cmsa_refresh_token"]["httponly"]


def test_login_wrong_password_rejected(super_admin):
    client = APIClient()
    response = client.post("/api/v1/auth/login/", {"email": super_admin.email, "password": "wrong"})
    assert response.status_code == 401


def test_disabled_account_cannot_login(super_admin):
    """Disabled (soft-deleted) accounts are rejected by Django's ModelBackend
    itself before reaching our view, so this surfaces as 401 like any other
    bad-credentials case (not a distinct 403/400) — deliberately avoids
    revealing account existence/state to an unauthenticated caller."""
    super_admin.is_active = False
    super_admin.save(update_fields=["is_active"])
    client = APIClient()
    response = client.post("/api/v1/auth/login/", {"email": super_admin.email, "password": "TestPass123!"})
    assert response.status_code == 401


def test_no_public_registration_endpoint_exists():
    client = APIClient()
    response = client.post("/api/v1/auth/register/", {})
    assert response.status_code == 404


def test_creating_user_writes_audit_log(super_admin):
    client = APIClient()
    client.force_authenticate(user=super_admin)
    response = client.post(
        "/api/v1/users/",
        {"email": "new.staff@example.com", "first_name": "New", "role": Roles.CHURCH_ADMIN, "password": "SomePass123!"},
    )
    assert response.status_code == 201
    log = AuditLog.objects.filter(model_name="User", action="CREATE").latest("created_at")
    assert log.actor_id == super_admin.id


def test_church_admin_cannot_create_super_admin(super_admin):
    church_admin = User(email="churchadmin@example.com", first_name="Church", role=Roles.CHURCH_ADMIN)
    church_admin.set_password("TestPass123!")
    church_admin.save()

    client = APIClient()
    client.force_authenticate(user=church_admin)
    response = client.post(
        "/api/v1/users/",
        {"email": "sneaky@example.com", "first_name": "Sneaky", "role": Roles.SUPER_ADMIN, "password": "SomePass123!"},
    )
    assert response.status_code == 400
