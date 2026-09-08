from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny

from apps.core.permissions import IsStaffRoleOrReadOnly

from .filters import ChurchServantFilterSet
from .models import ChurchServant
from .serializers import ChurchServantSerializer, PublicChurchServantSerializer


def get_current_church():
    from apps.churches.models import Church

    church = Church.objects.active().first()
    if church is None:
        church = Church.objects.create(name="Church Name")
    return church


class ChurchServantViewSet(viewsets.ModelViewSet):
    queryset = ChurchServant.objects.active().select_related("jumuia", "member")
    serializer_class = ChurchServantSerializer
    permission_classes = [IsStaffRoleOrReadOnly]
    filterset_class = ChurchServantFilterSet
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["full_name", "position_title"]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["church"] = get_current_church()
        return context

    def perform_destroy(self, instance):
        instance.delete()


class PublicServantListView(ListAPIView):
    serializer_class = PublicChurchServantSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ChurchServant.objects.active().filter(church=get_current_church()).order_by("start_year")
