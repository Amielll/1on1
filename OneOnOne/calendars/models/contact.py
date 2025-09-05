from django.db import models
from django.conf import settings

class Contact(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)