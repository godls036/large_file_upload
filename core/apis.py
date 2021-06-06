import os

from django.core.files import File

from rest_framework.decorators import action, api_view
from rest_framework import status
from rest_framework.response import Response

from core import models as core_models


@api_view(["POST"])
def receive_file(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            file_name = request.FILES.get("file").name
            limit = request.data.get("limit")
            order = request.data.get("order")
            path = f"uploaded/{request.user.id}-{file_name}"
            chunk = request.FILES.get("file")
            print(f"{limit}: {order}-uploaded START")
            handle_uploaded_file(chunk, path)
            if limit == order:
                save_video(path, file_name)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


def handle_uploaded_file(f, path):
    with open(path, 'ab') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def save_video(path, file_name):
    with open(path, 'rb') as uploaded_file:
        uploaded_django_file = File(uploaded_file)
        new_file = core_models.TestUpload.objects.create()
        new_file.file.save(file_name, uploaded_django_file)
    remove_file(path)


def remove_file(path):
    if os.path.exists(path):
        os.remove(path)
        return True
    return False
