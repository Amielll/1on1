from django.contrib import admin
from .models.calendar import Calendar
from .models.event import Event
from .models.invitee import Invitee
from .models.preference import Preference
from .models.contact import Contact

# Register your models here.
admin.site.register(Calendar)
admin.site.register(Contact)
admin.site.register(Event)
admin.site.register(Invitee)
admin.site.register(Preference)
