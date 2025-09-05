from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

  first_name = serializers.CharField()
  last_name = serializers.CharField()
  email = serializers.CharField()
  password = serializers.CharField(write_only=True)

  def create(self, validated_data):
    user = User.objects.create_user(
      email=validated_data['email'],
      username=validated_data['username'],
      password=validated_data['password'],
      first_name=validated_data['first_name'],
      last_name=validated_data['last_name']
    )
    return user

  class Meta:
    model = User
    fields = ['id', 'email', 'username', 'password', 'first_name', 'last_name']