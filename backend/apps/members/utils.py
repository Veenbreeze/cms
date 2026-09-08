from django.db import IntegrityError, transaction
from django.utils import timezone

from .models import MemberIdSequence


def generate_member_no(church):
    """
    Atomically increments (church, year) counter and formats
    `{short_name}-{year}-{seq:04d}`. Wrapped in its own atomic block with
    select_for_update so concurrent registrations never collide or skip.
    The one retry handles the narrow race where two requests both attempt to
    create the very first sequence row for a (church, year) at once.
    """
    year = timezone.now().year
    prefix = (church.short_name or "MBR").upper()

    for attempt in range(2):
        try:
            with transaction.atomic():
                sequence, _ = MemberIdSequence.objects.select_for_update().get_or_create(
                    church=church, year=year, defaults={"last_value": 0}
                )
                sequence.last_value += 1
                sequence.save(update_fields=["last_value"])
                seq_value = sequence.last_value
            break
        except IntegrityError:
            if attempt == 1:
                raise

    return f"{prefix}-{year}-{seq_value:04d}"
