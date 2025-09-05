from django.db import models
from .calendar import Calendar
from .contact import Contact


class Event(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    last_modified = models.DateTimeField()
    attendee = models.ForeignKey(Contact, on_delete=models.CASCADE)
