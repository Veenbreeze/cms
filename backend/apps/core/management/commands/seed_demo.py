import secrets
import string

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import User
from apps.churches.models import Church
from apps.core.constants import Roles
from apps.jumuia.models import Jumuia

DEMO_JUMUIA_NAMES = ["Jumuia A", "Jumuia B", "Jumuia C", "Jumuia D"]


def _generate_password(length=14):
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


class Command(BaseCommand):
    help = (
        "Bootstraps a demo Church, four starter Jumuia, and one Super Admin "
        "account. This is the only way to get a first login, since there is "
        "no public self-registration. Safe to re-run — it skips anything "
        "that already exists."
    )

    def add_arguments(self, parser):
        parser.add_argument("--admin-email", default="admin@example.com")

    @transaction.atomic
    def handle(self, *args, **options):
        church, created = Church.objects.get_or_create(
            is_active=True,
            defaults={"name": "[Church Name]", "short_name": "CH", "default_language": "en"},
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f"Created church: {church.name}"))
        else:
            self.stdout.write(f"Using existing church: {church.name}")

        for name in DEMO_JUMUIA_NAMES:
            jumuia, jumuia_created = Jumuia.objects.get_or_create(
                church=church, name=name, defaults={"code": name.replace(" ", "").upper()}
            )
            if jumuia_created:
                self.stdout.write(self.style.SUCCESS(f"Created Jumuia: {jumuia.name}"))

        admin_email = options["admin_email"]
        if User.objects.filter(email=admin_email).exists():
            self.stdout.write(self.style.WARNING(f"Super Admin '{admin_email}' already exists — leaving it as is."))
            return

        password = _generate_password()
        User.objects.create_superuser(
            email=admin_email, password=password, first_name="Super", last_name="Admin", role=Roles.SUPER_ADMIN
        )

        self.stdout.write(self.style.SUCCESS("\nSuper Admin account created:"))
        self.stdout.write(f"  Email:    {admin_email}")
        self.stdout.write(f"  Password: {password}")
        self.stdout.write(self.style.WARNING("Store this password now — it will not be shown again. Change it after first login."))
