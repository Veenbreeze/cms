from django.contrib import admin

from .models import ChurchServant


@admin.register(ChurchServant)
class ChurchServantAdmin(admin.ModelAdmin):
    list_display = ("full_name", "position_title", "start_year", "end_year")
    search_fields = ("full_name", "position_title")
    list_filter = ("position_title",)
