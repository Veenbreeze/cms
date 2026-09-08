from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Embeds role/jumuia in the JWT payload so the frontend can read them
    without an extra round trip, though `/auth/me/` remains the source of
    truth (the frontend should not trust decoded-token claims for anything
    permission-sensitive — only for optimistic UI)."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["jumuia_id"] = str(user.jumuia_id) if user.jumuia_id else None
        token["full_name"] = user.get_full_name()
        return token
