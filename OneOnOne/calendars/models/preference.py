from django.db import models

from .calendar import Calendar
from .invitee import Invitee

class Preference(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    level = models.IntegerField()
    start = models.DateTimeField()
    invitee = models.ForeignKey(Invitee, on_delete=models.CASCADE, null=True, blank=True)