from django.contrib import admin

from .models import Jumuia


@admin.register(Jumuia)
class JumuiaAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "church", "meeting_day", "is_active")
    search_fields = ("name", "code")
    list_filter = ("church", "is_active")
