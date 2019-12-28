from rest_framework import serializers
from django.contrib.auth import get_user_model

from django.core import exceptions

from rest_framework_jwt.settings import api_settings

import django.contrib.auth.password_validation as validators

class PasswordEqualitySerializer(serializers.Serializer):
    password1 = serializers.CharField()
    password2 = serializers.CharField()
    def validate(self, data):
        if data.get('password1') != data.get('password2'):
            raise serializers.ValidationError({
                'passwords': "Passwords don't match"
            })
        return super(self.__class__, self).validate(data)
        

class UserSerializer(serializers.ModelSerializer):

    # donot generate on api output
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
            validators.validate_password(password=password, user=get_user_model())

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['passwords'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(self.__class__, self).validate(data)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = get_user_model()
        fields = ('username', 'password')

