from django.contrib import admin

from core import models as core_models


@admin.register(core_models.TestUpload)
class TestUploadAdmin(admin.ModelAdmin):
    pass