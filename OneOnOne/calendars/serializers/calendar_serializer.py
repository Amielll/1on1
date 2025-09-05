from rest_framework import serializers

from ..models.calendar import Calendar


class CalendarSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    description = serializers.CharField()
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    finalized = serializers.BooleanField(default=False)
    duration = serializers.IntegerField()
    deadline = serializers.DateTimeField()

    class Meta:
        model = Calendar
        fields = ['id', 'name', 'description', 'owner', 'start_date', 'end_date', 'finalized', 'duration', 'deadline']
