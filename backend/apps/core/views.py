from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.constants import Gender, JUMUIA_SCOPED_ROLES, MilestoneStatus, MilestoneType
from apps.core.permissions import IsStaffRole
from apps.jumuia.models import Jumuia
from apps.members.models import Member, MemberSpiritualRecord


class DashboardStatsView(APIView):
    """
    Aggregate counts for the dashboard's stat cards. Automatically scoped to
    the requester's own Jumuia for Chairperson/Secretary, church-wide for
    Super Admin/Church Admin.
    """

    permission_classes = [IsStaffRole]

    def get(self, request):
        user = request.user
        members = Member.objects.active()
        jumuia_qs = Jumuia.objects.active()

        if not user.is_superuser and user.role in JUMUIA_SCOPED_ROLES:
            members = members.filter(jumuia_id=user.jumuia_id)
            jumuia_qs = jumuia_qs.filter(id=user.jumuia_id)

        start_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        def completed_milestone_count(milestone_type):
            return (
                MemberSpiritualRecord.objects.active()
                .filter(member__in=members, milestone_type=milestone_type, status=MilestoneStatus.COMPLETED)
                .values("member_id")
                .distinct()
                .count()
            )

        data = {
            "total_members": members.count(),
            "total_jumuia": jumuia_qs.count(),
            "male_members": members.filter(gender=Gender.MALE).count(),
            "female_members": members.filter(gender=Gender.FEMALE).count(),
            "new_members_this_month": members.filter(created_at__gte=start_of_month).count(),
            "baptized_members": completed_milestone_count(MilestoneType.BAPTISM),
            "confirmed_members": completed_milestone_count(MilestoneType.CONFIRMATION),
            "married_members": completed_milestone_count(MilestoneType.MARRIAGE),
        }
        return Response(data)
