from rest_framework import serializers

from ..models.contact import Contact
from ..models.event import Event


class EventSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    description = serializers.CharField()
    calendar = serializers.PrimaryKeyRelatedField(read_only=True)
    date = serializers.DateField()
    start_time = serializers.TimeField()
    last_modified = serializers.DateTimeField()
    attendee = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all())

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'calendar', 'date', 'start_time', 'last_modified', 'attendee']
