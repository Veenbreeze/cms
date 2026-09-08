from django.contrib import admin

from .models import Church


@admin.register(Church)
class ChurchAdmin(admin.ModelAdmin):
    list_display = ("name", "short_name", "phone", "email", "default_language", "is_active")
    search_fields = ("name", "short_name")
