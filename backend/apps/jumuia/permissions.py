from apps.core.constants import JUMUIA_SCOPED_ROLES


class JumuiaScopedQuerysetMixin:
    """
    Mixin for ViewSets whose queryset must be restricted to the requesting
    user's own Jumuia when they're a Chairperson/Secretary. Applied at the
    queryset level (not just a permission check) so retrieve/update/delete
    on an out-of-scope object ID returns 404 rather than leaking that the
    object exists via a 403.

    `jumuia_lookup` is the ORM path from the model to its Jumuia FK — "jumuia"
    for the Jumuia model itself, "jumuia" for Member too (both have a direct FK).
    """

    jumuia_lookup = "jumuia"

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user.role not in JUMUIA_SCOPED_ROLES:
            return queryset
        if not user.jumuia_id:
            return queryset.none()
        return queryset.filter(**{self.jumuia_lookup: user.jumuia_id})
