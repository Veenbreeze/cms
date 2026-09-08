import django_filters

from .models import AuditLog


class AuditLogFilterSet(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name="created_at", lookup_expr="date__gte")
    date_to = django_filters.DateFilter(field_name="created_at", lookup_expr="date__lte")

    class Meta:
        model = AuditLog
        fields = ["model_name", "action", "actor", "date_from", "date_to"]
