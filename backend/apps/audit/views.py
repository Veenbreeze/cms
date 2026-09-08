from rest_framework import viewsets

from apps.core.permissions import IsChurchAdminOrAbove

from .filters import AuditLogFilterSet
from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related("actor").all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsChurchAdminOrAbove]
    filterset_class = AuditLogFilterSet
