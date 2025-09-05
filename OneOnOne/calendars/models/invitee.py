from django.db import models
from .calendar import Calendar
from .contact import Contact

class Invitee(models.Model):
  calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
  contact = models.ForeignKey(Contact, on_delete=models.CASCADE)