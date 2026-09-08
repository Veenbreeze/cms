import django_filters

from .models import Member


class MemberFilterSet(django_filters.FilterSet):
    class Meta:
        model = Member
        fields = ["jumuia", "gender"]
