from rest_framework.generics import RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny

from apps.core.permissions import IsChurchAdminOrAbove

from .models import Church
from .serializers import ChurchSettingsSerializer, PublicChurchInfoSerializer


class SingleChurchMixin:
    def get_object(self):
        church = Church.objects.active().first()
        if church is None:
            church = Church.objects.create(name="Church Name")
        return church


class ChurchSettingsView(SingleChurchMixin, RetrieveUpdateAPIView):
    serializer_class = ChurchSettingsSerializer
    permission_classes = [IsChurchAdminOrAbove]


class PublicChurchInfoView(SingleChurchMixin, RetrieveAPIView):
    serializer_class = PublicChurchInfoSerializer
    permission_classes = [AllowAny]
