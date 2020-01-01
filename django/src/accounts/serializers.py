from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from django.contrib.auth import get_user_model

from django.core import exceptions
import django.contrib.auth.password_validation as validators

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

class PasswordEqualitySerializer(serializers.Serializer):
    password = serializers.CharField(required = True)
    password1 = serializers.CharField(required = True)
    def validate(self, data):
        if data.get('password') != data.get('password1'):
            raise serializers.ValidationError({
                'passwords': "Passwords don't match"
            })

        try:
            validators.validate_password(password=data.get('password'), user=get_user_model())
        except exceptions.ValidationError as e:
            errors = dict()
            errors['passwords'] = list(e.messages)
            raise serializers.ValidationError(errors)

        return super().validate(data)
        
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required = True, write_only=True)
    first_name = serializers.CharField(required = True, allow_blank=True)
    last_name = serializers.CharField(required = True, allow_blank=True)

    # this field is virtual i.e. doesn't exist in database
    password1 = serializers.CharField(required = True, write_only=True)

    # donot generate on api output
    role = serializers.SerializerMethodField()

    def get_role(self, user):
        return user.role

    def validate(self, data):
        if data.get('role') and data['role'] not in ['normal_user', 'user_manager', 'admin']:
            raise serializers.ValidationError(dict(role='role must be either normal_user, user_manager or admin'))

        password_equality_serializer = PasswordEqualitySerializer(data=data)
        if not password_equality_serializer.is_valid():
            raise serializers.ValidationError(password_equality_serializer.errors)

        # prevent sending to model part
        data.pop('password1')
        return super().validate(data)

    def create(self, validated_data):
        request = self.context['request']

        instance = self.Meta.model(**validated_data)

        # guest user can also create so we need to check for user
        if 'role' in request.data and request.data['role'] == 'user_manager':
            if request.user and request.user.is_superuser:
                if request.data['role'] == 'user_manager':
                    instance.is_user_manager = True
            else:
                print('how did this happen ?')

        password = validated_data.pop('password', None)
        instance.set_password(password)
        instance.save()
        return instance

    def update(self, user, validated_data):
        request = self.context['request']

        if 'role' not in request.data:
            request.data['role'] = 'normal_user'

        if request.user.is_superuser:
            user.is_user_manager = request.data['role'] == 'user_manager'

        user.username = validated_data['username']
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        password = validated_data['password']
        user.set_password(password)

        user.save()
        return user

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'first_name', 'last_name', 'password', 'password1', 'role')

# for update, when username changes token must also be changed
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField()

    def get_token(self, user):
        return jwt_encode_handler(jwt_payload_handler(user))

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'first_name', 'last_name', 'token', 'password', 'password1', 'role')

class ChangePasswordSerializer(PasswordEqualitySerializer):
    current_password = serializers.CharField(required = True)
    
    def validate_current_password(self, current_password):
        if not self.context['user'].check_password(current_password):
            raise serializers.ValidationError('Current password is wrong.')

        return current_password
    
    def validate(self, data):
        super().validate(data)
        # here, both passwords match
        password = data.get('password1')
        if password == data['current_password']:
            error = dict(passwords='Password is same as the old password.')
            raise serializers.ValidationError(error)
        return data

class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)
    password = serializers.CharField(required = True)
