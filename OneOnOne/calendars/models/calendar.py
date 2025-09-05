from django.db import models
from django.conf import settings


class Calendar(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    finalized = models.BooleanField()
    duration = models.IntegerField()
    deadline = models.DateTimeField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
