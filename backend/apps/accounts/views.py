from datetime import timedelta

from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.core.permissions import IsChurchAdminOrAbove
from apps.members.models import Member

from .auth_serializers import CustomTokenObtainPairSerializer
from .models import User
from .serializers import (
    ChangePasswordSerializer,
    MeSerializer,
    MemberAccountOptionSerializer,
    UserSerializer,
    UserWriteSerializer,
)
from .throttles import LoginRateThrottle

REFRESH_COOKIE_PATH = "/api/v1/auth/"
REMEMBER_ME_REFRESH_LIFETIME = timedelta(days=30)


def _set_refresh_cookie(response, refresh_token, remember_me=False):
    lifetime = REMEMBER_ME_REFRESH_LIFETIME if remember_me else settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]
    response.set_cookie(
        key=settings.JWT_REFRESH_COOKIE_NAME,
        value=str(refresh_token),
        httponly=True,
        secure=settings.JWT_REFRESH_COOKIE_SECURE,
        samesite="Lax",
        max_age=int(lifetime.total_seconds()),
        path=REFRESH_COOKIE_PATH,
    )


class LoginView(GenericAPIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request):
        # Disabled accounts (is_active=False) never reach here: Django's
        # ModelBackend.authenticate() already rejects them, so SimpleJWT's
        # serializer raises AuthenticationFailed (401) during is_valid().
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data
        user = serializer.user

        remember_me = bool(request.data.get("remember_me"))
        refresh_token = RefreshToken(validated["refresh"])
        if remember_me:
            refresh_token.set_exp(lifetime=REMEMBER_ME_REFRESH_LIFETIME)
            refresh_token["remember_me"] = True

        response = Response(
            {"access": str(validated["access"]), "user": MeSerializer(user).data},
            status=status.HTTP_200_OK,
        )
        _set_refresh_cookie(response, refresh_token, remember_me=remember_me)
        return response


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)
        if not raw_refresh:
            return Response({"detail": "No refresh token found. Please log in again."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(raw_refresh)
            access = refresh.access_token
            remember_me = bool(refresh.get("remember_me", False))
            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS"):
                if settings.SIMPLE_JWT.get("BLACKLIST_AFTER_ROTATION"):
                    refresh.blacklist()
                new_refresh = RefreshToken.for_user(User.objects.get(id=refresh["user_id"]))
                if remember_me:
                    new_refresh.set_exp(lifetime=REMEMBER_ME_REFRESH_LIFETIME)
                    new_refresh["remember_me"] = True
            else:
                new_refresh = refresh
        except (TokenError, User.DoesNotExist):
            return Response({"detail": "Your session has expired. Please log in again."}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response({"access": str(access)}, status=status.HTTP_200_OK)
        _set_refresh_cookie(response, new_refresh, remember_me=remember_me)
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        raw_refresh = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)
        if raw_refresh:
            try:
                RefreshToken(raw_refresh).blacklist()
            except TokenError:
                pass
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(settings.JWT_REFRESH_COOKIE_NAME, path=REFRESH_COOKIE_PATH)
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(MeSerializer(request.user).data)


class ChangePasswordView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])
        return Response({"detail": "Password updated."}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    """Staff account management. No self-registration exists anywhere in the
    API — every account is created here by a Super Admin/Church Admin."""

    queryset = User.objects.select_related("jumuia", "member").all()
    permission_classes = [IsChurchAdminOrAbove]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return UserWriteSerializer
        return UserSerializer

    @action(detail=False, methods=["get"], url_path="available-members")
    def available_members(self, request):
        members = Member.objects.active().select_related("jumuia").filter(account__isnull=True)
        return Response(MemberAccountOptionSerializer(members, many=True).data)

    def perform_destroy(self, instance):
        # Soft delete via the standard DELETE verb too, not just /deactivate/
        instance.delete()

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        user = self.get_object()
        user.delete()
        return Response(UserSerializer(user).data)

    @action(detail=True, methods=["post"], url_path="reset-password")
    def reset_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get("new_password")
        if not new_password:
            raise ValidationError({"new_password": "This field is required."})
        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response({"detail": "Password reset."})
