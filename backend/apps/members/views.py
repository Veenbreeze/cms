from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from apps.churches.models import Church
from apps.core.permissions import IsChurchAdminOrAbove, IsStaffRole
from apps.jumuia.permissions import JumuiaScopedQuerysetMixin
from apps.jumuia.serializers import JumuiaListSerializer
from apps.jumuia.services.assignment import suggest_jumuia_for

from .filters import MemberFilterSet
from .models import Member, MemberSpiritualRecord
from .serializers import MemberDetailSerializer, MemberListSerializer, MemberWriteSerializer, SpiritualRecordSerializer


def get_current_church():
    church = Church.objects.active().first()
    if church is None:
        church = Church.objects.create(name="Church Name")
    return church


class MemberViewSet(JumuiaScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Member.objects.active().select_related("jumuia")
    permission_classes = [IsStaffRole]
    filterset_class = MemberFilterSet
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["full_name", "member_no", "phone"]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.action == "list":
            return MemberListSerializer
        if self.action == "retrieve":
            return MemberDetailSerializer
        return MemberWriteSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["church"] = get_current_church()
        return context

    def get_permissions(self):
        if self.action == "deactivate":
            return [IsChurchAdminOrAbove()]
        return super().get_permissions()

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        member = self.get_object()
        member.delete()
        return Response(MemberDetailSerializer(member).data)

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser])
    def photo(self, request, pk=None):
        member = self.get_object()
        serializer = MemberWriteSerializer(
            member, data={"profile_photo": request.FILES.get("profile_photo")}, partial=True, context=self.get_serializer_context()
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(MemberDetailSerializer(member).data)

    @action(detail=False, methods=["get"], url_path="suggest-jumuia")
    def suggest_jumuia(self, request):
        suggestion = suggest_jumuia_for(get_current_church())
        if suggestion is None:
            return Response({"detail": "No active Jumuia is available."}, status=404)
        return Response(JumuiaListSerializer(suggestion).data)


class SpiritualRecordViewSet(JumuiaScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = MemberSpiritualRecord.objects.active().select_related("member")
    serializer_class = SpiritualRecordSerializer
    permission_classes = [IsStaffRole]
    filterset_fields = ["member", "milestone_type"]
    jumuia_lookup = "member__jumuia"

    def perform_destroy(self, instance):
        instance.delete()
