from rest_framework import serializers
from django.contrib.auth.models import User

from django.core import exceptions

from rest_framework_jwt.settings import api_settings

import django.contrib.auth.password_validation as validators


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username',)


# for creating user as well as logging him in
class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    # We need to implement this method as we have used a custom
    # serializer. It will pick up the validation config
    # from settings.py
    def validate(self, data):
        # here data has all the fields which have validated values
        # so we can create a User instance out of it
        user = self.Meta.model(**data)

        # get the password from the data
        password = data.get('password')

        errors = dict() 
        try:
            # validate the password and catch the exception
            validators.validate_password(password=password, user=User)

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(self.__class__, self).validate(data)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')

