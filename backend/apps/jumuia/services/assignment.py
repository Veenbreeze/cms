"""
Configurable Jumuia auto-assignment. New strategies can be added to
STRATEGY_REGISTRY without touching call sites — the active one is picked
per-church via Church.jumuia_assignment_strategy (falls back to the
JUMUIA_ASSIGNMENT_STRATEGY setting), so a future Settings UI just needs a
dropdown bound to that field.
"""
from abc import ABC, abstractmethod

from django.conf import settings
from django.db.models import Count, Q

from .. import models as jumuia_models


class BaseAssignmentStrategy(ABC):
    @abstractmethod
    def suggest(self, church):
        """Return the Jumuia instance a new member should be assigned to, or None."""
        raise NotImplementedError


class LeastLoadedStrategy(BaseAssignmentStrategy):
    """Assigns the new member to whichever active Jumuia currently has the fewest active members."""

    def suggest(self, church):
        return (
            jumuia_models.Jumuia.objects.active()
            .filter(church=church)
            .annotate(member_count=Count("members", filter=Q(members__is_active=True)))
            .order_by("member_count", "name")
            .first()
        )


STRATEGY_REGISTRY = {
    "least_loaded": LeastLoadedStrategy,
}


def get_assignment_strategy(church=None):
    name = (church.jumuia_assignment_strategy if church else None) or settings.JUMUIA_ASSIGNMENT_STRATEGY
    strategy_cls = STRATEGY_REGISTRY.get(name, LeastLoadedStrategy)
    return strategy_cls()


def suggest_jumuia_for(church):
    return get_assignment_strategy(church).suggest(church)
