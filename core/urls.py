from django.urls import path
from . import apis as core_apis

from . import views as core_views

app_name = "core"

urlpatterns = [
    path('', core_views.intro_view, name='core_intro'),
    path("upload/file/", core_apis.receive_file, name="upload_file"),
]
