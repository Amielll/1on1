from ..models.contact import Contact
from django.contrib.auth.models import User
from rest_framework import serializers


class ContactSerializer(serializers.ModelSerializer):

    name = serializers.CharField()
    email = serializers.EmailField()
    owner = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'owner']