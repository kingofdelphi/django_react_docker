from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from django.contrib.auth import get_user_model

from django.core import exceptions
import django.contrib.auth.password_validation as validators

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

from .utils import get_user_role

class PasswordEqualitySerializer(serializers.Serializer):
    password = serializers.CharField(required = True)
    password1 = serializers.CharField(required = True)
    def validate(self, data):
        if data.get('password') != data.get('password1'):
            raise serializers.ValidationError({
                'passwords': "Passwords don't match"
            })
        return super().validate(data)
        
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required = True, write_only=True)

    # this field is virtual i.e. doesn't exist in database
    password1 = serializers.CharField(required = True, write_only=True)

    # donot generate on api output
    role = serializers.SerializerMethodField()

    def get_role(self, user):
        return get_user_role(user)

    def validate(self, data):
        password_equality_serializer = PasswordEqualitySerializer(
            data={
                'password': data.get('password'),
                'password1': data.get('password1'),
            }
        )
        data.pop('password1')
        password = data.get('password')
        if not password_equality_serializer.is_valid():
            raise serializers.ValidationError(password_equality_serializer.errors)

        try:
            # validate the password and catch the exception
            validators.validate_password(password=password, user=get_user_model())

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors = dict()
            errors['passwords'] = list(e.messages)
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
        fields = ('id', 'username', 'password', 'password1', 'role')

# for update, when username changes token must also be changed
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField()

    def get_token(self, user):
        return jwt_encode_handler(jwt_payload_handler(user))

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'token', 'password', 'password1', 'role')

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
