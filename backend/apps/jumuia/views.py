from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from apps.core.permissions import IsChurchAdminOrAbove, IsStaffRole

from .models import Jumuia
from .permissions import JumuiaScopedQuerysetMixin
from .serializers import JumuiaListSerializer, JumuiaStatsSerializer, JumuiaWriteSerializer


def get_current_church():
    from apps.churches.models import Church

    church = Church.objects.active().first()
    if church is None:
        church = Church.objects.create(name="Church Name")
    return church


class JumuiaViewSet(JumuiaScopedQuerysetMixin, viewsets.ModelViewSet):
    """
    list/retrieve are scoped (a Chairperson/Secretary only sees their own
    Jumuia); create/update/deactivate require Church Admin or above.
    """

    jumuia_lookup = "id"
    permission_classes = [IsStaffRole]
    queryset = (
        Jumuia.objects.active()
        .annotate(member_count=Count("members", filter=Q(members__is_active=True)))
        .order_by("name")
    )

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return JumuiaWriteSerializer
        return JumuiaListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["church"] = get_current_church()
        return context

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy", "deactivate"):
            return [IsChurchAdminOrAbove()]
        return super().get_permissions()

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        jumuia = self.get_object()
        if jumuia.members.active().exists():
            raise ValidationError(
                {"detail": "This Jumuia still has active members. Reassign them to another Jumuia first."}
            )
        jumuia.delete()
        return Response(JumuiaListSerializer(jumuia).data)

    @action(detail=True, methods=["get"])
    def stats(self, request, pk=None):
        jumuia = self.get_object()
        return Response(JumuiaStatsSerializer(JumuiaStatsSerializer.build(jumuia)).data)
