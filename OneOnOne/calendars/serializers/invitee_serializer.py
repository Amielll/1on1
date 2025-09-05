from rest_framework import serializers
from ..models.invitee import Invitee
from ..models.calendar import Calendar
from ..models.contact import Contact

class InviteeSerializer(serializers.ModelSerializer):
    calendar = serializers.PrimaryKeyRelatedField(read_only=True)
    contact = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all())

    class Meta:
        model = Invitee
        fields = ['id', 'calendar', 'contact']