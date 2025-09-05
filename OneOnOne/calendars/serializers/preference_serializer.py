from rest_framework import serializers

from ..models.preference import Preference
from ..models.invitee import Invitee

class PreferenceSerializer(serializers.ModelSerializer):
    calendar = serializers.PrimaryKeyRelatedField(read_only=True)
    level = serializers.IntegerField()
    start = serializers.DateTimeField()
    invitee = serializers.PrimaryKeyRelatedField(queryset=Invitee.objects.all(), allow_null=True)

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        invitee = validated_data.get("invitee")

        if invitee is not None:
            if user.is_authenticated:
                raise serializers.ValidationError("Logged in users cannot create a preference with invitee field.")
        else:
            if not user.is_authenticated:
                raise serializers.ValidationError("Unauthenticated users must specify invitee field to create a preference.")
        
        return super().create(validated_data)

    class Meta:
        model = Preference
        fields = ["id", "calendar", "level", "start", "invitee"]

class PreferenceUpdateSerializer(serializers.ModelSerializer):
    calendar = serializers.PrimaryKeyRelatedField(read_only=True)
    level = serializers.IntegerField()
    start = serializers.DateTimeField()
    invitee = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Preference
        fields = ["calendar", "level", "start", "invitee"]
