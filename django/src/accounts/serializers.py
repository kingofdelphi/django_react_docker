from rest_framework import serializers
from django.contrib.auth import get_user_model

from django.core import exceptions
import django.contrib.auth.password_validation as validators

from .utils import get_user_role

class PasswordEqualitySerializer(serializers.Serializer):
    password1 = serializers.CharField(required = True)
    password2 = serializers.CharField(required = True)
    def validate(self, data):
        if data.get('password1') != data.get('password2'):
            raise serializers.ValidationError({
                'passwords': "Passwords don't match"
            })
        return super().validate(data)
        
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required = True, write_only=True)

    # donot generate on api output
    role = serializers.SerializerMethodField()

    def get_role(self, user):
        return get_user_role(user)

    def validate(self, data):
        if not data.get('username'):
            raise serializers.ValidationError(dict(username='This field is required.'))
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

        return super().validate(data)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, user, validated_data):
        password = validated_data['password']
        user.username = validated_data['username']
        if password:
            user.set_password(password)
        user.save()
        return user

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'password', 'role')


class ChangePasswordSerializer(PasswordEqualitySerializer):
    current_password = serializers.CharField(required = True)
    
    def validate_current_password(self, current_password):
        if not self.context['user'].check_password(current_password):
            raise serializers.ValidationError('Current password is wrong.')

        return current_password
    
    def validate(self, data):
        super().validate(data)
        password = data.get('password1')
        errors = []
        if password == data['current_password']:
            errors.append('Password is same as the old password.')
        try:
            validators.validate_password(password=password, user=get_user_model())
        except exceptions.ValidationError as e:
            errors = errors + list(e.messages)

        if errors:
            raise serializers.ValidationError(dict(passwords=errors))

        return data

class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)
    password = serializers.CharField(required = True)
