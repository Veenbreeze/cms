from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.churches.models import Church
from apps.core.constants import Roles
from apps.core.permissions import IsChurchAdminOrAbove, IsStaffRole
from apps.jumuia.permissions import JumuiaScopedQuerysetMixin
from apps.jumuia.serializers import JumuiaListSerializer
from apps.jumuia.services.assignment import suggest_jumuia_for

from .filters import MemberFilterSet
from .models import Member, MemberParticipation, MemberSpiritualRecord
from .serializers import (
    MemberDetailSerializer,
    MemberListSerializer,
    MemberParticipationSerializer,
    MemberSelfServiceSerializer,
    MemberWriteSerializer,
    SpiritualRecordSerializer,
)


def get_current_church():
    church = Church.objects.active().first()
    if church is None:
        church = Church.objects.create(name="Church Name")
    return church


class MemberViewSet(JumuiaScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Member.objects.active().select_related("jumuia").prefetch_related(
        Prefetch("spiritual_records", queryset=MemberSpiritualRecord.objects.active()),
        Prefetch("participation_records", queryset=MemberParticipation.objects.active()),
    )
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


class ParticipationRecordViewSet(JumuiaScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = MemberParticipation.objects.active().select_related("member", "member__jumuia", "recorded_by")
    serializer_class = MemberParticipationSerializer
    permission_classes = [IsStaffRole]
    filterset_fields = ["member", "category", "status", "date"]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["activity_name", "member__full_name"]
    jumuia_lookup = "member__jumuia"

    def perform_destroy(self, instance):
        instance.delete()


class MyMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != Roles.MEMBER:
            return Response({"detail": "This endpoint is available to Member accounts only."}, status=404)
        if not request.user.member_id:
            return Response({"detail": "No member record is linked to this account."}, status=404)
        member = Member.objects.active().select_related("jumuia").prefetch_related(
            Prefetch("spiritual_records", queryset=MemberSpiritualRecord.objects.active()),
            Prefetch("participation_records", queryset=MemberParticipation.objects.active()),
        ).filter(id=request.user.member_id).first()
        if member is None:
            return Response({"detail": "No active member record is linked to this account."}, status=404)
        return Response(MemberSelfServiceSerializer(member, context={"request": request}).data)
