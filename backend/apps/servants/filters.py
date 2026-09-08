import django_filters

from .models import ChurchServant


class ChurchServantFilterSet(django_filters.FilterSet):
    class Meta:
        model = ChurchServant
        fields = ["jumuia", "position_title", "start_year"]
