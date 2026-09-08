from django.contrib import admin

from .models import Member, MemberSpiritualRecord


class MemberSpiritualRecordInline(admin.TabularInline):
    model = MemberSpiritualRecord
    extra = 0


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("full_name", "member_no", "gender", "jumuia", "phone", "is_active")
    search_fields = ("full_name", "member_no", "phone", "email")
    list_filter = ("jumuia", "gender", "is_active")
    readonly_fields = ("member_no",)
    inlines = [MemberSpiritualRecordInline]


@admin.register(MemberSpiritualRecord)
class MemberSpiritualRecordAdmin(admin.ModelAdmin):
    list_display = ("member", "milestone_type", "status", "date")
    list_filter = ("milestone_type", "status")
    search_fields = ("member__full_name",)
