from django.db import models


class TestUpload(models.Model):

    file = models.FileField(upload_to="core")