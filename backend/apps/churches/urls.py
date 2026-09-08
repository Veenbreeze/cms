from django.urls import path

from .views import ChurchSettingsView, PublicChurchInfoView

urlpatterns = [
    path("church-settings/", ChurchSettingsView.as_view(), name="church-settings"),
    path("public/church-info/", PublicChurchInfoView.as_view(), name="public-church-info"),
]
